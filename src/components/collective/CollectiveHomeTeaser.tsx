import { Link } from "@/i18n/navigation";
import { telegramBotStartUrl, telegramChannelUrl } from "@/lib/telegram";
import { getTranslations } from "next-intl/server";
import { Send, Users } from "lucide-react";

export async function CollectiveHomeTeaser() {
  const t = await getTranslations("collective");
  const botUrl = telegramBotStartUrl("site_home");
  const channelUrl = telegramChannelUrl();

  return (
    <section className="relative py-10 md:py-14" aria-labelledby="collective-home-heading">
      <div className="btt-container">
        <div className="relative overflow-hidden rounded-[1.75rem] border border-amber-500/25 bg-gradient-to-br from-amber-950/50 via-stone-950/90 to-orange-950/40 p-6 shadow-[0_20px_60px_-24px_rgba(245,158,11,0.35)] md:p-8">
          <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-amber-500/15 blur-3xl" aria-hidden />
          <div className="relative flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between md:gap-10">
          <div className="flex max-w-2xl gap-4">
            <span className="mt-1 flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-amber-500/35 bg-amber-500/10 text-amber-300 shadow-lg shadow-amber-900/20">
              <Users className="h-6 w-6" aria-hidden />
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amber-400/90">
                {t("home_kicker")}
              </p>
              <h2
                id="collective-home-heading"
                className="mt-2 text-2xl font-bold tracking-tight text-stone-50 md:text-3xl"
              >
                {t("home_title")}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-stone-400 md:text-base">
                {t("home_lead")}
              </p>
            </div>
          </div>
          <div className="flex w-full flex-col gap-3 sm:flex-row sm:flex-wrap md:w-auto md:justify-end">
            {botUrl ? (
              <a
                href={botUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btt-focus inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-amber-500 to-orange-600 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-amber-900/35 transition hover:brightness-105 active:scale-[0.98]"
              >
                <Send className="h-4 w-4 shrink-0" aria-hidden />
                {t("cta_bot")}
              </a>
            ) : (
              <Link
                href="/contacts"
                className="btt-focus inline-flex items-center justify-center gap-2 rounded-full border border-amber-500/40 bg-white/[0.04] px-7 py-3.5 text-sm font-semibold text-amber-100 transition hover:border-amber-400/60 hover:bg-white/[0.07]"
              >
                {t("cta_bot_fallback")}
              </Link>
            )}
            {channelUrl ? (
              <a
                href={channelUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btt-focus inline-flex items-center justify-center rounded-full border border-white/15 bg-black/25 px-7 py-3.5 text-sm font-semibold text-stone-200 backdrop-blur-sm transition hover:border-white/25 hover:bg-black/40 active:scale-[0.98]"
              >
                {t("cta_channel")}
              </a>
            ) : null}
          </div>
          </div>
        </div>
      </div>
    </section>
  );
}
