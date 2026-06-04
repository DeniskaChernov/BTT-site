"use client";

import { useIntent } from "@/contexts/IntentContext";
import type { JourneyType } from "@/lib/intent/types";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

const JOURNEYS: JourneyType[] = ["master", "production", "knowledge"];
const LABEL_KEYS: Record<JourneyType, string> = {
  master: "journey_master",
  production: "journey_production",
  knowledge: "journey_knowledge",
  unknown: "journey_auto",
};

export function JourneyPill({ className }: { className?: string }) {
  const { profile, setJourneyType, ready } = useIntent();
  const t = useTranslations("intent");
  if (!ready) return null;
  const active = profile.journey === "unknown" ? null : profile.journey;

  return (
    <div
      className={cn(
        "flex items-center gap-1 rounded-full border border-white/[0.12] bg-white/[0.06] p-0.5",
        className,
      )}
      role="group"
      aria-label={t("journey_label")}
    >
      {JOURNEYS.map((j) => (
        <button
          key={j}
          type="button"
          onClick={() => setJourneyType(j)}
          className={cn(
            "btt-focus rounded-full px-2.5 py-1 text-[11px] font-semibold transition",
            active === j
              ? "bg-gradient-to-b from-amber-500/30 to-orange-950/40 text-amber-100 ring-1 ring-amber-500/35"
              : "text-stone-400 hover:bg-white/[0.06] hover:text-stone-200",
          )}
        >
          {t(LABEL_KEYS[j])}
        </button>
      ))}
    </div>
  );
}
