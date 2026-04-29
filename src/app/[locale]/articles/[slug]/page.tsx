import { getPublishedArticles, getPublishedSlugs, getArticleBySlug } from "@/data/articles";
import { PageBackNav } from "@/components/layout/PageBackNav";
import { Link } from "@/i18n/navigation";
import { buildAlternates } from "@/lib/seo";
import { SITE_ORIGIN } from "@/lib/seo";
import { SITE_MEDIA } from "@/lib/site-media";
import {
  bttSecondaryAmberButtonClass,
  bttSecondaryNeutralButtonClass,
} from "@/lib/ui-classes";
import Image from "next/image";
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
    alternates: buildAlternates(locale, `/articles/${slug}`),
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
  const related = getPublishedArticles().filter((x) => x.slug !== slug).slice(0, 2);

  const articleImagesBySlug: Record<string, { src: string; alt: string; caption: string }[]> = {
    "rattan-thickness-furniture": [
      {
        src: SITE_MEDIA.categoryCard("btt-cat-rattan"),
        alt: t("image_1_alt"),
        caption: t("image_1_caption"),
      },
      {
        src: SITE_MEDIA.categoryCard("btt-cat-twist"),
        alt: t("image_2_alt"),
        caption: t("image_2_caption"),
      },
    ],
    "planters-outdoor-uv-drainage": [
      {
        src: SITE_MEDIA.categoryCard("btt-cat-planter"),
        alt: t("image_1_alt"),
        caption: t("image_1_caption"),
      },
      {
        src: SITE_MEDIA.heroPanel,
        alt: t("image_2_alt"),
        caption: t("image_2_caption"),
      },
    ],
    "wholesale-horeca-timelines": [
      {
        src: SITE_MEDIA.heroPanel,
        alt: t("image_1_alt"),
        caption: t("image_1_caption"),
      },
      {
        src: SITE_MEDIA.categoryCard("btt-cat-new"),
        alt: t("image_2_alt"),
        caption: t("image_2_caption"),
      },
    ],
    "what-is-artificial-rattan": [
      {
        src: SITE_MEDIA.categoryCard("btt-cat-rattan"),
        alt: t("image_1_alt"),
        caption: t("image_1_caption"),
      },
      {
        src: SITE_MEDIA.categoryCard("btt-cat-twist"),
        alt: t("image_2_alt"),
        caption: t("image_2_caption"),
      },
    ],
  };
  const gallery = articleImagesBySlug[slug] ?? [];

  const relatedCover: Record<string, string> = {
    "rattan-thickness-furniture": SITE_MEDIA.categoryCard("btt-cat-rattan"),
    "planters-outdoor-uv-drainage": SITE_MEDIA.categoryCard("btt-cat-planter"),
    "wholesale-horeca-timelines": SITE_MEDIA.heroPanel,
    "what-is-artificial-rattan": SITE_MEDIA.categoryCard("btt-cat-twist"),
  };
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: t("title"),
    description: t("meta_description"),
    author: {
      "@type": "Organization",
      name: "Bententrade",
    },
    publisher: {
      "@type": "Organization",
      name: "Bententrade",
      logo: {
        "@type": "ImageObject",
        url: `${SITE_ORIGIN}/favicon.ico`,
      },
    },
    mainEntityOfPage: `${SITE_ORIGIN}/${locale}/articles/${slug}`,
    inLanguage: locale,
  };

  return (
    <div className="btt-container py-14 md:py-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <div className="mx-auto max-w-3xl">
        <PageBackNav fallbackHref="/articles" />

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

        {gallery.length > 0 ? (
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {gallery.map((img) => (
              <figure
                key={`${slug}-${img.src}`}
                className="overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03] p-2"
              >
                <div className="relative aspect-[16/11] overflow-hidden rounded-xl">
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                    loading="lazy"
                  />
                </div>
                <figcaption className="px-2 pb-1 pt-2 text-xs leading-relaxed text-stone-500">
                  {img.caption}
                </figcaption>
              </figure>
            ))}
          </div>
        ) : null}

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
            className={bttSecondaryAmberButtonClass}
          >
            {ta("cta_catalog")}
          </Link>
          <Link
            href="/contacts"
            className={bttSecondaryNeutralButtonClass}
          >
            {ta("cta_contacts")}
          </Link>
        </div>

        {related.length > 0 ? (
          <section className="mt-12 border-t border-white/[0.08] pt-10">
            <h2 className="text-xl font-semibold text-stone-100">{ta("related_title")}</h2>
            <p className="mt-2 text-sm text-stone-500">{ta("related_lead")}</p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {related.map((x) => (
                <Link
                  key={x.slug}
                  href={`/articles/${x.slug}`}
                  className="btt-focus overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03] transition hover:border-amber-500/30"
                >
                  <div className="relative aspect-[16/10]">
                    <Image
                      src={
                        relatedCover[x.slug] ?? SITE_MEDIA.categoryCard("btt-cat-rattan")
                      }
                      alt={ta(x.cardTitleKey)}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                  </div>
                  <div className="p-4">
                    <p className="text-sm font-semibold text-stone-100">{ta(x.cardTitleKey)}</p>
                    <p className="mt-1 text-xs text-stone-500">{ta(x.cardDescKey)}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </div>
  );
}
