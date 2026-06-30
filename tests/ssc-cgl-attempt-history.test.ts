import assert from "node:assert/strict";
import test from "node:test";
import {
  buildSscAttemptHistoryItem,
  mergeSscAttemptHistory,
  parseSscAttemptHistory,
  sscAttemptHistoryStorageKey
} from "@/lib/ssc-cgl-attempt-history";
import type { SscCglAttemptResult, SscCglTestDetail } from "@/lib/exam-types";

const fixtureTest: SscCglTestDetail = {
  id: "ssc-cgl-book-200-mode-mock-01",
  title: "SSC CGL 200/200 Book Mock 01",
  mode: "full_mock",
  questionCount: 100,
  maxScore: 200,
  durationSeconds: 3600,
  sourceType: "book_user_provided",
  reviewStatus: "reviewed",
  description: "Fixture full mock.",
  sections: []
};

const fixtureResult: SscCglAttemptResult = {
  attemptId: "attempt-1",
  testId: fixtureTest.id,
  score: 187.5,
  maxScore: 200,
  marksLost: 12.5,
  scoreGapTo200: 12.5,
  correct: 95,
  wrong: 5,
  unattempted: 0,
  accuracy: 0.95,
  totalTimeSeconds: 3340,
  targetSecondsPerQuestion: 36,
  averageSecondsPerQuestion: 33,
  pacingStatus: "on-pace",
  nextBestAction: "Repair analogy traps, then redo one timed reasoning set.",
  sectionResults: [],
  weakTopics: [],
  repairQueue: [
    {
      slug: "analogy-classification",
      title: "Analogy and Classification",
      section: "reasoning",
      wrong: 3,
      unattempted: 0,
      totalRepair: 3,
      href: "/exams/ssc-cgl/topics/analogy-classification",
      recommendedAction: "Fix the wrong answers and redo a timed drill."
    }
  ],
  rank: {
    percentile: 98,
    rankBucket: "Top 2% simulation",
    basis: "Fixture rank model"
  }
};

test("SSC CGL attempt history stores compact 200/200 repair context", () => {
  const item = buildSscAttemptHistoryItem(fixtureTest, fixtureResult, "2026-06-28T02:30:00.000Z");

  assert.equal(sscAttemptHistoryStorageKey, "ssc-cgl-attempt-index");
  assert.equal(item.attemptId, fixtureResult.attemptId);
  assert.equal(item.testId, fixtureTest.id);
  assert.equal(item.testTitle, fixtureTest.title);
  assert.equal(item.mode, "full_mock");
  assert.equal(item.score, 187.5);
  assert.equal(item.maxScore, 200);
  assert.equal(item.marksLost, 12.5);
  assert.equal(item.percentile, 98);
  assert.equal(item.rankBucket, "Top 2% simulation");
  assert.equal(item.correct, 95);
  assert.equal(item.wrong, 5);
  assert.equal(item.unattempted, 0);
  assert.equal(item.topRepairTopic, "Analogy and Classification");
  assert.equal(item.topRepairHref, "/exams/ssc-cgl/topics/analogy-classification");
});

test("SSC CGL attempt history dedupes newest attempts and caps local storage", () => {
  const oldDuplicate = buildSscAttemptHistoryItem(fixtureTest, fixtureResult, "2026-06-27T02:30:00.000Z");
  const newestDuplicate = buildSscAttemptHistoryItem(fixtureTest, { ...fixtureResult, score: 190 }, "2026-06-28T02:30:00.000Z");
  const olderItems = Array.from({ length: 25 }, (_, index) => ({
    ...oldDuplicate,
    attemptId: `old-${index}`,
    savedAt: `2026-06-${String(index + 1).padStart(2, "0")}T02:30:00.000Z`
  }));

  const merged = mergeSscAttemptHistory([oldDuplicate, ...olderItems], newestDuplicate, 20);

  assert.equal(merged.length, 20);
  assert.equal(merged[0]?.attemptId, fixtureResult.attemptId);
  assert.equal(merged[0]?.score, 190);
  assert.equal(merged.filter((item) => item.attemptId === fixtureResult.attemptId).length, 1);
});

test("SSC CGL attempt history parser ignores malformed local data", () => {
  const item = buildSscAttemptHistoryItem(fixtureTest, fixtureResult, "2026-06-28T02:30:00.000Z");

  assert.deepEqual(parseSscAttemptHistory(null), []);
  assert.deepEqual(parseSscAttemptHistory("{not json"), []);
  assert.deepEqual(parseSscAttemptHistory(JSON.stringify({ item })), []);
  assert.deepEqual(parseSscAttemptHistory(JSON.stringify([{ attemptId: "missing-fields" }])), []);
  assert.deepEqual(parseSscAttemptHistory(JSON.stringify([item])), [item]);
});
