import { ApiErrorCode, apiJsonError } from "@/lib/api-response";
import {
  getSessionUser,
  linkGuestOrdersToUser,
} from "@/lib/auth-session";
import { prisma } from "@/lib/db";
import { log } from "@/lib/logger";
import { isDbConnectionError } from "@/lib/prisma-errors";
import { requestIdFrom } from "@/lib/request-id";
import { isMeaningfulPhone, normalizePhone } from "@/lib/phone";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

function userPayload(u: {
  id: string;
  email: string;
  name: string | null;
  phone: string | null;
}) {
  return {
    id: u.id,
    email: u.email,
    name: u.name,
    phone: u.phone,
  };
}

export async function GET(request: Request) {
  const user = await getSessionUser(request);
  if (!user) {
    return NextResponse.json({ user: null });
  }
  return NextResponse.json({ user: userPayload(user) });
}

export async function PATCH(request: Request) {
  const requestId = requestIdFrom(request);

  if (!process.env.DATABASE_URL) {
    return apiJsonError(
      503,
      ApiErrorCode.DATABASE_NOT_CONFIGURED,
      "DATABASE_URL is not configured",
    );
  }

  const current = await getSessionUser(request);
  if (!current) {
    return apiJsonError(401, ApiErrorCode.UNAUTHORIZED, "Not signed in");
  }

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return apiJsonError(400, ApiErrorCode.INVALID_JSON, "Invalid JSON");
  }

  const b = raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {};

  const data: { name?: string | null; phone?: string | null } = {};

  if ("name" in b) {
    if (b.name === null) {
      data.name = null;
    } else if (typeof b.name === "string") {
      const t = b.name.trim();
      if (t.length > 200) {
        return apiJsonError(400, ApiErrorCode.VALIDATION, "Name too long");
      }
      data.name = t.length ? t : null;
    } else {
      return apiJsonError(400, ApiErrorCode.VALIDATION, "Invalid name");
    }
  }

  if ("phone" in b) {
    if (b.phone === null || b.phone === "") {
      data.phone = null;
    } else if (typeof b.phone === "string") {
      const p = normalizePhone(b.phone);
      if (!isMeaningfulPhone(p)) {
        return apiJsonError(400, ApiErrorCode.VALIDATION, "Invalid phone");
      }
      data.phone = p;
    } else {
      return apiJsonError(400, ApiErrorCode.VALIDATION, "Invalid phone");
    }
  }

  if (Object.keys(data).length === 0) {
    return apiJsonError(400, ApiErrorCode.VALIDATION, "No fields to update");
  }

  try {
    const updated = await prisma.user.update({
      where: { id: current.id },
      data,
    });

    await linkGuestOrdersToUser(updated.id, updated.phone);

    return NextResponse.json({ user: userPayload(updated) });
  } catch (e) {
    log.error("api/auth/me PATCH", e, requestId ? { requestId } : undefined);
    if (isDbConnectionError(e)) {
      return apiJsonError(
        503,
        ApiErrorCode.DATABASE_UNAVAILABLE,
        "Database temporarily unavailable",
      );
    }
    return apiJsonError(500, ApiErrorCode.INTERNAL, "Update failed");
  }
}
