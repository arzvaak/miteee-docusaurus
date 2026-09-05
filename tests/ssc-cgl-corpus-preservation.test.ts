import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import test from "node:test";

type RuntimeQuestion = { id: string; section: string; provenance: { sourceType: string } };
type RuntimeIndex = { questions: RuntimeQuestion[]; topics: unknown[]; tests: unknown[] };

const runtime = JSON.parse(fs.readFileSync("data/generated/exams/ssc-cgl/index.json", "utf8")) as RuntimeIndex;

test("the retired notes and separate Quant course do not alter the SSC runtime corpus", () => {
  const idHash = crypto.createHash("sha256")
    .update(runtime.questions.map((question) => question.id).sort().join("\n"))
    .digest("hex");
  const bySource = Object.fromEntries([...new Set(runtime.questions.map((question) => question.provenance.sourceType))]
    .sort()
    .map((source) => [source, runtime.questions.filter((question) => question.provenance.sourceType === source).length]));
  const bySection = Object.fromEntries([...new Set(runtime.questions.map((question) => question.section))]
    .sort()
    .map((section) => [section, runtime.questions.filter((question) => question.section === section).length]));

  assert.equal(runtime.questions.length, 29_631);
  assert.equal(runtime.topics.length, 46);
  assert.equal(runtime.tests.length, 1_342);
  assert.equal(idHash, "867b0d650824b2cd1ab8551e0d5f1b2aa9c94d48b90699f2a9211b1761fe21c1");
  assert.deepEqual(bySource, { book_user_provided: 22_139, original_practice: 7_492 });
  assert.deepEqual(bySection, {
    "english-comprehension": 6_132,
    "general-awareness": 7_902,
    "quantitative-aptitude": 9_486,
    reasoning: 6_111
  });
});
