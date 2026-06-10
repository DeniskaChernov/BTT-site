# Analytics funnel

`BTT_EVENTS` + `trackBttEvent` в `src/lib/analytics.ts`.

Цепочка: `view_pdp` → `add_to_cart` → `start_checkout` → `purchase` → `lead_submit`

GTM: `NEXT_PUBLIC_GTM_ID`. Data Layer `event` = имя из `BTT_EVENTS`.

Мониторинг: `GET /api/health`, `GET /api/health?deep=1`

Менеджер: env `TELEGRAM_BOT_TOKEN` + `TELEGRAM_MANAGER_CHAT_ID` — заказы и заявки.
