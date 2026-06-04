"use client";

import { ArticlesCardGrid } from "@/components/articles/ArticlesCardGrid";
import { ArticlesHubTabs, type ArticlesHubFilter } from "@/components/articles/ArticlesHubTabs";
import { useState } from "react";

export function ArticlesHub() {
  const [filter, setFilter] = useState<ArticlesHubFilter>("all");
  return (
    <>
      <ArticlesHubTabs value={filter} onChange={setFilter} />
      <ArticlesCardGrid filter={filter} />
    </>
  );
}
