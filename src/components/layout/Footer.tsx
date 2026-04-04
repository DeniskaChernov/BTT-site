import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";

export async function Footer() {
  const t = await getTranslations("footer");
  const n = await getTranslations("nav");

  return (
    <footer className="mt-20 border-t border-btt-border bg-btt-surface">
      <div className="btt-container grid gap-10 py-14 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-2 font-semibold">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-btt bg-btt-primary text-sm text-white">
              BT
            </span>
            Bententrade
          </div>
          <p className="mt-3 max-w-sm text-sm text-btt-muted">{t("rights")}</p>
        </div>
        <div className="grid gap-2 text-sm">
          <Link className="hover:underline" href="/catalog">
            {n("catalog")}
          </Link>
          <Link className="hover:underline" href="/wholesale">
            {n("wholesale")}
          </Link>
          <Link className="hover:underline" href="/export">
            {n("export")}
          </Link>
          <Link className="hover:underline" href="/faq">
            {n("faq")}
          </Link>
        </div>
        <div className="grid gap-2 text-sm text-btt-muted">
          <span>{t("privacy")}</span>
          <span>{t("offer")}</span>
        </div>
      </div>
    </footer>
  );
}
