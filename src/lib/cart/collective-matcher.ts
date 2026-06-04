import type { Product } from "@/types/product";

export type CartLineLike = { slug: string; qtyKg?: number; qty?: number };

export type CollectiveMatch = {
  slug: string;
  sku: string;
  name: string;
  botStartParam: string;
  qtyInCart: number;
};

export function matchCollectiveCampaigns(
  lines: CartLineLike[],
  catalog: Product[],
): CollectiveMatch[] {
  const out: CollectiveMatch[] = [];
  for (const line of lines) {
    const product = catalog.find((p) => p.slug === line.slug);
    if (!product?.collective) continue;
    out.push({
      slug: product.slug,
      sku: product.sku,
      name: product.names.ru,
      botStartParam: product.collective.botStartParam,
      qtyInCart: line.qtyKg ?? line.qty ?? 0,
    });
  }
  return out;
}
