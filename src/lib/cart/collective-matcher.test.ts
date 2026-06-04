import { describe, expect, it } from "vitest";
import { products } from "@/data/products";
import { matchCollectiveCampaigns } from "@/lib/cart/collective-matcher";

describe("collective matcher", () => {
  it("matches cart line with collective product", () => {
    const collective = products.find((p) => p.collective);
    if (!collective) return;
    const matches = matchCollectiveCampaigns(
      [{ slug: collective.slug, qtyKg: 5 }],
      products,
    );
    expect(matches.length).toBe(1);
    expect(matches[0]?.sku).toBe(collective.sku);
  });
});
