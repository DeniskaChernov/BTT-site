import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 10;

/** Для Railway / балансировщиков: лёгкая проверка, что процесс жив */
export async function GET() {
  return NextResponse.json({ ok: true });
}
