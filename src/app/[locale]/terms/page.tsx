import { buildAlternates } from "@/lib/seo";

type Props = { params: Promise<{ locale: string }> };

const COPY = {
  ru: {
    title: "Оферта",
    body: "Оформляя заказ, вы подтверждаете согласие с условиями оплаты, сроками производства и доставки, а также правилами возврата для стандартных и индивидуальных позиций.",
  },
  en: {
    title: "Terms",
    body: "By placing an order, you agree to payment terms, production and delivery timelines, and return rules for standard and custom items.",
  },
  uz: {
    title: "Oferta",
    body: "Buyurtma berish orqali to'lov shartlari, ishlab chiqarish va yetkazib berish muddatlari, shuningdek standart va individual pozitsiyalar uchun qaytarish qoidalariga rozilik bildirasiz.",
  },
} as const;

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const l = (locale in COPY ? locale : "ru") as keyof typeof COPY;
  return {
    title: COPY[l].title,
    description: COPY[l].body,
    alternates: buildAlternates(locale, "/terms"),
  };
}

export default async function TermsPage({ params }: Props) {
  const { locale } = await params;
  const l = (locale in COPY ? locale : "ru") as keyof typeof COPY;
  return (
    <div className="btt-container py-12 md:py-16">
      <h1 className="text-3xl font-bold tracking-tight text-stone-50 md:text-4xl">
        {COPY[l].title}
      </h1>
      <p className="mt-4 max-w-3xl leading-relaxed text-stone-300">{COPY[l].body}</p>
    </div>
  );
}
