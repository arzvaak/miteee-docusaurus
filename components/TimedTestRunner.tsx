"use client";

import Image from "next/image";
import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Circle,
  Clock3,
  Eraser,
  Info,
  LockKeyhole,
  LogOut,
  Minus,
  RotateCcw,
  Send,
  X
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { MathText } from "@/components/MathText";
import type { SscCglOptionId, SscCglTestDetail } from "@/lib/exam-types";
import {
  buildSscAttemptHistoryItem,
  mergeSscAttemptHistory,
  parseSscAttemptHistory,
  serializeSscAttemptHistory,
  sscAttemptHistoryStorageKey
} from "@/lib/ssc-cgl-attempt-history";
import { buildSscAttemptQuestionReview } from "@/lib/ssc-cgl-attempt-review";
import {
  buildSscMistakeBankItems,
  mergeSscMistakeBank,
  parseSscMistakeBank,
  serializeSscMistakeBank,
  sscMistakeBankStorageKey
} from "@/lib/ssc-cgl-mistake-bank";
import { persistLearnerAttemptEvidenceBatch } from "@/lib/learner-weakness-client";
import { buildSscCglLearnerAttemptEvidence, type LearnerAttemptEvidenceInput } from "@/lib/learner-weakness-engine";
import { scoreSscAttempt } from "@/lib/ssc-cgl-tests";
import styles from "./TimedTestRunner.module.css";

type StoredAttempt = {
  test: SscCglTestDetail;
  result: ReturnType<typeof scoreSscAttempt>;
  answers: Record<string, SscCglOptionId | null>;
  savedAt: string;
};

export type TimedTestDraft = {
  version: 1;
  testId: string;
  answers: Record<string, SscCglOptionId | null>;
  visitedQuestionIds: string[];
  markedQuestionIds: string[];
  sectionIndex: number;
  questionIndex: number;
  lockedSectionIds: string[];
  sectionRemainingSeconds: Record<string, number>;
  sectionTimeSpentSeconds: Record<string, number>;
  startedAt: string;
  savedAt: string;
};

export type QuestionPaletteStatus =
  | "not-visited"
  | "not-answered"
  | "answered"
  | "marked"
  | "answered-marked";

type ConfirmAction = "submit" | "exit" | "clear-attempt" | "finish-section";

const storagePrefix = "ssc-cgl-attempt:";
const draftStoragePrefix = "ssc-cgl-draft:";
const optionIds: SscCglOptionId[] = ["a", "b", "c", "d"];

function attemptStorageKey(attemptId: string) {
  return `${storagePrefix}${attemptId}`;
}

export function timedTestDraftStorageKey(testId: string) {
  return `${draftStoragePrefix}${testId}`;
}

export function isTimedSection(timerSeconds: number) {
  return Number.isFinite(timerSeconds) && timerSeconds > 0;
}

export function getSectionEvidenceTargetSeconds(timerSeconds: number, questionCount: number) {
  if (!isTimedSection(timerSeconds)) return 36;
  return timerSeconds / Math.max(1, Math.floor(questionCount));
}

function formatTimer(seconds: number) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function isIsoDate(value: unknown): value is string {
  return typeof value === "string" && !Number.isNaN(Date.parse(value));
}

function uniqueKnownStrings(value: unknown, known: Set<string>) {
  if (!Array.isArray(value)) return [];
  return [...new Set(value.filter((item): item is string => typeof item === "string" && known.has(item)))];
}

function normalizeSectionNumberMap(
  raw: unknown,
  test: SscCglTestDetail,
  fallback: (timerSeconds: number) => number
) {
  const source = isRecord(raw) ? raw : {};
  return Object.fromEntries(test.sections.map((section) => {
    const value = source[section.id];
    const safeValue = typeof value === "number" && Number.isFinite(value)
      ? Math.max(0, Math.min(section.timerSeconds, Math.floor(value)))
      : fallback(section.timerSeconds);
    return [section.id, safeValue];
  }));
}

export function parseTimedTestDraft(raw: string | null, test: SscCglTestDetail): TimedTestDraft | null {
  if (!raw) return null;

  try {
    const parsed: unknown = JSON.parse(raw);
    if (
      !isRecord(parsed)
      || parsed.version !== 1
      || parsed.testId !== test.id
      || !isRecord(parsed.answers)
      || !isIsoDate(parsed.startedAt)
      || !isIsoDate(parsed.savedAt)
      || !Number.isInteger(parsed.sectionIndex)
      || !Number.isInteger(parsed.questionIndex)
    ) {
      return null;
    }

    const questionIds = new Set(test.sections.flatMap((section) => section.questions.map((question) => question.id)));
    const sectionIds = new Set(test.sections.map((section) => section.id));
    const answers: Record<string, SscCglOptionId | null> = {};

    for (const [questionId, selected] of Object.entries(parsed.answers)) {
      if (!questionIds.has(questionId)) continue;
      if (selected === null || optionIds.includes(selected as SscCglOptionId)) {
        answers[questionId] = selected as SscCglOptionId | null;
      }
    }

    const maxSectionIndex = Math.max(0, test.sections.length - 1);
    const sectionIndex = Math.max(0, Math.min(maxSectionIndex, parsed.sectionIndex as number));
    const activeSection = test.sections[sectionIndex];
    const maxQuestionIndex = Math.max(0, (activeSection?.questions.length ?? 1) - 1);
    const questionIndex = Math.max(0, Math.min(maxQuestionIndex, parsed.questionIndex as number));
    const lockedSectionIds = test.sections.slice(0, sectionIndex).map((section) => section.id);

    return {
      version: 1,
      testId: test.id,
      answers,
      visitedQuestionIds: uniqueKnownStrings(parsed.visitedQuestionIds, questionIds),
      markedQuestionIds: uniqueKnownStrings(parsed.markedQuestionIds, questionIds),
      sectionIndex,
      questionIndex,
      lockedSectionIds: uniqueKnownStrings(lockedSectionIds, sectionIds),
      sectionRemainingSeconds: normalizeSectionNumberMap(parsed.sectionRemainingSeconds, test, (timerSeconds) => timerSeconds),
      sectionTimeSpentSeconds: normalizeSectionNumberMap(parsed.sectionTimeSpentSeconds, test, () => 0),
      startedAt: parsed.startedAt,
      savedAt: parsed.savedAt
    };
  } catch {
    return null;
  }
}

export function getQuestionPaletteStatus(input: {
  answered: boolean;
  visited: boolean;
  marked: boolean;
}): QuestionPaletteStatus {
  if (input.answered && input.marked) return "answered-marked";
  if (input.marked) return "marked";
  if (input.answered) return "answered";
  if (input.visited) return "not-answered";
  return "not-visited";
}

function paletteStatusLabel(status: QuestionPaletteStatus) {
  return {
    "not-visited": "Not visited",
    "not-answered": "Not answered",
    answered: "Answered",
    marked: "Marked for review",
    "answered-marked": "Answered and marked"
  }[status];
}

function PaletteStatusIcon({ status, size = 13 }: { status: QuestionPaletteStatus; size?: number }) {
  if (status === "answered-marked") {
    return (
      <span className={styles.dualStatusIcon} aria-hidden="true">
        <Check size={size} />
        <Bookmark size={size} />
      </span>
    );
  }
  if (status === "answered") return <Check size={size} aria-hidden="true" />;
  if (status === "marked") return <Bookmark size={size} aria-hidden="true" />;
  if (status === "not-answered") return <Minus size={size} aria-hidden="true" />;
  return <Circle size={size} aria-hidden="true" />;
}

export function getSectionVisualState(index: number, currentIndex: number) {
  if (index < currentIndex) return "completed" as const;
  if (index === currentIndex) return "current" as const;
  if (index === currentIndex + 1) return "up-next" as const;
  return "locked" as const;
}

export function getSectionTimeoutAction(input: {
  timerSeconds: number;
  remainingSeconds: number;
  sectionIndex: number;
  sectionCount: number;
}) {
  if (!isTimedSection(input.timerSeconds) || input.remainingSeconds > 0) return "none" as const;
  return input.sectionIndex >= input.sectionCount - 1 ? "submit" as const : "advance" as const;
}

function confirmationCopy(action: ConfirmAction, input: { unanswered: number; sectionTitle: string; finalSection: boolean }) {
  if (action === "submit") {
    return {
      title: "Submit this test?",
      body: input.unanswered > 0
        ? `${input.unanswered} question${input.unanswered === 1 ? " is" : "s are"} unanswered. Your score and review will be shown only after submission.`
        : "All responses are saved. Your score and detailed review will be shown after submission.",
      confirm: "Submit test"
    };
  }
  if (action === "exit") {
    return {
      title: "Exit the test?",
      body: "Your in-progress attempt is saved on this device and can be recovered when you return.",
      confirm: "Save and exit"
    };
  }
  if (action === "clear-attempt") {
    return {
      title: "Restart this attempt?",
      body: "This clears every answer, visit, review mark, and section timer saved for this test.",
      confirm: "Clear attempt"
    };
  }
  return {
    title: input.finalSection ? "Finish and submit?" : `Finish ${input.sectionTitle}?`,
    body: input.finalSection
      ? "This is the final section. Finishing it submits the complete test."
      : "This section becomes permanently locked. You cannot return after moving to the next section.",
    confirm: input.finalSection ? "Submit test" : "Lock and continue"
  };
}

export function TimedTestRunner({ test }: { test: SscCglTestDetail }) {
  const initialRemaining = useMemo(
    () => Object.fromEntries(test.sections.map((section) => [section.id, section.timerSeconds])),
    [test.sections]
  );
  const initialSpent = useMemo(
    () => Object.fromEntries(test.sections.map((section) => [section.id, 0])),
    [test.sections]
  );
  const draftKey = useMemo(() => timedTestDraftStorageKey(test.id), [test.id]);

  const [sectionIndex, setSectionIndex] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, SscCglOptionId | null>>({});
  const [visitedQuestionIds, setVisitedQuestionIds] = useState<Set<string>>(() => {
    const firstQuestionId = test.sections[0]?.questions[0]?.id;
    return new Set(firstQuestionId ? [firstQuestionId] : []);
  });
  const [markedQuestionIds, setMarkedQuestionIds] = useState<Set<string>>(() => new Set());
  const [lockedSectionIds, setLockedSectionIds] = useState<Set<string>>(() => new Set());
  const [sectionRemainingSeconds, setSectionRemainingSeconds] = useState<Record<string, number>>(initialRemaining);
  const [sectionTimeSpentSeconds, setSectionTimeSpentSeconds] = useState<Record<string, number>>(initialSpent);
  const [startedAt, setStartedAt] = useState(() => new Date().toISOString());
  const [submittedAttemptId, setSubmittedAttemptId] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [recoveryNotice, setRecoveryNotice] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState("Preparing local autosave…");
  const [paletteOpen, setPaletteOpen] = useState(true);
  const [confirmAction, setConfirmAction] = useState<ConfirmAction | null>(null);
  const allowNavigationRef = useRef(false);
  const submissionStartedRef = useRef(false);
  const handledTimeoutSectionRef = useRef<string | null>(null);

  const section = test.sections[sectionIndex] ?? null;
  const question = section?.questions[questionIndex] ?? null;
  const remaining = section ? sectionRemainingSeconds[section.id] ?? section.timerSeconds : 0;
  const timed = section ? isTimedSection(section.timerSeconds) : false;
  const answeredCount = Object.values(answers).filter((answer): answer is SscCglOptionId => Boolean(answer)).length;
  const sectionAnswered = section?.questions.filter((item) => Boolean(answers[item.id])).length ?? 0;
  const totalQuestions = test.sections.reduce((total, item) => total + item.questions.length, 0);
  const unansweredCount = Math.max(0, totalQuestions - answeredCount);
  const finalSection = sectionIndex >= test.sections.length - 1;

  const submitAttempt = useCallback((origin: "manual" | "timeout") => {
    if (submissionStartedRef.current) return;
    submissionStartedRef.current = true;
    allowNavigationRef.current = true;

    const attemptId = `ssc-cgl-${Date.now()}`;
    const submittedAt = new Date().toISOString();
    const result = scoreSscAttempt(test, {
      attemptId,
      startedAt,
      submittedAt,
      answers,
      sectionTimeSpentSeconds
    });
    const stored: StoredAttempt = { test, result, answers, savedAt: submittedAt };

    window.localStorage.setItem(attemptStorageKey(attemptId), JSON.stringify(stored));
    const currentHistory = parseSscAttemptHistory(window.localStorage.getItem(sscAttemptHistoryStorageKey));
    const nextHistoryItem = buildSscAttemptHistoryItem(test, result, submittedAt);
    window.localStorage.setItem(
      sscAttemptHistoryStorageKey,
      serializeSscAttemptHistory(mergeSscAttemptHistory(currentHistory, nextHistoryItem))
    );

    const reviewRows = buildSscAttemptQuestionReview(test, answers);
    const currentMistakes = parseSscMistakeBank(window.localStorage.getItem(sscMistakeBankStorageKey));
    const nextMistakes = buildSscMistakeBankItems(reviewRows, {
      attemptId,
      testId: test.id,
      testTitle: test.title,
      savedAt: submittedAt
    });
    const correctedQuestionIds = reviewRows.filter((row) => row.status === "correct").map((row) => row.questionId);
    window.localStorage.setItem(
      sscMistakeBankStorageKey,
      serializeSscMistakeBank(mergeSscMistakeBank(currentMistakes, nextMistakes, correctedQuestionIds))
    );

    const learnerEvidence = test.sections.flatMap((testSection) => {
      const averageTime = (sectionTimeSpentSeconds[testSection.id] ?? 0) / Math.max(1, testSection.questions.length);
      const targetTime = getSectionEvidenceTargetSeconds(testSection.timerSeconds, testSection.questions.length);
      return testSection.questions
        .map((testQuestion) => buildSscCglLearnerAttemptEvidence({
          attemptId,
          test,
          question: testQuestion,
          selectedOption: answers[testQuestion.id],
          confidence: "medium",
          timeSpentSeconds: averageTime,
          targetTimeSeconds: targetTime,
          answeredAt: submittedAt
        }))
        .filter((item): item is LearnerAttemptEvidenceInput => item !== null);
    });
    persistLearnerAttemptEvidenceBatch(learnerEvidence);

    window.localStorage.removeItem(draftKey);
    setSubmittedAttemptId(attemptId);
    setSaveStatus(origin === "timeout" ? "Time ended — submitting…" : "Submitting…");
    window.location.assign(`/exams/ssc-cgl/results/${attemptId}`);
  }, [answers, draftKey, sectionTimeSpentSeconds, startedAt, test]);

  const advanceToNextSection = useCallback(() => {
    if (!section || finalSection) return;
    const nextQuestionId = test.sections[sectionIndex + 1]?.questions[0]?.id;
    setLockedSectionIds((current) => new Set(current).add(section.id));
    if (nextQuestionId) {
      setVisitedQuestionIds((current) => new Set(current).add(nextQuestionId));
    }
    setSectionIndex((current) => Math.min(test.sections.length - 1, current + 1));
    setQuestionIndex(0);
  }, [finalSection, section, sectionIndex, test.sections]);

  useEffect(() => {
    const recovered = parseTimedTestDraft(window.localStorage.getItem(draftKey), test);
    let cancelled = false;
    queueMicrotask(() => {
      if (cancelled) return;
      if (recovered) {
        const activeQuestionId = test.sections[recovered.sectionIndex]?.questions[recovered.questionIndex]?.id;
        setAnswers(recovered.answers);
        setVisitedQuestionIds(new Set([...recovered.visitedQuestionIds, ...(activeQuestionId ? [activeQuestionId] : [])]));
        setMarkedQuestionIds(new Set(recovered.markedQuestionIds));
        setSectionIndex(recovered.sectionIndex);
        setQuestionIndex(recovered.questionIndex);
        setLockedSectionIds(new Set(recovered.lockedSectionIds));
        setSectionRemainingSeconds(recovered.sectionRemainingSeconds);
        setSectionTimeSpentSeconds(recovered.sectionTimeSpentSeconds);
        setStartedAt(recovered.startedAt);
        setRecoveryNotice(`Recovered your attempt saved ${new Date(recovered.savedAt).toLocaleString()}.`);
        setSaveStatus("Recovered and autosaving locally");
      } else {
        setSaveStatus("Autosaving locally");
      }
      setHydrated(true);
    });
    return () => {
      cancelled = true;
    };
  }, [draftKey, test]);

  useEffect(() => {
    if (!hydrated || submittedAttemptId) return;
    const savedAt = new Date().toISOString();
    const draft: TimedTestDraft = {
      version: 1,
      testId: test.id,
      answers,
      visitedQuestionIds: [...visitedQuestionIds],
      markedQuestionIds: [...markedQuestionIds],
      sectionIndex,
      questionIndex,
      lockedSectionIds: [...lockedSectionIds],
      sectionRemainingSeconds,
      sectionTimeSpentSeconds,
      startedAt,
      savedAt
    };

    try {
      window.localStorage.setItem(draftKey, JSON.stringify(draft));
      queueMicrotask(() => {
        setSaveStatus(`Saved locally at ${new Date(savedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`);
      });
    } catch {
      queueMicrotask(() => setSaveStatus("Local autosave is unavailable"));
    }
  }, [
    answers,
    draftKey,
    hydrated,
    lockedSectionIds,
    markedQuestionIds,
    questionIndex,
    sectionIndex,
    sectionRemainingSeconds,
    sectionTimeSpentSeconds,
    startedAt,
    submittedAttemptId,
    test.id,
    visitedQuestionIds
  ]);

  useEffect(() => {
    if (!hydrated || submittedAttemptId) return;
    const preventAccidentalExit = (event: BeforeUnloadEvent) => {
      if (allowNavigationRef.current) return;
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", preventAccidentalExit);
    return () => window.removeEventListener("beforeunload", preventAccidentalExit);
  }, [hydrated, submittedAttemptId]);

  useEffect(() => {
    const backgroundSurfaces = [...document.querySelectorAll<HTMLElement>(
      ".study-sidebar, .study-mobile-topbar, .bottom-nav"
    )];
    const previousBodyOverflow = document.body.style.overflow;
    const previousStates = backgroundSurfaces.map((surface) => ({
      surface,
      inert: surface.inert,
      ariaHidden: surface.getAttribute("aria-hidden")
    }));

    document.body.style.overflow = "hidden";
    for (const surface of backgroundSurfaces) {
      surface.inert = true;
      surface.setAttribute("aria-hidden", "true");
    }

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      for (const state of previousStates) {
        state.surface.inert = state.inert;
        if (state.ariaHidden === null) state.surface.removeAttribute("aria-hidden");
        else state.surface.setAttribute("aria-hidden", state.ariaHidden);
      }
    };
  }, []);

  useEffect(() => {
    if (!hydrated || submittedAttemptId || !section || !timed || remaining <= 0) return;
    const timeout = window.setTimeout(() => {
      setSectionRemainingSeconds((current) => ({
        ...current,
        [section.id]: Math.max(0, (current[section.id] ?? section.timerSeconds) - 1)
      }));
      setSectionTimeSpentSeconds((current) => ({
        ...current,
        [section.id]: Math.min(section.timerSeconds, (current[section.id] ?? 0) + 1)
      }));
    }, 1000);
    return () => window.clearTimeout(timeout);
  }, [hydrated, remaining, section, submittedAttemptId, timed]);

  useEffect(() => {
    if (!hydrated || submittedAttemptId || !section) return;
    const timeoutAction = getSectionTimeoutAction({
      timerSeconds: section.timerSeconds,
      remainingSeconds: remaining,
      sectionIndex,
      sectionCount: test.sections.length
    });
    if (timeoutAction === "none") return;
    if (handledTimeoutSectionRef.current === section.id) return;
    handledTimeoutSectionRef.current = section.id;

    let cancelled = false;
    queueMicrotask(() => {
      if (cancelled) return;
      if (timeoutAction === "submit") {
        submitAttempt("timeout");
        return;
      }
      advanceToNextSection();
    });
    return () => {
      cancelled = true;
    };
  }, [advanceToNextSection, hydrated, remaining, section, sectionIndex, submitAttempt, submittedAttemptId, test.sections.length]);

  useEffect(() => {
    if (!confirmAction) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setConfirmAction(null);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [confirmAction]);

  function selectOption(optionId: SscCglOptionId) {
    if (!question) return;
    setAnswers((current) => ({ ...current, [question.id]: optionId }));
  }

  function clearResponse() {
    if (!question) return;
    setAnswers((current) => ({ ...current, [question.id]: null }));
  }

  function goToQuestion(index: number) {
    if (!section) return;
    const nextIndex = Math.max(0, Math.min(section.questions.length - 1, index));
    const nextQuestionId = section.questions[nextIndex]?.id;
    if (nextQuestionId) {
      setVisitedQuestionIds((current) => new Set(current).add(nextQuestionId));
    }
    setQuestionIndex(nextIndex);
  }

  function requestNext(markForReview = false) {
    if (!section || !question) return;
    if (markForReview) {
      setMarkedQuestionIds((current) => {
        const next = new Set(current);
        if (next.has(question.id)) next.delete(question.id);
        else next.add(question.id);
        return next;
      });
    }

    if (questionIndex < section.questions.length - 1) {
      goToQuestion(questionIndex + 1);
      return;
    }
    setConfirmAction(finalSection ? "submit" : "finish-section");
  }

  function restartAttempt() {
    const now = new Date().toISOString();
    window.localStorage.removeItem(draftKey);
    setAnswers({});
    const firstQuestionId = test.sections[0]?.questions[0]?.id;
    setVisitedQuestionIds(new Set(firstQuestionId ? [firstQuestionId] : []));
    setMarkedQuestionIds(new Set());
    setLockedSectionIds(new Set());
    setSectionRemainingSeconds(initialRemaining);
    setSectionTimeSpentSeconds(initialSpent);
    setSectionIndex(0);
    setQuestionIndex(0);
    setStartedAt(now);
    handledTimeoutSectionRef.current = null;
    setRecoveryNotice(null);
    setSaveStatus("Attempt restarted and autosaving locally");
  }

  function exitTest() {
    allowNavigationRef.current = true;
    window.location.assign("/exams/ssc-cgl/tests");
  }

  function confirmPendingAction() {
    const action = confirmAction;
    setConfirmAction(null);
    if (action === "submit") submitAttempt("manual");
    if (action === "exit") exitTest();
    if (action === "clear-attempt") restartAttempt();
    if (action === "finish-section") advanceToNextSection();
  }

  if (!section || !question) {
    return (
      <section className={styles.runner}>
        <div className={styles.emptyState}>
          <Info size={24} aria-hidden="true" />
          <h1>This test has no questions yet.</h1>
          <p>Return to the test dashboard and choose another paper.</p>
          <button className={styles.primaryButton} type="button" onClick={exitTest}>Exit test</button>
        </div>
      </section>
    );
  }

  const paletteStatuses = section.questions.map((item) => ({
    questionId: item.id,
    status: getQuestionPaletteStatus({
      answered: Boolean(answers[item.id]),
      visited: visitedQuestionIds.has(item.id),
      marked: markedQuestionIds.has(item.id)
    })
  }));
  const sectionMarked = paletteStatuses.filter((item) => item.status === "marked" || item.status === "answered-marked").length;
  const copy = confirmAction ? confirmationCopy(confirmAction, {
    unanswered: unansweredCount,
    sectionTitle: section.title,
    finalSection
  }) : null;

  return (
    <section className={styles.runner} aria-label={`${test.title} test player`}>
      <header className={styles.examHeader}>
        <div className={styles.brandBlock}>
          <span className={styles.brandMark}>
            <Image src="/img/icons/icon-64.png" alt="" width={46} height={46} priority />
          </span>
          <span className={styles.brandText}>
            <strong>MITEEE</strong>
            <span>Study</span>
          </span>
        </div>

        <h1 className={styles.testTitle}>{test.title}</h1>

        <div className={styles.headerActions}>
          <div className={timed && remaining <= 60 ? `${styles.timer} ${styles.timerUrgent}` : styles.timer} aria-label={timed ? `${remaining} seconds left in ${section.title}` : `${section.title} is untimed`}>
            <Clock3 size={22} aria-hidden="true" />
            <span>
              <strong>{timed ? formatTimer(remaining) : "No timer"}</strong>
              <small>{timed ? "Time left in section" : "Practice at your pace"}</small>
            </span>
          </div>
          <button className={styles.headerButton} type="button" onClick={() => setConfirmAction("submit")}>
            <Send size={19} aria-hidden="true" />
            <span>Submit test</span>
          </button>
          <button className={styles.headerButton} type="button" onClick={() => setConfirmAction("exit")}>
            <LogOut size={21} aria-hidden="true" />
            <span>Exit test</span>
          </button>
        </div>
      </header>

      <nav className={styles.sectionNav} aria-label="Test sections">
        <ol className={styles.sectionList}>
          {test.sections.map((item, index) => {
            const state = getSectionVisualState(index, sectionIndex);
            const isCompleted = state === "completed" || lockedSectionIds.has(item.id);
            const stateLabel = isCompleted
              ? "Completed · locked"
              : state === "current"
                ? "Current"
                : state === "up-next"
                  ? "Up next · locked"
                  : "Locked";
            return (
              <li key={item.id} className={`${styles.sectionCard} ${styles[`section-${state}`]}`} aria-current={state === "current" ? "step" : undefined}>
                <span className={styles.sectionBadge} aria-hidden="true">
                  {isCompleted ? <Check size={22} /> : index + 1}
                </span>
                <span className={styles.sectionCardText}>
                  <strong>{item.title}</strong>
                  <small>{stateLabel}</small>
                </span>
                {state !== "current" ? <LockKeyhole className={styles.sectionLock} size={18} aria-hidden="true" /> : null}
              </li>
            );
          })}
        </ol>
      </nav>

      <div className={styles.sectionSummary}>
        <strong>Section {sectionIndex + 1} of {test.sections.length}</strong>
        <span aria-hidden="true">•</span>
        <span>{section.questions.length} questions</span>
        <span aria-hidden="true">•</span>
        <span>{timed ? `${Math.round(section.timerSeconds / 60)} minutes` : "Untimed"}</span>
        <button className={styles.restartButton} type="button" onClick={() => setConfirmAction("clear-attempt")}>
          <RotateCcw size={14} aria-hidden="true" /> Restart attempt
        </button>
      </div>

      {recoveryNotice ? (
        <div className={styles.recoveryNotice} role="status">
          <CheckCircle2 size={17} aria-hidden="true" />
          <span>{recoveryNotice}</span>
          <button type="button" onClick={() => setRecoveryNotice(null)} aria-label="Dismiss recovery notice"><X size={16} /></button>
        </div>
      ) : null}

      <div className={styles.workspace}>
        <main className={styles.questionPane}>
          <div className={styles.questionMeta}>
            <span>Question {questionIndex + 1} of {section.questions.length}</span>
            <span className={styles.subjectChip}>{section.title}</span>
          </div>
          <h2><MathText text={question.stem} /></h2>

          <fieldset className={styles.options}>
            <legend className={styles.srOnly}>Choose one answer</legend>
            {question.options.map((option) => {
              const selected = answers[question.id] === option.id;
              return (
                <label key={option.id} className={selected ? `${styles.option} ${styles.optionSelected}` : styles.option}>
                  <input
                    type="radio"
                    name={`answer-${question.id}`}
                    value={option.id}
                    checked={selected}
                    onChange={() => selectOption(option.id)}
                  />
                  <strong>{option.id.toUpperCase()}</strong>
                  <span><MathText text={option.text} /></span>
                </label>
              );
            })}
          </fieldset>
          <p className={styles.resultGuard}>
            Answers and explanations stay hidden until you submit the test.
          </p>
        </main>

        <aside className={paletteOpen ? styles.palette : `${styles.palette} ${styles.paletteCollapsed}`} aria-label="Question palette">
          <div className={styles.paletteHeader}>
            <h2>Question palette</h2>
            <button type="button" onClick={() => setPaletteOpen((current) => !current)} aria-expanded={paletteOpen} aria-controls="question-palette-content">
              <span>{paletteOpen ? "Hide" : "Show"}</span>
              {paletteOpen ? <ChevronUp size={18} aria-hidden="true" /> : <ChevronDown size={18} aria-hidden="true" />}
            </button>
          </div>

          <div id="question-palette-content" hidden={!paletteOpen}>
            <div className={styles.paletteGrid}>
              {paletteStatuses.map((item, index) => {
                const label = paletteStatusLabel(item.status);
                return (
                  <button
                    key={item.questionId}
                    className={`${styles.paletteCell} ${styles[`status-${item.status}`]}`}
                    type="button"
                    onClick={() => goToQuestion(index)}
                    aria-current={index === questionIndex ? "true" : undefined}
                    aria-label={`Question ${index + 1}: ${label}`}
                    title={`Question ${index + 1}: ${label}`}
                  >
                    <span>{index + 1}</span>
                    <PaletteStatusIcon status={item.status} />
                  </button>
                );
              })}
            </div>

            <div className={styles.legend} aria-label="Question status legend">
              {(["not-visited", "not-answered", "answered", "marked", "answered-marked"] as QuestionPaletteStatus[]).map((status) => (
                <div key={status}>
                  <span className={`${styles.legendIcon} ${styles[`status-${status}`]}`}><PaletteStatusIcon status={status} size={14} /></span>
                  <span>{paletteStatusLabel(status)}</span>
                </div>
              ))}
            </div>

            <div className={styles.paletteCounts} aria-label="Section response totals">
              <strong>{sectionAnswered} answered</strong>
              <span>•</span>
              <span>{section.questions.length - sectionAnswered} unanswered</span>
              <span>•</span>
              <strong>{sectionMarked} marked</strong>
            </div>
          </div>
        </aside>
      </div>

      <footer className={styles.actionBar}>
        <div className={styles.actionGroup}>
          <button className={styles.secondaryButton} type="button" onClick={() => goToQuestion(questionIndex - 1)} disabled={questionIndex === 0} aria-keyshortcuts="ArrowLeft">
            <ArrowLeft size={19} aria-hidden="true" />
            Previous
          </button>
          <button className={styles.secondaryButton} type="button" onClick={clearResponse} disabled={!answers[question.id]}>
            <Eraser size={19} aria-hidden="true" />
            Clear response
          </button>
        </div>

        <div className={styles.autosaveStatus} role="status">
          <CheckCircle2 size={15} aria-hidden="true" /> {saveStatus}
        </div>

        <div className={styles.actionGroup}>
          <button className={styles.secondaryButton} type="button" onClick={() => requestNext(true)}>
            <Bookmark size={18} aria-hidden="true" />
            {markedQuestionIds.has(question.id) ? "Remove review mark & next" : "Mark for review & next"}
          </button>
          <button className={styles.primaryButton} type="button" onClick={() => requestNext(false)} aria-keyshortcuts="ArrowRight">
            {questionIndex === section.questions.length - 1
              ? finalSection ? "Finish & submit" : "Finish section"
              : "Save & next"}
            <ArrowRight size={20} aria-hidden="true" />
          </button>
        </div>
      </footer>

      <div className={styles.autoSubmitNote}>
        <Info size={17} aria-hidden="true" />
        {timed
          ? finalSection
            ? "This test submits automatically when the final section timer reaches 00:00."
            : "This section locks and moves forward automatically when its timer reaches 00:00."
          : "Untimed mode has no automatic section changes. Finish each section when you are ready."}
      </div>

      {copy ? (
        <div className={styles.dialogBackdrop} role="presentation" onMouseDown={(event) => {
          if (event.currentTarget === event.target) setConfirmAction(null);
        }}>
          <div className={styles.dialog} role="alertdialog" aria-modal="true" aria-labelledby="confirm-title" aria-describedby="confirm-body">
            <button className={styles.dialogClose} type="button" onClick={() => setConfirmAction(null)} aria-label="Close confirmation"><X size={18} /></button>
            <span className={styles.dialogIcon}><Info size={22} aria-hidden="true" /></span>
            <h2 id="confirm-title">{copy.title}</h2>
            <p id="confirm-body">{copy.body}</p>
            <div className={styles.dialogActions}>
              <button className={styles.secondaryButton} type="button" onClick={() => setConfirmAction(null)}>Keep working</button>
              <button className={confirmAction === "clear-attempt" ? styles.dangerButton : styles.primaryButton} type="button" onClick={confirmPendingAction} autoFocus>
                {copy.confirm}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
