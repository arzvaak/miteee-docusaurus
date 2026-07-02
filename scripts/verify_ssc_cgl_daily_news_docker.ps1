param(
  [string]$RunDate = "",
  [string]$ImageName = "miteee-ssc-cgl-news-local-verify",
  [string]$VolumeName = "",
  [switch]$KeepVolume
)

$ErrorActionPreference = "Stop"
if (-not $RunDate) {
  $RunDate = [TimeZoneInfo]::ConvertTimeBySystemTimeZoneId([DateTimeOffset]::UtcNow, "India Standard Time").ToString("yyyy-MM-dd")
}

if (-not $VolumeName) {
  $safeDate = $RunDate -replace "[^0-9]", ""
  $VolumeName = "miteee-ssc-cgl-news-verify-$safeDate"
}

try {
  docker build -f docker/ssc-cgl-news.Dockerfile -t $ImageName .
  docker volume create $VolumeName | Out-Null

  docker run --rm `
    -e "TZ=Asia/Kolkata" `
    -e "CURRENT_AFFAIRS_DATA_ROOT=/tmp/current-affairs" `
    -e "DEEPSEEK_API_KEY=$env:DEEPSEEK_API_KEY" `
    -e "DEEPSEEK_MODEL=$(if ($env:DEEPSEEK_MODEL) { $env:DEEPSEEK_MODEL } else { 'deepseek-v4-pro' })" `
    -e "MISTRAL_API_KEY=$env:MISTRAL_API_KEY" `
    -e "MISTRAL_MODEL=$(if ($env:MISTRAL_MODEL) { $env:MISTRAL_MODEL } else { 'mistral-small-latest' })" `
    -v "${PWD}:/app" `
    -v "${VolumeName}:/tmp/current-affairs" `
    $ImageName `
    bash -lc "python scripts/daily_news_pipeline.py --date '$RunDate' && python scripts/daily_news_pipeline.py --validate-date '$RunDate'"

  $summary = @'
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
'@

  $summary | docker run --rm `
    -i `
    -v "${VolumeName}:/tmp/current-affairs" `
    $ImageName `
    python - $RunDate

  if ($KeepVolume) {
    Write-Host "kept Docker volume: $VolumeName"
  }
} finally {
  if (-not $KeepVolume) {
    docker volume rm $VolumeName 2>$null | Out-Null
  }
}
