"use client";

import { Link } from "@/i18n/navigation";
import { BTT_EVENTS, trackBttEvent } from "@/lib/analytics";
import { useTranslations } from "next-intl";

const CHIPS = [
  { key: "in_stock", href: "/catalog?stock=in_stock" },
  { key: "on_order", href: "/catalog?stock=on_order" },
  { key: "planter", href: "/catalog?tab=planter" },
  { key: "twisted", href: "/catalog?kind=twisted" },
  { key: "furniture", href: "/catalog/furniture" },
] as const;

export function HomeCatalogQuickChips() {
  const t = useTranslations("home");

  return (
    <section className="btt-container py-6 md:py-8" aria-labelledby="home-quick-chips">
      <h2 id="home-quick-chips" className="sr-only">
        {t("quick_chips_title")}
      </h2>
      <div className="flex flex-wrap gap-2">
        {CHIPS.map(({ key, href }) => (
          <Link
            key={key}
            href={href}
            onClick={() =>
              trackBttEvent(BTT_EVENTS.CatalogFilterApply, {
                key: "home_chip",
                value: key,
              })
            }
            className="btt-focus rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm font-medium text-stone-200 transition hover:border-white/20 hover:bg-white/[0.06] hover:text-stone-50"
          >
            {t(`quick_chip_${key}`)}
          </Link>
        ))}
      </div>
    </section>
  );
}
