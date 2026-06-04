import { CatalogBuyerGuide } from "@/components/catalog/CatalogBuyerGuide";
import { CatalogClient } from "@/components/catalog/CatalogClient";
import { CatalogInfoAccordion } from "@/components/catalog/CatalogInfoAccordion";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { PageHero } from "@/components/layout/PageHero";
import { SectionReveal } from "@/components/ui/animated-reveal";
import { buildAlternates, CATALOG_OG_IMAGE } from "@/lib/seo";
import type { CategoryTab } from "@/types/product";
import { getTranslations } from "next-intl/server";

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

type PageProps = {
  searchParams: Promise<{ tab?: string; shape?: string; color?: string; source?: string; kind?: string }>;
};

export default async function CatalogPage({ searchParams }: PageProps) {
  const t = await getTranslations("catalog");
  const tNav = await getTranslations("nav");
  const sp = await searchParams;

  const tab = TABS.includes(sp.tab as CategoryTab) ? (sp.tab as CategoryTab) : "material";
  const shape = SHAPES.includes(sp.shape as (typeof SHAPES)[number]) ? (sp.shape as (typeof SHAPES)[number]) : "all";
  const color = sp.color && (COLORS as readonly string[]).includes(sp.color) ? (sp.color as (typeof COLORS)[number]) : "all";
  const source = sp.source === "pdf" ? "pdf" : "all";
  const kind = sp.kind === "twisted" || sp.kind === "regular" || sp.kind === "semi" ? sp.kind : "all";

  return (
    <div className="btt-container py-12 md:py-16">
      <Breadcrumbs className="mb-6" items={[{ label: tNav("home"), href: "/" }, { label: t("title") }]} />
      <PageHero kicker={t("page_kicker")} title={t("title")} lead={t("intro_short")} backFallbackHref="/" />
      <SectionReveal className="mt-8">
        <p className="mb-4 text-sm font-semibold text-stone-200">{t("guide_title")}</p>
        <CatalogBuyerGuide />
      </SectionReveal>
      <SectionReveal>
        <CatalogInfoAccordion />
      </SectionReveal>
      <CatalogClient
        key={`${tab}-${shape}-${color}-${source}-${kind}`}
        initialTab={tab}
        initialShape={shape}
        initialColor={color}
        initialSource={source}
        initialKind={kind}
      />
    </div>
  );
}
