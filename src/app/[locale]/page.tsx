import { CommerceHero } from "@/components/commerce-hero";
import { HeroPromisesStrip } from "@/components/home/HeroPromisesStrip";
import {
  HomeExamplesLazy,
  HomeLazySections,
  HomeTrustLazy,
} from "@/components/home/HomeLazySections";
import { HomeMerchandising } from "@/components/home/HomeMerchandising";
import { HomeNewsTicker } from "@/components/home/HomeNewsTicker";
import { MaterialTrustStrip } from "@/components/home/MaterialTrustStrip";
import { WhyBeneficialSection } from "@/components/home/WhyBeneficialSection";

export default async function HomePage() {
  return (
    <>
      <CommerceHero />
      <HeroPromisesStrip />
      <HomeNewsTicker />
      <WhyBeneficialSection />
      <MaterialTrustStrip />
      <HomeExamplesLazy />
      <HomeMerchandising />
      <HomeTrustLazy />
      <HomeLazySections />
    </>
  );
}
