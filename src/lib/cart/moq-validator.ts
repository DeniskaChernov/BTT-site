import { getProductBySlug } from "@/data/products";
import { getQtyRules, normalizeLineQty } from "@/lib/pricing";
import type { CartLine } from "@/contexts/CartContext";

export type MoqIssue = {
  sku: string;
  slug: string;
  name: string;
  qty: number;
  min: number;
  step: number;
  kind: "below_min" | "invalid_step";
};

export function validateCartMoq(lines: CartLine[]): MoqIssue[] {
  const issues: MoqIssue[] = [];
  for (const line of lines) {
    const product = getProductBySlug(line.slug);
    if (!product) continue;
    const { min, step } = getQtyRules(product);
    if (line.qtyKg < min) {
      issues.push({
        sku: line.sku,
        slug: line.slug,
        name: line.name,
        qty: line.qtyKg,
        min,
        step,
        kind: "below_min",
      });
      continue;
    }
    const normalized = normalizeLineQty(product, line.qtyKg);
    if (normalized === null) {
      issues.push({
        sku: line.sku,
        slug: line.slug,
        name: line.name,
        qty: line.qtyKg,
        min,
        step,
        kind: "invalid_step",
      });
      continue;
    }
    if (normalized !== line.qtyKg) {
      issues.push({
        sku: line.sku,
        slug: line.slug,
        name: line.name,
        qty: line.qtyKg,
        min,
        step,
        kind: "invalid_step",
      });
    }
  }
  return issues;
}
