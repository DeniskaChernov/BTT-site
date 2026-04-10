import { MAX_ORDER_JSON_BYTES } from "@/lib/api-limits";
import { ApiErrorCode, apiJsonError } from "@/lib/api-response";
import { notifyCrmOrderCreated } from "@/lib/crm-webhook";
import { prisma } from "@/lib/db";
import { log } from "@/lib/logger";
import { requestIdFrom } from "@/lib/request-id";
import {
  validateCreateOrderBody,
  validateOrderAgainstCatalog,
} from "@/lib/orders-api";
import { isMeaningfulPhone, normalizePhone } from "@/lib/phone";
import {
  allowGetOrders,
  allowPostOrder,
  clientKeyFromRequest,
} from "@/lib/rate-limit";
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

export async function POST(request: Request) {
  const requestId = requestIdFrom(request);

  if (!process.env.DATABASE_URL) {
    return apiJsonError(
      503,
      ApiErrorCode.DATABASE_NOT_CONFIGURED,
      "DATABASE_URL is not configured",
    );
  }

  const contentLength = request.headers.get("content-length");
  if (contentLength !== null) {
    const n = Number(contentLength);
    if (Number.isFinite(n) && n > MAX_ORDER_JSON_BYTES) {
      return apiJsonError(
        413,
        ApiErrorCode.PAYLOAD_TOO_LARGE,
        "Payload too large",
      );
    }
  }

  const key = clientKeyFromRequest(request);
  if (!allowPostOrder(key)) {
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

  const validated = validateCreateOrderBody(raw);
  if (typeof validated === "string") {
    const is422 =
      validated === "Invalid pay method" || validated === "Invalid shipping";
    return apiJsonError(
      is422 ? 422 : 400,
      ApiErrorCode.VALIDATION,
      validated,
    );
  }

  const catalogOk = validateOrderAgainstCatalog(validated);
  if (catalogOk !== true) {
    return apiJsonError(400, ApiErrorCode.VALIDATION, catalogOk);
  }

  const {
    totalUz,
    lines,
    pay,
    ship,
    customerName,
    phone,
    address = "",
  } = validated;

  const phoneNorm = normalizePhone(phone);
  if (!isMeaningfulPhone(phoneNorm)) {
    return apiJsonError(400, ApiErrorCode.VALIDATION, "Invalid phone");
  }

  try {
    const order = await prisma.order.create({
      data: {
        totalUz: Math.round(totalUz),
        pay,
        ship,
        customerName,
        phone: phoneNorm,
        address: address || null,
        lines: {
          create: lines.map((l) => ({
            sku: l.sku,
            slug: l.slug,
            name: l.name,
            qtyKg: l.qtyKg,
            lineTotalUz: Math.round(l.lineTotalUz),
          })),
        },
      },
      include: { lines: true },
    });

    notifyCrmOrderCreated(order, requestId);

    return NextResponse.json({
      id: order.id,
      createdAt: order.createdAt.toISOString(),
    });
  } catch (e) {
    log.error("api/orders POST", e, requestId ? { requestId } : undefined);
    if (isDbConnectionError(e)) {
      return apiJsonError(
        503,
        ApiErrorCode.DATABASE_UNAVAILABLE,
        "Database temporarily unavailable",
      );
    }
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
      return apiJsonError(409, ApiErrorCode.VALIDATION, "Duplicate order reference");
    }
    return apiJsonError(
      500,
      ApiErrorCode.ORDER_SAVE_FAILED,
      "Failed to save order",
    );
  }
}

export async function GET(request: Request) {
  const requestId = requestIdFrom(request);

  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ orders: [] });
  }

  const { searchParams } = new URL(request.url);
  const phone = searchParams.get("phone");
  if (!phone?.trim()) {
    return apiJsonError(400, ApiErrorCode.VALIDATION, "phone is required");
  }

  const phoneNorm = normalizePhone(phone);
  if (!isMeaningfulPhone(phoneNorm)) {
    return apiJsonError(400, ApiErrorCode.VALIDATION, "Invalid phone");
  }

  const key = clientKeyFromRequest(request);
  if (!allowGetOrders(key)) {
    return NextResponse.json(
      { ok: false as const, error: "Too many requests", code: ApiErrorCode.RATE_LIMIT, orders: [] },
      { status: 429, headers: { "Retry-After": "60" } },
    );
  }

  try {
    const rows = await prisma.order.findMany({
      where: { phone: phoneNorm },
      include: { lines: true },
      orderBy: { createdAt: "desc" },
      take: 100,
    });

    const orders = rows.map((o) => ({
      id: o.id,
      createdAt: o.createdAt.toISOString(),
      totalUz: o.totalUz,
      pay: o.pay,
      ship: o.ship as "courier" | "pickup",
      customerName: o.customerName,
      phone: o.phone,
      address: o.address ?? "",
      lines: o.lines.map((l) => ({
        sku: l.sku,
        slug: l.slug,
        name: l.name,
        qtyKg: l.qtyKg,
        lineTotalUz: l.lineTotalUz,
      })),
    }));

    return NextResponse.json({ orders });
  } catch (e) {
    log.error("api/orders GET", e, {
      connection: isDbConnectionError(e),
      ...(requestId ? { requestId } : {}),
    });
    return NextResponse.json({ orders: [] });
  }
}
