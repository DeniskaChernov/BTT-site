import { HeroSection } from "@/components/home/HeroSection";
import { HomeHits } from "@/components/home/HomeHits";
import { SegmentSection } from "@/components/home/SegmentSection";
import { RattanQuiz } from "@/components/quiz/RattanQuiz";
import { getTranslations } from "next-intl/server";

export default async function HomePage() {
  const t = await getTranslations("home");

  return (
    <>
      <HeroSection />
      <SegmentSection />
      <HomeHits />
      <section className="btt-container py-16 md:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl font-semibold md:text-3xl">{t("quiz_title")}</h2>
          <p className="mt-2 text-btt-muted">{t("quiz_sub")}</p>
        </div>
        <div className="mx-auto mt-10 max-w-4xl">
          <RattanQuiz />
        </div>
      </section>
      <section className="btt-container pb-20">
        <div className="btt-card grid gap-6 p-8 md:grid-cols-2 md:p-10">
          <div>
            <h2 className="text-xl font-semibold">{t("reviews")}</h2>
            <p className="mt-3 text-sm text-btt-muted">
              «Партия ровная, цвет совпал с образцом. Заказали повтор без вопросов.»
            </p>
            <p className="mt-2 text-xs text-btt-muted">— мастерская, Ташкент</p>
          </div>
          <div>
            <h2 className="text-xl font-semibold">{t("cases")}</h2>
            <p className="mt-3 text-sm text-btt-muted">
              HoReCa: кашпо L для террасы — отгрузка за 48 часов, документы приложены.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
