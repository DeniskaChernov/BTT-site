# Обход Nixpacks/mise (ошибка copy /mise/installs → context canceled на Railway)
FROM node:20-bookworm-slim AS base
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
# postinstall и build вызывают prisma generate — без URL валидатор падает (реальная БД не нужна).
# В рантайме Railway подставляет свой DATABASE_URL поверх этого значения.
ENV DATABASE_URL="postgresql://build:build@127.0.0.1:5432/build?schema=public"

FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci

FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM base AS runner
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder /app/messages ./messages
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
# Standalone file tracing копирует неполный @swc/helpers (без esm/) — в рантайме падает резолв
COPY --from=builder /app/node_modules/@swc/helpers ./node_modules/@swc/helpers

# Prisma CLI + движки для migrate deploy при старте (npm start в образе не вызывается)
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/prisma ./node_modules/prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

# Image Optimization пишет в .next/cache — без chown nextjs получает EACCES на Railway
RUN mkdir -p .next/cache && chown -R nextjs:nodejs /app

USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
CMD ["sh", "-c", "node node_modules/prisma/build/index.js migrate deploy && exec node server.js"]
