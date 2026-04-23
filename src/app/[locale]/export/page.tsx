import { LeadForm } from "@/components/forms/LeadForm";
import { MicroTrustStrip } from "@/components/home/MicroTrustStrip";
import { PageHero } from "@/components/layout/PageHero";
import { AnimatedReveal } from "@/components/ui/animated-reveal";
import { Link } from "@/i18n/navigation";
import {
  bttFieldClass,
  bttPrimaryButtonClass,
  bttSecondaryAmberButtonClass,
  bttSecondaryNeutralButtonClass,
  bttSelectFieldClass,
} from "@/lib/ui-classes";
import { cn } from "@/lib/utils";
import { getTranslations } from "next-intl/server";

type MetadataProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: MetadataProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "export_page" });
  return {
    title: t("title"),
    description: t("lead"),
  };
}

export default async function ExportPage() {
  const t = await getTranslations("export_page");

  return (
    <div className="btt-container py-14 md:py-20">
      <div className="mx-auto max-w-3xl">
        <PageHero kicker={t("kicker")} title={t("title")} lead={t("lead")}>
          <p className="max-w-2xl text-sm font-medium text-amber-400/95 md:text-base">
            {t("quote_checkout")}
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/contacts"
              className={bttSecondaryAmberButtonClass}
            >
              {t("cta_contacts")}
            </Link>
            <Link
              href="/wholesale"
              className={bttSecondaryNeutralButtonClass}
            >
              {t("cta_wholesale")}
            </Link>
          </div>
        </PageHero>

        <AnimatedReveal className="mt-6" delay={0.02}>
          <MicroTrustStrip />
        </AnimatedReveal>

        <AnimatedReveal delay={0.04}>
          <div className="btt-glass mt-10 rounded-2xl border border-white/[0.07] p-6 md:mt-12 md:rounded-3xl md:p-8">
          <h2 className="text-lg font-semibold text-stone-50 md:text-xl">{t("checklist_title")}</h2>
          <ol className="mt-5 list-decimal space-y-3 pl-5 text-sm leading-relaxed text-stone-400 md:pl-6 md:text-base">
            <li>{t("checklist_1")}</li>
            <li>{t("checklist_2")}</li>
            <li>{t("checklist_3")}</li>
            <li>{t("checklist_4")}</li>
          </ol>
          </div>
        </AnimatedReveal>

        <AnimatedReveal delay={0.1}>
          <LeadForm
            kind="export_quote"
            source="export_page"
            className="btt-glass mt-8 grid gap-5 rounded-2xl p-6 md:rounded-3xl md:p-8"
          >
          <label className="grid gap-1.5 text-sm text-stone-300">
            {t("country")}
            <input
              className={bttFieldClass}
              type="text"
              name="export_country"
              required
              minLength={2}
              autoComplete="country-name"
              aria-label={t("country")}
            />
          </label>
          <label className="grid gap-1.5 text-sm text-stone-300">
            {t("currency")}
            <select
              className={bttSelectFieldClass}
              name="export_currency"
              defaultValue="USD"
              aria-label={t("currency")}
            >
              <option value="USD">USD</option>
              <option value="UZS">UZS</option>
            </select>
          </label>
          <label className="grid gap-1.5 text-sm text-stone-300">
            {t("duties")}
            <input
              className={bttFieldClass}
              placeholder={t("ph_duties")}
              type="text"
              name="export_duties"
              aria-label={t("duties")}
            />
          </label>
          <button
            type="submit"
            className={cn(bttPrimaryButtonClass, "btt-focus w-fit")}
          >
            {t("request_calc")}
          </button>
          <p className="text-sm text-stone-500">{t("form_note")}</p>
          </LeadForm>
        </AnimatedReveal>
      </div>
    </div>
  );
}
