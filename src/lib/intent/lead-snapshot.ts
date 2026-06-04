import type { IntentProfile } from "@/lib/intent/types";

export function intentProfileToLeadSnapshot(profile: IntentProfile) {
  return {
    journey: profile.journey,
    confidence: profile.confidence,
    volumeIntent: profile.volumeIntent,
    topics: profile.topics.slice(0, 8),
    cartSkus: profile.cartSkus.slice(0, 12),
    viewedSkus: profile.viewedSkus.slice(-6).map((v) => v.sku),
    readArticles: profile.readArticles.slice(-4).map((r) => r.slug),
  };
}
