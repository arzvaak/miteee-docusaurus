import fs from "node:fs";
import path from "node:path";
import katex from "katex";

const root = process.cwd();
const files = [
  "docs/sem5/em2/pyq-answer-bank.md",
  "docs/sem5/em2/pyq-distinct-question-bank.md",
  "docs/sem5/em2/pyq-unique-question-bank.md",
  "docs/sem5/em2/theory-question-bank.md",
];

function scanMath(text) {
  const spans = [];
  let i = 0;
  while (i < text.length) {
    const displayStart = text.indexOf("$$", i);
    const inlineStart = text.indexOf("$", i);
    if (displayStart === -1 && inlineStart === -1) break;
    if (displayStart !== -1 && displayStart === inlineStart) {
      const end = text.indexOf("$$", displayStart + 2);
      if (end === -1) throw new Error("Unclosed display math block");
      spans.push({ tex: text.slice(displayStart + 2, end), displayMode: true });
      i = end + 2;
      continue;
    }
    if (inlineStart !== -1) {
      if (inlineStart > 0 && text[inlineStart - 1] === "\\") {
        i = inlineStart + 1;
        continue;
      }
      const end = text.indexOf("$", inlineStart + 1);
      if (end === -1) throw new Error("Unclosed inline math block");
      if (end > inlineStart + 1) {
        spans.push({ tex: text.slice(inlineStart + 1, end), displayMode: false });
      }
      i = end + 1;
      continue;
    }
    break;
  }
  return spans;
}

let failed = false;
for (const rel of files) {
  const text = fs.readFileSync(path.join(root, rel), "utf8");
  const spans = scanMath(text);
  let count = 0;
  for (const span of spans) {
    count += 1;
    try {
      katex.renderToString(span.tex, {
        displayMode: span.displayMode,
        throwOnError: true,
        strict: "error",
      });
    } catch (error) {
      failed = true;
      const before = text.slice(0, text.indexOf(span.tex));
      const line = before.split(/\r?\n/).length;
      console.error(`[ERR] ${rel}:${line}: ${error.message}`);
      console.error(span.tex.slice(0, 300).replace(/\s+/g, " "));
    }
  }
  console.log(`[OK] ${rel}: rendered ${count} KaTeX spans`);
}

if (failed) process.exit(1);
