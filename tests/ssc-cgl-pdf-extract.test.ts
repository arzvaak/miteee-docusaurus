import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";
import test from "node:test";

const scriptPath = path.join(process.cwd(), "scripts", "ssc_cgl_pdf_extract.py");

test("SSC CGL PDF extractor creates OCR review artifacts from plain-text fixtures", () => {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "ssc-cgl-pdf-extract-"));
  const sourceFile = path.join(tempRoot, "fixture.pdf");
  const outputRoot = path.join(tempRoot, "ocr-review");
  fs.writeFileSync(sourceFile, [
    "SSC CGL Tier-I fixture",
    "Question 1. What is the full form of SSC?",
    "(a) Staff Selection Commission",
    "(b) State Service Council",
    "Answer: a"
  ].join("\n"));

  execFileSync("python", [
    scriptPath,
    sourceFile,
    "--source-id", "fixture-official",
    "--source-type", "official_open",
    "--source-url", "https://ssc.gov.in/example.pdf",
    "--output-root", outputRoot,
    "--allow-plain-text-fixture"
  ], { cwd: process.cwd(), stdio: "pipe" });

  const reportPath = path.join(outputRoot, "fixture-official", "extraction-report.json");
  const textPath = path.join(outputRoot, "fixture-official", "pages", "page-001.txt");
  const report = JSON.parse(fs.readFileSync(reportPath, "utf8")) as {
    sourceId: string;
    sourceType: string;
    pageCount: number;
    extractionStatus: string;
    reviewStatus: string;
    questionSignals: number;
    ocrRequired: boolean;
    pages: Array<{ pageNumber: number; textPath: string; charCount: number }>;
  };

  assert.equal(report.sourceId, "fixture-official");
  assert.equal(report.sourceType, "official_open");
  assert.equal(report.pageCount, 1);
  assert.equal(report.extractionStatus, "text_extracted");
  assert.equal(report.reviewStatus, "needs_segmentation_review");
  assert.ok(report.questionSignals >= 1);
  assert.equal(report.ocrRequired, false);
  assert.equal(report.pages[0]?.pageNumber, 1);
  assert.ok(report.pages[0]?.charCount > 20);
  assert.match(fs.readFileSync(textPath, "utf8"), /Question 1/);
});

test("SSC CGL PDF extractor sends skeleton web-paper text to OCR review", () => {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "ssc-cgl-pdf-skeleton-"));
  const sourceFile = path.join(tempRoot, "web-paper.pdf");
  const outputRoot = path.join(tempRoot, "ocr-review");
  fs.writeFileSync(sourceFile, [
    "Exam Level :",
    "Test Date : 23 Sep 2025",
    "Click Here for PART-A Click Here for PART-B",
    "PART-A (General Intelligence and Reasoning)",
    "Click Here to Challenge Question No.: 1",
    "Q.No: 1",
    "Click Here to Challenge Question No.: 2",
    "Q.No: 2",
    "SSC CGL Tier 1"
  ].join("\n"));

  execFileSync("python", [
    scriptPath,
    sourceFile,
    "--source-id", "web-skeleton",
    "--source-type", "web_pdf_unverified",
    "--source-url", "https://example.com/web-paper.pdf",
    "--output-root", outputRoot,
    "--allow-plain-text-fixture"
  ], { cwd: process.cwd(), stdio: "pipe" });

  const reportPath = path.join(outputRoot, "web-skeleton", "extraction-report.json");
  const report = JSON.parse(fs.readFileSync(reportPath, "utf8")) as {
    extractionStatus: string;
    reviewStatus: string;
    ocrRequired: boolean;
    warnings: string[];
  };

  assert.equal(report.extractionStatus, "ocr_required");
  assert.equal(report.reviewStatus, "needs_ocr");
  assert.equal(report.ocrRequired, true);
  assert.match(report.warnings.join(" "), /skeleton/i);
});

test("SSC CGL PDF extractor dependencies are declared", () => {
  const requirements = fs.readFileSync(path.join(process.cwd(), "requirements-ssc.txt"), "utf8");

  assert.match(requirements, /pypdf/i);
});
