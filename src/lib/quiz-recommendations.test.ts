import { products } from "@/data/products";
import { describe, expect, it } from "vitest";
import { pickQuizRecommendations, QUIZ_EXCLUSIVE_SKUS } from "./quiz-recommendations";

describe("pickQuizRecommendations", () => {
  it("seating furniture prefers half-round 5, flat 6, round 6 when outdoor", () => {
    const r = pickQuizRecommendations(products, {
      productKind: "material",
      place: "outdoor",
      workGoal: "furniture",
      furnitureUse: "seating",
      planterPath: null,
    });
    expect(r.map((p) => p.sku)).toEqual([
      "RTN-HR-5-NAT",
      "RTN-FL-6-BLK",
      "RTN-RD-6-NAT",
    ]);
  });

  it("planter weave prioritizes half-round 6 mm", () => {
    const r = pickQuizRecommendations(products, {
      productKind: "material",
      place: "both",
      workGoal: "planter",
      furnitureUse: null,
      planterPath: "weave",
    });
    expect(r[0]?.sku).toBe("RTN-HR-6-WHT");
    expect(r[0]?.shape).toBe("half_round");
    expect(r[0]?.thicknessMm).toBe(6);
  });

  it("ready planters put bowl planter first", () => {
    const r = pickQuizRecommendations(products, {
      productKind: "planter",
      place: "outdoor",
      workGoal: "planter",
      furnitureUse: null,
      planterPath: "ready",
    });
    expect(r[0]?.slug).toBe("planter-bowl-s");
  });
});

describe("QUIZ_EXCLUSIVE_SKUS", () => {
  it("marks round 6 natural", () => {
    expect(QUIZ_EXCLUSIVE_SKUS.has("RTN-RD-6-NAT")).toBe(true);
  });
});
