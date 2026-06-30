import assert from "node:assert/strict";
import test from "node:test";
import { activeRecallStorageKey, isRecallAnswerText, recallModeLabels } from "../lib/active-recall";

test("isRecallAnswerText detects answer and solution disclosure labels", () => {
  assert.equal(isRecallAnswerText("Answer"), true);
  assert.equal(isRecallAnswerText("Show Answer"), true);
  assert.equal(isRecallAnswerText("Final answer"), true);
  assert.equal(isRecallAnswerText("Final answer: Kd = 0.958"), true);
  assert.equal(isRecallAnswerText("Answer 12"), true);
  assert.equal(isRecallAnswerText("Tip: - **Answer**"), true);
  assert.equal(isRecallAnswerText("Outline hint (AI-generated study aid)"), true);
});

test("isRecallAnswerText leaves ordinary explanatory text visible", () => {
  assert.equal(isRecallAnswerText("Method checkpoint"), false);
  assert.equal(isRecallAnswerText("Question-heavy paths"), false);
  assert.equal(isRecallAnswerText("Answering this requires understanding the theorem."), false);
});

test("active recall storage and mode labels are stable", () => {
  assert.equal(activeRecallStorageKey, "miteee-active-recall-v1");
  assert.equal(recallModeLabels.active, "Active recall");
  assert.equal(recallModeLabels.review, "Review mode");
});
