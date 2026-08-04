# MITEEE

Local-first study site for MIT EEE notes, UPSC CSE Political Science NCERT notes, revision memory, active recall, and practice workflows.

The current app includes server-backed email/password accounts, 14 appearance choices (System plus 13 palettes, including Monokai, Dracula, Nord, Gruvbox, Solarized, Tokyo Night, One Dark, and Catppuccin), and dedicated SSC CGL subject homes with searchable staged tables of contents.

## Contributor handbook

Start with [CONTRIBUTING.md](CONTRIBUTING.md) before adding a subject, writing notes, changing a page, or introducing a new feature. The detailed handbook lives in [handbook/README.md](handbook/README.md), and the copy-ready note template lives outside `docs/` under `templates/` so it is never published by accident.

## Run Locally

```bash
npm install
npm run dev
```

The app runs on Next.js and requires Node.js 22 or newer; CI and Docker use Node.js 24. Content indexes are generated from `docs/` into `data/generated/` before production builds.

## Validate

```bash
npm test
npm run lint
npm run typecheck
npm run build
```

If a large build runs out of memory on this machine, rerun with a larger Node heap:

```bash
$env:NODE_OPTIONS="--max-old-space-size=8192"; npm run build
```

## Local Production Verification

This app deploys as a Next.js standalone bundle. Keep the production shape as `.next/standalone`; do not switch the verification path back to the old static Docusaurus build.

From a clean terminal:

```bash
npm test
npm run lint
npm run typecheck
docker compose -f docker-compose.next.yml up -d --build
```

With the Docker app running, verify these local production URLs before packaging or promoting a build:

```bash
curl.exe -I http://127.0.0.1:3000/
curl.exe -I http://127.0.0.1:3000/courses
curl.exe -I http://127.0.0.1:3000/courses/SSC-CGL/reasoning
curl.exe -I http://127.0.0.1:3000/exams/ssc-cgl
curl.exe -I http://127.0.0.1:3000/exams/ssc-cgl/tests
curl.exe -I http://127.0.0.1:3000/exams/ssc-cgl/topics/probability
curl.exe -I http://127.0.0.1:3000/robots.txt
curl.exe -I http://127.0.0.1:3000/sitemap.xml
curl.exe -I http://127.0.0.1:3000/site.webmanifest
curl.exe -I http://127.0.0.1:3000/img/icons/icon-192.png
curl.exe -I http://127.0.0.1:3000/login
curl.exe -I http://127.0.0.1:3000/register
curl.exe -I http://127.0.0.1:3000/settings
```

Stop the local production container when verification is done:

```bash
docker compose -f docker-compose.next.yml down
```

## Accounts and local study data

Accounts use Better Auth with a persistent SQLite database at `data/auth/miteee-auth.sqlite` in the Docker workflow. That folder is intentionally excluded from Git, Docker build contexts, and deployment sync so an upgrade cannot overwrite existing accounts. The app creates a strong secret beside the database when no managed `BETTER_AUTH_SECRET` is supplied; production can provide a managed secret through the environment instead.

Set `BETTER_AUTH_URL` to the public origin for production. For local Docker verification it follows the published localhost port and defaults to `http://localhost:3000`.

The app publishes on host port `3000` by default. Set `NEXT_APP_PUBLISHED_PORT` when a local or server process needs a different host port; the container still listens on port `3000`. Published ports bind to `127.0.0.1` so nginx remains the only public entry point. The Compose default keeps the auth origin on that same localhost port. For any non-local hostname, set `BETTER_AUTH_URL` explicitly to the browser-visible origin.

Account records and sessions are server-backed. Email ownership verification is not enabled yet, so the email is currently a sign-in identifier rather than a verified contact address. Reading progress, plans, attempts, mistakes, saved items, and the selected theme remain in the current browser and do not sync across devices yet.

## Optional Mistral Coach

The study coach works without a key using local fallback logic. To enable Mistral-backed coaching, copy `.env.example` to a local `.env` file and set only local secrets there:

```bash
MISTRAL_API_KEY=your_key_here
MISTRAL_MODEL=mistral-small-latest
```

`MISTRAL_MODEL` is optional; it defaults to `mistral-small-latest` when unset. Do not commit `.env`; it is intentionally ignored.
The older typo alias `MISTRAK_API_KEY` is still accepted for compatibility, but new local configs should use `MISTRAL_API_KEY`.

## SSC CGL Current Affairs

The SSC CGL module includes a daily official-source current-affairs fetcher:

```bash
python scripts/daily_news_pipeline.py --date 2026-06-25
docker compose -f docker-compose.ssc-cgl-news.yml up -d --build
```

It writes raw metadata to `data/current-affairs/raw/`, SSC recall briefs to `data/current-affairs/daily/`, and a continuity ledger to `data/current-affairs/state.json`. DeepSeek is the primary summary provider through `DEEPSEEK_API_KEY` and `DEEPSEEK_MODEL=deepseek-v4-pro`; `MISTRAL_API_KEY` remains a fallback only. The Netcup Docker cron service and source policy live in `data/exams/ssc-cgl/internal-docs/current-affairs-pipeline.md`.

Keep the raw SSC CGL book-PYQ corpus outside the repository. The default local location is:

```bash
G:\MITEEE_LOCAL_ARTIFACTS\ssc-cgl-corpus\book-imports\questions.json
```

For Docker validation, mount that folder and set `SSC_CGL_BOOK_IMPORTS_ROOT=/ssc-cgl-corpus/book-imports`. The repo keeps only small manifests, reports, source code, notes, and public assets that are actually rendered.

For SSC CGL uploaded-book OCR/promotion and book-PYQ blueprint generation, install the Python dependencies and run:

```bash
python -m pip install -r requirements-ssc.txt
python scripts/ssc_cgl_promote_agent_reviewed.py --output-root G:\MITEEE_LOCAL_ARTIFACTS\ssc-cgl-corpus\book-imports --source-type book_user_provided --trust-book-format-dedupe
python scripts/ssc_cgl_book_corpus_blueprint.py
npm run build:content
```

The active SSC CGL question pool is the uploaded book-PYQ corpus at `SSC_CGL_BOOK_QUESTIONS_PATH`, `SSC_CGL_BOOK_IMPORTS_ROOT/questions.json`, or the default local artifact path above. Reviewed book rows are treated as PYQ for this personal practice system, with provenance kept as `book_user_provided`. The blueprint is written to `data/exams/ssc-cgl/book-imports/corpus-blueprint.json` and `docs/ssc-cgl/book-corpus-blueprint.md`; DeepSeek note prompts use it to make notes match the actual corpus distribution while preserving the 200/200 standard.

Legacy web/official source discovery scripts still exist for optional metadata work, but the 50-year source hunt is not the active SSC milestone. Do not leave local SearXNG or Firecrawl helper containers running after a discovery session.

For one-topic-at-a-time DeepSeek study-note authoring, run:

```bash
python scripts/ssc_cgl_deepseek_note_author.py --topic percentages-ratio --output docs/ssc-cgl/quant/percentages-ratio.md --audit-root data/exams/ssc-cgl/deep-notes/percentages-ratio
python scripts/ssc_cgl_deepseek_note_author.py --topic time-work-pipes --output docs/ssc-cgl/quant/time-work-pipes.md --audit-root data/exams/ssc-cgl/deep-notes/time-work-pipes
```

The authoring harness writes the prompt, raw model response, normalized markdown, and audit report. It is intentionally a helper for one curated topic at a time; prompts include the book-PYQ blueprint so notes stay exhaustive for 200/200 instead of following a generic syllabus.
