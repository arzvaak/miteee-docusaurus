export type RecallAttemptState = {
  canGrade: boolean;
  helperText: string;
};

export function buildRecallAttemptState(value: string): RecallAttemptState {
  const meaningfulLength = value.replace(/\s+/g, "").length;

  if (meaningfulLength === 0) {
    return {
      canGrade: false,
      helperText: "Write a recall attempt before grading."
    };
  }

  if (meaningfulLength < 3) {
    return {
      canGrade: false,
      helperText: "Add a little more detail before grading."
    };
  }

  return {
    canGrade: true,
    helperText: "Grade the attempt, then open the source if needed."
  };
}
