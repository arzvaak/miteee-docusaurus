import assert from "node:assert/strict";
import test from "node:test";
import { buildSscAttemptQuestionReview } from "@/lib/ssc-cgl-attempt-review";
import type { SscCglQuestion, SscCglTestDetail } from "@/lib/exam-types";

function fixtureQuestion(id: string, correctOption: "a" | "b" | "c" | "d" = "a"): SscCglQuestion {
  return {
    id,
    exam: "SSC-CGL",
    tier: "Tier-I",
    year: 2026,
    shift: "Review fixture",
    source: "PYQ",
    section: "quantitative-aptitude",
    topic: "calculation-speed",
    subtopic: "Calculation Speed",
    difficulty: "easy",
    language: "en",
    stem: `Review question ${id}`,
    options: [
      { id: "a", text: "Option A" },
      { id: "b", text: "Option B" },
      { id: "c", text: "Option C" },
      { id: "d", text: "Option D" }
    ],
    correctOption,
    explanation: `Explanation for ${id}.`,
    marksCorrect: 2,
    marksWrong: -0.5,
    marksUnattempted: 0,
    timerSeconds: 900,
    ocrConfidence: 0.98,
    reviewStatus: "reviewed",
    conceptTags: ["speed"],
    provenance: {
      sourceId: "fixture-book",
      sourceType: "book_user_provided",
      title: "Fixture Book",
      pageNumber: 12,
      licenseNote: "Fixture"
    }
  };
}

function fixtureTest(): SscCglTestDetail {
  const questions = [
    fixtureQuestion("q-correct", "a"),
    fixtureQuestion("q-wrong", "b"),
    fixtureQuestion("q-left", "c")
  ];

  return {
    id: "review-fixture-test",
    title: "Review Fixture Test",
    mode: "speed_sprint",
    questionCount: questions.length,
    maxScore: questions.length * 2,
    durationSeconds: 900,
    sourceType: "book_user_provided",
    reviewStatus: "reviewed",
    description: "Fixture",
    sections: [{
      id: "quantitative-aptitude",
      title: "Quantitative Aptitude",
      timerSeconds: 900,
      questions
    }]
  };
}

test("SSC CGL attempt review rows classify correct wrong and unattempted answers", () => {
  const rows = buildSscAttemptQuestionReview(fixtureTest(), {
    "q-correct": "a",
    "q-wrong": "a",
    "q-left": null
  });

  assert.deepEqual(rows.map((row) => row.status), ["correct", "wrong", "unattempted"]);
  assert.equal(rows[0]?.marksImpact, 2);
  assert.equal(rows[1]?.marksImpact, -0.5);
  assert.equal(rows[2]?.marksImpact, 0);
  assert.equal(rows[0]?.chosenOptionText, "Option A");
  assert.equal(rows[1]?.correctOptionText, "Option B");
  assert.equal(rows[2]?.chosenOptionText, "Not attempted");
  assert.equal(rows[0]?.explanation, "Explanation for q-correct.");
  assert.equal(rows[0]?.topicHref, "/exams/ssc-cgl/practice/calculation-speed");
  assert.equal(rows[0]?.sourceLabel, "Fixture Book · page 12");
});
