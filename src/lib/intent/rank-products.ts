import type { Product } from "@/types/product";
import {
  BUSINESS_PRIORITY_SKUS,
  graphScoreForProduct,
  graphScoreFromCartContext,
  graphScoreForQuiz,
  topicScoreForProduct,
} from "@/data/commerce-graph";
import { viewedSkuPenalty } from "@/lib/intent/profile";
import { productFamilyKey } from "@/lib/intent/product-family";
import {
  cartComplementScore,
  familyDiversityPenalty,
  filterAffinityScore,
  topicGraphScore,
  volumeIntentScore,
} from "@/lib/intent/scoring";
import type { ProductRankResult, RankContext } from "@/lib/intent/types";

type WeightSet = {
  graph: number;
  topic: number;
  topicGraph: number;
  stock: number;
  journey: number;
  repeat: number;
  cart: number;
  filter: number;
  volume: number;
  complement: number;
  margin: number;
  family: number;
};

const PURPOSE_WEIGHTS: Record<RankContext["purpose"], WeightSet> = {
  quiz_result: {
    graph: 0.55,
    topic: 1,
    topicGraph: 0.4,
    stock: 0.85,
    journey: 0.65,
    repeat: 0.9,
    cart: 0.4,
    filter: 0.3,
    volume: 0.7,
    complement: 0.2,
    margin: 0.5,
    family: 0.6,
  },
  article_followup: {
    graph: 1,
    topic: 0.95,
    topicGraph: 0.5,
    stock: 0.75,
    journey: 0.4,
    repeat: 0.85,
    cart: 0.35,
    filter: 0.5,
    volume: 0.4,
    complement: 0.3,
    margin: 0.35,
    family: 0.5,
  },
  pdp_cross_sell: {
    graph: 0.45,
    topic: 0.75,
    topicGraph: 0.45,
    stock: 0.65,
    journey: 0.35,
    repeat: 1.15,
    cart: 1.1,
    filter: 0.4,
    volume: 0.35,
    complement: 0.9,
    margin: 0.3,
    family: 1.2,
  },
  catalog_smart_sort: {
    graph: 0.55,
    topic: 1,
    topicGraph: 0.55,
    stock: 0.55,
    journey: 0.85,
    repeat: 0.95,
    cart: 0.45,
    filter: 1.1,
    volume: 0.75,
    complement: 0.25,
    margin: 0.4,
    family: 0.7,
  },
  cart_upsell: {
    graph: 0.35,
    topic: 0.55,
    topicGraph: 0.35,
    stock: 0.85,
    journey: 0.5,
    repeat: 1.4,
    cart: 2.2,
    filter: 0.2,
    volume: 0.5,
    complement: 1.4,
    margin: 0.45,
    family: 1.5,
  },
  home_hits: {
    graph: 0.5,
    topic: 0.85,
    topicGraph: 0.5,
    stock: 0.65,
    journey: 0.75,
    repeat: 0.75,
    cart: 0.35,
    filter: 0.35,
    volume: 0.45,
    complement: 0.2,
    margin: 0.55,
    family: 0.65,
  },
};

function journeyFit(
  journey: RankContext["profile"]["journey"],
  product: Product,
): number {
  if (journey === "production") {
    return product.category === "material" && product.stock === "in_stock" ? 20 : 8;
  }
  if (journey === "knowledge") return product.isBrochure ? 12 : 5;
  if (journey === "master") return product.stock === "in_stock" ? 15 : 5;
  return 0;
}

export type QuizRankMeta = {
  workGoal: "furniture" | "planter" | null;
  furnitureUse: "seating" | "other" | null;
  planterPath: "ready" | "weave" | null;
};

function scoreProduct(
  product: Product,
  ctx: RankContext,
  quizMeta?: QuizRankMeta,
  topFamily?: string | null,
): ProductRankResult {
  const w = PURPOSE_WEIGHTS[ctx.purpose];
  const { profile } = ctx;
  const parts: Record<string, number> = {};

  const articleGraph = graphScoreForProduct(ctx.currentArticleSlug, product.sku);
  const cartGraph =
    ctx.purpose === "cart_upsell" || ctx.purpose === "pdp_cross_sell"
      ? graphScoreFromCartContext(profile.cartSkus, product.sku)
      : 0;
  const quizGraph = quizMeta
    ? graphScoreForQuiz(
        quizMeta.workGoal,
        quizMeta.furnitureUse,
        quizMeta.planterPath,
        product.sku,
      )
    : 0;
  parts.graph = (articleGraph + cartGraph + quizGraph) * w.graph;

  parts.topic =
    topicScoreForProduct(profile.topics, product.sku, product.shape, product.category) *
    w.topic;
  parts.topicGraph = topicGraphScore(profile.topics, product.sku) * w.topicGraph;

  if (product.stock === "in_stock") parts.stock = 15 * w.stock;
  else parts.stock = 5 * w.stock;

  parts.journey = journeyFit(profile.journey, product) * w.journey;
  parts.repeat = -viewedSkuPenalty(profile, product.sku) * w.repeat;

  if (profile.cartSkus.includes(product.sku)) parts.cart = -55 * w.cart;
  else parts.cart = 0;

  parts.filter = filterAffinityScore(product, profile.lastCatalogFilters) * w.filter;
  parts.volume = volumeIntentScore(product, profile.volumeIntent) * w.volume;
  parts.complement = cartComplementScore(product, profile.cartSkus) * w.complement;
  parts.margin = (BUSINESS_PRIORITY_SKUS[product.sku] ?? 0) * w.margin;
  parts.family = familyDiversityPenalty(product, topFamily ?? null) * w.family;

  if (ctx.currentSlug && product.slug === ctx.currentSlug) parts.self = -999;
  else parts.self = 0;

  if (ctx.excludeSkus?.includes(product.sku)) parts.excluded = -999;
  else parts.excluded = 0;

  const total = Object.values(parts).reduce((a, b) => a + b, 0);

  return {
    product,
    score: total,
    breakdown: ctx.explain ? { sku: product.sku, total, parts } : undefined,
  };
}

export function diversifyRanked(
  ranked: ProductRankResult[],
  limit: number,
): ProductRankResult[] {
  const picked: ProductRankResult[] = [];
  const seenFamilies = new Set<string>();

  for (const row of ranked) {
    if (picked.length >= limit) break;
    const fam = productFamilyKey(row.product);
    if (seenFamilies.has(fam) && picked.length > 0) continue;
    seenFamilies.add(fam);
    picked.push(row);
  }

  if (picked.length < limit) {
    for (const row of ranked) {
      if (picked.length >= limit) break;
      if (picked.some((p) => p.product.sku === row.product.sku)) continue;
      picked.push(row);
    }
  }

  return picked;
}

export function rankProducts(
  candidates: Product[],
  ctx: RankContext,
  options?: { quizMeta?: QuizRankMeta; diversify?: boolean },
): ProductRankResult[] {
  const limit = ctx.limit ?? candidates.length;
  const prelim = candidates
    .map((p) => scoreProduct(p, ctx, options?.quizMeta, null))
    .filter((r) => r.score > -100)
    .sort((a, b) => b.score - a.score);

  const topFamily =
    prelim[0] != null ? productFamilyKey(prelim[0].product) : null;

  const rescored =
    topFamily && ctx.purpose !== "catalog_smart_sort"
      ? prelim
          .map((r) => scoreProduct(r.product, ctx, options?.quizMeta, topFamily))
          .filter((r) => r.score > -100)
          .sort((a, b) => b.score - a.score)
      : prelim;

  const sliced = rescored.slice(0, limit * 2);
  const diversify =
    options?.diversify !== false &&
    (ctx.purpose === "pdp_cross_sell" ||
      ctx.purpose === "cart_upsell" ||
      ctx.purpose === "home_hits" ||
      ctx.purpose === "quiz_result");

  return diversify ? diversifyRanked(sliced, limit) : sliced.slice(0, limit);
}

export function rankProductsSimple(
  candidates: Product[],
  ctx: RankContext,
  options?: { quizMeta?: QuizRankMeta; diversify?: boolean },
): Product[] {
  return rankProducts(candidates, ctx, options).map((r) => r.product);
}
