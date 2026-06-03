import { ApiErrorCode } from "@/lib/api-response";
import {
  clearSessionCookie,
  deleteSessionByToken,
  getSessionTokenFromRequest,
} from "@/lib/auth-session";
import { isDbConnectionError } from "@/lib/prisma-errors";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const token = getSessionTokenFromRequest(request);

  if (token && process.env.DATABASE_URL) {
    try {
      await deleteSessionByToken(token);
    } catch (e) {
      if (isDbConnectionError(e)) {
        const res = NextResponse.json(
          {
            ok: false as const,
            error: "Database temporarily unavailable",
            code: ApiErrorCode.DATABASE_UNAVAILABLE,
          },
          { status: 503 },
        );
        clearSessionCookie(res);
        return res;
      }
      throw e;
    }
  }

  const res = NextResponse.json({ ok: true as const });
  clearSessionCookie(res);
  return res;
}
