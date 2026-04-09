import { Providers } from "@/components/Providers";
import { Footer } from "@/components/layout/Footer";
import { GlowSiteNav } from "@/components/layout/GlowSiteNav";
import { ScrollToHash } from "@/components/layout/ScrollToHash";
import { routing } from "@/i18n/routing";
import type { Metadata } from "next";
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

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return {
    title: t("site"),
    description: t("home_desc"),
    keywords: [
      "ротанг",
      "искусственный ротанг",
      "rattan",
      "кашпо",
      "Узбекистан",
      "Bententrade",
      "UV",
      "улица",
    ],
    openGraph: {
      title: t("site"),
      description: t("home_desc"),
      locale,
      type: "website",
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

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={`${montserrat.variable} min-h-screen font-sans`}>
        <NextIntlClientProvider messages={messages}>
          <Providers>
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:border focus:border-amber-500/40 focus:bg-stone-950 focus:px-4 focus:py-2 focus:text-sm focus:text-stone-100"
            >
              {tCommon("skip_main")}
            </a>
            <ScrollToHash />
            <GlowSiteNav />
            <main id="main-content" className="min-h-[75vh]">
              {children}
            </main>
            <Footer />
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
