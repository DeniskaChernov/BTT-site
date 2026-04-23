import { FaqList } from "@/components/faq/FaqList";
import { MicroTrustStrip } from "@/components/home/MicroTrustStrip";
import { PageHero } from "@/components/layout/PageHero";
import { AnimatedReveal } from "@/components/ui/animated-reveal";
import { getTranslations } from "next-intl/server";

type MetadataProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: MetadataProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "faq" });
  return {
    title: t("title"),
    description: t("meta_description"),
  };
}

export default async function FaqPage() {
  const t = await getTranslations("faq");

  const items = [
    { q: t("pay"), a: t("a_pay") },
    { q: t("ship"), a: t("a_ship") },
    { q: t("min_weight"), a: t("a_min_weight") },
    { q: t("pick"), a: t("a_pick") },
    { q: t("returns"), a: t("a_returns") },
  ];

  return (
    <div className="btt-container py-14 md:py-20">
      <div className="mx-auto max-w-3xl">
        <AnimatedReveal>
          <PageHero kicker={t("kicker")} title={t("title")} lead={t("lead")} />
        </AnimatedReveal>
        <AnimatedReveal className="mt-6" delay={0.03}>
          <MicroTrustStrip />
        </AnimatedReveal>
        <AnimatedReveal delay={0.06} className="mt-10 md:mt-12">
          <FaqList items={items} />
        </AnimatedReveal>
      </div>
    </div>
  );
}
