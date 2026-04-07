"use client";

import { AnalyticsInit } from "@/components/AnalyticsInit";
import { CartProvider } from "@/contexts/CartContext";
import { ThemeProvider } from "next-themes";
import { Suspense } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <CartProvider>
        <Suspense fallback={null}>
          <AnalyticsInit />
        </Suspense>
        {children}
      </CartProvider>
    </ThemeProvider>
  );
}
