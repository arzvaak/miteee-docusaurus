import assert from "node:assert/strict";
import test from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import ReactMarkdown from "react-markdown";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import remarkMath from "remark-math";
import { prepareMarkdownContent } from "../lib/markdown-normalize";
import { rehypeRawMathText } from "../lib/rehype-raw-math-text";

function renderMarkdown(content: string) {
  return renderToStaticMarkup(
    <ReactMarkdown
      remarkPlugins={[remarkMath]}
      rehypePlugins={[rehypeRaw, rehypeRawMathText, [rehypeKatex, { strict: false, throwOnError: false, trust: false }]]}
    >
      {prepareMarkdownContent(content)}
    </ReactMarkdown>
  );
}

test("MarkdownNote renders math left inside raw HTML after rehypeRaw", () => {
  const markup = renderMarkdown('<div class="quiz-card"><p>Input $V_{in}$ and output $V_o$.</p><div>$$P = V I$$</div></div>');

  assert.equal((markup.match(/class="katex"/g) ?? []).length, 3);
  assert.doesNotMatch(markup, /\$V_|\$\$P/);
  assert.match(markup, /quiz-card/);
});

test("raw HTML math pass leaves prose, money, and code literal", () => {
  const markup = renderMarkdown('<div>$Select ALL that apply$; cost $50, then solve $x$ at $mW$ scale.</div><pre><code>$ignored$</code></pre>');

  assert.equal((markup.match(/class="katex"/g) ?? []).length, 2);
  assert.match(markup, /\$Select ALL that apply\$/);
  assert.match(markup, /\$50, then solve/);
  assert.match(markup, /\$ignored\$/);
});
