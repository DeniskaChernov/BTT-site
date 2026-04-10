import { describe, expect, it } from "vitest";
import { ApiErrorCode, apiJsonError } from "./api-response";

describe("apiJsonError", () => {
  it("returns JSON body with status and optional headers", async () => {
    const res = apiJsonError(
      429,
      ApiErrorCode.RATE_LIMIT,
      "Too many requests",
      { "Retry-After": "60" },
    );
    expect(res.status).toBe(429);
    expect(res.headers.get("Retry-After")).toBe("60");
    const body = (await res.json()) as {
      ok: boolean;
      code: string;
      error: string;
    };
    expect(body.ok).toBe(false);
    expect(body.code).toBe(ApiErrorCode.RATE_LIMIT);
    expect(body.error).toBe("Too many requests");
  });
});
