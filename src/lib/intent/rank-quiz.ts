import type { Product } from "@/types/product";
import {
  pickQuizRecommendations,
  type QuizRecommendContext,
} from "@/lib/quiz-recommendations";
import { rankProductsSimple } from "@/lib/intent/rank-products";
import type { IntentProfile } from "@/lib/intent/types";

export function rankQuizRecommendations(
  all: Product[],
  quizCtx: QuizRecommendContext,
  profile: IntentProfile,
  limit = 3,
): Product[] {
  const rulePool = pickQuizRecommendations(all, quizCtx);
  const expanded =
    rulePool.length >= limit
      ? rulePool
      : [...rulePool, ...all.filter((p) => !rulePool.some((r) => r.sku === p.sku))].slice(
          0,
          16,
        );

  return rankProductsSimple(
    expanded,
    { profile, purpose: "quiz_result", limit },
    {
      quizMeta: {
        workGoal: quizCtx.workGoal,
        furnitureUse: quizCtx.furnitureUse,
        planterPath: quizCtx.planterPath,
      },
      diversify: true,
    },
  );
}
