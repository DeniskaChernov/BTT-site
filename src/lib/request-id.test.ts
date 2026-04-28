import { describe, expect, it } from "vitest";
import { requestIdFrom } from "./request-id";

describe("requestIdFrom", () => {
  it("returns trimmed x-request-id", () => {
    const r = new Request("https://example.com", {
      headers: { "x-request-id": "  abc-123  " },
    });
    expect(requestIdFrom(r)).toBe("abc-123");
  });

  it("returns generated uuid when header missing or empty", () => {
    const generated = requestIdFrom(new Request("https://example.com"));
    expect(generated).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
    );

    const generatedFromEmpty = requestIdFrom(
      new Request("https://example.com", {
        headers: { "x-request-id": "   " },
      }),
    );
    expect(generatedFromEmpty).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
    );
  });
});
