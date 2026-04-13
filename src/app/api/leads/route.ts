import { MAX_LEAD_JSON_BYTES } from "@/lib/api-limits";
import { ApiErrorCode, apiJsonError } from "@/lib/api-response";
import { notifyCrmLeadSubmitted } from "@/lib/crm-webhook";
import { prisma } from "@/lib/db";
import { validateLeadBody } from "@/lib/leads-api";
import { log } from "@/lib/logger";
import { isDbConnectionError } from "@/lib/prisma-errors";
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

  let leadId: string | undefined;
  if (process.env.DATABASE_URL) {
    try {
      const row = await prisma.lead.create({
        data: {
          kind: validated.kind,
          locale: validated.locale,
          fields: validated.fields,
          quiz: validated.quiz ?? undefined,
        },
      });
      leadId = row.id;
    } catch (e) {
      log.error("api/leads POST", e, requestId ? { requestId } : undefined);
      if (isDbConnectionError(e)) {
        return apiJsonError(
          503,
          ApiErrorCode.DATABASE_UNAVAILABLE,
          "Database temporarily unavailable",
        );
      }
      return apiJsonError(
        500,
        ApiErrorCode.LEAD_SAVE_FAILED,
        "Failed to save lead",
      );
    }
  }

  notifyCrmLeadSubmitted(
    {
      kind: validated.kind,
      locale: validated.locale,
      fields: validated.fields,
      quiz: validated.quiz,
      leadId,
    },
    requestId,
  );

  return NextResponse.json({
    ok: true as const,
    ...(leadId ? { id: leadId } : {}),
  });
}
