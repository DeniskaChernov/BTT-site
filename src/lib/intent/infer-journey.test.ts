import { inferJourneyFromProfile } from "@/lib/intent/infer-journey";
import { EMPTY_PROFILE } from "@/lib/intent/types";
import { describe, expect, it } from "vitest";

describe("inferJourneyFromProfile", () => {
  it("production from bulk volume", () => {
    expect(
      inferJourneyFromProfile({ ...EMPTY_PROFILE, volumeIntent: "bulk" }),
    ).toBe("production");
  });

  it("knowledge from article reads without cart", () => {
    expect(
      inferJourneyFromProfile({
        ...EMPTY_PROFILE,
        readArticles: [{ slug: "what-is-artificial-rattan", depth: 0.8, at: Date.now() }],
        cartSkus: [],
        viewedSkus: [],
      }),
    ).toBe("knowledge");
  });

  it("master from product views", () => {
    expect(
      inferJourneyFromProfile({
        ...EMPTY_PROFILE,
        viewedSkus: [{ sku: "RTN-HR-5-NAT", at: Date.now() }],
      }),
    ).toBe("master");
  });
});
