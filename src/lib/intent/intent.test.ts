import { products } from "@/data/products";
import { rankProductsSimple } from "@/lib/intent/rank-products";
import { EMPTY_PROFILE } from "@/lib/intent/types";
import { describe, expect, it } from "vitest";

describe("rankProducts", () => {
  it("boosts graph-linked SKU for article followup", () => {
    const ranked = rankProductsSimple(products, {
      profile: { ...EMPTY_PROFILE, topics: ["furniture"] },
      purpose: "article_followup",
      currentArticleSlug: "rattan-thickness-furniture",
      limit: 5,
    });
    expect(ranked[0]?.sku).toBe("RTN-HR-5-NAT");
  });

  it("penalizes items already in cart", () => {
    const ranked = rankProductsSimple(products.filter((p) => p.category === "material"), {
      profile: {
        ...EMPTY_PROFILE,
        cartSkus: ["RTN-HR-5-NAT"],
        topics: ["furniture"],
      },
      purpose: "cart_upsell",
      limit: 3,
    });
    expect(ranked.every((p) => p.sku !== "RTN-HR-5-NAT")).toBe(true);
  });

  it("prefers half-round for furniture journey", () => {
    const ranked = rankProductsSimple(
      products.filter((p) => p.shape === "half_round" || p.shape === "flat"),
      {
        profile: { ...EMPTY_PROFILE, journey: "master", topics: ["furniture"] },
        purpose: "catalog_smart_sort",
        limit: 3,
      },
    );
    expect(ranked[0]?.shape).toBe("half_round");
  });
});

describe("profile helpers", () => {
  it("loads empty profile when storage missing", async () => {
    const { loadIntentProfile } = await import("@/lib/intent/profile");
    expect(loadIntentProfile()).toMatchObject({ journey: "unknown" });
  });

  it("infers production from quiz bulk volume", async () => {
    const { recordQuizComplete } = await import("@/lib/intent/profile");
    const { EMPTY_PROFILE } = await import("@/lib/intent/types");
    const next = recordQuizComplete(EMPTY_PROFILE, {
      workGoal: "furniture",
      vol: "unknown",
    });
    expect(next.journey).toBe("production");
    expect(next.topics).toContain("wholesale");
    expect(next.volumeIntent).toBe("bulk");
  });
});

describe("rankArticles", () => {
  it("ranks wholesale article higher for production journey", async () => {
    const { getPublishedArticles } = await import("@/data/articles");
    const { rankArticles } = await import("@/lib/intent/rank-articles");
    const articles = getPublishedArticles();
    const ranked = rankArticles(
      articles,
      { ...EMPTY_PROFILE, journey: "production" },
      undefined,
      2,
    );
    expect(ranked.some((a) => a.slug.includes("wholesale"))).toBe(true);
  });
});
