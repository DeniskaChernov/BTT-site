import type { IntentProfile, JourneyType } from "@/lib/intent/types";

/** Journey только из действий на сайте, без самоидентификации клиента. */
export function inferJourneyFromProfile(p: IntentProfile): JourneyType {
  const deepReads = p.readArticles.filter((r) => r.depth >= 0.5).length;
  const filters = p.lastCatalogFilters;

  if (
    p.volumeIntent === "bulk" ||
    p.topics.includes("wholesale") ||
    (filters.kind === "semi" && filters.stock === "in_stock")
  ) {
    return "production";
  }

  if (
    deepReads >= 2 ||
    (deepReads >= 1 && p.cartSkus.length === 0 && p.viewedSkus.length <= 3)
  ) {
    return "knowledge";
  }

  if (p.viewedSkus.length >= 1 || p.cartSkus.length >= 1 || p.topics.length >= 2) {
    return "master";
  }

  return "unknown";
}
