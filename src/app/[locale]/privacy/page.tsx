import { PageBackNav } from "@/components/layout/PageBackNav";
import { buildAlternates } from "@/lib/seo";

type Props = { params: Promise<{ locale: string }> };

const COPY = {
  ru: {
    title: "Политика конфиденциальности",
    body: "Мы используем ваши контактные данные только для обработки заявки, связи по заказу и сопровождения отгрузки. Данные не передаются третьим лицам, кроме служб, необходимых для выполнения заказа и доставки.",
  },
  en: {
    title: "Privacy Policy",
    body: "We use your contact data only to process requests, communicate about orders, and support shipping. We do not share data with third parties except services required for order fulfillment and delivery.",
  },
  uz: {
    title: "Maxfiylik siyosati",
    body: "Kontakt ma'lumotlaringiz faqat so'rovni qayta ishlash, buyurtma bo'yicha aloqa va jo'natmani kuzatish uchun ishlatiladi. Ma'lumotlar buyurtmani bajarish va yetkazib berish uchun zarur xizmatlardan tashqari uchinchi tomonlarga berilmaydi.",
  },
} as const;

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const l = (locale in COPY ? locale : "ru") as keyof typeof COPY;
  return {
    title: COPY[l].title,
    description: COPY[l].body,
    alternates: buildAlternates(locale, "/privacy"),
  };
}

export default async function PrivacyPage({ params }: Props) {
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
