import { ApiErrorCode, apiJsonError } from "@/lib/api-response";
import { normalizeEmail, isValidEmail } from "@/lib/auth-email";
import { verifyPassword } from "@/lib/auth-password";
import {
  createSessionRecord,
  linkGuestOrdersToUser,
  setSessionCookie,
} from "@/lib/auth-session";
import { prisma } from "@/lib/db";
import { log } from "@/lib/logger";
import { isDbConnectionError } from "@/lib/prisma-errors";
import { requestIdFrom } from "@/lib/request-id";
import { allowPostAuth, clientKeyFromRequest } from "@/lib/rate-limit";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const requestId = requestIdFrom(request);

  if (!process.env.DATABASE_URL) {
    return apiJsonError(
      503,
      ApiErrorCode.DATABASE_NOT_CONFIGURED,
      "DATABASE_URL is not configured",
    );
  }

  const key = clientKeyFromRequest(request);
  if (!(await allowPostAuth(key))) {
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

  const b = raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {};
  const email = normalizeEmail(typeof b.email === "string" ? b.email : "");
  const password = typeof b.password === "string" ? b.password : "";

  if (!isValidEmail(email) || !password) {
    return apiJsonError(400, ApiErrorCode.VALIDATION, "Invalid credentials");
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await verifyPassword(password, user.passwordHash))) {
      return apiJsonError(
        401,
        ApiErrorCode.UNAUTHORIZED,
        "Invalid email or password",
      );
    }

    await linkGuestOrdersToUser(user.id, user.phone);

    const { token } = await createSessionRecord(user.id);
    const res = NextResponse.json({
      ok: true as const,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
      },
    });
    setSessionCookie(res, token);
    return res;
  } catch (e) {
    log.error("api/auth/login", e, requestId ? { requestId } : undefined);
    if (isDbConnectionError(e)) {
      return apiJsonError(
        503,
        ApiErrorCode.DATABASE_UNAVAILABLE,
        "Database temporarily unavailable",
      );
    }
    return apiJsonError(500, ApiErrorCode.INTERNAL, "Login failed");
  }
}
