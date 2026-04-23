import { ArticlesCardGrid } from "@/components/articles/ArticlesCardGrid";
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
  const t = await getTranslations({ locale, namespace: "articles" });
  return {
    title: t("title"),
    description: t("lead"),
  };
}

export default async function ArticlesPage() {
  const t = await getTranslations("articles");

  return (
    <div className="btt-container py-14 md:py-20">
      <PageHero kicker={t("kicker")} title={t("title")} lead={t("lead")}>
        <p className="max-w-2xl text-pretty text-sm text-stone-500 md:text-base">{t("intro")}</p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/"
            className={bttSecondaryAmberButtonClass}
          >
            {t("cta_quiz")}
          </Link>
          <Link
            href="/catalog"
            className={bttSecondaryNeutralButtonClass}
          >
            {t("cta_catalog")}
          </Link>
        </div>
      </PageHero>

      <AnimatedReveal className="mt-6" delay={0.02}>
        <MicroTrustStrip />
      </AnimatedReveal>

      <ArticlesCardGrid />

      <p className="mt-12 text-center text-sm text-stone-500">{t("cta_all")}</p>
    </div>
  );
}
