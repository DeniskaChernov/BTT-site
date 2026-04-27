import createIntlMiddleware from "next-intl/middleware";
import { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { routing } from "@/i18n/routing";

const handleI18n = createIntlMiddleware(routing);

/**
 * Единая точка: next-intl (редиректы локали, префикс) + x-request-id для логов API.
 * Раньше `middleware.ts` в корне не подключался — Next берёт только `src/middleware.ts`.
 */
export default function middleware(request: NextRequest) {
  const existing = request.headers.get("x-request-id");
  const id = existing?.trim() || crypto.randomUUID();
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-request-id", id);

  if (request.nextUrl.pathname.startsWith("/api")) {
    const response = NextResponse.next({ request: { headers: requestHeaders } });
    response.headers.set("x-request-id", id);
    return response;
  }

  const reqWithId = new NextRequest(request, { headers: requestHeaders });
  const response = handleI18n(reqWithId);
  response.headers.set("x-request-id", id);
  return response;
}

export const config = {
  matcher: ["/((?!_next|_vercel|.*\\..*).*)"],
};
