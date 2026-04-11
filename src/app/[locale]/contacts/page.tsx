import { PageHero } from "@/components/layout/PageHero";
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

      <div className="mt-10 grid gap-6 lg:grid-cols-2 lg:gap-8">
        <div className="btt-glass rounded-2xl p-6 md:rounded-3xl md:p-8">
          <h2 className="text-lg font-semibold text-stone-50">{t("showroom")}</h2>
          <p className="mt-2 text-sm text-stone-400">{t("showroom_address")}</p>
          <h2 className="mt-8 text-lg font-semibold text-stone-50">{t("channels")}</h2>
          <div className="mt-3 flex flex-col gap-2 text-sm">
            <a
              href="tel:+998771044422"
              className="w-fit font-medium text-amber-400/95 underline-offset-4 transition hover:text-amber-300 hover:underline"
            >
              {t("phone_display")}
            </a>
            <a
              href="https://t.me/BenTenTrade"
              target="_blank"
              rel="noopener noreferrer"
              className="w-fit text-amber-400/90 underline-offset-4 transition hover:text-amber-300 hover:underline"
            >
              {t("telegram_display")}
            </a>
          </div>
          <p className="mt-3 text-xs text-stone-500">{t("channels_hint")}</p>
        </div>

        <form className="btt-glass grid gap-4 rounded-2xl p-6 md:rounded-3xl md:p-8">
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
            aria-label={tc("comment")}
          />
          <button
            type="button"
            className={cn(bttPrimaryButtonClass, "w-fit")}
          >
            {tc("submit")}
          </button>
        </form>

        <form className="btt-glass grid gap-4 rounded-2xl p-6 md:rounded-3xl md:p-8 lg:col-span-2">
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
            aria-label={t("ph_request")}
          />
          <button
            type="button"
            className={cn(bttPrimaryButtonClass, "w-fit")}
          >
            {tc("submit")}
          </button>
        </form>
      </div>
    </div>
  );
}
