import type { RecallGrade } from "@/lib/learner-memory";

export type RecallGradeOption = {
  grade: RecallGrade;
  label: string;
  description: string;
  tone: "weak" | "medium" | "strong";
  emphasis: "primary" | "secondary";
};

export const recallGradeOptions: RecallGradeOption[] = [
  {
    grade: "again",
    label: "Again",
    description: "Missed it. Keep the card due soon.",
    tone: "weak",
    emphasis: "secondary"
  },
  {
    grade: "hard",
    label: "Hard",
    description: "Recovered it with effort. Hold the interval steady.",
    tone: "medium",
    emphasis: "secondary"
  },
  {
    grade: "good",
    label: "Good",
    description: "Recalled it clearly. Increase the interval.",
    tone: "strong",
    emphasis: "primary"
  },
  {
    grade: "easy",
    label: "Easy",
    description: "Immediate recall. Stretch the interval further.",
    tone: "strong",
    emphasis: "secondary"
  }
];
