# Architecture

MITEEE is a Next.js App Router application with a build-time Markdown content pipeline. The production artifact is a Next.js standalone server, not a Docusaurus static site.

## Request and content flow

1. Learner notes live under `docs/` as Markdown or MDX. The normal academic source pattern is `docs/**/*.md`.
2. `scripts/build-content-data.ts` discovers publishable files, reads frontmatter, normalizes Markdown, rewrites local links and assets, and writes runtime JSON under `data/generated/`.
3. Note-relative assets are copied to `public/content-assets/`.
4. `lib/content.ts` reads the generated catalog and note JSON.
5. `app/courses/` renders subject discovery and course maps. `app/notes/[slug]/page.tsx` renders normal learner notes. Some collections, such as research and SSC CGL, branch into specialized presentation or routes.
6. `components/MarkdownNote.tsx` renders GFM, KaTeX math, raw supported HTML, syntax-aware code blocks, Mermaid diagrams, and internal note previews.

`data/generated/` and `public/content-assets/` are ignored build output. They can be deleted and recreated from tracked sources. They are not authoritative content.

## Top-level ownership

| Path | Owns | Notes |
|---|---|---|
| `app/` | Routes, layouts, route handlers, metadata | Server Components by default; API handlers live under `app/api/` |
| `components/` | Reusable UI and interactive client components | Add `"use client"` only when browser APIs, state, or event handlers require it |
| `lib/` | Domain logic, parsing, storage contracts, content access | Prefer testable pure functions here |
| `docs/` | Publishable learner-facing Markdown | Every new file must be assumed public unless the content builder explicitly excludes it |
| `scripts/` | Content generation, audits, packaging, verification | `build-content-data.ts` is the academic-note pipeline |
| `data/generated/` | Generated runtime indexes and note JSON | Ignored; never edit by hand |
| `data/auth/` | Better Auth SQLite data and managed local secret | Persistent and ignored; never commit or overwrite during deployment |
| `data/exams/ssc-cgl/` | SSC source manifests, curated runtime inputs, internal process material | Uses additional domain-specific builders and policies |
| `public/` | Stable public assets | Build-generated note assets appear under `public/content-assets/` |
| `tests/` | Node test suite and structural regression tests | Runs serially through `scripts/run-tests.mjs` |
| `ops/` and `docker/` | Production packaging and server operations | Preserve the standalone deployment shape |
| `src/`, `docusaurus.config.ts`, `sidebars.ts` | Legacy Docusaurus-era material | Excluded from current TypeScript and lint paths; do not build new features here |

## Course and note identity

For normal MIT academic notes, the first two path segments determine the course:

```text
docs/sem7/pse/01-introduction.md
     └─┬─┘ └┬┘
 semester  subject folder

course code: SEM7-PSE
note slug:   sem7-pse-01-introduction
routes:      /courses/SEM7-PSE
             /notes/sem7-pse-01-introduction
```

The path is part of the public identity. Renaming or moving a published note changes its generated slug and therefore its URL. Treat that as a migration, not a cosmetic cleanup.

Friendly course names for established subjects live in the `courseNames` map in `scripts/build-content-data.ts`. A new folder is discoverable without an entry, but the fallback title is derived from the folder name and may be ugly. Add the explicit display name when introducing a subject.

## Rendering boundaries

- Markdown is converted to generated JSON during `npm run build:content`; the site does not read source Markdown on each request.
- A production build also runs content generation through `prebuild`, but run `npm run build:content` directly while authoring so failures are immediate.
- `# Title` matching the frontmatter title is removed from the generated body because the page renders its own `<h1>`. Start the visible lesson structure at `##` after the title.
- Headings from `##` through `####` become the reader outline. Stable, descriptive headings make navigation and search better.
- A code fence makes a note “runnable” for catalog statistics. A `mermaid` fence becomes a rendered diagram.
- Math is normalized and rendered with KaTeX. Prefer `$…$` for inline math and `$$…$$` for display math.

## State and persistence

There are two different persistence models:

| Data | Current persistence |
|---|---|
| Accounts and sessions | Server-backed Better Auth with SQLite under `data/auth/` |
| Private DeepTutor sessions, memory, and knowledge indexes | Server-backed DeepTutor data under `data/deeptutor/`; available only through the owner-gated app proxy |
| Reading progress, study plans, attempts, mistakes, saved items, themes, layout preferences | Browser `localStorage`; device/browser-local |
| Generated course catalog and note bodies | Build output from tracked source files |
| Secrets | Environment variables or ignored local secret files |

A new feature must choose its persistence model explicitly. Do not put account data into browser storage, and do not describe browser-local study state as synchronized. Any move from local-only state to account-backed state is a data migration and privacy change that needs a separate design.

## Production shape

- `next.config.mjs` sets `output: "standalone"`.
- `npm run build` produces `.next/standalone`.
- Docker is the local production-verification path.
- DeepTutor runs as a private Docker-network service. It has no published host port; the compact drawer, access-aware Tutor navigation tab, and `/tutor` chat all use `app/api/deeptutor`, the only browser-facing bridge. The owner account is always authorized and optional additional emails come only from the server-side `DEEPTUTOR_ALLOWED_EMAILS` allowlist.
- Model discovery and changes use the separate owner-gated `app/api/deeptutor/models` proxy. ChatGPT sign-in is DeepTutor's `openai-codex` OAuth flow; the public callback proxy forwards only bounded OAuth fields and DeepTutor validates the state. DeepSeek credentials are submitted once to the server-side catalog, never returned by the safe model-list response, and only the selected profile/model identifiers are saved in browser storage and attached to a tutor turn.
- The DeepTutor corpus sync discovers all public note sources recursively, converts every generated `exams/**/questions.json` bank into bounded Markdown chunks, and includes published daily current-affairs briefs. A corpus digest triggers reindexing after future content changes without pulling browser-local learner history into server memory; the private refresh service rechecks that digest every 15 minutes so cron-generated briefs do not wait for another deployment.
- A push to `main` triggers `.github/workflows/deploy-netcup.yml`, which generates data, tests, lints, typechecks, builds, deploys, and verifies public routes.
- The live origin is `https://note.arzvak.com`.

Do not add a second deployment path casually. If the production shape changes, update the workflow, operational scripts, README, and this handbook together.
