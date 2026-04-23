import { Link } from "@/i18n/navigation";
import { SectionReveal } from "@/components/ui/animated-reveal";
import { bttPrimaryButtonClass } from "@/lib/ui-classes";
import { cn } from "@/lib/utils";
import { getTranslations } from "next-intl/server";

export default async function NotFound() {
  const t = await getTranslations("notFound");

  return (
    <div className="btt-container flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
      <SectionReveal className="flex w-full max-w-lg flex-col items-center">
        <p className="text-8xl font-bold tabular-nums text-stone-800">404</p>
        <h1 className="mt-4 text-2xl font-semibold text-stone-200">
          {t("title")}
        </h1>
        <p className="mt-2 max-w-md text-stone-500">{t("body")}</p>
        <Link
          href="/"
          className={cn(
            bttPrimaryButtonClass,
            "btt-focus mt-10 inline-flex items-center justify-center px-8 py-3 shadow-lg motion-reduce:transition-none",
          )}
        >
          {t("cta")}
        </Link>
      </SectionReveal>
    </div>
  );
}
