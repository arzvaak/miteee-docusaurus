import {
  learnerWeaknessChangeEvent,
  learnerWeaknessStorageKey,
  parseLearnerWeaknessState,
  recordLearnerAttemptEvidenceBatch,
  serializeLearnerWeaknessState,
  type LearnerAttemptEvidenceInput,
  type LearnerWeaknessState
} from "@/lib/learner-weakness-engine";

export { learnerWeaknessChangeEvent } from "@/lib/learner-weakness-engine";

export function readLocalLearnerWeaknessState() {
  if (typeof window === "undefined") return parseLearnerWeaknessState(null);
  try {
    return parseLearnerWeaknessState(window.localStorage.getItem(learnerWeaknessStorageKey));
  } catch {
    return parseLearnerWeaknessState(null);
  }
}

export function notifyLearnerWeaknessChanged(state: LearnerWeaknessState) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(learnerWeaknessChangeEvent, { detail: state }));
}

export function persistLearnerAttemptEvidenceBatch(inputs: LearnerAttemptEvidenceInput[]) {
  if (typeof window === "undefined" || inputs.length === 0) return readLocalLearnerWeaknessState();

  const current = readLocalLearnerWeaknessState();
  const recorded = recordLearnerAttemptEvidenceBatch(current, inputs);
  const state = recorded.ok ? recorded.state : current;

  try {
    window.localStorage.setItem(learnerWeaknessStorageKey, serializeLearnerWeaknessState(state));
  } catch {
    return state;
  }
  notifyLearnerWeaknessChanged(state);
  return state;
}
