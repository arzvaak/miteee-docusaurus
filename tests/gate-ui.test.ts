import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { normalizeGateQuestions, normalizeGateTopics } from "@/components/GateUi";

test("GATE UI adapter preserves canonical answer discriminators and official provenance", () => {
  const [mcq, msq, nat] = normalizeGateQuestions([
    { id: "ee-1", subject: "EE", year: 2024, type: "mcq", stem: "MCQ", stimulus: { kind: "image", path: "/content-assets/gate/ee/q1.png", alt: "Circuit" }, options: [{ id: "A", text: "one" }], answer: { type: "mcq", correctOption: "A" }, marks: 1, provenance: { sourceType: "official-key", sourceId: "key-2024", title: "Official GATE 2024 key", officialKey: { sourceId: "key-2024", title: "Official GATE 2024 key", year: 2024 } } },
    { id: "da-1", subject: "DA", type: "msq", stem: "MSQ", options: [{ id: "A", text: "one" }, { id: "B", text: "two" }], answer: { type: "msq", correctOptions: ["A", "B"] }, marks: 2, provenance: { sourceType: "official-paper", sourceId: "paper", title: "Official paper" } },
    { id: "ee-2", subject: "EE", type: "nat", stem: "NAT", answer: { type: "nat", acceptedRange: { min: 1.2, max: 1.3 } }, marks: 1, provenance: { sourceType: "official-key", sourceId: "key", title: "Official key", officialKey: { sourceId: "key", title: "Official key", year: 2023 } } }
  ], "EE");
  assert.equal(mcq?.correctOption, "A");
  assert.deepEqual(mcq?.stimulus, { src: "/content-assets/gate/ee/q1.png", alt: "Circuit" });
  assert.deepEqual(msq?.correctOptions, ["A", "B"]);
  assert.deepEqual(nat?.answerRange, { min: 1.2, max: 1.3 });
  assert.equal(mcq?.officialKeyTitle, "Official GATE 2024 key");
  assert.equal(mcq?.negativeMarks, 1 / 3);
  assert.equal(msq?.negativeMarks, 0);
  assert.equal(nat?.explanationAvailable, false);
});

test("GATE route surface keeps practice, all-topic, builder, and runner isolated", () => {
  const root = process.cwd();
  const read = (...parts: string[]) => fs.readFileSync(path.join(root, ...parts), "utf8");
  const paper = read("app", "exams", "gate", "[paper]", "page.tsx");
  const builder = read("app", "exams", "gate", "[paper]", "practice", "page.tsx");
  const topic = read("app", "exams", "gate", "[paper]", "practice", "[topic]", "page.tsx");
  const runner = read("components", "GateRunner.tsx");
  assert.match(paper, /GatePaperDashboard/);
  assert.match(builder, /GateBuilder/);
  assert.match(topic, /GateRunner/);
  assert.match(topic, /buildGateTest/);
  assert.match(builder, /notFound\(\)/);
  assert.match(topic, /notFound\(\)/);
  assert.match(runner, /Official answer/);
  assert.match(runner, /localStorage/);
  assert.match(runner, /questionSetFingerprint/);
  assert.match(runner, /checkedMultiple/);
  assert.match(runner, /remaining/);
  assert.match(runner, /next\/image/);
  assert.doesNotMatch(runner, /study-minimal/);
});

test("GATE topics are grouped by section without dropping year metadata", () => {
  const topics = normalizeGateTopics([
    { slug: "signals", title: "Signals", subject: "EE", section: "core", questionCount: 12, years: [2022, 2024] },
    { slug: "probability", title: "Probability", subject: "DA", section: "math", questionCount: 8, years: [2023] }
  ], "EE");
  assert.equal(topics[0]?.section, "core");
  assert.deepEqual(topics[0]?.years, [2022, 2024]);
  assert.equal(topics[1]?.title, "Probability");
});

test("GATE UI adapter keeps verified asset stimuli and source page metadata", () => {
  const [question] = normalizeGateQuestions([{
    id: "ee-visual",
    subject: "EE",
    section: "circuits",
    topic: "network-theorems",
    topicTitle: "Network theorems",
    type: "mcq",
    stem: "Which waveform is shown?",
    options: ["A", "B", "C", "D"].map((label) => ({ id: label, text: label })),
    answer: { type: "mcq", correctOption: "A" },
    marks: 1,
    stimulus: { kind: "image", path: "/content-assets/gate/ee/ee-visual.png", alt: "Verified circuit crop", caption: "Circuit" },
    provenance: { sourceType: "official-key", sourceId: "key", title: "Official key", questionPages: [23], officialKey: { sourceId: "key", title: "Official key", year: 2026 } }
  }]);
  assert.deepEqual(question?.stimulus, { src: "/content-assets/gate/ee/ee-visual.png", alt: "Verified circuit crop", caption: "Circuit" });
  assert.equal(question?.sourcePage, "23");
});
