import { MAX_LEAD_JSON_BYTES } from "@/lib/api-limits";
import { ApiErrorCode, apiJsonError } from "@/lib/api-response";
import { notifyCrmLeadSubmitted } from "@/lib/crm-webhook";
import { validateLeadBody } from "@/lib/leads-api";
import { requestIdFrom } from "@/lib/request-id";
import { allowPostLead, clientKeyFromRequest } from "@/lib/rate-limit";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 25;

export async function POST(request: Request) {
  const requestId = requestIdFrom(request);

  const contentLength = request.headers.get("content-length");
  if (contentLength !== null) {
    const n = Number(contentLength);
    if (Number.isFinite(n) && n > MAX_LEAD_JSON_BYTES) {
      return apiJsonError(
        413,
        ApiErrorCode.PAYLOAD_TOO_LARGE,
        "Payload too large",
      );
    }
  }

  const key = clientKeyFromRequest(request);
  if (!allowPostLead(key)) {
    return apiJsonError(429, ApiErrorCode.RATE_LIMIT, "Too many requests", {
      "Retry-After": "60",
    });
  }

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return apiJsonError(400, ApiErrorCode.INVALID_JSON, "Invalid JSON");
  }

  const validated = validateLeadBody(raw);
  if (typeof validated === "string") {
    const is422 =
      validated === "Invalid kind" ||
      validated === "Invalid locale" ||
      validated === "Invalid phone";
    return apiJsonError(
      is422 ? 422 : 400,
      ApiErrorCode.VALIDATION,
      validated,
    );
  }

  notifyCrmLeadSubmitted(
    {
      kind: validated.kind,
      locale: validated.locale,
      fields: validated.fields,
      quiz: validated.quiz,
    },
    requestId,
  );

  return NextResponse.json({ ok: true as const });
}
