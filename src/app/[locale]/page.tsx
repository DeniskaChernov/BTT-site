import { CommerceHero } from "@/components/commerce-hero";
import { HomeCatalogQuickChips } from "@/components/home/HomeCatalogQuickChips";
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
      <HomeCatalogQuickChips />
      <HomeMerchandising />
      <HomeExamplesLazy />
      <HeroPromisesStrip />
      <WhyBeneficialSection />
      <HomeTrustLazy />
      <MaterialTrustStrip />
      <HomeNewsTicker />
      <HomeLazySections />
    </>
  );
}
