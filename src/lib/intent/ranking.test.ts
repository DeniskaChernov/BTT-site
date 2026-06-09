import { products } from "@/data/products";
import { topicScoreForProduct } from "@/data/commerce-graph";
import { recordCartAdd } from "@/lib/intent/profile";
import { rankProducts, rankProductsSimple } from "@/lib/intent/rank-products";
import {
  cartComplementScore,
  filterAffinityScore,
  volumeIntentScore,
} from "@/lib/intent/scoring";
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

  it("recordCartAdd upgrades volume when qty increases", () => {
    const mid = recordCartAdd(EMPTY_PROFILE, "RTN-HR-5-NAT", 5);
    expect(mid.volumeIntent).toBe("retail");
    const bulk = recordCartAdd(mid, "RTN-HR-5-NAT", 10);
    expect(bulk.volumeIntent).toBe("bulk");
  });
});

describe("rankProducts purposes", () => {
  const material = () => products.filter((p) => p.category === "material");

  it("pdp_cross_sell limits to 4", () => {
    const base = products.find((p) => p.category === "material")!;
    const ranked = rankProductsSimple(material(), {
      profile: { ...EMPTY_PROFILE, topics: ["furniture"] },
      purpose: "pdp_cross_sell",
      currentSlug: base.slug,
      excludeSkus: [base.sku],
      limit: 4,
    });
    expect(ranked.length).toBeLessThanOrEqual(4);
    expect(ranked.every((p) => p.sku !== base.sku)).toBe(true);
  });

  it("home_hits returns up to limit", () => {
    const ranked = rankProductsSimple(material().slice(0, 12), {
      profile: { ...EMPTY_PROFILE, topics: ["rattan"] },
      purpose: "home_hits",
      limit: 6,
    });
    expect(ranked.length).toBe(6);
  });

  it("production journey boosts semi in smart sort", () => {
    const ranked = rankProductsSimple(material(), {
      profile: { ...EMPTY_PROFILE, journey: "production", topics: ["semi_tube"] },
      purpose: "catalog_smart_sort",
      limit: 3,
    });
    expect(ranked.some((p) => p.sku.includes("RTN-ST-"))).toBe(true);
  });

  it("excludes skus from excludeSkus", () => {
    const sku = "RTN-HR-5-NAT";
    const ranked = rankProductsSimple(material(), {
      profile: EMPTY_PROFILE,
      purpose: "cart_upsell",
      excludeSkus: [sku],
      limit: 8,
    });
    expect(ranked.some((p) => p.sku === sku)).toBe(false);
  });

  it("viewed sku penalty lowers repeat in pdp", () => {
    const base = products.find((p) => p.sku === "RTN-HR-5-NAT")!;
    const fresh = rankProductsSimple(material(), {
      profile: EMPTY_PROFILE,
      purpose: "pdp_cross_sell",
      currentSlug: base.slug,
      limit: 5,
    });
    const viewed = rankProductsSimple(material(), {
      profile: {
        ...EMPTY_PROFILE,
        viewedSkus: [{ sku: fresh[0]!.sku, at: Date.now() }],
      },
      purpose: "pdp_cross_sell",
      currentSlug: base.slug,
      limit: 5,
    });
    expect(viewed[0]?.sku).not.toBe(fresh[0]?.sku);
  });
});

describe("filter and volume scoring", () => {
  it("semi filter affinity", () => {
    const p = products.find((x) => x.sku.includes("RTN-ST-"))!;
    expect(filterAffinityScore(p, { kind: "semi" })).toBeGreaterThan(20);
  });

  it("bulk volume prefers in-stock material", () => {
    const p = products.find((x) => x.category === "material" && x.stock === "in_stock")!;
    expect(volumeIntentScore(p, "bulk")).toBeGreaterThan(10);
  });
});
