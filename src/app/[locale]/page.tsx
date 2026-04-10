import { CollectiveHomeTeaser } from "@/components/collective/CollectiveHomeTeaser";
import { CommerceHero } from "@/components/commerce-hero";
import { MaterialTrustStrip } from "@/components/home/MaterialTrustStrip";
import { ArticlesTeaser } from "@/components/home/ArticlesTeaser";
import { HomeHits } from "@/components/home/HomeHits";
import { SegmentSection } from "@/components/home/SegmentSection";
import { SocialProofSection } from "@/components/home/SocialProofSection";
import { RattanQuizLazy } from "@/components/quiz/RattanQuizLazy";
import { getTranslations } from "next-intl/server";

export default async function HomePage() {
  const t = await getTranslations("home");

  return (
    <>
      <CommerceHero />
      <CollectiveHomeTeaser />
      <MaterialTrustStrip />
      <ArticlesTeaser />
      <SegmentSection />
      <HomeHits />
      <section className="relative py-16 md:py-24">
        <div className="pointer-events-none absolute left-1/2 top-0 h-px w-[min(90%,48rem)] -translate-x-1/2 bg-gradient-to-r from-transparent via-amber-500/40 to-transparent" />
        <div className="btt-container">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-500/80">
              {t("quiz_kicker")}
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-stone-50 md:text-4xl">
              {t("quiz_title")}
            </h2>
            <p className="mt-3 text-stone-400">{t("quiz_sub")}</p>
          </div>
          <div className="mx-auto mt-12 max-w-4xl">
            <RattanQuizLazy />
          </div>
        </div>
      </section>
      <SocialProofSection />
    </>
  );
}
