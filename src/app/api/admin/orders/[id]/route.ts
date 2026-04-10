import { ApiErrorCode, apiJsonError } from "@/lib/api-response";
import { orderToJson } from "@/lib/admin-order-json";
import { gateAdminRequest, withRequestId } from "@/lib/admin-request";
import { prisma } from "@/lib/db";
import { log } from "@/lib/logger";
import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 30;

function isDbConnectionError(e: unknown): boolean {
  if (e instanceof Prisma.PrismaClientInitializationError) return true;
  if (e instanceof Prisma.PrismaClientKnownRequestError) {
    return ["P1001", "P1002", "P1008", "P1010", "P1011", "P1017"].includes(e.code);
  }
  return false;
}

type Props = { params: Promise<{ id: string }> };

/** Один заказ по id (для карточки в CRM). */
export async function GET(request: Request, { params }: Props) {
  const gate = gateAdminRequest(request);
  if (!gate.ok) return gate.response;
  const { requestId } = gate;

  const { id } = await params;
  if (!id?.trim()) {
    return apiJsonError(400, ApiErrorCode.VALIDATION, "id is required");
  }

  try {
    const row = await prisma.order.findUnique({
      where: { id: id.trim() },
      include: { lines: true },
    });
    if (!row) {
      return apiJsonError(404, ApiErrorCode.NOT_FOUND, "Order not found");
    }
    const res = NextResponse.json({ ok: true as const, order: orderToJson(row) });
    return withRequestId(res, requestId);
  } catch (e) {
    log.error("api/admin/orders/[id] GET", e, requestId ? { requestId } : undefined);
    if (isDbConnectionError(e)) {
      return apiJsonError(
        503,
        ApiErrorCode.DATABASE_UNAVAILABLE,
        "Database temporarily unavailable",
      );
    }
    return apiJsonError(500, ApiErrorCode.QUERY_FAILED, "Failed to load order");
  }
}
