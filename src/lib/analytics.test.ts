import { describe, expect, it } from "vitest";
import { readUtmFromSearch } from "./analytics";

describe("readUtmFromSearch", () => {
  it("parses query with or without leading ?", () => {
    expect(
      readUtmFromSearch("?utm_source=ig&utm_medium=social&utm_campaign=spring"),
    ).toEqual({
      source: "ig",
      medium: "social",
      campaign: "spring",
    });
    expect(readUtmFromSearch("utm_content=hero")).toEqual({ content: "hero" });
  });

  it("omits empty params", () => {
    expect(readUtmFromSearch("?utm_source=x")).toEqual({ source: "x" });
  });
});
