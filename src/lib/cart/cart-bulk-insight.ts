import type { CartLine } from "@/contexts/CartContext";
import { products } from "@/data/products";
import { getBulkMilestone } from "@/lib/cart/bulk-progress";

export type CartBulkInsight = { kgToNext: number; nextQty: number };

export function getCartBulkInsight(lines: CartLine[]): CartBulkInsight | null {
  let best: CartBulkInsight | null = null;
  for (const line of lines) {
    const product = products.find((p) => p.sku === line.sku);
    if (!product) continue;
    const milestone = getBulkMilestone(product, line.qtyKg);
    if (!milestone) continue;
    const kgToNext = milestone.nextQty - line.qtyKg;
    if (kgToNext <= 0) continue;
    if (!best || kgToNext < best.kgToNext) best = { kgToNext, nextQty: milestone.nextQty };
  }
  return best;
}
