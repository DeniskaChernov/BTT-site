import { StaggerHits } from "@/components/home/StaggerHits";
import { products } from "@/data/products";
import { getTranslations } from "next-intl/server";

export async function HomeHits() {
  const t = await getTranslations("home");
  const kicker = t("catalog_kicker");
  const hits = products
    .filter((p) => p.category === "material" || p.category === "planter")
    .slice(0, 6);

  return (
    <section
      id="hits"
      className="relative scroll-mt-24 border-y border-white/[0.06] py-16 md:py-24"
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-amber-950/10 to-transparent" />
      <div className="relative btt-container">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-500/80">
              {kicker}
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-stone-50 md:text-4xl">
              {t("hits")}
            </h2>
            <p className="mt-2 max-w-lg text-stone-400">{t("hits_lead")}</p>
          </div>
          <p className="text-sm text-stone-500 md:text-right">
            {t("trust_payments")}
          </p>
        </div>

        <StaggerHits products={hits} />
      </div>
    </section>
  );
}
