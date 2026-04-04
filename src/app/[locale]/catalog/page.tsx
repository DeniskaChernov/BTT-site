import { CatalogClient } from "@/components/catalog/CatalogClient";
import { getTranslations } from "next-intl/server";

export async function generateMetadata() {
  const t = await getTranslations("catalog");
  return { title: `${t("title")} | Bententrade` };
}

export default async function CatalogPage() {
  const t = await getTranslations("catalog");

  return (
    <div className="btt-container py-12 md:py-16">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-500/80">
        Bententrade
      </p>
      <h1 className="mt-3 text-4xl font-bold tracking-tight text-stone-50 md:text-5xl">
        {t("title")}
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-stone-400">{t("intro")}</p>
      <CatalogClient />
    </div>
  );
}
