"use client";

import { ArticlesTeaser } from "@/components/home/ArticlesTeaser";
import { CollectiveSalesTeaser } from "@/components/home/CollectiveSalesTeaser";
import { ExamplesSection } from "@/components/home/ExamplesSection";
import { HomeHits } from "@/components/home/HomeHits";
import { InstagramHighlightsSection } from "@/components/home/InstagramHighlightsSection";
import { LeadCaptureSection } from "@/components/home/LeadCaptureSection";
import { MaterialTrustStrip } from "@/components/home/MaterialTrustStrip";
import { SegmentSection } from "@/components/home/SegmentSection";
import { SocialProofSection } from "@/components/home/SocialProofSection";
import { TrustCountersSection } from "@/components/home/TrustCountersSection";
import { WhyBeneficialSection } from "@/components/home/WhyBeneficialSection";
import { RattanQuizLazy } from "@/components/quiz/RattanQuizLazy";
import { SectionReveal } from "@/components/ui/animated-reveal";
import { useIntent } from "@/contexts/IntentContext";
import { homeSectionOrder, type HomeBlockId } from "@/lib/journey/home-sections";
import { useTranslations } from "next-intl";
import { useMemo, type ReactNode } from "react";

const BLOCKS: Record<HomeBlockId, () => ReactNode> = {
  segments: () => <SegmentSection />,
  why: () => <WhyBeneficialSection />,
  material: () => <MaterialTrustStrip />,
  examples: () => <ExamplesSection />,
  hits: () => <HomeHits />,
  trust: () => <TrustCountersSection />,
  collective: () => <CollectiveSalesTeaser />,
  instagram: () => <InstagramHighlightsSection />,
  articles: () => <ArticlesTeaser />,
  lead: () => <LeadCaptureSection />,
  social: () => <SocialProofSection />,
  quiz: () => <HomeQuizBlock />,
};

function HomeQuizBlock() {
  const t = useTranslations("home");
  return (
    <section id="quiz" className="relative scroll-mt-24 py-10 md:py-14">
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
  );
}

export function HomePageFlow() {
  const { profile } = useIntent();
  const order = useMemo(() => homeSectionOrder(profile.journey), [profile.journey]);

  return (
    <>
      {order.map((id) => (
        <div key={id}>{BLOCKS[id]()}</div>
      ))}
    </>
  );
}
