import { CollectiveHomeTeaser } from "@/components/collective/CollectiveHomeTeaser";
import { CommerceHero } from "@/components/commerce-hero";
import { MaterialTrustStrip } from "@/components/home/MaterialTrustStrip";
import { ArticlesTeaser } from "@/components/home/ArticlesTeaser";
import { HomeHits } from "@/components/home/HomeHits";
import { SegmentSection } from "@/components/home/SegmentSection";
import { SocialProofSection } from "@/components/home/SocialProofSection";
import { RattanQuizLazy } from "@/components/quiz/RattanQuizLazy";
import { SectionReveal } from "@/components/ui/animated-reveal";
import { getTranslations } from "next-intl/server";

export default async function HomePage() {
  const t = await getTranslations("home");

  return (
    <>
      <CommerceHero />
      <MaterialTrustStrip />
      <CollectiveHomeTeaser />
      <ArticlesTeaser />
      <SegmentSection />
      <HomeHits />
      <section className="relative py-16 md:py-24">
        <div className="pointer-events-none absolute left-1/2 top-0 h-px w-[min(90%,48rem)] -translate-x-1/2 bg-gradient-to-r from-transparent via-amber-500/40 to-transparent" />
        <div className="btt-container">
          <SectionReveal>
            <div className="rounded-[1.75rem] border border-white/[0.07] bg-gradient-to-b from-white/[0.04] to-transparent p-6 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] md:p-10">
              <div className="mx-auto max-w-3xl text-center">
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-500/80">
                  {t("quiz_kicker")}
                </p>
                <h2 className="mt-3 text-3xl font-bold tracking-tight text-stone-50 md:text-4xl">
                  {t("quiz_title")}
                </h2>
                <p className="mt-3 text-pretty text-stone-400 md:text-lg">{t("quiz_sub")}</p>
              </div>
              <div className="mx-auto mt-10 flex w-full max-w-2xl justify-center md:mt-12">
                <RattanQuizLazy />
              </div>
            </div>
          </SectionReveal>
        </div>
      </section>
      <SocialProofSection />
    </>
  );
}
