import type {
  FilterSnapshot,
  IntentProfile,
  JourneyType,
  ReadArticle,
  TopicTag,
  ViewedSku,
} from "@/lib/intent/types";
import { EMPTY_PROFILE } from "@/lib/intent/types";
import { ARTICLE_TOPICS } from "@/data/commerce-graph";

const STORAGE_KEY = "btt_intent_v1";
const MAX_VIEWED = 24;
const MAX_READ = 12;
const VIEW_DECAY_MS = 7 * 24 * 60 * 60 * 1000;

function clampTopics(topics: TopicTag[]): TopicTag[] {
  return [...new Set(topics)].slice(0, 8);
}

function computeConfidence(p: IntentProfile): number {
  let c = 0;
  if (p.journey !== "unknown") c += 0.25;
  if (p.topics.length > 0) c += 0.2;
  if (p.viewedSkus.length > 0) c += 0.2;
  if (p.readArticles.length > 0) c += 0.15;
  if (p.cartSkus.length > 0) c += 0.1;
  if (Object.keys(p.lastCatalogFilters).length > 0) c += 0.1;
  return Math.min(1, c);
}

function sanitizeProfile(raw: unknown): IntentProfile {
  if (typeof raw !== "object" || raw === null) return { ...EMPTY_PROFILE };
  const o = raw as Record<string, unknown>;
  const journey = (["master", "production", "knowledge", "unknown"] as const).includes(
    o.journey as JourneyType,
  )
    ? (o.journey as JourneyType)
    : "unknown";
  const topics = Array.isArray(o.topics)
    ? clampTopics(o.topics.filter((t): t is TopicTag => typeof t === "string"))
    : [];
  const viewedSkus = Array.isArray(o.viewedSkus)
    ? (o.viewedSkus as ViewedSku[]).filter((v) => typeof v?.sku === "string").slice(0, MAX_VIEWED)
    : [];
  const readArticles = Array.isArray(o.readArticles)
    ? (o.readArticles as ReadArticle[]).filter((r) => typeof r?.slug === "string").slice(0, MAX_READ)
    : [];
  const cartSkus = Array.isArray(o.cartSkus)
    ? (o.cartSkus as string[]).filter((s) => typeof s === "string")
    : [];
  const lastCatalogFilters =
    typeof o.lastCatalogFilters === "object" && o.lastCatalogFilters !== null
      ? (o.lastCatalogFilters as FilterSnapshot)
      : {};
  const volumeIntent =
    o.volumeIntent === "retail" || o.volumeIntent === "bulk" ? o.volumeIntent : "unknown";

  const profile: IntentProfile = {
    journey,
    topics,
    volumeIntent,
    viewedSkus,
    readArticles,
    cartSkus,
    lastCatalogFilters,
    confidence: 0,
    updatedAt: typeof o.updatedAt === "number" ? o.updatedAt : Date.now(),
  };
  profile.confidence = computeConfidence(profile);
  return profile;
}

export function loadIntentProfile(): IntentProfile {
  if (typeof window === "undefined") return { ...EMPTY_PROFILE };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...EMPTY_PROFILE };
    return sanitizeProfile(JSON.parse(raw));
  } catch {
    return { ...EMPTY_PROFILE };
  }
}

export function saveIntentProfile(profile: IntentProfile): void {
  if (typeof window === "undefined") return;
  const next = { ...profile, confidence: computeConfidence(profile), updatedAt: Date.now() };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}

export function mergeProfile(
  current: IntentProfile,
  patch: Partial<IntentProfile>,
): IntentProfile {
  const merged: IntentProfile = {
    ...current,
    ...patch,
    topics: patch.topics ? clampTopics(patch.topics) : current.topics,
    viewedSkus: patch.viewedSkus ?? current.viewedSkus,
    readArticles: patch.readArticles ?? current.readArticles,
    cartSkus: patch.cartSkus ?? current.cartSkus,
    lastCatalogFilters: patch.lastCatalogFilters ?? current.lastCatalogFilters,
    updatedAt: Date.now(),
  };
  merged.confidence = computeConfidence(merged);
  return merged;
}

export function recordViewedSku(profile: IntentProfile, sku: string): IntentProfile {
  const now = Date.now();
  const filtered = profile.viewedSkus.filter((v) => v.sku !== sku);
  const next = [{ sku, at: now }, ...filtered].slice(0, MAX_VIEWED);
  return mergeProfile(profile, { viewedSkus: next });
}

export function recordArticleRead(
  profile: IntentProfile,
  slug: string,
  depth: number,
): IntentProfile {
  const topicsFromArticle = ARTICLE_TOPICS[slug] ?? [];
  const readArticles = [
    { slug, depth, at: Date.now() },
    ...profile.readArticles.filter((r) => r.slug !== slug),
  ].slice(0, MAX_READ);
  return mergeProfile(profile, {
    readArticles,
    topics: clampTopics([...profile.topics, ...topicsFromArticle]),
    journey: profile.journey === "unknown" ? "knowledge" : profile.journey,
  });
}

export function recordCatalogFilters(
  profile: IntentProfile,
  filters: FilterSnapshot,
): IntentProfile {
  const inferred: TopicTag[] = [...profile.topics];
  if (filters.kind === "semi") inferred.push("semi_tube");
  if (filters.kind === "twisted") inferred.push("twisted");
  if (filters.tab === "planter") inferred.push("planter");
  if (filters.shape === "half_round") inferred.push("furniture");
  return mergeProfile(profile, {
    lastCatalogFilters: filters,
    topics: clampTopics(inferred),
  });
}

export function viewedSkuPenalty(profile: IntentProfile, sku: string, now = Date.now()): number {
  const hit = profile.viewedSkus.find((v) => v.sku === sku);
  if (!hit) return 0;
  const age = now - hit.at;
  const factor = age > VIEW_DECAY_MS ? 0.5 : 1;
  return 30 * factor;
}

export function setJourney(profile: IntentProfile, journey: JourneyType): IntentProfile {
  return mergeProfile(profile, { journey });
}
