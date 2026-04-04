import { getTranslations } from "next-intl/server";

export async function generateMetadata() {
  const t = await getTranslations("about");
  return { title: `${t("title")} | Bententrade` };
}

export default async function AboutPage() {
  const t = await getTranslations("about");

  return (
    <div className="btt-container max-w-3xl py-14">
      <h1 className="text-3xl font-semibold">{t("title")}</h1>
      <section className="mt-8 space-y-4 text-btt-muted">
        <h2 className="text-lg font-semibold text-foreground">{t("quality")}</h2>
        <p>
          Контроль партии, спектрофотометр по запросу для HoReCa и дилеров. Производство
          и склад в одном контуре — меньше расхождений цвета между отгрузками.
        </p>
        <h2 className="text-lg font-semibold text-foreground">{t("batch")}</h2>
        <p>
          Каждая партия маркируется. Для опта — один номер партии на весь заказ, где это
          возможно по объёму.
        </p>
        <h2 className="text-lg font-semibold text-foreground">{t("requisites")}</h2>
        <p>
          Реквизиты для договора и счёта высылаются после заявки на opt@bententrade.uz
          (пример домена — замените на боевой).
        </p>
      </section>
    </div>
  );
}
