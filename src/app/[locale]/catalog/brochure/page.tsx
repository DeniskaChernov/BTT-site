import { Link } from "@/i18n/navigation";
import { bttPrimaryButtonClass } from "@/lib/ui-classes";
import { cn } from "@/lib/utils";
import { Download, ExternalLink, FileText } from "lucide-react";
import { getTranslations } from "next-intl/server";

const PDF_HREF = "/downloads/bententrade-catalog.pdf";
const DOWNLOAD_NAME = "Bententrade-catalog.pdf";

type MetadataProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: MetadataProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "catalogBrochure" });
  return {
    title: t("meta_title"),
    description: t("lead"),
  };
}

export default async function CatalogBrochurePage() {
  const t = await getTranslations("catalogBrochure");
  const tc = await getTranslations("catalog");

  return (
    <div className="btt-container py-10 md:py-16">
      <nav className="text-sm text-stone-500">
        <Link href="/catalog" className="transition hover:text-amber-400">
          {tc("title")}
        </Link>
        <span className="mx-2 text-stone-600">/</span>
        <span className="text-stone-400">{t("breadcrumb")}</span>
      </nav>

      <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amber-500/80">
            Bententrade
          </p>
          <h1 className="mt-2 flex items-center gap-3 text-3xl font-bold tracking-tight text-stone-50 md:text-4xl">
            <FileText className="h-9 w-9 shrink-0 text-amber-500/90" aria-hidden />
            {t("title")}
          </h1>
          <p className="mt-4 text-lg text-stone-400">{t("lead")}</p>
          <p className="mt-3 text-sm text-stone-500">{t("hint_inline")}</p>
        </div>

        <div className="flex flex-wrap gap-3">
          <a
            href={PDF_HREF}
            download={DOWNLOAD_NAME}
            className={cn(
              bttPrimaryButtonClass,
              "inline-flex items-center justify-center gap-2 px-6",
            )}
          >
            <Download className="h-4 w-4" aria-hidden />
            {t("download")}
          </a>
          <a
            href={PDF_HREF}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 px-6 py-3 text-sm font-semibold text-stone-200 transition hover:border-amber-500/40"
          >
            <ExternalLink className="h-4 w-4" aria-hidden />
            {t("open_tab")}
          </a>
        </div>
      </div>

      <div className="mt-10 overflow-hidden rounded-2xl border border-white/[0.1] bg-stone-950/80 shadow-2xl shadow-black/40">
        <iframe
          title={t("viewer_title")}
          src={`${PDF_HREF}#view=FitH`}
          className="h-[min(85vh,1200px)] w-full min-h-[480px] border-0 bg-stone-900"
        />
      </div>

      <p className="mt-4 text-center text-xs text-stone-500">{t("footer_note")}</p>
    </div>
  );
}
