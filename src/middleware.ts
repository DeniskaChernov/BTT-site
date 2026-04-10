import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

/**
 * Корреляция запросов в логах (Railway / прокси могут пробрасывать свой id).
 */
export function middleware(request: NextRequest) {
  const existing = request.headers.get("x-request-id");
  const id = existing?.trim() || crypto.randomUUID();
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-request-id", id);
  const res = NextResponse.next({ request: { headers: requestHeaders } });
  res.headers.set("x-request-id", id);
  return res;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
