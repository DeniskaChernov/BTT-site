import { LeadForm } from "@/components/forms/LeadForm";
import { MicroTrustStrip } from "@/components/home/MicroTrustStrip";
import { PageHero } from "@/components/layout/PageHero";
import { AnimatedReveal } from "@/components/ui/animated-reveal";
import { bttFieldClass, bttPrimaryButtonClass } from "@/lib/ui-classes";
import { cn } from "@/lib/utils";
import { getTranslations } from "next-intl/server";

type MetadataProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: MetadataProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contacts" });
  return {
    title: t("title"),
    description: t("meta_description"),
  };
}

export default async function ContactsPage() {
  const t = await getTranslations("contacts");
  const tc = await getTranslations("common");

  return (
    <div className="btt-container max-w-4xl py-14 md:py-20">
      <PageHero kicker={t("kicker")} title={t("title")} lead={t("lead")} />

      <AnimatedReveal className="mt-6" delay={0.02}>
        <MicroTrustStrip />
      </AnimatedReveal>

      <div className="mt-10 grid gap-6 lg:grid-cols-2 lg:gap-8">
        <AnimatedReveal className="h-full min-h-0" delay={0}>
          <div className="btt-glass h-full rounded-2xl p-6 md:rounded-3xl md:p-8">
          <h2 className="text-lg font-semibold text-stone-50">{t("showroom")}</h2>
          <p className="mt-2 text-sm text-stone-400">{t("showroom_address")}</p>
          <h2 className="mt-8 text-lg font-semibold text-stone-50">{t("channels")}</h2>
          <div className="mt-3 flex flex-col gap-2 text-sm">
            <a
              href="tel:+998771044422"
              className="btt-focus w-fit font-medium text-amber-400/95 underline-offset-4 transition hover:text-amber-300 hover:underline"
            >
              {t("phone_display")}
            </a>
            <a
              href="https://t.me/BenTenTrade"
              target="_blank"
              rel="noopener noreferrer"
              className="btt-focus w-fit text-amber-400/90 underline-offset-4 transition hover:text-amber-300 hover:underline"
            >
              {t("telegram_display")}
            </a>
          </div>
          <p className="mt-3 text-xs text-stone-500">{t("channels_hint")}</p>
          </div>
        </AnimatedReveal>

        <LeadForm
          kind="contacts_feedback"
          className="btt-glass grid gap-4 rounded-2xl p-6 md:rounded-3xl md:p-8"
        >
          <h2 className="text-lg font-semibold text-stone-50">{t("form_feedback")}</h2>
          <input
            className={bttFieldClass}
            placeholder={t("ph_email")}
            type="text"
            name="feedback_contact"
            autoComplete="email"
            aria-label={t("ph_email")}
          />
          <textarea
            className={`min-h-[100px] ${bttFieldClass}`}
            placeholder={tc("comment")}
            name="feedback_message"
            required
            minLength={3}
            aria-label={tc("comment")}
          />
          <button
            type="submit"
            className={cn(bttPrimaryButtonClass, "btt-focus w-fit")}
          >
            {tc("submit")}
          </button>
        </LeadForm>

        <AnimatedReveal className="lg:col-span-2" delay={0.08}>
          <LeadForm
            kind="contacts_b2b"
            className="btt-glass grid gap-4 rounded-2xl p-6 md:rounded-3xl md:p-8"
          >
            <h2 className="text-lg font-semibold text-stone-50">{t("form_b2b")}</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <input
                className={bttFieldClass}
                placeholder={t("ph_company")}
                name="b2b_company"
                autoComplete="organization"
                aria-label={t("ph_company")}
              />
              <input
                className={bttFieldClass}
                placeholder={t("ph_inn")}
                name="b2b_tax_id"
                aria-label={t("ph_inn")}
              />
            </div>
            <textarea
              className={`min-h-[100px] ${bttFieldClass}`}
              placeholder={t("ph_request")}
              name="b2b_request"
              required
              minLength={8}
              aria-label={t("ph_request")}
            />
            <button
              type="submit"
              className={cn(bttPrimaryButtonClass, "btt-focus w-fit")}
            >
              {tc("submit")}
            </button>
          </LeadForm>
        </AnimatedReveal>
      </div>
    </div>
  );
}
