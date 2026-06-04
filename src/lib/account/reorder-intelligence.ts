import { products } from "@/data/products";
import { getPricePerKgForQty } from "@/lib/pricing";
import type { StoredOrder } from "@/lib/order-history";

export type ReorderLineHint = {
  sku: string;
  slug: string;
  name: string;
  qty: number;
  wasPriceUz: number;
  nowPriceUz: number;
  driftPct: number;
};

export function buildReorderHints(order: StoredOrder): ReorderLineHint[] {
  const hints: ReorderLineHint[] = [];
  for (const line of order.lines) {
    const product = products.find((p) => p.slug === line.slug || p.sku === line.sku);
    if (!product) continue;
    const qty = line.qtyKg;
    const was = line.lineTotalUz;
    const now = getPricePerKgForQty(product, qty) * qty;
    if (was <= 0 || now <= 0) continue;
    hints.push({
      sku: product.sku,
      slug: product.slug,
      name: line.name,
      qty,
      wasPriceUz: was,
      nowPriceUz: now,
      driftPct: Math.round(((now - was) / was) * 100),
    });
  }
  return hints;
}
