import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";
import test from "node:test";

const scriptPath = path.join(process.cwd(), "scripts", "ssc_cgl_align_ocr_book_answers.py");

test("SSC CGL OCR answer aligner extracts Mistral solution markers and keeps rows review-only", () => {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "ssc-cgl-ocr-answer-align-"));
  const sourceRoot = path.join(tempRoot, "book-ocr", "ssc-maths-6800-mcq-ocr-range-p0021-p0040");
  const pagesRoot = path.join(sourceRoot, "pages-ocr");
  const segmentsRoot = path.join(tempRoot, "book-segments-mistral", "ssc-maths-6800-mcq", "ocr-range-p0021-p0040-p021-p040");
  const outputRoot = path.join(tempRoot, "aligned-mistral", "ssc-maths-6800-mcq", "ocr-range-p0021-p0040-p021-p040");
  fs.mkdirSync(pagesRoot, { recursive: true });
  fs.mkdirSync(segmentsRoot, { recursive: true });

  const questionPage = path.join(pagesRoot, "page-021.txt");
  const solutionPage = path.join(pagesRoot, "page-032.txt");
  fs.writeFileSync(questionPage, [
    "**Q.227.** (8^6 + 1) when divided by 7 leaves:",
    "(a) 1 (b) 4 (c) 2 (d) 6",
    "",
    "**Q.228.** The sum of digits is 9. Find the number.",
    "(a) 63 (b) 36 (c) 54 (d) 45",
    "",
    "**Q.229.** This row has no solution marker in the OCR chunk.",
    "(a) A (b) B (c) C (d) D"
  ].join("\n"));
  fs.writeFileSync(solutionPage, [
    "# **Sol:226.(a)** Colon marker style used in English cloze solutions.",
    "**Sol.227.(c)** $\\frac{(8^6 + 1)}{7}$ leaves 2.",
    "",
    "**Sol.228.** (b) Let the number be 10x + y; reversing increases by 27.",
    "",
    "**Sol 230.**(d) Space marker style used in OCR text."
  ].join("\n"));

  fs.writeFileSync(path.join(sourceRoot, "extraction-report.json"), JSON.stringify({
    sourceId: "ssc-maths-6800-mcq",
    sourceType: "book_user_provided",
    chapterSlug: "ocr-range-p0021-p0040",
    chapterTitle: "ssc-maths-6800-mcq-p0021-p0040",
    startPage: 21,
    endPage: 40,
    pages: [
      { pageNumber: 21, textPath: questionPage, charCount: 240, questionSignals: 3, extractionMethod: "mistral_ocr" },
      { pageNumber: 32, textPath: solutionPage, charCount: 150, questionSignals: 2, extractionMethod: "mistral_ocr" }
    ]
  }, null, 2));

  fs.writeFileSync(path.join(segmentsRoot, "question-candidates.json"), JSON.stringify([
    {
      id: "candidate-227",
      sourceId: "ssc-maths-6800-mcq",
      sourceType: "book_user_provided",
      pageNumber: 21,
      questionNumber: "227",
      stem: "(8^6 + 1) when divided by 7 leaves:",
      options: [
        { id: "a", text: "1" },
        { id: "b", text: "4" },
        { id: "c", text: "2" },
        { id: "d", text: "6" }
      ],
      answerKeyCandidate: null,
      reviewStatus: "needs_answer_key_review",
      rankedEligible: false
    },
    {
      id: "candidate-228",
      sourceId: "ssc-maths-6800-mcq",
      sourceType: "book_user_provided",
      pageNumber: 21,
      questionNumber: "228",
      stem: "The sum of digits is 9. Find the number.",
      options: [
        { id: "a", text: "63" },
        { id: "b", text: "36" },
        { id: "c", text: "54" },
        { id: "d", text: "45" }
      ],
      answerKeyCandidate: null,
      reviewStatus: "needs_answer_key_review",
      rankedEligible: false
    },
    {
      id: "candidate-229",
      sourceId: "ssc-maths-6800-mcq",
      sourceType: "book_user_provided",
      pageNumber: 21,
      questionNumber: "229",
      stem: "This row has no solution marker in the OCR chunk.",
      options: [
        { id: "a", text: "A" },
        { id: "b", text: "B" },
        { id: "c", text: "C" },
        { id: "d", text: "D" }
      ],
      answerKeyCandidate: null,
      reviewStatus: "needs_answer_key_review",
      rankedEligible: false
    },
    {
      id: "candidate-230",
      sourceId: "ssc-maths-6800-mcq",
      sourceType: "book_user_provided",
      pageNumber: 21,
      questionNumber: "230",
      stem: "This row uses a solution marker without a dot after Sol.",
      options: [
        { id: "a", text: "A" },
        { id: "b", text: "B" },
        { id: "c", text: "C" },
        { id: "d", text: "D" }
      ],
      answerKeyCandidate: null,
      reviewStatus: "needs_answer_key_review",
      rankedEligible: false
    }
  ], null, 2));

  execFileSync("python", [
    scriptPath,
    "--candidates", path.join(segmentsRoot, "question-candidates.json"),
    "--extraction-report", path.join(sourceRoot, "extraction-report.json"),
    "--output-root", outputRoot
  ], { cwd: process.cwd(), stdio: "pipe" });

  const aligned = JSON.parse(fs.readFileSync(path.join(outputRoot, "aligned-candidates.json"), "utf8")) as Array<{
    questionNumber: string;
    correctOption: string | null;
    alignmentStatus: string;
    reviewStatus: string;
    rankedEligible: boolean;
    answerEvidence?: { sourceType: string; pageNumber: number };
  }>;
  const report = JSON.parse(fs.readFileSync(path.join(outputRoot, "ocr-answer-alignment-report.json"), "utf8")) as {
    totalCandidates: number;
    extractedAnswers: number;
    matched: number;
    missing: number;
    rankedEligible: boolean;
  };

  assert.equal(report.totalCandidates, 4);
  assert.equal(report.extractedAnswers, 4);
  assert.equal(report.matched, 3);
  assert.equal(report.missing, 1);
  assert.equal(report.rankedEligible, false);
  assert.deepEqual(aligned.map((row) => row.correctOption), ["c", "b", null, "d"]);
  assert.equal(aligned[0]?.alignmentStatus, "matched");
  assert.equal(aligned[0]?.reviewStatus, "needs_topic_duplicate_review");
  assert.equal(aligned[0]?.rankedEligible, false);
  assert.equal(aligned[0]?.answerEvidence?.sourceType, "mistral_ocr_solution_marker");
  assert.equal(aligned[0]?.answerEvidence?.pageNumber, 32);
});
