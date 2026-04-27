import { describe, expect, it, vi } from "vitest";
import { issueOrderHistoryToken, verifyOrderHistoryToken } from "./order-access";

describe("order-access token", () => {
  it("issues and verifies token for the same phone", () => {
    vi.stubEnv("ORDER_HISTORY_TOKEN_SECRET", "test-secret-1234567890");
    const token = issueOrderHistoryToken("+998901112233", 1_000);
    expect(token).toBeTruthy();
    expect(verifyOrderHistoryToken(token ?? "", "+998901112233", 2_000)).toBe(true);
    vi.unstubAllEnvs();
  });

  it("rejects token for another phone", () => {
    vi.stubEnv("ORDER_HISTORY_TOKEN_SECRET", "test-secret-1234567890");
    const token = issueOrderHistoryToken("+998901112233", 1_000);
    expect(verifyOrderHistoryToken(token ?? "", "+998998887766", 2_000)).toBe(false);
    vi.unstubAllEnvs();
  });
});
