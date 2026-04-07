import { bttFieldClass, bttPrimaryButtonClass } from "@/lib/ui-classes";
import { cn } from "@/lib/utils";
import { getTranslations } from "next-intl/server";

export async function generateMetadata() {
  const t = await getTranslations("wholesale");
  return { title: `${t("title")} | Bententrade` };
}

export default async function WholesalePage() {
  const t = await getTranslations("wholesale");
  const tc = await getTranslations("common");

  return (
    <div className="btt-container max-w-3xl py-14 md:py-20">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-500/90">HoReCa</p>
      <h1 className="mt-3 text-4xl font-bold tracking-tight text-stone-50 md:text-5xl">
        {t("title")}
      </h1>
      <p className="mt-4 text-stone-400">{t("lead")}</p>

      <div className="btt-glass mt-10 rounded-3xl p-6 md:p-8">
        <h2 className="text-lg font-semibold text-stone-50">{t("steps_title")}</h2>
        <ol className="mt-4 list-decimal space-y-2 pl-6 text-sm text-stone-400">
          <li>{t("step1")}</li>
          <li>{t("step2")}</li>
          <li>{t("step3")}</li>
        </ol>
      </div>

      <form className="btt-glass mt-8 grid gap-4 rounded-3xl p-6 md:p-8">
        <h2 className="text-lg font-semibold text-stone-50">{t("form_title")}</h2>
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
          autoComplete="tel"
          aria-label={tc("phone")}
        />
        <textarea
          className={`min-h-[120px] ${bttFieldClass}`}
          placeholder={t("ph_details")}
          name="wholesale_details"
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
          type="button"
          className={cn(bttPrimaryButtonClass, "w-fit")}
        >
          {tc("submit")}
        </button>
      </form>

      <p className="mt-10 text-sm text-stone-500">{t("cases")}</p>
    </div>
  );
}
