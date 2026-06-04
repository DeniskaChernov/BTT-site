import type { TopicTag } from "@/lib/intent/types";

export type GraphEdge = {
  from: string;
  to: string;
  weight: number;
  relation: "recommends" | "supports" | "alternative" | "upsell";
};

/** Явные связи контент ↔ товар для scoring без ML */
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
];

export const ARTICLE_TOPICS: Record<string, TopicTag[]> = {
  "rattan-thickness-furniture": ["rattan", "furniture"],
  "planters-outdoor-uv-drainage": ["planter", "outdoor"],
  "wholesale-horeca-timelines": ["wholesale"],
  "what-is-artificial-rattan": ["rattan"],
};

export function graphScoreForProduct(articleSlug: string | undefined, sku: string): number {
  if (!articleSlug) return 0;
  const key = `article:${articleSlug}`;
  return COMMERCE_GRAPH_EDGES.filter((e) => e.from === key && e.to === sku).reduce(
    (sum, e) => sum + e.weight,
    0,
  );
}

export function topicScoreForProduct(topics: TopicTag[], productSku: string, productShape: string): number {
  let score = 0;
  if (topics.includes("furniture") && productShape === "half_round") score += 25;
  if (topics.includes("planter") && productSku.includes("planter")) score += 40;
  if (topics.includes("semi_tube") && productSku.includes("RTN-ST-")) score += 35;
  if (topics.includes("twisted") && productSku.includes("-TW-")) score += 35;
  if (topics.includes("wholesale") && !productSku.includes("planter")) score += 15;
  if (topics.includes("outdoor")) score += 10;
  if (topics.includes("rattan") && !productSku.includes("-TW-") && !productSku.includes("RTN-ST-")) score += 20;
  return score;
}
