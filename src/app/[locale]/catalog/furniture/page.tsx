import { CatalogDivisionsNav } from "@/components/catalog/CatalogDivisionsNav";
import { CatalogFurnitureSection } from "@/components/catalog/CatalogFurnitureSection";
import { PageBackNav } from "@/components/layout/PageBackNav";
import { SectionReveal } from "@/components/ui/animated-reveal";
import { buildAlternates, SITE_ORIGIN } from "@/lib/seo";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

type Props = {
  params: Promise<{ locale: string }>;
};

const FURNITURE_OG_IMAGE = "/media/catalog/furniture-chair-hero.png";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "product" });
  const alternates = buildAlternates(locale, "/catalog/furniture");
  const title = t("furniture_stub_title");
  const description = `${t("furniture_stub_note")} ${t("furniture_stub_lead")}`.trim();
  const ogImage = `${SITE_ORIGIN}${FURNITURE_OG_IMAGE}`;
  return {
    title,
    description,
    alternates,
    openGraph: {
      title,
      description,
      url: alternates.canonical,
      images: [{ url: ogImage, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export default async function CatalogFurniturePage() {
  const t = await getTranslations("catalog");

  return (
    <div className="btt-container py-12 md:py-16">
      <PageBackNav fallbackHref="/catalog" />
      <SectionReveal className="mt-6">
        <p className="mb-4 text-sm font-semibold text-stone-200">{t("divisions_title")}</p>
        <CatalogDivisionsNav active="furniture" />
      </SectionReveal>
      <CatalogFurnitureSection />
    </div>
  );
}
