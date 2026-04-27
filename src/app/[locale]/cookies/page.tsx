import { buildAlternates } from "@/lib/seo";

type Props = { params: Promise<{ locale: string }> };

const COPY = {
  ru: {
    title: "Политика cookies",
    body: "Сайт использует cookies для работы корзины, сохранения языковых настроек и улучшения пользовательского опыта. Вы можете ограничить cookies в настройках браузера.",
  },
  en: {
    title: "Cookies Policy",
    body: "The site uses cookies for cart functionality, language preferences, and UX improvements. You can restrict cookies in your browser settings.",
  },
  uz: {
    title: "Cookies siyosati",
    body: "Sayt savat ishlashi, til sozlamalari va foydalanuvchi tajribasini yaxshilash uchun cookies dan foydalanadi. Brauzer sozlamalarida cookies ni cheklashingiz mumkin.",
  },
} as const;

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const l = (locale in COPY ? locale : "ru") as keyof typeof COPY;
  return {
    title: COPY[l].title,
    description: COPY[l].body,
    alternates: buildAlternates(locale, "/cookies"),
  };
}

export default async function CookiesPage({ params }: Props) {
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
