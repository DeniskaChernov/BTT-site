import {
  catalogDefaultsForJourney,
  parseJourneyParam,
  reorderByJourney,
} from "@/lib/journey/orchestrator";
import { describe, expect, it } from "vitest";

describe("journey orchestrator", () => {
  it("parses journey param", () => {
    expect(parseJourneyParam("production")).toBe("production");
  });

  it("production catalog defaults", () => {
    expect(catalogDefaultsForJourney("production")?.kind).toBe("semi");
  });

  it("knowledge catalog defaults", () => {
    expect(catalogDefaultsForJourney("knowledge")?.tab).toBe("material");
    expect(catalogDefaultsForJourney("knowledge")?.stock).toBe("all");
  });

  it("reorders segments", () => {
    const out = reorderByJourney(
      [{ id: "a" }, { id: "b" }],
      "production",
      { production: "b" },
    );
    expect(out[0]?.id).toBe("b");
  });
});
