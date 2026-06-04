import type { Product } from "@/types/product";
import { productSearchBlob } from "@/lib/catalog/product-search";

export type SearchIndexEntry = {
  sku: string;
  blob: string;
};

export function buildProductSearchIndex(products: Product[]): SearchIndexEntry[] {
  return products.map((p) => ({ sku: p.sku, blob: productSearchBlob(p) }));
}

export function indexEntryMatchesQuery(entry: SearchIndexEntry, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return q.split(/\s+/).filter(Boolean).every((part) => entry.blob.includes(part));
}

export function filterProductsByIndex(
  products: Product[],
  query: string,
  index?: SearchIndexEntry[],
): Product[] {
  const q = query.trim();
  if (!q) return products;
  const idx = index ?? buildProductSearchIndex(products);
  const matched = new Set<string>();
  for (const entry of idx) {
    if (indexEntryMatchesQuery(entry, q)) matched.add(entry.sku);
  }
  return products.filter((p) => matched.has(p.sku));
}
