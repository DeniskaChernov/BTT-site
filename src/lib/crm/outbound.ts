import { randomUUID } from "node:crypto";
import { log } from "@/lib/logger";
import {
  CRM_HTTP_HEADER,
  CRM_PAYLOAD_SCHEMA_VERSION,
  type CrmEventName,
} from "@/lib/crm/contract";
import { signCrmWebhookBody } from "@/lib/crm/signing";

export type SendCrmOutboundOptions = {
  requestId?: string;
  /**
   * Ключ идемпотентности для CRM (повторная доставка того же заказа/лида).
   * Если не задан — используется payloadId из тела.
   */
  idempotencyKey?: string;
};

function siteUrlFromEnv(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "")
  );
}

function webhookTimeoutMs(): number {
  const raw = process.env.CRM_WEBHOOK_TIMEOUT_MS?.trim();
  const n = raw ? Number(raw) : NaN;
  if (!Number.isFinite(n) || n < 3000) return 12_000;
  if (n > 60_000) return 60_000;
  return Math.floor(n);
}

function readWebhookConfig():
  | { url: string; secret: string; timeoutMs: number }
  | undefined {
  const url = process.env.CRM_WEBHOOK_URL?.trim();
  const secret = process.env.CRM_WEBHOOK_SECRET?.trim();
  if (!url || !secret || secret.length < 16) return undefined;
  return { url, secret, timeoutMs: webhookTimeoutMs() };
}

/**
 * Fire-and-forget: POST JSON на CRM_WEBHOOK_URL с подписью и служебными заголовками.
 * Без URL/секрета — no-op (CRM подключается позже).
 */
export function sendCrmOutboundPayload(
  event: CrmEventName,
  payload: Record<string, unknown>,
  options?: SendCrmOutboundOptions,
): void {
  const cfg = readWebhookConfig();
  if (!cfg) return;

  const body = JSON.stringify(payload);
  const signature = signCrmWebhookBody(body, cfg.secret);
  const schemaVersion = String(
    payload.schemaVersion ?? CRM_PAYLOAD_SCHEMA_VERSION,
  );
  const payloadId =
    typeof payload.payloadId === "string" ? payload.payloadId : randomUUID();
  const idempotencyKey = options?.idempotencyKey ?? payloadId;

  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), cfg.timeoutMs);

  void fetch(cfg.url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      [CRM_HTTP_HEADER.SIGNATURE]: `sha256=${signature}`,
      [CRM_HTTP_HEADER.EVENT]: event,
      [CRM_HTTP_HEADER.SCHEMA_VERSION]: schemaVersion,
      [CRM_HTTP_HEADER.IDEMPOTENCY]: idempotencyKey,
      "User-Agent": "BTT-Site-CRM-Outbound/1",
      ...(options?.requestId
        ? { [CRM_HTTP_HEADER.REQUEST_ID]: options.requestId }
        : {}),
    },
    body,
    signal: controller.signal,
  })
    .then((res) => {
      if (!res.ok) {
        log.warn("crm/outbound", `CRM webhook HTTP ${res.status}`, {
          event,
          ...(options?.requestId ? { requestId: options.requestId } : {}),
        });
      }
    })
    .catch((e) => {
      log.error("crm/outbound", e, {
        event,
        aborted: e instanceof Error && e.name === "AbortError",
        ...(options?.requestId ? { requestId: options.requestId } : {}),
      });
    })
    .finally(() => clearTimeout(t));
}

/** Публичный URL сайта для поля `site` в payload. */
export function crmSiteUrl(): string {
  return siteUrlFromEnv();
}
