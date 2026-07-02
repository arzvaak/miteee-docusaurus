#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="${ROOT_DIR:-$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)}"
LOG_DIR="$ROOT_DIR/data/current-affairs/logs"
STAMP="$(TZ=Asia/Kolkata date +%F)"
LOG_FILE="$LOG_DIR/$STAMP.log"
LOCK_FILE="$LOG_DIR/.ssc-cgl-news.lock"
LOG_RETENTION_DAYS="${CURRENT_AFFAIRS_LOG_RETENTION_DAYS:-45}"
RUN_DATE="$STAMP"
ARGS=()

mkdir -p "$LOG_DIR"
cd "$ROOT_DIR"

while [[ $# -gt 0 ]]; do
  case "$1" in
    --date)
      if [[ $# -lt 2 || -z "${2:-}" ]]; then
        echo "runner failed: --date requires YYYY-MM-DD" >> "$LOG_FILE"
        exit 1
      fi
      RUN_DATE="$2"
      ARGS+=("$1" "$2")
      shift 2
      ;;
    *)
      ARGS+=("$1")
      shift
      ;;
  esac
done

if [[ -z "$RUN_DATE" ]]; then
  echo "runner failed: no date specified and no default date available" >> "$LOG_FILE"
  exit 1
fi

exec 9>"$LOCK_FILE"
if ! flock -n 9; then
  echo "ssc-cgl-news run skipped date=$RUN_DATE reason=lock at=$(date --iso-8601=seconds)" >> "$LOG_FILE"
  exit 0
fi

if [[ "$LOG_RETENTION_DAYS" =~ ^[0-9]+$ && "$LOG_RETENTION_DAYS" -gt 0 ]]; then
  find "$LOG_DIR" -type f -name '*.log' -mtime +"$LOG_RETENTION_DAYS" -delete
else
  echo "warning: CURRENT_AFFAIRS_LOG_RETENTION_DAYS must be a positive integer; keeping all logs." >> "$LOG_FILE"
fi

if [[ -z "${DEEPSEEK_API_KEY:-}" ]]; then
  if [[ -n "${MISTRAL_API_KEY:-}" ]]; then
    echo "DEEPSEEK_API_KEY is not set; daily_news_pipeline.py will try Mistral fallback." >> "$LOG_FILE"
  else
    echo "DEEPSEEK_API_KEY and MISTRAL_API_KEY are not set; daily_news_pipeline.py will use grounded local fallback." >> "$LOG_FILE"
  fi
fi

echo "ssc-cgl-news run started date=$RUN_DATE at=$(date --iso-8601=seconds)" >> "$LOG_FILE"
python scripts/daily_news_pipeline.py "${ARGS[@]}" >> "$LOG_FILE" 2>&1
python scripts/daily_news_pipeline.py --validate-date "$RUN_DATE" >> "$LOG_FILE" 2>&1
echo "ssc-cgl-news run completed date=$RUN_DATE at=$(date --iso-8601=seconds)" >> "$LOG_FILE"
