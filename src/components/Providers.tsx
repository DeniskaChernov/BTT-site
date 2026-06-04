"use client";

import { AnalyticsInit } from "@/components/AnalyticsInit";
import { CartProvider } from "@/contexts/CartContext";
import { IntentCartSync } from "@/components/intent/IntentCartSync";
import { IntentProvider } from "@/contexts/IntentContext";
import { ThemeProvider } from "next-themes";
import { Suspense } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <CartProvider>
        <IntentProvider>
          <IntentCartSync />
          <Suspense fallback={null}>
            <AnalyticsInit />
          </Suspense>
          {children}
        </IntentProvider>
      </CartProvider>
    </ThemeProvider>
  );
}
