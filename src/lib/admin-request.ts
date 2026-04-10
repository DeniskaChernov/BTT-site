import { ApiErrorCode, apiJsonError } from "@/lib/api-response";
import { verifyAdminBearer } from "@/lib/admin-token";
import { log } from "@/lib/logger";
import { requestIdFrom } from "@/lib/request-id";
import { allowAdminList, clientKeyFromRequest } from "@/lib/rate-limit";
import { NextResponse } from "next/server";

/** Секрет для CRM / админ API (тот же, что в Bearer). Минимум 24 символа. */
export function getAdminSecret(): string | null {
  const s = process.env.ADMIN_API_SECRET?.trim();
  if (!s || s.length < 24) return null;
  return s;
}

export type AdminGateOk = {
  ok: true;
  requestId: string | undefined;
};

export type AdminGateFail = { ok: false; response: NextResponse };

/**
 * Проверка БД, Bearer, rate limit для всех `/api/admin/*`.
 * CRM должна вызывать с сервера: `Authorization: Bearer <ADMIN_API_SECRET>`.
 */
export function gateAdminRequest(request: Request): AdminGateOk | AdminGateFail {
  const requestId = requestIdFrom(request);

  if (!process.env.DATABASE_URL) {
    return {
      ok: false,
      response: apiJsonError(
        503,
        ApiErrorCode.DATABASE_NOT_CONFIGURED,
        "DATABASE_URL is not configured",
      ),
    };
  }

  const secret = getAdminSecret();
  if (!secret) {
    return {
      ok: false,
      response: NextResponse.json(
        {
          ok: false as const,
          code: "ADMIN_DISABLED",
          error: "Admin API is not configured",
        },
        { status: 503 },
      ),
    };
  }

  if (!verifyAdminBearer(request, secret)) {
    log.warn("api/admin", "unauthorized", requestId ? { requestId } : undefined);
    return {
      ok: false,
      response: apiJsonError(401, ApiErrorCode.VALIDATION, "Unauthorized"),
    };
  }

  const key = `admin:${clientKeyFromRequest(request)}`;
  if (!allowAdminList(key)) {
    return {
      ok: false,
      response: apiJsonError(429, ApiErrorCode.RATE_LIMIT, "Too many requests", {
        "Retry-After": "60",
      }),
    };
  }

  return { ok: true, requestId };
}

export function withRequestId(res: NextResponse, requestId: string | undefined): NextResponse {
  if (requestId) res.headers.set("x-request-id", requestId);
  return res;
}
