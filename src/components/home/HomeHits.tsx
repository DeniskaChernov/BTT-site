import { StaggerHits } from "@/components/home/StaggerHits";
import { products } from "@/data/products";
import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";
import { ArrowRight } from "lucide-react";

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
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-500/80">
              {kicker}
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-stone-50 md:text-4xl">
              {t("hits")}
            </h2>
            <p className="mt-3 text-pretty text-stone-400 md:text-lg">{t("hits_lead")}</p>
          </div>
          <div className="flex flex-col items-stretch gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-3 ring-1 ring-white/[0.03] md:items-end md:p-4">
            <p className="text-sm text-stone-500 md:text-right">{t("trust_payments")}</p>
            <Link
              href="/catalog"
              className="group btt-focus inline-flex items-center justify-center gap-2 self-start rounded-full border border-white/15 bg-white/[0.04] px-5 py-2.5 text-sm font-semibold text-stone-200 transition hover:border-amber-500/35 hover:text-amber-100 motion-reduce:transition-none md:self-end"
            >
              {t("hits_cta")}
              <ArrowRight
                className="h-4 w-4 transition group-hover:translate-x-0.5 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
                aria-hidden
              />
            </Link>
          </div>
        </div>

        <StaggerHits products={hits} />
      </div>
    </section>
  );
}
