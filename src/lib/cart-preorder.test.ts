import { products } from "@/data/products";
import { describe, expect, it } from "vitest";
import { cartHasInvalidPreorder } from "./cart-preorder";

describe("cartHasInvalidPreorder", () => {
  it("returns false for empty cart", () => {
    expect(cartHasInvalidPreorder([])).toBe(false);
  });

  it("returns true when on_order material is below 5 kg", () => {
    const p = products.find((x) => x.stock === "on_order" && x.category === "material");
    if (!p) throw new Error("fixture: need on_order material");
    expect(
      cartHasInvalidPreorder([{ slug: p.slug, qtyKg: 3 }]),
    ).toBe(true);
  });

  it("returns false at exactly 5 kg for on_order material", () => {
    const p = products.find((x) => x.stock === "on_order" && x.category === "material");
    if (!p) throw new Error("fixture: need on_order material");
    expect(
      cartHasInvalidPreorder([{ slug: p.slug, qtyKg: 5 }]),
    ).toBe(false);
  });
});
