import { estimateCartQuote } from "@/lib/cart/quote-estimator";
import { describe, expect, it } from "vitest";

describe("estimateCartQuote", () => {
  it("suggests quote for large material batch", () => {
    const est = estimateCartQuote(
      Array.from({ length: 4 }, (_, i) => ({
        sku: `RTN-HR-5-NAT-${i}`,
        slug: "rattan-hal-round-natural-5",
        name: "HR",
        qtyKg: 10,
      })),
    );
    expect(est.suggestQuote).toBe(true);
    expect(est.subtotalUz).toBeGreaterThan(0);
  });
});
