import assert from "node:assert/strict";
import test from "node:test";
import type { SscCglQuestion, SscCglTestDetail } from "@/lib/exam-types";
import {
  buildLearnerWeaknessReport,
  buildSscCglLearnerAttemptEvidence,
  createLearnerWeaknessState,
  learnerWeaknessChangeEvent,
  parseLearnerWeaknessState,
  recordLearnerAttemptEvidence,
  recordLearnerAttemptEvidenceBatch,
  recordLearnerAttemptEvidenceWithAdapter,
  serializeLearnerWeaknessState,
  type LearnerAttemptEvidenceInput,
  type LearnerWeaknessAdapter,
  type LearnerWeaknessState
} from "@/lib/learner-weakness-engine";

function evidence(input: Partial<LearnerAttemptEvidenceInput> & Pick<LearnerAttemptEvidenceInput, "attemptId" | "correct" | "answeredAt">): LearnerAttemptEvidenceInput {
  return {
    attemptId: input.attemptId,
    exam: input.exam ?? { id: "ssc-cgl-tier-i", label: "SSC CGL Tier I" },
    subject: input.subject ?? { id: "quantitative-aptitude", label: "Quantitative Aptitude" },
    topic: input.topic ?? { id: "percentages", label: "Percentages" },
    question: input.question ?? { id: `question-${input.attemptId}`, label: `Question ${input.attemptId}` },
    correct: input.correct,
    answered: input.answered,
    confidence: input.confidence ?? "medium",
    timeSpentSeconds: input.timeSpentSeconds ?? 30,
    targetTimeSeconds: input.targetTimeSeconds === undefined ? 36 : input.targetTimeSeconds,
    answeredAt: input.answeredAt,
    context: input.context ?? "practice"
  };
}

function stateWith(inputs: LearnerAttemptEvidenceInput[]) {
  return inputs.reduce((state, input) => {
    const recorded = recordLearnerAttemptEvidence(state, input);
    assert.equal(recorded.ok, true);
    return recorded.state;
  }, createLearnerWeaknessState());
}

test("learner weakness evidence is versioned, validated, deduplicated, and safely parsed", () => {
  assert.equal(learnerWeaknessChangeEvent, "miteee:learner-weakness-change");
  const first = evidence({ attemptId: "attempt-1", correct: false, answeredAt: "2026-07-14T08:00:00.000Z" });
  const initial = recordLearnerAttemptEvidence(createLearnerWeaknessState(), first);
  assert.equal(initial.ok, true);
  if (!initial.ok) return;
  assert.equal(initial.evidence.id, "attempt-1::question-attempt-1");

  const replacement = recordLearnerAttemptEvidence(initial.state, { ...first, correct: true, confidence: "high" });
  assert.equal(replacement.ok, true);
  if (!replacement.ok) return;
  assert.equal(replacement.state.evidence.length, 1);
  assert.equal(replacement.state.evidence[0]?.correct, true);
  assert.deepEqual(parseLearnerWeaknessState(serializeLearnerWeaknessState(replacement.state)), replacement.state);
  assert.deepEqual(parseLearnerWeaknessState("broken-json"), createLearnerWeaknessState());
  assert.deepEqual(
    parseLearnerWeaknessState(JSON.stringify({ version: 99, evidence: replacement.state.evidence })),
    createLearnerWeaknessState()
  );

  const invalid = recordLearnerAttemptEvidence(replacement.state, { ...first, timeSpentSeconds: Number.NaN });
  assert.equal(invalid.ok, false);
  assert.equal(invalid.state, replacement.state);
});

test("stored SSC evidence migrates known source-like topic labels without rewriting legitimate names", () => {
  const base = evidence({
    attemptId: "stale-topic-label",
    correct: false,
    answeredAt: "2026-07-14T08:00:00.000Z",
    topic: { id: "series-coding", label: "Scribd HTML Pages" }
  });
  const parsed = parseLearnerWeaknessState(JSON.stringify({
    version: 1,
    evidence: [{
      ...base,
      id: "stale-topic-label::question-stale-topic-label",
      answered: true,
      targetTimeSeconds: 36
    }],
    updatedAt: base.answeredAt
  }));
  const report = buildLearnerWeaknessReport(parsed, "2026-07-14T12:00:00.000Z");

  assert.equal(parsed.evidence[0]?.topic.label, "Series Coding");
  assert.equal(report.topics[0]?.topic.label, "Series Coding");

  const legitimateSsc = recordLearnerAttemptEvidence(createLearnerWeaknessState(), {
    ...base,
    attemptId: "legitimate-ssc-label",
    question: { id: "legitimate-ssc-question", label: "Legitimate SSC question" },
    topic: { id: "series-coding", label: "Series and Coding-Decoding" }
  });
  assert.equal(legitimateSsc.ok && legitimateSsc.evidence.topic.label, "Series and Coding-Decoding");

  const legitimateOtherExam = recordLearnerAttemptEvidence(createLearnerWeaknessState(), {
    ...base,
    attemptId: "legitimate-course-label",
    exam: { id: "sem5-web-archives", label: "Web Archives" },
    question: { id: "legitimate-course-question", label: "Legitimate course question" }
  });
  assert.equal(legitimateOtherExam.ok && legitimateOtherExam.evidence.topic.label, "Scribd HTML Pages");
});

test("wrong and unattempted evidence remain distinct in topic explanations", () => {
  const topic = buildLearnerWeaknessReport(stateWith([
    evidence({ attemptId: "correct", correct: true, answeredAt: "2026-07-12T08:00:00.000Z" }),
    evidence({ attemptId: "wrong", correct: false, answered: true, answeredAt: "2026-07-13T08:00:00.000Z" }),
    evidence({ attemptId: "skipped", correct: false, answered: false, answeredAt: "2026-07-14T08:00:00.000Z" })
  ]), "2026-07-14T12:00:00.000Z").topics[0];

  assert.equal(topic?.correct, 1);
  assert.equal(topic?.wrong, 1);
  assert.equal(topic?.unattempted, 1);
});

test("learner weakness evidence batches are efficient, deduplicated, and atomic", () => {
  const existing = stateWith([
    evidence({ attemptId: "existing", correct: false, answeredAt: "2026-07-13T08:00:00.000Z" })
  ]);
  const replacement = evidence({ attemptId: "existing", correct: true, confidence: "high", answeredAt: "2026-07-14T08:00:00.000Z" });
  const additional = evidence({ attemptId: "additional", correct: false, answeredAt: "2026-07-14T08:01:00.000Z" });
  const recorded = recordLearnerAttemptEvidenceBatch(existing, [replacement, additional]);

  assert.equal(recorded.ok, true);
  if (!recorded.ok) return;
  assert.equal(recorded.evidence.length, 2);
  assert.equal(recorded.state.evidence.length, 2);
  assert.equal(recorded.state.evidence.find((item) => item.attemptId === "existing")?.correct, true);

  const invalid = recordLearnerAttemptEvidenceBatch(recorded.state, [
    additional,
    { ...additional, attemptId: "invalid", timeSpentSeconds: Number.NaN }
  ]);
  assert.equal(invalid.ok, false);
  assert.equal(invalid.state, recorded.state);
});

test("sample-size handling prevents one lucky answer from becoming secure mastery", () => {
  const oneCorrect = stateWith([
    evidence({ attemptId: "one", correct: true, confidence: "high", answeredAt: "2026-07-14T08:00:00.000Z" })
  ]);
  const fiveCorrect = stateWith(Array.from({ length: 5 }, (_, index) => evidence({
    attemptId: `five-${index}`,
    correct: true,
    confidence: "high",
    answeredAt: `2026-07-1${index}T08:00:00.000Z`
  })));

  const sparse = buildLearnerWeaknessReport(oneCorrect, "2026-07-14T12:00:00.000Z").topics[0];
  const established = buildLearnerWeaknessReport(fiveCorrect, "2026-07-14T12:00:00.000Z").topics[0];
  assert.equal(sparse?.status, "insufficient-evidence");
  assert.equal(sparse?.nextDrill.mode, "diagnostic");
  assert.equal(established?.status, "secure");
  assert.ok((established?.masteryScore ?? 0) > (sparse?.masteryScore ?? 100));
});

test("recent errors outweigh old success and produce an explained accuracy repair", () => {
  const attempts = [
    evidence({ attemptId: "old-1", correct: true, confidence: "high", answeredAt: "2025-12-01T08:00:00.000Z" }),
    evidence({ attemptId: "old-2", correct: true, confidence: "high", answeredAt: "2025-12-02T08:00:00.000Z" }),
    evidence({ attemptId: "old-3", correct: true, confidence: "high", answeredAt: "2025-12-03T08:00:00.000Z" }),
    evidence({ attemptId: "new-1", correct: false, confidence: "low", answeredAt: "2026-07-13T08:00:00.000Z" }),
    evidence({ attemptId: "new-2", correct: false, confidence: "low", answeredAt: "2026-07-14T08:00:00.000Z" })
  ];
  const topic = buildLearnerWeaknessReport(stateWith(attempts), "2026-07-14T12:00:00.000Z").topics[0];

  assert.ok((topic?.recencyWeightedAccuracy ?? 1) < (topic?.rawAccuracy ?? 0));
  assert.equal(topic?.nextDrill.mode, "accuracy-repair");
  assert.match(topic?.reasons.join(" ") ?? "", /recency-weighted accuracy/);
  assert.match(topic?.reasons.join(" ") ?? "", /sample-size adjustment/);
});

test("high-confidence errors are treated as misconception evidence", () => {
  const attempts = Array.from({ length: 5 }, (_, index) => evidence({
    attemptId: `confident-${index}`,
    correct: index >= 3,
    confidence: "high",
    answeredAt: `2026-07-1${index}T09:00:00.000Z`
  }));
  const topic = buildLearnerWeaknessReport(stateWith(attempts), "2026-07-14T12:00:00.000Z").topics[0];

  assert.equal(topic?.nextDrill.mode, "confidence-calibration");
  assert.ok((topic?.confidenceRisk ?? 0) >= 0.35);
  assert.match(topic?.reasons.join(" ") ?? "", /high-confidence errors.*misconception/);
});

test("accurate but slow work recommends a timed speed repair", () => {
  const attempts = Array.from({ length: 5 }, (_, index) => evidence({
    attemptId: `slow-${index}`,
    correct: true,
    confidence: "high",
    timeSpentSeconds: 60,
    targetTimeSeconds: 36,
    answeredAt: `2026-07-1${index}T10:00:00.000Z`
  }));
  const topic = buildLearnerWeaknessReport(stateWith(attempts), "2026-07-14T12:00:00.000Z").topics[0];

  assert.equal(topic?.nextDrill.mode, "speed-repair");
  assert.equal(topic?.nextDrill.timed, true);
  assert.equal(topic?.nextDrill.targetSecondsPerQuestion, 36);
  assert.equal(topic?.paceRisk, 1);
  assert.match(topic?.reasons.join(" ") ?? "", /timed attempts exceeded 1\.25×/);
});

test("old evidence recommends spaced recall and future evidence is ignored", () => {
  const oldAttempts = Array.from({ length: 5 }, (_, index) => evidence({
    attemptId: `old-${index}`,
    correct: true,
    confidence: "high",
    answeredAt: `2026-01-0${index + 1}T08:00:00.000Z`
  }));
  const future = evidence({ attemptId: "future", correct: false, answeredAt: "2027-01-01T08:00:00.000Z" });
  const report = buildLearnerWeaknessReport(stateWith([...oldAttempts, future]), "2026-07-14T12:00:00.000Z");

  assert.equal(report.futureEvidenceIgnored, 1);
  assert.equal(report.topics[0]?.nextDrill.mode, "spaced-recall");
  assert.ok((report.topics[0]?.daysSinceLatestEvidence ?? 0) >= 45);
});

test("SSC evidence builder maps existing exam and question types", () => {
  const question: SscCglQuestion = {
    id: "ssc-q-1",
    exam: "SSC-CGL",
    tier: "Tier-I",
    year: 2025,
    shift: "Shift 1",
    source: "Original practice",
    section: "quantitative-aptitude",
    topic: "percentages",
    subtopic: "successive change",
    difficulty: "medium",
    language: "en",
    stem: "What is the successive percentage change?",
    options: ["a", "b", "c", "d"].map((id) => ({ id: id as "a" | "b" | "c" | "d", text: id })),
    correctOption: "b",
    explanation: "Use the successive change formula.",
    marksCorrect: 2,
    marksWrong: -0.5,
    marksUnattempted: 0,
    timerSeconds: 900,
    ocrConfidence: 1,
    reviewStatus: "reviewed",
    conceptTags: ["percentage"],
    provenance: { sourceId: "original", sourceType: "original_practice", title: "Practice", licenseNote: "Original" }
  };
  const testDetail: SscCglTestDetail = {
    id: "quick-quant",
    title: "Quick Quant",
    mode: "topic_drill",
    questionCount: 1,
    maxScore: 2,
    durationSeconds: 36,
    sourceType: "original_practice",
    reviewStatus: "reviewed",
    description: "Focused drill",
    sections: [{ id: "quantitative-aptitude", title: "Quantitative Aptitude", timerSeconds: 36, questions: [question] }]
  };
  const built = buildSscCglLearnerAttemptEvidence({
    attemptId: "attempt-ssc",
    test: testDetail,
    question,
    selectedOption: "a",
    confidence: "high",
    timeSpentSeconds: 44,
    answeredAt: "2026-07-14T10:00:00.000Z"
  });

  assert.equal(built?.exam.id, "ssc-cgl-tier-i");
  assert.equal(built?.subject.id, "quantitative-aptitude");
  assert.equal(built?.topic.label, "Percentages");
  assert.equal(built?.question.id, "ssc-q-1");
  assert.equal(built?.correct, false);
  assert.equal(built?.confidence, "high");
  assert.equal(built?.timeSpentSeconds, 44);
  assert.equal(built?.targetTimeSeconds, 36);
  assert.equal(built?.context, "practice");
});

test("account adapter seam can return canonical persisted evidence", async () => {
  let persisted: LearnerWeaknessState = createLearnerWeaknessState();
  const adapter: LearnerWeaknessAdapter = {
    load: () => persisted,
    persist: (next, mutation) => {
      assert.equal(mutation.type, "record-evidence");
      persisted = next;
      return next;
    }
  };
  const recorded = await recordLearnerAttemptEvidenceWithAdapter(adapter, evidence({
    attemptId: "adapter-1",
    correct: false,
    confidence: "high",
    answeredAt: "2026-07-14T10:00:00.000Z"
  }));

  assert.equal(recorded.ok, true);
  assert.equal(recorded.state.evidence.length, 1);
  assert.equal(persisted?.evidence[0]?.id, "adapter-1::question-adapter-1");
});
