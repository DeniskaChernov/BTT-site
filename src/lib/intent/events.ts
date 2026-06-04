import { trackEvent } from "@/lib/analytics";
import type { FilterSnapshot, IntentProfile } from "@/lib/intent/types";
import {
  recordArticleRead,
  recordCartAdd,
  recordCatalogFilters,
  recordQuizComplete,
  recordViewedSku,
  type QuizIntentInput,
} from "@/lib/intent/profile";

export type IntentSinkEvent =
  | { type: "quiz_complete"; input: QuizIntentInput }
  | { type: "catalog_filter_apply"; filters: FilterSnapshot }
  | { type: "view_pdp"; sku: string }
  | { type: "article_read"; slug: string; depth: number }
  | { type: "add_to_cart"; sku: string; qtyKg: number };

const ANALYTICS_BY_INTENT_EVENT: Record<IntentSinkEvent["type"], string> = {
  quiz_complete: "quiz_complete",
  catalog_filter_apply: "catalog_filter_apply",
  view_pdp: "view_pdp",
  article_read: "article_read_progress",
  add_to_cart: "add_to_cart",
};

export function applyIntentEvent(
  profile: IntentProfile,
  event: IntentSinkEvent,
): IntentProfile {
  switch (event.type) {
    case "quiz_complete":
      return recordQuizComplete(profile, event.input);
    case "catalog_filter_apply":
      return recordCatalogFilters(profile, event.filters);
    case "view_pdp":
      return recordViewedSku(profile, event.sku);
    case "article_read":
      return recordArticleRead(profile, event.slug, event.depth);
    case "add_to_cart":
      return recordCartAdd(profile, event.sku, event.qtyKg);
  }
}

export function sinkIntentEvent(profile: IntentProfile, event: IntentSinkEvent): IntentProfile {
  const next = applyIntentEvent(profile, event);
  trackEvent(ANALYTICS_BY_INTENT_EVENT[event.type], {
    intentConfidence: next.confidence,
    journey: next.journey,
    ...(event.type === "view_pdp" ? { sku: event.sku } : {}),
    ...(event.type === "add_to_cart" ? { sku: event.sku, qtyKg: event.qtyKg } : {}),
    ...(event.type === "article_read" ? { slug: event.slug, depth: event.depth } : {}),
  });
  return next;
}
