import type { JourneyType } from "@/lib/intent/types";

export type HomeBlockId =
  | "segments"
  | "why"
  | "material"
  | "examples"
  | "hits"
  | "trust"
  | "quiz"
  | "collective"
  | "instagram"
  | "articles"
  | "lead"
  | "social";

const DEFAULT_ORDER: HomeBlockId[] = [
  "segments",
  "why",
  "material",
  "examples",
  "hits",
  "trust",
  "quiz",
  "collective",
  "instagram",
  "articles",
  "lead",
  "social",
];

const ORDER_BY_JOURNEY: Partial<Record<JourneyType, HomeBlockId[]>> = {
  master: [
    "segments",
    "quiz",
    "examples",
    "hits",
    "why",
    "material",
    "trust",
    "collective",
    "instagram",
    "articles",
    "lead",
    "social",
  ],
  production: [
    "segments",
    "collective",
    "hits",
    "why",
    "material",
    "examples",
    "trust",
    "quiz",
    "instagram",
    "articles",
    "lead",
    "social",
  ],
  knowledge: [
    "segments",
    "articles",
    "hits",
    "why",
    "material",
    "examples",
    "quiz",
    "trust",
    "collective",
    "instagram",
    "lead",
    "social",
  ],
};

export function homeSectionOrder(journey: JourneyType): HomeBlockId[] {
  return ORDER_BY_JOURNEY[journey] ?? DEFAULT_ORDER;
}
