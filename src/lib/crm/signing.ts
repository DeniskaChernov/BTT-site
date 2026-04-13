import { createHmac } from "node:crypto";

/** HMAC-SHA256 hex от тела JSON (UTF-8) — CRM сверяет с `X-BTT-Signature: sha256=<hex>`. */
export function signCrmWebhookBody(body: string, secret: string): string {
  return createHmac("sha256", secret).update(body, "utf8").digest("hex");
}
