# SSC CGL DeepSeek Topic Authoring Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a one-topic-at-a-time DeepSeek authoring harness and use it to upgrade SSC CGL topic notes into exhaustive 200/200 study material.

**Architecture:** The script prepares a bounded prompt from one topic, calls DeepSeek only when explicitly run without `--dry-run`, and writes a markdown note plus an audit packet. The markdown lives under `docs/ssc-cgl/...` so the existing content builder indexes it as a normal SSC CGL note.

**Tech Stack:** Python standard library, DeepSeek OpenAI-compatible Chat Completions API, existing Next.js markdown content pipeline, Node test runner.

---

### Task 1: Contract Tests

**Files:**
- Create or modify: `tests/ssc-cgl-deepseek-notes.test.ts`
- Read: `docs/ssc-cgl/quant/percentages-ratio.md`

- [ ] **Step 1: Write the failing test for the note contract**

```ts
test("SSC CGL percentages ratio note is DeepSeek-authored and exhaustive", () => {
  const note = fs.readFileSync(path.join(process.cwd(), "docs", "ssc-cgl", "quant", "percentages-ratio.md"), "utf8");
  assert.match(note, /generated_by: deepseek/i);
  assert.match(note, /## Concept Ladder/i);
  assert.match(note, /## Type System/i);
  assert.match(note, /## Speed Methods/i);
  assert.match(note, /## Trap Table/i);
  assert.match(note, /## Flowchart/i);
  assert.match(note, /## Solved Examples/i);
  assert.match(note, /## PYQ Mapping/i);
});
```

- [ ] **Step 2: Write the failing test for the authoring command**

```ts
test("SSC CGL DeepSeek note author prepares one-topic dry-run packets", () => {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "ssc-cgl-deepseek-note-"));
  execFileSync("python", [
    scriptPath,
    "--topic", "percentages-ratio",
    "--output", path.join(tempRoot, "percentages-ratio.md"),
    "--audit-root", tempRoot,
    "--dry-run"
  ], { cwd: process.cwd(), stdio: "pipe" });
  const packet = fs.readFileSync(path.join(tempRoot, "percentages-ratio.deepseek-prompt.txt"), "utf8");
  assert.match(packet, /SSC CGL Tier-I 200\/200/i);
  assert.match(packet, /Do not copy paid books/i);
  assert.match(packet, /strict markdown/i);
});
```

- [ ] **Step 3: Run test to verify it fails**

Run: `npm test -- tests/ssc-cgl-deepseek-notes.test.ts`

Expected: failure because `scripts/ssc_cgl_deepseek_note_author.py` does not exist and the current note is not DeepSeek-authored.

### Task 2: Authoring Harness

**Files:**
- Create: `scripts/ssc_cgl_deepseek_note_author.py`
- Modify: `README.md`
- Modify: `.env.example`

- [ ] **Step 1: Implement minimal script**

The script must accept `--topic`, `--output`, `--audit-root`, and `--dry-run`. In dry run it writes the prompt packet and a JSON report without touching DeepSeek.

- [ ] **Step 2: Run test to verify it passes**

Run: `npm test -- tests/ssc-cgl-deepseek-notes.test.ts`

Expected: note contract still fails until the note is generated, but dry-run command passes.

### Task 3: Generate First Note

**Files:**
- Modify: `docs/ssc-cgl/quant/percentages-ratio.md`
- Create: `data/exams/ssc-cgl/deep-notes/percentages-ratio/authoring-report.json`
- Create: `data/exams/ssc-cgl/deep-notes/percentages-ratio/percentages-ratio.deepseek-prompt.txt`

- [ ] **Step 1: Run DeepSeek for one topic**

Run: `python scripts/ssc_cgl_deepseek_note_author.py --topic percentages-ratio --output docs/ssc-cgl/quant/percentages-ratio.md --audit-root data/exams/ssc-cgl/deep-notes/percentages-ratio`

Expected: markdown note includes concept ladder, type system, speed methods, trap table, flowchart, solved examples, and PYQ mapping.

- [ ] **Step 2: Verify the note contract**

Run: `npm test -- tests/ssc-cgl-deepseek-notes.test.ts`

Expected: pass.

### Task 4: Full Validation

**Files:**
- No new files.

- [ ] **Step 1: Run full tests**

Run: `npm test`

Expected: all tests pass.

- [ ] **Step 2: Run lint**

Run: `npm run lint`

Expected: exit 0.

- [ ] **Step 3: Run typecheck**

Run: `npm run typecheck`

Expected: exit 0.

- [ ] **Step 4: Run production build**

Run: `npm run build`

Expected: build completes and generated content includes the upgraded SSC CGL note.
