import { getPublishedSlugs, getArticleBySlug } from "@/data/articles";
import { Link } from "@/i18n/navigation";
import { ArrowLeft } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export function generateStaticParams() {
  const slugs = getPublishedSlugs();
  return (["ru", "uz", "en"] as const).flatMap((locale) =>
    slugs.map((slug) => ({ locale, slug })),
  );
}

export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article || article.status !== "published") {
    return { title: { absolute: "Bententrade" } };
  }
  const t = await getTranslations({
    locale,
    namespace: article.messageNamespace,
  });
  return {
    title: t("title"),
    description: t("meta_description"),
  };
}

export default async function ArticleDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article || article.status !== "published") {
    notFound();
  }

  const t = await getTranslations({
    locale,
    namespace: article.messageNamespace,
  });
  const ta = await getTranslations({ locale, namespace: "articles" });

  return (
    <div className="btt-container py-14 md:py-20">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/articles"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-stone-400 transition hover:text-amber-400"
        >
          <ArrowLeft className="h-4 w-4" />
          {ta("back_to_list")}
        </Link>

        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-500/85">
          {ta("kicker")}
        </p>
        <h1 className="mt-3 text-balance text-3xl font-bold tracking-tight text-stone-50 md:text-4xl">
          {t("title")}
        </h1>
        <p className="mt-2 text-sm text-stone-500">
          {t("date_display")} · {t("reading_time")}
        </p>
        <p className="mt-6 text-pretty text-lg leading-relaxed text-stone-300">
          {t("lead")}
        </p>

        <article className="mt-10 space-y-4 text-base leading-relaxed text-stone-400">
          <p>{t("intro")}</p>

          <h2 className="scroll-mt-24 pt-6 text-xl font-semibold text-stone-100 md:text-2xl">
            {t("sec1_h")}
          </h2>
          <p>{t("sec1_a")}</p>
          <p>{t("sec1_b")}</p>

          <h2 className="scroll-mt-24 pt-6 text-xl font-semibold text-stone-100 md:text-2xl">
            {t("sec2_h")}
          </h2>
          <p>{t("sec2_a")}</p>
          <p>{t("sec2_b")}</p>

          <h2 className="scroll-mt-24 pt-6 text-xl font-semibold text-stone-100 md:text-2xl">
            {t("sec3_h")}
          </h2>
          <p>{t("sec3_a")}</p>
          <p>{t("sec3_b")}</p>

          <p className="mt-8 border-l-2 border-amber-500/40 pl-4 text-stone-300">
            {t("outro")}
          </p>
        </article>

        <div className="mt-12 flex flex-wrap gap-3 border-t border-white/[0.08] pt-10">
          <Link
            href="/catalog"
            className="inline-flex items-center rounded-full border border-amber-500/35 bg-amber-500/10 px-4 py-2 text-sm font-semibold text-amber-100 transition hover:border-amber-400/50 hover:bg-amber-500/15"
          >
            {ta("cta_catalog")}
          </Link>
          <Link
            href="/contacts"
            className="inline-flex items-center rounded-full border border-white/15 bg-white/[0.04] px-4 py-2 text-sm font-semibold text-stone-200 transition hover:border-white/25"
          >
            {ta("cta_contacts")}
          </Link>
        </div>
      </div>
    </div>
  );
}
