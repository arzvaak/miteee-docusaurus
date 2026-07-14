import assert from "node:assert/strict";
import test from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { MathText } from "../components/MathText";
import { CURRENCY_DOLLAR_PLACEHOLDER } from "../lib/markdown-normalize";

test("MathText renders legacy and bare formulas through KaTeX", () => {
  const legacy = renderToStaticMarkup(<MathText text={String.raw`Compute \( x^2 + 1 \).`} />);
  const standalone = renderToStaticMarkup(<MathText text={String.raw`\frac{12}{5} \quad`} />);

  assert.match(legacy, /class="katex"/);
  assert.doesNotMatch(legacy, /\\\(|\\\)/);
  assert.match(standalone, /class="katex"/);
  assert.match(standalone, /<mfrac>/);
});

test("MathText leaves ordinary text literal and does not enable raw HTML", () => {
  const ordinary = renderToStaticMarkup(<MathText text="Choose 12 < 15 & stay safe." />);
  const attemptedHtml = renderToStaticMarkup(<MathText text={'Safe $x$ and <script>alert(1)</script> <img src=x onerror=alert(2)>'} />);

  assert.equal(ordinary, "Choose 12 &lt; 15 &amp; stay safe.");
  assert.doesNotMatch(attemptedHtml, /<(?:script|img)\b/i);
  assert.match(attemptedHtml, /&lt;script&gt;|&lt;img/i);
  assert.match(attemptedHtml, /class="katex"/);
});

test("MathText restores protected currency beside rendered math", () => {
  const markup = renderToStaticMarkup(<MathText text={'Cost $50, then solve $x$.'} />);

  assert.match(markup, /Cost \$50, then solve/);
  assert.match(markup, /class="katex"/);
  assert.doesNotMatch(markup, new RegExp(CURRENCY_DOLLAR_PLACEHOLDER, "u"));
});
