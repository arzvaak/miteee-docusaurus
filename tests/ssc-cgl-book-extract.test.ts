import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";
import test from "node:test";

const root = process.cwd();
const scriptPath = path.join(root, "scripts", "ssc_cgl_book_extract.py");

test("SSC CGL book extractor writes only the selected uploaded-book page range", () => {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "ssc-cgl-book-extract-"));
  const sourceFile = path.join(tempRoot, "fixture-book.pdf");
  const manifestPath = path.join(tempRoot, "manifest.json");
  const outputRoot = path.join(tempRoot, "book-review");

  fs.writeFileSync(sourceFile, [
    "Cover page",
    "Number System Concepts\nQ.1. Which number is prime?\n(a) 4 (b) 6 (c) 7 (d) 9",
    "Number System More Questions\nQ.2. Which number is even?\n(a) 3 (b) 5 (c) 8 (d) 11"
  ].join("\f"));
  fs.writeFileSync(manifestPath, JSON.stringify({
    corpusPolicy: {
      replaceExistingMcqs: true,
      oldCorpusStatus: "disabled",
      activeQuestionSourceType: "book_user_provided",
      notesProvider: "deepseek",
      ocrProvider: "mistral",
      ocrModel: "mistral-ocr-latest",
      includeImages: true
    },
    sources: [{
      id: "fixture-book",
      title: "Fixture SSC Maths Book",
      file: sourceFile,
      sourceType: "book_user_provided",
      role: "mcq_corpus",
      section: "quantitative-aptitude",
      pageCount: 3,
      sha256: "fixture",
      ocrModel: "mistral-ocr-latest",
      includeImages: true
    }]
  }, null, 2));

  execFileSync("python", [
    scriptPath,
    "--source-id", "fixture-book",
    "--chapter-slug", "number-system",
    "--chapter-title", "Number System",
    "--start-page", "2",
    "--end-page", "3",
    "--manifest-path", manifestPath,
    "--output-root", outputRoot,
    "--allow-plain-text-fixture"
  ], { cwd: root, stdio: "pipe" });

  const reportPath = path.join(outputRoot, "fixture-book", "number-system-p002-p003", "extraction-report.json");
  const report = JSON.parse(fs.readFileSync(reportPath, "utf8")) as {
    sourceId: string;
    sourceType: string;
    chapterSlug: string;
    pageCount: number;
    sourcePageCount: number;
    extractionStatus: string;
    reviewStatus: string;
    rankedEligible: boolean;
    ocrRequired: boolean;
    ocrModel: string;
    includeImages: boolean;
    pages: Array<{ pageNumber: number; textPath: string; extractionMethod: string; questionSignals: number }>;
    warnings: string[];
  };

  assert.equal(report.sourceId, "fixture-book");
  assert.equal(report.sourceType, "book_user_provided");
  assert.equal(report.chapterSlug, "number-system");
  assert.equal(report.pageCount, 2);
  assert.equal(report.sourcePageCount, 3);
  assert.equal(report.extractionStatus, "text_extracted");
  assert.equal(report.reviewStatus, "needs_segmentation_review");
  assert.equal(report.rankedEligible, false);
  assert.equal(report.ocrRequired, false);
  assert.equal(report.ocrModel, "mistral-ocr-latest");
  assert.equal(report.includeImages, true);
  assert.deepEqual(report.pages.map((page) => page.pageNumber), [2, 3]);
  assert.ok(report.pages.every((page) => page.extractionMethod === "plain_text_fixture"));
  assert.ok(report.pages.every((page) => page.questionSignals >= 1));
  assert.match(report.warnings.join(" "), /review-only/i);
  assert.match(fs.readFileSync(report.pages[0]!.textPath, "utf8"), /Which number is prime/);
});

test("SSC CGL book extractor queues empty uploaded-book ranges for Mistral OCR", () => {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "ssc-cgl-book-extract-empty-"));
  const sourceFile = path.join(tempRoot, "scan-fixture.pdf");
  const manifestPath = path.join(tempRoot, "manifest.json");
  const outputRoot = path.join(tempRoot, "book-review");

  fs.writeFileSync(sourceFile, "\f\f");
  fs.writeFileSync(manifestPath, JSON.stringify({
    corpusPolicy: { ocrModel: "mistral-ocr-latest", includeImages: true },
    sources: [{
      id: "scan-book",
      title: "Scanned Fixture Book",
      file: sourceFile,
      sourceType: "book_user_provided",
      role: "static_gk_reference",
      section: "general-awareness",
      pageCount: 3,
      ocrModel: "mistral-ocr-latest",
      includeImages: true
    }]
  }, null, 2));

  execFileSync("python", [
    scriptPath,
    "--source-id", "scan-book",
    "--chapter-slug", "lucent-scan",
    "--chapter-title", "Lucent Scan",
    "--start-page", "1",
    "--end-page", "3",
    "--manifest-path", manifestPath,
    "--output-root", outputRoot,
    "--allow-plain-text-fixture"
  ], { cwd: root, stdio: "pipe" });

  const report = JSON.parse(fs.readFileSync(
    path.join(outputRoot, "scan-book", "lucent-scan-p001-p003", "extraction-report.json"),
    "utf8"
  )) as { extractionStatus: string; reviewStatus: string; ocrRequired: boolean; warnings: string[] };

  assert.equal(report.extractionStatus, "ocr_required");
  assert.equal(report.reviewStatus, "needs_ocr");
  assert.equal(report.ocrRequired, true);
  assert.match(report.warnings.join(" "), /mistral-ocr-latest/i);
});
