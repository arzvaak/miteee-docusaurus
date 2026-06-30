import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";
import test from "node:test";

const root = process.cwd();
const scriptPath = path.join(root, "scripts", "ssc_cgl_recover_book_answers.py");

function writeJson(filePath: string, value: unknown) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(value, null, 2) + "\n", "utf8");
}

function writeText(filePath: string, value: string) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, value, "utf8");
}

test("SSC CGL Maths chapter index covers the full Average OCR question and solution block", () => {
  const chapterIndexPath = path.join(root, "data", "exams", "ssc-cgl", "book-sources", "ssc-maths-6800-chapters.json");
  const payload = JSON.parse(fs.readFileSync(chapterIndexPath, "utf8")) as {
    printedToPdfPageOffset: number;
    chapters: Array<{
      slug: string;
      questionPrintedPages: [number, number];
      solutionPrintedPages: [number, number];
    }>;
  };
  const average = payload.chapters.find((chapter) => chapter.slug === "average");
  assert.ok(average);

  const offset = payload.printedToPdfPageOffset;
  const questionPdfPages = average.questionPrintedPages.map((page) => page + offset);
  const solutionPdfPages = average.solutionPrintedPages.map((page) => page + offset);
  assert.deepEqual(questionPdfPages, [582, 595]);
  assert.deepEqual(solutionPdfPages, [596, 611]);
});

test("SSC CGL Maths answer recovery matches cross-range OCR solutions by chapter", () => {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "ssc-cgl-book-answer-recovery-"));
  const dataDir = path.join(tempRoot, "ssc-cgl");
  const sourceId = "ssc-maths-6800-mcq";

  writeJson(path.join(dataDir, "book-sources", "ssc-maths-6800-chapters.json"), {
    sourceId,
    printedToPdfPageOffset: 10,
    chapters: [
      {
        chapterNumber: 1,
        slug: "number-system",
        title: "Number System",
        questionCount: 2,
        questionPrintedPages: [3, 3],
        answerKeyPrintedPages: [4, 4],
        solutionPrintedPages: [4, 4]
      },
      {
        chapterNumber: 2,
        slug: "hcf-and-lcm",
        title: "HCF and LCM",
        questionCount: 1,
        questionPrintedPages: [27, 27],
        answerKeyPrintedPages: [30, 30],
        solutionPrintedPages: [30, 30]
      }
    ]
  });

  writeJson(path.join(dataDir, "aligned-mistral", sourceId, "range-a", "aligned-candidates.json"), [
    {
      id: "maths-p013-q1",
      sourceId,
      sourceType: "book_user_provided",
      pageNumber: 13,
      questionNumber: "1",
      stem: "Number system question one.",
      options: [
        { id: "a", text: "10" },
        { id: "b", text: "20" },
        { id: "c", text: "30" },
        { id: "d", text: "40" }
      ],
      correctOption: null,
      alignmentStatus: "missing_answer_key",
      reviewStatus: "missing_answer_key",
      provenance: {
        sourceId,
        sourceType: "book_user_provided",
        pageNumber: 13
      }
    },
    {
      id: "maths-p037-q1",
      sourceId,
      sourceType: "book_user_provided",
      pageNumber: 37,
      questionNumber: "1",
      stem: "HCF question one.",
      options: [
        { id: "a", text: "5" },
        { id: "b", text: "6" },
        { id: "c", text: "7" },
        { id: "d", text: "8" }
      ],
      correctOption: null,
      alignmentStatus: "missing_answer_key",
      reviewStatus: "missing_answer_key",
      provenance: {
        sourceId,
        sourceType: "book_user_provided",
        pageNumber: 37
      }
    }
  ]);

  const numberTextPath = path.join(dataDir, "book-ocr", `${sourceId}-range-b`, "pages-ocr", "page-014.txt");
  const hcfTextPath = path.join(dataDir, "book-ocr", `${sourceId}-range-c`, "pages-ocr", "page-040.txt");
  writeText(numberTextPath, "Solutions\nSol.1.(b) Number system solution.\nSol.2.(c) Another solution.\n");
  writeText(hcfTextPath, "Solutions\nSol.1.(d) HCF solution with the same question number.\n");
  writeJson(path.join(dataDir, "book-ocr", `${sourceId}-range-b`, "extraction-report.json"), {
    sourceId,
    sourceType: "book_user_provided",
    pages: [{ pageNumber: 14, textPath: numberTextPath }]
  });
  writeJson(path.join(dataDir, "book-ocr", `${sourceId}-range-c`, "extraction-report.json"), {
    sourceId,
    sourceType: "book_user_provided",
    pages: [{ pageNumber: 40, textPath: hcfTextPath }]
  });

  execFileSync("python", [
    scriptPath,
    "--source-id",
    sourceId,
    "--chapter-index",
    path.join(dataDir, "book-sources", "ssc-maths-6800-chapters.json"),
    "--ocr-root",
    path.join(dataDir, "book-ocr"),
    "--aligned-root",
    path.join(dataDir, "aligned-mistral")
  ], { cwd: root, stdio: "pipe" });

  const aligned = JSON.parse(fs.readFileSync(path.join(dataDir, "aligned-mistral", sourceId, "range-a", "aligned-candidates.json"), "utf8")) as Array<{
    id: string;
    correctOption: string | null;
    alignmentStatus: string;
    reviewStatus: string;
    chapterSlug?: string;
    chapterTitle?: string;
    answerEvidence?: { sourceType: string; pageNumber: number; correctOption: string };
    provenance?: { chapterSlug?: string; chapterTitle?: string };
  }>;

  const numberQuestion = aligned.find((question) => question.id === "maths-p013-q1");
  const hcfQuestion = aligned.find((question) => question.id === "maths-p037-q1");
  assert.equal(numberQuestion?.correctOption, "b");
  assert.equal(numberQuestion?.alignmentStatus, "matched");
  assert.equal(numberQuestion?.reviewStatus, "needs_topic_duplicate_review");
  assert.equal(numberQuestion?.chapterSlug, "number-system");
  assert.equal(numberQuestion?.provenance?.chapterSlug, "number-system");
  assert.equal(numberQuestion?.answerEvidence?.sourceType, "mistral_ocr_solution_marker_cross_range");
  assert.equal(numberQuestion?.answerEvidence?.pageNumber, 14);

  assert.equal(hcfQuestion?.correctOption, "d");
  assert.equal(hcfQuestion?.answerEvidence?.pageNumber, 40);
  assert.equal(hcfQuestion?.chapterSlug, "hcf-and-lcm");
});

test("SSC CGL answer recovery matches sequential cross-range reasoning solutions after the question page", () => {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "ssc-cgl-reasoning-answer-recovery-"));
  const dataDir = path.join(tempRoot, "ssc-cgl");
  const sourceId = "pinnacle-ssc-reasoning";

  writeJson(path.join(dataDir, "aligned-mistral", sourceId, "range-a", "aligned-candidates.json"), [
    {
      id: "reasoning-p129-q212",
      sourceId,
      sourceType: "book_user_provided",
      pageNumber: 129,
      questionNumber: "212",
      stem: "Six girls are sitting in a circle.",
      options: [
        { id: "a", text: "P" },
        { id: "b", text: "Q" },
        { id: "c", text: "R" },
        { id: "d", text: "S" }
      ],
      correctOption: null,
      alignmentStatus: "missing_answer_key",
      reviewStatus: "missing_answer_key",
      provenance: { sourceId, sourceType: "book_user_provided", pageNumber: 129 }
    },
    {
      id: "reasoning-p129-q1",
      sourceId,
      sourceType: "book_user_provided",
      pageNumber: 129,
      questionNumber: "1",
      stem: "This low-numbered question should not use an earlier old answer.",
      options: [
        { id: "a", text: "A" },
        { id: "b", text: "B" },
        { id: "c", text: "C" },
        { id: "d", text: "D" }
      ],
      correctOption: null,
      alignmentStatus: "missing_answer_key",
      reviewStatus: "missing_answer_key",
      provenance: { sourceId, sourceType: "book_user_provided", pageNumber: 129 }
    }
  ]);

  const oldAnswerPath = path.join(dataDir, "book-ocr", `${sourceId}-range-old`, "pages-ocr", "page-120.txt");
  const nextAnswerPath = path.join(dataDir, "book-ocr", `${sourceId}-range-next`, "pages-ocr", "page-151.txt");
  writeText(oldAnswerPath, "Solutions\nSol.1.(a) Old chapter answer before the candidate page.\n");
  writeText(nextAnswerPath, "Solutions\nSol.212.(c) Seating arrangement answer.\n");
  writeJson(path.join(dataDir, "book-ocr", `${sourceId}-range-old`, "extraction-report.json"), {
    sourceId,
    sourceType: "book_user_provided",
    pages: [{ pageNumber: 120, textPath: oldAnswerPath }]
  });
  writeJson(path.join(dataDir, "book-ocr", `${sourceId}-range-next`, "extraction-report.json"), {
    sourceId,
    sourceType: "book_user_provided",
    pages: [{ pageNumber: 151, textPath: nextAnswerPath }]
  });

  execFileSync("python", [
    scriptPath,
    "--source-id",
    sourceId,
    "--ocr-root",
    path.join(dataDir, "book-ocr"),
    "--aligned-root",
    path.join(dataDir, "aligned-mistral"),
    "--sequential-page-window",
    "35"
  ], { cwd: root, stdio: "pipe" });

  const aligned = JSON.parse(fs.readFileSync(path.join(dataDir, "aligned-mistral", sourceId, "range-a", "aligned-candidates.json"), "utf8")) as Array<{
    id: string;
    correctOption: string | null;
    alignmentStatus: string;
    reviewStatus: string;
    answerEvidence?: { sourceType: string; pageNumber: number; correctOption: string };
  }>;

  const recovered = aligned.find((question) => question.id === "reasoning-p129-q212");
  const stale = aligned.find((question) => question.id === "reasoning-p129-q1");
  assert.equal(recovered?.correctOption, "c");
  assert.equal(recovered?.alignmentStatus, "matched");
  assert.equal(recovered?.reviewStatus, "needs_topic_duplicate_review");
  assert.equal(recovered?.answerEvidence?.sourceType, "mistral_ocr_solution_marker_forward_range");
  assert.equal(recovered?.answerEvidence?.pageNumber, 151);
  assert.equal(stale?.correctOption, null);
  assert.equal(stale?.alignmentStatus, "missing_answer_key");
});

test("SSC CGL Maths answer recovery uses bounded forward fallback when chapter answer range is short", () => {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "ssc-cgl-maths-forward-fallback-"));
  const dataDir = path.join(tempRoot, "ssc-cgl");
  const sourceId = "ssc-maths-6800-mcq";

  writeJson(path.join(dataDir, "book-sources", "ssc-maths-6800-chapters.json"), {
    sourceId,
    printedToPdfPageOffset: 10,
    chapters: [
      {
        chapterNumber: 23,
        slug: "average",
        title: "Average",
        questionCount: 328,
        questionPrintedPages: [570, 585],
        answerKeyPrintedPages: [586, 586],
        solutionPrintedPages: [586, 590]
      }
    ]
  });

  writeJson(path.join(dataDir, "aligned-mistral", sourceId, "average-range", "aligned-candidates.json"), [
    {
      id: "maths-average-p595-q206",
      sourceId,
      sourceType: "book_user_provided",
      pageNumber: 595,
      questionNumber: "206",
      stem: "Average question whose solution page is beyond the indexed answer range.",
      options: [
        { id: "a", text: "10" },
        { id: "b", text: "20" },
        { id: "c", text: "30" },
        { id: "d", text: "40" }
      ],
      correctOption: null,
      alignmentStatus: "missing_answer_key",
      reviewStatus: "missing_answer_key",
      provenance: { sourceId, sourceType: "book_user_provided", pageNumber: 595 }
    }
  ]);

  const inRangeAnswerPath = path.join(dataDir, "book-ocr", `${sourceId}-range-a`, "pages-ocr", "page-600.txt");
  const forwardAnswerPath = path.join(dataDir, "book-ocr", `${sourceId}-range-b`, "pages-ocr", "page-607.txt");
  writeText(inRangeAnswerPath, "Solutions\nSol.205.(a) Previous answer in the indexed chapter solution range.\n");
  writeText(forwardAnswerPath, "Solutions\nSol.206.(d) Forward fallback answer outside the indexed chapter solution range.\n");
  writeJson(path.join(dataDir, "book-ocr", `${sourceId}-range-a`, "extraction-report.json"), {
    sourceId,
    sourceType: "book_user_provided",
    pages: [{ pageNumber: 600, textPath: inRangeAnswerPath }]
  });
  writeJson(path.join(dataDir, "book-ocr", `${sourceId}-range-b`, "extraction-report.json"), {
    sourceId,
    sourceType: "book_user_provided",
    pages: [{ pageNumber: 607, textPath: forwardAnswerPath }]
  });

  execFileSync("python", [
    scriptPath,
    "--source-id",
    sourceId,
    "--chapter-index",
    path.join(dataDir, "book-sources", "ssc-maths-6800-chapters.json"),
    "--ocr-root",
    path.join(dataDir, "book-ocr"),
    "--aligned-root",
    path.join(dataDir, "aligned-mistral"),
    "--sequential-page-window",
    "15"
  ], { cwd: root, stdio: "pipe" });

  const aligned = JSON.parse(fs.readFileSync(path.join(dataDir, "aligned-mistral", sourceId, "average-range", "aligned-candidates.json"), "utf8")) as Array<{
    correctOption: string | null;
    alignmentStatus: string;
    reviewStatus: string;
    chapterSlug?: string;
    answerEvidence?: { sourceType: string; pageNumber: number; correctOption: string };
  }>;

  assert.equal(aligned[0]?.correctOption, "d");
  assert.equal(aligned[0]?.alignmentStatus, "matched");
  assert.equal(aligned[0]?.reviewStatus, "needs_topic_duplicate_review");
  assert.equal(aligned[0]?.chapterSlug, "average");
  assert.equal(aligned[0]?.answerEvidence?.sourceType, "mistral_ocr_solution_marker_forward_range");
  assert.equal(aligned[0]?.answerEvidence?.pageNumber, 607);
});

test("SSC CGL answer recovery skips ambiguous forward answer markers", () => {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "ssc-cgl-ambiguous-forward-answer-"));
  const dataDir = path.join(tempRoot, "ssc-cgl");
  const sourceId = "pinnacle-ssc-english";

  writeJson(path.join(dataDir, "aligned-mistral", sourceId, "range-a", "aligned-candidates.json"), [
    {
      id: "english-p481-q44",
      sourceId,
      sourceType: "book_user_provided",
      pageNumber: 481,
      questionNumber: "44",
      stem: "Question with two possible forward solution markers.",
      options: [
        { id: "a", text: "10" },
        { id: "b", text: "20" },
        { id: "c", text: "30" },
        { id: "d", text: "40" }
      ],
      correctOption: null,
      alignmentStatus: "missing_answer_key",
      reviewStatus: "missing_answer_key",
      provenance: { sourceId, sourceType: "book_user_provided", pageNumber: 481 }
    }
  ]);

  const firstAnswerPath = path.join(dataDir, "book-ocr", `${sourceId}-range-b`, "pages-ocr", "page-490.txt");
  const secondAnswerPath = path.join(dataDir, "book-ocr", `${sourceId}-range-c`, "pages-ocr", "page-493.txt");
  writeText(firstAnswerPath, "Solutions\nSol.44.(a) First possible answer.\n");
  writeText(secondAnswerPath, "Solutions\nSol.44.(c) Second possible answer.\n");
  writeJson(path.join(dataDir, "book-ocr", `${sourceId}-range-b`, "extraction-report.json"), {
    sourceId,
    sourceType: "book_user_provided",
    pages: [{ pageNumber: 490, textPath: firstAnswerPath }]
  });
  writeJson(path.join(dataDir, "book-ocr", `${sourceId}-range-c`, "extraction-report.json"), {
    sourceId,
    sourceType: "book_user_provided",
    pages: [{ pageNumber: 493, textPath: secondAnswerPath }]
  });

  execFileSync("python", [
    scriptPath,
    "--source-id",
    sourceId,
    "--ocr-root",
    path.join(dataDir, "book-ocr"),
    "--aligned-root",
    path.join(dataDir, "aligned-mistral"),
    "--sequential-page-window",
    "15"
  ], { cwd: root, stdio: "pipe" });

  const aligned = JSON.parse(fs.readFileSync(path.join(dataDir, "aligned-mistral", sourceId, "range-a", "aligned-candidates.json"), "utf8")) as Array<{
    correctOption: string | null;
    alignmentStatus: string;
    reviewStatus: string;
  }>;

  assert.equal(aligned[0]?.correctOption, null);
  assert.equal(aligned[0]?.alignmentStatus, "missing_answer_key");
  assert.equal(aligned[0]?.reviewStatus, "missing_answer_key");
});
