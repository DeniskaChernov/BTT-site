import { CatalogFurnitureSection } from "@/components/catalog/CatalogFurnitureSection";
import { PageBackNav } from "@/components/layout/PageBackNav";
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

export default function CatalogFurniturePage() {
  return (
    <div className="btt-container py-12 md:py-16">
      <PageBackNav fallbackHref="/catalog" />
      <CatalogFurnitureSection />
    </div>
  );
}
