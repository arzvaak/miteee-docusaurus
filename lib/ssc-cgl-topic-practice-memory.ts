import type { SscCglOptionId } from "@/lib/exam-types";

export const sscTopicPracticeStoragePrefix = "ssc-cgl-topic-practice:";

export type SscStoredTopicPractice = {
  index: number;
  answers: Record<string, SscCglOptionId | "z">;
  savedAt: string;
  topicSlug?: string;
  topicTitle?: string;
  subject?: string;
  totalQuestions?: number;
  correct?: number;
  wrong?: number;
  skipped?: number;
};

export type SscTopicPracticeMemoryItem = {
  topicSlug: string;
  topicTitle: string;
  subject: string;
  href: string;
  index: number;
  answered: number;
  totalQuestions: number | null;
  correct: number;
  wrong: number;
  skipped: number;
  savedAt: string;
};

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function titleFromSlug(slug: string) {
  return slug
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ") || "Topic practice";
}

function slugFromStorageKey(key: string) {
  return key.startsWith(sscTopicPracticeStoragePrefix) ? key.slice(sscTopicPracticeStoragePrefix.length) : "";
}

function cleanAnswers(value: unknown) {
  if (!isPlainObject(value)) return {};
  return Object.fromEntries(Object.entries(value).filter(([, answer]) => (
    answer === "a" || answer === "b" || answer === "c" || answer === "d" || answer === "z"
  ))) as Record<string, SscCglOptionId | "z">;
}

export function sscTopicPracticeStorageKey(slug: string) {
  return `${sscTopicPracticeStoragePrefix}${slug}`;
}

export function parseStoredSscTopicPractice(value: string | null): SscStoredTopicPractice | null {
  if (!value) return null;
  try {
    const parsed: unknown = JSON.parse(value);
    if (!isPlainObject(parsed)) return null;
    if (!isFiniteNumber(parsed.index)) return null;
    const answers = cleanAnswers(parsed.answers);
    if (Object.keys(answers).length === 0 && !parsed.answers) return null;

    return {
      index: parsed.index,
      answers,
      savedAt: typeof parsed.savedAt === "string" ? parsed.savedAt : new Date().toISOString(),
      topicSlug: typeof parsed.topicSlug === "string" ? parsed.topicSlug : undefined,
      topicTitle: typeof parsed.topicTitle === "string" ? parsed.topicTitle : undefined,
      subject: typeof parsed.subject === "string" ? parsed.subject : undefined,
      totalQuestions: isFiniteNumber(parsed.totalQuestions) ? parsed.totalQuestions : undefined,
      correct: isFiniteNumber(parsed.correct) ? parsed.correct : undefined,
      wrong: isFiniteNumber(parsed.wrong) ? parsed.wrong : undefined,
      skipped: isFiniteNumber(parsed.skipped) ? parsed.skipped : undefined
    };
  } catch {
    return null;
  }
}

export function parseSscTopicPracticeMemory(key: string, value: string | null): SscTopicPracticeMemoryItem | null {
  const keySlug = slugFromStorageKey(key);
  if (!keySlug) return null;
  const stored = parseStoredSscTopicPractice(value);
  if (!stored) return null;
  const topicSlug = stored.topicSlug || keySlug;
  const answered = Object.keys(stored.answers).length;
  const skipped = stored.skipped ?? Object.values(stored.answers).filter((answer) => answer === "z").length;

  return {
    topicSlug,
    topicTitle: stored.topicTitle || titleFromSlug(topicSlug),
    subject: stored.subject || "SSC CGL",
    href: `/exams/ssc-cgl/practice/${topicSlug}`,
    index: stored.index,
    answered,
    totalQuestions: stored.totalQuestions ?? null,
    correct: stored.correct ?? 0,
    wrong: stored.wrong ?? 0,
    skipped,
    savedAt: stored.savedAt
  };
}
