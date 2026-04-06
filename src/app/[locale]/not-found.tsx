import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";

export default async function NotFound() {
  const t = await getTranslations("notFound");

  return (
    <div className="btt-container flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
      <p className="text-8xl font-bold tabular-nums text-stone-800">404</p>
      <h1 className="mt-4 text-2xl font-semibold text-stone-200">
        {t("title")}
      </h1>
      <p className="mt-2 max-w-md text-stone-500">{t("body")}</p>
      <Link
        href="/"
        className="mt-10 inline-flex rounded-full bg-gradient-to-r from-amber-600 to-orange-600 px-8 py-3 text-sm font-semibold text-white shadow-lg"
      >
        {t("cta")}
      </Link>
    </div>
  );
}
