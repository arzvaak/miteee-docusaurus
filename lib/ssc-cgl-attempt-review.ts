import type { SscCglOptionId, SscCglQuestion, SscCglTestDetail } from "@/lib/exam-types";

export type SscAttemptQuestionReviewStatus = "correct" | "wrong" | "unattempted";

export type SscAttemptQuestionReviewRow = {
  questionId: string;
  sectionId: SscCglQuestion["section"];
  sectionTitle: string;
  questionNumber: number;
  topic: string;
  subtopic: string;
  topicHref: string;
  stem: string;
  stimulus?: SscCglQuestion["stimulus"];
  status: SscAttemptQuestionReviewStatus;
  chosenOptionId: SscCglOptionId | null;
  chosenOptionText: string;
  correctOptionId: SscCglOptionId;
  correctOptionText: string;
  explanation: string;
  marksImpact: number;
  sourceLabel: string;
  sourceUrl: string | null;
};

function optionText(question: SscCglQuestion, optionId: SscCglOptionId | null | undefined) {
  if (!optionId) return null;
  return question.options.find((option) => option.id === optionId)?.text ?? null;
}

function sourceLabel(question: SscCglQuestion) {
  const page = question.provenance.pageNumber ? ` · page ${question.provenance.pageNumber}` : "";
  return `${question.provenance.title}${page}`;
}

export function buildSscAttemptQuestionReview(
  test: SscCglTestDetail,
  answers: Record<string, SscCglOptionId | "z" | null | undefined>
): SscAttemptQuestionReviewRow[] {
  let questionNumber = 0;

  return test.sections.flatMap((section) => section.questions.map((question) => {
    questionNumber += 1;
    const rawChosen = answers[question.id];
    const chosenOptionId = rawChosen === "a" || rawChosen === "b" || rawChosen === "c" || rawChosen === "d" ? rawChosen : null;
    const status: SscAttemptQuestionReviewStatus = !chosenOptionId
      ? "unattempted"
      : chosenOptionId === question.correctOption
        ? "correct"
        : "wrong";

    return {
      questionId: question.id,
      sectionId: question.section,
      sectionTitle: section.title,
      questionNumber,
      topic: question.topic,
      subtopic: question.subtopic,
      topicHref: `/exams/ssc-cgl/topics/${question.topic}`,
      stem: question.stem,
      stimulus: question.stimulus,
      status,
      chosenOptionId,
      chosenOptionText: optionText(question, chosenOptionId) ?? "Not attempted",
      correctOptionId: question.correctOption,
      correctOptionText: optionText(question, question.correctOption) ?? "Missing correct option text",
      explanation: question.explanation,
      marksImpact: status === "correct" ? question.marksCorrect : status === "wrong" ? question.marksWrong : question.marksUnattempted,
      sourceLabel: sourceLabel(question),
      sourceUrl: question.provenance.url ?? null
    };
  }));
}
