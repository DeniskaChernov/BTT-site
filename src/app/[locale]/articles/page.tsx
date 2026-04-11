import { PageHero } from "@/components/layout/PageHero";
import { ARTICLES } from "@/data/articles";
import { Link } from "@/i18n/navigation";
import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";

type MetadataProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: MetadataProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "articles" });
  return {
    title: t("title"),
    description: t("lead"),
  };
}

export default async function ArticlesPage() {
  const t = await getTranslations("articles");

  return (
    <div className="btt-container py-14 md:py-20">
      <PageHero kicker={t("kicker")} title={t("title")} lead={t("lead")}>
        <p className="max-w-2xl text-pretty text-sm text-stone-500 md:text-base">{t("intro")}</p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/"
            className="inline-flex items-center rounded-full border border-amber-500/35 bg-amber-500/10 px-4 py-2 text-sm font-semibold text-amber-100 transition hover:border-amber-400/50 hover:bg-amber-500/15"
          >
            {t("cta_quiz")}
          </Link>
          <Link
            href="/catalog"
            className="inline-flex items-center rounded-full border border-white/15 bg-white/[0.04] px-4 py-2 text-sm font-semibold text-stone-200 transition hover:border-white/25"
          >
            {t("cta_catalog")}
          </Link>
        </div>
      </PageHero>

      <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {ARTICLES.map((a) => (
          <li
            key={a.slug}
            className="flex flex-col rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 backdrop-blur-md transition hover:border-amber-500/20 [box-shadow:inset_0_1px_0_0_rgba(255,255,255,0.06)]"
          >
            {a.status === "soon" ? (
              <span className="w-fit rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-amber-200/95">
                {t("badge_soon")}
              </span>
            ) : (
              <span className="w-fit rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-emerald-200/95">
                {t("badge_live")}
              </span>
            )}
            <h2 className="mt-4 text-lg font-semibold text-stone-100">{t(a.cardTitleKey)}</h2>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-stone-500">{t(a.cardDescKey)}</p>
            {a.status === "published" ? (
              <Link
                href={`/articles/${a.slug}`}
                className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-amber-400 transition hover:gap-2 hover:text-amber-300"
              >
                {t("read_article")}
                <ArrowRight className="h-4 w-4" />
              </Link>
            ) : (
              <span className="mt-6 text-sm text-stone-600">{t("soon_hint")}</span>
            )}
          </li>
        ))}
      </ul>

      <p className="mt-12 text-center text-sm text-stone-500">{t("cta_all")}</p>
    </div>
  );
}
