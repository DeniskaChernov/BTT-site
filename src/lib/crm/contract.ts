/**
 * Контракт исходящих событий в CRM (webhook сейчас; позже — очередь, gRPC и т.д.).
 * Отдельная CRM-система подключается к этому контракту; меняйте schemaVersion при ломающих изменениях.
 */

/** Увеличивайте при несовместимых изменениях полей тел событий. */
export const CRM_PAYLOAD_SCHEMA_VERSION = 1 as const;

/** Идентификатор приложения-источника в payload (для мульти-сайта в одной CRM). */
export const CRM_SOURCE_APP = "btt-site" as const;

export const CRM_EVENT = {
  ORDER_CREATED: "order.created",
  LEAD_SUBMITTED: "lead.submitted",
} as const;

export type CrmEventName = (typeof CRM_EVENT)[keyof typeof CRM_EVENT];

/** HTTP-заголовки к приёмнику; CRM может опираться на них до парса тела. */
export const CRM_HTTP_HEADER = {
  SIGNATURE: "X-BTT-Signature",
  EVENT: "X-BTT-Event",
  SCHEMA_VERSION: "X-BTT-Schema-Version",
  IDEMPOTENCY: "X-BTT-Idempotency-Key",
  REQUEST_ID: "X-Request-Id",
} as const;
