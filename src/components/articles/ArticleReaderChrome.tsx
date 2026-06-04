"use client";

import { ArticleReadProgress } from "@/components/articles/ArticleReadProgress";
import type { ReactNode } from "react";

export function ArticleReaderChrome({ children }: { children: ReactNode }) {
  return (
    <>
      <ArticleReadProgress />
      {children}
    </>
  );
}
