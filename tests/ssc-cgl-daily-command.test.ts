import assert from "node:assert/strict";
import test from "node:test";
import { buildSscDailyCommand } from "@/lib/ssc-cgl-daily-command";
import type { SscAttemptHistoryItem } from "@/lib/ssc-cgl-attempt-history";
import type { SscCglPracticeTopicSummary } from "@/lib/ssc-cgl";
import type { SscMistakeBankItem } from "@/lib/ssc-cgl-mistake-bank";
import {
  parseSscTopicPracticeMemory,
  sscTopicPracticeStoragePrefix,
  type SscTopicPracticeMemoryItem
} from "@/lib/ssc-cgl-topic-practice-memory";

function mistake(overrides: Partial<SscMistakeBankItem> = {}): SscMistakeBankItem {
  return {
    questionId: "q1",
    attemptId: "attempt-1",
    testId: "test-1",
    testTitle: "Quant Sprint",
    resultHref: "/exams/ssc-cgl/results/attempt-1",
    sectionId: "quantitative-aptitude",
    sectionTitle: "Quantitative Aptitude",
    topic: "Percentages",
    subtopic: "Successive percentage",
    topicHref: "/exams/ssc-cgl/topics/percentages",
    stem: "Find the final value after two successive discounts.",
    status: "wrong",
    chosenOptionText: "A · 20%",
    correctOptionText: "B · 19%",
    explanation: "Answer: B. Method: multiply complements.",
    sourceLabel: "Book · page 10",
    savedAt: "2026-06-29T04:00:00.000Z",
    ...overrides
  };
}

function attempt(overrides: Partial<SscAttemptHistoryItem> = {}): SscAttemptHistoryItem {
  return {
    attemptId: "attempt-1",
    testId: "full-mock-1",
    testTitle: "Full Mock 1",
    mode: "full_mock",
    score: 152,
    maxScore: 200,
    marksLost: 48,
    percentile: 82,
    rankBucket: "Top 18%",
    correct: 80,
    wrong: 16,
    unattempted: 4,
    savedAt: "2026-06-29T03:00:00.000Z",
    topRepairTopic: "Percentages",
    topRepairHref: "/exams/ssc-cgl/topics/percentages",
    ...overrides
  };
}

function topicPractice(overrides: Partial<SscTopicPracticeMemoryItem> = {}): SscTopicPracticeMemoryItem {
  return {
    topicSlug: "percentages",
    topicTitle: "Percentages",
    subject: "Quantitative Aptitude",
    href: "/exams/ssc-cgl/practice/percentages",
    index: 12,
    answered: 40,
    totalQuestions: 320,
    correct: 32,
    wrong: 6,
    skipped: 2,
    savedAt: "2026-06-29T05:00:00.000Z",
    ...overrides
  };
}

function topicCatalog(overrides: Partial<SscCglPracticeTopicSummary> = {}): SscCglPracticeTopicSummary {
  return {
    slug: "percentages",
    title: "Percentages",
    subject: "Quantitative Aptitude",
    section: "quantitative-aptitude",
    href: "/exams/ssc-cgl/practice/percentages",
    totalQuestions: 500,
    reviewedQuestions: 500,
    bookBackedQuestions: 312,
    pyqQuestions: 312,
    gapRepairQuestions: 188,
    ...overrides
  };
}

test("SSC daily command repairs the newest open mistake before starting another mock", () => {
  const command = buildSscDailyCommand(
    [
      mistake({ questionId: "older", savedAt: "2026-06-28T04:00:00.000Z", topic: "Ratio", topicHref: "/exams/ssc-cgl/topics/ratio-proportion" }),
      mistake()
    ],
    [attempt()]
  );

  assert.equal(command.primary.kind, "mistake");
  assert.equal(command.primary.href, "/exams/ssc-cgl/practice/percentages?mode=misses");
  assert.match(command.primary.title, /Close mistake/);
  assert.match(command.primary.body, /Successive percentage/);
  assert.equal(command.metrics.openMistakes, 2);
  assert.equal(command.metrics.latestScoreLabel, "152/200");
});

test("SSC daily command labels slow correct topic answers as speed repairs", () => {
  const command = buildSscDailyCommand(
    [
      mistake({
        status: "slow",
        chosenOptionText: "B · 19%",
        correctOptionText: "B · 19%",
        explanation: "Correct answer, but it took 44s against the 36s SSC pace target.",
        savedAt: "2026-06-29T06:00:00.000Z"
      })
    ],
    [attempt()]
  );

  assert.equal(command.primary.kind, "mistake");
  assert.equal(command.primary.label, "Repair speed");
  assert.equal(command.primary.href, "/exams/ssc-cgl/practice/percentages?mode=speed");
  assert.match(command.primary.title, /Speed repair/);
  assert.match(command.primary.body, /36-second/);
  assert.equal(command.metrics.openMistakes, 1);
  assert.equal(command.metrics.openSpeedRepairs, 1);
});

test("SSC daily command starts a full mock when no local attempt exists", () => {
  const command = buildSscDailyCommand([], []);

  assert.equal(command.primary.kind, "full-mock");
  assert.equal(command.primary.href, "/exams/ssc-cgl/tests?mode=full_mock");
  assert.equal(command.metrics.openMistakes, 0);
  assert.equal(command.metrics.latestScoreLabel, "No attempt");
});

test("SSC daily command starts the next unattempted topic queue when the full topic catalog is supplied", () => {
  const command = buildSscDailyCommand([], [], [], [topicCatalog()]);

  assert.equal(command.primary.kind, "topic-practice");
  assert.equal(command.primary.label, "Start topic queue");
  assert.equal(command.primary.href, "/exams/ssc-cgl/practice/percentages");
  assert.match(command.primary.title, /Start Percentages/);
  assert.match(command.primary.body, /0\/500 answered/);
  assert.equal(command.metrics.openTopicQueues, 1);
});

test("SSC daily command uses latest attempt repair when mistake bank is clear", () => {
  const command = buildSscDailyCommand([], [attempt()]);

  assert.equal(command.primary.kind, "attempt-repair");
  assert.equal(command.primary.href, "/exams/ssc-cgl/topics/percentages");
  assert.match(command.primary.body, /48 marks lost/);
  assert.equal(command.metrics.openAttemptsWithRepair, 1);
});

test("SSC daily command continues unfinished topic practice before generic attempt repair", () => {
  const command = buildSscDailyCommand([], [attempt()], [topicPractice()], [topicCatalog()]);

  assert.equal(command.primary.kind, "topic-practice");
  assert.equal(command.primary.href, "/exams/ssc-cgl/practice/percentages");
  assert.match(command.primary.title, /Continue Percentages/);
  assert.match(command.primary.body, /40\/320 answered/);
  assert.equal(command.metrics.openTopicQueues, 1);
});

test("SSC daily command skips completed topic queues when selecting the next catalog topic", () => {
  const command = buildSscDailyCommand(
    [],
    [],
    [topicPractice({ topicSlug: "percentages", answered: 500, totalQuestions: 500 })],
    [
      topicCatalog(),
      topicCatalog({
        slug: "ratio-proportion",
        title: "Ratio and Proportion",
        href: "/exams/ssc-cgl/practice/ratio-proportion"
      })
    ]
  );

  assert.equal(command.primary.kind, "topic-practice");
  assert.equal(command.primary.href, "/exams/ssc-cgl/practice/ratio-proportion");
  assert.match(command.primary.title, /Start Ratio and Proportion/);
  assert.equal(command.metrics.openTopicQueues, 1);
});

test("SSC topic practice memory parser keeps progress metadata for dashboard command", () => {
  const parsed = parseSscTopicPracticeMemory(
    `${sscTopicPracticeStoragePrefix}percentages`,
    JSON.stringify({
      index: 12,
      topicSlug: "percentages",
      topicTitle: "Percentages",
      subject: "Quantitative Aptitude",
      totalQuestions: 320,
      answers: { q1: "a", q2: "z", q3: "b" },
      correct: 1,
      wrong: 1,
      skipped: 1,
      savedAt: "2026-06-29T05:00:00.000Z"
    })
  );

  assert.deepEqual(parsed, {
    topicSlug: "percentages",
    topicTitle: "Percentages",
    subject: "Quantitative Aptitude",
    href: "/exams/ssc-cgl/practice/percentages",
    index: 12,
    answered: 3,
    totalQuestions: 320,
    correct: 1,
    wrong: 1,
    skipped: 1,
    savedAt: "2026-06-29T05:00:00.000Z"
  });
});
