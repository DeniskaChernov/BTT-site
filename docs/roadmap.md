# BTT Site — Roadmap

> Модель: **оформление = заявка**, оплата через менеджера.  
> Языки: **ru + uz + en**.  
> Юрлицо (ООО) — **в самый конец**.

## Phase 2 — заявка на заказ ✅

См. [`phase-2-plan.md`](./phase-2-plan.md).

---

## P0 — стабилизация

| Задача | Статус |
|--------|--------|
| Performance: каталог first render | ✅ |
| Шапка: выравнивание | ✅ |
| Плавные анимации и переходы | ✅ |
| Адаптив checkout / cart / PDP (sticky CTA) | ✅ |
| EN/UZ quality pass (checkout, cart, PDP, wholesale, account, contacts) | 🟡 |
| Phone mask UZ (+998) on checkout/profile | ✅ |
| Home below-fold lazy chunks | ✅ |
| Lighthouse baseline doc | ✅ |
| E2E checkout flow (ru/en/uz) | ✅ |
| E2E viewports 390/768/1280 | ✅ |
| Push + проверка прода | ✅ |

---

## P1 — неделя 1–2

| Задача | Статус |
|--------|--------|
| Lazy-load тяжёлых секций главной | 🔴 |
| Оптимизация изображений / LCP | 🔴 |
| Адаптив: safe-area, hit-area, без горизонтального скролла | 🟡 |
| EN/UZ v2 по всем страницам | 🔴 |
| Контроль текстов «оплата сразу» | 🔴 |

---

## P2 — после стабилизации

| Задача | Статус |
|--------|--------|
| Метрики воронки | 🔴 |
| Continuous QA чек-лист | 🔴 |
| E2E на viewport 390/768/1024 | 🔴 |
| Мониторинг `/api/orders` | 🔴 |

---

## Backlog

- Админка статусов заказа
- ~~Telegram менеджеру при новом заказе~~ ✅ (`TELEGRAM_BOT_TOKEN` + `TELEGRAM_MANAGER_CHAT_ID`)
- Email менеджеру при новом заказе
- Фильтры-чипы на главной
- Лента этапов заказа для клиента
- Checkout: маска телефона
- SEO schema + перелинковка
- Фаза 7 — реквизиты ООО
