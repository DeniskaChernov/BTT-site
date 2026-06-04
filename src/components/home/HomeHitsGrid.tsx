"use client";

import { StaggerHits } from "@/components/home/StaggerHits";
import { useIntent } from "@/contexts/IntentContext";
import { rankProductsSimple } from "@/lib/intent/rank-products";
import { EMPTY_PROFILE } from "@/lib/intent/types";
import type { Product } from "@/types/product";
import { useMemo } from "react";

type Props = { fallback: Product[] };

export function HomeHitsGrid({ fallback }: Props) {
  const { profile, ready } = useIntent();

  const hits = useMemo(() => {
    if (!ready || fallback.length === 0) return fallback;
    return rankProductsSimple(fallback, {
      profile: profile.confidence > 0 ? profile : EMPTY_PROFILE,
      purpose: "home_hits",
      limit: 6,
    });
  }, [fallback, profile, ready]);

  return <StaggerHits products={hits} />;
}
