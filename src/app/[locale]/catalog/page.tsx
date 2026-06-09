import { CatalogDivisionsNav } from "@/components/catalog/CatalogDivisionsNav";
import { CatalogClient } from "@/components/catalog/CatalogClient";
import { CatalogInfoAccordion } from "@/components/catalog/CatalogInfoAccordion";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { PageHero } from "@/components/layout/PageHero";
import { SectionReveal } from "@/components/ui/animated-reveal";
import { products } from "@/data/products";
import { buildCatalogItemListJsonLd } from "@/lib/seo-jsonld";
import { buildAlternates, CATALOG_OG_IMAGE, SITE_ORIGIN } from "@/lib/seo";
import type { CategoryTab } from "@/types/product";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";

type MetadataProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: MetadataProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "catalog" });
  const alternates = buildAlternates(locale, "/catalog");
  const title = t("title");
  const description = t("meta_description");
  return {
    title,
    description,
    alternates,
    openGraph: { title, description, url: alternates.canonical, images: [CATALOG_OG_IMAGE] },
    twitter: { card: "summary_large_image", title, description, images: [CATALOG_OG_IMAGE.url] },
  };
}

const TABS: CategoryTab[] = ["material", "planter", "new"];
const SHAPES = ["round", "flat", "oval", "half_round"] as const;
const COLORS = ["all", "natural", "black", "white", "brown", "grey"] as const;
const STOCK = ["in_stock", "on_order"] as const;

type PageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{
    tab?: string;
    shape?: string;
    color?: string;
    source?: string;
    kind?: string;
    stock?: string;
  }>;
};

export default async function CatalogPage({ params, searchParams }: PageProps) {
  const { locale } = await params;
  const t = await getTranslations("catalog");
  const tNav = await getTranslations("nav");
  const sp = await searchParams;

  const tab = TABS.includes(sp.tab as CategoryTab) ? (sp.tab as CategoryTab) : "material";
  const division = tab === "planter" ? "planter" : "general";
  const shape = SHAPES.includes(sp.shape as (typeof SHAPES)[number]) ? (sp.shape as (typeof SHAPES)[number]) : "all";
  const color = sp.color && (COLORS as readonly string[]).includes(sp.color) ? (sp.color as (typeof COLORS)[number]) : "all";
  const source = sp.source === "pdf" ? "pdf" : "all";
  const kind = sp.kind === "twisted" || sp.kind === "regular" || sp.kind === "semi" ? sp.kind : "all";
  const stock = STOCK.includes(sp.stock as (typeof STOCK)[number])
    ? (sp.stock as (typeof STOCK)[number])
    : "all";

  const itemListJsonLd = buildCatalogItemListJsonLd({
    locale,
    catalogName: t("title"),
    catalogUrl: `${SITE_ORIGIN}/${locale}/catalog`,
    products,
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />
      <div className="btt-container py-12 md:py-16">
        <Breadcrumbs className="mb-6" items={[{ label: tNav("home"), href: "/" }, { label: t("title") }]} />
        <PageHero kicker={t("page_kicker")} title={t("title")} lead={t("intro_short")} backFallbackHref="/" />
        <SectionReveal className="mt-8">
          <p className="mb-4 text-sm font-semibold text-stone-200">{t("divisions_title")}</p>
          <CatalogDivisionsNav active={division} />
        </SectionReveal>
        <SectionReveal>
          <CatalogInfoAccordion />
        </SectionReveal>
        <Suspense fallback={<div className="mt-8 h-40 animate-pulse rounded-3xl bg-white/[0.04]" aria-hidden />}>
          <CatalogClient
            key={`${tab}-${shape}-${color}-${source}-${kind}-${stock}`}
            initialTab={tab}
            initialShape={shape}
            initialColor={color}
            initialSource={source}
            initialKind={kind}
            initialStock={stock}
          />
        </Suspense>
      </div>
    </>
  );
}
