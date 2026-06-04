import { describe, expect, it } from "vitest";
import { products } from "@/data/products";
import {
  buildProductSearchIndex,
  filterProductsByIndex,
  indexEntryMatchesQuery,
} from "@/lib/catalog/search-index";

describe("search-index", () => {
  const index = buildProductSearchIndex(products);

  it("matches SKU fragment", () => {
    const entry = index.find((e) => e.sku.includes("RTN"));
    expect(entry).toBeTruthy();
    if (!entry) return;
    expect(indexEntryMatchesQuery(entry, "RTN")).toBe(true);
  });

  it("filters products by name token", () => {
    const token = products[0].names.ru.split(/\s+/)[0]?.toLowerCase().slice(0, 4);
    if (!token || token.length < 2) return;
    expect(filterProductsByIndex(products, token, index).length).toBeGreaterThan(0);
  });

  it("empty query returns all", () => {
    expect(filterProductsByIndex(products, "", index).length).toBe(products.length);
  });
});
