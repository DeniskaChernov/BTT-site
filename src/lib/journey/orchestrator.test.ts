import {
  catalogDefaultsForJourney,
  shouldApplyJourneyCatalogDefaults,
} from "@/lib/journey/orchestrator";
import { describe, expect, it } from "vitest";

describe("journey orchestrator", () => {
  it("does not auto-apply catalog filters from journey", () => {
    expect(catalogDefaultsForJourney()).toBeNull();
    expect(shouldApplyJourneyCatalogDefaults()).toBe(false);
  });
});
