import { getProductBySlug } from "@/data/products";
import { getBulkMilestone } from "@/lib/cart/bulk-progress";
import { getPricePerKgForQty, isPricedPerKg } from "@/lib/pricing";
import type { CartLine } from "@/contexts/CartContext";

export type CartOptimizationHint = {
  sku: string;
  slug: string;
  name: string;
  currentQty: number;
  suggestQty: number;
  saveUz: number;
};

export function suggestCartOptimizations(lines: CartLine[]): CartOptimizationHint[] {
  const hints: CartOptimizationHint[] = [];

  for (const line of lines) {
    const p = getProductBySlug(line.slug);
    if (!p || !isPricedPerKg(p) || p.category !== "material") continue;

    const milestone = getBulkMilestone(p, line.qtyKg);
    if (!milestone || milestone.progress < 0.35) continue;

    const suggestQty = milestone.nextQty;
    const perUnitNow = getPricePerKgForQty(p, line.qtyKg);
    const perUnitNext = getPricePerKgForQty(p, suggestQty);
    const saveUz = Math.round((perUnitNow - perUnitNext) * line.qtyKg);
    if (saveUz <= 0) continue;

    hints.push({
      sku: line.sku,
      slug: line.slug,
      name: line.name,
      currentQty: line.qtyKg,
      suggestQty,
      saveUz,
    });
  }

  return hints.slice(0, 3);
}
