import type { Product } from "@/types/product";

/** SKU с бейджем «эксклюзив» в подборе (кручёный / круглый 6 мм натуральный) */
export const QUIZ_EXCLUSIVE_SKUS = new Set<string>(["RTN-RD-6-NAT"]);

export type QuizWorkGoal = "furniture" | "planter";
export type QuizFurnitureUse = "seating" | "other";
export type QuizPlanterPath = "ready" | "weave";

export type QuizRecommendContext = {
  productKind: "material" | "planter";
  place: Product["application"] | null;
  workGoal: QuizWorkGoal;
  furnitureUse: QuizFurnitureUse | null;
  planterPath: QuizPlanterPath | null;
};

function filterByKindAndPlace(
  list: Product[],
  productKind: "material" | "planter",
  place: Product["application"] | null,
): Product[] {
  let out = list.filter((p) =>
    productKind === "planter" ? p.category === "planter" : p.category !== "planter",
  );
  // Нитка/профиль: для материала нет смысла отсеивать «улицу/дом» — поведение одно и то же.
  if (productKind === "material") {
    return out;
  }
  if (place === "outdoor") {
    out = out.filter(
      (p) => p.application === "outdoor" || p.application === "both",
    );
  } else if (place === "indoor") {
    out = out.filter(
      (p) => p.application === "indoor" || p.application === "both",
    );
  }
  return out;
}

/**
 * Правила подбора по брифу: мебель (столы/стулья → полумесяц + плоский + круглый эксклюзив),
 * кашпо готовые (чаша ≈ полусфера вперёд), кашпо своё плетение (полукруг 6 мм впереди).
 */
export function pickQuizRecommendations(
  all: Product[],
  ctx: QuizRecommendContext,
): Product[] {
  const list = filterByKindAndPlace(all, ctx.productKind, ctx.place);

  if (ctx.workGoal === "furniture" && ctx.furnitureUse === "seating") {
    const preference = ["RTN-HR-5-NAT", "RTN-FL-6-BLK", "RTN-RD-6-NAT"] as const;
    const ordered: Product[] = [];
    for (const sku of preference) {
      const hit = list.find((p) => p.sku === sku);
      if (hit) ordered.push(hit);
    }
    for (const p of list) {
      if (ordered.length >= 3) break;
      if (!ordered.some((o) => o.sku === p.sku)) ordered.push(p);
    }
    return ordered.slice(0, 3);
  }

  if (ctx.workGoal === "planter" && ctx.planterPath === "weave") {
    const sorted = [...list].sort((a, b) => {
      const score = (p: Product) => {
        if (p.shape === "half_round" && p.thicknessMm === 6) return 0;
        if (p.shape === "half_round") return 1;
        return 2;
      };
      return score(a) - score(b);
    });
    return sorted.slice(0, 3);
  }

  if (ctx.workGoal === "planter" && ctx.planterPath === "ready") {
    const sorted = [...list].sort((a, b) => {
      const aw = a.slug === "planter-bowl-s" ? 1 : 0;
      const bw = b.slug === "planter-bowl-s" ? 1 : 0;
      return bw - aw;
    });
    return sorted.slice(0, 3);
  }

  return list.slice(0, 3);
}
