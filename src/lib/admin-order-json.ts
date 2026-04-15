import type { Order, OrderLine } from "@prisma/client";

/** Единый формат заказа для CRM / admin API. */
export function orderToJson(o: Order & { lines: OrderLine[] }) {
  return {
    /** Источник данных для внешней CRM (мульти-сайт, миграции). */
    source: "btt-site" as const,
    id: o.id,
    createdAt: o.createdAt.toISOString(),
    updatedAt: o.updatedAt.toISOString(),
    totalUz: o.totalUz,
    status: o.status,
    statusUpdatedAt: o.statusUpdatedAt.toISOString(),
    statusNote: o.statusNote ?? "",
    paymentStatus: o.paymentStatus,
    paymentStatusUpdatedAt: o.paymentStatusUpdatedAt.toISOString(),
    paymentProvider: o.paymentProvider ?? "",
    paymentReference: o.paymentReference ?? "",
    paymentUrl: o.paymentUrl ?? "",
    paymentRequestedAt: o.paymentRequestedAt?.toISOString() ?? "",
    paidAt: o.paidAt?.toISOString() ?? "",
    trackingProvider: o.trackingProvider ?? "",
    trackingNumber: o.trackingNumber ?? "",
    trackingUrl: o.trackingUrl ?? "",
    pay: o.pay,
    ship: o.ship,
    customerName: o.customerName,
    phone: o.phone,
    address: o.address ?? "",
    lines: o.lines.map((l) => ({
      sku: l.sku,
      slug: l.slug,
      name: l.name,
      qtyKg: l.qtyKg,
      lineTotalUz: l.lineTotalUz,
    })),
  };
}
