import { isPricedPerKg, isTwistedRattan } from "@/lib/pricing";
import type { Product } from "@/types/product";

export type BulkMilestone = {
  currentQty: number;
  nextQty: number;
  progress: number;
};

export function getBulkMilestone(product: Product, qty: number): BulkMilestone | null {
  if (!isPricedPerKg(product) || product.category !== "material") return null;

  const thresholds = isTwistedRattan(product) ? [200, 400] : [200, 500];
  const next = thresholds.find((t) => qty < t);
  if (!next) return null;

  const prev = thresholds[thresholds.indexOf(next) - 1] ?? 0;
  const span = next - prev;
  const progress = span > 0 ? Math.min(1, (qty - prev) / span) : 0;

  return { currentQty: qty, nextQty: next, progress };
}
