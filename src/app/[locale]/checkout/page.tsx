import { CheckoutForm } from "@/components/checkout/CheckoutForm";
import { buildAlternates } from "@/lib/seo";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "checkout" });
  return {
    title: t("title"),
    description: t("delivery_note"),
    alternates: buildAlternates(locale, "/checkout"),
    robots: { index: false, follow: false },
  };
}

export default async function CheckoutPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "common" });

  return (
    <Suspense
      fallback={
        <div className="btt-container flex min-h-[50vh] items-center justify-center py-20">
          <div className="btt-glass-strong rounded-3xl px-10 py-8 text-center">
            <p className="text-sm text-stone-400">{t("loading")}</p>
          </div>
        </div>
      }
    >
      <CheckoutForm />
    </Suspense>
  );
}
