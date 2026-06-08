import { getProductBySlug } from "@/data/products";
import type { StoredOrder } from "@/lib/order-history";

export type OrderFulfillmentType = "in_stock" | "made_to_order";

export function orderFulfillmentType(
  order: Pick<StoredOrder, "lines">,
): OrderFulfillmentType {
  const made = order.lines.some((line) => {
    const p = getProductBySlug(line.slug);
    return p?.stock === "on_order" && p?.category === "material";
  });
  return made ? "made_to_order" : "in_stock";
}

export type DisplayOrderStatus =
  | "NEW"
  | "CONFIRMED"
  | "PRODUCTION"
  | "PACKING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

export function normalizeOrderStatus(
  raw: StoredOrder["status"],
): DisplayOrderStatus {
  if (
    raw === "CONFIRMED" ||
    raw === "PRODUCTION" ||
    raw === "PACKING" ||
    raw === "SHIPPED" ||
    raw === "DELIVERED" ||
    raw === "CANCELLED"
  ) {
    return raw;
  }
  return "NEW";
}

export function orderStatusChain(
  type: OrderFulfillmentType,
): DisplayOrderStatus[] {
  if (type === "made_to_order") {
    return [
      "NEW",
      "CONFIRMED",
      "PRODUCTION",
      "PACKING",
      "SHIPPED",
      "DELIVERED",
    ];
  }
  return ["NEW", "CONFIRMED", "SHIPPED", "DELIVERED"];
}
