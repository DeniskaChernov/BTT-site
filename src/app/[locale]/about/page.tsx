import { MicroTrustStrip } from "@/components/home/MicroTrustStrip";
import { PageHero } from "@/components/layout/PageHero";
import { AnimatedReveal } from "@/components/ui/animated-reveal";
import { Link } from "@/i18n/navigation";
import {
  bttSecondaryAmberButtonClass,
  bttSecondaryNeutralButtonClass,
} from "@/lib/ui-classes";
import { getTranslations } from "next-intl/server";

type MetadataProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: MetadataProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });
  return {
    title: t("title"),
    description: t("meta_description"),
  };
}

export default async function AboutPage() {
  const t = await getTranslations("about");
  const s = await getTranslations("sales");

  const blocks = [
    { title: t("quality"), body: t("quality_body") },
    { title: t("batch"), body: t("batch_body") },
    { title: t("requisites"), body: t("requisites_body") },
  ];

  return (
    <div className="btt-container py-14 md:py-20">
      <div className="mx-auto max-w-3xl">
        <PageHero kicker={t("kicker")} title={t("title")} lead={t("lead")}>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/catalog"
              className={bttSecondaryAmberButtonClass}
            >
              {t("cta_catalog")}
            </Link>
            <Link
              href="/contacts"
              className={bttSecondaryNeutralButtonClass}
            >
              {t("cta_contacts")}
            </Link>
          </div>
        </PageHero>

        <AnimatedReveal className="mt-6" delay={0.03}>
          <MicroTrustStrip />
        </AnimatedReveal>

        <AnimatedReveal delay={0.05}>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] px-4 py-3">
              <p className="text-xs uppercase tracking-[0.18em] text-amber-500/80">
                {s("trust_kicker")}
              </p>
              <p className="mt-1 text-lg font-semibold text-stone-100">
                {s("trust_clients_value")}
              </p>
              <p className="text-xs text-stone-400">{s("trust_clients_label")}</p>
            </div>
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] px-4 py-3">
              <p className="text-xs uppercase tracking-[0.18em] text-amber-500/80">
                {t("kicker")}
              </p>
              <p className="mt-1 text-lg font-semibold text-stone-100">
                {s("trust_volume_value")}
              </p>
              <p className="text-xs text-stone-400">{s("trust_volume_label")}</p>
            </div>
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] px-4 py-3">
              <p className="text-xs uppercase tracking-[0.18em] text-amber-500/80">
                {t("quality")}
              </p>
              <p className="mt-1 text-lg font-semibold text-stone-100">
                {s("trust_repeat_value")}
              </p>
              <p className="text-xs text-stone-400">{s("trust_repeat_label")}</p>
            </div>
          </div>
        </AnimatedReveal>

        <div className="mt-10 space-y-5 md:mt-12 md:space-y-6">
          {blocks.map((b, i) => (
            <AnimatedReveal key={b.title} delay={0.06 + i * 0.06}>
              <section className="btt-glass rounded-2xl border-l-2 border-l-amber-500/35 p-6 md:rounded-3xl md:p-8">
                <h2 className="text-lg font-semibold text-stone-50 md:text-xl">{b.title}</h2>
                <p className="mt-3 text-sm leading-relaxed text-stone-400 md:text-base">{b.body}</p>
              </section>
            </AnimatedReveal>
          ))}
        </div>
      </div>
    </div>
  );
}
