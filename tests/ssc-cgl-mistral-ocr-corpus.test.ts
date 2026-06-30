import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { getSscCglBookQuestionsPath } from "@/lib/ssc-cgl-corpus-paths";

const progressPath = path.join(
  process.cwd(),
  "data",
  "exams",
  "ssc-cgl",
  "book-sources",
  "mistral-ocr-import-progress.json"
);

type SourceProgress = {
  sourceId: string;
  role: "mcq_bank" | "mcq_corpus" | "mcq_corpus_supplement" | "mcq_practice_bank" | "static_gk_reference";
  ocrJobs: number;
  ocrPages: number;
  segmentedCandidates: number;
  ocrAnswerMatched: number;
  agentReviewRequired: number;
  promotedQuestions: number;
};

test("SSC CGL Mistral OCR progress ledger covers all uploaded books", () => {
  const progress = JSON.parse(fs.readFileSync(progressPath, "utf8")) as {
    ocrModel: string;
    sources: SourceProgress[];
    totals: {
      sourceCount: number;
      ocrJobs: number;
      ocrPages: number;
      segmentedCandidates: number;
      ocrAnswerMatched: number;
      agentReviewRequired: number;
      promotedQuestions: number;
    };
  };
  const promotedQuestions = JSON.parse(fs.readFileSync(getSscCglBookQuestionsPath(), "utf8")) as unknown[];
  const bySource = new Map(progress.sources.map((source) => [source.sourceId, source]));

  assert.equal(progress.ocrModel, "mistral-ocr-latest");
  assert.equal(progress.totals.sourceCount, 6);
  assert.equal(progress.totals.ocrJobs, progress.sources.reduce((total, source) => total + source.ocrJobs, 0));
  assert.equal(progress.totals.ocrPages, progress.sources.reduce((total, source) => total + source.ocrPages, 0));
  assert.equal(progress.totals.segmentedCandidates, progress.sources.reduce((total, source) => total + source.segmentedCandidates, 0));
  assert.equal(progress.totals.ocrAnswerMatched, progress.sources.reduce((total, source) => total + source.ocrAnswerMatched, 0));
  assert.ok(progress.totals.segmentedCandidates >= promotedQuestions.length);
  assert.ok(progress.totals.ocrAnswerMatched >= promotedQuestions.length);
  assert.equal(progress.totals.promotedQuestions, promotedQuestions.length);

  assert.equal(bySource.get("lucent-gk-english")?.role, "static_gk_reference");
  assert.equal(bySource.get("lucent-gk-english")?.ocrPages, 672);
  assert.equal(bySource.get("ssc-maths-6800-mcq")?.segmentedCandidates, 6458);
  assert.equal(bySource.get("pinnacle-maths-6800-di-qr-english")?.role, "mcq_corpus_supplement");
  assert.equal(bySource.get("pinnacle-maths-6800-di-qr-english")?.segmentedCandidates, 388);
  assert.equal(bySource.get("pinnacle-maths-6800-di-qr-english")?.promotedQuestions, 328);
  assert.equal(bySource.get("pinnacle-ssc-general-studies")?.promotedQuestions, 6585);
  assert.equal(bySource.get("pinnacle-ssc-reasoning")?.promotedQuestions, 3200);
  assert.ok(progress.sources.every((source) => source.role === "static_gk_reference" || source.segmentedCandidates > 0));
});

test("SSC CGL Mistral OCR progress ledger counts cumulative agent-review decisions", () => {
  const progress = JSON.parse(fs.readFileSync(progressPath, "utf8")) as {
    sources: SourceProgress[];
    totals: { agentReviewItems: number };
  };
  const agentReviewRoot = path.join(process.cwd(), "data", "exams", "ssc-cgl", "agent-review");
  if (!fs.existsSync(agentReviewRoot)) {
    assert.ok(progress.totals.agentReviewItems >= 0);
    assert.ok(progress.sources.every((source) => source.agentReviewRequired >= 0));
    return;
  }
  let cumulativeUniqueQuestions = 0;

  for (const source of progress.sources) {
    if (source.role === "static_gk_reference") continue;
    const sourceRoot = path.join(agentReviewRoot, source.sourceId);
    if (!fs.existsSync(sourceRoot)) continue;
    const uniqueQuestionIds = new Set<string>();

    for (const chunk of fs.readdirSync(sourceRoot, { withFileTypes: true })) {
      if (!chunk.isDirectory() || !chunk.name.startsWith("ocr-range")) continue;
      const decisionsPath = path.join(sourceRoot, chunk.name, "agent-review-decisions.json");
      if (!fs.existsSync(decisionsPath)) continue;
      const decisions = JSON.parse(fs.readFileSync(decisionsPath, "utf8")) as Array<{ questionId?: string }>;
      for (const decision of decisions) {
        if (decision.questionId) uniqueQuestionIds.add(decision.questionId);
      }
    }

    cumulativeUniqueQuestions += uniqueQuestionIds.size;
    assert.equal(source.agentReviewRequired >= uniqueQuestionIds.size, true);
  }

  assert.equal(progress.totals.agentReviewItems, cumulativeUniqueQuestions);
});
