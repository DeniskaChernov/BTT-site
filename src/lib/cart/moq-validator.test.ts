import { validateCartMoq } from "@/lib/cart/moq-validator";
import { describe, expect, it } from "vitest";

describe("validateCartMoq", () => {
  it("flags qty below min for material", () => {
    const issues = validateCartMoq([
      {
        sku: "RTN-HR-5-NAT",
        slug: "rattan-hal-round-natural-5",
        name: "Test",
        qtyKg: 3,
      },
    ]);
    expect(issues.length).toBe(1);
    expect(issues[0]?.kind).toBe("below_min");
  });

  it("passes valid 5kg step", () => {
    const issues = validateCartMoq([
      {
        sku: "RTN-HR-5-NAT",
        slug: "rattan-hal-round-natural-5",
        name: "Test",
        qtyKg: 5,
      },
    ]);
    expect(issues.length).toBe(0);
  });
});
