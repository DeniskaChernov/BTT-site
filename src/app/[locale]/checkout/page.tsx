import { CheckoutForm } from "@/components/checkout/CheckoutForm";
import { Suspense } from "react";

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="btt-container py-20 text-center text-btt-muted">
          …
        </div>
      }
    >
      <CheckoutForm />
    </Suspense>
  );
}
