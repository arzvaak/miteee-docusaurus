#!/usr/bin/env bash
set -euo pipefail

RUN_DATE="${RUN_DATE:-$(TZ=Asia/Kolkata date +%F)}"
IMAGE_NAME="${IMAGE_NAME:-miteee-ssc-cgl-news-local-verify}"
VOLUME_NAME="${VOLUME_NAME:-miteee-ssc-cgl-news-verify-${RUN_DATE//[^0-9]/}}"
KEEP_VOLUME="${KEEP_VOLUME:-0}"

cleanup() {
  if [ "$KEEP_VOLUME" != "1" ]; then
    docker volume rm "$VOLUME_NAME" >/dev/null 2>&1 || true
  fi
}
trap cleanup EXIT

docker build -f docker/ssc-cgl-news.Dockerfile -t "$IMAGE_NAME" .
docker volume create "$VOLUME_NAME" >/dev/null

docker run --rm \
  -e TZ=Asia/Kolkata \
  -e CURRENT_AFFAIRS_DATA_ROOT=/tmp/current-affairs \
  -e DEEPSEEK_API_KEY="${DEEPSEEK_API_KEY:-}" \
  -e DEEPSEEK_MODEL="${DEEPSEEK_MODEL:-deepseek-v4-pro}" \
  -e MISTRAL_API_KEY="${MISTRAL_API_KEY:-}" \
  -e MISTRAL_MODEL="${MISTRAL_MODEL:-mistral-small-latest}" \
  -v "$PWD:/app" \
  -v "$VOLUME_NAME:/tmp/current-affairs" \
  "$IMAGE_NAME" \
  bash -lc "python scripts/daily_news_pipeline.py --date '$RUN_DATE' && python scripts/daily_news_pipeline.py --validate-date '$RUN_DATE'"

docker run --rm \
  -v "$VOLUME_NAME:/tmp/current-affairs" \
  "$IMAGE_NAME" \
  python - "$RUN_DATE" <<'PY'
import json
import sys
from pathlib import Path

date = sys.argv[1]
root = Path("/tmp/current-affairs")
raw_path = root / "raw" / f"{date}.jsonl"
daily_path = root / "daily" / f"{date}.json"
state_path = root / "state.json"

raw_count = sum(1 for line in raw_path.read_text(encoding="utf-8").splitlines() if line.strip())
daily = json.loads(daily_path.read_text(encoding="utf-8"))
state = json.loads(state_path.read_text(encoding="utf-8"))

print(json.dumps({
    "date": date,
    "rawItems": raw_count,
    "summaryItems": len(daily.get("items", [])),
    "status": daily.get("status"),
    "lastSuccessfulDate": state.get("lastSuccessfulDate"),
    "sources": state.get("recentRuns", [{}])[-1].get("sources", []),
}, indent=2))
PY

if [ "$KEEP_VOLUME" = "1" ]; then
  echo "kept Docker volume: $VOLUME_NAME"
fi
