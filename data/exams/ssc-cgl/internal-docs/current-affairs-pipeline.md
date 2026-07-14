# SSC CGL Current Affairs Pipeline

This pipeline builds a daily SSC CGL + UPSC CSE brief from an explicit publisher allowlist. It stores source metadata and bounded informative excerpts, rejects title/feed-only newspaper items, filters out non-exam-priority stories, and then asks DeepSeek to produce a concise source-grounded explainer. Mistral remains the model fallback; if no model key is present, the local fallback can still write a brief from verified source material.

App route: `/exams/ssc-cgl/current-affairs`

## Approved source policy

The allowlist is enforced in `scripts/daily_news_pipeline.py`. Every configured source must name an approved publisher and use a domain assigned to that publisher; the pipeline refuses to start if either check fails.

| Source | Method | Use |
| --- | --- | --- |
| PIB | RSS | Schemes, government decisions, ministries, reports |
| PIB Features | RSS | Culture, schemes, background-style government explainers |
| RBI | RSS | Banking, monetary policy, RBI notifications, financial terms |
| PRS | Scrapling page fetch | Parliament, bills, governance, policy reviews |
| SSC | Public English API | Exam notices and candidate updates |
| The Times of India India / World / Business / Science / Environment / Education / Sports | Official TOI RSS plus mandatory article-body parsing | National affairs, IR, economy, education, science-tech, environment, sports and awards |
| The Hindu National / International / Business / Sci-Tech / Environment / Education / Sport | Publisher RSS plus mandatory article-body parsing | National affairs, IR, economy, environment, education, science-tech, sports and awards |
| The Indian Express UPSC / Explained / India / World / Economy / Science / Sports / Education / Research | Official publisher RSS plus mandatory article-body parsing | UPSC essentials, explainers, national affairs, IR, economy, education policy, science-tech, sports and awards |

Scrapling and parsed article enrichment obey `robots.txt` checks in the script. PRS uses a conservative 10-second `Crawl-delay` setting because it does not expose a stable feed for this app. Newspaper RSS is discovery only: a story cannot be published until the linked page yields a substantial body through JSON-LD `articleBody` or article paragraphs. The script caps the captured excerpt and never stores a full article body.

Set `CURRENT_AFFAIRS_ENRICH_ARTICLES=0` for fast local/container smoke checks that should validate shape without crawling article pages. Leave it enabled on the Netcup cron job for richer daily summaries.

The DeepSeek/Mistral context receives source-diverse high/medium relevance items and up to 3,200 characters from each already-capped excerpt. Each published item records `content_evidence.origin`, extraction method, and captured character count so the UI and audits can prove whether an article body was actually parsed.

The publication gate keeps PIB schemes, RBI/economy, SSC notices, PRS/bills, polity/governance, IR, environment, science-tech, reports, indices, awards, durable sports facts, appointments, defence, and culture. It drops routine results/scorecard notices, betting coverage, quote/viral filler, routine cricket commentary, random foreign accidents, local crime without policy relevance, and company-hosting or AI-business access stories. Article-page JSON-LD headlines replace clipped RSS titles when available. The daily learner edition is capped at 12 ranked stories; low-value raw items may remain in the raw ledger for audit, but they cannot enter the daily brief.

## Manual Run

Manual runs on this PC should still go through Docker. Do not run native Windows Python for this pipeline.

For a no-write check:

```bash
docker run --rm -v "$PWD:/app" -w /app python:3.12-slim bash -lc "pip install -r requirements-ssc.txt >/dev/null && python scripts/daily_news_pipeline.py --date 2026-06-25 --dry-run"
```

Outputs:

| Path | Contents |
| --- | --- |
| `data/current-affairs/raw/YYYY-MM-DD.jsonl` | Dedupe-safe source metadata and excerpts |
| `data/current-affairs/daily/YYYY-MM-DD.json` | SSC + UPSC facts, context, implications, source links, and extraction evidence |
| `data/current-affairs/state.json` | First run date, last successful run, source counts, and recent run audit trail |

## Local Docker Verification

On this PC, do not run the news job through native Python. Use the Docker verifier so dependencies, Scrapling, validation, and cleanup match the containerized workflow:

```bash
RUN_DATE=2026-06-28 bash scripts/verify_ssc_cgl_daily_news_docker.sh
```

On the Windows Codex host, use the PowerShell wrapper. It still runs Python and Scrapling only inside Docker:

```powershell
.\scripts\verify_ssc_cgl_daily_news_docker.ps1 -RunDate 2026-06-28
```

The verifier builds `docker/ssc-cgl-news.Dockerfile`, runs the pipeline into a temporary Docker volume, validates the raw JSONL and daily JSON, prints item/source counts, and removes the volume automatically. To inspect the artifacts after the run:

```bash
KEEP_VOLUME=1 RUN_DATE=2026-06-28 bash scripts/verify_ssc_cgl_daily_news_docker.sh
```

```powershell
.\scripts\verify_ssc_cgl_daily_news_docker.ps1 -RunDate 2026-06-28 -KeepVolume
```

## Netcup Docker Schedule

Run the daily job on the Netcup server as a Docker service, not as a Windows Task Scheduler job on this PC.

```bash
docker compose -f docker-compose.ssc-cgl-news.yml up -d --build
```

The container runs cron with `TZ=Asia/Kolkata` and executes `scripts/run_ssc_cgl_daily_news_once.sh` every day at `07:00`. It writes logs to `data/current-affairs/logs/`, generated briefs to the same `data/current-affairs/` folders used by the app, and a persistent `state.json` ledger so continuity can be checked after server restarts.

On SELinux hosts, the app and cron Compose files use the shared `:z` label only for the current-affairs workspace so both containers retain access. The cron scripts are baked into the news image instead of mounting the whole repository, and the auth database remains on its own private `:Z` mount that is not visible to the news container.

The runner uses a file lock at `data/current-affairs/logs/.ssc-cgl-news.lock`, so a slow fetch or model call cannot overlap the next cron invocation. It also prunes `*.log` files older than `CURRENT_AFFAIRS_LOG_RETENTION_DAYS` days; the default retention window is 45 days.

Set `DEEPSEEK_API_KEY` and optionally `DEEPSEEK_MODEL=deepseek-v4-pro` in the Netcup server environment or `.env` file before starting the service. `MISTRAL_API_KEY` and `MISTRAL_MODEL=mistral-small-latest` remain supported only as fallback. Explicit values supplied by the deployment workflow take precedence over the preserved server `.env`, so an empty legacy entry cannot erase a managed GitHub Actions secret. Without either key, the local fallback still creates a brief from official metadata.

After each run, the runner validates the raw JSONL and daily JSON before it logs success. The gate rejects empty raw excerpts, full article body fields such as `raw_body`, non-ready daily briefs, missing summary items, missing SSC/UPSC relevance fields, missing background/prelims/mains fields, overlong generated fields, invalid relevance labels, and MCQ seeds without question, answer, or trap text. It also rejects source-name recall cards such as "Which source reported..." because those are not SSC/UPSC questions. Check `state.json` for `firstRunDate`, `lastSuccessfulDate`, `totalRuns`, `successfulRuns`, and per-source counts when auditing whether the Netcup job has been running every day.

The daily JSON also carries a rolling calendar memory block:

- `today`: the current run's digest.
- `yesterday`: the previous day's digest when available.
- `weekly_calendar`: available daily digests in the running 7-day window.
- `monthly_calendar`: available daily digests in the running 30-day window.
- `week_total_items`, `week_high_yield`, `month_total_items`, `month_high_yield`: running revision totals for the week and month panels.

Use the server-side verifier after installation, after deploys, or when checking whether the 07:00 IST job actually ran:

```bash
RUN_DATE=$(date +%F) bash ops/netcup/verify-ssc-cgl-news.sh /root/miteee-next
```

The verifier requires the cron container to be running, re-validates the raw and daily artifacts inside Docker, checks that `state.json` marks the requested date as the latest successful run, and prints the daily item count.

## Safety Rules

- Do not render raw full article bodies in the app.
- Do not summarize facts that are not present in verified official records/pages or parsed article excerpts.
- Keep third-party article content out of the generated JSON.
- Reject newspaper items that remain feed-summary/title only.
- Do not add a publisher or domain without updating and reviewing the explicit allowlist.
- Prefer official sources before approved newspaper reporting.
