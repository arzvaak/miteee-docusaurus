import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import katex from "katex";

const subjectRoot = path.join(process.cwd(), "docs", "sem5", "psa");

function weekPath(week: number) {
  return path.join(subjectRoot, `week-${week}.md`);
}

function markdownMetric(content: string) {
  return {
    words: [...content.matchAll(/\b[\w'-]+\b/g)].length,
    mermaid: [...content.matchAll(/```mermaid\b/gi)].length,
    tables: [...content.matchAll(/^\s*\|?\s*:?-{3,}.*\|/gm)].length,
    examples: [...content.matchAll(/^(?:#{2,4}\s+|\*\*).*Worked Example/gim)].length,
    answers: [...content.matchAll(/^> Answer and explanation\s*$/gim)].length,
    images: [...content.matchAll(/!\[[^\]]*\]\([^)]+\)/g)].length,
  };
}

function mathSpans(content: string) {
  const text = content.replace(/```[\s\S]*?```/g, "");
  const spans: Array<{ tex: string; displayMode: boolean }> = [];
  let index = 0;
  while (index < text.length) {
    const start = text.indexOf("$", index);
    if (start === -1) break;
    if (start > 0 && text[start - 1] === "\\") {
      index = start + 1;
      continue;
    }
    const displayMode = text.startsWith("$$", start);
    const delimiter = displayMode ? "$$" : "$";
    const end = text.indexOf(delimiter, start + delimiter.length);
    assert.notEqual(end, -1, `unclosed ${displayMode ? "display" : "inline"} math near character ${start}`);
    const tex = text.slice(start + delimiter.length, end).trim();
    if (tex) spans.push({ tex, displayMode });
    index = end + delimiter.length;
  }
  return spans;
}

test("SEM5 PSA provides an overview and twelve complete weekly notes", () => {
  assert.ok(fs.existsSync(path.join(subjectRoot, "overview.md")));
  for (let week = 1; week <= 12; week += 1) {
    const content = fs.readFileSync(weekPath(week), "utf8");
    const metric = markdownMetric(content);
    assert.match(content, new RegExp(`title: "Week ${week} -`));
    assert.ok(metric.words >= 12000, `Week ${week} has only ${metric.words} words`);
    assert.ok(metric.mermaid >= 4, `Week ${week} has only ${metric.mermaid} Mermaid diagrams`);
    assert.ok(metric.tables >= 8, `Week ${week} has only ${metric.tables} tables`);
    assert.ok(metric.examples >= 5, `Week ${week} has only ${metric.examples} worked examples`);
    assert.equal(metric.answers, 18, `Week ${week} answer-block count`);
    assert.equal(metric.images, 8, `Week ${week} verified source-image count`);
    assert.doesNotMatch(content, /!\[[^\]]*\]\(\/assets\//, `Week ${week} contains a broken root-relative asset link`);
    assert.match(content, /## Practice Quiz/);
    assert.match(content, /## Source Provenance/);
  }
});

test("SEM5 PSA local note and image links resolve", () => {
  const files = [path.join(subjectRoot, "overview.md"), ...Array.from({ length: 12 }, (_, index) => weekPath(index + 1))];
  for (const file of files) {
    const content = fs.readFileSync(file, "utf8");
    for (const match of content.matchAll(/!?\[[^\]]*\]\(([^)]+)\)/g)) {
      const target = match[1]?.split(/[?#]/, 1)[0] || "";
      if (!target || /^(?:https?:|#|\/)/.test(target)) continue;
      assert.ok(fs.existsSync(path.resolve(path.dirname(file), target)), `${file} has a broken link to ${target}`);
    }
  }
});

test("SEM5 PSA KaTeX expressions compile", () => {
  let total = 0;
  for (let week = 1; week <= 12; week += 1) {
    const content = fs.readFileSync(weekPath(week), "utf8");
    for (const span of mathSpans(content)) {
      total += 1;
      assert.doesNotThrow(() => katex.renderToString(span.tex, {
        displayMode: span.displayMode,
        throwOnError: true,
        strict: false,
      }), `Week ${week} invalid KaTeX: ${span.tex.slice(0, 160)}`);
    }
  }
  assert.ok(total > 500, `expected a substantial formula set, found ${total}`);
});

test("PSA generation pipeline pins the requested models and lecture-safe source map", () => {
  const pipeline = fs.readFileSync(path.join(process.cwd(), "scripts", "psa_course_pipeline.py"), "utf8");
  assert.match(pipeline, /MISTRAL_MODEL = "mistral-ocr-4-0"/);
  assert.match(pipeline, /DEEPSEEK_MODEL = "deepseek-v4-flash"/);
  assert.match(pipeline, /DEEPSEEK_MAX_TOKENS = 384000/);
  assert.match(pipeline, /"thinking": \{"type": "disabled"\}/);
  assert.match(pipeline, /WEEK_LECTURES/);
  assert.match(pipeline, /60: \(1085, 1107\)/);
});
