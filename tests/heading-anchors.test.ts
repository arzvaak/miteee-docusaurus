import assert from "node:assert/strict";
import test from "node:test";
import { buildHeadingAnchors, buildQuestionAnchors, headingAnchorId, isQuestionHeading, uniqueHeadingAnchorId } from "../lib/heading-anchors";

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

test("question heading recognition covers common generated and authored labels", () => {
  for (const heading of ["Question 12", "Question No. 12", "Q12. Transformer test", "Q. 12 — Transformer test", "Ques: 12"]) {
    assert.equal(isQuestionHeading(heading), true, heading);
  }

  for (const heading of ["12. Data preparation", "200/200 Drill", "Questions and answers", "Quarter 1 review"]) {
    assert.equal(isQuestionHeading(heading), false, heading);
  }
});

test("question anchors include Q-prefixed level-three banks and preserve renderer duplicate ids", () => {
  const anchors = buildQuestionAnchors([
    { level: 2, text: "Method" },
    { level: 4, text: "Q1. Duplicate label" },
    { level: 3, text: "Q1. Duplicate label" },
    { level: 3, text: "Q. 2: Follow-up" }
  ]);

  assert.deepEqual(anchors, [
    { level: 3, text: "Q1. Duplicate label", id: "q1-duplicate-label-2" },
    { level: 3, text: "Q. 2: Follow-up", id: "q-2-follow-up" }
  ]);
});
