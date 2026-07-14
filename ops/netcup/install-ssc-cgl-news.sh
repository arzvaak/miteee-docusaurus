#!/usr/bin/env bash
set -euo pipefail

APP_DIR="${1:-$(pwd)}"
incoming_run_date="${RUN_DATE-}"
incoming_deepseek_model="${DEEPSEEK_MODEL-}"
incoming_deepseek_api_key="${DEEPSEEK_API_KEY-}"
incoming_mistral_model="${MISTRAL_MODEL-}"
incoming_mistral_api_key="${MISTRAL_API_KEY-}"
incoming_compose_project_name="${COMPOSE_PROJECT_NAME-}"

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

RUN_DATE="${incoming_run_date:-${RUN_DATE:-$(TZ=Asia/Kolkata date +%F)}}"
DEEPSEEK_MODEL="${incoming_deepseek_model:-${DEEPSEEK_MODEL:-deepseek-v4-pro}}"
DEEPSEEK_API_KEY="${incoming_deepseek_api_key:-${DEEPSEEK_API_KEY:-}}"
MISTRAL_MODEL="${incoming_mistral_model:-${MISTRAL_MODEL:-mistral-small-latest}}"
MISTRAL_API_KEY="${incoming_mistral_api_key:-${MISTRAL_API_KEY:-}}"
COMPOSE_PROJECT_NAME="${incoming_compose_project_name:-${COMPOSE_PROJECT_NAME:-miteee}}"

export DEEPSEEK_API_KEY
export DEEPSEEK_MODEL
export MISTRAL_API_KEY
export MISTRAL_MODEL
export COMPOSE_PROJECT_NAME

if [[ -z "$DEEPSEEK_API_KEY" ]]; then
  if [[ -n "$MISTRAL_API_KEY" ]]; then
    echo "warning: DEEPSEEK_API_KEY is not set; installer will use Mistral fallback." >&2
  else
    echo "warning: DEEPSEEK_API_KEY and MISTRAL_API_KEY are not set; installer will use the grounded local fallback." >&2
  fi
fi

docker compose -f docker-compose.ssc-cgl-news.yml up -d --build
docker compose -f docker-compose.ssc-cgl-news.yml exec -T ssc-cgl-news bash scripts/run_ssc_cgl_daily_news_once.sh --date "$RUN_DATE"
bash ops/netcup/verify-ssc-cgl-news.sh "$APP_DIR"

echo "ssc-cgl-news installed and verified for $RUN_DATE"
