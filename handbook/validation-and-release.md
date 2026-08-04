# Validation and release

Run checks in proportion to the change, but never skip the content generator for note work or the full build for a release candidate.

## Validation tiers

### Content-only change

Use this for ordinary academic Markdown and nearby note assets:

```powershell
npm run build:content
node --import tsx --test tests/content-generator.test.ts tests/content-access.test.ts
npm run dev
```

In the browser, verify:

- `/courses/<COURSE-CODE>` shows the subject and correct reading order;
- `/notes/<generated-slug>` has the right title, outline, equations, diagrams, links, and practice panels;
- the note is searchable;
- both desktop and narrow layouts remain readable.

If the note belongs to SSC CGL, use the SSC-specific tests and rendered/browser checks because those notes also feed dedicated exam routes.

### Feature or shared-library change

Run focused tests while iterating, then:

```powershell
npm run build:content
npm test
npm run lint
npm run typecheck
```

Also inspect every route and responsive state affected by the feature.

### Release candidate

Run the complete local gate:

```powershell
npm run build:content
npm test
npm run lint
npm run typecheck
$env:NODE_OPTIONS="--max-old-space-size=8192"
npm run build
```

`npm run build` invokes the content builders again through `prebuild`. The explicit first run is still useful because it separates content failures from the longer application build.

If `NODE_OPTIONS` was set only for the build, remove it afterwards:

```powershell
Remove-Item Env:NODE_OPTIONS
```

## Local production verification

The production shape is Docker plus the Next.js standalone output:

```powershell
docker compose -f docker-compose.next.yml up -d --build
```

Open `http://127.0.0.1:3000` and check the changed routes. At minimum, confirm the home page, course library, changed subject, changed note or feature route, settings, and authentication pages still load.

Stop the local stack when finished:

```powershell
docker compose -f docker-compose.next.yml down
```

If Docker Desktop is unavailable, report that limitation and complete the strongest non-Docker build and browser verification available. Do not describe that as equivalent to the production-container check.

## Diff hygiene

Before committing or handing off:

```powershell
git status --short
git diff --check
git diff --stat
git diff
```

Expected generated directories such as `data/generated/` and `public/content-assets/` are ignored. If a generation or research command creates additional caches, audit them before staging. Never use broad staging as a substitute for reviewing the file list.

## Production deployment

A push to `main` triggers `.github/workflows/deploy-netcup.yml`. The workflow:

1. installs dependencies with Node 24;
2. generates content and exam data;
3. runs tests, lint, and typechecking;
4. builds the standalone application and verifies SSC rendered output;
5. backs up the current server release and syncs the new source;
6. publishes the Next.js app and refreshes current-affairs artifacts;
7. checks public pages on `https://note.arzvak.com` and runs the SSC browser smoke suite.

Do not manually change the Netcup service for an ordinary content or feature contribution. A production release is complete only after the workflow succeeds and the exact changed public route is checked on the live domain.

## Failure triage

| Failure | First place to look |
|---|---|
| Note missing from the library | Folder path, `npm run build:content` output, and `data/generated/notes-index.json` |
| Wrong subject name | `courseNames` in `scripts/build-content-data.ts` |
| Wrong note order | Numeric filename prefixes, week folder naming, and `sidebar_position` |
| Broken image | Relative path from the note and generated copy under `public/content-assets/` |
| Formula renders as text | Math delimiters and `lib/markdown-normalize.ts` behavior |
| Works in development but not build | Server/client boundary, environment access, generated data, and static rendering assumptions |
| Full tests fail after an intentional redesign | A focused regression test may still assert the old user-visible contract; update it only if the product contract truly changed |
| Deployment passes but the new page is absent | Confirm the change reached `main`, the workflow built the expected commit, and the live route/slug matches the generated path |
