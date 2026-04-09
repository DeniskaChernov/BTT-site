import { prisma } from "@/lib/db";
import { MAX_PHONE_CHARS, validateCreateOrderBody } from "@/lib/orders-api";
import { normalizePhone } from "@/lib/phone";
import {
  allowGetOrders,
  allowPostOrder,
  clientKeyFromRequest,
} from "@/lib/rate-limit";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 30;

export async function POST(request: Request) {
  if (!process.env.DATABASE_URL) {
    return NextResponse.json(
      { error: "DATABASE_URL is not configured" },
      { status: 503 },
    );
  }

  const key = clientKeyFromRequest(request);
  if (!allowPostOrder(key)) {
    return NextResponse.json(
      { error: "Too many requests" },
      { status: 429, headers: { "Retry-After": "60" } },
    );
  }

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const validated = validateCreateOrderBody(raw);
  if (typeof validated === "string") {
    const is422 =
      validated === "Invalid pay method" || validated === "Invalid shipping";
    return NextResponse.json(
      { error: validated },
      { status: is422 ? 422 : 400 },
    );
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
  if (!phoneNorm || phoneNorm.length > MAX_PHONE_CHARS) {
    return NextResponse.json({ error: "Invalid phone" }, { status: 400 });
  }

  try {
    const order = await prisma.order.create({
      data: {
        totalUz: Math.round(totalUz),
        pay,
        ship,
        customerName,
        phone: phoneNorm,
        address: address.trim() || null,
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

    return NextResponse.json({
      id: order.id,
      createdAt: order.createdAt.toISOString(),
    });
  } catch (e) {
    console.error("[api/orders POST]", e);
    return NextResponse.json({ error: "Failed to save order" }, { status: 500 });
  }
}

export async function GET(request: Request) {
  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ orders: [] });
  }

  const key = clientKeyFromRequest(request);
  if (!allowGetOrders(key)) {
    return NextResponse.json(
      { error: "Too many requests", orders: [] },
      { status: 429, headers: { "Retry-After": "60" } },
    );
  }

  const { searchParams } = new URL(request.url);
  const phone = searchParams.get("phone");
  if (!phone?.trim()) {
    return NextResponse.json({ error: "phone is required" }, { status: 400 });
  }

  const phoneNorm = normalizePhone(phone);
  if (!phoneNorm || phoneNorm.length > MAX_PHONE_CHARS) {
    return NextResponse.json({ error: "Invalid phone" }, { status: 400 });
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
    console.error("[api/orders GET]", e);
    return NextResponse.json({ orders: [] });
  }
}
