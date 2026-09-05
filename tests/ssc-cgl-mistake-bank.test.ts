import assert from "node:assert/strict";
import test from "node:test";
import {
  buildSscCurrentAffairsMistakeBankItem,
  buildSscMistakeBankItems,
  buildSscTopicPracticeMistakeBankItem,
  mergeSscMistakeBank,
  parseSscMistakeBank,
  sscMistakeBankStorageKey
} from "@/lib/ssc-cgl-mistake-bank";
import type { SscAttemptQuestionReviewRow } from "@/lib/ssc-cgl-attempt-review";
import type { CurrentAffairsRecallCard, SscCglQuestion, SscCglTopic } from "@/lib/exam-types";

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

function fixtureCurrentAffairsCard(): CurrentAffairsRecallCard {
  return {
    id: "current-affairs-2026-06-29-rbi-vrr",
    date: "2026-06-29",
    title: "RBI conducts VRR auction",
    source: "RBI",
    url: "https://rbi.example/vrr",
    examAreas: ["Economy", "Banking"],
    prompt: "Which institution conducts VRR auctions?",
    answer: "RBI",
    trap: "SEBI",
    memoryHook: "VRR means RBI liquidity repo.",
    priority: "high"
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

test("SSC CGL current-affairs missed recall cards enter the same mistake bank format", () => {
  const savedAt = "2026-06-29T07:30:00.000Z";
  const item = buildSscCurrentAffairsMistakeBankItem(fixtureCurrentAffairsCard(), savedAt);

  assert.equal(item.questionId, "current-affairs-2026-06-29-rbi-vrr");
  assert.equal(item.attemptId, "current-affairs-2026-06-29");
  assert.equal(item.testId, "current-affairs-2026-06-29");
  assert.equal(item.testTitle, "Current affairs recall 2026-06-29");
  assert.equal(item.resultHref, "/exams/ssc-cgl/current-affairs?date=2026-06-29");
  assert.equal(item.sectionId, "general-awareness");
  assert.equal(item.sectionTitle, "General Awareness");
  assert.equal(item.topic, "Current Affairs and Static GK");
  assert.equal(item.subtopic, "RBI conducts VRR auction");
  assert.equal(item.topicHref, "/exams/ssc-cgl/practice/current-affairs-static-gk");
  assert.equal(item.stem, "Which institution conducts VRR auctions?");
  assert.equal(item.status, "wrong");
  assert.equal(item.chosenOptionText, "Missed during recall");
  assert.equal(item.correctOptionText, "RBI");
  assert.match(item.explanation, /Memory hook: VRR means RBI liquidity repo\./);
  assert.match(item.explanation, /Trap: SEBI/);
  assert.equal(item.sourceLabel, "RBI · 2026-06-29");
  assert.equal(item.savedAt, savedAt);
});

test("SSC CGL mistake bank dedupes repeated misses and clears corrected questions", () => {
  const oldItems = buildSscMistakeBankItems([reviewRow("q1", "wrong"), reviewRow("q2", "wrong")], {
    attemptId: "old-attempt",
    testId: "old-test",
    testTitle: "Old Sprint",
    savedAt: "2026-06-27T02:00:00.000Z"
  });
  const latestRows = [reviewRow("q1", "correct"), reviewRow("q2", "unattempted")];
  const latestItems = buildSscMistakeBankItems(latestRows, {
    attemptId: "new-attempt",
    testId: "new-test",
    testTitle: "New Sprint",
    savedAt: "2026-06-28T02:00:00.000Z"
  });

  const merged = mergeSscMistakeBank(
    oldItems,
    latestItems,
    latestRows.filter((row) => row.status === "correct").map((row) => row.questionId),
    20
  );

  assert.deepEqual(merged.map((item) => item.questionId), ["q2"]);
  assert.equal(merged[0]?.attemptId, "new-attempt");
  assert.equal(merged[0]?.status, "unattempted");
});

test("SSC CGL mistake bank parser rejects malformed local storage", () => {
  const item = buildSscMistakeBankItems([reviewRow("q1", "wrong")], {
    attemptId: "attempt-1",
    testId: "test-1",
    testTitle: "Quant Sprint",
    savedAt: "2026-06-28T02:00:00.000Z"
  })[0]!;

  assert.deepEqual(parseSscMistakeBank(null), []);
  assert.deepEqual(parseSscMistakeBank("{bad json"), []);
  assert.deepEqual(parseSscMistakeBank(JSON.stringify({ item })), []);
  assert.deepEqual(parseSscMistakeBank(JSON.stringify([{ questionId: "missing-fields" }])), []);
  assert.deepEqual(parseSscMistakeBank(JSON.stringify([item])), [item]);
});
