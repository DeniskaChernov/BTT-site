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
    title: `${t("title")} | Bententrade`,
    description: `${t("showroom_address")} ${t("channels_line")}`,
  };
}

export default async function ContactsPage() {
  const t = await getTranslations("contacts");
  const tc = await getTranslations("common");

  return (
    <div className="btt-container max-w-4xl py-14 md:py-20">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-500/90">
        Bententrade
      </p>
      <h1 className="mt-3 text-4xl font-bold tracking-tight text-stone-50 md:text-5xl">
        {t("title")}
      </h1>

      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        <div className="btt-glass rounded-3xl p-6 md:p-8">
          <h2 className="text-lg font-semibold text-stone-50">{t("showroom")}</h2>
          <p className="mt-2 text-sm text-stone-400">{t("showroom_address")}</p>
          <h2 className="mt-8 text-lg font-semibold text-stone-50">{t("channels")}</h2>
          <p className="mt-2 text-sm text-stone-400">{t("channels_line")}</p>
        </div>

        <form className="btt-glass grid gap-4 rounded-3xl p-6 md:p-8">
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

        <form className="btt-glass grid gap-4 rounded-3xl p-6 md:p-8 lg:col-span-2">
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
