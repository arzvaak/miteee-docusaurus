import assert from "node:assert/strict";
import test from "node:test";
import { buildSscCglQuestions } from "@/lib/ssc-cgl-source";
import { isLearnerGradeSscQuestion } from "@/lib/ssc-cgl-quality";
import type { SscCglQuestion } from "@/lib/exam-types";

function fixture(overrides: Partial<SscCglQuestion> = {}): SscCglQuestion {
  return {
    id: "quality-fixture",
    exam: "SSC-CGL",
    tier: "Tier-I",
    year: 2026,
    shift: "Fixture",
    source: "Original practice",
    section: "quantitative-aptitude",
    topic: "ratio-proportion",
    subtopic: "Ratio and Proportion",
    difficulty: "easy",
    language: "en",
    stem: "If two quantities are in the ratio 2:3 and the first is 14, what is the second?",
    options: [
      { id: "a", text: "21" },
      { id: "b", text: "16" },
      { id: "c", text: "18" },
      { id: "d", text: "24" }
    ],
    correctOption: "a",
    explanation: "Use equivalent ratios.",
    marksCorrect: 2,
    marksWrong: -0.5,
    marksUnattempted: 0,
    timerSeconds: 900,
    ocrConfidence: 1,
    reviewStatus: "reviewed",
    conceptTags: ["fixture"],
    provenance: {
      sourceId: "quality-fixture",
      sourceType: "original_practice",
      title: "Quality fixture",
      licenseNote: "Test fixture"
    },
    ...overrides
  };
}

test("learner question quality rejects self-referential route prompts", () => {
  assert.equal(isLearnerGradeSscQuestion(fixture({
    stem: "Ratio and Proportion 200/200 drill 80: Which first step gives the fastest reliable SSC CGL solution route for this topic?",
    options: [
      { id: "a", text: "Assign k" },
      { id: "b", text: "Do not add absolute differences before assigning k." },
      { id: "c", text: "Skip the stem and test options directly" },
      { id: "d", text: "Memorize the last seen answer pattern" }
    ]
  })), false);
});

test("learner question quality keeps a real table-backed question and rejects missing graphs", () => {
  assert.equal(isLearnerGradeSscQuestion(fixture({
    stem: "The following table shows regional sales. What is the total sales value?",
    stimulus: {
      type: "table",
      columns: ["Region", "Sales"],
      rows: [["North", "318"], ["South", "212"], ["East", "166"]]
    }
  })), true);
  assert.equal(isLearnerGradeSscQuestion(fixture({
    stem: "The following bar graph shows production. Which company has the maximum average?"
  })), false);
  assert.equal(isLearnerGradeSscQuestion(fixture({
    topic: "data-interpretation",
    stem: "2:5 3:5 If the population is 14,700, what is the total?"
  })), false);
});

test("generated DI repair rows carry a real table and an item-specific explanation", () => {
  const question = buildSscCglQuestions().find((item) => item.topic === "data-interpretation" && item.provenance.sourceType === "original_practice" && item.stimulus?.type === "table");

  assert.ok(question);
  assert.match(question.stem, /following table shows regional sales/i);
  assert.deepEqual(question.stimulus?.columns, ["Region", "Sales"]);
  assert.deepEqual(question.stimulus?.rows[0], ["North", "120"]);
  assert.match(question.explanation, /120 \+ 80 \+ 100 = 300/);
  assert.doesNotMatch(question.explanation, /numerical value obtained after applying the topic formula/i);
});

test("retained book DI rows are promoted only when their visual data can be reconstructed", () => {
  const question = buildSscCglQuestions().find((item) => item.id === "ssc-cgl-agent-curated-2016-c0b41f6adebd");

  assert.ok(question);
  assert.equal(question.provenance.sourceType, "book_user_provided");
  assert.deepEqual(question.stimulus?.columns, ["Year", "Value 1", "Value 2", "Value 3"]);
  assert.deepEqual(question.stimulus?.rows[0], ["2016", "38000", "43000", "52000"]);
});
