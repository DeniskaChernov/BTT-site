import type { Product } from "@/types/product";

export type JourneyType = "master" | "production" | "knowledge" | "unknown";

export type TopicTag =
  | "rattan"
  | "semi_tube"
  | "twisted"
  | "planter"
  | "furniture"
  | "wholesale"
  | "outdoor"
  | "export";

export type RankPurpose =
  | "quiz_result"
  | "article_followup"
  | "pdp_cross_sell"
  | "catalog_smart_sort"
  | "cart_upsell"
  | "home_hits";

export type ViewedSku = { sku: string; at: number; dwellMs?: number };
export type ReadArticle = { slug: string; depth: number; at: number };

export type FilterSnapshot = {
  tab?: string;
  kind?: string;
  shape?: string;
  stock?: string;
};

export type IntentProfile = {
  journey: JourneyType;
  topics: TopicTag[];
  volumeIntent: "retail" | "bulk" | "unknown";
  viewedSkus: ViewedSku[];
  readArticles: ReadArticle[];
  cartSkus: string[];
  lastCatalogFilters: FilterSnapshot;
  confidence: number;
  updatedAt: number;
};

export type ScoreBreakdown = {
  sku: string;
  total: number;
  parts: Record<string, number>;
};

export type RankContext = {
  profile: IntentProfile;
  purpose: RankPurpose;
  currentSlug?: string;
  currentArticleSlug?: string;
  excludeSkus?: string[];
  limit?: number;
  explain?: boolean;
};

export type ProductRankResult = {
  product: Product;
  score: number;
  breakdown?: ScoreBreakdown;
};

export const EMPTY_PROFILE: IntentProfile = {
  journey: "unknown",
  topics: [],
  volumeIntent: "unknown",
  viewedSkus: [],
  readArticles: [],
  cartSkus: [],
  lastCatalogFilters: {},
  confidence: 0,
  updatedAt: 0,
};
