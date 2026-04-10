import { getTranslations } from "next-intl/server";

type MetadataProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: MetadataProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "faq" });
  return {
    title: `${t("title")} | Bententrade`,
    description: t("a_pay"),
  };
}

export default async function FaqPage() {
  const t = await getTranslations("faq");

  const items = [
    { q: t("pay"), a: t("a_pay") },
    { q: t("ship"), a: t("a_ship") },
    { q: t("min_weight"), a: t("a_min_weight") },
    { q: t("pick"), a: t("a_pick") },
    { q: t("returns"), a: t("a_returns") },
  ];

  return (
    <div className="btt-container max-w-3xl py-14 md:py-20">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-500/90">FAQ</p>
      <h1 className="mt-3 text-4xl font-bold tracking-tight text-stone-50 md:text-5xl">
        {t("title")}
      </h1>
      <ul className="mt-10 space-y-4">
        {items.map((item) => (
          <li key={item.q} className="btt-glass rounded-3xl p-6 md:p-8">
            <h2 className="text-lg font-semibold text-stone-50">{item.q}</h2>
            <p className="mt-3 text-sm leading-relaxed text-stone-400">{item.a}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
