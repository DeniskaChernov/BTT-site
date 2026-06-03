import { ApiErrorCode, apiJsonError } from "@/lib/api-response";
import { isValidEmail, normalizeEmail } from "@/lib/auth-email";
import { hashPassword } from "@/lib/auth-password";
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
import { isMeaningfulPhone, normalizePhone } from "@/lib/phone";
import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const MIN_PASSWORD = 8;
const MAX_PASSWORD = 72;

function trimOpt(s: unknown): string | undefined {
  if (typeof s !== "string") return undefined;
  const t = s.trim();
  return t.length ? t : undefined;
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
  const emailRaw = typeof b.email === "string" ? b.email : "";
  const password = typeof b.password === "string" ? b.password : "";
  const name = trimOpt(b.name);
  const phoneRaw = trimOpt(b.phone);

  const email = normalizeEmail(emailRaw);
  if (!isValidEmail(email)) {
    return apiJsonError(400, ApiErrorCode.VALIDATION, "Invalid email");
  }
  if (password.length < MIN_PASSWORD || password.length > MAX_PASSWORD) {
    return apiJsonError(400, ApiErrorCode.VALIDATION, "Invalid password");
  }

  let phoneNorm: string | null = null;
  if (phoneRaw) {
    const p = normalizePhone(phoneRaw);
    if (!isMeaningfulPhone(p)) {
      return apiJsonError(400, ApiErrorCode.VALIDATION, "Invalid phone");
    }
    phoneNorm = p;
  }

  const passwordHash = await hashPassword(password);

  try {
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        name: name ?? null,
        phone: phoneNorm,
      },
    });

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
    log.error("api/auth/register", e, requestId ? { requestId } : undefined);
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
      return apiJsonError(409, ApiErrorCode.VALIDATION, "Email already registered");
    }
    if (isDbConnectionError(e)) {
      return apiJsonError(
        503,
        ApiErrorCode.DATABASE_UNAVAILABLE,
        "Database temporarily unavailable",
      );
    }
    return apiJsonError(500, ApiErrorCode.INTERNAL, "Registration failed");
  }
}
