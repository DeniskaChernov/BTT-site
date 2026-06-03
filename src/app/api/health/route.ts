import { NextResponse } from "next/server";

export const runtime = "nodejs";

/** Лёгкая проверка для балансировщика / мониторинга (без запроса к БД). */
export async function GET() {
  return NextResponse.json({
    ok: true as const,
    time: new Date().toISOString(),
    databaseConfigured: Boolean(process.env.DATABASE_URL?.trim()),
  });
}
