"use client";

import { usePathname } from "@/i18n/navigation";
import { useEffect, useState } from "react";

/**
 * Hash из `window.location`, с синхронизацией при смене маршрута (Next.js)
 * и при hashchange / popstate.
 */
export function useSyncedHash() {
  const pathname = usePathname();
  const [hash, setHash] = useState("");

  useEffect(() => {
    const sync = () =>
      setHash(typeof window !== "undefined" ? window.location.hash : "");
    sync();
    window.addEventListener("hashchange", sync);
    window.addEventListener("popstate", sync);
    return () => {
      window.removeEventListener("hashchange", sync);
      window.removeEventListener("popstate", sync);
    };
  }, [pathname]);

  return hash;
}
