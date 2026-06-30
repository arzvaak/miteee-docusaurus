import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { buildExamData } from "@/scripts/build-exam-data";

test("buildExamData writes validated SSC CGL generated artifacts", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "ssc-cgl-exam-data-"));
  const generatedRoot = path.join(root, "generated");

  const result = buildExamData({ generatedRoot });

  assert.equal(result.validation.ok, true, result.validation.errors.join("\n"));
  assert.ok(fs.existsSync(path.join(generatedRoot, "exams", "ssc-cgl", "index.json")));
  assert.ok(fs.existsSync(path.join(generatedRoot, "exams", "ssc-cgl", "questions.json")));
  assert.ok(fs.existsSync(path.join(generatedRoot, "exams", "ssc-cgl", "topics.json")));
  assert.ok(fs.existsSync(path.join(generatedRoot, "exams", "ssc-cgl", "tests.json")));
  assert.ok(fs.existsSync(path.join(generatedRoot, "exams", "ssc-cgl", "ai-audit-report.json")));
  assert.equal(result.aiAudit.reviewer.orchestrator, "DeepSeek V4 Pro content audit hook");
  assert.equal(result.aiAudit.corpus.totalQuestions, result.data.questions.length);
  assert.ok(result.aiAudit.topics.total > 0);
});
