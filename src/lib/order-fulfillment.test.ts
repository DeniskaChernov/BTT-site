import { describe, expect, it } from "vitest";
import {
  normalizeOrderStatus,
  orderFulfillmentType,
  orderStatusChain,
} from "./order-fulfillment";
import type { StoredOrder } from "./order-history";

function order(lines: StoredOrder["lines"]): Pick<StoredOrder, "lines"> {
  return { lines };
}

describe("orderFulfillmentType", () => {
  it("returns made_to_order when on_order material is present", () => {
    expect(
      orderFulfillmentType(
        order([
          {
            sku: "RTN-OV-7-WHT",
            slug: "rattan-oval-white-7",
            name: "test",
            qtyKg: 100,
            lineTotalUz: 1,
          },
        ]),
      ),
    ).toBe("made_to_order");
  });

  it("returns in_stock for in-stock lines only", () => {
    expect(
      orderFulfillmentType(
        order([
          {
            sku: "RTN-HR-5-NAT",
            slug: "rattan-hal-round-natural-5",
            name: "test",
            qtyKg: 5,
            lineTotalUz: 1,
          },
        ]),
      ),
    ).toBe("in_stock");
  });
});

describe("orderStatusChain", () => {
  it("includes production for made_to_order", () => {
    expect(orderStatusChain("made_to_order")).toContain("PRODUCTION");
  });

  it("skips production for in_stock", () => {
    expect(orderStatusChain("in_stock")).not.toContain("PRODUCTION");
  });
});

describe("normalizeOrderStatus", () => {
  it("defaults unknown to NEW", () => {
    expect(normalizeOrderStatus(undefined)).toBe("NEW");
  });

  it("keeps PRODUCTION", () => {
    expect(normalizeOrderStatus("PRODUCTION")).toBe("PRODUCTION");
  });
});
