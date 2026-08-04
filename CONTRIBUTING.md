# Contributing to MITEEE

This repository is both my study material and the application that presents it. A contribution is complete only when the material is useful, the website can discover it, and the relevant checks pass.

## Start with the kind of change

| I want to… | Read first | Main files |
|---|---|---|
| Add or improve one note | [Adding notes](handbook/adding-notes.md) | `docs/…/*.md` and nearby assets |
| Add a new academic subject | [Adding notes](handbook/adding-notes.md#add-a-new-academic-subject) | `docs/semN/<subject>/` and `scripts/build-content-data.ts` |
| Add a page, control, study tool, or API | [Adding features](handbook/adding-features.md) | `app/`, `components/`, `lib/`, and `tests/` |
| Understand where data comes from | [Architecture](handbook/architecture.md) | `docs/`, `data/`, `scripts/`, and `lib/` |
| Check or release a change | [Validation and release](handbook/validation-and-release.md) | `package.json` and `.github/workflows/deploy-netcup.yml` |

The [handbook index](handbook/README.md) has the full documentation map.

## Non-negotiable rules

1. Treat `docs/` as publishable learner content. Do not put planning notes, contributor docs, prompts, scratchpads, or templates there.
2. Treat `data/generated/` and `public/content-assets/` as disposable build output. Change the source under `docs/`, then regenerate. Do not hand-edit generated files.
3. Keep the production app on Next.js standalone output. The Docusaurus files are legacy compatibility material, not the current implementation path.
4. Keep secrets and personal runtime data out of Git. In particular, never commit `.env`, `data/auth/`, raw current-affairs runs, or local SSC corpus artifacts.
5. Preserve unrelated working-tree changes. This repository may contain unfinished work from another task.
6. Add verification at the same time as behavior. A UI or data-flow change without an appropriate test is unfinished.
7. Do not call a release complete until the public route has been checked after the deployment workflow succeeds.

## Normal workflow

```powershell
npm install
npm run build:content
npm run dev
```

Open `http://localhost:3000`, inspect the exact subject, note, or feature changed, then run the checks required by [Validation and release](handbook/validation-and-release.md).

Before handing off a change, review the diff:

```powershell
git status --short
git diff --check
git diff
```

Do not stage, overwrite, or clean files that are unrelated to the change.

## Definition of done

- The source is in the correct folder and has a stable URL.
- The result appears in the intended course map or page.
- Desktop and narrow layouts remain usable.
- Loading, empty, error, and persisted-state behavior are considered where relevant.
- Focused tests pass, followed by the validation tier required for the change.
- The diff contains no generated caches, secrets, local databases, or unrelated edits.
- Any new convention is added to this handbook in the same change.
