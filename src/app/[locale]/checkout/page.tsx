import { CheckoutForm } from "@/components/checkout/CheckoutForm";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";

export default async function CheckoutPage() {
  const t = await getTranslations("common");

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
