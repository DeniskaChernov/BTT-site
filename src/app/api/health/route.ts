import { prisma } from "@/lib/db";
import { isDbConnectionError } from "@/lib/prisma-errors";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

type HealthBody = {
  ok: boolean;
  time: string;
  databaseConfigured: boolean;
  database?: "ok" | "unavailable" | "not_configured";
};

/** `?deep=1` — ping PostgreSQL для мониторинга. */
export async function GET(request: Request) {
  const deep = new URL(request.url).searchParams.get("deep") === "1";
  const databaseConfigured = Boolean(process.env.DATABASE_URL?.trim());

  const body: HealthBody = {
    ok: true,
    time: new Date().toISOString(),
    databaseConfigured,
  };

  if (!deep) {
    return NextResponse.json(body);
  }

  if (!databaseConfigured) {
    body.database = "not_configured";
    return NextResponse.json(body);
  }

  try {
    await prisma.$queryRaw`SELECT 1`;
    body.database = "ok";
  } catch (e) {
    body.ok = false;
    body.database = isDbConnectionError(e) ? "unavailable" : "unavailable";
    return NextResponse.json(body, { status: 503 });
  }

  return NextResponse.json(body);
}
