import type { Product } from "@/types/product";

export function productFamilyKey(product: Product): string {
  if (product.category === "planter") return `planter:${product.slug}`;
  const kind = product.sku.includes("-TW-")
    ? "twisted"
    : product.isBrochure || product.sku.includes("RTN-ST-")
      ? "semi"
      : "regular";
  return `mat:${kind}:${product.shape}:${product.thicknessMm}`;
}
