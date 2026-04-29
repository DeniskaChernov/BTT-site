import { PageBackNav } from "@/components/layout/PageBackNav";
import { buildAlternates } from "@/lib/seo";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ locale: string }>;
};

const COPY = {
  ru: {
    title: "Мебель из искусственного ротанга",
    note: "Страница на стадии разработки.",
  },
  en: {
    title: "Synthetic rattan furniture",
    note: "Page is under development.",
  },
  uz: {
    title: "Sun’iy rotangdan mebel",
    note: "Sahifa ishlab chiqish jarayonida.",
  },
} as const;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const l = (locale in COPY ? locale : "ru") as keyof typeof COPY;
  return {
    title: COPY[l].title,
    description: COPY[l].note,
    alternates: buildAlternates(locale, "/catalog/furniture"),
  };
}

export default async function CatalogFurniturePage({ params }: Props) {
  const { locale } = await params;
  const l = (locale in COPY ? locale : "ru") as keyof typeof COPY;

  return (
    <div className="btt-container py-12 md:py-16">
      <PageBackNav fallbackHref="/catalog" />
      <div className="mx-auto max-w-3xl rounded-3xl border border-white/[0.08] bg-white/[0.02] p-8 text-center md:p-10">
        <h1 className="text-3xl font-bold tracking-tight text-stone-50 md:text-4xl">
          {COPY[l].title}
        </h1>
        <p className="mt-4 text-lg text-stone-300">{COPY[l].note}</p>
      </div>
    </div>
  );
}
