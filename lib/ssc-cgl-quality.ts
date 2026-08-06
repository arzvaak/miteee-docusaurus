import type { SscCglQuestion } from "@/lib/exam-types";

const placeholderStemPatterns = [
  /\b200\/200\s+drill\s+\d+\b/i,
  /which first step gives the fastest reliable .*solution route/i,
  /which first step gives the fastest reliable .*reasoning solution route/i
];

const placeholderOptionPatterns = [
  /^skip the stem and test options directly$/i,
  /^memorize the last seen answer pattern$/i,
  /^do not add absolute differences before assigning k\.?$/i
];

const unavailableVisualPattern = /\b(?:table|bar[-\s]+(?:graph|chart)|pie[-\s]+(?:chart|diagram)|line[-\s]+(?:graph|chart)|given\s+(?:chart|graph)|following\s+(?:chart|graph)|shown\s+in\s+(?:the\s+)?(?:chart|graph)|figure|diagram)\b/i;

export function isLearnerGradeSscQuestion(question: SscCglQuestion) {
  if (placeholderStemPatterns.some((pattern) => pattern.test(question.stem))) return false;

  const placeholderOptions = question.options.filter((option) => placeholderOptionPatterns.some((pattern) => pattern.test(option.text.trim())));
  if (placeholderOptions.length >= 2) return false;

  if (question.topic === "data-interpretation" && !question.stimulus) return false;
  if (unavailableVisualPattern.test(question.stem) && !question.stimulus) return false;
  return true;
}
