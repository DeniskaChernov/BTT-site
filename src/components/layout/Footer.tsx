import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";

export async function Footer() {
  const t = await getTranslations("footer");
  const n = await getTranslations("nav");
  const cart = await getTranslations("cart");

  return (
    <footer className="relative mt-24 border-t border-white/[0.08] bg-gradient-to-b from-transparent to-black/40">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-500/25 to-transparent" />
      <div className="btt-container grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-3 font-semibold text-stone-100">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-600 to-orange-700 text-sm font-bold text-white shadow-lg">
              BT
            </span>
            <span className="text-lg">Bententrade</span>
          </div>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-stone-500">
            {t("rights")}
          </p>
        </div>

        <div className="grid gap-3 text-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">
            {t("col_shop")}
          </p>
          <Link
            className="w-fit text-stone-400 transition hover:text-amber-400"
            href="/catalog"
          >
            {n("catalog")}
          </Link>
          <Link
            className="w-fit text-stone-400 transition hover:text-amber-400"
            href="/catalog/brochure"
          >
            {t("pdf_catalog")}
          </Link>
          <Link
            className="w-fit text-stone-400 transition hover:text-amber-400"
            href="/cart"
          >
            {n("cart")}
          </Link>
          <Link
            className="w-fit text-stone-400 transition hover:text-amber-400"
            href="/checkout"
          >
            {cart("to_checkout")}
          </Link>
          <Link
            className="w-fit text-stone-400 transition hover:text-amber-400"
            href="/account"
          >
            {n("account")}
          </Link>
          <Link
            className="w-fit text-stone-400 transition hover:text-amber-400"
            href="/articles"
          >
            {n("articles")}
          </Link>
          <Link
            className="w-fit text-stone-400 transition hover:text-amber-400"
            href="/faq"
          >
            {n("faq")}
          </Link>
        </div>

        <div className="grid gap-3 text-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">
            {t("col_company")}
          </p>
          <Link
            className="w-fit text-stone-400 transition hover:text-amber-400"
            href="/about"
          >
            {n("about")}
          </Link>
          <Link
            className="w-fit text-stone-400 transition hover:text-amber-400"
            href="/contacts"
          >
            {n("contacts")}
          </Link>
          <Link
            className="w-fit text-stone-400 transition hover:text-amber-400"
            href="/wholesale"
          >
            {n("wholesale")}
          </Link>
          <Link
            className="w-fit text-stone-400 transition hover:text-amber-400"
            href="/export"
          >
            {n("export")}
          </Link>
        </div>

        <div className="grid gap-3 text-sm text-stone-500">
          <p>{t("privacy")}</p>
          <p>{t("offer")}</p>
        </div>
      </div>
    </footer>
  );
}
