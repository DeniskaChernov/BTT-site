import type { ReactNode } from "react";

/** Корневой layout: html/body в `[locale]/layout` (next-intl) */
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
