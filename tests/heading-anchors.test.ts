import assert from "node:assert/strict";
import test from "node:test";
import { buildHeadingAnchors, buildQuestionAnchors, headingAnchorId, uniqueHeadingAnchorId } from "../lib/heading-anchors";

test("headingAnchorId creates stable reader anchors from noisy headings", () => {
  assert.equal(headingAnchorId("📘 Question 1: $E = mc^2$"), "question-1-e-mc2");
  assert.equal(headingAnchorId("  Electrical Machines II PYQ Answer Bank  "), "electrical-machines-ii-pyq-answer-bank");
});

test("uniqueHeadingAnchorId keeps duplicate reader headings addressable", () => {
  const seen = new Map<string, number>();

  assert.equal(uniqueHeadingAnchorId("Answer", seen), "answer");
  assert.equal(uniqueHeadingAnchorId("Answer", seen), "answer-2");
  assert.equal(uniqueHeadingAnchorId("Answer", seen), "answer-3");
});

test("buildHeadingAnchors skips title headings and limits the outline", () => {
  const anchors = buildHeadingAnchors(
    [
      { level: 1, text: "PYQ Answer Bank" },
      { level: 2, text: "Question 1" },
      { level: 3, text: "Answer 1" },
      { level: 2, text: "Question 1" },
      { level: 4, text: "Deep detail" }
    ],
    3
  );

  assert.deepEqual(anchors, [
    { level: 2, text: "Question 1", id: "question-1" },
    { level: 3, text: "Answer 1", id: "answer-1" },
    { level: 2, text: "Question 1", id: "question-1-2" }
  ]);
});

test("buildQuestionAnchors keeps large question banks directly navigable", () => {
  const anchors = buildQuestionAnchors(
    [
      { level: 1, text: "PYQ Answer Bank" },
      { level: 2, text: "Question 1" },
      { level: 3, text: "Answer 1" },
      { level: 2, text: "Method Notes" },
      { level: 2, text: "Question 2" },
      { level: 3, text: "Answer 2" },
      { level: 2, text: "Question 2" }
    ],
    2
  );

  assert.deepEqual(anchors, [
    { level: 2, text: "Question 1", id: "question-1" },
    { level: 2, text: "Question 2", id: "question-2" }
  ]);
});
