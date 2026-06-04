import type { Product } from "@/types/product";
import { graphScoreForProduct, topicScoreForProduct } from "@/data/commerce-graph";
import { viewedSkuPenalty } from "@/lib/intent/profile";
import type { ProductRankResult, RankContext } from "@/lib/intent/types";

const PURPOSE_WEIGHTS: Record<
  RankContext["purpose"],
  { graph: number; topic: number; stock: number; journey: number; repeat: number; cart: number }
> = {
  quiz_result: { graph: 0.5, topic: 1, stock: 0.8, journey: 0.6, repeat: 1, cart: 0.5 },
  article_followup: { graph: 1, topic: 0.9, stock: 0.7, journey: 0.4, repeat: 0.8, cart: 0.3 },
  pdp_cross_sell: { graph: 0.4, topic: 0.7, stock: 0.6, journey: 0.3, repeat: 1.2, cart: 1 },
  catalog_smart_sort: { graph: 0.6, topic: 1, stock: 0.5, journey: 0.8, repeat: 0.9, cart: 0.4 },
  cart_upsell: { graph: 0.3, topic: 0.5, stock: 0.8, journey: 0.5, repeat: 1.5, cart: 2 },
  home_hits: { graph: 0.5, topic: 0.8, stock: 0.6, journey: 0.7, repeat: 0.7, cart: 0.3 },
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

function scoreProduct(product: Product, ctx: RankContext): ProductRankResult {
  const w = PURPOSE_WEIGHTS[ctx.purpose];
  const { profile } = ctx;
  const parts: Record<string, number> = {};

  const graph = graphScoreForProduct(ctx.currentArticleSlug, product.sku);
  parts.graph = graph * w.graph;

  const topic = topicScoreForProduct(profile.topics, product.sku, product.shape);
  parts.topic = topic * w.topic;

  if (product.stock === "in_stock") parts.stock = 15 * w.stock;
  else parts.stock = 5 * w.stock;

  parts.journey = journeyFit(profile.journey, product) * w.journey;
  parts.repeat = -viewedSkuPenalty(profile, product.sku) * w.repeat;

  if (profile.cartSkus.includes(product.sku)) parts.cart = -50 * w.cart;
  else parts.cart = 0;

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

export function rankProducts(
  candidates: Product[],
  ctx: RankContext,
): ProductRankResult[] {
  const limit = ctx.limit ?? candidates.length;
  return candidates
    .map((p) => scoreProduct(p, ctx))
    .filter((r) => r.score > -100)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

export function rankProductsSimple(
  candidates: Product[],
  ctx: RankContext,
): Product[] {
  return rankProducts(candidates, ctx).map((r) => r.product);
}
