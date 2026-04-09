#!/bin/sh
# Старт в Docker: migrate deploy, при P3005 — baseline и повтор (см. https://pris.ly/d/migrate-baseline)
set -e

INIT_MIGRATION="20260408120000_init_orders"
PRISMA="node node_modules/prisma/build/index.js"

run_deploy() {
  $PRISMA migrate deploy
}

if [ "${PRISMA_AUTO_BASELINE:-1}" = "0" ]; then
  run_deploy
  exec node server.js
fi

if ! output=$(run_deploy 2>&1); then
  printf '%s\n' "$output"
  case "$output" in *P3005*)
    echo "[prisma] P3005: схема БД не пустая без истории миграций — помечаем ${INIT_MIGRATION} как применённую и повторяем deploy."
    $PRISMA migrate resolve --applied "$INIT_MIGRATION"
    run_deploy
    ;;
  *)
    exit 1
    ;;
  esac
fi

exec node server.js
