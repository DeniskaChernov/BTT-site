import { LegalDocView } from "@/components/legal/LegalDocView";
import { pickLocaleValue, TERMS_DOC } from "@/data/legal";
import { buildAlternates } from "@/lib/seo";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const title = pickLocaleValue(TERMS_DOC.title, locale);
  const description = pickLocaleValue(TERMS_DOC.lead, locale);
  const alternates = buildAlternates(locale, "/terms");
  return {
    title,
    description,
    alternates,
    openGraph: { title, description, url: alternates.canonical },
    twitter: { title, description },
  };
}

export default async function TermsPage({ params }: Props) {
  const { locale } = await params;
  return <LegalDocView doc={TERMS_DOC} locale={locale} />;
}
