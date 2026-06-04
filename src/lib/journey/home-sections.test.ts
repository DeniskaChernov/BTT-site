import { homeSectionOrder } from "@/lib/journey/home-sections";
import { describe, expect, it } from "vitest";

describe("homeSectionOrder", () => {
  it("unknown uses default with segments first", () => {
    const order = homeSectionOrder("unknown");
    expect(order[0]).toBe("segments");
    expect(order).toContain("quiz");
    expect(order).toContain("articles");
  });

  it("production prioritizes collective and hits", () => {
    const order = homeSectionOrder("production");
    expect(order.indexOf("collective")).toBeLessThan(order.indexOf("quiz"));
    expect(order.indexOf("hits")).toBeLessThan(order.indexOf("quiz"));
  });

  it("knowledge prioritizes articles", () => {
    const order = homeSectionOrder("knowledge");
    expect(order.indexOf("articles")).toBeLessThan(order.indexOf("quiz"));
  });

  it("master prioritizes quiz after segments", () => {
    const order = homeSectionOrder("master");
    expect(order[1]).toBe("quiz");
  });
});
