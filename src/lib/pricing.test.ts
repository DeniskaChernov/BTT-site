import { describe, expect, it } from "vitest";
import { products } from "@/data/products";
import {
  formatUzs,
  getQtyRules,
  getPricePerKgForQty,
  isPricedPerKg,
  lineItemTotalUz,
  normalizeLineQty,
} from "./pricing";

describe("getPricePerKgForQty", () => {
  const twisted = products.find((x) => x.slug === "rattan-twisted-natural-5")!;
  const regular = products.find((x) => x.slug === "rattan-hal-round-natural-5")!;

  it("uses twisted rattan tier anchors", () => {
    expect(getPricePerKgForQty(twisted, 5)).toBe(39_600);
    expect(getPricePerKgForQty(twisted, 200)).toBe(34_600);
    expect(getPricePerKgForQty(twisted, 400)).toBe(32_100);
  });

  it("uses regular rattan tier anchors", () => {
    expect(getPricePerKgForQty(regular, 5)).toBe(36_000);
    expect(getPricePerKgForQty(regular, 200)).toBe(31_000);
    expect(getPricePerKgForQty(regular, 500)).toBe(8_500);
  });
});

describe("planter piece pricing", () => {
  const planter = products.find((x) => x.slug === "planter-basket-m")!;

  it("treats planters as per-piece, not per kg", () => {
    expect(isPricedPerKg(planter)).toBe(false);
    expect(lineItemTotalUz(planter, 2)).toBe(
      getPricePerKgForQty(planter, 2) * 2,
    );
  });
});

describe("formatUzs", () => {
  it("formats integer sums (Intl uz-UZ)", () => {
    const s = formatUzs(185_000);
    expect(s.replace(/\s/g, "")).toMatch(/185/);
    expect(s.length).toBeGreaterThan(3);
  });
});

describe("quantity rules", () => {
  it("enforces 5kg minimum for on-order material", () => {
    const preorder = products.find((p) => p.category === "material" && p.stock === "on_order");
    expect(preorder).toBeTruthy();
    if (!preorder) return;
    expect(getQtyRules(preorder)).toEqual({ min: 5, step: 5 });
    expect(normalizeLineQty(preorder, 1)).toBeNull();
    expect(normalizeLineQty(preorder, 6)).toBe(5);
  });
});
