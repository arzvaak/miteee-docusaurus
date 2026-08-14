import assert from "node:assert/strict";
import test from "node:test";
import { buildFormulaReaderSignal } from "../lib/note-reader-signals";

test("formula reader signal is absent for notes without math", () => {
  assert.equal(buildFormulaReaderSignal({
    codeBlocks: 0,
    details: 0,
    mathBlocks: 0,
    mermaidBlocks: 0,
    questionBlocks: 4
  }), null);
});

test("formula reader signal turns math-heavy pages into an active recall loop", () => {
  const signal = buildFormulaReaderSignal({
    codeBlocks: 0,
    details: 2,
    mathBlocks: 32,
    mermaidBlocks: 0,
    questionBlocks: 0
  });

  assert.equal(signal?.tone, "formula");
  assert.equal(signal?.title, "Formula practice");
  assert.match(signal?.summary ?? "", /important formulas/i);
  assert.doesNotMatch(signal?.summary ?? "", /math blocks?|active reconstruction/i);
  assert.match(signal?.steps[0] ?? "", /write the symbols and conditions/i);
  assert.match(signal?.steps[2] ?? "", /log the exact rule/i);
});

test("formula reader signal escalates PYQ formula banks", () => {
  const signal = buildFormulaReaderSignal({
    codeBlocks: 0,
    details: 14,
    mathBlocks: 3090,
    mermaidBlocks: 0,
    questionBlocks: 141
  });

  assert.equal(signal?.tone, "pyq-formula");
  assert.equal(signal?.title, "Formula and question practice");
  assert.match(signal?.summary ?? "", /small set of formulas and questions/i);
  assert.doesNotMatch(signal?.summary ?? "", /math blocks?|question sections?/i);
  assert.match(signal?.steps[0] ?? "", /five formulas/i);
});
