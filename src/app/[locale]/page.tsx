import { CommerceHero } from "@/components/commerce-hero";
import { HeroPromisesStrip } from "@/components/home/HeroPromisesStrip";
import { HomePageFlow } from "@/components/home/HomePageFlow";

export default function HomePage() {
  return (
    <>
      <CommerceHero />
      <HeroPromisesStrip />
      <HomePageFlow />
    </>
  );
}
