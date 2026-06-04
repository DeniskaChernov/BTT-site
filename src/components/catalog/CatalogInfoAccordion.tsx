"use client";

import { CatalogPriceGuide } from "@/components/catalog/CatalogPriceGuide";
import { CatalogUseCasesNav } from "@/components/catalog/CatalogUseCasesNav";
import { MicroTrustStrip } from "@/components/home/MicroTrustStrip";
import { CollapsibleSection } from "@/components/ui/CollapsibleSection";
import { Link } from "@/i18n/navigation";
import { bttPrimaryButtonClass } from "@/lib/ui-classes";
import { cn } from "@/lib/utils";
import { FileDown } from "lucide-react";
import { useTranslations } from "next-intl";

export function CatalogInfoAccordion() {
  const t = useTranslations("catalog");

  return (
    <div className="mt-6 space-y-4">
      <CollapsibleSection title={t("info_prices_title")} lead={t("info_prices_lead")} badge={t("info_optional_badge")}>
        <CatalogPriceGuide embedded />
      </CollapsibleSection>
      <CollapsibleSection title={t("info_usecases_title")} lead={t("info_usecases_lead")}>
        <CatalogUseCasesNav embedded />
      </CollapsibleSection>
      <CollapsibleSection title={t("info_brochure_title")} lead={t("info_brochure_lead")}>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <p className="max-w-xl text-sm text-stone-400">{t("brochure_lead")}</p>
          <Link
            href="/catalog/brochure"
            className={cn(bttPrimaryButtonClass, "btt-focus inline-flex shrink-0 items-center gap-2 px-6 py-3 text-sm")}
          >
            <FileDown className="h-4 w-4" aria-hidden />
            {t("brochure_cta")}
          </Link>
        </div>
      </CollapsibleSection>
      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] px-4 py-3">
        <MicroTrustStrip variant="compact" />
      </div>
    </div>
  );
}
