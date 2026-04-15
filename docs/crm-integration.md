# Интеграция сайта Bententrade с CRM

Цель: из CRM видеть заказы и сводку по сайту, не открывая базу напрямую. Рекомендуется вызывать API **с сервера CRM** (backend), а не из браузера — так не светится секрет и проще контролировать доступ.

## Переменные окружения (сайт)

| Переменная | Назначение |
|------------|------------|
| `ADMIN_API_SECRET` | Общий секрет (≥24 символов). Передаётся как `Authorization: Bearer …` во все admin-запросы. Храните только на сервере CRM и в прод-окружении сайта. |
| `CRM_WEBHOOK_URL` | URL в CRM, куда сайт **POST**-ит событие при каждом новом заказе (опционально). |
| `CRM_WEBHOOK_SECRET` | Секрет для проверки подписи тела (≥16 символов). |
| `NEXT_PUBLIC_SITE_URL` | Полный URL сайта (например `https://bententrade.uz`) — попадает в webhook payload как `site`. |
| `CUSTOMER_NOTIFY_WEBHOOK_URL` | URL вашего сервиса уведомлений клиентам (опционально). |
| `CUSTOMER_NOTIFY_WEBHOOK_SECRET` | Секрет HMAC для `CUSTOMER_NOTIFY_*` (≥16 символов). |
| `PAYMENT_WEBHOOK_SHARED_SECRET` | Общий секрет проверки входящего webhook от платёжного шлюза (≥16 символов). См. раздел ниже. |

## API для CRM (Bearer)

Заголовок для всех запросов:

```http
Authorization: Bearer <ADMIN_API_SECRET>
```

### Сводка дашборда

`GET /api/admin/summary`

Ответ (фрагмент): `ordersTotal`, `ordersToday`, `revenueUzToday` (с начала **текущих суток UTC**), `byStatus`, `byPaymentStatus`, `lastOrder`, `webhookConfigured` (исходящий CRM), `customerNotifyConfigured`, `paymentWebhookConfigured`, `generatedAt`.

### Список заказов

`GET /api/admin/orders?take=50`

`take` — от 1 до 100.

### Один заказ

`GET /api/admin/orders/<id>`

404, если заказ не найден.

### Обновление статуса и трекинга заказа

`PATCH /api/admin/orders/<id>`

Тело запроса (JSON):

```json
{
  "status": "PACKING",
  "statusNote": "Готовим к передаче в Яндекс Доставку",
  "trackingProvider": "Yandex Delivery",
  "trackingNumber": "YD-123456",
  "trackingUrl": "https://tracking.example/..."
}
```

Доступные поля:

- `status`: `NEW`, `CONFIRMED`, `PACKING`, `SHIPPED`, `DELIVERED`, `CANCELLED`
- `paymentStatus`: `PENDING`, `REQUIRES_ACTION`, `PAID`, `FAILED`, `REFUNDED`, `PARTIALLY_REFUNDED`
- `statusNote`, `trackingProvider`, `trackingNumber`, `trackingUrl`
- `paymentProvider`, `paymentReference`, `paymentUrl`

Можно отправить любое подмножество полей (минимум одно).

После успешного обновления сайт **асинхронно** шлёт в CRM событие `order.updated` (см. ниже) и опционально — клиентский notify-webhook (если настроены `CUSTOMER_NOTIFY_*`).

## Webhook «заказ создан» и «заказ обновлён» (исходящие в CRM)

Оба события идут на **`CRM_WEBHOOK_URL`**, метод **POST**, подпись тела тем же **`CRM_WEBHOOK_SECRET`** (заголовок `X-BTT-Signature: sha256=<hex>`). Ошибка webhook не отменяет операцию на сайте.

**`order.created`** — при сохранении нового заказа.

- **Headers:** `Content-Type: application/json; charset=utf-8`, `X-BTT-Event: order.created`, `X-BTT-Signature`, опционально `X-Request-Id`.
- **Тело:** JSON с полями `event`, `site`, `createdAt`, `order` (структура как в admin API).

**`order.updated`** — при `PATCH /api/admin/orders/<id>` или при нормализации оплаты через [входящий webhook платежей](#входящий-webhook-платежей-нормализация-статуса).

- **Headers:** те же, но `X-BTT-Event: order.updated`.
- **Тело:** JSON с полями `event`, `site`, `updatedAt`, `reason` (`status_changed` \| `payment_changed` \| `tracking_changed` \| `order_updated`), `order` (тот же формат, что в admin API).

**Проверка в CRM:** пересчитать HMAC-SHA256(body, `CRM_WEBHOOK_SECRET`), сравнить с заголовком (после префикса `sha256=`).

## Уведомления клиентам (опционально)

Если заданы `CUSTOMER_NOTIFY_WEBHOOK_URL` и `CUSTOMER_NOTIFY_WEBHOOK_SECRET`, сайт **POST**-ит JSON на этот URL при создании заказа и при обновлениях из admin API / платёжного webhook. Подпись: `X-BTT-Notify-Signature: sha256=<hex>` (HMAC-SHA256 тела UTF-8), причина: `X-BTT-Notify-Reason` (`order_created`, `status_changed`, `payment_changed`, `tracking_changed`).

## Входящий webhook платежей (нормализация статуса)

`POST /api/payments/webhook/<provider>`, где `<provider>` — один из идентификаторов в коде (`payme`, `click`, `telegram_manual`, … — см. `PAYMENT_PROVIDER` в `src/lib/payments/contract.ts`).

- **Подпись:** заголовок `X-BTT-Pay-Signature: sha256=<hex>` — HMAC-SHA256 от **сырого тела** с ключом `PAYMENT_WEBHOOK_SHARED_SECRET` (≥16 символов). Без корректного секрера в env endpoint отвечает 503.
- **Тело (JSON):** обязательно поле `status` — одно из: `pending`, `requires_action`, `succeeded`, `failed`, `refunded`, `partially_refunded`. Идентификация заказа: **`orderId`** (id в БД) **или** пара **`paymentReference`** + совпадение `provider` в пути.
- Опционально: `paymentUrl`, `paidAt` (ISO-8601; при `succeeded` используется как время оплаты).
- Успех: `200` и `{ ok: true, orderId, paymentStatus }`. После обновления БД отправляются `order.updated` в CRM и клиентский notify (если настроен).

## Рекомендуемая схема в CRM

1. Периодический опрос `GET /api/admin/summary` + `GET /api/admin/orders` для синхронизации или отображения.
2. Параллельно endpoint приёма webhook для мгновенного создания лида/заказа в CRM при оплате/оформлении на сайте.
3. Секреты только в env, ротация по процедуре компании.

Лимиты: с одного IP действует rate limit на admin API; при 429 смотреть заголовок `Retry-After`.
