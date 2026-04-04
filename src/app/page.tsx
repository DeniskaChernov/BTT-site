import { routing } from "@/i18n/routing";
import { permanentRedirect } from "next/navigation";

/** Редирект / → /ru (и на проде без зависимости от edge middleware) */
export default function RootPage() {
  permanentRedirect(`/${routing.defaultLocale}`);
}
