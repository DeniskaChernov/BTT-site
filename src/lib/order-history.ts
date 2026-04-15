/** История заказов в браузере; при успешном POST /api/orders подставляются id и createdAt с сервера */

export const ORDERS_STORAGE_KEY = "btt-orders";
const MAX_ORDERS = 80;

export type StoredOrderLine = {
  sku: string;
  slug: string;
  name: string;
  qtyKg: number;
  lineTotalUz: number;
};

export type StoredOrder = {
  id: string;
  createdAt: string;
  updatedAt?: string;
  totalUz: number;
  status?: "NEW" | "CONFIRMED" | "PACKING" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  statusUpdatedAt?: string;
  statusNote?: string;
  paymentStatus?: "PENDING" | "REQUIRES_ACTION" | "PAID" | "FAILED" | "REFUNDED" | "PARTIALLY_REFUNDED";
  paymentStatusUpdatedAt?: string;
  paymentProvider?: string;
  paymentReference?: string;
  paymentUrl?: string;
  paymentRequestedAt?: string;
  paidAt?: string;
  trackingProvider?: string;
  trackingNumber?: string;
  trackingUrl?: string;
  lines: StoredOrderLine[];
  pay: string;
  ship: "courier" | "pickup";
  customerName: string;
  phone: string;
  address: string;
};

function isOrderLine(x: unknown): x is StoredOrderLine {
  if (typeof x !== "object" || x === null) return false;
  const o = x as Record<string, unknown>;
  return (
    typeof o.sku === "string" &&
    typeof o.slug === "string" &&
    typeof o.name === "string" &&
    typeof o.qtyKg === "number" &&
    Number.isFinite(o.qtyKg) &&
    typeof o.lineTotalUz === "number" &&
    Number.isFinite(o.lineTotalUz)
  );
}

function isOrder(x: unknown): x is StoredOrder {
  if (typeof x !== "object" || x === null) return false;
  const o = x as Record<string, unknown>;
  if (
    typeof o.id !== "string" ||
    typeof o.createdAt !== "string" ||
    typeof o.totalUz !== "number" ||
    !Array.isArray(o.lines) ||
    typeof o.pay !== "string" ||
    (o.ship !== "courier" && o.ship !== "pickup") ||
    typeof o.customerName !== "string" ||
    typeof o.phone !== "string" ||
    typeof o.address !== "string"
  ) {
    return false;
  }
  return o.lines.every(isOrderLine);
}

export function readOrders(): StoredOrder[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(ORDERS_STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isOrder).sort((a, b) => {
      const ta = Date.parse(a.createdAt);
      const tb = Date.parse(b.createdAt);
      return (Number.isFinite(tb) ? tb : 0) - (Number.isFinite(ta) ? ta : 0);
    });
  } catch {
    return [];
  }
}

export type AppendOrderInput = Omit<StoredOrder, "id" | "createdAt">;

/** Если передан `server`, id/время берутся из ответа API (совпадают с PostgreSQL). */
export function appendOrder(
  data: AppendOrderInput,
  server?: { id: string; createdAt: string },
): StoredOrder {
  const order: StoredOrder = {
    ...data,
    id:
      server?.id ??
      (typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `ord-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`),
    createdAt: server?.createdAt ?? new Date().toISOString(),
    updatedAt: server?.createdAt ?? new Date().toISOString(),
    status: "NEW",
    statusUpdatedAt: server?.createdAt ?? new Date().toISOString(),
    statusNote: "",
    paymentStatus: "PENDING",
    paymentStatusUpdatedAt: server?.createdAt ?? new Date().toISOString(),
    paymentProvider: "",
    paymentReference: "",
    paymentUrl: "",
    paymentRequestedAt: "",
    paidAt: "",
    trackingProvider: "",
    trackingNumber: "",
    trackingUrl: "",
  };

  if (typeof window === "undefined") return order;

  try {
    const prev = readOrders();
    const next = [order, ...prev].slice(0, MAX_ORDERS);
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(next));
    window.dispatchEvent(new Event("btt-orders-changed"));
  } catch {
    /* ignore quota */
  }

  return order;
}
