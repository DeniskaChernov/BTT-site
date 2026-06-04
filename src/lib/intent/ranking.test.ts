import { products } from "@/data/products";
import { topicScoreForProduct } from "@/data/commerce-graph";
import { recordCartAdd } from "@/lib/intent/profile";
import { rankQuizRecommendations } from "@/lib/intent/rank-quiz";
import { rankProducts, rankProductsSimple } from "@/lib/intent/rank-products";
import { cartComplementScore } from "@/lib/intent/scoring";
import { EMPTY_PROFILE } from "@/lib/intent/types";
import { describe, expect, it } from "vitest";

describe("advanced rankProducts", () => {
  it("article graph winner", () => {
    const ranked = rankProductsSimple(products, {
      profile: { ...EMPTY_PROFILE, topics: ["furniture"] },
      purpose: "article_followup",
      currentArticleSlug: "rattan-thickness-furniture",
      limit: 5,
    });
    expect(ranked[0]?.sku).toBe("RTN-HR-5-NAT");
  });

  it("cart upsell excludes cart sku", () => {
    const pool = products.filter((p) => p.category === "material");
    const ranked = rankProductsSimple(pool, {
      profile: { ...EMPTY_PROFILE, cartSkus: ["RTN-HR-5-NAT"], topics: ["furniture"] },
      purpose: "cart_upsell",
      limit: 5,
    });
    expect(ranked.every((p) => p.sku !== "RTN-HR-5-NAT")).toBe(true);
  });

  it("smart sort respects twisted filter", () => {
    const ranked = rankProductsSimple(products.filter((p) => p.category === "material"), {
      profile: { ...EMPTY_PROFILE, lastCatalogFilters: { kind: "twisted" } },
      purpose: "catalog_smart_sort",
      limit: 4,
    });
    expect(ranked.every((p) => p.sku.includes("-TW-"))).toBe(true);
  });

  it("explain breakdown", () => {
    const row = rankProducts(products.slice(0, 4), {
      profile: { ...EMPTY_PROFILE, topics: ["furniture"] },
      purpose: "catalog_smart_sort",
      limit: 1,
      explain: true,
    })[0];
    expect(row?.breakdown?.parts).toBeDefined();
  });

  it("diversify unique families", () => {
    const ranked = rankProducts(
      products.filter((p) => p.category === "material").slice(0, 10),
      { profile: { ...EMPTY_PROFILE, topics: ["rattan"] }, purpose: "home_hits", limit: 3 },
      { diversify: true },
    );
    const keys = ranked.map((r) => `${r.product.shape}-${r.product.thicknessMm}`);
    expect(new Set(keys).size).toBe(keys.length);
  });
});

describe("rankQuizRecommendations", () => {
  it("seating quiz includes HR-5", () => {
    const ranked = rankQuizRecommendations(
      products,
      {
        productKind: "material",
        place: "both",
        workGoal: "furniture",
        furnitureUse: "seating",
        planterPath: null,
      },
      { ...EMPTY_PROFILE, topics: ["furniture"] },
      3,
    );
    expect(ranked.some((p) => p.sku === "RTN-HR-5-NAT")).toBe(true);
  });
});

describe("scoring", () => {
  it("planter topic scores KSH sku", () => {
    const p = products.find((x) => x.category === "planter")!;
    expect(topicScoreForProduct(["planter"], p.sku, p.shape, p.category)).toBeGreaterThan(30);
  });

  it("cart complement material for planter cart", () => {
    const planter = products.find((p) => p.category === "planter")!;
    const mat = products.find((p) => p.sku === "RTN-HR-5-NAT")!;
    expect(cartComplementScore(mat, [planter.sku])).toBeGreaterThan(10);
  });

  it("recordCartAdd bulk at 10kg", () => {
    const next = recordCartAdd(EMPTY_PROFILE, "RTN-HR-5-NAT", 10);
    expect(next.volumeIntent).toBe("bulk");
  });
});
