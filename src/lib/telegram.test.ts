import { describe, expect, it } from "vitest";
import { appendTelegramPrefillText } from "./telegram";

describe("appendTelegramPrefillText", () => {
  it("adds text query param", () => {
    expect(appendTelegramPrefillText("https://t.me/foo", "hello")).toBe(
      "https://t.me/foo?text=hello",
    );
  });

  it("encodes reserved characters", () => {
    expect(
      appendTelegramPrefillText("https://t.me/foo", "a & b"),
    ).toContain("text=a+%26+b");
  });

  it("returns base when text empty", () => {
    expect(appendTelegramPrefillText("https://t.me/foo", "  ")).toBe(
      "https://t.me/foo",
    );
  });
});
