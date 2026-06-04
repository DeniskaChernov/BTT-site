"use client";

import {
  loadIntentProfile,
  mergeProfile,
  recordArticleRead,
  recordCatalogFilters,
  recordViewedSku,
  saveIntentProfile,
  setJourney,
} from "@/lib/intent/profile";
import type { FilterSnapshot, IntentProfile, JourneyType } from "@/lib/intent/types";
import { EMPTY_PROFILE } from "@/lib/intent/types";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type IntentCtx = {
  profile: IntentProfile;
  ready: boolean;
  setJourneyType: (j: JourneyType) => void;
  trackViewSku: (sku: string) => void;
  trackArticleRead: (slug: string, depth: number) => void;
  trackCatalogFilters: (filters: FilterSnapshot) => void;
  syncCartSkus: (skus: string[]) => void;
};

const IntentContext = createContext<IntentCtx | null>(null);

export function IntentProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<IntentProfile>(EMPTY_PROFILE);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setProfile(loadIntentProfile());
    setReady(true);
  }, []);

  const updateProfile = useCallback((updater: (prev: IntentProfile) => IntentProfile) => {
    setProfile((prev) => {
      const next = updater(prev);
      saveIntentProfile(next);
      return next;
    });
  }, []);

  const setJourneyType = useCallback(
    (j: JourneyType) => updateProfile((prev) => setJourney(prev, j)),
    [updateProfile],
  );

  const trackViewSku = useCallback(
    (sku: string) => updateProfile((prev) => recordViewedSku(prev, sku)),
    [updateProfile],
  );

  const trackArticleRead = useCallback(
    (slug: string, depth: number) => updateProfile((prev) => recordArticleRead(prev, slug, depth)),
    [updateProfile],
  );

  const trackCatalogFilters = useCallback(
    (filters: FilterSnapshot) => updateProfile((prev) => recordCatalogFilters(prev, filters)),
    [updateProfile],
  );

  const syncCartSkus = useCallback(
    (skus: string[]) => updateProfile((prev) => mergeProfile(prev, { cartSkus: skus })),
    [updateProfile],
  );

  const value = useMemo(
    () => ({
      profile,
      ready,
      setJourneyType,
      trackViewSku,
      trackArticleRead,
      trackCatalogFilters,
      syncCartSkus,
    }),
    [profile, ready, setJourneyType, trackViewSku, trackArticleRead, trackCatalogFilters, syncCartSkus],
  );

  return <IntentContext.Provider value={value}>{children}</IntentContext.Provider>;
}

export function useIntent() {
  const ctx = useContext(IntentContext);
  if (!ctx) throw new Error("useIntent must be used within IntentProvider");
  return ctx;
}
