import assert from "node:assert/strict";
import fs from "node:fs";
import { register } from "node:module";
import path from "node:path";
import test from "node:test";
import type { SscCglQuestion, SscCglTestDetail } from "@/lib/exam-types";
import { buildSscCglLearnerAttemptEvidence } from "@/lib/learner-weakness-engine";

register(`data:text/javascript,${encodeURIComponent(`
  export async function resolve(specifier, context, nextResolve) {
    if (specifier.endsWith(".css")) {
      return { shortCircuit: true, url: new URL(specifier, context.parentURL).href };
    }
    return nextResolve(specifier, context);
  }
  export async function load(url, context, nextLoad) {
    if (url.endsWith(".css")) {
      return {
        format: "module",
        shortCircuit: true,
        source: "export default new Proxy({}, { get: (_target, property) => String(property) });"
      };
    }
    return nextLoad(url, context);
  }
`)}`);

const { getSectionEvidenceTargetSeconds } = await import("@/components/TimedTestRunner");

test("timed-test evidence always has a positive SSC comparison target", () => {
  assert.equal(getSectionEvidenceTargetSeconds(900, 25), 36);
  assert.equal(getSectionEvidenceTargetSeconds(600, 10), 60);
  assert.equal(getSectionEvidenceTargetSeconds(0, 10), 36);
  assert.equal(getSectionEvidenceTargetSeconds(-1, 10), 36);
  assert.equal(getSectionEvidenceTargetSeconds(Number.NaN, 10), 36);
});

test("timed tests batch-persist normalized learner evidence with real topic identities", () => {
  const source = fs.readFileSync(path.join(process.cwd(), "components", "TimedTestRunner.tsx"), "utf8");

  assert.match(source, /const learnerEvidence = test\.sections\.flatMap/);
  assert.match(source, /buildSscCglLearnerAttemptEvidence\(\{/);
  assert.match(source, /timeSpentSeconds: averageTime/);
  assert.match(source, /targetTimeSeconds: targetTime/);
  assert.match(source, /persistLearnerAttemptEvidenceBatch\(learnerEvidence\)/);
  assert.match(source, /getSectionEvidenceTargetSeconds\(testSection\.timerSeconds, testSection\.questions\.length\)/);
  assert.doesNotMatch(source, /topicLabel:\s*testQuestion\.subtopic/);
});

test("timed evidence derives the topic heading from its SSC topic slug, not source-like subtopic text", () => {
  const question = {
    id: "series-coding-1",
    section: "reasoning",
    topic: "series-coding",
    subtopic: "Scribd HTML Pages",
    stem: "Find the next term.",
    correctOption: "a"
  } as SscCglQuestion;
  const timedTest = {
    mode: "topic_drill",
    sections: [{ id: "reasoning", title: "General Intelligence and Reasoning", timerSeconds: 180, questions: [question] }]
  } as SscCglTestDetail;
  const evidence = buildSscCglLearnerAttemptEvidence({
    attemptId: "topic-label-regression",
    test: timedTest,
    question,
    selectedOption: "a",
    confidence: "medium",
    timeSpentSeconds: 30,
    targetTimeSeconds: 36,
    answeredAt: "2026-07-14T10:00:00.000Z"
  });

  assert.equal(evidence?.topic.id, "series-coding");
  assert.equal(evidence?.topic.label, "Series Coding");
  assert.notEqual(evidence?.topic.label, question.subtopic);
});

test("topic practice persists the current question elapsed time as learner evidence", () => {
  const source = fs.readFileSync(path.join(process.cwd(), "components", "SscTopicPracticeClient.tsx"), "utf8");

  assert.match(source, /const questionElapsedSeconds = item\.id === currentQuestionId \? elapsedSeconds : 0/);
  assert.match(source, /persistLearnerAttemptEvidenceBatch\(\[\{/);
  assert.match(source, /topic: \{ id: topic\.slug, label: topic\.title \}/);
  assert.match(source, /question: \{ id: item\.id, label: item\.stem \}/);
  assert.match(source, /timeSpentSeconds: questionElapsedSeconds/);
  assert.match(source, /targetTimeSeconds: targetSecondsPerQuestion/);
});
