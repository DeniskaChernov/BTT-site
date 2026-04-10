import { describe, expect, it } from "vitest";
import { requestIdFrom } from "./request-id";

describe("requestIdFrom", () => {
  it("returns trimmed x-request-id", () => {
    const r = new Request("https://example.com", {
      headers: { "x-request-id": "  abc-123  " },
    });
    expect(requestIdFrom(r)).toBe("abc-123");
  });

  it("returns undefined when header missing or empty", () => {
    expect(requestIdFrom(new Request("https://example.com"))).toBeUndefined();
    expect(
      requestIdFrom(
        new Request("https://example.com", {
          headers: { "x-request-id": "   " },
        }),
      ),
    ).toBeUndefined();
  });
});
