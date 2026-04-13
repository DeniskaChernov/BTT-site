import { createHmac } from "node:crypto";
import type { Order, OrderLine } from "@prisma/client";
import { orderToJson } from "@/lib/admin-order-json";
import { log } from "@/lib/logger";

export type CrmOrderCreatedPayload = {
  event: "order.created";
  site: string;
  createdAt: string;
  order: ReturnType<typeof orderToJson>;
};

export type CrmLeadSubmittedPayload = {
  event: "lead.submitted";
  site: string;
  submittedAt: string;
  kind: string;
  locale: string;
  fields: Record<string, string>;
  quiz?: Record<string, string>;
  /** id строки в PostgreSQL, если лид сохранён в БД */
  leadId?: string;
};

/** HMAC-SHA256 hex от тела JSON для проверки в CRM. */
export function signCrmWebhookBody(body: string, secret: string): string {
  return createHmac("sha256", secret).update(body, "utf8").digest("hex");
}

/**
 * Уведомление CRM о новом заказе (не блокирует ответ клиенту).
 * Нужны `CRM_WEBHOOK_URL` и `CRM_WEBHOOK_SECRET` (одинаковая длина с прод-секретом не требуется).
 */
export function notifyCrmOrderCreated(
  order: Order & { lines: OrderLine[] },
  requestId?: string,
): void {
  const url = process.env.CRM_WEBHOOK_URL?.trim();
  const secret = process.env.CRM_WEBHOOK_SECRET?.trim();
  if (!url || !secret || secret.length < 16) return;

  const site =
    process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "");

  const payload: CrmOrderCreatedPayload = {
    event: "order.created",
    site,
    createdAt: order.createdAt.toISOString(),
    order: orderToJson(order),
  };

  const body = JSON.stringify(payload);
  const signature = signCrmWebhookBody(body, secret);

  void fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "X-BTT-Signature": `sha256=${signature}`,
      "X-BTT-Event": "order.created",
      ...(requestId ? { "X-Request-Id": requestId } : {}),
    },
    body,
  })
    .then((res) => {
      if (!res.ok) {
        log.warn("crm/webhook", `CRM webhook HTTP ${res.status}`, {
          ...(requestId ? { requestId } : {}),
        });
      }
    })
    .catch((e) => {
      log.error("crm/webhook", e, { ...(requestId ? { requestId } : {}) });
    });
}

/**
 * Лид с сайта (контакты, опт, экспорт, квиз). Те же `CRM_WEBHOOK_URL` / `CRM_WEBHOOK_SECRET`, событие `lead.submitted`.
 */
export function notifyCrmLeadSubmitted(
  lead: {
    kind: string;
    locale: string;
    fields: Record<string, string>;
    quiz?: Record<string, string>;
    leadId?: string;
  },
  requestId?: string,
): void {
  const url = process.env.CRM_WEBHOOK_URL?.trim();
  const secret = process.env.CRM_WEBHOOK_SECRET?.trim();
  if (!url || !secret || secret.length < 16) return;

  const site =
    process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "");

  const payload: CrmLeadSubmittedPayload = {
    event: "lead.submitted",
    site,
    submittedAt: new Date().toISOString(),
    kind: lead.kind,
    locale: lead.locale,
    fields: lead.fields,
    ...(lead.leadId ? { leadId: lead.leadId } : {}),
    ...(lead.quiz && Object.keys(lead.quiz).length > 0
      ? { quiz: lead.quiz }
      : {}),
  };

  const body = JSON.stringify(payload);
  const signature = signCrmWebhookBody(body, secret);

  void fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "X-BTT-Signature": `sha256=${signature}`,
      "X-BTT-Event": "lead.submitted",
      ...(requestId ? { "X-Request-Id": requestId } : {}),
    },
    body,
  })
    .then((res) => {
      if (!res.ok) {
        log.warn("crm/webhook", `CRM lead webhook HTTP ${res.status}`, {
          ...(requestId ? { requestId } : {}),
        });
      }
    })
    .catch((e) => {
      log.error("crm/webhook", e, { ...(requestId ? { requestId } : {}) });
    });
}
