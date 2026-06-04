import { withJourneyHref } from "@/lib/journey/href";
import { describe, expect, it } from "vitest";

describe("withJourneyHref", () => {
  it("appends journey param", () => {
    expect(withJourneyHref("/catalog", "production")).toBe("/catalog?journey=production");
  });

  it("merges existing query", () => {
    expect(withJourneyHref("/catalog?tab=material", "master")).toContain("journey=master");
    expect(withJourneyHref("/catalog?tab=material", "master")).toContain("tab=material");
  });

  it("skips unknown journey", () => {
    expect(withJourneyHref("/catalog", "unknown")).toBe("/catalog");
  });
});
