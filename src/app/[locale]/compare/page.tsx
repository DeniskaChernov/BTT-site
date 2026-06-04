import { CompareTable } from "@/components/compare/CompareTable";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { PageHero } from "@/components/layout/PageHero";
import { buildAlternates } from "@/lib/seo";
import { getTranslations } from "next-intl/server";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "compare" });
  const alternates = buildAlternates(locale, "/compare");
  return {
    title: t("title"),
    description: t("lead"),
    alternates,
    robots: { index: false, follow: true },
  };
}

export default async function ComparePage() {
  const t = await getTranslations("compare");
  const tNav = await getTranslations("nav");

  return (
    <div className="btt-container py-12 md:py-16">
      <Breadcrumbs
        className="mb-6"
        items={[
          { label: tNav("home"), href: "/" },
          { label: tNav("catalog"), href: "/catalog" },
          { label: t("title") },
        ]}
      />
      <PageHero kicker={t("kicker")} title={t("title")} lead={t("lead")} backFallbackHref="/catalog" />
      <CompareTable />
    </div>
  );
}
