import { ARTICLE_TOPICS } from "@/data/commerce-graph";
import type { ArticleRecord } from "@/data/articles";
import type { IntentProfile } from "@/lib/intent/types";

function topicOverlap(profileTopics: string[], articleSlug: string): number {
  const articleTopics = ARTICLE_TOPICS[articleSlug] ?? [];
  if (articleTopics.length === 0 || profileTopics.length === 0) return 0;
  const set = new Set(profileTopics);
  const overlap = articleTopics.filter((t) => set.has(t)).length;
  return overlap * 25;
}

function recencyBoost(publishedAt: string): number {
  const days = (Date.now() - new Date(publishedAt).getTime()) / (1000 * 60 * 60 * 24);
  if (days <= 14) return 20;
  if (days <= 60) return 10;
  return 0;
}

function unreadBoost(profile: IntentProfile, slug: string): number {
  const read = profile.readArticles.some((r) => r.slug === slug);
  return read ? -15 : 25;
}

export function rankArticles(
  articles: Extract<ArticleRecord, { status: "published" }>[],
  profile: IntentProfile,
  currentSlug?: string,
  limit = 3,
): Extract<ArticleRecord, { status: "published" }>[] {
  const scored = articles
    .filter((a) => a.slug !== currentSlug)
    .map((a) => {
      let score = 0;
      score += topicOverlap(profile.topics, a.slug);
      score += recencyBoost(a.publishedAt);
      score += unreadBoost(profile, a.slug);
      if (profile.journey === "production" && a.slug.includes("wholesale")) score += 30;
      if (profile.journey === "knowledge") score += 10;
      return { article: a, score };
    })
    .sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map((s) => s.article);
}
