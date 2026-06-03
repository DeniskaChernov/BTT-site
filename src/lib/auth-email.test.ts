import { describe, expect, it } from "vitest";

import { isValidEmail, normalizeEmail } from "@/lib/auth-email";

describe("auth-email", () => {
  it("normalizeEmail trims and lowercases", () => {
    expect(normalizeEmail("  Opt@Bententrade.UZ  ")).toBe("opt@bententrade.uz");
  });

  it("isValidEmail accepts plausible addresses", () => {
    expect(isValidEmail("a@b.co")).toBe(true);
    expect(isValidEmail("user+tag@example.com")).toBe(true);
  });

  it("isValidEmail rejects garbage", () => {
    expect(isValidEmail("")).toBe(false);
    expect(isValidEmail("not-an-email")).toBe(false);
    expect(isValidEmail("@nodomain")).toBe(false);
  });
});
