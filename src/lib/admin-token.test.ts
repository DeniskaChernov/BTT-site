import { describe, expect, it } from "vitest";
import { verifyAdminBearer } from "./admin-token";

const SECRET = "0123456789012345678901234"; // 24 chars

describe("verifyAdminBearer", () => {
  it("accepts matching Bearer token", () => {
    const req = new Request("https://x", {
      headers: { Authorization: `Bearer ${SECRET}` },
    });
    expect(verifyAdminBearer(req, SECRET)).toBe(true);
  });

  it("rejects wrong token and missing header", () => {
    const bad = new Request("https://x", {
      headers: { Authorization: "Bearer wrongwrongwrongwrongwrongwrong" },
    });
    expect(verifyAdminBearer(bad, SECRET)).toBe(false);
    expect(verifyAdminBearer(new Request("https://x"), SECRET)).toBe(false);
  });

  it("rejects short secret", () => {
    const req = new Request("https://x", {
      headers: { Authorization: "Bearer short" },
    });
    expect(verifyAdminBearer(req, "short")).toBe(false);
  });
});
