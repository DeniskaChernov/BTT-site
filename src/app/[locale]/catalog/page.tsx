import { CatalogClient } from "@/components/catalog/CatalogClient";
import { CatalogPriceGuide } from "@/components/catalog/CatalogPriceGuide";
import { BrochureRattanSection } from "@/components/catalog/BrochureRattanSection";
import { CatalogUseCasesNav } from "@/components/catalog/CatalogUseCasesNav";
import { MicroTrustStrip } from "@/components/home/MicroTrustStrip";
import { PageHero } from "@/components/layout/PageHero";
import { SectionReveal } from "@/components/ui/animated-reveal";
import { Link } from "@/i18n/navigation";
import { bttPrimaryButtonClass } from "@/lib/ui-classes";
import { cn } from "@/lib/utils";
import type { CategoryTab } from "@/types/product";
import { FileDown } from "lucide-react";
import { getTranslations } from "next-intl/server";

type MetadataProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: MetadataProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "catalog" });
  return {
    title: t("title"),
    description: t("intro"),
  };
}

const TABS: CategoryTab[] = ["material", "planter", "new"];
const SHAPES = ["round", "flat", "oval", "half_round"] as const;

const COLORS = ["all", "natural", "black", "white", "brown", "grey"] as const;

type PageProps = {
  searchParams: Promise<{ tab?: string; shape?: string; color?: string }>;
};

export default async function CatalogPage({ searchParams }: PageProps) {
  const t = await getTranslations("catalog");
  const sp = await searchParams;

  const tab = TABS.includes(sp.tab as CategoryTab) ? (sp.tab as CategoryTab) : "material";
  const shape = SHAPES.includes(sp.shape as (typeof SHAPES)[number])
    ? (sp.shape as (typeof SHAPES)[number])
    : "all";
  const color: (typeof COLORS)[number] =
    sp.color && (COLORS as readonly string[]).includes(sp.color)
      ? (sp.color as (typeof COLORS)[number])
      : "all";

  return (
    <div className="btt-container py-12 md:py-16">
      <PageHero kicker={t("page_kicker")} title={t("title")} lead={t("intro")} />

      <SectionReveal className="mt-8">
        <CatalogPriceGuide />
      </SectionReveal>

      <SectionReveal className="mt-6">
        <MicroTrustStrip />
      </SectionReveal>

      <SectionReveal className="mt-8">
        <div className="flex flex-col gap-4 rounded-3xl border border-amber-500/20 bg-gradient-to-br from-amber-950/30 to-stone-950/60 p-6 md:flex-row md:items-center md:justify-between md:p-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-500/90">
              {t("brochure_kicker")}
            </p>
            <p className="mt-2 max-w-xl text-sm text-stone-300">{t("brochure_lead")}</p>
          </div>
          <Link
            href="/catalog/brochure"
            className={cn(
              bttPrimaryButtonClass,
              "btt-focus inline-flex shrink-0 items-center justify-center gap-2 px-6 py-3 text-sm",
            )}
          >
            <FileDown className="h-4 w-4" aria-hidden />
            {t("brochure_cta")}
          </Link>
        </div>
      </SectionReveal>

      <SectionReveal className="mt-6">
        <CatalogUseCasesNav />
      </SectionReveal>

      <SectionReveal className="mt-6">
        <BrochureRattanSection />
      </SectionReveal>

      <CatalogClient
        key={`${tab}-${shape}-${color}`}
        initialTab={tab}
        initialShape={shape}
        initialColor={color}
      />
    </div>
  );
}
