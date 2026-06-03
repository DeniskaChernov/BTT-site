import { randomBytes } from "node:crypto";

import { prisma } from "@/lib/db";
import { isMeaningfulPhone, normalizePhone } from "@/lib/phone";
import type { NextResponse } from "next/server";

import type { User } from "@prisma/client";

export const SESSION_COOKIE_NAME = "btt_session";

/** 30 дней */
export const SESSION_MAX_AGE_SEC = 60 * 60 * 24 * 30;

function parseCookie(header: string | null, name: string): string | undefined {
  if (!header) return undefined;
  for (const part of header.split(";")) {
    const idx = part.indexOf("=");
    if (idx === -1) continue;
    const k = part.slice(0, idx).trim();
    if (k === name) {
      return decodeURIComponent(part.slice(idx + 1).trim());
    }
  }
  return undefined;
}

export function getSessionTokenFromRequest(request: Request): string | undefined {
  const v = parseCookie(request.headers.get("cookie"), SESSION_COOKIE_NAME);
  if (!v || v.length < 16) return undefined;
  return v;
}

export async function getSessionUser(request: Request): Promise<User | null> {
  const token = getSessionTokenFromRequest(request);
  if (!token) return null;
  if (!process.env.DATABASE_URL) return null;
  const row = await prisma.session.findFirst({
    where: {
      token,
      expiresAt: { gt: new Date() },
    },
    include: { user: true },
  });
  return row?.user ?? null;
}

export async function createSessionRecord(userId: string): Promise<{
  token: string;
  expiresAt: Date;
}> {
  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + SESSION_MAX_AGE_SEC * 1000);
  await prisma.session.create({
    data: { userId, token, expiresAt },
  });
  return { token, expiresAt };
}

export async function deleteSessionByToken(token: string): Promise<void> {
  await prisma.session.deleteMany({ where: { token } });
}

/** Переносит гостевые заказы с тем же телефоном на аккаунт после регистрации/входа. */
export async function linkGuestOrdersToUser(
  userId: string,
  phone: string | null | undefined,
): Promise<number> {
  const p = normalizePhone(phone ?? "");
  if (!isMeaningfulPhone(p)) return 0;
  const res = await prisma.order.updateMany({
    where: { phone: p, userId: null },
    data: { userId },
  });
  return res.count;
}

const sessionCookieBase = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
};

export function setSessionCookie(res: NextResponse, token: string): void {
  res.cookies.set(SESSION_COOKIE_NAME, token, {
    ...sessionCookieBase,
    maxAge: SESSION_MAX_AGE_SEC,
  });
}

export function clearSessionCookie(res: NextResponse): void {
  res.cookies.set(SESSION_COOKIE_NAME, "", {
    ...sessionCookieBase,
    maxAge: 0,
  });
}
