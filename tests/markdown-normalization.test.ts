import assert from "node:assert/strict";
import test from "node:test";
import { normalizeCurrencyDollars, normalizeDocusaurusAdmonitions, normalizeMathForKatex, normalizeWikiLinks, prepareMarkdownContent } from "../lib/markdown-normalize";

test("normalizeMathForKatex escapes content that breaks KaTeX", () => {
  const output = normalizeMathForKatex("$$\\text{Loss} = 500 × ₹5 \\text{ lakh} = 40% + μ$$");

  assert.match(output, /\\times/);
  assert.match(output, /\\text\{Rs\.\}/);
  assert.match(output, /40\\%/);
  assert.match(output, /\\mu/);
  assert.doesNotMatch(output, /₹/);
});

test("normalizeMathForKatex leaves fenced code untouched", () => {
  const output = normalizeMathForKatex(["```js", "const tax = '40%';", "```", "$40%$"].join("\n"));

  assert.match(output, /const tax = '40%';/);
  assert.match(output, /\$40\\%\$/);
});

test("normalizeCurrencyDollars protects money from the math parser", () => {
  const output = normalizeCurrencyDollars("• Year 1: $50,000, to buy equipment; actual math stays $H$ and $40\\%$.");

  assert.match(output, /&#36;50,000/);
  assert.match(output, /\$H\$/);
  assert.match(output, /\$40\\%\$/);
});

test("normalizeCurrencyDollars keeps equation-leading inline math intact", () => {
  const output = normalizeCurrencyDollars("Slots per pole $= \\frac{72}{6}=12$.");

  assert.equal(output, "Slots per pole $= \\frac{72}{6}=12$.");
});

test("normalizeCurrencyDollars keeps numeric engineering math intact", () => {
  const output = normalizeCurrencyDollars("Rise $0.89%$ and resistance $1.2,\\Omega$; spend $50,000, to buy equipment.");

  assert.match(output, /\$0\.89%\$/);
  assert.match(output, /\$1\.2,\\Omega\$/);
  assert.match(output, /&#36;50,000/);
});

test("normalizeDocusaurusAdmonitions converts old admonition blocks", () => {
  const output = normalizeDocusaurusAdmonitions([":::tip[Quick recall]", "Read this first.", ":::"].join("\n"));

  assert.match(output, /> \*\*Tip: Quick recall\*\*/);
  assert.match(output, /> Read this first\./);
});

test("prepareMarkdownContent normalizes details, admonitions, and math together", () => {
  const output = prepareMarkdownContent(["<details><summary>Answer</summary>", "$40%$", "</details>", "", ":::warning", "Check ₹", ":::"].join("\n"));

  assert.match(output, /> \*\*Answer\*\*/);
  assert.match(output, /\$40\\%\$/);
  assert.match(output, /> \*\*Warning\*\*/);
});

test("normalizeWikiLinks turns note aliases into previewable markdown links", () => {
  const output = normalizeWikiLinks("Revise [[Week 1 Transformers|transformer basics]], [[SEM5 EM2 Overview]], and keep code `[[not a link]]`.");

  assert.match(output, /\[transformer basics\]\(Week 1 Transformers\)/);
  assert.match(output, /\[SEM5 EM2 Overview\]\(SEM5 EM2 Overview\)/);
  assert.match(output, /`\[\[not a link\]\]`/);
});
