import assert from "node:assert/strict";
import test from "node:test";
import { getGateData, normaliseGateQuestion, scoreGateAttempt, scoreGateQuestion, validateGateData } from "@/lib/gate";
import { buildGateTest, selectGateQuestions } from "@/lib/gate-tests";
import type { GateExamData, GateQuestion } from "@/lib/gate-types";

const provenance = {
  sourceType: "official-key" as const,
  sourceId: "gate-ee-2024-key",
  title: "GATE 2024 EE official answer key",
  officialKey: { sourceId: "gate-ee-2024-key", title: "GATE 2024 EE official answer key", year: 2024 }
};

function question(overrides: Partial<GateQuestion> & Pick<GateQuestion, "id" | "subject" | "section" | "topic" | "type" | "answer" | "marks">): GateQuestion {
  return {
    exam: "GATE",
    stem: `Question ${overrides.id}`,
    options: ["A", "B", "C", "D"].map((text, index) => ({ id: String.fromCharCode(97 + index), text })),
    provenance,
    ...overrides
  };
}

const fixtures: GateQuestion[] = [
  question({ id: "ee-circuit-2024-1", subject: "EE", section: "circuits", topic: "network-theorems", type: "mcq", answer: { type: "mcq", correctOption: "a" }, marks: 1, year: 2024 }),
  question({ id: "ee-circuit-2023-2", subject: "EE", section: "circuits", topic: "network-theorems", type: "msq", answer: { type: "msq", correctOptions: ["a", "c"] }, marks: 2, year: 2023 }),
  question({ id: "da-ml-2024-3", subject: "DA", section: "machine-learning", topic: "regression", type: "nat", answer: { type: "nat", acceptedRange: { min: 1.25, max: 1.25 } }, marks: 2, year: 2024 })
];

test("GATE scoring applies MCQ one-third/two-third negatives and no MSQ/NAT negative", () => {
  assert.equal(scoreGateQuestion(fixtures[0]!, "b").score, -1 / 3);
  assert.equal(scoreGateQuestion(fixtures[1]!, ["b"]).score, 0);
  assert.equal(scoreGateQuestion(fixtures[1]!, ["a", "c"]).score, 2);
  assert.equal(scoreGateQuestion(fixtures[2]!, 1.24).score, 0);
  assert.equal(scoreGateQuestion(fixtures[2]!, 1.25).score, 2);
  assert.equal(scoreGateAttempt(fixtures, { [fixtures[0]!.id]: "b", [fixtures[1]!.id]: ["b"], [fixtures[2]!.id]: 1.25 }).score, 5 / 3);
});

test("GATE custom tests filter subject, granular topic, year, type, count/all, and stable seed", () => {
  assert.equal(selectGateQuestions(fixtures, { subject: "EE", topic: "network-theorems", year: 2024 }).length, 1);
  const first = buildGateTest(fixtures, { subject: "EE", count: 1, seed: "repeatable" });
  const second = buildGateTest(fixtures, { subject: "EE", count: 1, seed: "repeatable" });
  assert.deepEqual(first.questions.map((item) => item.id), second.questions.map((item) => item.id));
  assert.equal(buildGateTest({ subject: "EE", count: "all" }, fixtures).questionCount, 2);
  assert.equal(buildGateTest({ type: "nat", count: "all" }, fixtures).questionCount, 1);
});

test("GATE validator enforces official-key provenance and exact NAT ranges", () => {
  const data: GateExamData = {
    generatedAt: "fixture",
    exam: { code: "GATE", title: "GATE", subjects: ["EE", "DA"] },
    topics: [
      { slug: "network-theorems", title: "Network Theorems", subject: "EE", section: "circuits", questionIds: ["ee-circuit-2024-1", "ee-circuit-2023-2"] },
      { slug: "regression", title: "Regression", subject: "DA", section: "machine-learning", questionIds: ["da-ml-2024-3"] }
    ],
    questions: fixtures
  };
  assert.equal(validateGateData(data).ok, true);
  const invalid = { ...fixtures[2]!, answer: { type: "nat" as const, acceptedRange: { min: 3, max: 2 } } };
  assert.equal(validateGateData({ ...data, questions: [...fixtures.slice(0, 2), invalid] }).ok, false);
});

test("GATE runtime provenance never serializes private corpus paths", () => {
  const question = normaliseGateQuestion({
    id: "private-path-fixture",
    subject: "EE",
    section: "circuits",
    topic: "network-theorems",
    type: "MCQ",
    stem: "A source-backed fixture question",
    options: ["A", "B", "C", "D"].map((label) => ({ label, text: label })),
    answer: { kind: "MCQ", value: "A" },
    marks: 1,
    provenance: {
      sourceType: "official-key",
      sourceId: "key",
      title: "Official key",
      question_source: "/home/sushi/MITEEE_LOCAL_ARTIFACTS/private.pdf",
      answer_key_source: "/home/sushi/MITEEE_LOCAL_ARTIFACTS/key.pdf",
      officialKey: { sourceId: "key", title: "Official key", year: 2024, url: "https://gate2027.iitm.ac.in/key.pdf" }
    },
    stimulus: { kind: "image", path: "/home/sushi/MITEEE_LOCAL_ARTIFACTS/crop.png", alt: "private crop" }
  });
  assert.ok(question);
  const serialized = JSON.stringify(question);
  assert.doesNotMatch(serialized, /\/home\/sushi|MITEEE_LOCAL_ARTIFACTS/);
  assert.equal(question?.provenance.questionSource, undefined);
  assert.equal(question?.provenance.answerKeySource, undefined);
  assert.equal(question?.stimulus, undefined);
  assert.equal(question?.provenance.officialKey?.url, "https://gate2027.iitm.ac.in/key.pdf");

  const runtime = JSON.stringify(getGateData());
  assert.doesNotMatch(runtime, /\/home\/sushi\/MITEEE_LOCAL_ARTIFACTS/);
});
