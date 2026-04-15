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
 * Сводка для CRM: счётчики заказов, выручка за сегодня (UTC), последний заказ.
 * GET /api/admin/summary — тот же Bearer, что и `/api/admin/orders`.
 */
export async function GET(request: Request) {
  const gate = gateAdminRequest(request);
  if (!gate.ok) return gate.response;
  const { requestId } = gate;

  const startUtc = new Date();
  startUtc.setUTCHours(0, 0, 0, 0);

  try {
    const [ordersTotal, todayAgg, lastRow, byStatusRows, byPaymentStatusRows] = await Promise.all([
      prisma.order.count(),
      prisma.order.aggregate({
        where: { createdAt: { gte: startUtc } },
        _count: { id: true },
        _sum: { totalUz: true },
      }),
      prisma.order.findFirst({
        orderBy: { createdAt: "desc" },
        include: { lines: true },
      }),
      prisma.order.groupBy({
        by: ["status"],
        _count: { status: true },
      }),
      prisma.order.groupBy({
        by: ["paymentStatus"],
        _count: { paymentStatus: true },
      }),
    ]);
    const byStatus = Object.fromEntries(
      byStatusRows.map((r) => [r.status, r._count.status]),
    );
    const byPaymentStatus = Object.fromEntries(
      byPaymentStatusRows.map((r) => [r.paymentStatus, r._count.paymentStatus]),
    );

    const res = NextResponse.json({
      ok: true as const,
      generatedAt: new Date().toISOString(),
      periodUtcDayStart: startUtc.toISOString(),
      ordersTotal,
      ordersToday: todayAgg._count.id,
      revenueUzToday: todayAgg._sum.totalUz ?? 0,
      byStatus,
      byPaymentStatus,
      lastOrder: lastRow ? orderToJson(lastRow) : null,
      webhookConfigured: Boolean(
        process.env.CRM_WEBHOOK_URL?.trim() &&
          process.env.CRM_WEBHOOK_SECRET &&
          process.env.CRM_WEBHOOK_SECRET.length >= 16,
      ),
      customerNotifyConfigured: Boolean(
        process.env.CUSTOMER_NOTIFY_WEBHOOK_URL?.trim() &&
          process.env.CUSTOMER_NOTIFY_WEBHOOK_SECRET &&
          process.env.CUSTOMER_NOTIFY_WEBHOOK_SECRET.length >= 16,
      ),
      paymentWebhookConfigured: Boolean(
        process.env.PAYMENT_WEBHOOK_SHARED_SECRET &&
          process.env.PAYMENT_WEBHOOK_SHARED_SECRET.trim().length >= 16,
      ),
    });
    return withRequestId(res, requestId);
  } catch (e) {
    log.error("api/admin/summary GET", e, requestId ? { requestId } : undefined);
    if (isDbConnectionError(e)) {
      return apiJsonError(
        503,
        ApiErrorCode.DATABASE_UNAVAILABLE,
        "Database temporarily unavailable",
      );
    }
    return apiJsonError(500, ApiErrorCode.QUERY_FAILED, "Failed to load summary");
  }
}
