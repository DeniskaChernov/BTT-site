"use client";

import { usePathname } from "@/i18n/navigation";
import { useEffect } from "react";

const SCROLL_ANCHORS = new Set(["hits", "quiz"]);

/**
 * На главной: при заходе с `/#hits`, `/#quiz` или смене hash — плавный скролл к секции.
 */
export function ScrollToHash() {
  const pathname = usePathname();

  useEffect(() => {
    const scrollIfNeeded = () => {
      if (pathname !== "/") return;
      const frag = window.location.hash.replace(/^#/, "");
      if (!frag || !SCROLL_ANCHORS.has(frag)) return;
      requestAnimationFrame(() => {
        document.getElementById(frag)?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      });
    };

    scrollIfNeeded();
    window.addEventListener("hashchange", scrollIfNeeded);
    return () => window.removeEventListener("hashchange", scrollIfNeeded);
  }, [pathname]);

  return null;
}
