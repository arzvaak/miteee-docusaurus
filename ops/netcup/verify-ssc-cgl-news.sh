#!/usr/bin/env bash
set -euo pipefail

APP_DIR="${1:-$(pwd)}"
RUN_DATE="${RUN_DATE:-$(TZ=Asia/Kolkata date +%F)}"
COMPOSE_PROJECT_NAME="${COMPOSE_PROJECT_NAME:-miteee}"

cd "$APP_DIR"

test -f docker-compose.ssc-cgl-news.yml
test -f scripts/daily_news_pipeline.py
test -f data/current-affairs/raw/"$RUN_DATE".jsonl
test -f data/current-affairs/daily/"$RUN_DATE".json
test -f data/current-affairs/state.json

export COMPOSE_PROJECT_NAME

docker compose -f docker-compose.ssc-cgl-news.yml ps --status running ssc-cgl-news
docker compose -f docker-compose.ssc-cgl-news.yml exec -T ssc-cgl-news python scripts/daily_news_pipeline.py --validate-date "$RUN_DATE"

python - "$RUN_DATE" <<'PY'
from __future__ import annotations

import json
import sys
from pathlib import Path

run_date = sys.argv[1]
state_path = Path("data/current-affairs/state.json")
state = json.loads(state_path.read_text(encoding="utf-8"))

if state.get("lastSuccessfulDate") != run_date:
    raise SystemExit(f"lastSuccessfulDate is {state.get('lastSuccessfulDate')!r}, expected {run_date!r}")
if int(state.get("successfulRuns") or 0) < 1:
    raise SystemExit("successfulRuns must be at least 1")
if int(state.get("totalRuns") or 0) < int(state.get("successfulRuns") or 0):
    raise SystemExit("totalRuns cannot be lower than successfulRuns")

brief = json.loads(Path(f"data/current-affairs/daily/{run_date}.json").read_text(encoding="utf-8"))
items = brief.get("items") or []
if not items:
    raise SystemExit("daily brief has no items")

print(
    "ssc-cgl-news verified",
    f"date={run_date}",
    f"items={len(items)}",
    f"successfulRuns={state.get('successfulRuns')}",
)
PY
