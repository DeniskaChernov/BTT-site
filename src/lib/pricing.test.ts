import { describe, expect, it } from "vitest";
import { products } from "@/data/products";
import { formatUzs, getPricePerKgForQty } from "./pricing";

describe("getPricePerKgForQty", () => {
  const p = products[0]!;

  it("uses tier anchors like the cart", () => {
    expect(getPricePerKgForQty(p, 1)).toBe(p.priceUz.t12);
    expect(getPricePerKgForQty(p, 3)).toBe(p.priceUz.t5);
    expect(getPricePerKgForQty(p, 10)).toBe(p.priceUz.t10);
  });
});

describe("formatUzs", () => {
  it("formats integer sums (Intl uz-UZ)", () => {
    const s = formatUzs(185_000);
    expect(s.replace(/\s/g, "")).toMatch(/185/);
    expect(s.length).toBeGreaterThan(3);
  });
});
