"use client";

import { AnalyticsInit } from "@/components/AnalyticsInit";
import { CartProvider } from "@/contexts/CartContext";
import { CurrencyProvider } from "@/contexts/CurrencyContext";
import { Suspense } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CurrencyProvider>
      <CartProvider>
        <Suspense fallback={null}>
          <AnalyticsInit />
        </Suspense>
        {children}
      </CartProvider>
    </CurrencyProvider>
  );
}
