import assert from "node:assert/strict";
import test from "node:test";
import { parseSscExplanationBlocks } from "@/lib/ssc-cgl-explanations";

test("SSC CGL structured explanations split into readable answer, method, why, trap, and source blocks", () => {
  const blocks = parseSscExplanationBlocks(
    "Correct answer: B (Temperature). Method: match instrument to measured quantity. Why it fits: a thermometer measures temperature. Trap to avoid: heat is energy transfer, not the direct reading. Source cue: book solution line."
  );

  assert.deepEqual(blocks, [
    { type: "answer", label: "Correct answer", body: "B (Temperature)." },
    { type: "method", label: "Method", body: "match instrument to measured quantity." },
    { type: "why", label: "Why it fits", body: "a thermometer measures temperature." },
    { type: "trap", label: "Trap to avoid", body: "heat is energy transfer, not the direct reading." },
    { type: "source", label: "Source cue", body: "book solution line." }
  ]);
});

test("SSC CGL explanation parser keeps plain legacy text readable", () => {
  assert.deepEqual(parseSscExplanationBlocks("Use the formula and compare options."), [
    { type: "general", label: "Explanation", body: "Use the formula and compare options." }
  ]);
  assert.deepEqual(parseSscExplanationBlocks("   "), [
    { type: "general", label: "Explanation", body: "No separate explanation is attached yet. Use the keyed answer and source line to review the exact item." }
  ]);
});
