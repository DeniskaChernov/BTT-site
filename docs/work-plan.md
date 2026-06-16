# BTT Site — план работ

## Фазы 0–4 ✅

## Фаза 5 🟡

| Задача | Статус |
|--------|--------|
| Аналитика, health deep, compare, SEO ItemList | ✅ |
| Telegram менеджеру (заказы + заявки) | ✅ |
| Чипы каталога, `?stock=`, лента заказа | ✅ |
| E2E viewports + compare, copy-audit | ✅ |
| Glass-effects (шапка, help, каталог, compare, trust) | ✅ |
| `npm run lighthouse:baseline` | ✅ скрипт |
| GTM на проде | 🔴 задать `NEXT_PUBLIC_GTM_ID` в Railway |
| Lighthouse на preview/prod | 🔴 замер и фиксация в `docs/lighthouse-baseline.md` |

## Backlog (до фазы 7)

- **CRM (отдельный репозиторий / чат):** UI админки, дашборд заказов, смена статусов. На **сайте** только API (`GET/PATCH /api/admin/orders`, webhooks) — см. `docs/crm-integration.md`.
- Telegram уведомления клиенту (через `CUSTOMER_NOTIFY_*` или из CRM).
- Uptime / внешний мониторинг `GET /api/health?deep=1`.

## Фаза 7 — в самый конец 🔴

`TODO(legal)` — после юриста.

`npm run verify`
