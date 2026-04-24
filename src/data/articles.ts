/** Метаданные статей: полный текст — в messages под `articleRattanThickness`. */
export type ArticleStatus = "published" | "soon";

type ArticleCardKeys = {
  cardTitleKey: "card_1_title" | "card_2_title" | "card_3_title" | "card_4_title";
  cardDescKey: "card_1_desc" | "card_2_desc" | "card_3_desc" | "card_4_desc";
};

export type ArticleRecord = { slug: string } & ArticleCardKeys &
  (
    | {
        status: "published";
        publishedAt: string;
        messageNamespace:
          | "articleRattanThickness"
          | "articlePlantersOutdoor"
          | "articleWholesaleTimelines"
          | "articleWhatIsRattan";
      }
    | { status: "soon" }
  );

export const ARTICLES: ArticleRecord[] = [
  {
    slug: "rattan-thickness-furniture",
    status: "published",
    publishedAt: "2026-03-20",
    cardTitleKey: "card_1_title",
    cardDescKey: "card_1_desc",
    messageNamespace: "articleRattanThickness",
  },
  {
    slug: "planters-outdoor-uv-drainage",
    status: "published",
    publishedAt: "2026-04-15",
    cardTitleKey: "card_2_title",
    cardDescKey: "card_2_desc",
    messageNamespace: "articlePlantersOutdoor",
  },
  {
    slug: "wholesale-horeca-timelines",
    status: "published",
    publishedAt: "2026-04-16",
    cardTitleKey: "card_3_title",
    cardDescKey: "card_3_desc",
    messageNamespace: "articleWholesaleTimelines",
  },
  {
    slug: "what-is-artificial-rattan",
    status: "published",
    publishedAt: "2026-04-24",
    cardTitleKey: "card_4_title",
    cardDescKey: "card_4_desc",
    messageNamespace: "articleWhatIsRattan",
  },
];

export function getArticleBySlug(slug: string) {
  return ARTICLES.find((a) => a.slug === slug);
}

export function getPublishedSlugs(): string[] {
  return getPublishedArticles().map((a) => a.slug);
}

export function getPublishedArticles() {
  return ARTICLES.filter(
    (a): a is Extract<ArticleRecord, { status: "published" }> =>
      a.status === "published",
  ).sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}
