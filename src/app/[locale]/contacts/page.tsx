import { getTranslations } from "next-intl/server";

const fieldClass =
  "rounded-xl border border-white/15 bg-white/[0.05] px-3 py-2.5 text-sm text-stone-100 placeholder:text-stone-500 outline-none transition focus:border-amber-500/40 focus:ring-2 focus:ring-amber-500/20";

export async function generateMetadata() {
  const t = await getTranslations("contacts");
  return { title: `${t("title")} | Bententrade` };
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
          <input className={fieldClass} placeholder={t("ph_email")} type="text" />
          <textarea
            className={`min-h-[100px] ${fieldClass}`}
            placeholder={tc("comment")}
          />
          <button
            type="button"
            className="w-fit rounded-full bg-gradient-to-r from-amber-600 to-orange-600 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:from-amber-500 hover:to-orange-500"
          >
            {tc("submit")}
          </button>
        </form>

        <form className="btt-glass grid gap-4 rounded-3xl p-6 md:p-8 lg:col-span-2">
          <h2 className="text-lg font-semibold text-stone-50">{t("form_b2b")}</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <input className={fieldClass} placeholder={t("ph_company")} />
            <input className={fieldClass} placeholder={t("ph_inn")} />
          </div>
          <textarea className={`min-h-[100px] ${fieldClass}`} placeholder={t("ph_request")} />
          <button
            type="button"
            className="w-fit rounded-full bg-gradient-to-r from-amber-600 to-orange-600 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:from-amber-500 hover:to-orange-500"
          >
            {tc("submit")}
          </button>
        </form>
      </div>
    </div>
  );
}
