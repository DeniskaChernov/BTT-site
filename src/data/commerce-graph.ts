import type { TopicTag } from "@/lib/intent/types";

export type GraphEdge = {
  from: string;
  to: string;
  weight: number;
  relation: "recommends" | "supports" | "alternative" | "upsell";
};

export const COMMERCE_GRAPH_EDGES: GraphEdge[] = [
  { from: "article:rattan-thickness-furniture", to: "RTN-HR-5-NAT", weight: 100, relation: "recommends" },
  { from: "article:rattan-thickness-furniture", to: "RTN-FL-6-BLK", weight: 90, relation: "recommends" },
  { from: "article:rattan-thickness-furniture", to: "RTN-RD-6-NAT", weight: 85, relation: "recommends" },
  { from: "article:planters-outdoor-uv-drainage", to: "planter-bowl-s", weight: 95, relation: "recommends" },
  { from: "article:planters-outdoor-uv-drainage", to: "RTN-HR-6-NAT", weight: 70, relation: "recommends" },
  { from: "article:wholesale-horeca-timelines", to: "RTN-FL-6-BLK", weight: 60, relation: "recommends" },
  { from: "article:what-is-artificial-rattan", to: "RTN-HR-5-NAT", weight: 75, relation: "recommends" },
  { from: "topic:furniture", to: "RTN-HR-5-NAT", weight: 40, relation: "supports" },
  { from: "topic:planter", to: "RTN-HR-6-NAT", weight: 35, relation: "supports" },
  { from: "topic:semi_tube", to: "RTN-ST-2708-2-NAT", weight: 50, relation: "supports" },
  { from: "topic:twisted", to: "RTN-TW-RD-6-NAT", weight: 45, relation: "supports" },
  { from: "topic:wholesale", to: "RTN-FL-6-BLK", weight: 55, relation: "supports" },
  { from: "topic:export", to: "RTN-FL-6-BLK", weight: 40, relation: "supports" },
  { from: "topic:outdoor", to: "RTN-HR-6-NAT", weight: 30, relation: "supports" },
  { from: "topic:furniture", to: "RTN-RD-6-NAT", weight: 35, relation: "alternative" },
  { from: "quiz:seating", to: "RTN-HR-5-NAT", weight: 80, relation: "recommends" },
  { from: "quiz:seating", to: "RTN-FL-6-BLK", weight: 70, relation: "recommends" },
  { from: "quiz:seating", to: "RTN-RD-6-NAT", weight: 65, relation: "recommends" },
  { from: "quiz:planter_weave", to: "RTN-HR-6-NAT", weight: 75, relation: "recommends" },
  { from: "cart:material_hr", to: "RTN-FL-6-BLK", weight: 40, relation: "upsell" },
  { from: "cart:material_hr", to: "RTN-TW-RD-6-NAT", weight: 35, relation: "upsell" },
  { from: "cart:planter", to: "RTN-HR-6-NAT", weight: 50, relation: "upsell" },
];

export const BUSINESS_PRIORITY_SKUS: Record<string, number> = {
  "RTN-HR-5-NAT": 14,
  "RTN-ST-2708-2-NAT": 12,
  "RTN-TW-RD-6-NAT": 10,
};

export const ARTICLE_TOPICS: Record<string, TopicTag[]> = {
  "rattan-thickness-furniture": ["rattan", "furniture"],
  "planters-outdoor-uv-drainage": ["planter", "outdoor"],
  "wholesale-horeca-timelines": ["wholesale"],
  "what-is-artificial-rattan": ["rattan"],
};

function sumEdges(from: string, sku: string): number {
  return COMMERCE_GRAPH_EDGES.filter((e) => e.from === from && e.to === sku).reduce(
    (sum, e) => sum + e.weight,
    0,
  );
}

export function graphScoreForProduct(articleSlug: string | undefined, sku: string): number {
  if (!articleSlug) return 0;
  return sumEdges(`article:${articleSlug}`, sku);
}

export function graphScoreFromTopics(topics: TopicTag[], sku: string): number {
  return topics.reduce((sum, t) => sum + sumEdges(`topic:${t}`, sku), 0);
}

export function graphScoreFromCartContext(cartSkus: string[], sku: string): number {
  let score = 0;
  for (const cartSku of cartSkus) {
    if (cartSku.includes("planter") || cartSku.startsWith("KSH-")) {
      score += sumEdges("cart:planter", sku);
    }
    if (cartSku.includes("HR-")) score += sumEdges("cart:material_hr", sku);
  }
  return score;
}

export function graphScoreForQuiz(
  workGoal: "furniture" | "planter" | null,
  furnitureUse: "seating" | "other" | null,
  planterPath: "ready" | "weave" | null,
  sku: string,
): number {
  if (workGoal === "furniture" && furnitureUse === "seating") {
    return sumEdges("quiz:seating", sku);
  }
  if (workGoal === "planter" && planterPath === "weave") {
    return sumEdges("quiz:planter_weave", sku);
  }
  return 0;
}

export function topicScoreForProduct(
  topics: TopicTag[],
  productSku: string,
  productShape: string,
  productCategory?: "material" | "planter" | "new",
): number {
  let score = 0;
  if (topics.includes("furniture") && productShape === "half_round") score += 25;
  if (
    topics.includes("planter") &&
    (productCategory === "planter" ||
      productSku.includes("planter") ||
      productSku.startsWith("KSH-"))
  ) {
    score += 40;
  }
  if (topics.includes("semi_tube") && productSku.includes("RTN-ST-")) score += 35;
  if (topics.includes("twisted") && productSku.includes("-TW-")) score += 35;
  if (topics.includes("wholesale") && !productSku.includes("planter")) score += 15;
  if (topics.includes("outdoor")) score += 10;
  if (
    topics.includes("rattan") &&
    !productSku.includes("-TW-") &&
    !productSku.includes("RTN-ST-")
  ) {
    score += 20;
  }
  return score;
}
