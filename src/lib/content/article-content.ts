import { getArticleMeta } from "@/lib/content/article-meta";

/**
 * Точка расширения под MDX: сейчас тело статей в next-intl (`article*` namespaces).
 * При переходе на MDX: положить `src/content/articles/{slug}.mdx` и переключить resolver.
 */
export type ArticleContentSource = "messages" | "mdx";

/** Slugs with `src/content/articles/{slug}.mdx` when MDX is enabled. */
const MDX_SLUGS = new Set<string>([]);

export function resolveArticleContentSource(slug: string): ArticleContentSource {
  return MDX_SLUGS.has(slug) ? "mdx" : "messages";
}

export function articleGraphRecommends(slug: string): string[] {
  return getArticleMeta(slug)?.recommends ?? [];
}

export const ARTICLE_SECTION_IDS = ["intro", "sec1", "sec2", "sec3", "outro"] as const;

export type ArticleSectionId = (typeof ARTICLE_SECTION_IDS)[number];
