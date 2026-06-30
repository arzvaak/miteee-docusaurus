import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { buildExamData } from "@/scripts/build-exam-data";
import { getSscCglDashboard, getSscCglTests, getSscQuestions, getSscTopics } from "@/lib/ssc-cgl";

test.before(() => {
  buildExamData();
});

test("SSC CGL syllabus map covers a broad Tier-I topic grid", () => {
  const topics = getSscTopics();
  const subjects = new Set(topics.map((topic) => topic.subject));

  assert.ok(topics.length >= 40, `expected at least 40 topics, got ${topics.length}`);
  assert.deepEqual([...subjects].sort(), [
    "English Comprehension",
    "General Awareness",
    "General Intelligence and Reasoning",
    "Quantitative Aptitude"
  ].sort());
  for (const subject of subjects) {
    assert.ok(topics.filter((topic) => topic.subject === subject).length >= 8, `${subject} needs at least 8 topics`);
  }
});

test("SSC CGL reviewed pool keeps uploaded-book PYQs primary and marks gap-repair practice separately", () => {
  const questions = getSscQuestions();
  const tests = getSscCglTests();
  const dashboard = getSscCglDashboard();
  const reviewed = questions.filter((question) => question.reviewStatus === "reviewed");
  const bookQuestions = reviewed.filter((question) => question.provenance.sourceType === "book_user_provided");
  const gapRepairQuestions = reviewed.filter((question) => question.provenance.sourceType === "original_practice" && question.conceptTags.includes("gap-repair"));

  assert.ok(reviewed.length >= 211);
  assert.ok(bookQuestions.length >= 19875);
  assert.ok(gapRepairQuestions.length >= 1);
  assert.ok(gapRepairQuestions.some((question) => question.section === "reasoning"));
  assert.ok(gapRepairQuestions.some((question) => question.section === "quantitative-aptitude"));
  assert.ok(gapRepairQuestions.some((question) => question.section === "general-awareness"));
  assert.deepEqual(
    [...new Set(reviewed.map((question) => question.section))].sort(),
    ["english-comprehension", "general-awareness", "quantitative-aptitude", "reasoning"].sort()
  );
  assert.ok(tests.filter((item) => item.mode === "full_mock" && item.id.startsWith("ssc-cgl-book-200-mode-mock-")).length >= 1);
  assert.equal(dashboard.readiness.reviewedQuestions, reviewed.length);
  assert.equal(dashboard.readiness.fullMocks, tests.filter((item) => item.mode === "full_mock").length);
});

test("SSC CGL source registry keeps risky web resources out of copied corpus", () => {
  const registryPath = path.join(process.cwd(), "data", "exams", "ssc-cgl", "source-registry.json");
  const registry = JSON.parse(fs.readFileSync(registryPath, "utf8")) as {
    sources: Array<{ id: string; type: string; acquisition: string; publishPolicy: string }>;
  };
  const scribd = registry.sources.find((source) => /scribd/i.test(source.id));

  assert.ok(scribd, "Scribd should be tracked as a resource class because the user requested it");
  assert.equal(scribd.type, "copyright_risk_reference");
  assert.match(scribd.acquisition, /link/i);
  assert.match(scribd.publishPolicy, /do not copy/i);
});

test("daily news pipeline tracks official source mix beyond PIB", () => {
  const script = fs.readFileSync(path.join(process.cwd(), "scripts", "daily_news_pipeline.py"), "utf8");

  assert.match(script, /RBI/);
  assert.match(script, /PRS/);
  assert.match(script, /robots/i);
  assert.match(script, /Crawl-delay/i);
});
