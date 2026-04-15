import { ApiErrorCode, apiJsonError } from "@/lib/api-response";
import { notifyCrmOrderUpdated } from "@/lib/crm-webhook";
import { notifyCustomerOrderEvent } from "@/lib/customer-notify";
import { prisma } from "@/lib/db";
import { log } from "@/lib/logger";
import {
  EXTERNAL_PAYMENT_STATUS,
  mapExternalToPaymentStatus,
  PAYMENT_PROVIDER,
  PAYMENT_WEBHOOK_HEADER,
  type ExternalPaymentStatus,
} from "@/lib/payments/contract";
import { requestIdFrom } from "@/lib/request-id";
import { PaymentStatus } from "@prisma/client";
import { createHmac, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 30;

type Props = { params: Promise<{ provider: string }> };

function webhookSecret(): string | null {
  const s = process.env.PAYMENT_WEBHOOK_SHARED_SECRET?.trim();
  if (!s || s.length < 16) return null;
  return s;
}

function isKnownProvider(v: string): boolean {
  return Object.values(PAYMENT_PROVIDER).includes(v as (typeof PAYMENT_PROVIDER)[keyof typeof PAYMENT_PROVIDER]);
}

function verifySignature(rawBody: string, incoming: string, secret: string): boolean {
  const expected = createHmac("sha256", secret).update(rawBody, "utf8").digest("hex");
  const a = Buffer.from(expected, "utf8");
  const b = Buffer.from(incoming, "utf8");
  return a.length === b.length && timingSafeEqual(a, b);
}

function parseExternalStatus(v: unknown): ExternalPaymentStatus | null {
  return typeof v === "string" &&
    Object.values(EXTERNAL_PAYMENT_STATUS).includes(v as ExternalPaymentStatus)
    ? (v as ExternalPaymentStatus)
    : null;
}

/**
 * Универсальный webhook endpoint для платёжных провайдеров.
 * Нормализует внешний статус и обновляет заказ в БД.
 */
export async function POST(request: Request, { params }: Props) {
  const requestId = requestIdFrom(request);
  const { provider } = await params;
  if (!isKnownProvider(provider)) {
    return apiJsonError(404, ApiErrorCode.NOT_FOUND, "Unknown payment provider");
  }
  const secret = webhookSecret();
  if (!secret) {
    return apiJsonError(503, ApiErrorCode.VALIDATION, "Payment webhook is not configured");
  }

  let rawBody = "";
  try {
    rawBody = await request.text();
  } catch {
    return apiJsonError(400, ApiErrorCode.INVALID_JSON, "Invalid payload");
  }
  const incomingSigRaw =
    request.headers.get(PAYMENT_WEBHOOK_HEADER.SIGNATURE) ?? "";
  const incomingSig = incomingSigRaw.replace(/^sha256=/, "").trim();
  if (!incomingSig || !verifySignature(rawBody, incomingSig, secret)) {
    return apiJsonError(401, ApiErrorCode.VALIDATION, "Invalid signature");
  }

  let body: Record<string, unknown>;
  try {
    const parsed = JSON.parse(rawBody) as unknown;
    if (typeof parsed !== "object" || parsed === null) {
      return apiJsonError(400, ApiErrorCode.VALIDATION, "Invalid payload");
    }
    body = parsed as Record<string, unknown>;
  } catch {
    return apiJsonError(400, ApiErrorCode.INVALID_JSON, "Invalid JSON");
  }

  const extStatus = parseExternalStatus(body.status);
  if (!extStatus) {
    return apiJsonError(400, ApiErrorCode.VALIDATION, "Invalid payment status");
  }
  const paymentStatus = mapExternalToPaymentStatus(extStatus);
  const orderId = typeof body.orderId === "string" ? body.orderId.trim() : "";
  const paymentReference =
    typeof body.paymentReference === "string" ? body.paymentReference.trim() : "";
  const paymentUrl = typeof body.paymentUrl === "string" ? body.paymentUrl.trim() : "";
  const paidAtRaw = typeof body.paidAt === "string" ? body.paidAt : "";
  const paidAt = paidAtRaw ? new Date(paidAtRaw) : null;

  if (!orderId && !paymentReference) {
    return apiJsonError(400, ApiErrorCode.VALIDATION, "orderId or paymentReference is required");
  }

  try {
    const target = orderId
      ? await prisma.order.findUnique({ where: { id: orderId }, include: { lines: true } })
      : await prisma.order.findFirst({
          where: { paymentReference, paymentProvider: provider },
          include: { lines: true },
          orderBy: { createdAt: "desc" },
        });
    if (!target) {
      return apiJsonError(404, ApiErrorCode.NOT_FOUND, "Order not found");
    }

    const updated = await prisma.order.update({
      where: { id: target.id },
      include: { lines: true },
      data: {
        paymentStatus,
        paymentStatusUpdatedAt: new Date(),
        paymentProvider: provider,
        paymentReference: paymentReference || target.paymentReference,
        paymentUrl: paymentUrl || target.paymentUrl,
        paidAt:
          paymentStatus === PaymentStatus.PAID
            ? paidAt && Number.isFinite(paidAt.getTime())
              ? paidAt
              : new Date()
            : null,
      },
    });

    notifyCrmOrderUpdated(updated, "payment_changed", requestId);
    notifyCustomerOrderEvent(
      {
        reason: "payment_changed",
        order: {
          id: updated.id,
          createdAt: updated.createdAt.toISOString(),
          updatedAt: updated.updatedAt.toISOString(),
          phone: updated.phone,
          customerName: updated.customerName,
          status: updated.status,
          paymentStatus: updated.paymentStatus,
          totalUz: updated.totalUz,
          paymentUrl: updated.paymentUrl ?? "",
          trackingProvider: updated.trackingProvider ?? "",
          trackingNumber: updated.trackingNumber ?? "",
          trackingUrl: updated.trackingUrl ?? "",
        },
      },
      requestId,
    );

    return NextResponse.json({ ok: true, orderId: updated.id, paymentStatus: updated.paymentStatus });
  } catch (e) {
    log.error("api/payments/webhook/[provider] POST", e, requestId ? { requestId, provider } : { provider });
    return apiJsonError(500, ApiErrorCode.QUERY_FAILED, "Failed to update payment status");
  }
}
