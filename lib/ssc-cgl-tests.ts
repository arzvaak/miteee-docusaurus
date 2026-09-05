import type { SscCglAttemptInput, SscCglAttemptResult, SscCglQuestion, SscCglRankSnapshot, SscCglSectionResult, SscCglTestDetail } from "@/lib/exam-types";

export function simulateSscRank(input: { score: number; maxScore: number; accuracy: number; totalTimeSeconds: number }): SscCglRankSnapshot {
  const scoreRatio = input.maxScore > 0 ? input.score / input.maxScore : 0;
  const speedBonus = input.totalTimeSeconds <= 3300 ? 4 : input.totalTimeSeconds <= 3600 ? 1 : -3;
  const percentile = Math.max(1, Math.min(99.9, Math.round((scoreRatio * 94 + input.accuracy * 4 + speedBonus) * 10) / 10));
  const rankBucket = percentile >= 97
    ? "Top 1-3% simulation"
    : percentile >= 90
      ? "Top 10% simulation"
      : percentile >= 70
        ? "Competitive band simulation"
        : "Repair band simulation";

  return {
    percentile,
    rankBucket,
    basis: "Local deterministic simulation from score, accuracy, and time; not an official SSC rank."
  };
}

function answerState(question: SscCglQuestion, selected: SscCglAttemptInput["answers"][string]) {
  if (!selected || selected === "z") return "unattempted";
  return selected === question.correctOption ? "correct" : "wrong";
}

function repairAction(item: { wrong: number; unattempted: number }) {
  const parts = [];
  if (item.wrong > 0) parts.push(`${item.wrong} wrong answer${item.wrong === 1 ? "" : "s"}`);
  if (item.unattempted > 0) parts.push(`${item.unattempted} unattempted`);
  return `Repair ${parts.join(" and ")} with the topic note, then redo a 25-question section mock.`;
}

function round1(value: number) {
  return Math.round(value * 10) / 10;
}

function pacingStatus(input: { averageSecondsPerQuestion: number; targetSecondsPerQuestion: number; wrong: number; unattempted: number }) {
  if (input.averageSecondsPerQuestion <= 0) return "no-timing" as const;
  if (input.averageSecondsPerQuestion > input.targetSecondsPerQuestion + 2) return "slow" as const;
  if (
    input.averageSecondsPerQuestion < input.targetSecondsPerQuestion - 8
    && (input.wrong > 0 || input.unattempted > 0)
  ) {
    return "rushed" as const;
  }
  return "on-pace" as const;
}

function sectionAction(input: {
  title: string;
  score: number;
  targetScore: number;
  wrong: number;
  unattempted: number;
  pacingStatus: "on-pace" | "slow" | "rushed" | "no-timing";
  averageSecondsPerQuestion: number;
  targetSecondsPerQuestion: number;
}) {
  if (input.score >= input.targetScore && input.pacingStatus !== "slow") {
    return "Perfect section. Bank it, then retest later to prove the speed holds under fatigue.";
  }
  if (input.score >= input.targetScore && input.pacingStatus === "slow") {
    return `Accuracy is clean. Repeat ${input.title} with a ${input.targetSecondsPerQuestion}-second question ceiling.`;
  }
  if (input.pacingStatus === "slow") {
    return `${input.title} is leaking time at ${input.averageSecondsPerQuestion}s/question. Drill skipped questions first, then redo a timed section.`;
  }
  if (input.pacingStatus === "rushed") {
    return `${input.title} was too fast for the error rate. Slow the first read, mark traps, and redo the missed topics.`;
  }
  if (input.wrong > 0) {
    return `${input.title} lost ${input.wrong * 2.5} marks to wrong answers. Repair concepts before adding more mocks.`;
  }
  return `${input.title} lost ${input.unattempted * 2} marks to skipped questions. Build faster first-pass selection.`;
}

function nextBestAction(result: { marksLost: number; wrong: number; unattempted: number; pacingStatus: "on-pace" | "slow" | "rushed" | "no-timing"; repairQueueLength: number }) {
  if (result.marksLost <= 0 && result.pacingStatus !== "slow") {
    return "Perfect stored attempt. Retest after a break and keep the same pacing under fatigue.";
  }
  if (result.wrong > 0) {
    return "First repair wrong answers: each wrong answer costs 2.5 marks against a perfect paper.";
  }
  if (result.unattempted > 0) {
    return "First repair skipped questions: each blank costs 2 marks against a perfect paper.";
  }
  if (result.pacingStatus === "slow") {
    return "Accuracy is not the issue now. Cut average time back to the 36-second lane.";
  }
  if (result.repairQueueLength > 0) {
    return "Open the repair queue, revise the linked topic notes, then redo one timed section.";
  }
  return "Use a harder 200/200 mock and keep the same review discipline.";
}

export function scoreSscAttempt(test: SscCglTestDetail, attempt: SscCglAttemptInput): SscCglAttemptResult {
  const sectionResults = test.sections.map((section) => {
    let correct = 0;
    let wrong = 0;
    let unattempted = 0;
    for (const question of section.questions) {
      const state = answerState(question, attempt.answers[question.id]);
      if (state === "correct") correct += 1;
      if (state === "wrong") wrong += 1;
      if (state === "unattempted") unattempted += 1;
    }
    const score = correct * 2 + wrong * -0.5;
    const targetScore = section.questions.length * 2;
    const marksLost = round1(targetScore - score);
    const attempted = section.questions.length - unattempted;
    const accuracy = attempted > 0 ? correct / attempted : 0;
    const targetSecondsPerQuestion = section.questions.length > 0 ? Math.round(section.timerSeconds / section.questions.length) : 36;
    const timeSpentSeconds = attempt.sectionTimeSpentSeconds[section.id] ?? 0;
    const averageSecondsPerQuestion = section.questions.length > 0 ? round1(timeSpentSeconds / section.questions.length) : 0;
    const paceDeltaSecondsPerQuestion = round1(averageSecondsPerQuestion - targetSecondsPerQuestion);
    const pace = pacingStatus({ averageSecondsPerQuestion, targetSecondsPerQuestion, wrong, unattempted });
    const targetStatus: SscCglSectionResult["targetStatus"] = marksLost <= 0 && pace !== "slow"
      ? "perfect"
      : marksLost <= 0
        ? "repair-speed"
        : pace === "slow" || pace === "rushed"
          ? "repair-both"
          : "repair-marks";
    return {
      sectionId: section.id,
      title: section.title,
      correct,
      wrong,
      unattempted,
      score,
      timeSpentSeconds,
      targetScore,
      marksLost,
      attempted,
      accuracy,
      targetSecondsPerQuestion,
      averageSecondsPerQuestion,
      paceDeltaSecondsPerQuestion,
      pacingStatus: pace,
      targetStatus,
      recommendedAction: sectionAction({
        title: section.title,
        score,
        targetScore,
        wrong,
        unattempted,
        pacingStatus: pace,
        averageSecondsPerQuestion,
        targetSecondsPerQuestion
      })
    };
  });
  const correct = sectionResults.reduce((sum, section) => sum + section.correct, 0);
  const wrong = sectionResults.reduce((sum, section) => sum + section.wrong, 0);
  const unattempted = sectionResults.reduce((sum, section) => sum + section.unattempted, 0);
  const score = sectionResults.reduce((sum, section) => sum + section.score, 0);
  const totalQuestions = test.sections.reduce((sum, section) => sum + section.questions.length, 0);
  const attempted = totalQuestions - unattempted;
  const accuracy = attempted > 0 ? correct / attempted : 0;
  const totalTimeSeconds = sectionResults.reduce((sum, section) => sum + section.timeSpentSeconds, 0);
  const targetSecondsPerQuestion = totalQuestions > 0 ? Math.round(test.durationSeconds / totalQuestions) : 36;
  const averageSecondsPerQuestion = totalQuestions > 0 ? round1(totalTimeSeconds / totalQuestions) : 0;
  const totalPacingStatus = pacingStatus({ averageSecondsPerQuestion, targetSecondsPerQuestion, wrong, unattempted });
  const missesByTopic = new Map<string, { title: string; section: SscCglQuestion["section"]; misses: number }>();
  const repairByTopic = new Map<string, { title: string; section: SscCglQuestion["section"]; wrong: number; unattempted: number }>();

  for (const section of test.sections) {
    for (const question of section.questions) {
      const state = answerState(question, attempt.answers[question.id]);
      if (state === "correct") continue;
      const repair = repairByTopic.get(question.topic) ?? { title: question.subtopic, section: question.section, wrong: 0, unattempted: 0 };
      if (state === "wrong") {
        repair.wrong += 1;
        const current = missesByTopic.get(question.topic) ?? { title: question.subtopic, section: question.section, misses: 0 };
        current.misses += 1;
        missesByTopic.set(question.topic, current);
      }
      if (state === "unattempted") repair.unattempted += 1;
      repairByTopic.set(question.topic, repair);
    }
  }

  const repairQueue = [...repairByTopic.entries()]
    .map(([slug, value]) => {
      const totalRepair = value.wrong + value.unattempted;
      return {
        slug,
        ...value,
        totalRepair,
        href: `/exams/ssc-cgl/practice/${slug}`,
        recommendedAction: repairAction(value)
      };
    })
    .filter((item) => item.totalRepair > 0)
    .sort((a, b) => b.totalRepair - a.totalRepair || b.wrong - a.wrong || a.title.localeCompare(b.title))
    .slice(0, 8);
  const marksLost = round1(test.maxScore - score);

  return {
    attemptId: attempt.attemptId,
    testId: test.id,
    score,
    maxScore: test.maxScore,
    marksLost,
    scoreGapTo200: marksLost,
    correct,
    wrong,
    unattempted,
    accuracy,
    totalTimeSeconds,
    targetSecondsPerQuestion,
    averageSecondsPerQuestion,
    pacingStatus: totalPacingStatus,
    nextBestAction: nextBestAction({ marksLost, wrong, unattempted, pacingStatus: totalPacingStatus, repairQueueLength: repairQueue.length }),
    sectionResults,
    weakTopics: [...missesByTopic.entries()]
      .map(([slug, value]) => ({ slug, ...value }))
      .sort((a, b) => b.misses - a.misses)
      .slice(0, 5),
    repairQueue,
    rank: simulateSscRank({ score, maxScore: test.maxScore, accuracy, totalTimeSeconds })
  };
}
