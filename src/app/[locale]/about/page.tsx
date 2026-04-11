import { PageHero } from "@/components/layout/PageHero";
import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";

type MetadataProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: MetadataProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });
  return {
    title: `${t("title")} | Bententrade`,
    description: t("meta_description"),
  };
}

export default async function AboutPage() {
  const t = await getTranslations("about");

  const blocks = [
    { title: t("quality"), body: t("quality_body") },
    { title: t("batch"), body: t("batch_body") },
    { title: t("requisites"), body: t("requisites_body") },
  ];

  return (
    <div className="btt-container py-14 md:py-20">
      <div className="mx-auto max-w-3xl">
        <PageHero kicker={t("kicker")} title={t("title")} lead={t("lead")}>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/catalog"
              className="inline-flex items-center rounded-full border border-amber-500/35 bg-amber-500/10 px-4 py-2 text-sm font-semibold text-amber-100 transition hover:border-amber-400/50 hover:bg-amber-500/15"
            >
              {t("cta_catalog")}
            </Link>
            <Link
              href="/contacts"
              className="inline-flex items-center rounded-full border border-white/15 bg-white/[0.04] px-4 py-2 text-sm font-semibold text-stone-200 transition hover:border-white/25"
            >
              {t("cta_contacts")}
            </Link>
          </div>
        </PageHero>

        <div className="mt-10 space-y-5 md:mt-12 md:space-y-6">
          {blocks.map((b) => (
            <section
              key={b.title}
              className="btt-glass rounded-2xl border-l-2 border-l-amber-500/35 p-6 md:rounded-3xl md:p-8"
            >
              <h2 className="text-lg font-semibold text-stone-50 md:text-xl">{b.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-stone-400 md:text-base">{b.body}</p>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
