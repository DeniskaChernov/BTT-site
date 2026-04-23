import { GtmScript } from "@/components/GtmScript";
import { Providers } from "@/components/Providers";
import { FloatingHelpWidget } from "@/components/layout/FloatingHelpWidget";
import { Footer } from "@/components/layout/Footer";
import { GlowSiteNav } from "@/components/layout/GlowSiteNav";
import { ScrollToHash } from "@/components/layout/ScrollToHash";
import { routing } from "@/i18n/routing";
import type { Metadata, Viewport } from "next";
import { Montserrat } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import "../globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin", "cyrillic"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

/** Тёмная тема браузера (OLED / статус-бар). */
export const viewport: Viewport = {
  themeColor: "#0c0a09",
  colorScheme: "dark",
};

const META_KEYWORDS: Record<string, string[]> = {
  ru: [
    "ротанг",
    "искусственный ротанг",
    "кашпо",
    "Узбекистан",
    "Bententrade",
    "UV",
    "улица",
  ],
  en: [
    "artificial rattan",
    "planters",
    "synthetic wicker",
    "Uzbekistan",
    "Bententrade",
    "outdoor",
    "UV-resistant",
  ],
  uz: [
    "sun'iy rattan",
    "kashpo",
    "O'zbekiston",
    "Bententrade",
    "tashqi",
    "UV",
  ],
};

const SITE_ORIGIN =
  (process.env.NEXT_PUBLIC_SITE_URL || "https://bententrade.uz").replace(
    /\/$/,
    "",
  );

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  const keywords =
    META_KEYWORDS[locale] ?? META_KEYWORDS.ru;
  return {
    metadataBase: new URL(SITE_ORIGIN),
    title: {
      default: t("site"),
      template: "%s | Bententrade",
    },
    description: t("home_desc"),
    keywords,
    openGraph: {
      title: t("site"),
      description: t("home_desc"),
      locale,
      type: "website",
      siteName: "Bententrade",
      url: SITE_ORIGIN,
    },
    twitter: {
      card: "summary_large_image",
      title: t("site"),
      description: t("home_desc"),
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as "ru" | "uz" | "en")) {
    notFound();
  }
  setRequestLocale(locale);
  const messages = await getMessages();
  const tCommon = await getTranslations({ locale, namespace: "common" });
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID?.trim() ?? "";

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={`${montserrat.variable} min-h-screen font-sans`}>
        {gtmId ? <GtmScript gtmId={gtmId} /> : null}
        <NextIntlClientProvider messages={messages}>
          <Providers>
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-[max(1rem,env(safe-area-inset-top,0px))] focus:z-[100] focus:rounded-lg focus:border focus:border-amber-500/40 focus:bg-stone-950 focus:px-4 focus:py-2 focus:text-sm focus:text-stone-100"
            >
              {tCommon("skip_main")}
            </a>
            <ScrollToHash />
            <GlowSiteNav />
            <main id="main-content" className="min-h-[75vh]">
              {children}
            </main>
            <FloatingHelpWidget />
            <Footer />
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
