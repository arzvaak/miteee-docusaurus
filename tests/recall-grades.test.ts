import assert from "node:assert/strict";
import test from "node:test";
import { recallGradeOptions } from "../lib/recall-grades";

test("recall grade options expose the full review scale in order", () => {
  assert.deepEqual(recallGradeOptions.map((option) => option.grade), ["again", "hard", "good", "easy"]);
  assert.deepEqual(recallGradeOptions.map((option) => option.label), ["Again", "Hard", "Good", "Easy"]);
  assert.ok(recallGradeOptions.every((option) => option.description.length > 16));
  assert.deepEqual(recallGradeOptions.filter((option) => option.emphasis === "primary").map((option) => option.grade), ["good"]);
});
