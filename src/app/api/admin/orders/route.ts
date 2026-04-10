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

/**
 * Список заказов для CRM. `Authorization: Bearer <ADMIN_API_SECRET>`
 * Query: `take` — 1…100 (по умолчанию 50).
 */
export async function GET(request: Request) {
  const gate = gateAdminRequest(request);
  if (!gate.ok) return gate.response;
  const { requestId } = gate;

  const { searchParams } = new URL(request.url);
  const rawTake = Number(searchParams.get("take"));
  const take = Number.isFinite(rawTake)
    ? Math.min(100, Math.max(1, Math.floor(rawTake)))
    : 50;

  try {
    const rows = await prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      take,
      include: { lines: true },
    });

    const orders = rows.map((o) => orderToJson(o));

    const res = NextResponse.json({
      ok: true as const,
      take: orders.length,
      orders,
    });
    return withRequestId(res, requestId);
  } catch (e) {
    log.error("api/admin/orders GET", e, requestId ? { requestId } : undefined);
    if (isDbConnectionError(e)) {
      return apiJsonError(
        503,
        ApiErrorCode.DATABASE_UNAVAILABLE,
        "Database temporarily unavailable",
      );
    }
    return apiJsonError(500, ApiErrorCode.QUERY_FAILED, "Failed to list orders");
  }
}
