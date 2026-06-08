"use client";

import { StaggerHits } from "@/components/home/StaggerHits";
import { useIntent } from "@/contexts/IntentContext";
import { rankProductsSimple } from "@/lib/intent/rank-products";
import type { RankPurpose } from "@/lib/intent/types";
import type { Product } from "@/types/product";
import { useMemo } from "react";

type Props = { fallback: Product[]; purpose?: RankPurpose };

export function HomeHitsGrid({ fallback, purpose = "home_hits" }: Props) {
  const { profile, ready } = useIntent();

  const hits = useMemo(() => {
    if (!ready || fallback.length === 0) return fallback;
    return rankProductsSimple(fallback, {
      profile,
      purpose,
      limit: 6,
    });
  }, [fallback, profile, purpose, ready]);

  return <StaggerHits products={hits} />;
}
