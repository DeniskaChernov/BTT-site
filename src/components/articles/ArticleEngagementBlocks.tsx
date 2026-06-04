"use client";

import { getPublishedArticles } from "@/data/articles";
import { products } from "@/data/products";
import { useIntent } from "@/contexts/IntentContext";
import { Link } from "@/i18n/navigation";
import { rankArticles } from "@/lib/intent/rank-articles";
import { rankProductsSimple } from "@/lib/intent/rank-products";
import { formatUzs, getPricePerKgForQty } from "@/lib/pricing";
import { productMainImage } from "@/lib/product-media";
import { getArticleCoverPath } from "@/lib/article-cover";
import { SITE_MEDIA } from "@/lib/site-media";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useMemo } from "react";
import type { Locale } from "@/types/product";

type Props = {
  slug: string;
};

export function ArticleEngagementBlocks({ slug }: Props) {
  const locale = useLocale() as Locale;
  const ta = useTranslations("articles");
  const tc = useTranslations("catalog");
  const tCommon = useTranslations("common");
  const { profile, trackArticleRead } = useIntent();

  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const depth = doc.scrollHeight > 0 ? (window.scrollY + window.innerHeight) / doc.scrollHeight : 0;
      if (depth >= 0.75) trackArticleRead(slug, Math.min(1, depth));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [slug, trackArticleRead]);

  const relatedArticles = useMemo(
    () => rankArticles(getPublishedArticles(), profile, slug, 2),
    [profile, slug],
  );

  const recommendedProducts = useMemo(
    () =>
      rankProductsSimple(products, {
        profile,
        purpose: "article_followup",
        currentArticleSlug: slug,
        limit: 3,
      }),
    [profile, slug],
  );

  return (
    <>
      {recommendedProducts.length > 0 ? (
        <section className="mt-12 border-t border-white/[0.08] pt-10">
          <h2 className="text-xl font-semibold text-stone-100">{ta("recommended_products_title")}</h2>
          <p className="mt-2 text-sm text-stone-500">{ta("recommended_products_lead")}</p>
          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            {recommendedProducts.map((p) => (
              <Link
                key={p.sku}
                href={`/product/${p.slug}?from=article:${slug}`}
                className="btt-focus overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03] transition hover:border-amber-500/30"
              >
                <div className="relative aspect-square">
                  <Image
                    src={productMainImage(p)}
                    alt={p.names[locale]}
                    fill
                    sizes="(max-width:768px) 100vw, 33vw"
                    className="object-cover"
                  />
                </div>
                <div className="p-3">
                  <p className="text-sm font-semibold text-stone-100">{p.names[locale]}</p>
                  <p className="mt-1 text-xs tabular-nums text-amber-300">
                    {tc("card_price_from", {
                      price: formatUzs(getPricePerKgForQty(p, 5)),
                      unit: tCommon("per_kg"),
                      moq: tc("card_moq_short", { min: "5" }),
                    })}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      {relatedArticles.length > 0 ? (
        <section className="mt-12 border-t border-white/[0.08] pt-10">
          <h2 className="text-xl font-semibold text-stone-100">{ta("related_title")}</h2>
          <p className="mt-2 text-sm text-stone-500">{ta("related_lead")}</p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {relatedArticles.map((x) => (
              <Link
                key={x.slug}
                href={`/articles/${x.slug}`}
                className="btt-focus overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03] transition hover:border-amber-500/30"
              >
                <div className="relative aspect-[16/10]">
                  <Image
                    src={getArticleCoverPath(x.slug) ?? SITE_MEDIA.categoryCard("btt-cat-rattan")}
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
    </>
  );
}
