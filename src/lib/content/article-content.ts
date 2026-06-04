/**
 * Точка расширения под MDX: сейчас тело статей в next-intl (`article*` namespaces).
 * При переходе на MDX: положить `src/content/articles/{slug}.mdx` и переключить resolver.
 */
export type ArticleContentSource = "messages" | "mdx";

export function resolveArticleContentSource(slug: string): ArticleContentSource {
  void slug;
  return "messages";
}

export const ARTICLE_SECTION_IDS = ["intro", "sec1", "sec2", "sec3", "outro"] as const;

export type ArticleSectionId = (typeof ARTICLE_SECTION_IDS)[number];
