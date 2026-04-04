import { getTranslations } from "next-intl/server";

export async function generateMetadata() {
  const t = await getTranslations("export_page");
  return { title: `${t("title")} | Bententrade` };
}

export default async function ExportPage() {
  const t = await getTranslations("export_page");

  return (
    <div className="btt-container max-w-3xl py-14">
      <h1 className="text-3xl font-semibold">{t("title")}</h1>
      <p className="mt-4 text-btt-muted">{t("lead")}</p>
      <p className="mt-6 text-sm font-medium text-btt-accent">{t("quote_checkout")}</p>
      <form className="mt-8 grid gap-4 rounded-btt border border-btt-border p-6">
        <label className="grid gap-1 text-sm">
          {t("country")}
          <input className="rounded-btt border px-3 py-2" />
        </label>
        <label className="grid gap-1 text-sm">
          {t("currency")}
          <select className="rounded-btt border px-3 py-2">
            <option>USD</option>
            <option>UZS</option>
          </select>
        </label>
        <label className="grid gap-1 text-sm">
          {t("duties")}
          <input className="rounded-btt border px-3 py-2" placeholder="0–15% ориентир" />
        </label>
        <button
          type="button"
          className="rounded-full bg-btt-primary px-6 py-3 text-sm font-semibold text-white"
        >
          {t("request_calc")}
        </button>
      </form>
    </div>
  );
}
