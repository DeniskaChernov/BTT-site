# Analytics funnel

`BTT_EVENTS` + `trackBttEvent` в `src/lib/analytics.ts`.

## Цепочка

`view_pdp` → `add_to_cart` → `start_checkout` → `purchase` → `lead_submit`

## GTM

Data Layer Event = имя из `BTT_EVENTS`. Документация триггеров — в GTM-контейнере.

## Мониторинг

- `GET /api/health`
- `GET /api/health?deep=1`
