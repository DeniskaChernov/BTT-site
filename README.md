# Bententrade (btt-site)

Сайт каталога и оформления заказов на искусственный ротанг и сопутствующие товары (Next.js 15, App Router, Prisma, PostgreSQL, next-intl).

## Локальный запуск

```bash
npm install
# При необходимости: скопируйте .env.example → .env.local и задайте DATABASE_URL
npm run dev
```

Откройте корень (`/` редиректит на локаль по умолчанию), например `http://localhost:3000/ru`.

## Скрипты

| Команда | Назначение |
|--------|------------|
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript |
| `npm run test` | Vitest (unit) |
| `npm run test:e2e` | Playwright |
| `npm run verify` | lint + typecheck + unit tests |
| `npm run validate` | verify + production build |
| `npm run media:optimize` | производные webp/avif для каталога |

## Чеклист перед продакшеном (staging → prod)

Проверьте переменные из [.env.example](.env.example):

1. **БД:** `DATABASE_URL`; после деплоя миграции выполняются при `npm start` (`prisma migrate deploy`).
2. **История заказов в профиле:** `ORDER_HISTORY_TOKEN_SECRET` (или `ADMIN_API_SECRET` ≥ 24 символов как fallback).
3. **Очередь запросов:** опционально Upstash (`UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`).
4. **CRM:** `CRM_WEBHOOK_URL`, `CRM_WEBHOOK_SECRET`.
5. **Уведомления клиентам:** `CUSTOMER_NOTIFY_WEBHOOK_URL`, `CUSTOMER_NOTIFY_WEBHOOK_SECRET`.
6. **Аналитика:** `NEXT_PUBLIC_GTM_ID` (валидный `GTM-XXXXXXX`).
7. **Telegram:** `NEXT_PUBLIC_TELEGRAM_BOT_USERNAME`, `NEXT_PUBLIC_TELEGRAM_CHANNEL_USERNAME`, при необходимости `NEXT_PUBLIC_TELEGRAM_PAYMENT_USERNAME`.
8. **Платёжный webhook** (когда подключите шлюз): `PAYMENT_WEBHOOK_SHARED_SECRET` и POST на `/api/payments/webhook/<provider>` — см. комментарии в `.env.example`.

Smoke после деплоя: главная → каталог → карточка → корзина → чекаут; форма контактов; при наличии БД — POST заказа и просмотр истории с тем же телефоном.

### E2E

```bash
npx playwright install chromium
npm run test:e2e
```

Тест `order-post.spec.ts` создаёт реальный заказ, если у **запущенного** сервера на `E2E_BASE_URL` база отвечает на `GET /api/health?db=1` с `db: "up"`. Без PostgreSQL сценарий пропускается.

## Прочее

- Исходящий контракт CRM: [docs/crm-integration.md](docs/crm-integration.md).
- Подробности по Docker и миграциям — комментарии в `.env.example`.
