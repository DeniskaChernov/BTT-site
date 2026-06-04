import type { IntentProfile } from "@/lib/intent/types";

/** Есть ли достаточно действий для тихого ранжирования (без UI-индикаторов). */
export function hasBehaviorSignals(profile: IntentProfile): boolean {
  return (
    profile.viewedSkus.length > 0 ||
    profile.cartSkus.length > 0 ||
    profile.readArticles.length > 0 ||
    profile.topics.length > 0 ||
    Object.keys(profile.lastCatalogFilters).length > 0
  );
}
