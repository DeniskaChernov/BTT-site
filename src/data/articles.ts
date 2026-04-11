/** Метаданные статей: полный текст — в messages под `articleRattanThickness`. */
export type ArticleStatus = "published" | "soon";

type ArticleCardKeys = {
  cardTitleKey: "card_1_title" | "card_2_title" | "card_3_title";
  cardDescKey: "card_1_desc" | "card_2_desc" | "card_3_desc";
};

export type ArticleRecord = { slug: string } & ArticleCardKeys &
  (
    | { status: "published"; messageNamespace: "articleRattanThickness" }
    | { status: "soon" }
  );

export const ARTICLES: ArticleRecord[] = [
  {
    slug: "rattan-thickness-furniture",
    status: "published",
    cardTitleKey: "card_1_title",
    cardDescKey: "card_1_desc",
    messageNamespace: "articleRattanThickness",
  },
  {
    slug: "planters-outdoor-uv-drainage",
    status: "soon",
    cardTitleKey: "card_2_title",
    cardDescKey: "card_2_desc",
  },
  {
    slug: "wholesale-horeca-timelines",
    status: "soon",
    cardTitleKey: "card_3_title",
    cardDescKey: "card_3_desc",
  },
];

export function getArticleBySlug(slug: string) {
  return ARTICLES.find((a) => a.slug === slug);
}

export function getPublishedSlugs(): string[] {
  return ARTICLES.filter((a) => a.status === "published").map((a) => a.slug);
}
