import { products } from "@/data/products";
import { productMatchesQuery, productSearchBlob } from "@/lib/catalog/product-search";
import { describe, expect, it } from "vitest";

describe("product-search", () => {
  it("matches multi-token query", () => {
    const p = products[0]!;
    const blob = productSearchBlob(p);
    expect(blob.length).toBeGreaterThan(10);
    const token = p.sku.split("-")[0]!.toLowerCase();
    expect(productMatchesQuery(p, token)).toBe(true);
  });

  it("requires all tokens", () => {
    const p = products.find((x) => x.category === "planter")!;
    expect(productMatchesQuery(p, "zzzznotfound")).toBe(false);
  });
});
