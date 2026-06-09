"use client";

import type { ArticleContentKind } from "@/data/articles";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

export type ArticlesHubFilter = "all" | ArticleContentKind;

type Props = {
  value: ArticlesHubFilter;
  onChange: (v: ArticlesHubFilter) => void;
};

const TABS: ArticlesHubFilter[] = ["all", "guide", "article", "news"];

export function ArticlesHubTabs({ value, onChange }: Props) {
  const t = useTranslations("articles");

  return (
    <div className="mt-8 flex flex-wrap gap-2" role="tablist" aria-label={t("hub_tabs_label")}>
      {TABS.map((tab) => (
        <button
          key={tab}
          type="button"
          role="tab"
          aria-selected={value === tab}
          onClick={() => onChange(tab)}
          className={cn(
            "rounded-full border px-4 py-2 text-sm font-medium transition",
            value === tab
              ? "border-amber-500/40 bg-amber-500/15 text-amber-100"
              : "border-white/10 bg-white/[0.03] text-stone-400 hover:border-white/20 hover:text-stone-200",
          )}
        >
          {t(`hub_tab_${tab}` as "hub_tab_all")}
        </button>
      ))}
    </div>
  );
}
