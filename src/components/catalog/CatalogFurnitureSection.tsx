"use client";

import { FurnitureRattanPreview } from "@/components/furniture/FurnitureRattanPreview";
import { Link } from "@/i18n/navigation";
import { bttPrimaryButtonClass } from "@/lib/ui-classes";
import { useTranslations } from "next-intl";

/**
 * Витрина раздела «Мебель»: копирайт из `product.furniture_stub_*` + 3D/статик превью.
 */
export function CatalogFurnitureSection() {
  const t = useTranslations("product");

  return (
    <div className="space-y-8">
      <header className="max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amber-500/80">
          {t("furniture_stub_kicker")}
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-stone-50 md:text-4xl">
          {t("furniture_stub_title")}
        </h1>
        <p className="mt-3 text-pretty text-lg text-stone-300">{t("furniture_stub_note")}</p>
        <p className="mt-4 text-pretty text-stone-400 md:text-base">{t("furniture_stub_lead")}</p>
      </header>

      <FurnitureRattanPreview aria-label={t("furniture_stub_preview_label")} />

      <p className="text-center text-sm text-stone-500">{t("furniture_stub_hint")}</p>

      <div className="flex justify-center pt-2">
        <Link
          href="/catalog"
          className={`${bttPrimaryButtonClass} btt-focus inline-flex justify-center px-8 py-3.5`}
        >
          {t("furniture_stub_cta")}
        </Link>
      </div>
    </div>
  );
}
