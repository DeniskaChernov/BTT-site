import { getTranslations } from "next-intl/server";

export async function generateMetadata() {
  const t = await getTranslations("about");
  return { title: `${t("title")} | Bententrade` };
}

export default async function AboutPage() {
  const t = await getTranslations("about");

  const blocks = [
    { title: t("quality"), body: t("quality_body") },
    { title: t("batch"), body: t("batch_body") },
    { title: t("requisites"), body: t("requisites_body") },
  ];

  return (
    <div className="btt-container max-w-3xl py-14 md:py-20">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-500/90">
        {t("kicker")}
      </p>
      <h1 className="mt-3 text-4xl font-bold tracking-tight text-stone-50 md:text-5xl">
        {t("title")}
      </h1>
      <div className="mt-10 space-y-6">
        {blocks.map((b) => (
          <section key={b.title} className="btt-glass rounded-3xl p-6 md:p-8">
            <h2 className="text-lg font-semibold text-stone-50">{b.title}</h2>
            <p className="mt-3 text-sm leading-relaxed text-stone-400">{b.body}</p>
          </section>
        ))}
      </div>
    </div>
  );
}
