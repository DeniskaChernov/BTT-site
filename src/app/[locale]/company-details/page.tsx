import { PageBackNav } from "@/components/layout/PageBackNav";
import { buildAlternates } from "@/lib/seo";

type Props = { params: Promise<{ locale: string }> };

const COPY = {
  ru: {
    title: "Реквизиты компании",
    body: "Bententrade, Узбекистан, Ташкент. Для договора, счёта и закрывающих документов отправьте запрос на opt@bententrade.uz или по телефону +998 77 104 44 22.",
  },
  en: {
    title: "Company Details",
    body: "Bententrade, Uzbekistan, Tashkent. For contracts, invoices, and accounting documents, contact opt@bententrade.uz or +998 77 104 44 22.",
  },
  uz: {
    title: "Kompaniya rekvizitlari",
    body: "Bententrade, O'zbekiston, Toshkent. Shartnoma, hisob-faktura va yopuvchi hujjatlar uchun opt@bententrade.uz yoki +998 77 104 44 22 ga murojaat qiling.",
  },
} as const;

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const l = (locale in COPY ? locale : "ru") as keyof typeof COPY;
  return {
    title: COPY[l].title,
    description: COPY[l].body,
    alternates: buildAlternates(locale, "/company-details"),
  };
}

export default async function CompanyDetailsPage({ params }: Props) {
  const { locale } = await params;
  const l = (locale in COPY ? locale : "ru") as keyof typeof COPY;
  return (
    <div className="btt-container py-12 md:py-16">
      <PageBackNav fallbackHref="/" />
      <h1 className="text-3xl font-bold tracking-tight text-stone-50 md:text-4xl">
        {COPY[l].title}
      </h1>
      <p className="mt-4 max-w-3xl leading-relaxed text-stone-300">{COPY[l].body}</p>
    </div>
  );
}
