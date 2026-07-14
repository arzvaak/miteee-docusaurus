import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { CURRENCY_DOLLAR_PLACEHOLDER, normalizeCurrencyDollars, normalizeDocusaurusAdmonitions, normalizeLegacyMathDelimiters, normalizeMathForKatex, normalizeStandaloneMathText, normalizeWikiLinks, prepareMarkdownContent } from "../lib/markdown-normalize";

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

test("normalizeMathForKatex keeps Unicode inside text commands and decodes comparison entities", () => {
  const output = normalizeMathForKatex("$I = 1\\text{ μA/°K}$ and $(3 &lt; r &lt; 6\\text{ mm})$");

  assert.match(output, /\\text\{ μA\/°K\}/);
  assert.match(output, /\$\(3 < r < 6\\text\{ mm\}\)\$/);
});

test("normalizeLegacyMathDelimiters converts MathJax notation without touching code", () => {
  const output = normalizeLegacyMathDelimiters([
    "Inline \\( X(k) = \\cos(\\pi k) \\) is rendered.",
    "\\[",
    "\\text{Multiplications} = \\frac{N}{2} \\log_2 N",
    "\\]",
    "Keep `\\(literal\\)` and:",
    "```tex",
    "\\[literal\\]",
    "```"
  ].join("\n"));

  assert.match(output, /\$X\(k\) = \\cos\(\\pi k\)\$/);
  assert.match(output, /\$\$\n\\text\{Multiplications\} = \\frac\{N\}\{2\} \\log_2 N\n\$\$/);
  assert.match(output, /`\\\(literal\\\)`/);
  assert.match(output, /```tex\n\\\[literal\\\]\n```/);
});

test("normalizeLegacyMathDelimiters preserves TeX line-break spacing and converts multiline legacy math", () => {
  const aligned = "$$\\begin{aligned} a \\\\[4pt] b \\end{aligned}$$";
  const multiline = ["\\(", "f(x) = \\begin{cases}x,&x>0\\\\0,&x\\le0\\end{cases}", "\\)"].join("\n");

  assert.equal(normalizeLegacyMathDelimiters(aligned), aligned);
  const output = normalizeLegacyMathDelimiters(multiline);
  assert.doesNotMatch(output, /(?<!\\)\\[()]/);
  assert.match(output, /\$\$[\s\S]*\\begin\{cases\}[\s\S]*\$\$/);
});

test("all DSP legacy math normalizes completely and idempotently", () => {
  const files = ["01-sampling.md", "02-dt-signals.md", "04-dft.md", "05-fft.md", "06-fir.md", "08-lpc.md", "09-multirate.md"];
  for (const file of files) {
    const source = fs.readFileSync(path.join(process.cwd(), "docs", "sem5", "dsp", file), "utf8");
    const normalized = normalizeLegacyMathDelimiters(source);
    const withoutCode = normalized
      .replace(/```[\s\S]*?```/g, "")
      .replace(/`[^`\n]+`/g, "");
    assert.doesNotMatch(withoutCode, /(?<!\\)\\[()[\]]/, file);
    assert.equal(normalizeLegacyMathDelimiters(normalized), normalized, file);
  }
});

test("prepareMarkdownContent removes legacy delimiters from the DSP reader path", () => {
  const output = prepareMarkdownContent("For \\( N = 32 \\):\n\\[ \\text{Multiplications} = 16 \\cdot 5 = 80 \\]");

  assert.doesNotMatch(output, /\\[()[\]]/);
  assert.match(output, /\$N = 32\$/);
  assert.match(output, /\$\$[\s\S]*\\text\{Multiplications\}[\s\S]*\$\$/);
});

test("normalizeStandaloneMathText wraps only balanced formula-only TeX", () => {
  assert.equal(normalizeStandaloneMathText("\\frac{12}{5} \\quad"), "$\\frac{12}{5} \\quad$");
  assert.equal(normalizeStandaloneMathText("\\sqrt{x^2 + 1}$"), "$\\sqrt{x^2 + 1}$");
  assert.equal(normalizeStandaloneMathText("\\frac{8}{5}$$"), "$\\frac{8}{5}$");
  assert.equal(normalizeStandaloneMathText("Use \\frac{12}{5} in the answer"), "Use \\frac{12}{5} in the answer");
  assert.equal(normalizeStandaloneMathText("the \\frac{12}{5}"), "the \\frac{12}{5}");
  assert.equal(normalizeStandaloneMathText("\\frac{12}{5} kg"), "\\frac{12}{5} kg");
  assert.equal(normalizeStandaloneMathText("C:\\tmp\\frac"), "C:\\tmp\\frac");
  assert.equal(normalizeStandaloneMathText("C:\\temp\\frac-not-math"), "C:\\temp\\frac-not-math");
});

test("normalizeCurrencyDollars protects money from the math parser", () => {
  const output = normalizeCurrencyDollars("• Year 1: $50,000, to buy equipment; actual math stays $H$ and $40\\%$.");

  assert.ok(output.includes(`${CURRENCY_DOLLAR_PLACEHOLDER}50,000`));
  assert.match(output, /\$H\$/);
  assert.match(output, /\$40\\%\$/);
});

test("normalizeCurrencyDollars keeps equation-leading inline math intact", () => {
  const output = normalizeCurrencyDollars("Slots per pole $= \\frac{72}{6}=12$.");

  assert.equal(output, "Slots per pole $= \\frac{72}{6}=12$.");
});

test("normalizeCurrencyDollars keeps numeric engineering math intact", () => {
  const output = normalizeCurrencyDollars("Rise $0.89%$, resistance $1.2,\\Omega$, ratio $2: 3\\sqrt{3}$, and compute $22\\cdot4 + 11\\cdot567 - 33\\cdot59$; spend $50,000, to buy equipment.");

  assert.match(output, /\$0\.89%\$/);
  assert.match(output, /\$1\.2,\\Omega\$/);
  assert.match(output, /\$2: 3\\sqrt\{3\}\$/);
  assert.match(output, /\$22\\cdot4 \+ 11\\cdot567 - 33\\cdot59\$/);
  assert.ok(output.includes(`${CURRENCY_DOLLAR_PLACEHOLDER}50,000`));
});

test("normalizeCurrencyDollars separates prose money markers without swallowing nearby math", () => {
  const output = normalizeCurrencyDollars([
    "Trade rose from $12 trillion to $100 billion while energy bids were $30/MWh, diesel $45/MWh, and storage $40/MWh.",
    "Math stays $0.89\\%$, $= \\frac{N}{2}$, and $1.2,\\Omega$; a range costs $500–$2,000."
  ].join("\n"));

  assert.doesNotMatch(output, /\$12 trillion[\s\S]*\$100 billion/);
  assert.ok(output.includes(`${CURRENCY_DOLLAR_PLACEHOLDER}12 trillion`));
  assert.ok(output.includes(`${CURRENCY_DOLLAR_PLACEHOLDER}100 billion`));
  assert.ok(output.includes(`${CURRENCY_DOLLAR_PLACEHOLDER}30/MWh`));
  assert.ok(output.includes(`${CURRENCY_DOLLAR_PLACEHOLDER}45/MWh`));
  assert.ok(output.includes(`${CURRENCY_DOLLAR_PLACEHOLDER}40/MWh`));
  assert.match(output, /\$0\.89\\%\$/);
  assert.match(output, /\$= \\frac\{N\}\{2\}\$/);
  assert.match(output, /\$1\.2,\\Omega\$/);
  assert.ok(output.includes(`${CURRENCY_DOLLAR_PLACEHOLDER}500–${CURRENCY_DOLLAR_PLACEHOLDER}2,000`));
});

test("normalizeCurrencyDollars protects TeX-wrapped money and cost-rate symbols", () => {
  const output = normalizeCurrencyDollars("Gift $\\$5,000$ and cost ($/h) stay money.");

  assert.ok(output.includes(`${CURRENCY_DOLLAR_PLACEHOLDER}5,000`));
  assert.ok(output.includes(`(${CURRENCY_DOLLAR_PLACEHOLDER}/h)`));
  assert.doesNotMatch(output, /\$\\\$5,000\$/);
});

test("normalizeCurrencyDollars never rewrites display-math delimiter pairs", () => {
  const display = "$$7(\\frac{\\text{cosec }x}{\\sec x})^3 -$$";

  assert.equal(normalizeCurrencyDollars(display), display);
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
