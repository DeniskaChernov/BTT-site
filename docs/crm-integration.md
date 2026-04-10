# Интеграция сайта Bententrade с CRM

Цель: из CRM видеть заказы и сводку по сайту, не открывая базу напрямую. Рекомендуется вызывать API **с сервера CRM** (backend), а не из браузера — так не светится секрет и проще контролировать доступ.

## Переменные окружения (сайт)

| Переменная | Назначение |
|------------|------------|
| `ADMIN_API_SECRET` | Общий секрет (≥24 символов). Передаётся как `Authorization: Bearer …` во все admin-запросы. Храните только на сервере CRM и в прод-окружении сайта. |
| `CRM_WEBHOOK_URL` | URL в CRM, куда сайт **POST**-ит событие при каждом новом заказе (опционально). |
| `CRM_WEBHOOK_SECRET` | Секрет для проверки подписи тела (≥16 символов). |
| `NEXT_PUBLIC_SITE_URL` | Полный URL сайта (например `https://bententrade.uz`) — попадает в webhook payload как `site`. |

## API для CRM (Bearer)

Заголовок для всех запросов:

```http
Authorization: Bearer <ADMIN_API_SECRET>
```

### Сводка дашборда

`GET /api/admin/summary`

Ответ (фрагмент): `ordersTotal`, `ordersToday`, `revenueUzToday` (с начала **текущих суток UTC**), `lastOrder`, `webhookConfigured`, `generatedAt`.

### Список заказов

`GET /api/admin/orders?take=50`

`take` — от 1 до 100.

### Один заказ

`GET /api/admin/orders/<id>`

404, если заказ не найден.

## Webhook «заказ создан»

При успешном сохранении заказа в БД сайт отправляет **асинхронно** (ошибка webhook не отменяет заказ):

- **URL:** `CRM_WEBHOOK_URL`
- **Method:** `POST`
- **Headers:**
  - `Content-Type: application/json; charset=utf-8`
  - `X-BTT-Event: order.created`
  - `X-BTT-Signature: sha256=<hex>` — HMAC-SHA256 от **сырого тела** строки UTF-8 с ключом `CRM_WEBHOOK_SECRET`
  - опционально `X-Request-Id` — корреляция с логами сайта

**Проверка в CRM:** пересчитать HMAC-SHA256(body, CRM_WEBHOOK_SECRET), сравнить с заголовком (после префикса `sha256=`).

**Тело:** JSON с полями `event`, `site`, `createdAt`, `order` (структура как в admin API).

## Рекомендуемая схема в CRM

1. Периодический опрос `GET /api/admin/summary` + `GET /api/admin/orders` для синхронизации или отображения.
2. Параллельно endpoint приёма webhook для мгновенного создания лида/заказа в CRM при оплате/оформлении на сайте.
3. Секреты только в env, ротация по процедуре компании.

Лимиты: с одного IP действует rate limit на admin API; при 429 смотреть заголовок `Retry-After`.
