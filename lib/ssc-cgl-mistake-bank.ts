import type { CurrentAffairsRecallCard, SscCglOptionId, SscCglQuestion, SscCglSectionId, SscCglTopic } from "@/lib/exam-types";
import type { SscAttemptQuestionReviewRow } from "@/lib/ssc-cgl-attempt-review";

export const sscMistakeBankStorageKey = "ssc-cgl-mistake-bank";

export type SscMistakeBankItem = {
  questionId: string;
  attemptId: string;
  testId: string;
  testTitle: string;
  resultHref: string;
  sectionId: SscCglSectionId;
  sectionTitle: string;
  topic: string;
  subtopic: string;
  topicHref: string;
  stem: string;
  status: "wrong" | "unattempted" | "slow";
  chosenOptionText: string;
  correctOptionText: string;
  explanation: string;
  sourceLabel: string;
  savedAt: string;
};

export type SscMistakeBankAttemptMeta = {
  attemptId: string;
  testId: string;
  testTitle: string;
  savedAt: string;
};

const sectionTitleById: Record<SscCglSectionId, string> = {
  reasoning: "General Intelligence and Reasoning",
  "general-awareness": "General Awareness",
  "quantitative-aptitude": "Quantitative Aptitude",
  "english-comprehension": "English Comprehension"
};

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function questionOptionText(question: SscCglQuestion, optionId: SscCglOptionId) {
  const option = question.options.find((item) => item.id === optionId);
  return `${optionId.toUpperCase()} · ${option?.text ?? ""}`.trim();
}

function questionSourceLabel(question: SscCglQuestion) {
  const page = question.provenance.pageNumber ? ` · page ${question.provenance.pageNumber}` : "";
  return `${question.provenance.title}${page}`;
}

function isMistakeBankItem(value: unknown): value is SscMistakeBankItem {
  if (!isPlainObject(value)) return false;
  return (
    typeof value.questionId === "string"
    && typeof value.attemptId === "string"
    && typeof value.testId === "string"
    && typeof value.testTitle === "string"
    && typeof value.resultHref === "string"
    && typeof value.sectionId === "string"
    && typeof value.sectionTitle === "string"
    && typeof value.topic === "string"
    && typeof value.subtopic === "string"
    && typeof value.topicHref === "string"
    && typeof value.stem === "string"
    && (value.status === "wrong" || value.status === "unattempted" || value.status === "slow")
    && typeof value.chosenOptionText === "string"
    && typeof value.correctOptionText === "string"
    && typeof value.explanation === "string"
    && typeof value.sourceLabel === "string"
    && typeof value.savedAt === "string"
  );
}

export function buildSscMistakeBankItems(
  reviewRows: SscAttemptQuestionReviewRow[],
  attempt: SscMistakeBankAttemptMeta
): SscMistakeBankItem[] {
  return reviewRows
    .filter((row): row is SscAttemptQuestionReviewRow & { status: "wrong" | "unattempted" } => row.status === "wrong" || row.status === "unattempted")
    .map((row) => ({
      questionId: row.questionId,
      attemptId: attempt.attemptId,
      testId: attempt.testId,
      testTitle: attempt.testTitle,
      resultHref: `/exams/ssc-cgl/results/${attempt.attemptId}`,
      sectionId: row.sectionId,
      sectionTitle: row.sectionTitle,
      topic: row.topic,
      subtopic: row.subtopic,
      topicHref: row.topicHref,
      stem: row.stem,
      status: row.status,
      chosenOptionText: row.chosenOptionText,
      correctOptionText: row.correctOptionText,
      explanation: row.explanation,
      sourceLabel: row.sourceLabel,
      savedAt: attempt.savedAt
    }));
}

export function buildSscTopicPracticeMistakeBankItem(
  question: SscCglQuestion,
  topic: SscCglTopic,
  selected: SscCglOptionId | "z",
  savedAt: string,
  elapsedSeconds = 0,
  targetSecondsPerQuestion = 36
): SscMistakeBankItem | null {
  const isSlowCorrect = selected === question.correctOption && elapsedSeconds > targetSecondsPerQuestion;
  if (selected === question.correctOption && !isSlowCorrect) return null;

  const practiceId = `topic-practice-${topic.slug}`;
  const baseExplanation = question.explanation;
  const speedExplanation = isSlowCorrect
    ? `Correct answer, but it took ${elapsedSeconds}s against the ${targetSecondsPerQuestion}s SSC pace target. Re-solve this question until the method is automatic. ${baseExplanation}`
    : baseExplanation;

  return {
    questionId: question.id,
    attemptId: practiceId,
    testId: practiceId,
    testTitle: `${topic.title} topic practice`,
    resultHref: `/exams/ssc-cgl/practice/${topic.slug}`,
    sectionId: question.section,
    sectionTitle: topic.subject || sectionTitleById[question.section],
    topic: topic.title,
    subtopic: question.subtopic,
    topicHref: `/exams/ssc-cgl/topics/${topic.slug}`,
    stem: question.stem,
    status: isSlowCorrect ? "slow" : selected === "z" ? "unattempted" : "wrong",
    chosenOptionText: selected === "z" ? "Not attempted" : questionOptionText(question, selected),
    correctOptionText: questionOptionText(question, question.correctOption),
    explanation: speedExplanation,
    sourceLabel: questionSourceLabel(question),
    savedAt
  };
}

export function buildSscCurrentAffairsMistakeBankItem(
  card: CurrentAffairsRecallCard,
  savedAt: string
): SscMistakeBankItem {
  const recallId = `current-affairs-${card.date}`;
  const areas = card.examAreas.length > 0 ? ` Exam areas: ${card.examAreas.join(", ")}.` : "";

  return {
    questionId: card.id,
    attemptId: recallId,
    testId: recallId,
    testTitle: `Current affairs recall ${card.date}`,
    resultHref: `/exams/ssc-cgl/current-affairs?date=${card.date}`,
    sectionId: "general-awareness",
    sectionTitle: "General Awareness",
    topic: "Current Affairs and Static GK",
    subtopic: card.title,
    topicHref: "/exams/ssc-cgl/topics/current-affairs-static-gk",
    stem: card.prompt,
    status: "wrong",
    chosenOptionText: "Missed during recall",
    correctOptionText: card.answer,
    explanation: `Memory hook: ${card.memoryHook} Trap: ${card.trap}.${areas}`,
    sourceLabel: `${card.source} · ${card.date}`,
    savedAt
  };
}

export function parseSscMistakeBank(raw: string | null): SscMistakeBankItem[] {
  if (!raw) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isMistakeBankItem);
  } catch {
    return [];
  }
}

export function mergeSscMistakeBank(
  existing: SscMistakeBankItem[],
  next: SscMistakeBankItem[],
  correctedQuestionIds: string[],
  limit = 200
): SscMistakeBankItem[] {
  const corrected = new Set(correctedQuestionIds);
  const latestByQuestion = new Map<string, SscMistakeBankItem>();

  for (const item of [...next, ...existing]) {
    if (corrected.has(item.questionId)) continue;
    if (!latestByQuestion.has(item.questionId)) latestByQuestion.set(item.questionId, item);
  }

  return [...latestByQuestion.values()]
    .sort((a, b) => Date.parse(b.savedAt) - Date.parse(a.savedAt))
    .slice(0, limit);
}

export function serializeSscMistakeBank(items: SscMistakeBankItem[]) {
  return JSON.stringify(items);
}
