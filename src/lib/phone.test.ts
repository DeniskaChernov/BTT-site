import { describe, expect, it } from "vitest";
import { formatPhoneInput, isMeaningfulPhone, normalizePhone } from "./phone";

describe("normalizePhone", () => {
  it("trims and collapses spaces", () => {
    expect(normalizePhone("  +998 90  123  45 67  ")).toBe("+998 90 123 45 67");
  });
});

describe("formatPhoneInput", () => {
  it("formats partial and full UZ numbers", () => {
    expect(formatPhoneInput("")).toBe("");
    expect(formatPhoneInput("90")).toBe("+998 90");
    expect(formatPhoneInput("901234567")).toBe("+998 90 123 45 67");
    expect(formatPhoneInput("+998901234567")).toBe("+998 90 123 45 67");
  });
});

describe("isMeaningfulPhone", () => {
  it("accepts typical UZ-style numbers", () => {
    expect(isMeaningfulPhone("+998 90 123 45 67")).toBe(true);
    expect(isMeaningfulPhone("998901234567")).toBe(true);
  });

  it("rejects empty and too short digit runs", () => {
    expect(isMeaningfulPhone("")).toBe(false);
    expect(isMeaningfulPhone("   ")).toBe(false);
    expect(isMeaningfulPhone("+")).toBe(false);
    expect(isMeaningfulPhone("123456")).toBe(false);
  });

  it("rejects overly long strings", () => {
    expect(isMeaningfulPhone("9".repeat(49))).toBe(false);
  });
});
