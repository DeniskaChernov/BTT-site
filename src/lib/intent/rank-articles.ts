import { ARTICLE_TOPICS } from "@/data/commerce-graph";
import type { ArticleRecord } from "@/data/articles";
import type { FilterSnapshot, IntentProfile } from "@/lib/intent/types";

export type ArticleRankResult = {
  article: Extract<ArticleRecord, { status: "published" }>;
  score: number;
  breakdown?: Record<string, number>;
};

function topicOverlap(profileTopics: string[], articleSlug: string): number {
  const articleTopics = ARTICLE_TOPICS[articleSlug] ?? [];
  if (articleTopics.length === 0 || profileTopics.length === 0) return 0;
  const set = new Set(profileTopics);
  return articleTopics.filter((t) => set.has(t)).length * 28;
}

function recencyBoost(publishedAt: string): number {
  const days = (Date.now() - new Date(publishedAt).getTime()) / (1000 * 60 * 60 * 24);
  if (days <= 14) return 22;
  if (days <= 60) return 12;
  return 0;
}

function unreadBoost(profile: IntentProfile, slug: string): number {
  const read = profile.readArticles.find((r) => r.slug === slug);
  if (!read) return 28;
  if (read.depth < 0.5) return 8;
  return -20;
}

function filterTopicBoost(filters: FilterSnapshot, slug: string): number {
  const topics = ARTICLE_TOPICS[slug] ?? [];
  let score = 0;
  if (filters.kind === "semi" && topics.includes("semi_tube")) score += 18;
  if (filters.kind === "twisted" && topics.includes("twisted")) score += 18;
  if (filters.tab === "planter" && topics.includes("planter")) score += 20;
  if (filters.shape === "half_round" && topics.includes("furniture")) score += 15;
  return score;
}

function scoreArticle(
  article: Extract<ArticleRecord, { status: "published" }>,
  profile: IntentProfile,
  explain?: boolean,
): ArticleRankResult {
  const parts: Record<string, number> = {};
  parts.topic = topicOverlap(profile.topics, article.slug);
  parts.recency = recencyBoost(article.publishedAt);
  parts.unread = unreadBoost(profile, article.slug);
  parts.filters = filterTopicBoost(profile.lastCatalogFilters, article.slug);
  if (profile.journey === "production" && article.slug.includes("wholesale")) {
    parts.journey = 32;
  } else if (profile.journey === "knowledge") {
    parts.journey = 14;
  } else {
    parts.journey = 0;
  }
  if (profile.volumeIntent === "bulk" && article.slug.includes("wholesale")) {
    parts.volume = 16;
  }
  const score = Object.values(parts).reduce((a, b) => a + b, 0);
  return { article, score, breakdown: explain ? parts : undefined };
}

export function rankArticlesDetailed(
  articles: Extract<ArticleRecord, { status: "published" }>[],
  profile: IntentProfile,
  currentSlug?: string,
  limit = 3,
  explain = false,
): ArticleRankResult[] {
  return articles
    .filter((a) => a.slug !== currentSlug)
    .map((a) => scoreArticle(a, profile, explain))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

export function rankArticles(
  articles: Extract<ArticleRecord, { status: "published" }>[],
  profile: IntentProfile,
  currentSlug?: string,
  limit = 3,
): Extract<ArticleRecord, { status: "published" }>[] {
  return rankArticlesDetailed(articles, profile, currentSlug, limit).map((r) => r.article);
}
