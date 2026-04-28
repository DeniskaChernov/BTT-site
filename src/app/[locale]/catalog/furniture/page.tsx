import dynamic from "next/dynamic";
import { PageHero } from "@/components/layout/PageHero";
import { Link } from "@/i18n/navigation";
import { buildAlternates } from "@/lib/seo";
import { bttPrimaryButtonClass } from "@/lib/ui-classes";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

const FurnitureRattanPreview = dynamic(
  () =>
    import("@/components/furniture/FurnitureRattanPreview").then(
      (mod) => mod.FurnitureRattanPreview,
    ),
  {
    ssr: false,
    loading: () => (
      <div
        className="aspect-[4/3] min-h-[260px] animate-pulse rounded-[1.75rem] border border-white/[0.06] bg-gradient-to-b from-stone-900/75 to-[#0a0908]"
        aria-hidden
      />
    ),
  },
);

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "catalog" });
  return {
    title: t("furniture_stub_title"),
    description: `${t("furniture_stub_note")} ${t("furniture_stub_lead")}`,
    alternates: buildAlternates(locale, "/catalog/furniture"),
  };
}

export default async function CatalogFurniturePage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "catalog" });

  return (
    <div className="btt-container py-12 md:py-16">
      <PageHero
        kicker={t("furniture_stub_kicker")}
        title={t("furniture_stub_title")}
        lead={`${t("furniture_stub_note")} ${t("furniture_stub_lead")}`}
      />

      <div className="mt-10 grid gap-6 lg:gap-10">
        <div className="rounded-3xl border border-white/[0.08] bg-gradient-to-b from-white/[0.04] to-white/[0.02] p-4 shadow-inner shadow-black/25 md:p-6">
          <p className="mb-4 text-center text-xs text-stone-500">{t("furniture_stub_hint")}</p>
          <FurnitureRattanPreview aria-label={t("furniture_stub_preview_label")} />
        </div>

        <div className="flex justify-center pb-4">
          <Link
            href="/catalog"
            className={cn(
              bttPrimaryButtonClass,
              "btt-focus inline-flex items-center justify-center px-8 py-3.5 text-sm shadow-lg shadow-amber-950/30",
            )}
          >
            {t("furniture_stub_cta")}
          </Link>
        </div>
      </div>
    </div>
  );
}
