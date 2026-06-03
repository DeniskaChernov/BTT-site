import { FaqList } from "@/components/faq/FaqList";
import { MicroTrustStrip } from "@/components/home/MicroTrustStrip";
import { PageHero } from "@/components/layout/PageHero";
import { AnimatedReveal } from "@/components/ui/animated-reveal";
import { buildAlternates } from "@/lib/seo";
import { getTranslations } from "next-intl/server";

type MetadataProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: MetadataProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "faq" });
  const alternates = buildAlternates(locale, "/faq");
  const title = t("title");
  const description = t("meta_description");
  return {
    title,
    description,
    alternates,
    openGraph: { title, description, url: alternates.canonical },
    twitter: { title, description },
  };
}

export default async function FaqPage() {
  const t = await getTranslations("faq");

  const items = [
    { q: t("pay"), a: t("a_pay") },
    { q: t("ship"), a: t("a_ship") },
    { q: t("min_weight"), a: t("a_min_weight") },
    { q: t("q_twist"), a: t("a_twist") },
    { q: t("q_semi"), a: t("a_semi") },
    { q: t("q_pdf"), a: t("a_pdf") },
    { q: t("pick"), a: t("a_pick") },
    { q: t("returns"), a: t("a_returns") },
  ];

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };

  return (
    <div className="btt-container py-14 md:py-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <div className="mx-auto max-w-3xl">
        <AnimatedReveal>
          <PageHero
            kicker={t("kicker")}
            title={t("title")}
            lead={t("lead")}
            backFallbackHref="/"
          />
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
