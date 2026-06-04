import { HomeHitsClient } from "@/components/home/HomeHitsClient";
import { products } from "@/data/products";
import { getTranslations } from "next-intl/server";

export async function HomeHits() {
  const t = await getTranslations("home");
  const hits = products
    .filter((p) => p.category === "material" || p.category === "planter")
    .slice(0, 6);

  return (
    <HomeHitsClient
      kicker={t("catalog_kicker")}
      title={t("hits")}
      lead={t("hits_lead")}
      cta={t("hits_cta")}
      fallback={hits}
    />
  );
}
