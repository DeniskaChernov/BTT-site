import { CatalogClient } from "@/components/catalog/CatalogClient";
import { getTranslations } from "next-intl/server";

export async function generateMetadata() {
  const t = await getTranslations("catalog");
  return { title: `${t("title")} | Bententrade` };
}

export default async function CatalogPage() {
  const t = await getTranslations("catalog");

  return (
    <div className="btt-container py-10">
      <h1 className="text-3xl font-semibold tracking-tight">{t("title")}</h1>
      <p className="mt-2 max-w-2xl text-btt-muted">{t("intro")}</p>
      <CatalogClient />
    </div>
  );
}
