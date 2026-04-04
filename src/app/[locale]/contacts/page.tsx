import { getTranslations } from "next-intl/server";

export async function generateMetadata() {
  const t = await getTranslations("contacts");
  return { title: `${t("title")} | Bententrade` };
}

export default async function ContactsPage() {
  const t = await getTranslations("contacts");

  return (
    <div className="btt-container max-w-3xl py-14">
      <h1 className="text-3xl font-semibold">{t("title")}</h1>
      <div className="mt-10 grid gap-10 md:grid-cols-2">
        <div>
          <h2 className="font-semibold">{t("showroom")}</h2>
          <p className="mt-2 text-sm text-btt-muted">
            Ташкент, ул. Примерная, 1 — визит по записи.
          </p>
          <h2 className="mt-6 font-semibold">{t("channels")}</h2>
          <p className="mt-2 text-sm text-btt-muted">+998 00 000 00 00 · Telegram · Instagram</p>
        </div>
        <form className="grid gap-3 rounded-btt border border-btt-border p-4">
          <h2 className="font-semibold">{t("form_feedback")}</h2>
          <input className="rounded-btt border px-3 py-2" placeholder="Email / телефон" />
          <textarea className="min-h-[100px] rounded-btt border px-3 py-2" />
          <button
            type="button"
            className="rounded-full bg-btt-primary px-4 py-2 text-sm font-semibold text-white"
          >
            Отправить
          </button>
        </form>
        <form className="grid gap-3 rounded-btt border border-btt-border p-4 md:col-span-2">
          <h2 className="font-semibold">{t("form_b2b")}</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <input className="rounded-btt border px-3 py-2" placeholder="Компания" />
            <input className="rounded-btt border px-3 py-2" placeholder="ИНН" />
          </div>
          <textarea className="min-h-[100px] rounded-btt border px-3 py-2" placeholder="Запрос" />
          <button
            type="button"
            className="w-fit rounded-full bg-btt-primary px-4 py-2 text-sm font-semibold text-white"
          >
            Отправить
          </button>
        </form>
      </div>
    </div>
  );
}
