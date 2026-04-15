/** Лимиты и проверки для POST /api/orders (защита от мусора и злоупотреблений) */

import { getProductBySlug } from "@/data/products";
import { getPricePerKgForQty } from "@/lib/pricing";

export const MAX_ORDER_LINES = 60;
export const MAX_TOTAL_UZ = 500_000_000;
export const MAX_QTY_KG = 5_000;
export const MAX_LINE_TOTAL_UZ = 200_000_000;
export const MIN_PREORDER_QTY_KG = 100;
export const MAX_PHONE_CHARS = 48;
export const MAX_NAME_CHARS = 200;
export const MAX_ADDRESS_CHARS = 600;
export const MAX_SKU_CHARS = 80;
export const MAX_SLUG_CHARS = 160;
export const MAX_LINE_NAME_CHARS = 240;

const ALLOWED_PAY = new Set([
  "telegram",
  "uzcard",
  "humo",
  "payme",
  "click",
  "invoice",
  "cod",
]);
const ALLOWED_SHIP = new Set(["courier", "pickup"]);

/** Как в корзине: шаг 0,5 кг, минимум 0,5 */
const QTY_STEP_KG = 0.5;
const MIN_QTY_KG = 0.5;

/** Допуск по сумам между клиентом и пересчётом по каталогу (округление) */
const LINE_TOTAL_UZ_EPS = 2;
const ORDER_TOTAL_UZ_EPS = 2;

function isValidQtyKg(qtyKg: number): boolean {
  if (!Number.isFinite(qtyKg) || qtyKg < MIN_QTY_KG || qtyKg > MAX_QTY_KG) {
    return false;
  }
  const steps = Math.round(qtyKg / QTY_STEP_KG);
  return Math.abs(qtyKg - steps * QTY_STEP_KG) < 1e-6;
}

export type OrderLineInput = {
  sku: string;
  slug: string;
  name: string;
  qtyKg: number;
  lineTotalUz: number;
};

export type CreateOrderBody = {
  totalUz: number;
  lines: OrderLineInput[];
  pay: string;
  ship: string;
  customerName: string;
  phone: string;
  address?: string;
};

function trimLen(s: string, max: number): boolean {
  return s.length <= max;
}

/** Возвращает текст ошибки для JSON или null, если всё ок */
export function validateCreateOrderBody(raw: unknown): CreateOrderBody | string {
  if (typeof raw !== "object" || raw === null) return "Invalid payload";
  const b = raw as Record<string, unknown>;

  const totalUz = b.totalUz;
  const lines = b.lines;
  const pay = b.pay;
  const ship = b.ship;
  const customerName = b.customerName;
  const phone = b.phone;
  const address = b.address;

  if (
    typeof totalUz !== "number" ||
    !Number.isFinite(totalUz) ||
    totalUz < 0 ||
    totalUz > MAX_TOTAL_UZ
  ) {
    return "Invalid payload";
  }

  if (!Array.isArray(lines) || lines.length === 0 || lines.length > MAX_ORDER_LINES) {
    return "Invalid payload";
  }

  if (typeof pay !== "string" || !ALLOWED_PAY.has(pay)) return "Invalid pay method";
  if (typeof ship !== "string" || !ALLOWED_SHIP.has(ship)) return "Invalid shipping";

  if (typeof customerName !== "string" || !customerName.trim()) return "Invalid payload";
  if (!trimLen(customerName.trim(), MAX_NAME_CHARS)) return "Invalid payload";

  if (typeof phone !== "string" || !phone.trim()) return "Invalid payload";

  if (address != null && typeof address !== "string") return "Invalid payload";
  const addrStr = typeof address === "string" ? address.trim() : "";
  if (!trimLen(addrStr, MAX_ADDRESS_CHARS)) return "Invalid payload";

  const outLines: OrderLineInput[] = [];
  for (const item of lines) {
    if (typeof item !== "object" || item === null) return "Invalid line";
    const l = item as Record<string, unknown>;
    if (
      typeof l.sku !== "string" ||
      typeof l.slug !== "string" ||
      typeof l.name !== "string" ||
      typeof l.qtyKg !== "number" ||
      !Number.isFinite(l.qtyKg) ||
      typeof l.lineTotalUz !== "number" ||
      !Number.isFinite(l.lineTotalUz)
    ) {
      return "Invalid line";
    }
    if (!isValidQtyKg(l.qtyKg)) return "Invalid line";
    if (l.lineTotalUz < 0 || l.lineTotalUz > MAX_LINE_TOTAL_UZ) return "Invalid line";
    if (
      !trimLen(l.sku, MAX_SKU_CHARS) ||
      !trimLen(l.slug, MAX_SLUG_CHARS) ||
      !trimLen(l.name, MAX_LINE_NAME_CHARS)
    ) {
      return "Invalid line";
    }
    outLines.push({
      sku: l.sku,
      slug: l.slug,
      name: l.name,
      qtyKg: l.qtyKg,
      lineTotalUz: l.lineTotalUz,
    });
  }

  return {
    totalUz,
    lines: outLines,
    pay,
    ship,
    customerName: customerName.trim(),
    phone,
    address: addrStr,
  };
}

/**
 * Серверный пересчёт цен по каталогу — защита от подмены сумм в JSON.
 * Должно совпадать с логикой `CartContext` / `getPricePerKgForQty`.
 */
export function validateOrderAgainstCatalog(data: CreateOrderBody): true | string {
  let sumLineTotals = 0;
  for (const line of data.lines) {
    const p = getProductBySlug(line.slug);
    if (!p) return "Invalid product";
    if (p.sku !== line.sku) return "SKU mismatch";
    if (p.stock === "on_order" && p.category === "material" && line.qtyKg < MIN_PREORDER_QTY_KG) {
      return "Minimum preorder quantity is 100 kg";
    }
    const expected = Math.round(
      getPricePerKgForQty(p, line.qtyKg) * line.qtyKg,
    );
    if (Math.abs(expected - line.lineTotalUz) > LINE_TOTAL_UZ_EPS) {
      return "Line total mismatch";
    }
    sumLineTotals += line.lineTotalUz;
  }
  if (Math.abs(sumLineTotals - data.totalUz) > ORDER_TOTAL_UZ_EPS) {
    return "Order total mismatch";
  }
  return true;
}
