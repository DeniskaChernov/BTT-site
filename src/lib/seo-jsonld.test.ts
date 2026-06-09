import { describe, expect, it } from "vitest";
import { products } from "@/data/products";
import { buildCatalogItemListJsonLd } from "./seo-jsonld";

describe("buildCatalogItemListJsonLd", () => {
  it("builds ItemList with product urls", () => {
    const json = buildCatalogItemListJsonLd({
      locale: "ru",
      catalogName: "Каталог",
      catalogUrl: "https://bententrade.uz/ru/catalog",
      products: products.slice(0, 2),
    });
    expect(json["@type"]).toBe("ItemList");
    expect(json.itemListElement).toHaveLength(2);
  });
});
