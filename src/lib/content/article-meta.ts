import meta from "@/content/articles/meta.json";

export type ArticleContentKind = "guide" | "article" | "news";

export type ArticleMetaEntry = {
  topics?: string[];
  recommends?: string[];
  kind?: ArticleContentKind;
};

const META = meta as Record<string, ArticleMetaEntry>;

export function getArticleMeta(slug: string): ArticleMetaEntry | undefined {
  return META[slug];
}

export function articleGraphRecommends(slug: string): string[] {
  return getArticleMeta(slug)?.recommends ?? [];
}
