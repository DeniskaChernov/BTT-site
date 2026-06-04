"use client";

import { getPublishedArticlesByKind } from "@/data/articles";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

export function HomeNewsTicker() {
  const t = useTranslations("home");
  const ta = useTranslations("articles");
  const news = getPublishedArticlesByKind("news").slice(0, 3);
  const guides = getPublishedArticlesByKind("guide").slice(0, 3 - news.length);
  const items = [...news, ...guides].slice(0, 3);

  if (items.length === 0) return null;

  return (
    <div className="border-y border-white/[0.06] bg-white/[0.02] py-3">
      <div className="btt-container flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
        <span className="font-semibold text-amber-400/90">{t("news_ticker_label")}</span>
        <ul className="flex flex-wrap gap-x-4 gap-y-1">
          {items.map((a) => (
            <li key={a.slug}>
              <Link
                href={`/articles/${a.slug}`}
                className="text-stone-400 transition hover:text-stone-200"
              >
                {ta(a.cardTitleKey)}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
