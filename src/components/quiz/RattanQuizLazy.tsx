"use client";

import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";

const RattanQuiz = dynamic(
  () => import("./RattanQuiz").then((m) => m.RattanQuiz),
  {
    loading: () => <QuizSkeleton />,
    ssr: false,
  },
);

function QuizSkeleton() {
  const t = useTranslations("home");
  return (
    <div
      className="btt-glass-strong mx-auto min-h-[220px] w-full max-w-xl animate-pulse rounded-3xl border border-white/10 bg-gradient-to-br from-stone-900/80 to-stone-950/90 p-8 text-center shadow-inner shadow-black/30"
      role="status"
      aria-busy="true"
      aria-label={t("quiz_title")}
    >
      <div className="h-6 w-48 rounded-lg bg-white/10" />
      <div className="mt-4 h-4 max-w-md rounded bg-white/[0.06]" />
      <div className="mt-8 flex flex-wrap gap-3">
        <div className="h-11 w-28 rounded-full bg-white/[0.08]" />
        <div className="h-11 w-28 rounded-full bg-white/[0.06]" />
      </div>
    </div>
  );
}

export function RattanQuizLazy() {
  return <RattanQuiz />;
}
