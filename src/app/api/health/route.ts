import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 10;

/**
 * Liveness: без БД — для балансировщика / Railway.
 * `?db=1` — проверка соединения с PostgreSQL (диагностика, не для частого polling).
 */
export async function GET(request: Request) {
  const wantDb = new URL(request.url).searchParams.get("db") === "1";
  if (!wantDb || !process.env.DATABASE_URL) {
    return NextResponse.json({ ok: true, service: "btt-site" });
  }
  try {
    const { prisma } = await import("@/lib/db");
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json({ ok: true, db: "up" as const });
  } catch {
    return NextResponse.json({ ok: false, db: "down" as const }, { status: 503 });
  }
}
