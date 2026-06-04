import { graphScoreFromTopics } from "@/data/commerce-graph";
import { products } from "@/data/products";
import type { FilterSnapshot, IntentProfile, TopicTag } from "@/lib/intent/types";
import type { Product } from "@/types/product";
import { productFamilyKey } from "@/lib/intent/product-family";

export function filterAffinityScore(product: Product, filters: FilterSnapshot): number {
  let score = 0;
  if (filters.tab === "material" && product.category === "material") score += 12;
  if (filters.tab === "planter" && product.category === "planter") score += 12;
  if (filters.stock === "in_stock" && product.stock === "in_stock") score += 18;
  if (filters.stock === "on_order" && product.stock === "on_order") score += 8;
  if (filters.shape && filters.shape !== "all" && product.shape === filters.shape) score += 22;
  if (filters.kind === "semi" && product.sku.includes("RTN-ST-")) score += 25;
  if (filters.kind === "twisted" && product.sku.includes("-TW-")) score += 25;
  if (
    filters.kind === "regular" &&
    product.category === "material" &&
    !product.sku.includes("-TW-") &&
    !product.isBrochure
  ) {
    score += 20;
  }
  return score;
}

export function volumeIntentScore(
  product: Product,
  volumeIntent: IntentProfile["volumeIntent"],
): number {
  if (volumeIntent === "unknown") return 0;
  if (volumeIntent === "bulk") {
    if (product.category === "material" && product.stock === "in_stock") return 18;
    if (product.category === "material") return 10;
    return 4;
  }
  if (product.category === "planter" || product.stock === "in_stock") return 12;
  return 6;
}

export function cartComplementScore(product: Product, cartSkus: string[]): number {
  if (cartSkus.length === 0) return 0;
  const cartProducts = cartSkus
    .map((sku) => products.find((p) => p.sku === sku) ?? null)
    .filter((p): p is Product => p != null);
  if (cartProducts.length === 0) return 0;

  const cartHasPlanter = cartProducts.some((p) => p.category === "planter");
  const cartHasMaterial = cartProducts.some((p) => p.category === "material");
  const cartKinds = new Set(
    cartProducts.map((p) => {
      if (p.category === "planter") return "planter";
      if (p.sku.includes("-TW-")) return "twisted";
      if (p.sku.includes("RTN-ST-")) return "semi";
      return "regular";
    }),
  );

  if (cartHasPlanter && product.category === "material" && product.shape === "half_round") {
    return 28;
  }
  if (cartHasMaterial && product.category === "planter") return 22;

  const productKind: "twisted" | "semi" | "regular" | "planter" =
    product.category === "planter"
      ? "planter"
      : product.sku.includes("-TW-")
        ? "twisted"
        : product.sku.includes("RTN-ST-")
          ? "semi"
          : "regular";
  if (cartHasMaterial && !cartKinds.has(productKind) && product.category === "material") {
    return 20;
  }
  return 0;
}

export function topicGraphScore(topics: TopicTag[], sku: string): number {
  return graphScoreFromTopics(topics, sku);
}

export function familyDiversityPenalty(
  product: Product,
  topFamily: string | null,
): number {
  if (!topFamily) return 0;
  return productFamilyKey(product) === topFamily ? -18 : 0;
}
