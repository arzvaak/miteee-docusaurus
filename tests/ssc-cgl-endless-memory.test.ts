import assert from "node:assert/strict";
import test from "node:test";
import type { SscCglQuestion } from "@/lib/exam-types";
import {
  createEmptySscEndlessMemory,
  getOpenSscEndlessReviewItems,
  parseSscEndlessMemory,
  recordSscEndlessAnswer,
  recordSscEndlessQuestionSeen,
  resolveSscEndlessReviewItem,
  serializeSscEndlessMemory,
  setSscEndlessQuestionMarked,
  startSscEndlessSession
} from "@/lib/ssc-cgl-endless-memory";

function question(id = "q1"): SscCglQuestion {
  return {
    id,
    exam: "SSC-CGL",
    tier: "Tier-I",
    year: 2026,
    shift: "Endless fixture",
    source: "Original practice",
    section: "quantitative-aptitude",
    topic: "ratio-proportion",
    subtopic: "Ratio and proportion",
    difficulty: "medium",
    language: "en",
    stem: `Question ${id}`,
    options: [
      { id: "a", text: "Answer A" },
      { id: "b", text: "Answer B" },
      { id: "c", text: "Answer C" },
      { id: "d", text: "Answer D" }
    ],
    correctOption: "a",
    explanation: "Correct answer: A. Method: fixture. Why it fits: fixture. Trap to avoid: fixture.",
    marksCorrect: 2,
    marksWrong: -0.5,
    marksUnattempted: 0,
    timerSeconds: 900,
    ocrConfidence: 1,
    reviewStatus: "reviewed",
    conceptTags: ["fixture"],
    provenance: {
      sourceId: `source-${id}`,
      sourceType: "original_practice",
      title: "Endless fixture",
      licenseNote: "Test fixture"
    }
  };
}

test("endless memory keeps stats and missed questions across serialization", () => {
  const item = question();
  let memory = createEmptySscEndlessMemory();
  memory = startSscEndlessSession(memory, "2026-08-06T10:00:00.000Z");
  memory = recordSscEndlessQuestionSeen(memory, item);
  memory = recordSscEndlessAnswer(memory, item, "wrong", "b", "2026-08-06T10:01:00.000Z", 0);

  const restored = parseSscEndlessMemory(serializeSscEndlessMemory(memory));
  assert.equal(restored.stats.sessions, 1);
  assert.equal(restored.stats.questionsSeen, 1);
  assert.equal(restored.stats.answered, 1);
  assert.equal(restored.stats.wrong, 1);
  assert.equal(restored.stats.sections["quantitative-aptitude"].wrong, 1);
  assert.equal(restored.reviewItems[0]?.questionId, "q1");
  assert.equal(restored.reviewItems[0]?.lastSelectedOptionId, "b");
});

test("endless memory supports manual marks without requiring an answer", () => {
  const item = question("marked");
  const marked = setSscEndlessQuestionMarked(createEmptySscEndlessMemory(), item, true, "2026-08-06T10:00:00.000Z");
  assert.equal(getOpenSscEndlessReviewItems(marked)[0]?.marked, true);

  const unmarked = setSscEndlessQuestionMarked(marked, item, false, "2026-08-06T10:02:00.000Z");
  assert.equal(unmarked.reviewItems.length, 0);
});

test("correct answers do not create a review row, but a marked row stays reviewable", () => {
  const item = question("correct");
  const correct = recordSscEndlessAnswer(createEmptySscEndlessMemory(), item, "correct", "a", "2026-08-06T10:00:00.000Z", 1);
  assert.equal(correct.reviewItems.length, 0);

  const marked = setSscEndlessQuestionMarked(correct, item, true, "2026-08-06T10:01:00.000Z");
  const stillOpen = recordSscEndlessAnswer(marked, item, "correct", "a", "2026-08-06T10:02:00.000Z", 2);
  assert.equal(stillOpen.reviewItems[0]?.marked, true);
  assert.equal(stillOpen.reviewItems[0]?.correctCount, 1);

  const mastered = resolveSscEndlessReviewItem(stillOpen, item.id);
  assert.equal(mastered.reviewItems.length, 0);
});
