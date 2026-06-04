"use client";

import { AnalyticsInit } from "@/components/AnalyticsInit";
import { CartProvider } from "@/contexts/CartContext";
import { IntentProvider } from "@/contexts/IntentContext";
import { ThemeProvider } from "next-themes";
import { Suspense } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <CartProvider>
        <IntentProvider>
          <Suspense fallback={null}>
            <AnalyticsInit />
          </Suspense>
          {children}
        </IntentProvider>
      </CartProvider>
    </ThemeProvider>
  );
}
