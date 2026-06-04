import type { Product } from "@/types/product";

/** Предсобранная строка для клиентского поиска по каталогу. */
export function productSearchBlob(product: Product): string {
  return [
    product.sku,
    product.slug,
    product.names.ru,
    product.names.en,
    product.names.uz,
    product.short.ru,
    product.short.en,
    product.short.uz,
    product.shape,
    product.colorKey,
    product.category,
    String(product.thicknessMm),
  ]
    .join(" ")
    .toLowerCase();
}

export function productMatchesQuery(product: Product, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  const blob = productSearchBlob(product);
  const tokens = q.split(/\s+/).filter(Boolean);
  return tokens.every((t) => blob.includes(t));
}
