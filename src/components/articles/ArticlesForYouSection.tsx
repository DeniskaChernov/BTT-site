"use client";

import { getPublishedArticles } from "@/data/articles";
import { useIntent } from "@/contexts/IntentContext";
import { Link } from "@/i18n/navigation";
import { rankArticles } from "@/lib/intent/rank-articles";
import { getArticleCoverPath } from "@/lib/article-cover";
import { SITE_MEDIA } from "@/lib/site-media";
import { withJourneyHref } from "@/lib/journey/href";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useMemo } from "react";

export function ArticlesForYouSection() {
  const t = useTranslations("articles");
  const { profile, ready } = useIntent();

  const picks = useMemo(() => {
    if (!ready || profile.confidence <= 0.1) return [];
    return rankArticles(getPublishedArticles(), profile, undefined, 3);
  }, [profile, ready]);

  if (picks.length === 0) return null;

  return (
    <section className="mt-10 rounded-[1.75rem] border border-amber-500/20 bg-gradient-to-b from-amber-950/25 to-transparent p-6 md:p-8">
      <h2 className="text-xl font-bold text-stone-50">{t("for_you_title")}</h2>
      <p className="mt-2 text-sm text-stone-400">{t("for_you_lead")}</p>
      <ul className="mt-6 grid gap-4 sm:grid-cols-3">
        {picks.map((a) => (
          <li key={a.slug}>
            <Link
              href={withJourneyHref(`/articles/${a.slug}`, profile.journey)}
              className="btt-focus group block overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03] transition hover:border-amber-500/35"
            >
              <div className="relative aspect-[16/10]">
                <Image
                  src={getArticleCoverPath(a.slug) ?? SITE_MEDIA.categoryCard("btt-cat-rattan")}
                  alt={t(a.cardTitleKey)}
                  fill
                  sizes="(max-width:768px) 100vw, 33vw"
                  className="object-cover transition duration-300 group-hover:scale-[1.02] motion-reduce:group-hover:scale-100"
                />
              </div>
              <div className="p-4">
                <p className="text-sm font-semibold text-stone-100">{t(a.cardTitleKey)}</p>
                <p className="mt-1 line-clamp-2 text-xs text-stone-500">{t(a.cardDescKey)}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
