import {
  bttFieldClass,
  bttPrimaryButtonClass,
  bttSelectFieldClass,
} from "@/lib/ui-classes";
import { cn } from "@/lib/utils";
import { getTranslations } from "next-intl/server";

export async function generateMetadata() {
  const t = await getTranslations("export_page");
  return { title: `${t("title")} | Bententrade` };
}

export default async function ExportPage() {
  const t = await getTranslations("export_page");

  return (
    <div className="btt-container max-w-3xl py-14 md:py-20">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-500/90">B2B</p>
      <h1 className="mt-3 text-4xl font-bold tracking-tight text-stone-50 md:text-5xl">
        {t("title")}
      </h1>
      <p className="mt-4 text-stone-400">{t("lead")}</p>
      <p className="mt-4 text-sm font-medium text-amber-400/90">{t("quote_checkout")}</p>

      <form className="btt-glass mt-10 grid gap-5 rounded-3xl p-6 md:p-8">
        <label className="grid gap-1.5 text-sm text-stone-300">
          {t("country")}
          <input className={bttFieldClass} type="text" />
        </label>
        <label className="grid gap-1.5 text-sm text-stone-300">
          {t("currency")}
          <select className={bttSelectFieldClass}>
            <option>USD</option>
            <option>UZS</option>
          </select>
        </label>
        <label className="grid gap-1.5 text-sm text-stone-300">
          {t("duties")}
          <input
            className={bttFieldClass}
            placeholder={t("ph_duties")}
            type="text"
          />
        </label>
        <button
          type="button"
          className={cn(bttPrimaryButtonClass, "w-fit")}
        >
          {t("request_calc")}
        </button>
      </form>
    </div>
  );
}
