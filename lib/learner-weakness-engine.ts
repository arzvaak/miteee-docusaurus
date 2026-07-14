import type {
  SscCglOptionId,
  SscCglQuestion,
  SscCglTestDetail
} from "@/lib/exam-types";

export const learnerWeaknessVersion = 1 as const;
export const learnerWeaknessStorageKey = "miteee-learner-weakness-evidence-v1";
export const learnerWeaknessChangeEvent = "miteee:learner-weakness-change";

export type LearnerConfidence = "low" | "medium" | "high";
export type LearnerEvidenceContext = "exam" | "practice" | "revision";

export type LearnerEvidenceIdentity = {
  id: string;
  label: string;
};

export type LearnerAttemptEvidenceInput = {
  attemptId: string;
  exam: LearnerEvidenceIdentity;
  subject: LearnerEvidenceIdentity;
  topic: LearnerEvidenceIdentity;
  question: LearnerEvidenceIdentity;
  correct: boolean;
  answered?: boolean;
  confidence: LearnerConfidence;
  timeSpentSeconds: number;
  targetTimeSeconds?: number | null;
  answeredAt: string;
  context: LearnerEvidenceContext;
};

export type LearnerAttemptEvidence = LearnerAttemptEvidenceInput & {
  id: string;
  answered: boolean;
  targetTimeSeconds: number | null;
};

export type LearnerWeaknessState = {
  version: typeof learnerWeaknessVersion;
  evidence: LearnerAttemptEvidence[];
  updatedAt: string | null;
};

export type LearnerWeaknessMutation = {
  type: "record-evidence";
  evidence: LearnerAttemptEvidence;
};

export type LearnerWeaknessAdapter = {
  load: () => LearnerWeaknessState | null | Promise<LearnerWeaknessState | null>;
  persist: (
    next: LearnerWeaknessState,
    mutation: LearnerWeaknessMutation
  ) => void | LearnerWeaknessState | Promise<void | LearnerWeaknessState>;
};

export type LearnerTopicStatus = "insufficient-evidence" | "weak" | "fragile" | "developing" | "secure";
export type LearnerDrillMode =
  | "diagnostic"
  | "accuracy-repair"
  | "confidence-calibration"
  | "speed-repair"
  | "spaced-recall"
  | "mixed-practice";

export type LearnerDrillRecommendation = {
  mode: LearnerDrillMode;
  exam: LearnerEvidenceIdentity | null;
  subject: LearnerEvidenceIdentity | null;
  topic: LearnerEvidenceIdentity | null;
  questionCount: number;
  timed: boolean;
  targetSecondsPerQuestion: number | null;
  reason: string;
};

export type LearnerTopicWeakness = {
  key: string;
  exam: LearnerEvidenceIdentity;
  subject: LearnerEvidenceIdentity;
  topic: LearnerEvidenceIdentity;
  status: LearnerTopicStatus;
  evidenceCount: number;
  effectiveSampleSize: number;
  effectiveEvidenceWeight: number;
  correct: number;
  wrong: number;
  unattempted: number;
  rawAccuracy: number;
  recencyWeightedAccuracy: number;
  sampleAdjustedAccuracy: number;
  confidenceRisk: number;
  paceRisk: number;
  timedEvidenceCount: number;
  averageTimeSeconds: number;
  targetTimeSeconds: number | null;
  daysSinceLatestEvidence: number;
  masteryScore: number;
  weaknessScore: number;
  reasons: string[];
  nextDrill: LearnerDrillRecommendation;
};

export type LearnerWeaknessReport = {
  generatedAt: string;
  evidenceCount: number;
  usableEvidenceCount: number;
  futureEvidenceIgnored: number;
  topics: LearnerTopicWeakness[];
  weakestTopic: LearnerTopicWeakness | null;
  nextDrill: LearnerDrillRecommendation;
};

export type LearnerWeaknessEngineOptions = {
  recencyHalfLifeDays?: number;
  minimumEvidenceForMastery?: number;
  slowPaceMultiplier?: number;
};

export type RecordLearnerEvidenceResult =
  | { ok: true; evidence: LearnerAttemptEvidence; state: LearnerWeaknessState }
  | { ok: false; error: string; state: LearnerWeaknessState };

export type RecordLearnerEvidenceBatchResult =
  | { ok: true; evidence: LearnerAttemptEvidence[]; state: LearnerWeaknessState }
  | { ok: false; error: string; state: LearnerWeaknessState };

const dayMs = 86_400_000;
const defaultEvidenceLimit = 5_000;
const confidenceValues = new Set<LearnerConfidence>(["low", "medium", "high"]);
const contextValues = new Set<LearnerEvidenceContext>(["exam", "practice", "revision"]);
const staleSscTopicLabels = new Set(["scribd html pages"]);

function clamp(value: number, minimum = 0, maximum = 1) {
  return Math.min(maximum, Math.max(minimum, value));
}

function round(value: number, digits = 3) {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}

function cleanText(value: unknown, maximum: number) {
  if (typeof value !== "string") return "";
  return value.replace(/\s+/g, " ").trim().slice(0, maximum);
}

function normalizeIdentity(value: unknown, maximumLabel = 300): LearnerEvidenceIdentity | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const input = value as Partial<LearnerEvidenceIdentity>;
  const id = cleanText(input.id, 500);
  const label = cleanText(input.label, maximumLabel);
  return id && label ? { id, label } : null;
}

function finiteSeconds(value: unknown, maximum: number) {
  if (typeof value !== "number" || !Number.isFinite(value)) return null;
  return clamp(value, 0, maximum);
}

function validIsoDate(value: unknown) {
  if (typeof value !== "string" || Number.isNaN(Date.parse(value))) return null;
  return new Date(value).toISOString();
}

function evidenceId(attemptId: string, questionId: string) {
  return `${attemptId}::${questionId}`;
}

function canonicalizeTopicIdentity(
  exam: LearnerEvidenceIdentity,
  topic: LearnerEvidenceIdentity
): LearnerEvidenceIdentity {
  const isSscCgl = exam.id.toLowerCase().startsWith("ssc-cgl");
  if (!isSscCgl || !staleSscTopicLabels.has(topic.label.toLowerCase())) return topic;
  return { ...topic, label: titleFromSlug(topic.id) };
}

export function normalizeLearnerAttemptEvidence(value: unknown): LearnerAttemptEvidence | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const input = value as Partial<LearnerAttemptEvidenceInput> & { id?: unknown };
  const attemptId = cleanText(input.attemptId, 500);
  const exam = normalizeIdentity(input.exam, 160);
  const subject = normalizeIdentity(input.subject, 200);
  const rawTopic = normalizeIdentity(input.topic, 240);
  const question = normalizeIdentity(input.question, 1_000);
  const answeredAt = validIsoDate(input.answeredAt);
  const timeSpentSeconds = finiteSeconds(input.timeSpentSeconds, 21_600);
  const targetTimeSeconds = input.targetTimeSeconds === null || input.targetTimeSeconds === undefined
    ? null
    : finiteSeconds(input.targetTimeSeconds, 3_600);

  if (
    !attemptId
    || !exam
    || !subject
    || !rawTopic
    || !question
    || !answeredAt
    || timeSpentSeconds === null
    || (targetTimeSeconds !== null && targetTimeSeconds <= 0)
    || typeof input.correct !== "boolean"
    || !confidenceValues.has(input.confidence as LearnerConfidence)
    || !contextValues.has(input.context as LearnerEvidenceContext)
  ) {
    return null;
  }

  const topic = canonicalizeTopicIdentity(exam, rawTopic);
  const answered = input.answered !== false;
  const correct = answered ? input.correct : false;
  return {
    id: evidenceId(attemptId, question.id),
    attemptId,
    exam,
    subject,
    topic,
    question,
    correct,
    answered,
    confidence: input.confidence as LearnerConfidence,
    timeSpentSeconds: round(timeSpentSeconds),
    targetTimeSeconds: targetTimeSeconds === null ? null : round(targetTimeSeconds),
    answeredAt,
    context: input.context as LearnerEvidenceContext
  };
}

export function createLearnerWeaknessState(): LearnerWeaknessState {
  return { version: learnerWeaknessVersion, evidence: [], updatedAt: null };
}

function normalizedEvidenceList(value: unknown, limit = defaultEvidenceLimit) {
  if (!Array.isArray(value)) return [];
  const byId = new Map<string, LearnerAttemptEvidence>();

  for (const candidate of value.slice(0, Math.max(limit * 2, limit))) {
    const evidence = normalizeLearnerAttemptEvidence(candidate);
    if (!evidence) continue;
    const existing = byId.get(evidence.id);
    if (!existing || Date.parse(evidence.answeredAt) >= Date.parse(existing.answeredAt)) {
      byId.set(evidence.id, evidence);
    }
  }

  return [...byId.values()]
    .sort((left, right) => {
      const dateDifference = Date.parse(right.answeredAt) - Date.parse(left.answeredAt);
      return dateDifference || left.id.localeCompare(right.id);
    })
    .slice(0, limit);
}

export function parseLearnerWeaknessState(raw: string | null | undefined): LearnerWeaknessState {
  if (!raw) return createLearnerWeaknessState();
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return createLearnerWeaknessState();
    const input = parsed as Partial<LearnerWeaknessState>;
    if (input.version !== learnerWeaknessVersion) return createLearnerWeaknessState();
    const evidence = normalizedEvidenceList(input.evidence);
    const updatedAt = validIsoDate(input.updatedAt) ?? evidence[0]?.answeredAt ?? null;
    return { version: learnerWeaknessVersion, evidence, updatedAt };
  } catch {
    return createLearnerWeaknessState();
  }
}

export function serializeLearnerWeaknessState(state: LearnerWeaknessState) {
  return JSON.stringify({
    version: learnerWeaknessVersion,
    evidence: normalizedEvidenceList(state.evidence),
    updatedAt: validIsoDate(state.updatedAt) ?? null
  });
}

export function recordLearnerAttemptEvidence(
  state: LearnerWeaknessState,
  input: LearnerAttemptEvidenceInput,
  limit = defaultEvidenceLimit
): RecordLearnerEvidenceResult {
  const evidence = normalizeLearnerAttemptEvidence(input);
  if (!evidence) return { ok: false, error: "Attempt evidence is incomplete or invalid.", state };
  const nextEvidence = normalizedEvidenceList([
    evidence,
    ...state.evidence.filter((item) => item.id !== evidence.id)
  ], Math.max(1, Math.floor(limit)));
  return {
    ok: true,
    evidence,
    state: {
      version: learnerWeaknessVersion,
      evidence: nextEvidence,
      updatedAt: evidence.answeredAt
    }
  };
}

/** Records a complete submitted-question batch in one normalization and sort pass. */
export function recordLearnerAttemptEvidenceBatch(
  state: LearnerWeaknessState,
  inputs: LearnerAttemptEvidenceInput[],
  limit = defaultEvidenceLimit
): RecordLearnerEvidenceBatchResult {
  if (inputs.length === 0) return { ok: false, error: "Attempt evidence batch is empty.", state };
  const evidence: LearnerAttemptEvidence[] = [];

  for (let index = 0; index < inputs.length; index += 1) {
    const normalized = normalizeLearnerAttemptEvidence(inputs[index]);
    if (!normalized) {
      return { ok: false, error: `Attempt evidence at index ${index} is incomplete or invalid.`, state };
    }
    evidence.push(normalized);
  }

  const replacementIds = new Set(evidence.map((item) => item.id));
  const nextEvidence = normalizedEvidenceList([
    ...evidence,
    ...state.evidence.filter((item) => !replacementIds.has(item.id))
  ], Math.max(1, Math.floor(limit)));
  const acceptedById = new Set(evidence.map((item) => item.id));
  const accepted = nextEvidence.filter((item) => acceptedById.has(item.id));

  return {
    ok: true,
    evidence: accepted,
    state: {
      version: learnerWeaknessVersion,
      evidence: nextEvidence,
      updatedAt: accepted[0]?.answeredAt ?? state.updatedAt
    }
  };
}

export const localLearnerWeaknessAdapter: LearnerWeaknessAdapter = {
  load() {
    if (typeof window === "undefined") return null;
    return parseLearnerWeaknessState(window.localStorage.getItem(learnerWeaknessStorageKey));
  },
  persist(next) {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(learnerWeaknessStorageKey, serializeLearnerWeaknessState(next));
  }
};

export async function recordLearnerAttemptEvidenceWithAdapter(
  adapter: LearnerWeaknessAdapter,
  input: LearnerAttemptEvidenceInput,
  limit = defaultEvidenceLimit
): Promise<RecordLearnerEvidenceResult> {
  const current = await adapter.load() ?? createLearnerWeaknessState();
  const recorded = recordLearnerAttemptEvidence(current, input, limit);
  if (!recorded.ok) return recorded;
  const canonical = await adapter.persist(recorded.state, { type: "record-evidence", evidence: recorded.evidence });
  return canonical
    ? { ok: true, evidence: recorded.evidence, state: canonical }
    : recorded;
}

function titleFromSlug(value: string) {
  return value
    .split(/[-_]/g)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ") || value;
}

export function buildSscCglLearnerAttemptEvidence(input: {
  attemptId: string;
  test: SscCglTestDetail;
  question: SscCglQuestion;
  selectedOption: SscCglOptionId | "z" | null | undefined;
  confidence: LearnerConfidence;
  timeSpentSeconds: number;
  answeredAt: string;
  targetTimeSeconds?: number;
  topicLabel?: string;
}): LearnerAttemptEvidenceInput | null {
  const section = input.test.sections.find((item) => item.id === input.question.section);
  const answered = input.selectedOption === "a"
    || input.selectedOption === "b"
    || input.selectedOption === "c"
    || input.selectedOption === "d";
  const context: LearnerEvidenceContext = input.test.mode === "full_mock" || input.test.mode === "pyq_shift"
    ? "exam"
    : "practice";

  return normalizeLearnerAttemptEvidence({
    attemptId: input.attemptId,
    exam: { id: "ssc-cgl-tier-i", label: "SSC CGL Tier I" },
    subject: { id: input.question.section, label: section?.title ?? titleFromSlug(input.question.section) },
    topic: { id: input.question.topic, label: cleanText(input.topicLabel, 240) || titleFromSlug(input.question.topic) },
    question: { id: input.question.id, label: input.question.stem },
    correct: answered && input.selectedOption === input.question.correctOption,
    answered,
    confidence: input.confidence,
    timeSpentSeconds: input.timeSpentSeconds,
    targetTimeSeconds: input.targetTimeSeconds ?? 36,
    answeredAt: input.answeredAt,
    context
  });
}

function topicGroupKey(evidence: LearnerAttemptEvidence) {
  return JSON.stringify([evidence.exam.id, evidence.subject.id, evidence.topic.id]);
}

function confidencePenalty(evidence: LearnerAttemptEvidence) {
  if (!evidence.answered) return 0.8;
  if (!evidence.correct) {
    if (evidence.confidence === "high") return 1;
    if (evidence.confidence === "medium") return 0.7;
    return 0.4;
  }
  if (evidence.confidence === "low") return 0.4;
  if (evidence.confidence === "medium") return 0.1;
  return 0;
}

function percentage(value: number) {
  return `${Math.round(clamp(value) * 100)}%`;
}

function median(values: number[]) {
  if (values.length === 0) return null;
  const sorted = [...values].sort((left, right) => left - right);
  const midpoint = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? (sorted[midpoint - 1] + sorted[midpoint]) / 2
    : sorted[midpoint];
}

function nextDrillForTopic(input: {
  exam: LearnerEvidenceIdentity;
  subject: LearnerEvidenceIdentity;
  topic: LearnerEvidenceIdentity;
  status: LearnerTopicStatus;
  evidenceCount: number;
  highConfidenceErrors: number;
  daysSinceLatestEvidence: number;
  recencyWeightedAccuracy: number;
  confidenceRisk: number;
  paceRisk: number;
  targetTimeSeconds: number | null;
  reasons: string[];
}): LearnerDrillRecommendation {
  const base = {
    exam: input.exam,
    subject: input.subject,
    topic: input.topic,
    reason: input.reasons[0] ?? `${input.topic.label} needs another evidence-bearing drill.`
  };

  if (input.evidenceCount < 3) {
    return { ...base, mode: "diagnostic", questionCount: 5, timed: false, targetSecondsPerQuestion: null };
  }
  if (input.highConfidenceErrors >= 2 || (input.confidenceRisk >= 0.35 && input.recencyWeightedAccuracy >= 0.65)) {
    return { ...base, mode: "confidence-calibration", questionCount: 5, timed: false, targetSecondsPerQuestion: null };
  }
  if (input.recencyWeightedAccuracy < 0.65) {
    return { ...base, mode: "accuracy-repair", questionCount: 6, timed: false, targetSecondsPerQuestion: null };
  }
  if (input.daysSinceLatestEvidence >= 45) {
    return { ...base, mode: "spaced-recall", questionCount: 5, timed: false, targetSecondsPerQuestion: null };
  }
  if (input.paceRisk >= 0.3 && input.targetTimeSeconds !== null) {
    return {
      ...base,
      mode: "speed-repair",
      questionCount: 10,
      timed: true,
      targetSecondsPerQuestion: Math.round(input.targetTimeSeconds)
    };
  }
  return {
    ...base,
    mode: "mixed-practice",
    questionCount: input.status === "secure" ? 10 : 8,
    timed: input.targetTimeSeconds !== null,
    targetSecondsPerQuestion: input.targetTimeSeconds === null ? null : Math.round(input.targetTimeSeconds)
  };
}

function aggregateTopic(
  evidence: LearnerAttemptEvidence[],
  asOfTimestamp: number,
  options: Required<LearnerWeaknessEngineOptions>
): LearnerTopicWeakness {
  const latestFirst = [...evidence].sort((left, right) => Date.parse(right.answeredAt) - Date.parse(left.answeredAt));
  const latest = latestFirst[0];
  const weighted = latestFirst.map((item) => {
    const ageDays = Math.max(0, (asOfTimestamp - Date.parse(item.answeredAt)) / dayMs);
    const weight = 0.5 ** (ageDays / options.recencyHalfLifeDays);
    return { item, ageDays, weight };
  });
  const weightTotal = weighted.reduce((sum, item) => sum + item.weight, 0);
  const squaredWeightTotal = weighted.reduce((sum, item) => sum + item.weight ** 2, 0);
  const weightedCorrect = weighted.reduce((sum, item) => sum + (item.item.correct ? item.weight : 0), 0);
  const recencyWeightedAccuracy = weightTotal > 0 ? weightedCorrect / weightTotal : 0;
  const sampleAdjustedAccuracy = (2 + weightedCorrect) / (4 + weightTotal);
  const effectiveSampleSize = squaredWeightTotal > 0 ? weightTotal ** 2 / squaredWeightTotal : 0;
  const correct = latestFirst.filter((item) => item.correct).length;
  const unattempted = latestFirst.filter((item) => !item.answered).length;
  const wrong = latestFirst.filter((item) => item.answered && !item.correct).length;
  const rawAccuracy = latestFirst.length > 0 ? correct / latestFirst.length : 0;
  const confidenceRisk = weightTotal > 0
    ? weighted.reduce((sum, item) => sum + confidencePenalty(item.item) * item.weight, 0) / weightTotal
    : 0;
  const timedEvidence = weighted.filter((item) => item.item.targetTimeSeconds !== null);
  const timedWeight = timedEvidence.reduce((sum, item) => sum + item.weight, 0);
  const paceRisk = timedWeight > 0
    ? timedEvidence.reduce((sum, item) => {
      const target = item.item.targetTimeSeconds ?? 1;
      return sum + (item.item.timeSpentSeconds > target * options.slowPaceMultiplier ? item.weight : 0);
    }, 0) / timedWeight
    : 0;
  const targetTimeSeconds = median(timedEvidence.map((item) => item.item.targetTimeSeconds).filter((value): value is number => value !== null));
  const averageTimeSeconds = latestFirst.reduce((sum, item) => sum + item.timeSpentSeconds, 0) / latestFirst.length;
  const daysSinceLatestEvidence = Math.max(0, Math.floor((asOfTimestamp - Date.parse(latest.answeredAt)) / dayMs));
  const stalenessRisk = clamp(daysSinceLatestEvidence / 90);
  const accuracyComponent = sampleAdjustedAccuracy * 75;
  const confidenceComponent = (1 - confidenceRisk) * 10;
  const paceComponent = timedEvidence.length > 0 ? (1 - paceRisk) * 10 : 5;
  const freshnessComponent = (1 - stalenessRisk) * 5;
  const rawMastery = accuracyComponent + confidenceComponent + paceComponent + freshnessComponent;
  const reliability = clamp(weightTotal / options.minimumEvidenceForMastery);
  const masteryScore = Math.round(clamp(50 + (rawMastery - 50) * reliability, 0, 100));
  const weaknessScore = 100 - masteryScore;

  let status: LearnerTopicStatus;
  if (latestFirst.length < 3 || weightTotal < 2) status = "insufficient-evidence";
  else if (masteryScore < 45) status = "weak";
  else if (masteryScore < 65) status = "fragile";
  else if (
    masteryScore >= 75
    && recencyWeightedAccuracy >= 0.75
    && confidenceRisk < 0.25
    && (timedEvidence.length === 0 || paceRisk < 0.3)
  ) status = "secure";
  else status = "developing";

  const reasons: string[] = [];
  if (latestFirst.length < 3) {
    reasons.push(`Only ${latestFirst.length} attempt${latestFirst.length === 1 ? "" : "s"} exist, so mastery is not established.`);
  } else {
    reasons.push(`${correct} of ${latestFirst.length} attempts were correct; recency-weighted accuracy is ${percentage(recencyWeightedAccuracy)}.`);
  }
  const highConfidenceErrors = latestFirst.filter((item) => !item.correct && item.confidence === "high").length;
  if (highConfidenceErrors > 0) {
    reasons.push(`${highConfidenceErrors} high-confidence error${highConfidenceErrors === 1 ? "" : "s"} suggest a misconception rather than a guess.`);
  } else if (confidenceRisk >= 0.25) {
    reasons.push(`Confidence is not yet well calibrated (${percentage(confidenceRisk)} risk).`);
  }
  const slowCount = timedEvidence.filter((item) => {
    const target = item.item.targetTimeSeconds ?? 1;
    return item.item.timeSpentSeconds > target * options.slowPaceMultiplier;
  }).length;
  if (slowCount > 0) {
    reasons.push(`${slowCount} of ${timedEvidence.length} timed attempts exceeded ${options.slowPaceMultiplier.toFixed(2)}× the target pace.`);
  }
  if (daysSinceLatestEvidence >= 45) {
    reasons.push(`The latest evidence is ${daysSinceLatestEvidence} days old, so recall may have decayed.`);
  }
  reasons.push(`Mastery is ${masteryScore}/100 after recency and sample-size adjustment.`);

  const drill = nextDrillForTopic({
    exam: latest.exam,
    subject: latest.subject,
    topic: latest.topic,
    status,
    evidenceCount: latestFirst.length,
    highConfidenceErrors,
    daysSinceLatestEvidence,
    recencyWeightedAccuracy,
    confidenceRisk,
    paceRisk,
    targetTimeSeconds,
    reasons
  });

  return {
    key: topicGroupKey(latest),
    exam: latest.exam,
    subject: latest.subject,
    topic: latest.topic,
    status,
    evidenceCount: latestFirst.length,
    effectiveSampleSize: round(effectiveSampleSize, 2),
    effectiveEvidenceWeight: round(weightTotal, 2),
    correct,
    wrong,
    unattempted,
    rawAccuracy: round(rawAccuracy),
    recencyWeightedAccuracy: round(recencyWeightedAccuracy),
    sampleAdjustedAccuracy: round(sampleAdjustedAccuracy),
    confidenceRisk: round(confidenceRisk),
    paceRisk: round(paceRisk),
    timedEvidenceCount: timedEvidence.length,
    averageTimeSeconds: round(averageTimeSeconds, 1),
    targetTimeSeconds: targetTimeSeconds === null ? null : round(targetTimeSeconds, 1),
    daysSinceLatestEvidence,
    masteryScore,
    weaknessScore,
    reasons,
    nextDrill: drill
  };
}

const statusPriority: Record<LearnerTopicStatus, number> = {
  weak: 5,
  fragile: 4,
  "insufficient-evidence": 3,
  developing: 2,
  secure: 1
};

function defaultDrill(): LearnerDrillRecommendation {
  return {
    mode: "diagnostic",
    exam: null,
    subject: null,
    topic: null,
    questionCount: 5,
    timed: false,
    targetSecondsPerQuestion: null,
    reason: "Complete a five-question diagnostic and record confidence and time for each answer."
  };
}

export function buildLearnerWeaknessReport(
  stateOrEvidence: LearnerWeaknessState | LearnerAttemptEvidence[],
  asOf: string,
  engineOptions: LearnerWeaknessEngineOptions = {}
): LearnerWeaknessReport {
  const generatedAt = validIsoDate(asOf);
  if (!generatedAt) {
    return {
      generatedAt: new Date(0).toISOString(),
      evidenceCount: 0,
      usableEvidenceCount: 0,
      futureEvidenceIgnored: 0,
      topics: [],
      weakestTopic: null,
      nextDrill: defaultDrill()
    };
  }

  const options: Required<LearnerWeaknessEngineOptions> = {
    recencyHalfLifeDays: Math.max(1, engineOptions.recencyHalfLifeDays ?? 45),
    minimumEvidenceForMastery: Math.max(1, engineOptions.minimumEvidenceForMastery ?? 5),
    slowPaceMultiplier: Math.max(1, engineOptions.slowPaceMultiplier ?? 1.25)
  };
  const allEvidence = normalizedEvidenceList(Array.isArray(stateOrEvidence) ? stateOrEvidence : stateOrEvidence.evidence);
  const asOfTimestamp = Date.parse(generatedAt);
  const usable = allEvidence.filter((item) => Date.parse(item.answeredAt) <= asOfTimestamp);
  const groups = new Map<string, LearnerAttemptEvidence[]>();

  for (const evidence of usable) {
    const key = topicGroupKey(evidence);
    groups.set(key, [...(groups.get(key) ?? []), evidence]);
  }

  const topics = [...groups.values()]
    .map((evidence) => aggregateTopic(evidence, asOfTimestamp, options))
    .sort((left, right) => {
      const statusDifference = statusPriority[right.status] - statusPriority[left.status];
      if (statusDifference) return statusDifference;
      const weaknessDifference = right.weaknessScore - left.weaknessScore;
      if (weaknessDifference) return weaknessDifference;
      const countDifference = right.evidenceCount - left.evidenceCount;
      if (countDifference) return countDifference;
      return left.key.localeCompare(right.key);
    });
  const weakestTopic = topics[0] ?? null;

  return {
    generatedAt,
    evidenceCount: allEvidence.length,
    usableEvidenceCount: usable.length,
    futureEvidenceIgnored: allEvidence.length - usable.length,
    topics,
    weakestTopic,
    nextDrill: weakestTopic?.nextDrill ?? defaultDrill()
  };
}
