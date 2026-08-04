# Adding website features

A feature should have one clear route or integration point, isolated domain logic, an explicit persistence decision, and verification that matches its risk.

## 1. Define the contract before writing UI

Write down these answers in the issue, plan, or change description:

- Who uses it and from which existing page?
- What is the smallest useful outcome?
- What are the empty, loading, success, and error states?
- Does it read generated content, browser-local study state, account data, or an external service?
- Must it work without an API key or network connection?
- What URL, storage key, API response, or generated-data shape becomes a compatibility contract?

This prevents a visual feature from quietly becoming a data migration or production-service change.

## 2. Put each responsibility in the right layer

| Responsibility | Put it in | Example shape |
|---|---|---|
| New page | `app/<route>/page.tsx` | Server Component that loads data and composes the page |
| Dynamic page | `app/<route>/[id]/page.tsx` | Validate the parameter and use `notFound()` when appropriate |
| HTTP endpoint | `app/api/<name>/route.ts` | Return a bounded, typed `NextResponse` |
| Reusable display | `components/<Name>.tsx` | Keep data transformation out of the JSX where practical |
| Interactive display | `components/<Name>.tsx` with `"use client"` | Use only for browser state, events, or browser APIs |
| Domain rules and parsers | `lib/<domain>.ts` | Pure functions with direct tests |
| Feature-specific styles | Adjacent `*.module.css` | Reuse existing CSS variables and responsive conventions |
| Cross-site reader/shell styles | `app/globals.css` or `app/study-minimal.css` | Change only when the rule genuinely spans the whole site |
| Verification | `tests/<feature>.test.ts` | Behavior tests plus tight structural regression checks where needed |

Keep page files readable. If a page contains significant interaction, move that interaction into a named client component. If a client component contains complex scoring, parsing, ranking, or persistence logic, move those rules into `lib/` so they can be tested without a browser.

## 3. Respect the server/client boundary

App Router pages are Server Components by default. Keep them that way unless the page itself truly needs browser interactivity.

Use a client component when the code needs:

- React state or effects;
- click, input, keyboard, or other browser event handlers;
- `window`, `document`, or `localStorage`;
- a client-only library.

Do not import server-only filesystem, database, secret, or environment access into a client component. Pass the smallest serializable data shape from the server page to the client component.

## 4. Choose persistence deliberately

For device-local study state, follow the established pattern:

1. Define the storage key, type, parser, serializer, and default state in `lib/`.
2. Make the parser tolerate missing, malformed, and older values.
3. Read browser storage only after the component is mounted.
4. Persist a versioned or migratable shape when future changes are likely.
5. Add tests for empty, valid, malformed, and legacy input.

Accounts and sessions are server-backed through Better Auth. A feature that needs cross-device user data must not fake synchronization with `localStorage`; it needs a separately designed server-backed model, authorization rules, migration, backup behavior, and privacy review.

## 5. Add an API safely

For `app/api/**/route.ts`:

- validate every route parameter, query value, and JSON field;
- clamp user-controlled limits;
- return stable response shapes and meaningful status codes;
- keep secrets server-side and read them from environment variables;
- do not log credentials, tokens, private study data, or full external responses;
- provide a useful no-key or upstream-failure behavior when the feature is meant to be local-first;
- test normal input, malformed input, limits, and provider failure.

Use `app/api/search/route.ts` as a compact example of parameter clamping and response shaping. Use the study-coach route only when a feature genuinely needs an external model; local deterministic logic is preferred for ordinary study calculations.

## 6. Match the existing product language

- Reuse the site's spacing, surfaces, typography, buttons, and CSS variables.
- Prefer a local CSS Module for a feature-specific surface.
- Check wide desktop, roughly 820 px, and narrow mobile behavior.
- Use semantic headings, labels, landmarks, and native controls before custom interactions.
- Keep keyboard access and visible focus states.
- Respect reduced-motion preferences for animation.
- Give icons accessible text or mark decorative icons with `aria-hidden="true"`.
- Avoid turning a study page into a dense dashboard. Progressive disclosure is part of the current reader design.

## 7. Integrate the feature completely

A route that cannot be discovered is usually unfinished. Depending on the feature, update the appropriate entry points:

- main shell/navigation in `components/AppShell.tsx`;
- home study surfaces in `components/StudyDashboard.tsx`;
- subject discovery under `app/courses/` and `components/CourseCatalog.tsx`;
- note reader integration in `app/notes/[slug]/page.tsx`;
- settings in `app/settings/` and `components/StudySettings.tsx`;
- SEO helpers in `lib/seo.ts`, plus sitemap or robots behavior if the route is public;
- public deployment smoke checks when the route is release-critical.

Do not add a special case to a generic content route when a domain already has a dedicated surface. SSC CGL and research content are examples of specialized presentation built on top of the shared catalog.

## 8. Test the behavior

Use the smallest test that proves the new contract, then run the broader tier from [Validation and release](validation-and-release.md).

Useful test shapes in this repository include:

- pure unit tests for parsers, scoring, filtering, and migration logic;
- generated-content tests using a temporary `docs/` tree;
- source-structure regression tests for route wiring and accessibility contracts;
- rendered-output or browser smoke checks for production-critical flows.

Test names should describe user-visible behavior. Avoid a test that only repeats the implementation.

## Feature handoff checklist

- [ ] The route or entry point is discoverable.
- [ ] Server and client responsibilities are separated.
- [ ] Persistence and migration behavior are explicit.
- [ ] Empty, loading, success, and error states are handled.
- [ ] Keyboard, focus, labels, and narrow layouts are checked.
- [ ] Focused tests cover the contract.
- [ ] The required validation tier passes.
- [ ] No secrets, personal data, generated caches, or unrelated files are in the diff.
- [ ] The handbook is updated if the feature introduces a new convention.
