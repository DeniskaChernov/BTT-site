import createMiddleware from "next-intl/middleware";
import { routing } from "./src/i18n/routing";

export default createMiddleware(routing);

// Все пути кроме api, _next, статики — как в доке next-intl
export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
