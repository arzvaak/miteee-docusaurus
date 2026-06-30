import type { SscCglAttemptResult, SscCglTestDetail, SscCglTestMode } from "@/lib/exam-types";

export const sscAttemptHistoryStorageKey = "ssc-cgl-attempt-index";

export type SscAttemptHistoryItem = {
  attemptId: string;
  testId: string;
  testTitle: string;
  mode: SscCglTestMode;
  score: number;
  maxScore: number;
  marksLost: number;
  percentile: number;
  rankBucket: string;
  correct: number;
  wrong: number;
  unattempted: number;
  savedAt: string;
  topRepairTopic?: string;
  topRepairHref?: string;
};

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function isHistoryItem(value: unknown): value is SscAttemptHistoryItem {
  if (!isPlainObject(value)) return false;
  return (
    typeof value.attemptId === "string"
    && typeof value.testId === "string"
    && typeof value.testTitle === "string"
    && typeof value.mode === "string"
    && isFiniteNumber(value.score)
    && isFiniteNumber(value.maxScore)
    && isFiniteNumber(value.marksLost)
    && isFiniteNumber(value.percentile)
    && typeof value.rankBucket === "string"
    && isFiniteNumber(value.correct)
    && isFiniteNumber(value.wrong)
    && isFiniteNumber(value.unattempted)
    && typeof value.savedAt === "string"
    && (value.topRepairTopic === undefined || typeof value.topRepairTopic === "string")
    && (value.topRepairHref === undefined || typeof value.topRepairHref === "string")
  );
}

export function buildSscAttemptHistoryItem(
  test: SscCglTestDetail,
  result: SscCglAttemptResult,
  savedAt: string
): SscAttemptHistoryItem {
  const topRepair = result.repairQueue[0];
  return {
    attemptId: result.attemptId,
    testId: test.id,
    testTitle: test.title,
    mode: test.mode,
    score: result.score,
    maxScore: result.maxScore,
    marksLost: result.marksLost,
    percentile: result.rank.percentile,
    rankBucket: result.rank.rankBucket,
    correct: result.correct,
    wrong: result.wrong,
    unattempted: result.unattempted,
    savedAt,
    topRepairTopic: topRepair?.title,
    topRepairHref: topRepair?.href
  };
}

export function parseSscAttemptHistory(raw: string | null): SscAttemptHistoryItem[] {
  if (!raw) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isHistoryItem);
  } catch {
    return [];
  }
}

export function mergeSscAttemptHistory(
  existing: SscAttemptHistoryItem[],
  next: SscAttemptHistoryItem,
  limit = 20
): SscAttemptHistoryItem[] {
  return [next, ...existing.filter((item) => item.attemptId !== next.attemptId)]
    .sort((a, b) => Date.parse(b.savedAt) - Date.parse(a.savedAt))
    .slice(0, limit);
}

export function serializeSscAttemptHistory(items: SscAttemptHistoryItem[]) {
  return JSON.stringify(items);
}
