import assert from "node:assert/strict";
import test from "node:test";
import {
  buildSscMistakeBankItems,
  buildSscTopicPracticeMistakeBankItem,
  mergeSscMistakeBank,
  parseSscMistakeBank,
  sscMistakeBankStorageKey
} from "@/lib/ssc-cgl-mistake-bank";
import type { SscAttemptQuestionReviewRow } from "@/lib/ssc-cgl-attempt-review";
import type { SscCglQuestion, SscCglTopic } from "@/lib/exam-types";

function reviewRow(questionId: string, status: SscAttemptQuestionReviewRow["status"]): SscAttemptQuestionReviewRow {
  return {
    questionId,
    sectionId: "quantitative-aptitude",
    sectionTitle: "Quantitative Aptitude",
    questionNumber: questionId === "q1" ? 1 : 2,
    topic: "calculation-speed",
    subtopic: "Calculation Speed",
    topicHref: "/exams/ssc-cgl/topics/calculation-speed",
    stem: `Stem ${questionId}`,
    status,
    chosenOptionId: status === "unattempted" ? null : "a",
    chosenOptionText: status === "unattempted" ? "Not attempted" : "Option A",
    correctOptionId: "b",
    correctOptionText: "Option B",
    explanation: `Explanation ${questionId}`,
    marksImpact: status === "correct" ? 2 : status === "wrong" ? -0.5 : 0,
    sourceLabel: "Fixture Book · page 10",
    sourceUrl: null
  };
}

function fixtureQuestion(id: string, correctOption: "a" | "b" | "c" | "d" = "b"): SscCglQuestion {
  return {
    id,
    exam: "SSC-CGL",
    tier: "Tier-I",
    year: 2026,
    shift: "Topic practice fixture",
    source: "PYQ",
    section: "quantitative-aptitude",
    topic: "calculation-speed",
    subtopic: "Calculation Speed",
    difficulty: "easy",
    language: "en",
    stem: `Topic practice stem ${id}`,
    options: [
      { id: "a", text: "Option A" },
      { id: "b", text: "Option B" },
      { id: "c", text: "Option C" },
      { id: "d", text: "Option D" }
    ],
    correctOption,
    explanation: `Topic practice explanation ${id}.`,
    marksCorrect: 2,
    marksWrong: -0.5,
    marksUnattempted: 0,
    timerSeconds: 900,
    ocrConfidence: 0.99,
    reviewStatus: "reviewed",
    conceptTags: ["speed"],
    provenance: {
      sourceId: "fixture-book",
      sourceType: "book_user_provided",
      title: "Fixture Book",
      pageNumber: 21,
      licenseNote: "Fixture"
    }
  };
}

function fixtureTopic(): SscCglTopic {
  return {
    slug: "calculation-speed",
    title: "Calculation Speed",
    subject: "Quantitative Aptitude",
    section: "quantitative-aptitude",
    priority: "speed",
    study: {
      summary: "Fixture topic",
      sections: [],
      formulaTable: [],
      flowchart: ""
    },
    practice: {
      questionIds: ["q-topic"],
      pyqQuestionIds: ["q-topic"],
      bookQuestionIds: ["q-topic"],
      gapRepairQuestionIds: [],
      sourceBreakdown: {
        bookUserProvided: 1,
        originalPractice: 0,
        otherReviewed: 0
      },
      drillPrompt: "Fixture drill"
    }
  };
}

test("SSC CGL mistake bank stores only wrong and unattempted review rows", () => {
  const items = buildSscMistakeBankItems(
    [reviewRow("q1", "wrong"), reviewRow("q2", "unattempted"), reviewRow("q3", "correct")],
    {
      attemptId: "attempt-1",
      testId: "test-1",
      testTitle: "Quant Sprint",
      savedAt: "2026-06-28T02:00:00.000Z"
    }
  );

  assert.equal(sscMistakeBankStorageKey, "ssc-cgl-mistake-bank");
  assert.deepEqual(items.map((item) => item.questionId), ["q1", "q2"]);
  assert.equal(items[0]?.resultHref, "/exams/ssc-cgl/results/attempt-1");
  assert.equal(items[0]?.topicHref, "/exams/ssc-cgl/topics/calculation-speed");
  assert.equal(items[0]?.chosenOptionText, "Option A");
  assert.equal(items[1]?.chosenOptionText, "Not attempted");
});

test("SSC CGL topic practice misses are stored in the same mistake bank format", () => {
  const savedAt = "2026-06-29T07:00:00.000Z";
  const wrong = buildSscTopicPracticeMistakeBankItem(fixtureQuestion("q-topic", "b"), fixtureTopic(), "a", savedAt);
  const skipped = buildSscTopicPracticeMistakeBankItem(fixtureQuestion("q-skip", "c"), fixtureTopic(), "z", savedAt);
  const corrected = buildSscTopicPracticeMistakeBankItem(fixtureQuestion("q-correct", "b"), fixtureTopic(), "b", savedAt);

  assert.ok(wrong);
  assert.ok(skipped);
  assert.equal(corrected, null);
  assert.equal(wrong.questionId, "q-topic");
  assert.equal(wrong.attemptId, "topic-practice-calculation-speed");
  assert.equal(wrong.testId, "topic-practice-calculation-speed");
  assert.equal(wrong.testTitle, "Calculation Speed topic practice");
  assert.equal(wrong.resultHref, "/exams/ssc-cgl/practice/calculation-speed");
  assert.equal(wrong.sectionTitle, "Quantitative Aptitude");
  assert.equal(wrong.topicHref, "/exams/ssc-cgl/practice/calculation-speed");
  assert.equal(wrong.status, "wrong");
  assert.equal(wrong.chosenOptionText, "A · Option A");
  assert.equal(wrong.correctOptionText, "B · Option B");
  assert.equal(wrong.explanation, "Topic practice explanation q-topic.");
  assert.equal(wrong.sourceLabel, "Fixture Book · page 21");
  assert.equal(skipped?.status, "unattempted");
  assert.equal(skipped?.chosenOptionText, "Not attempted");
});

test("SSC CGL topic practice stores correct but slow answers as speed repairs", () => {
  const savedAt = "2026-06-29T07:05:00.000Z";
  const slow = buildSscTopicPracticeMistakeBankItem(fixtureQuestion("q-slow", "b"), fixtureTopic(), "b", savedAt, 44);
  const onPace = buildSscTopicPracticeMistakeBankItem(fixtureQuestion("q-fast", "b"), fixtureTopic(), "b", savedAt, 24);

  assert.ok(slow);
  assert.equal(onPace, null);
  assert.equal(slow.questionId, "q-slow");
  assert.equal(slow.status, "slow");
  assert.equal(slow.chosenOptionText, "B · Option B");
  assert.equal(slow.correctOptionText, "B · Option B");
  assert.match(slow.explanation, /Correct answer, but it took 44s against the 36s SSC pace target/);
  assert.match(slow.explanation, /Topic practice explanation q-slow\./);
});
