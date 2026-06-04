"use client";

import { useEffect, useState } from "react";

export function ArticleReadProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, window.scrollY / max) : 0;
      setProgress(p);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className="pointer-events-none fixed left-0 right-0 top-[calc(3.5rem+env(safe-area-inset-top,0px))] z-[60] h-0.5 bg-white/[0.06]"
      aria-hidden
    >
      <div
        className="h-full bg-gradient-to-r from-amber-500 to-orange-500 transition-[width] duration-150 ease-out motion-reduce:transition-none"
        style={{ width: `${Math.round(progress * 100)}%` }}
      />
    </div>
  );
}
