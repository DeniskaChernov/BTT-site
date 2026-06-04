import { LegalDocView } from "@/components/legal/LegalDocView";
import { pickLocaleValue, PRIVACY_DOC } from "@/data/legal";
import { buildAlternates } from "@/lib/seo";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const title = pickLocaleValue(PRIVACY_DOC.title, locale);
  const description = pickLocaleValue(PRIVACY_DOC.lead, locale);
  const alternates = buildAlternates(locale, "/privacy");
  return {
    title,
    description,
    alternates,
    openGraph: { title, description, url: alternates.canonical },
    twitter: { title, description },
  };
}

export default async function PrivacyPage({ params }: Props) {
  const { locale } = await params;
  return <LegalDocView doc={PRIVACY_DOC} locale={locale} />;
}
