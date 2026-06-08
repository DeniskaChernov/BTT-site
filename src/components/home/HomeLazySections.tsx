"use client";

import dynamic from "next/dynamic";

const CollectiveSalesTeaser = dynamic(
  () =>
    import("@/components/home/CollectiveSalesTeaser").then(
      (m) => m.CollectiveSalesTeaser,
    ),
  { ssr: true },
);

const InstagramHighlightsSection = dynamic(
  () =>
    import("@/components/home/InstagramHighlightsSection").then(
      (m) => m.InstagramHighlightsSection,
    ),
  { ssr: true },
);

const ArticlesTeaser = dynamic(
  () => import("@/components/home/ArticlesTeaser").then((m) => m.ArticlesTeaser),
  { ssr: true },
);

const LeadCaptureSection = dynamic(
  () =>
    import("@/components/home/LeadCaptureSection").then((m) => m.LeadCaptureSection),
  { ssr: true },
);

const SocialProofSection = dynamic(
  () =>
    import("@/components/home/SocialProofSection").then((m) => m.SocialProofSection),
  { ssr: true },
);

/** Нижние секции главной — отдельные чанки для более быстрого LCP. */
export function HomeLazySections() {
  return (
    <>
      <CollectiveSalesTeaser />
      <InstagramHighlightsSection />
      <ArticlesTeaser />
      <LeadCaptureSection />
      <SocialProofSection />
    </>
  );
}
