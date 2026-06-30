import type { SscAttemptHistoryItem } from "@/lib/ssc-cgl-attempt-history";
import type { SscCglPracticeTopicSummary } from "@/lib/ssc-cgl";
import type { SscMistakeBankItem } from "@/lib/ssc-cgl-mistake-bank";
import type { SscTopicPracticeMemoryItem } from "@/lib/ssc-cgl-topic-practice-memory";

export type SscDailyCommandAction = {
  kind: "mistake" | "topic-practice" | "attempt-repair" | "full-mock" | "maintenance";
  label: string;
  title: string;
  body: string;
  href: string;
};

export type SscDailyCommand = {
  primary: SscDailyCommandAction;
  metrics: {
    openMistakes: number;
    openSpeedRepairs: number;
    openAttemptsWithRepair: number;
    openTopicQueues: number;
    latestScoreLabel: string;
    bestScoreLabel: string;
  };
};

function newestFirst<T extends { savedAt: string }>(items: T[]) {
  return [...items].sort((a, b) => Date.parse(b.savedAt) - Date.parse(a.savedAt));
}

function formatScore(item: SscAttemptHistoryItem | undefined) {
  if (!item) return "No attempt";
  const score = Number.isInteger(item.score) ? `${item.score}` : item.score.toFixed(1);
  return `${score}/${item.maxScore}`;
}

function bestAttempt(items: SscAttemptHistoryItem[]) {
  return items.reduce<SscAttemptHistoryItem | undefined>((best, item) => {
    if (!best) return item;
    if (item.score > best.score) return item;
    if (item.score === best.score && item.percentile > best.percentile) return item;
    return best;
  }, undefined);
}

function topicPracticeRepairHref(item: SscMistakeBankItem, mode: "misses" | "speed") {
  const resultPracticeHref = item.resultHref.match(/^\/exams\/ssc-cgl\/practice\/[^?#]+/)?.[0];
  const topicPracticeHref = item.topicHref.startsWith("/exams/ssc-cgl/topics/")
    ? item.topicHref.replace("/exams/ssc-cgl/topics/", "/exams/ssc-cgl/practice/")
    : "";
  const baseHref = resultPracticeHref || topicPracticeHref || item.topicHref;
  return `${baseHref}?mode=${mode}`;
}

export function buildSscDailyCommand(
  mistakes: SscMistakeBankItem[],
  attempts: SscAttemptHistoryItem[],
  topicPractices: SscTopicPracticeMemoryItem[] = [],
  practiceTopics: SscCglPracticeTopicSummary[] = []
): SscDailyCommand {
  const sortedMistakes = newestFirst(mistakes);
  const sortedAttempts = newestFirst(attempts);
  const unfinishedTopicPractices = newestFirst(topicPractices.filter((item) => (
    item.answered > 0 && (item.totalQuestions === null || item.answered < item.totalQuestions)
  )));
  const completedTopicSlugs = new Set(topicPractices
    .filter((item) => item.totalQuestions !== null && item.totalQuestions > 0 && item.answered >= item.totalQuestions)
    .map((item) => item.topicSlug));
  const activeTopicSlugs = new Set(unfinishedTopicPractices.map((item) => item.topicSlug));
  const unstartedTopic = practiceTopics.find((topic) => (
    !completedTopicSlugs.has(topic.slug)
    && !activeTopicSlugs.has(topic.slug)
    && topic.totalQuestions > 0
  ));
  const latestAttempt = sortedAttempts[0];
  const best = bestAttempt(sortedAttempts);
  const attemptsWithRepair = sortedAttempts.filter((item) => item.topRepairHref);
  const speedRepairs = sortedMistakes.filter((item) => item.status === "slow");
  const openTopicQueues = practiceTopics.length > 0
    ? unfinishedTopicPractices.length + practiceTopics.filter((topic) => (
      !completedTopicSlugs.has(topic.slug)
      && !activeTopicSlugs.has(topic.slug)
      && topic.totalQuestions > 0
    )).length
    : unfinishedTopicPractices.length;

  const metrics = {
    openMistakes: sortedMistakes.length,
    openSpeedRepairs: speedRepairs.length,
    openAttemptsWithRepair: attemptsWithRepair.length,
    openTopicQueues,
    latestScoreLabel: formatScore(latestAttempt),
    bestScoreLabel: formatScore(best)
  };

  const topMistake = sortedMistakes[0];
  if (topMistake) {
    const isSpeedRepair = topMistake.status === "slow";
    return {
      metrics,
      primary: {
        kind: "mistake",
        label: isSpeedRepair ? "Repair speed" : "Repair first",
        title: isSpeedRepair ? `Speed repair: ${topMistake.topic}` : `Close mistake: ${topMistake.topic}`,
        body: isSpeedRepair
          ? `${topMistake.subtopic} · correct but over the 36-second target. Re-solve until the route is automatic. ${topMistake.stem}`
          : `${topMistake.subtopic} · ${topMistake.status}. ${topMistake.stem}`,
        href: topicPracticeRepairHref(topMistake, isSpeedRepair ? "speed" : "misses")
      }
    };
  }

  const topicPractice = unfinishedTopicPractices[0];
  if (topicPractice) {
    const total = topicPractice.totalQuestions === null ? "unknown total" : `${topicPractice.totalQuestions}`;
    return {
      metrics,
      primary: {
        kind: "topic-practice",
        label: "Continue topic queue",
        title: `Continue ${topicPractice.topicTitle}`,
        body: `${topicPractice.answered}/${total} answered · ${topicPractice.correct} correct, ${topicPractice.wrong} wrong, ${topicPractice.skipped} skipped. Finish the active queue before opening a new one.`,
        href: topicPractice.href
      }
    };
  }

  if (unstartedTopic && !latestAttempt) {
    return {
      metrics,
      primary: {
        kind: "topic-practice",
        label: "Start topic queue",
        title: `Start ${unstartedTopic.title}`,
        body: `0/${unstartedTopic.totalQuestions} answered · ${unstartedTopic.bookBackedQuestions} book-backed, ${unstartedTopic.gapRepairQuestions} gap-repair. Start the corpus queue before adding passive reading.`,
        href: unstartedTopic.href
      }
    };
  }

  const repairAttempt = attemptsWithRepair[0];
  if (repairAttempt?.topRepairHref) {
    return {
      metrics,
      primary: {
        kind: "attempt-repair",
        label: "Repair latest score leak",
        title: repairAttempt.topRepairTopic ?? "Repair top attempt weakness",
        body: `${formatScore(repairAttempt)} · ${repairAttempt.marksLost} marks lost · ${repairAttempt.wrong} wrong, ${repairAttempt.unattempted} left.`,
        href: repairAttempt.topRepairHref
      }
    };
  }

  if (unstartedTopic) {
    return {
      metrics,
      primary: {
        kind: "topic-practice",
        label: "Start topic queue",
        title: `Start ${unstartedTopic.title}`,
        body: `0/${unstartedTopic.totalQuestions} answered · ${unstartedTopic.bookBackedQuestions} book-backed, ${unstartedTopic.gapRepairQuestions} gap-repair. Finish this topic queue before opening another new one.`,
        href: unstartedTopic.href
      }
    };
  }

  if (!latestAttempt) {
    return {
      metrics,
      primary: {
        kind: "full-mock",
        label: "Start baseline",
        title: "Take a full 200-mark mock",
        body: "No local attempt exists in this browser. Start with a full mock before reading more notes.",
        href: "/exams/ssc-cgl/tests?mode=full_mock"
      }
    };
  }

  return {
    metrics,
    primary: {
      kind: "maintenance",
      label: "Maintain pressure",
      title: "Run the next 36-second section sprint",
      body: `${formatScore(latestAttempt)} latest. Keep the loop active with timed pressure and daily current affairs.`,
      href: "/exams/ssc-cgl/tests?mode=speed_sprint"
    }
  };
}
