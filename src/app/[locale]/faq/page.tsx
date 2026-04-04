import { getTranslations } from "next-intl/server";

export async function generateMetadata() {
  const t = await getTranslations("faq");
  return { title: `${t("title")} | Bententrade` };
}

export default async function FaqPage() {
  const t = await getTranslations("faq");

  const items = [
    { q: t("pay"), a: "Uzcard, Humo, Payme, Click — в sandbox до подключения боевых ключей. Счёт для юрлиц — по запросу." },
    { q: t("ship"), a: "24–48 часов по согласованию для стандартных позиций. Кашпо XL — по срокам производства." },
    { q: t("min_weight"), a: "Розница от 1 кг по позиции. Опт — от объёма в КП." },
    { q: t("pick"), a: "Квиз на главной или карточка товара — без ожидания менеджера." },
    { q: t("returns"), a: "Нераспакованный рулон — до 7 дней по согласованию. Индивидуальные заказы — отдельные условия." },
  ];

  return (
    <div className="btt-container max-w-3xl py-14">
      <h1 className="text-3xl font-semibold">{t("title")}</h1>
      <ul className="mt-10 space-y-6">
        {items.map((item) => (
          <li key={item.q} className="btt-card p-5">
            <h2 className="font-semibold">{item.q}</h2>
            <p className="mt-2 text-sm text-btt-muted">{item.a}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
