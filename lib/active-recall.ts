export const activeRecallStorageKey = "miteee-active-recall-v1";

export const recallModeLabels = {
  active: "Active recall",
  review: "Review mode"
} as const;

export function normalizeRecallText(value: string) {
  return value
    .replace(/[*_`:[\](){}<>]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

export function isRecallAnswerText(value: string) {
  const text = normalizeRecallText(value);
  if (!text) return false;
  return (
    /^(answer|show answer|final answer|solution|worked answer|explanation)(\s+\d+)?(\b|$)/.test(text) ||
    /^tip\s+-?\s*answer\b/.test(text) ||
    /^tip\s+answer\b/.test(text) ||
    /^outline hint\b/.test(text) ||
    /^answer note\b/.test(text) ||
    /^correct rule\b/.test(text)
  );
}
