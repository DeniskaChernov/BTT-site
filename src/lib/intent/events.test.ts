import { describe, expect, it } from "vitest";
import { EMPTY_PROFILE } from "@/lib/intent/types";
import { applyIntentEvent } from "@/lib/intent/events";

describe("intent events sink", () => {
  it("records view_pdp sku", () => {
    const next = applyIntentEvent(EMPTY_PROFILE, {
      type: "view_pdp",
      sku: "RTN-HR-5-NAT",
    });
    expect(next.viewedSkus.some((v) => v.sku === "RTN-HR-5-NAT")).toBe(true);
  });

  it("records cart add with bulk volume", () => {
    const next = applyIntentEvent(EMPTY_PROFILE, {
      type: "add_to_cart",
      sku: "RTN-HR-5-NAT",
      qtyKg: 200,
    });
    expect(next.cartSkus).toContain("RTN-HR-5-NAT");
    expect(next.volumeIntent).toBe("bulk");
  });

  it("merges catalog filters", () => {
    const next = applyIntentEvent(EMPTY_PROFILE, {
      type: "catalog_filter_apply",
      filters: { kind: "semi" },
    });
    expect(next.lastCatalogFilters.kind).toBe("semi");
  });
});
