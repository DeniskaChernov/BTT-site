import createIntlMiddleware from "next-intl/middleware";
import { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { routing } from "@/i18n/routing";

const handleI18n = createIntlMiddleware(routing);

const PRODUCT_SLUG_REDIRECTS: Record<string, string> = {
  "rattan-semi-tube-2708-2": "rattan-semi-tube-2708",
};

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

  const productRedirect = request.nextUrl.pathname.match(
    /^\/(ru|uz|en)\/product\/([^/]+)\/?$/,
  );
  if (productRedirect) {
    const [, locale, slug] = productRedirect;
    const target = PRODUCT_SLUG_REDIRECTS[slug];
    if (target) {
      const url = request.nextUrl.clone();
      url.pathname = `/${locale}/product/${target}`;
      const response = NextResponse.redirect(url, 308);
      response.headers.set("x-request-id", id);
      return response;
    }
  }

  const reqWithId = new NextRequest(request, { headers: requestHeaders });
  const response = handleI18n(reqWithId);
  response.headers.set("x-request-id", id);
  return response;
}

export const config = {
  matcher: ["/((?!_next|_vercel|.*\\..*).*)"],
};
