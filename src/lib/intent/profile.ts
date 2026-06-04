import type {
  FilterSnapshot,
  IntentProfile,
  ReadArticle,
  TopicTag,
  ViewedSku,
} from "@/lib/intent/types";
import { EMPTY_PROFILE } from "@/lib/intent/types";
import { ARTICLE_TOPICS } from "@/data/commerce-graph";
import { inferJourneyFromProfile } from "@/lib/intent/infer-journey";

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
    journey: "unknown",
    topics,
    volumeIntent,
    viewedSkus,
    readArticles,
    cartSkus,
    lastCatalogFilters,
    confidence: 0,
    updatedAt: typeof o.updatedAt === "number" ? o.updatedAt : Date.now(),
  };
  return finalizeProfile(profile);
}

function finalizeProfile(profile: IntentProfile): IntentProfile {
  const next = { ...profile, journey: inferJourneyFromProfile(profile) };
  next.confidence = computeConfidence(next);
  return next;
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
  return finalizeProfile(merged);
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

export type QuizIntentInput = {
  workGoal: "furniture" | "planter" | null;
  furnitureUse?: "seating" | "other" | null;
  planterPath?: "ready" | "weave" | null;
  productKind?: "material" | "planter" | null;
  vol?: "12" | "5" | "10" | "unknown" | null;
};

function topicsFromQuiz(input: QuizIntentInput): TopicTag[] {
  const topics: TopicTag[] = ["rattan"];
  if (input.workGoal === "furniture") topics.push("furniture");
  if (input.workGoal === "planter") topics.push("planter");
  if (input.planterPath === "weave" || input.productKind === "material") topics.push("semi_tube");
  if (input.planterPath === "ready" || input.productKind === "planter") topics.push("planter");
  if (input.vol === "10" || input.vol === "unknown") topics.push("wholesale");
  return topics;
}

function volumeFromQuiz(input: QuizIntentInput): IntentProfile["volumeIntent"] {
  if (input.vol === "10" || input.vol === "unknown") return "bulk";
  if (input.vol === "5" || input.vol === "12") return "retail";
  return "unknown";
}

export function recordCartAdd(
  profile: IntentProfile,
  sku: string,
  qtyKg: number,
): IntentProfile {
  const cartSkus = [...new Set([...profile.cartSkus, sku])];
  const volumeIntent =
    qtyKg >= 10 || profile.volumeIntent === "bulk"
      ? "bulk"
      : profile.volumeIntent === "unknown"
        ? "retail"
        : profile.volumeIntent;
  return mergeProfile(profile, { cartSkus, volumeIntent });
}

export function recordQuizComplete(
  profile: IntentProfile,
  input: QuizIntentInput,
): IntentProfile {
  return mergeProfile(profile, {
    topics: clampTopics([...profile.topics, ...topicsFromQuiz(input)]),
    volumeIntent: volumeFromQuiz(input),
  });
}
