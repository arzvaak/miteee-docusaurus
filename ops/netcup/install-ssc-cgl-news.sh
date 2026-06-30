#!/usr/bin/env bash
set -euo pipefail

APP_DIR="${1:-$(pwd)}"
RUN_DATE="${RUN_DATE:-$(TZ=Asia/Kolkata date +%F)}"
MISTRAL_MODEL="${MISTRAL_MODEL:-mistral-small-latest}"
MISTRAL_API_KEY="${MISTRAL_API_KEY:-}"
COMPOSE_PROJECT_NAME="${COMPOSE_PROJECT_NAME:-miteee}"

cd "$APP_DIR"

test -f docker-compose.ssc-cgl-news.yml
test -f scripts/daily_news_pipeline.py
test -f scripts/run_ssc_cgl_daily_news_once.sh
mkdir -p data/current-affairs/logs

if [[ -f .env ]]; then
  set -a
  # shellcheck disable=SC1091
  source .env
  set +a
fi

export MISTRAL_API_KEY
export MISTRAL_MODEL
export COMPOSE_PROJECT_NAME

if [[ -z "$MISTRAL_API_KEY" ]]; then
  echo "warning: MISTRAL_API_KEY is not set; installer will use the grounded local fallback." >&2
fi

docker compose -f docker-compose.ssc-cgl-news.yml up -d --build
docker compose -f docker-compose.ssc-cgl-news.yml exec -T ssc-cgl-news bash scripts/run_ssc_cgl_daily_news_once.sh --date "$RUN_DATE"
bash ops/netcup/verify-ssc-cgl-news.sh "$APP_DIR"

echo "ssc-cgl-news installed and verified for $RUN_DATE"
