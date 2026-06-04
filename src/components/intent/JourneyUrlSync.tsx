"use client";

import { useIntent } from "@/contexts/IntentContext";
import { parseJourneyParam } from "@/lib/journey/orchestrator";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

export function JourneyUrlSync() {
  const searchParams = useSearchParams();
  const { setJourneyType, ready } = useIntent();

  useEffect(() => {
    if (!ready) return;
    const parsed = parseJourneyParam(searchParams.get("journey"));
    if (parsed) setJourneyType(parsed);
  }, [searchParams, setJourneyType, ready]);

  return null;
}
