import { ApiErrorCode, apiJsonError } from "@/lib/api-response";
import { orderToJson } from "@/lib/admin-order-json";
import { gateAdminRequest, withRequestId } from "@/lib/admin-request";
import { notifyCrmOrderUpdated } from "@/lib/crm-webhook";
import { notifyCustomerOrderEvent } from "@/lib/customer-notify";
import { prisma } from "@/lib/db";
import { log } from "@/lib/logger";
import { OrderStatus, PaymentStatus, Prisma } from "@prisma/client";
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
const ORDER_STATUS_VALUES = new Set<string>(Object.values(OrderStatus));
const PAYMENT_STATUS_VALUES = new Set<string>(Object.values(PaymentStatus));

function toCleanString(v: unknown, max = 400): string {
  if (typeof v !== "string") return "";
  const s = v.trim();
  if (!s) return "";
  return s.slice(0, max);
}

function toHttpUrlOrEmpty(v: unknown): string {
  const s = toCleanString(v, 1000);
  if (!s) return "";
  try {
    const u = new URL(s);
    if (u.protocol !== "http:" && u.protocol !== "https:") return "";
    return u.toString();
  } catch {
    return "";
  }
}

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

/**
 * Обновление статуса заказа и трекинга для CRM/менеджера.
 * PATCH /api/admin/orders/:id
 */
export async function PATCH(request: Request, { params }: Props) {
  const gate = gateAdminRequest(request);
  if (!gate.ok) return gate.response;
  const { requestId } = gate;

  const { id } = await params;
  if (!id?.trim()) {
    return apiJsonError(400, ApiErrorCode.VALIDATION, "id is required");
  }

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return apiJsonError(400, ApiErrorCode.INVALID_JSON, "Invalid JSON");
  }
  if (typeof raw !== "object" || raw === null) {
    return apiJsonError(400, ApiErrorCode.VALIDATION, "Invalid payload");
  }
  const body = raw as Record<string, unknown>;
  const statusRaw = body.status;
  const paymentStatusRaw = body.paymentStatus;
  const status =
    typeof statusRaw === "string" && ORDER_STATUS_VALUES.has(statusRaw)
      ? (statusRaw as OrderStatus)
      : null;
  if (statusRaw != null && !status) {
    return apiJsonError(400, ApiErrorCode.VALIDATION, "Invalid status");
  }
  const paymentStatus =
    typeof paymentStatusRaw === "string" &&
    PAYMENT_STATUS_VALUES.has(paymentStatusRaw)
      ? (paymentStatusRaw as PaymentStatus)
      : null;
  if (paymentStatusRaw != null && !paymentStatus) {
    return apiJsonError(400, ApiErrorCode.VALIDATION, "Invalid payment status");
  }
  const statusNote = toCleanString(body.statusNote, 1200);
  const paymentProvider = toCleanString(body.paymentProvider, 120);
  const paymentReference = toCleanString(body.paymentReference, 240);
  const paymentUrl = toHttpUrlOrEmpty(body.paymentUrl);
  const trackingProvider = toCleanString(body.trackingProvider, 120);
  const trackingNumber = toCleanString(body.trackingNumber, 240);
  const trackingUrl = toHttpUrlOrEmpty(body.trackingUrl);
  const hasStatusMutation =
    status !== null || body.statusNote != null;
  const hasTrackingMutation =
    body.trackingProvider != null ||
    body.trackingNumber != null ||
    body.trackingUrl != null;
  const hasPaymentMutation =
    paymentStatus !== null ||
    body.paymentProvider != null ||
    body.paymentReference != null ||
    body.paymentUrl != null;
  if (!hasStatusMutation && !hasTrackingMutation && !hasPaymentMutation) {
    return apiJsonError(400, ApiErrorCode.VALIDATION, "No updatable fields provided");
  }

  try {
    const now = new Date();
    const row = await prisma.order.update({
      where: { id: id.trim() },
      data: {
        ...(status !== null ? { status } : {}),
        ...(hasStatusMutation || hasTrackingMutation ? { statusUpdatedAt: now } : {}),
        ...(body.statusNote != null ? { statusNote: statusNote || null } : {}),
        ...(paymentStatus !== null ? { paymentStatus } : {}),
        ...(hasPaymentMutation ? { paymentStatusUpdatedAt: now } : {}),
        ...(body.paymentProvider != null ? { paymentProvider: paymentProvider || null } : {}),
        ...(body.paymentReference != null ? { paymentReference: paymentReference || null } : {}),
        ...(body.paymentUrl != null ? { paymentUrl: paymentUrl || null } : {}),
        ...(paymentStatus !== null
          ? paymentStatus === PaymentStatus.PAID
            ? { paidAt: now }
            : { paidAt: null }
          : {}),
        ...(body.trackingProvider != null
          ? { trackingProvider: trackingProvider || null }
          : {}),
        ...(body.trackingNumber != null
          ? { trackingNumber: trackingNumber || null }
          : {}),
        ...(body.trackingUrl != null ? { trackingUrl: trackingUrl || null } : {}),
      },
      include: { lines: true },
    });
    if (hasStatusMutation || hasTrackingMutation || hasPaymentMutation) {
      const reason =
        hasPaymentMutation && (hasStatusMutation || hasTrackingMutation)
          ? "order_updated"
          : hasPaymentMutation
            ? "payment_changed"
            : hasTrackingMutation
              ? "tracking_changed"
              : "status_changed";
      notifyCrmOrderUpdated(
        row,
        reason,
        requestId,
      );
      const customerReason =
        hasPaymentMutation
          ? "payment_changed"
          : hasStatusMutation
            ? "status_changed"
            : hasTrackingMutation
              ? "tracking_changed"
              : "status_changed";
      notifyCustomerOrderEvent(
        {
          reason: customerReason,
          order: {
            id: row.id,
            createdAt: row.createdAt.toISOString(),
            updatedAt: row.updatedAt.toISOString(),
            phone: row.phone,
            customerName: row.customerName,
            status: row.status,
            paymentStatus: row.paymentStatus,
            totalUz: row.totalUz,
            trackingProvider: row.trackingProvider ?? "",
            trackingNumber: row.trackingNumber ?? "",
            trackingUrl: row.trackingUrl ?? "",
            paymentUrl: row.paymentUrl ?? "",
          },
        },
        requestId,
      );
    }
    const res = NextResponse.json({ ok: true as const, order: orderToJson(row) });
    return withRequestId(res, requestId);
  } catch (e) {
    log.error("api/admin/orders/[id] PATCH", e, requestId ? { requestId } : undefined);
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2025") {
      return apiJsonError(404, ApiErrorCode.NOT_FOUND, "Order not found");
    }
    if (isDbConnectionError(e)) {
      return apiJsonError(
        503,
        ApiErrorCode.DATABASE_UNAVAILABLE,
        "Database temporarily unavailable",
      );
    }
    return apiJsonError(500, ApiErrorCode.QUERY_FAILED, "Failed to update order");
  }
}
