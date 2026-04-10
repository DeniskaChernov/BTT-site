import type { Order, OrderLine } from "@prisma/client";

/** Единый формат заказа для CRM / admin API. */
export function orderToJson(o: Order & { lines: OrderLine[] }) {
  return {
    id: o.id,
    createdAt: o.createdAt.toISOString(),
    totalUz: o.totalUz,
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
