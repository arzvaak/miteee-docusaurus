import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";
import test from "node:test";

const scriptPath = path.join(process.cwd(), "scripts", "ssc_cgl_mistral_ocr.py");

test("SSC CGL Mistral OCR runner converts OCR markdown into review-only extraction pages", () => {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "ssc-cgl-mistral-ocr-"));
  const sourceRoot = path.join(tempRoot, "ocr-review", "web-paper");
  const sourcePdf = path.join(tempRoot, "paper.pdf");
  const rawResponsePath = path.join(tempRoot, "mistral-response.json");
  fs.mkdirSync(sourceRoot, { recursive: true });
  fs.writeFileSync(sourcePdf, "%PDF-1.4\n% image-only fixture\n");
  fs.writeFileSync(path.join(sourceRoot, "extraction-report.json"), JSON.stringify({
    sourceId: "web-paper",
    sourceType: "web_pdf_unverified",
    sourceFile: sourcePdf,
    sourceUrl: "https://example.com/web-paper.pdf",
    sha256: "old",
    extractedAt: "2026-06-26T00:00:00+00:00",
    pageCount: 1,
    extractionStatus: "ocr_required",
    reviewStatus: "needs_ocr",
    ocrRequired: true,
    questionSignals: 0,
    pages: [],
    warnings: ["OCR required"]
  }, null, 2));
  fs.writeFileSync(rawResponsePath, JSON.stringify({
    pages: [
      {
        index: 0,
        markdown: [
          "Q.No: 1",
          "Which number comes next in the series 2, 4, 8, 16?",
          "(a) 24",
          "(b) 30",
          "(c) 32",
          "(d) 36",
          "Correct Answer: c"
        ].join("\n"),
        images: []
      }
    ]
  }, null, 2));

  execFileSync("python", [
    scriptPath,
    "--extraction-report", path.join(sourceRoot, "extraction-report.json"),
    "--raw-response", rawResponsePath,
    "--output-root", path.join(tempRoot, "ocr-review")
  ], { cwd: process.cwd(), stdio: "pipe" });

  const updatedReport = JSON.parse(fs.readFileSync(path.join(sourceRoot, "extraction-report.json"), "utf8")) as {
    sourceId: string;
    sourceType: string;
    extractionStatus: string;
    reviewStatus: string;
    ocrRequired: boolean;
    questionSignals: number;
    pages: Array<{ pageNumber: number; textPath: string; extractionMethod: string }>;
    warnings: string[];
  };
  const ocrReport = JSON.parse(fs.readFileSync(path.join(sourceRoot, "mistral-ocr-report.json"), "utf8")) as {
    provider: string;
    model: string;
    rankedEligible: boolean;
    outputExtractionReport: string;
  };

  assert.equal(updatedReport.sourceId, "web-paper");
  assert.equal(updatedReport.sourceType, "web_pdf_unverified");
  assert.equal(updatedReport.extractionStatus, "ocr_text_extracted");
  assert.equal(updatedReport.reviewStatus, "needs_segmentation_review");
  assert.equal(updatedReport.ocrRequired, false);
  assert.ok(updatedReport.questionSignals >= 1);
  assert.equal(updatedReport.pages.length, 1);
  assert.equal(updatedReport.pages[0]?.pageNumber, 1);
  assert.equal(updatedReport.pages[0]?.extractionMethod, "mistral_ocr");
  assert.match(fs.readFileSync(updatedReport.pages[0]!.textPath, "utf8"), /Which number comes next/);
  assert.match(updatedReport.warnings.join(" "), /not ranked/i);
  assert.equal(ocrReport.provider, "mistral");
  assert.equal(ocrReport.model, "mistral-ocr-latest");
  assert.equal(ocrReport.rankedEligible, false);
  assert.ok(ocrReport.outputExtractionReport.endsWith("extraction-report.json"));
});

test("SSC CGL Mistral OCR runner keeps uploaded-book chunks separate and preserves page numbers", () => {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "ssc-cgl-mistral-book-ocr-"));
  const sourcePdf = path.join(tempRoot, "maths-book.pdf");
  const rawResponsePath = path.join(tempRoot, "mistral-response.json");
  const extractionReportPath = path.join(tempRoot, "extraction-report.json");
  fs.writeFileSync(sourcePdf, "%PDF-1.4\n% selected-page fixture\n");
  fs.writeFileSync(extractionReportPath, JSON.stringify({
    sourceId: "ssc-maths-6800-mcq",
    sourceType: "book_user_provided",
    sourceFile: sourcePdf,
    title: "SSC Maths 6800 MCQ Book",
    role: "mcq_corpus",
    section: "quantitative-aptitude",
    chapterSlug: "linear-circular-race",
    chapterTitle: "Linear/Circular Race",
    sourcePageCount: 643,
    startPage: 422,
    endPage: 423,
    pageCount: 2,
    extractionStatus: "text_extracted",
    reviewStatus: "needs_segmentation_review",
    ocrRequired: false,
    questionSignals: 85,
    pages: [],
    warnings: ["Plain text segmentation missed candidates"]
  }, null, 2));
  fs.writeFileSync(rawResponsePath, JSON.stringify({
    pages: [
      {
        index: 0,
        markdown: "Q.No: 1\nRace question text\n(a) 10\n(b) 12\n(c) 14\n(d) 16",
        images: []
      },
      {
        index: 1,
        markdown: "Q.No: 2\nCircular track question text\n(a) 20\n(b) 24\n(c) 30\n(d) 36",
        images: []
      }
    ]
  }, null, 2));

  execFileSync("python", [
    scriptPath,
    "--extraction-report", extractionReportPath,
    "--raw-response", rawResponsePath,
    "--output-root", path.join(tempRoot, "ocr-review"),
    "--force"
  ], { cwd: process.cwd(), stdio: "pipe" });

  const chunkRoot = path.join(tempRoot, "ocr-review", "ssc-maths-6800-mcq-linear-circular-race-p422-p423");
  const updatedReport = JSON.parse(fs.readFileSync(path.join(chunkRoot, "extraction-report.json"), "utf8")) as {
    sourceId: string;
    sourceType: string;
    chapterSlug: string;
    startPage: number;
    endPage: number;
    pages: Array<{ pageNumber: number; textPath: string }>;
  };

  assert.equal(updatedReport.sourceId, "ssc-maths-6800-mcq");
  assert.equal(updatedReport.sourceType, "book_user_provided");
  assert.equal(updatedReport.chapterSlug, "linear-circular-race");
  assert.equal(updatedReport.startPage, 422);
  assert.equal(updatedReport.endPage, 423);
  assert.deepEqual(updatedReport.pages.map((page) => page.pageNumber), [422, 423]);
  assert.match(fs.readFileSync(updatedReport.pages[0]!.textPath, "utf8"), /Race question text/);
});

test("SSC CGL Mistral OCR dependency is declared", () => {
  const requirements = fs.readFileSync(path.join(process.cwd(), "requirements-ssc.txt"), "utf8");

  assert.match(requirements, /requests/i);
  assert.match(requirements, /pypdf/i);
});
