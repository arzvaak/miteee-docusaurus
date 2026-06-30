import assert from "node:assert/strict";
import test from "node:test";
import { buildRecallAttemptState } from "../lib/revision-attempt";

test("buildRecallAttemptState blocks grading until a real attempt is written", () => {
  assert.deepEqual(buildRecallAttemptState("   "), {
    canGrade: false,
    helperText: "Write a recall attempt before grading."
  });

  assert.deepEqual(buildRecallAttemptState("no"), {
    canGrade: false,
    helperText: "Add a little more detail before grading."
  });

  assert.deepEqual(buildRecallAttemptState("I do not know"), {
    canGrade: true,
    helperText: "Grade the attempt, then open the source if needed."
  });
});
