# Обход Nixpacks/mise (ошибка copy /mise/installs → context canceled на Railway)
FROM node:20-bookworm-slim AS base
RUN apt-get update -y && apt-get install -y openssl ca-certificates && rm -rf /var/lib/apt/lists/*
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
# postinstall и build вызывают prisma generate — без URL валидатор падает (реальная БД не нужна).
# В рантайме Railway подставляет свой DATABASE_URL поверх этого значения.
ENV DATABASE_URL="postgresql://build:build@127.0.0.1:5432/build?schema=public"

FROM base AS deps
COPY package.json package-lock.json ./
# Иначе postinstall (prisma generate) не видит schema.prisma и падает
COPY prisma ./prisma
# Railway: cache mount обязан включать id=…
RUN --mount=type=cache,id=npm,target=/root/.npm \
    npm ci

FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Next «Collecting build traces» + SWC жрут память; на маленьких билдерах Railway без этого бывает OOM
ENV NODE_OPTIONS="--max-old-space-size=4096"
RUN npm run build

FROM base AS runner
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder /app/messages ./messages
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
# Полный node_modules из builder: у Prisma CLI транзитивные deps (@prisma/config → effect, c12, …),
# частичное копирование prisma/@prisma давало MODULE_NOT_FOUND «effect» при migrate deploy.
COPY --from=builder /app/node_modules ./node_modules

COPY --from=builder /app/prisma ./prisma

COPY scripts/docker-entry.sh ./scripts/docker-entry.sh
RUN chmod +x ./scripts/docker-entry.sh

# Image Optimization пишет в .next/cache — без chown nextjs получает EACCES на Railway
RUN mkdir -p .next/cache && chown -R nextjs:nodejs /app

USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
CMD ["./scripts/docker-entry.sh"]
