import { getTranslations } from "next-intl/server";

export default async function BlogPage() {
  const t = await getTranslations("blog");

  return (
    <div className="btt-container py-16 md:py-24">
      <h1 className="text-3xl font-bold tracking-tight text-stone-50 md:text-4xl">
        {t("title")}
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-stone-400">{t("lead")}</p>
    </div>
  );
}
