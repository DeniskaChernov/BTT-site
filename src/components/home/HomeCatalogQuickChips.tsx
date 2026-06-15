"use client";

import { Link } from "@/i18n/navigation";
import { BTT_EVENTS, trackBttEvent } from "@/lib/analytics";
import { useTranslations } from "next-intl";

const CHIP_GROUPS = [
  {
    id: "stock",
    labelKey: "quick_chips_stock",
    chips: [
      { key: "in_stock", href: "/catalog?stock=in_stock" },
      { key: "on_order", href: "/catalog?stock=on_order" },
    ],
  },
  {
    id: "catalog",
    labelKey: "quick_chips_catalog",
    chips: [
      { key: "twisted", href: "/catalog?kind=twisted" },
      { key: "planter", href: "/catalog?tab=planter" },
      { key: "furniture", href: "/catalog/furniture" },
    ],
  },
] as const;

export function HomeCatalogQuickChips() {
  const t = useTranslations("home");

  return (
    <section className="btt-container py-6 md:py-8" aria-labelledby="home-quick-chips">
      <h2 id="home-quick-chips" className="sr-only">
        {t("quick_chips_title")}
      </h2>
      <div className="flex flex-col gap-4 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 backdrop-blur-sm md:flex-row md:items-center md:gap-8 md:p-5">
        {CHIP_GROUPS.map(({ id, labelKey, chips }) => (
          <div key={id} className="min-w-0 flex-1">
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-stone-500">
              {t(labelKey)}
            </p>
            <div className="flex flex-wrap gap-2">
              {chips.map(({ key, href }) => (
                <Link
                  key={key}
                  href={href}
                  onClick={() =>
                    trackBttEvent(BTT_EVENTS.CatalogFilterApply, {
                      key: "home_chip",
                      value: key,
                    })
                  }
                  className="btt-focus rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm font-medium text-stone-200 transition hover:border-amber-500/40 hover:bg-amber-950/25 hover:text-amber-50"
                >
                  {t(`quick_chip_${key}`)}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
