import { prisma } from "@/lib/db";
import { normalizePhone } from "@/lib/phone";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

type OrderLineInput = {
  sku: string;
  slug: string;
  name: string;
  qtyKg: number;
  lineTotalUz: number;
};

type CreateBody = {
  totalUz: number;
  lines: OrderLineInput[];
  pay: string;
  ship: string;
  customerName: string;
  phone: string;
  address?: string;
};

export async function POST(request: Request) {
  if (!process.env.DATABASE_URL) {
    return NextResponse.json(
      { error: "DATABASE_URL is not configured" },
      { status: 503 },
    );
  }

  let body: CreateBody;
  try {
    body = (await request.json()) as CreateBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const {
    totalUz,
    lines,
    pay,
    ship,
    customerName,
    phone,
    address = "",
  } = body;

  if (
    typeof totalUz !== "number" ||
    !Number.isFinite(totalUz) ||
    totalUz < 0 ||
    !Array.isArray(lines) ||
    lines.length === 0 ||
    typeof pay !== "string" ||
    typeof ship !== "string" ||
    typeof customerName !== "string" ||
    typeof phone !== "string" ||
    !phone.trim()
  ) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  for (const line of lines) {
    if (
      typeof line.sku !== "string" ||
      typeof line.slug !== "string" ||
      typeof line.name !== "string" ||
      typeof line.qtyKg !== "number" ||
      !Number.isFinite(line.qtyKg) ||
      typeof line.lineTotalUz !== "number" ||
      !Number.isFinite(line.lineTotalUz)
    ) {
      return NextResponse.json({ error: "Invalid line" }, { status: 400 });
    }
  }

  const phoneNorm = normalizePhone(phone);

  try {
    const order = await prisma.order.create({
      data: {
        totalUz: Math.round(totalUz),
        pay,
        ship,
        customerName: customerName.trim(),
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

  const { searchParams } = new URL(request.url);
  const phone = searchParams.get("phone");
  if (!phone?.trim()) {
    return NextResponse.json({ error: "phone is required" }, { status: 400 });
  }

  const phoneNorm = normalizePhone(phone);

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
    return NextResponse.json({ error: "Failed to load orders" }, { status: 500 });
  }
}
