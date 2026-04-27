import { createHmac, timingSafeEqual } from "node:crypto";

const TOKEN_TTL_SECONDS = 60 * 60 * 24 * 30;
let warnedMissingSecret = false;

type TokenPayload = {
  p: string;
  exp: number;
};

function toBase64Url(input: string | Buffer): string {
  return Buffer.from(input)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function fromBase64Url(input: string): string {
  const normalized = input.replace(/-/g, "+").replace(/_/g, "/");
  const padLen = (4 - (normalized.length % 4)) % 4;
  const padded = normalized + "=".repeat(padLen);
  return Buffer.from(padded, "base64").toString("utf8");
}

function secretKey(): string | null {
  const v = process.env.ORDER_HISTORY_TOKEN_SECRET?.trim();
  if (v && v.length >= 16) return v;
  const fallback = process.env.ADMIN_API_SECRET?.trim();
  if (fallback && fallback.length >= 16) return fallback;
  if (!warnedMissingSecret) {
    warnedMissingSecret = true;
    console.warn(
      "[order-access] Missing ORDER_HISTORY_TOKEN_SECRET (and ADMIN_API_SECRET fallback). Order history sync tokens are disabled.",
    );
  }
  return null;
}

function signPayload(payloadB64: string, secret: string): string {
  return toBase64Url(createHmac("sha256", secret).update(payloadB64).digest());
}

export function issueOrderHistoryToken(phoneNorm: string, nowMs = Date.now()): string | null {
  const secret = secretKey();
  if (!secret) return null;
  const payload: TokenPayload = {
    p: phoneNorm,
    exp: Math.floor(nowMs / 1000) + TOKEN_TTL_SECONDS,
  };
  const payloadB64 = toBase64Url(JSON.stringify(payload));
  const sig = signPayload(payloadB64, secret);
  return `${payloadB64}.${sig}`;
}

export function verifyOrderHistoryToken(token: string, phoneNorm: string, nowMs = Date.now()): boolean {
  const secret = secretKey();
  if (!secret) return false;
  const [payloadB64, sig] = token.split(".");
  if (!payloadB64 || !sig) return false;
  let payload: TokenPayload;
  try {
    payload = JSON.parse(fromBase64Url(payloadB64)) as TokenPayload;
  } catch {
    return false;
  }
  if (!payload || payload.p !== phoneNorm || typeof payload.exp !== "number") {
    return false;
  }
  if (payload.exp < Math.floor(nowMs / 1000)) return false;
  const expected = signPayload(payloadB64, secret);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}
