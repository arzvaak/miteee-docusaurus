import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { getSscQuantBook, getSscQuantBookChapter, sscQuantBookPracticeHref } from "@/lib/ssc-quant-book";

const root = process.cwd();

test("SSC Quant book loader has a safe empty state and stable public helpers", () => {
  const book = getSscQuantBook();
  assert.ok(Array.isArray(book.chapters));
  assert.equal(getSscQuantBookChapter("does-not-exist"), null);
  assert.equal(sscQuantBookPracticeHref("number-system"), "/exams/ssc-cgl/subjects/quantitative-aptitude/chapters/number-system/practice");
});

test("SSC Quant book surfaces use the PDF chapter hierarchy", () => {
  const files = [
    "lib/ssc-quant-book.ts",
    "components/SscQuantBookDirectory.tsx",
    "components/SscQuantBookChapterReader.tsx",
    "components/SscQuantBookPracticeClient.tsx",
    "components/SscQuantBookStimulus.tsx",
    "components/SscQuantBook.module.css",
    "app/exams/ssc-cgl/subjects/[section]/chapters/page.tsx",
    "app/exams/ssc-cgl/subjects/[section]/chapters/[slug]/page.tsx",
    "app/exams/ssc-cgl/subjects/[section]/chapters/[slug]/practice/page.tsx"
  ];
  for (const file of files) assert.ok(fs.existsSync(path.join(root, file)), `${file} should exist`);
  const loader = fs.readFileSync(path.join(root, "lib/ssc-quant-book.ts"), "utf8");
  const practice = fs.readFileSync(path.join(root, "components/SscQuantBookPracticeClient.tsx"), "utf8");
  const reader = fs.readFileSync(path.join(root, "components/SscQuantBookChapterReader.tsx"), "utf8");
  assert.match(loader, /data.*exams.*ssc-cgl.*quant-book.*index\.json/);
  assert.match(loader, /pdfPageStart/);
  assert.match(loader, /pdfPageEnd/);
  assert.match(loader, /workedExamples/);
  assert.match(practice, /localStorage/);
  assert.match(practice, /Reveal answer key only/);
  assert.doesNotMatch(practice, /Show full solution|answerKeyOnly/);
  assert.match(reader, /Reveal worked solution/);
  assert.match(reader, /SscQuantBookStimulus/);
  assert.match(reader, /example\.options/);
});

test("SSC Quant stimuli include semantic tables and accessible native SVG paths", () => {
  const stimulus = fs.readFileSync(path.join(root, "components/SscQuantBookStimulus.tsx"), "utf8");
  assert.match(stimulus, /<table>/);
  assert.match(stimulus, /scope="col"/);
  assert.match(stimulus, /role="img"/);
  assert.match(stimulus, /aria-label=\{stimulus\.ariaLabel\}/);
  assert.match(stimulus, /<polyline/);
  assert.match(stimulus, /strokeDasharray/);
  assert.match(stimulus, /markerEnd/);
});

test("SSC Quant source visuals survive generated content rebuilds", () => {
  const builder = fs.readFileSync(path.join(root, "scripts/build-content-data.ts"), "utf8");
  const extractor = fs.readFileSync(path.join(root, "scripts/ssc_cgl_quant_book_extract.py"), "utf8");
  assert.match(builder, /copySscQuantAssets/);
  assert.match(builder, /data.*exams.*ssc-cgl.*quant-book.*assets/);
  assert.match(extractor, /data\/exams\/ssc-cgl\/quant-book\/assets/);
});
