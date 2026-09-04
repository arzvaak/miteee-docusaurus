import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { normalizeGateQuestions } from "@/components/GateUi";
import { getGateDashboard, getGateData, validateGateData } from "@/lib/gate";
import { buildExamData } from "@/scripts/build-exam-data";

test("reviewed GATE source is playable, explained, and provenance-safe", () => {
  const data = getGateData();
  const validation = validateGateData(data);
  assert.equal(validation.ok, true, validation.errors.join("\n"));
  assert.equal(data.questions.length, 48);
  assert.equal(data.questions.filter((question) => question.subject === "EE").length, 15);
  assert.equal(data.questions.filter((question) => question.subject === "DA").length, 33);
  assert.equal(data.questions.every((question) => Boolean(question.explanation?.trim())), true);
  assert.equal(data.questions.every((question) => question.answer.type !== "nat" || Boolean(question.answer.acceptedRange)), true);
  assert.equal(data.questions.every((question) => !question.options?.some((option) => /Page \d+ of \d+|Organizing Institute:|GATE 20\d{2}/i.test(option.text))), true);
  assert.equal(data.questions.every((question) => !question.options?.length || !/\n\s*\(\s*A\s*\)\s+/i.test(question.stem)), true);

  const visualQuestions = data.questions.filter((question) => question.stimulus?.path);
  assert.equal(visualQuestions.length, 11);
  for (const question of visualQuestions) {
    assert.match(question.stimulus?.path ?? "", /^\/content-assets\/gate\/(ee|da)\//);
    assert.equal(fs.existsSync(path.join(process.cwd(), "public", question.stimulus!.path!.slice(1))), true);
  }

  const clientQuestions = normalizeGateQuestions(data.questions, "EE");
  assert.equal(clientQuestions.some((question) => question.source.startsWith("/home/") || question.officialKeyTitle?.startsWith("/home/")), false);
});

test("GATE dashboard counts only playable topics and sections", () => {
  const dashboard = getGateDashboard();
  assert.deepEqual(dashboard.subjectCounts, { EE: 15, DA: 33 });
  assert.equal(dashboard.topicCount, 25);
  assert.equal(dashboard.papers.find((paper) => paper.subject === "EE")?.sectionCount, 1);
  assert.equal(dashboard.papers.find((paper) => paper.subject === "DA")?.sectionCount, 1);
});

test("exam data build emits a validated GATE runtime index", () => {
  const generatedRoot = fs.mkdtempSync(path.join(os.tmpdir(), "miteee-gate-build-"));
  const result = buildExamData({ generatedRoot });
  assert.equal(result.gateValidation.ok, true);
  assert.equal(result.gateData.questions.length, 48);
  const output = path.join(generatedRoot, "exams", "gate", "index.json");
  assert.equal(fs.existsSync(output), true);
  assert.equal(JSON.parse(fs.readFileSync(output, "utf8")).questions.length, 48);
});
