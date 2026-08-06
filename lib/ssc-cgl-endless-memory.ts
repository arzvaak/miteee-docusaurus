import type { SscCglOptionId, SscCglQuestion, SscCglSectionId } from "@/lib/exam-types";

export const sscEndlessMemoryStorageKey = "ssc-cgl-endless-memory-v1";
export const sscEndlessMemoryChangeEvent = "ssc-cgl-endless-memory-change";
export const sscEndlessMemoryVersion = 1;
export const sscEndlessReviewLimit = 200;

export type SscEndlessOutcome = "correct" | "wrong" | "skipped";
export type SscEndlessReviewStatus = "marked" | "wrong" | "skipped";

export type SscEndlessSectionStats = {
  seen: number;
  answered: number;
  correct: number;
  wrong: number;
  skipped: number;
};

export type SscEndlessStats = {
  sessions: number;
  questionsSeen: number;
  answered: number;
  correct: number;
  wrong: number;
  skipped: number;
  bestStreak: number;
  lastSessionAt: string | null;
  sections: Record<SscCglSectionId, SscEndlessSectionStats>;
};

export type SscEndlessReviewItem = {
  questionId: string;
  question: SscCglQuestion;
  status: SscEndlessReviewStatus;
  lastOutcome: SscEndlessOutcome | null;
  lastSelectedOptionId: SscCglOptionId | null;
  marked: boolean;
  markedAt: string | null;
  attempts: number;
  correctCount: number;
  wrongCount: number;
  skippedCount: number;
  savedAt: string;
  updatedAt: string;
};

export type SscEndlessMemory = {
  version: typeof sscEndlessMemoryVersion;
  stats: SscEndlessStats;
  reviewItems: SscEndlessReviewItem[];
};

const sectionIds: SscCglSectionId[] = [
  "reasoning",
  "general-awareness",
  "quantitative-aptitude",
  "english-comprehension"
];
const optionIds = new Set<SscCglOptionId>(["a", "b", "c", "d"]);
const outcomes = new Set<SscEndlessOutcome>(["correct", "wrong", "skipped"]);
const reviewStatuses = new Set<SscEndlessReviewStatus>(["marked", "wrong", "skipped"]);

function emptySectionStats(): SscEndlessSectionStats {
  return { seen: 0, answered: 0, correct: 0, wrong: 0, skipped: 0 };
}

function emptySections(): Record<SscCglSectionId, SscEndlessSectionStats> {
  return Object.fromEntries(sectionIds.map((id) => [id, emptySectionStats()])) as Record<SscCglSectionId, SscEndlessSectionStats>;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function count(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) && value >= 0 ? Math.floor(value) : 0;
}

function nullableString(value: unknown) {
  return typeof value === "string" && value.length > 0 ? value : null;
}

function isOptionId(value: unknown): value is SscCglOptionId {
  return typeof value === "string" && optionIds.has(value as SscCglOptionId);
}

function isQuestion(value: unknown): value is SscCglQuestion {
  if (!isRecord(value)) return false;
  return typeof value.id === "string"
    && typeof value.stem === "string"
    && Array.isArray(value.options)
    && value.options.length === 4
    && value.options.every((option) => isRecord(option) && isOptionId(option.id) && typeof option.text === "string")
    && isOptionId(value.correctOption)
    && typeof value.explanation === "string"
    && typeof value.section === "string"
    && sectionIds.includes(value.section as SscCglSectionId)
    && typeof value.topic === "string"
    && isRecord(value.provenance)
    && typeof value.provenance.title === "string";
}

function copyQuestion(question: SscCglQuestion) {
  return JSON.parse(JSON.stringify(question)) as SscCglQuestion;
}

function copySectionStats(value: unknown): SscEndlessSectionStats {
  const record = isRecord(value) ? value : {};
  return {
    seen: count(record.seen),
    answered: count(record.answered),
    correct: count(record.correct),
    wrong: count(record.wrong),
    skipped: count(record.skipped)
  };
}

function copyStats(value: unknown): SscEndlessStats {
  const record = isRecord(value) ? value : {};
  const rawSections = isRecord(record.sections) ? record.sections : {};
  return {
    sessions: count(record.sessions),
    questionsSeen: count(record.questionsSeen),
    answered: count(record.answered),
    correct: count(record.correct),
    wrong: count(record.wrong),
    skipped: count(record.skipped),
    bestStreak: count(record.bestStreak),
    lastSessionAt: nullableString(record.lastSessionAt),
    sections: Object.fromEntries(sectionIds.map((id) => [id, copySectionStats(rawSections[id])])) as Record<SscCglSectionId, SscEndlessSectionStats>
  };
}

function copyReviewItem(value: unknown): SscEndlessReviewItem | null {
  if (!isRecord(value) || !isQuestion(value.question)) return null;
  const status = reviewStatuses.has(value.status as SscEndlessReviewStatus) ? value.status as SscEndlessReviewStatus : null;
  if (!status || typeof value.questionId !== "string" || value.questionId !== value.question.id) return null;
  const lastOutcome = outcomes.has(value.lastOutcome as SscEndlessOutcome) ? value.lastOutcome as SscEndlessOutcome : null;
  const lastSelectedOptionId = isOptionId(value.lastSelectedOptionId) ? value.lastSelectedOptionId : null;
  const savedAt = typeof value.savedAt === "string" ? value.savedAt : "";
  const updatedAt = typeof value.updatedAt === "string" ? value.updatedAt : savedAt;
  if (!savedAt || !updatedAt) return null;
  return {
    questionId: value.questionId,
    question: copyQuestion(value.question),
    status,
    lastOutcome,
    lastSelectedOptionId,
    marked: value.marked === true,
    markedAt: nullableString(value.markedAt),
    attempts: count(value.attempts),
    correctCount: count(value.correctCount),
    wrongCount: count(value.wrongCount),
    skippedCount: count(value.skippedCount),
    savedAt,
    updatedAt
  };
}

function sortReviewItems(items: SscEndlessReviewItem[]) {
  return [...items]
    .sort((a, b) => {
      if (a.marked !== b.marked) return a.marked ? -1 : 1;
      return Date.parse(b.updatedAt) - Date.parse(a.updatedAt);
    })
    .slice(0, sscEndlessReviewLimit);
}

function copyMemory(memory: SscEndlessMemory): SscEndlessMemory {
  return {
    version: sscEndlessMemoryVersion,
    stats: {
      ...memory.stats,
      sections: Object.fromEntries(sectionIds.map((id) => [id, { ...memory.stats.sections[id] }])) as Record<SscCglSectionId, SscEndlessSectionStats>
    },
    reviewItems: memory.reviewItems.map((item) => ({
      ...item,
      question: copyQuestion(item.question)
    }))
  };
}

export function createEmptySscEndlessMemory(): SscEndlessMemory {
  return {
    version: sscEndlessMemoryVersion,
    stats: {
      sessions: 0,
      questionsSeen: 0,
      answered: 0,
      correct: 0,
      wrong: 0,
      skipped: 0,
      bestStreak: 0,
      lastSessionAt: null,
      sections: emptySections()
    },
    reviewItems: []
  };
}

export function parseSscEndlessMemory(raw: string | null | undefined): SscEndlessMemory {
  if (!raw) return createEmptySscEndlessMemory();
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!isRecord(parsed) || parsed.version !== sscEndlessMemoryVersion) return createEmptySscEndlessMemory();
    const reviewItems = Array.isArray(parsed.reviewItems)
      ? parsed.reviewItems.map(copyReviewItem).filter((item): item is SscEndlessReviewItem => Boolean(item))
      : [];
    return {
      version: sscEndlessMemoryVersion,
      stats: copyStats(parsed.stats),
      reviewItems: sortReviewItems(reviewItems)
    };
  } catch {
    return createEmptySscEndlessMemory();
  }
}

export function serializeSscEndlessMemory(memory: SscEndlessMemory) {
  return JSON.stringify(memory);
}

export function startSscEndlessSession(memory: SscEndlessMemory, startedAt: string) {
  const next = copyMemory(memory);
  next.stats.sessions += 1;
  next.stats.lastSessionAt = startedAt;
  return next;
}

export function recordSscEndlessQuestionSeen(memory: SscEndlessMemory, question: SscCglQuestion) {
  const next = copyMemory(memory);
  next.stats.questionsSeen += 1;
  next.stats.sections[question.section].seen += 1;
  return next;
}

export function recordSscEndlessAnswer(
  memory: SscEndlessMemory,
  question: SscCglQuestion,
  outcome: SscEndlessOutcome,
  selectedOptionId: SscCglOptionId | null,
  answeredAt: string,
  streak: number
) {
  const next = copyMemory(memory);
  next.stats.answered += 1;
  next.stats[outcome] += 1;
  next.stats.bestStreak = Math.max(next.stats.bestStreak, count(streak));
  next.stats.sections[question.section].answered += 1;
  next.stats.sections[question.section][outcome] += 1;

  const existingIndex = next.reviewItems.findIndex((item) => item.questionId === question.id);
  const existing = existingIndex >= 0 ? next.reviewItems[existingIndex] : null;
  if (outcome === "correct" && !existing) return next;

  const item: SscEndlessReviewItem = {
    questionId: question.id,
    question: copyQuestion(question),
    status: outcome === "wrong" ? "wrong" : outcome === "skipped" ? "skipped" : existing?.status ?? "marked",
    lastOutcome: outcome,
    lastSelectedOptionId: selectedOptionId,
    marked: existing?.marked ?? false,
    markedAt: existing?.markedAt ?? null,
    attempts: (existing?.attempts ?? 0) + 1,
    correctCount: (existing?.correctCount ?? 0) + (outcome === "correct" ? 1 : 0),
    wrongCount: (existing?.wrongCount ?? 0) + (outcome === "wrong" ? 1 : 0),
    skippedCount: (existing?.skippedCount ?? 0) + (outcome === "skipped" ? 1 : 0),
    savedAt: existing?.savedAt ?? answeredAt,
    updatedAt: answeredAt
  };

  if (existingIndex >= 0) next.reviewItems[existingIndex] = item;
  else next.reviewItems.push(item);
  next.reviewItems = sortReviewItems(next.reviewItems);
  return next;
}

export function setSscEndlessQuestionMarked(
  memory: SscEndlessMemory,
  question: SscCglQuestion,
  marked: boolean,
  changedAt: string
) {
  const next = copyMemory(memory);
  const existingIndex = next.reviewItems.findIndex((item) => item.questionId === question.id);
  const existing = existingIndex >= 0 ? next.reviewItems[existingIndex] : null;

  if (!marked && existing && !existing.lastOutcome) {
    next.reviewItems.splice(existingIndex, 1);
    return next;
  }

  if (!marked && !existing) return next;

  const item: SscEndlessReviewItem = existing ?? {
    questionId: question.id,
    question: copyQuestion(question),
    status: "marked",
    lastOutcome: null,
    lastSelectedOptionId: null,
    marked: false,
    markedAt: null,
    attempts: 0,
    correctCount: 0,
    wrongCount: 0,
    skippedCount: 0,
    savedAt: changedAt,
    updatedAt: changedAt
  };

  item.question = copyQuestion(question);
  item.marked = marked;
  item.markedAt = marked ? changedAt : null;
  item.updatedAt = changedAt;
  if (existingIndex >= 0) next.reviewItems[existingIndex] = item;
  else next.reviewItems.push(item);
  next.reviewItems = sortReviewItems(next.reviewItems);
  return next;
}

export function resolveSscEndlessReviewItem(memory: SscEndlessMemory, questionId: string) {
  const next = copyMemory(memory);
  next.reviewItems = next.reviewItems.filter((item) => item.questionId !== questionId);
  return next;
}

export function getOpenSscEndlessReviewItems(memory: SscEndlessMemory) {
  return sortReviewItems(memory.reviewItems);
}
