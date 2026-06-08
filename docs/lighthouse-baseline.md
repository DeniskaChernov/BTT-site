# Lighthouse baseline (mobile-first)

Целевые метрики P0: **LCP < 2.5s**, **CLS < 0.1**, **INP < 200ms**.

## Страницы для замера

| URL | Приоритет |
|-----|-----------|
| `/ru` | P0 |
| `/ru/catalog` | P0 |
| `/ru/product/rattan-hal-round-natural-5` | P0 |
| `/ru/checkout` | P0 |
| `/en/catalog` | P1 |
| `/uz/catalog` | P1 |

## Как снять baseline (prod или preview)

```bash
npm run build
npm run start
# в другом терминале:
npx lighthouse http://localhost:3000/ru/catalog --only-categories=performance,accessibility --preset=desktop --output=json --output-path=.lighthouse/catalog-desktop.json
npx lighthouse http://localhost:3000/ru/catalog --only-categories=performance --screenEmulation.mobile=true --output=json --output-path=.lighthouse/catalog-mobile.json
```

Добавьте `.lighthouse/` в `.gitignore` при локальных прогонах.

## Уже внедрено для performance

- Каталог: отложенный search-index, bootstrapping skeleton
- Главная: `HomeLazySections` — нижние секции в отдельных чанках
- Изображения: `next/image` с `sizes` на карточках и PDP
- Motion: `prefers-reduced-motion` на анимациях

## Следующие кандидаты

- `content-visibility` на длинных списках каталога (осторожно с stagger-анимациями)
- Lazy-load `ExamplesSection` / `TrustCountersSection` при появлении в viewport
- Production CDN + сжатие на хостинге
