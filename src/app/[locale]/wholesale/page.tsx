import { LeadForm } from "@/components/forms/LeadForm";
import { PageHero } from "@/components/layout/PageHero";
import { Link } from "@/i18n/navigation";
import {
  bttFieldClass,
  bttPrimaryButtonClass,
  bttSecondaryAmberButtonClass,
  bttSecondaryNeutralButtonClass,
} from "@/lib/ui-classes";
import { cn } from "@/lib/utils";
import { getTranslations } from "next-intl/server";

type MetadataProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: MetadataProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "wholesale" });
  return {
    title: t("title"),
    description: t("lead"),
  };
}

export default async function WholesalePage() {
  const t = await getTranslations("wholesale");
  const tc = await getTranslations("common");

  return (
    <div className="btt-container py-14 md:py-20">
      <div className="mx-auto max-w-3xl">
        <PageHero kicker={t("kicker")} title={t("title")} lead={t("lead")}>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/contacts"
              className={bttSecondaryAmberButtonClass}
            >
              {t("cta_contacts")}
            </Link>
            <Link
              href="/catalog"
              className={bttSecondaryNeutralButtonClass}
            >
              {t("cta_catalog")}
            </Link>
            <Link
              href="/faq"
              className="btt-focus inline-flex items-center rounded-full border border-white/10 bg-transparent px-4 py-2 text-sm font-semibold text-stone-400 transition hover:border-white/20 hover:text-stone-200 motion-reduce:transition-none"
            >
              {t("cta_faq")}
            </Link>
          </div>
        </PageHero>

        <div className="mt-10 md:mt-12">
          <h2 className="text-lg font-semibold text-stone-50 md:text-xl">{t("benefits_title")}</h2>
          <ul className="mt-5 grid gap-4 sm:grid-cols-3">
            {([1, 2, 3] as const).map((i) => (
              <li
                key={i}
                className="btt-glass flex h-full min-h-0 flex-col rounded-2xl border border-white/[0.07] p-5 md:rounded-3xl md:p-6"
              >
                <h3 className="line-clamp-2 min-h-[2.5rem] text-sm font-semibold leading-snug text-amber-200/95 md:min-h-[2.75rem] md:text-base">
                  {t(`benefit_${i}_title`)}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-stone-400">{t(`benefit_${i}_body`)}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="btt-glass mt-10 rounded-2xl border border-white/[0.07] p-6 md:mt-12 md:rounded-3xl md:p-8">
          <h2 className="text-lg font-semibold text-stone-50 md:text-xl">{t("steps_title")}</h2>
          <ol className="mt-5 list-decimal space-y-3 pl-5 text-sm leading-relaxed text-stone-400 md:pl-6 md:text-base">
            <li>{t("step1")}</li>
            <li>{t("step2")}</li>
            <li>{t("step3")}</li>
          </ol>
        </div>

        <LeadForm
          kind="wholesale"
          className="btt-glass mt-8 grid gap-4 rounded-2xl p-6 md:rounded-3xl md:p-8"
        >
          <h2 className="text-lg font-semibold text-stone-50">{t("form_title")}</h2>
          <p className="text-sm text-stone-500">{t("form_note")}</p>
          <input
            className={bttFieldClass}
            placeholder={tc("company")}
            name="wholesale_company"
            autoComplete="organization"
            aria-label={tc("company")}
          />
          <input
            className={bttFieldClass}
            placeholder={tc("phone")}
            name="wholesale_phone"
            type="tel"
            required
            autoComplete="tel"
            inputMode="tel"
            aria-label={tc("phone")}
          />
          <textarea
            className={`min-h-[120px] ${bttFieldClass}`}
            placeholder={t("ph_details")}
            name="wholesale_details"
            required
            minLength={8}
            aria-label={t("ph_details")}
          />
          <label className="text-sm text-stone-400">
            {t("attach")}
            <input
              type="file"
              className="mt-2 block w-full text-sm text-stone-400 file:mr-4 file:rounded-lg file:border-0 file:bg-white/10 file:px-4 file:py-2 file:text-sm file:text-stone-200"
            />
          </label>
          <button
            type="submit"
            className={cn(bttPrimaryButtonClass, "btt-focus w-fit")}
          >
            {tc("submit")}
          </button>
        </LeadForm>

        <p className="mt-8 text-sm text-stone-500">{t("cases")}</p>
      </div>
    </div>
  );
}
