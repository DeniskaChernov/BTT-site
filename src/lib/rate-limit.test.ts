import { describe, expect, it } from "vitest";
import { allowAdminList, clientKeyFromRequest } from "./rate-limit";

function req(headers: Record<string, string>) {
  return new Request("https://example.com/api", { headers });
}

describe("clientKeyFromRequest", () => {
  it("prefers first IP from x-forwarded-for", () => {
    expect(
      clientKeyFromRequest(
        req({ "x-forwarded-for": "203.0.113.1, 10.0.0.1" }),
      ),
    ).toBe("203.0.113.1");
  });

  it("falls back to x-real-ip then cf-connecting-ip", () => {
    expect(clientKeyFromRequest(req({ "x-real-ip": "198.51.100.2" }))).toBe(
      "198.51.100.2",
    );
    expect(
      clientKeyFromRequest(req({ "cf-connecting-ip": "192.0.2.3" })),
    ).toBe("192.0.2.3");
  });

  it("returns unknown without proxy headers", () => {
    expect(clientKeyFromRequest(req({}))).toBe("unknown");
  });
});

describe("allowAdminList", () => {
  it("allows bursts within limit", () => {
    const k = `test-admin-${Math.random().toString(36).slice(2)}`;
    for (let i = 0; i < 40; i++) {
      expect(allowAdminList(k, 40)).toBe(true);
    }
    expect(allowAdminList(k, 40)).toBe(false);
  });
});
