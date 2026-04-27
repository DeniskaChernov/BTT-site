import { NextResponse } from "next/server";

/** Коды ошибок API для клиентов и мониторинга (строка стабильна) */
export const ApiErrorCode = {
  DATABASE_UNAVAILABLE: "DATABASE_UNAVAILABLE",
  DATABASE_NOT_CONFIGURED: "DATABASE_NOT_CONFIGURED",
  VALIDATION: "VALIDATION",
  RATE_LIMIT: "RATE_LIMIT",
  PAYLOAD_TOO_LARGE: "PAYLOAD_TOO_LARGE",
  INVALID_JSON: "INVALID_JSON",
  ORDER_SAVE_FAILED: "ORDER_SAVE_FAILED",
  LEAD_SAVE_FAILED: "LEAD_SAVE_FAILED",
  QUERY_FAILED: "QUERY_FAILED",
  NOT_FOUND: "NOT_FOUND",
  UNAUTHORIZED: "UNAUTHORIZED",
  INTERNAL: "INTERNAL",
} as const;

export type ApiErrorPayload = {
  ok: false;
  error: string;
  code: string;
};

export function apiJsonError(
  status: number,
  code: string,
  message: string,
  headers?: HeadersInit,
): NextResponse<ApiErrorPayload> {
  return NextResponse.json(
    { ok: false, error: message, code },
    { status, headers },
  );
}
