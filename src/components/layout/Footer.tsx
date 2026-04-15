import { AnimatedReveal } from "@/components/ui/animated-reveal";
import { Link } from "@/i18n/navigation";
import { bttFooterLinkClass } from "@/lib/ui-classes";
import { telegramBotStartUrl, telegramChannelUrl } from "@/lib/telegram";
import { getTranslations } from "next-intl/server";

export async function Footer() {
  const t = await getTranslations("footer");
  const n = await getTranslations("nav");
  const cart = await getTranslations("cart");
  const col = await getTranslations("collective");
  const botUrl = telegramBotStartUrl("site_footer");
  const channelUrl = telegramChannelUrl();

  return (
    <footer className="relative mt-24 border-t border-white/[0.08] bg-gradient-to-b from-transparent to-black/40">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-500/25 to-transparent" />
      <div className="btt-container grid gap-12 pt-16 pb-[calc(4rem+env(safe-area-inset-bottom,0px))] md:grid-cols-2 lg:grid-cols-4">
        <AnimatedReveal className="min-w-0" delay={0}>
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
        </AnimatedReveal>

        <AnimatedReveal className="min-w-0" delay={0.07}>
        <div className="grid gap-3 text-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">
            {t("col_shop")}
          </p>
          <Link className={bttFooterLinkClass} href="/catalog">
            {n("catalog")}
          </Link>
          <Link
            className={bttFooterLinkClass}
            href="/catalog/brochure"
          >
            {t("pdf_catalog")}
          </Link>
          <Link
            className={bttFooterLinkClass}
            href="/cart"
          >
            {n("cart")}
          </Link>
          <Link
            className={bttFooterLinkClass}
            href="/checkout"
          >
            {cart("to_checkout")}
          </Link>
          <Link
            className={bttFooterLinkClass}
            href="/account"
          >
            {n("account")}
          </Link>
          <Link
            className={bttFooterLinkClass}
            href="/articles"
          >
            {n("articles")}
          </Link>
          <Link
            className={bttFooterLinkClass}
            href="/faq"
          >
            {n("faq")}
          </Link>
          {botUrl ? (
            <a
              className={bttFooterLinkClass}
              href={botUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              {col("footer_bot")}
            </a>
          ) : null}
          {channelUrl ? (
            <a
              className={bttFooterLinkClass}
              href={channelUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              {col("footer_channel")}
            </a>
          ) : null}
        </div>
        </AnimatedReveal>

        <AnimatedReveal className="min-w-0" delay={0.14}>
        <div className="grid gap-3 text-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">
            {t("col_company")}
          </p>
          <Link
            className={bttFooterLinkClass}
            href="/about"
          >
            {n("about")}
          </Link>
          <Link
            className={bttFooterLinkClass}
            href="/contacts"
          >
            {n("contacts")}
          </Link>
          <Link
            className={bttFooterLinkClass}
            href="/wholesale"
          >
            {n("wholesale")}
          </Link>
          <Link
            className={bttFooterLinkClass}
            href="/export"
          >
            {n("export")}
          </Link>
          <Link
            className={bttFooterLinkClass}
            href="/faq"
          >
            {n("faq")}
          </Link>
        </div>
        </AnimatedReveal>

        <AnimatedReveal className="min-w-0" delay={0.21}>
        <div className="grid gap-3 text-sm text-stone-500">
          <p>{t("privacy")}</p>
          <p>{t("offer")}</p>
        </div>
        </AnimatedReveal>
      </div>
    </footer>
  );
}
