import { getTranslations } from "next-intl/server";

export async function generateMetadata() {
  const t = await getTranslations("wholesale");
  return { title: `${t("title")} | Bententrade` };
}

export default async function WholesalePage() {
  const t = await getTranslations("wholesale");

  return (
    <div className="btt-container max-w-3xl py-14">
      <h1 className="text-3xl font-semibold">{t("title")}</h1>
      <p className="mt-4 text-btt-muted">{t("lead")}</p>
      <h2 className="mt-10 text-xl font-semibold">{t("steps_title")}</h2>
      <ol className="mt-4 list-decimal space-y-2 pl-6 text-sm">
        <li>{t("step1")}</li>
        <li>{t("step2")}</li>
        <li>{t("step3")}</li>
      </ol>
      <form className="mt-10 grid gap-4 rounded-btt border border-btt-border p-6">
        <h2 className="font-semibold">{t("form_title")}</h2>
        <input className="rounded-btt border px-3 py-2" placeholder="Компания" />
        <input className="rounded-btt border px-3 py-2" placeholder="Телефон" />
        <textarea className="min-h-[120px] rounded-btt border px-3 py-2" placeholder="Объём, цвет, срок" />
        <label className="text-sm text-btt-muted">
          {t("attach")}
          <input type="file" className="mt-2 block w-full text-sm" />
        </label>
        <button
          type="button"
          className="rounded-full bg-btt-primary px-6 py-3 text-sm font-semibold text-white"
        >
          Отправить
        </button>
      </form>
      <p className="mt-10 text-sm text-btt-muted">{t("cases")}</p>
    </div>
  );
}
