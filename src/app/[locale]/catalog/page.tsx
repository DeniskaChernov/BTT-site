import { CatalogClient } from "@/components/catalog/CatalogClient";
import type { CategoryTab } from "@/types/product";
import { getTranslations } from "next-intl/server";

export async function generateMetadata() {
  const t = await getTranslations("catalog");
  return { title: `${t("title")} | Bententrade` };
}

const TABS: CategoryTab[] = ["material", "planter", "new"];
const SHAPES = ["round", "flat", "oval", "half_round"] as const;

type PageProps = {
  searchParams: Promise<{ tab?: string; shape?: string }>;
};

export default async function CatalogPage({ searchParams }: PageProps) {
  const t = await getTranslations("catalog");
  const sp = await searchParams;

  const tab = TABS.includes(sp.tab as CategoryTab) ? (sp.tab as CategoryTab) : "material";
  const shape = SHAPES.includes(sp.shape as (typeof SHAPES)[number])
    ? (sp.shape as (typeof SHAPES)[number])
    : "all";

  return (
    <div className="btt-container py-12 md:py-16">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-500/80">
        Bententrade
      </p>
      <h1 className="mt-3 text-4xl font-bold tracking-tight text-stone-50 md:text-5xl">
        {t("title")}
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-stone-400">{t("intro")}</p>
      <CatalogClient initialTab={tab} initialShape={shape} />
    </div>
  );
}
