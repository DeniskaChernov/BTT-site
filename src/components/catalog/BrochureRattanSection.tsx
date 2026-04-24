"use client";

import { BROCHURE_RATTAN_CARDS } from "@/data/brochure-rattan";
import Image from "next/image";
import { useTranslations } from "next-intl";

export function BrochureRattanSection() {
  const t = useTranslations("catalog");
  const semi = BROCHURE_RATTAN_CARDS.filter((x) => x.section === "semi_tube");
  const twisted = BROCHURE_RATTAN_CARDS.filter((x) => x.section === "twisted");

  return (
    <section className="mt-10 space-y-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-500/90">
          {t("pdf_cards_kicker")}
        </p>
        <h2 className="mt-2 text-xl font-semibold text-stone-100 md:text-2xl">
          {t("pdf_cards_title")}
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-stone-400">{t("pdf_cards_sub")}</p>
      </div>

      <div className="space-y-3">
        <h3 className="text-base font-semibold text-stone-200">{t("pdf_cards_semi")}</h3>
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {semi.map((x) => (
            <li
              key={`${x.section}-${x.article}-${x.image}`}
              className="overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.02]"
            >
              <div className="relative aspect-[4/3]">
                <Image src={x.image} alt={`ART ${x.article}`} fill className="object-cover" />
              </div>
              <p className="px-3 py-2 text-xs font-semibold text-stone-200">ART: {x.article}</p>
            </li>
          ))}
        </ul>
      </div>

      <div className="space-y-3">
        <h3 className="text-base font-semibold text-stone-200">{t("pdf_cards_twisted")}</h3>
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {twisted.map((x) => (
            <li
              key={`${x.section}-${x.article}-${x.image}`}
              className="overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.02]"
            >
              <div className="relative aspect-[4/3]">
                <Image src={x.image} alt={`ART ${x.article}`} fill className="object-cover" />
              </div>
              <p className="px-3 py-2 text-xs font-semibold text-stone-200">ART: {x.article}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
