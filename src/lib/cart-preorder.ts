import { getProductBySlug } from "@/data/products";
import { MIN_PREORDER_QTY_KG } from "@/lib/orders-api";

type LineLike = { slug: string; qtyKg: number };

/** true, если есть материал под заказ с количеством ниже серверного минимума */
export function cartHasInvalidPreorder(lines: LineLike[]): boolean {
  for (const line of lines) {
    const p = getProductBySlug(line.slug);
    if (
      p &&
      p.stock === "on_order" &&
      p.category === "material" &&
      line.qtyKg < MIN_PREORDER_QTY_KG
    ) {
      return true;
    }
  }
  return false;
}
