"use client";

import { readUtmFromSearch, trackEvent } from "@/lib/analytics";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

export function AnalyticsInit() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const utm = readUtmFromSearch(searchParams.toString());
    if (Object.keys(utm).length) {
      trackEvent("utm_capture", { utm });
    }
  }, [searchParams]);

  return null;
}
