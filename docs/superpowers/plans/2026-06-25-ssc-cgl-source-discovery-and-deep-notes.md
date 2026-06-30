# SSC CGL Source Discovery and Deep Notes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Move the SSC CGL system closer to a 200/200 prep corpus by adding rights-aware PYQ/resource discovery, resource manifests, and deeper study-note surfaces.

**Architecture:** Keep scraped/discovered resource metadata separate from reviewed ranked questions. The Python discovery script writes candidate metadata under `data/exams/ssc-cgl/resource-candidates.json`; the Next app consumes generated exam data only after explicit review.

**Tech Stack:** Python 3, Scrapling, TypeScript node tests, Next.js generated data, markdown docs.

---

### Task 1: Resource Discovery Manifest

**Files:**
- Create: `scripts/ssc_cgl_resource_discovery.py`
- Create: `tests/ssc-cgl-resource-discovery.test.ts`
- Modify: `data/exams/ssc-cgl/source-registry.json`

- [ ] **Step 1: Write the failing test**

```ts
test("SSC CGL resource discovery script emits rights-aware candidates", () => {
  const script = fs.readFileSync(path.join(process.cwd(), "scripts", "ssc_cgl_resource_discovery.py"), "utf8");
  assert.match(script, /scrapling/i);
  assert.match(script, /copyright_risk_reference/);
  assert.match(script, /official_open/);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --import tsx --test tests/ssc-cgl-resource-discovery.test.ts`
Expected: FAIL because the discovery script does not exist yet.

- [ ] **Step 3: Write minimal implementation**

Implement a Python script that:
- fetches official SSC, Scribd, and trusted third-party listing pages using Scrapling when available;
- extracts links/titles/snippets;
- classifies candidates as `official_open`, `copyright_risk_reference`, or `web_pdf_unverified`;
- writes `data/exams/ssc-cgl/resource-candidates.json`;
- never downloads copyright-risk resources.

- [ ] **Step 4: Run test to verify it passes**

Run: `node --import tsx --test tests/ssc-cgl-resource-discovery.test.ts`
Expected: PASS.

### Task 2: Deep Notes Expansion

**Files:**
- Modify: `docs/ssc-cgl/overview.md`
- Create: `docs/ssc-cgl/reasoning/arrangements-and-logic.md`
- Create: `docs/ssc-cgl/quant/arithmetic-speed-book.md`
- Create: `docs/ssc-cgl/english/vocab-grammar-bank.md`
- Create: `docs/ssc-cgl/ga/static-gk-map.md`
- Create: `tests/ssc-cgl-deep-notes.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
test("SSC CGL deep notes include 200/200 study artifacts", () => {
  const files = collectMarkdown("docs/ssc-cgl");
  assert.ok(files.length >= 10);
  for (const phrase of ["200/200 Drill", "PYQ Link Queue", "Trap Table", "Flowchart"]) {
    assert.ok(files.some((file) => fs.readFileSync(file, "utf8").includes(phrase)));
  }
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --import tsx --test tests/ssc-cgl-deep-notes.test.ts`
Expected: FAIL because the notes are not broad enough.

- [ ] **Step 3: Add notes**

Add four subject-specific notes with formula/trap tables, flowcharts, solved examples, and links into the generated practice/topic queues.

- [ ] **Step 4: Run test to verify it passes**

Run: `node --import tsx --test tests/ssc-cgl-deep-notes.test.ts`
Expected: PASS.

### Task 3: Verification

**Files:**
- Generated: `data/exams/ssc-cgl/resource-candidates.json`
- Generated: `data/generated/exams/ssc-cgl/*`

- [ ] **Step 1: Run discovery dry run**

Run: `python scripts\ssc_cgl_resource_discovery.py --offline-seed`
Expected: writes a candidate manifest with official, Scribd/reference, and web PDF candidates.

- [ ] **Step 2: Regenerate content**

Run: `npm run build:content`
Expected: generated SSC data remains valid.

- [ ] **Step 3: Full verification**

Run: `npm test`, `npm run lint`, `npm run typecheck`, and `npm run build`.
Expected: all commands exit 0.
