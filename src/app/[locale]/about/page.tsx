import { PageHero } from "@/components/layout/PageHero";
import { Link } from "@/i18n/navigation";
import {
  bttSecondaryAmberButtonClass,
  bttSecondaryNeutralButtonClass,
} from "@/lib/ui-classes";
import { getTranslations } from "next-intl/server";

type MetadataProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: MetadataProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });
  return {
    title: t("title"),
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
              className={bttSecondaryAmberButtonClass}
            >
              {t("cta_catalog")}
            </Link>
            <Link
              href="/contacts"
              className={bttSecondaryNeutralButtonClass}
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
