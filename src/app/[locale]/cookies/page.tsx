import { LegalDocView } from "@/components/legal/LegalDocView";
import { COOKIES_DOC, pickLocaleValue } from "@/data/legal";
import { buildAlternates } from "@/lib/seo";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const title = pickLocaleValue(COOKIES_DOC.title, locale);
  const description = pickLocaleValue(COOKIES_DOC.lead, locale);
  const alternates = buildAlternates(locale, "/cookies");
  return {
    title,
    description,
    alternates,
    openGraph: { title, description, url: alternates.canonical },
    twitter: { title, description },
  };
}

export default async function CookiesPage({ params }: Props) {
  const { locale } = await params;
  return <LegalDocView doc={COOKIES_DOC} locale={locale} />;
}
