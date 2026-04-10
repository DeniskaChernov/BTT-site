import { getTranslations } from "next-intl/server";

type MetadataProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: MetadataProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "articles" });
  return {
    title: `${t("title")} | Bententrade`,
    description: t("lead"),
  };
}

export default async function ArticlesPage() {
  const t = await getTranslations("articles");

  const cards = [
    { titleKey: "card_1_title" as const, descKey: "card_1_desc" as const },
    { titleKey: "card_2_title" as const, descKey: "card_2_desc" as const },
    { titleKey: "card_3_title" as const, descKey: "card_3_desc" as const },
  ];

  return (
    <div className="btt-container py-14 md:py-20">
      <header className="max-w-3xl">
        <h1 className="text-3xl font-bold tracking-tight text-stone-50 md:text-4xl">
          {t("title")}
        </h1>
        <p className="mt-4 text-lg text-stone-400">{t("lead")}</p>
        <p className="mt-3 text-pretty text-stone-500">{t("intro")}</p>
      </header>

      <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <li
            key={c.titleKey}
            className="flex flex-col rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 backdrop-blur-md [box-shadow:inset_0_1px_0_0_rgba(255,255,255,0.06)]"
          >
            <span className="w-fit rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-amber-200/95">
              {t("badge_soon")}
            </span>
            <h2 className="mt-4 text-lg font-semibold text-stone-100">{t(c.titleKey)}</h2>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-stone-500">
              {t(c.descKey)}
            </p>
          </li>
        ))}
      </ul>

      <p className="mt-12 text-center text-sm text-stone-500">{t("cta_all")}</p>
    </div>
  );
}
