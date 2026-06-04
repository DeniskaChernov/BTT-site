import { estimateCartQuote } from "@/lib/cart/quote-estimator";
import { EMPTY_PROFILE } from "@/lib/intent/types";
import { describe, expect, it } from "vitest";

describe("estimateCartQuote", () => {
  it("suggests quote for production journey", () => {
    const est = estimateCartQuote(
      [
        {
          sku: "RTN-HR-5-NAT",
          slug: "rattan-hal-round-natural-5",
          name: "HR",
          qtyKg: 10,
        },
      ],
      { ...EMPTY_PROFILE, journey: "production" },
    );
    expect(est.suggestQuote).toBe(true);
    expect(est.subtotalUz).toBeGreaterThan(0);
  });
});
