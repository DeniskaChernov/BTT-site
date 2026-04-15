/**
 * Совместимость: уведомления CRM для заказов и лидов.
 * Реализация контракта и транспорта — в `src/lib/crm/` (позже можно подменить webhook на очередь).
 */

import { randomUUID } from "node:crypto";
import type { Order, OrderLine } from "@prisma/client";
import { orderToJson } from "@/lib/admin-order-json";
import {
  CRM_EVENT,
  CRM_PAYLOAD_SCHEMA_VERSION,
  CRM_SOURCE_APP,
} from "@/lib/crm/contract";
import { crmSiteUrl, sendCrmOutboundPayload } from "@/lib/crm/outbound";
import type {
  CrmLeadSubmittedPayload,
  CrmOrderCreatedPayload,
  CrmOrderUpdatedPayload,
} from "@/lib/crm/payloads";

export type {
  CrmLeadSubmittedPayload,
  CrmOrderCreatedPayload,
  CrmOrderUpdatedPayload,
} from "@/lib/crm/payloads";
export { signCrmWebhookBody } from "@/lib/crm/signing";

/**
 * Уведомление CRM о новом заказе (не блокирует ответ клиенту).
 * Нужны `CRM_WEBHOOK_URL` и `CRM_WEBHOOK_SECRET` (минимум 16 символов).
 */
export function notifyCrmOrderCreated(
  order: Order & { lines: OrderLine[] },
  requestId?: string,
): void {
  const payloadId = randomUUID();
  const payload: CrmOrderCreatedPayload = {
    schemaVersion: CRM_PAYLOAD_SCHEMA_VERSION,
    payloadId,
    source: CRM_SOURCE_APP,
    site: crmSiteUrl(),
    event: CRM_EVENT.ORDER_CREATED,
    createdAt: order.createdAt.toISOString(),
    order: orderToJson(order),
  };
  sendCrmOutboundPayload(CRM_EVENT.ORDER_CREATED, { ...payload }, {
    requestId,
    idempotencyKey: `order-${order.id}`,
  });
}

/**
 * Обновление заказа: статус/оплата/трекинг. Событие `order.updated`.
 */
export function notifyCrmOrderUpdated(
  order: Order & { lines: OrderLine[] },
  reason: "status_changed" | "payment_changed" | "tracking_changed" | "order_updated",
  requestId?: string,
): void {
  const payloadId = randomUUID();
  const payload: CrmOrderUpdatedPayload = {
    schemaVersion: CRM_PAYLOAD_SCHEMA_VERSION,
    payloadId,
    source: CRM_SOURCE_APP,
    site: crmSiteUrl(),
    event: CRM_EVENT.ORDER_UPDATED,
    updatedAt: new Date().toISOString(),
    reason,
    order: orderToJson(order),
  };
  sendCrmOutboundPayload(CRM_EVENT.ORDER_UPDATED, { ...payload }, {
    requestId,
    idempotencyKey: `order-upd-${order.id}-${reason}-${order.updatedAt.toISOString()}`,
  });
}

/**
 * Лид с сайта (контакты, опт, экспорт, квиз). Событие `lead.submitted`.
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
  const payloadId = randomUUID();
  const payload: CrmLeadSubmittedPayload = {
    schemaVersion: CRM_PAYLOAD_SCHEMA_VERSION,
    payloadId,
    source: CRM_SOURCE_APP,
    site: crmSiteUrl(),
    event: CRM_EVENT.LEAD_SUBMITTED,
    submittedAt: new Date().toISOString(),
    kind: lead.kind,
    locale: lead.locale,
    fields: lead.fields,
    ...(lead.leadId ? { leadId: lead.leadId } : {}),
    ...(lead.quiz && Object.keys(lead.quiz).length > 0
      ? { quiz: lead.quiz }
      : {}),
  };
  sendCrmOutboundPayload(CRM_EVENT.LEAD_SUBMITTED, { ...payload }, {
    requestId,
    idempotencyKey: lead.leadId ? `lead-${lead.leadId}` : payloadId,
  });
}
