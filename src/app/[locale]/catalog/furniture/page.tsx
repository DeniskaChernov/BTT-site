import { Link } from "@/i18n/navigation";

type Props = {
  params: Promise<{ locale: string }>;
};

const COPY = {
  ru: {
    title: "Мебель",
    note: "Страница на стадии разработки",
    back: "Открыть общий каталог",
  },
  en: {
    title: "Furniture",
    note: "Page is under development",
    back: "Open full catalog",
  },
  uz: {
    title: "Mebel",
    note: "Sahifa ishlab chiqish jarayonida",
    back: "Umumiy katalogni ochish",
  },
} as const;

export default async function CatalogFurniturePage({ params }: Props) {
  const { locale } = await params;
  const l = (locale in COPY ? locale : "ru") as keyof typeof COPY;

  return (
    <div className="btt-container py-12 md:py-16">
      <div className="mx-auto max-w-3xl rounded-3xl border border-white/[0.08] bg-white/[0.02] p-8 text-center md:p-10">
        <h1 className="text-3xl font-bold tracking-tight text-stone-50 md:text-4xl">
          {COPY[l].title}
        </h1>
        <p className="mt-4 text-lg text-stone-300">{COPY[l].note}</p>
        <div className="mt-8">
          <Link
            href="/catalog"
            className="btt-focus inline-flex rounded-full border border-white/15 bg-white/[0.03] px-6 py-3 text-sm font-semibold text-stone-200 transition hover:border-amber-500/35 hover:text-amber-100"
          >
            {COPY[l].back}
          </Link>
        </div>
      </div>
    </div>
  );
}
