import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";
import test from "node:test";

const htmlExtractScriptPath = path.join(process.cwd(), "scripts", "ssc_cgl_html_extract.py");
const segmentScriptPath = path.join(process.cwd(), "scripts", "ssc_cgl_segment_questions.py");

test("SSC CGL HTML extractor converts solved-paper pages into review-only segmentation input", () => {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "ssc-cgl-html-extract-"));
  const htmlPath = path.join(tempRoot, "cracku-solved-paper.html");
  fs.writeFileSync(htmlPath, [
    "<html><head><title>SSC CGL Tier I 2023 Question Paper</title></head><body>",
    "<nav>Courses CAT MBA unrelated navigation</nav>",
    "<main>",
    "<h1>SSC CGL Tier I 2023 Question Paper Shift 1</h1>",
    "<section class='question'>",
    "<p>Q.1 Which number will replace the question mark in the series 4, 9, 19, 39, ?</p>",
    "<p>(a) 59</p>",
    "<p>(b) 69</p>",
    "<p>(c) 79</p>",
    "<p>(d) 89</p>",
    "<p>Correct Answer: c</p>",
    "<p>Explanation: The differences are doubled successively.</p>",
    "</section>",
    "<section class='question'>",
    "<p>2. Select the most appropriate synonym of 'abundant'.</p>",
    "<ol><li>(a) scarce</li><li>(b) plentiful</li><li>(c) narrow</li><li>(d) timid</li></ol>",
    "<p>Answer: b</p>",
    "</section>",
    "</main>",
    "<footer>Download app and subscribe</footer>",
    "</body></html>"
  ].join("\n"), "utf8");

  const ocrRoot = path.join(tempRoot, "ocr-review");
  execFileSync("python", [
    htmlExtractScriptPath,
    "--source-file", htmlPath,
    "--source-id", "cracku-ssc-cgl-2023-shift-1",
    "--source-type", "web_pdf_unverified",
    "--source-url", "https://cracku.in/ssc-cgl-tier-1-27th-july-2023-shift-1-question-paper-solved",
    "--output-root", ocrRoot
  ], { cwd: process.cwd(), stdio: "pipe" });

  const reportPath = path.join(ocrRoot, "cracku-ssc-cgl-2023-shift-1", "extraction-report.json");
  const report = JSON.parse(fs.readFileSync(reportPath, "utf8")) as {
    sourceId: string;
    sourceType: string;
    sourceUrl: string;
    extractionStatus: string;
    reviewStatus: string;
    questionSignals: number;
    pages: Array<{ textPath: string; extractionMethod: string }>;
    warnings: string[];
  };

  assert.equal(report.sourceId, "cracku-ssc-cgl-2023-shift-1");
  assert.equal(report.sourceType, "web_pdf_unverified");
  assert.equal(report.extractionStatus, "text_extracted");
  assert.equal(report.reviewStatus, "needs_segmentation_review");
  assert.ok(report.questionSignals >= 2);
  assert.equal(report.pages[0]?.extractionMethod, "html_text");
  assert.match(report.warnings.join(" "), /cannot enter ranked tests/i);

  const text = fs.readFileSync(report.pages[0]!.textPath, "utf8");
  assert.match(text, /Q\.1 Which number will replace/);
  assert.match(text, /\(c\) 79/);
  assert.doesNotMatch(text, /Courses CAT MBA/);

  const segmentsRoot = path.join(tempRoot, "segments");
  execFileSync("python", [
    segmentScriptPath,
    "--extraction-report", reportPath,
    "--output-root", segmentsRoot
  ], { cwd: process.cwd(), stdio: "pipe" });

  const candidates = JSON.parse(fs.readFileSync(path.join(segmentsRoot, "cracku-ssc-cgl-2023-shift-1", "question-candidates.json"), "utf8")) as Array<{
    questionNumber: string;
    stem: string;
    answerKeyCandidate: string | null;
    rankedEligible: boolean;
    sourceType: string;
  }>;

  assert.equal(candidates.length, 2);
  assert.equal(candidates[0]?.questionNumber, "1");
  assert.match(candidates[0]?.stem ?? "", /replace the question mark/i);
  assert.equal(candidates[0]?.answerKeyCandidate, "c");
  assert.equal(candidates[0]?.rankedEligible, false);
  assert.equal(candidates[0]?.sourceType, "web_pdf_unverified");
  assert.equal(candidates[1]?.answerKeyCandidate, "b");
});

test("SSC CGL HTML extractor is review-only and Scrapling-backed for live fetches", () => {
  const script = fs.readFileSync(htmlExtractScriptPath, "utf8");

  assert.match(script, /scrapling/i);
  assert.match(script, /ranked tests/i);
  assert.match(script, /needs_segmentation_review/);
  assert.doesNotMatch(script, /reviewStatus.*reviewed/s);
});

test("SSC CGL HTML extractor trims SSCPortal model-question boilerplate before segmentation", () => {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "sscportal-html-cleanup-"));
  const htmlPath = path.join(tempRoot, "sscportal-maths-set.html");
  fs.writeFileSync(htmlPath, [
    "<html><body>",
    "<header><h1>SSC PORTAL</h1></header>",
    "<main>",
    "<p>Home</p><p>PDF NOTES</p><p>SSC CGL Tier-1 PDF NOTES</p>",
    "<h1>Model Questions for SSC CGL TIER-1 (Maths) Set - 11</h1>",
    "<h1>Model Questions for SSC CGL TIER-1 (Maths) Set - 11</h1>",
    "<p>1. If A exceeds B by 40%, B is less than C by 20%, then A C is,:</p>",
    "<p>(a) 28 : 25</p><p>(b) 26 : 25</p><p>(c) 3 : 2</p><p>(d) 3 : 1</p>",
    "<p>(E-Book) SSC CGL (Tier-1) Exam Question Papers PDF</p>",
    "<p>Click Here for Study Material for SSC CGL Exam</p>",
    "<p>2. In a school 70% of the students are girls. The number of boys are 510.</p>",
    "<p>(a) 850</p><p>(b) 1700</p><p>(c) 1830</p><p>(d) 1900</p>",
    "<p>Answer:</p>",
    "<p>1. (a) 2. (b)</p>",
    "<p>SSC Combined Graduate Level Exam</p>",
    "<p>Daily Questions Challenge</p>",
    "<p>New! SSC CGL 10+ Years Papers</p>",
    "<p>Disclaimer: sscportal.in is not associated with Staff Selection Commission</p>",
    "</main>",
    "</body></html>"
  ].join("\n"), "utf8");

  const ocrRoot = path.join(tempRoot, "ocr-review");
  execFileSync("python", [
    htmlExtractScriptPath,
    "--source-file", htmlPath,
    "--source-id", "sscportal-cgl-model-questions-maths-set-11",
    "--source-type", "original_practice",
    "--source-url", "https://sscportal.in/cgl/tier-1/model-questions/maths-set-11",
    "--output-root", ocrRoot
  ], { cwd: process.cwd(), stdio: "pipe" });

  const reportPath = path.join(ocrRoot, "sscportal-cgl-model-questions-maths-set-11", "extraction-report.json");
  const report = JSON.parse(fs.readFileSync(reportPath, "utf8")) as {
    pages: Array<{ textPath: string }>;
    warnings: string[];
  };
  const text = fs.readFileSync(report.pages[0]!.textPath, "utf8");

  assert.match(text, /^Model Questions for SSC CGL TIER-1 \(Maths\) Set - 11/);
  assert.match(text, /1\. If A exceeds B by 40%/);
  assert.match(text, /Answer:\r?\n1\. \(a\) 2\. \(b\)/);
  assert.doesNotMatch(text, /PDF NOTES/);
  assert.doesNotMatch(text, /\(E-Book\)/);
  assert.doesNotMatch(text, /Click Here for Study Material/);
  assert.doesNotMatch(text, /Daily Questions Challenge/);
  assert.doesNotMatch(text, /Disclaimer:/);
  assert.match(report.warnings.join(" "), /SSCPortal model-question boilerplate/i);

  const segmentsRoot = path.join(tempRoot, "segments");
  execFileSync("python", [
    segmentScriptPath,
    "--extraction-report", reportPath,
    "--output-root", segmentsRoot
  ], { cwd: process.cwd(), stdio: "pipe" });

  const candidates = JSON.parse(fs.readFileSync(path.join(segmentsRoot, "sscportal-cgl-model-questions-maths-set-11", "question-candidates.json"), "utf8")) as Array<{
    questionNumber: string;
    stem: string;
  }>;

  assert.deepEqual(candidates.map((candidate) => candidate.questionNumber), ["1", "2"]);
  assert.ok(candidates.every((candidate) => !/Daily Questions|Disclaimer|Papers/.test(candidate.stem)));
});
