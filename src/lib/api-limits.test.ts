import { describe, expect, it } from "vitest";
import { MAX_ORDER_JSON_BYTES } from "./api-limits";

describe("api-limits", () => {
  it("defines POST body ceiling", () => {
    expect(MAX_ORDER_JSON_BYTES).toBe(512 * 1024);
  });
});
