"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle2, Circle, Flag, RotateCcw, Target, XCircle } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { MathText } from "@/components/MathText";
import { SscExplanationPanel } from "@/components/SscExplanationPanel";
import type { SscCglOptionId, SscCglQuestion, SscCglTopic } from "@/lib/exam-types";
import {
  buildSscTopicPracticeMistakeBankItem,
  mergeSscMistakeBank,
  parseSscMistakeBank,
  serializeSscMistakeBank,
  sscMistakeBankStorageKey
} from "@/lib/ssc-cgl-mistake-bank";
import {
  parseStoredSscTopicPractice,
  sscTopicPracticeStorageKey,
  type SscStoredTopicPractice
} from "@/lib/ssc-cgl-topic-practice-memory";
import { persistLearnerAttemptEvidenceBatch } from "@/lib/learner-weakness-client";
import type { LearnerAttemptEvidenceInput } from "@/lib/learner-weakness-engine";

type PracticeMode = "all" | "unanswered" | "misses" | "speed" | "book" | "gap";

const practiceModes: Array<{ id: PracticeMode; label: string; help: string }> = [
  { id: "all", label: "All questions", help: "Full topic corpus" },
  { id: "unanswered", label: "Unanswered", help: "Only unsolved rows" },
  { id: "misses", label: "Misses", help: "Wrong and skipped rows" },
  { id: "speed", label: "Speed repairs", help: "Correct but slower than 36s" },
  { id: "book", label: "Book-backed", help: "Uploaded PYQ-book rows" },
  { id: "gap", label: "Gap repair", help: "200/200 repair rows" }
];
const targetSecondsPerQuestion = 36;
const practiceModeIds = new Set<PracticeMode>(practiceModes.map((mode) => mode.id));

function isPracticeMode(value: string | null): value is PracticeMode {
  return Boolean(value && practiceModeIds.has(value as PracticeMode));
}

function answerText(question: SscCglQuestion, optionId: SscCglOptionId) {
  const option = question.options.find((item) => item.id === optionId);
  return option?.text ?? "";
}

function clampIndex(index: number, total: number) {
  return Math.max(0, Math.min(Math.max(0, total - 1), index));
}

function formatSource(question: SscCglQuestion) {
  const page = question.provenance.pageNumber ? ` · page ${question.provenance.pageNumber}` : "";
  return `${question.provenance.title}${page} · ${question.reviewStatus}`;
}

function isEditableTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;
  const tagName = target.tagName.toLowerCase();
  return tagName === "input" || tagName === "textarea" || tagName === "select" || target.isContentEditable;
}

export function SscTopicPracticeClient({
  topic,
  questions,
  previousTopicHref,
  nextTopicHref,
  initialMode = "all"
}: {
  topic: SscCglTopic;
  questions: SscCglQuestion[];
  previousTopicHref: string | null;
  nextTopicHref: string | null;
  initialMode?: string;
}) {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, SscCglOptionId | "z">>({});
  const [practiceMode, setPracticeMode] = useState<PracticeMode>(isPracticeMode(initialMode) ? initialMode : "all");
  const [speedRepairQuestionIds, setSpeedRepairQuestionIds] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [pacerTick, setPacerTick] = useState({ questionId: "", elapsedSeconds: 0 });
  const speedRepairQuestionIdSet = useMemo(() => new Set(speedRepairQuestionIds), [speedRepairQuestionIds]);

  useEffect(() => {
    let cancelled = false;
    queueMicrotask(() => {
      if (cancelled) return;
      const stored = parseStoredSscTopicPractice(window.localStorage.getItem(sscTopicPracticeStorageKey(topic.slug)));
      if (stored) {
        setIndex(clampIndex(stored.index, questions.length));
        setAnswers(stored.answers);
      }
      const topicQuestionIds = new Set(questions.map((item) => item.id));
      const speedRepairIds = parseSscMistakeBank(window.localStorage.getItem(sscMistakeBankStorageKey))
        .filter((item) => item.status === "slow" && topicQuestionIds.has(item.questionId))
        .map((item) => item.questionId);
      setSpeedRepairQuestionIds([...new Set(speedRepairIds)]);
      if (isPracticeMode(initialMode)) {
        setPracticeMode(initialMode);
      }
      setHydrated(true);
    });
    return () => {
      cancelled = true;
    };
  }, [initialMode, questions, questions.length, topic.slug]);

  const filteredQuestions = useMemo(() => questions.filter((item) => {
    const answer = answers[item.id];
    if (practiceMode === "unanswered") return !answer;
    if (practiceMode === "misses") return answer === "z" || (Boolean(answer) && answer !== item.correctOption);
    if (practiceMode === "speed") return speedRepairQuestionIdSet.has(item.id);
    if (practiceMode === "book") return item.provenance.sourceType === "book_user_provided";
    if (practiceMode === "gap") return item.provenance.sourceType === "original_practice" && item.conceptTags.includes("gap-repair");
    return true;
  }), [answers, practiceMode, questions, speedRepairQuestionIdSet]);

  const currentQuestion = questions[index] ?? null;
  const question = filteredQuestions.length > 0
    ? currentQuestion && filteredQuestions.some((item) => item.id === currentQuestion.id)
      ? currentQuestion
      : filteredQuestions[0] ?? null
    : null;
  const queueComplete = questions.length > 0 && filteredQuestions.length === 0;
  const selected = question ? answers[question.id] : undefined;
  const revealed = Boolean(selected);
  const queuePosition = question ? filteredQuestions.findIndex((item) => item.id === question.id) : -1;
  const absoluteQuestionIndex = question ? questions.findIndex((item) => item.id === question.id) : -1;
  const currentQuestionId = question?.id ?? "";
  const elapsedSeconds = pacerTick.questionId === currentQuestionId ? pacerTick.elapsedSeconds : 0;
  const pacePercent = Math.min(100, Math.round(elapsedSeconds / targetSecondsPerQuestion * 100));
  const paceStatus = elapsedSeconds > targetSecondsPerQuestion ? "over-pace" : "on-pace";
  const paceLabel = paceStatus === "over-pace" ? "Over pace" : "On 36-second pace";

  const metrics = useMemo(() => {
    const questionIds = new Set(questions.map((item) => item.id));
    const scopedAnswers = Object.entries(answers).filter(([questionId]) => questionIds.has(questionId));
    const correct = scopedAnswers.filter(([questionId, answer]) => {
      const item = questions.find((candidate) => candidate.id === questionId);
      return item && answer === item.correctOption;
    }).length;
    const wrong = scopedAnswers.filter(([questionId, answer]) => {
      const item = questions.find((candidate) => candidate.id === questionId);
      return item && answer !== "z" && answer !== item.correctOption;
    }).length;
    const skipped = scopedAnswers.filter(([, answer]) => answer === "z").length;
    const attempted = correct + wrong;
    const completed = scopedAnswers.length;

    return {
      correct,
      wrong,
      skipped,
      attempted,
      completed,
      remaining: Math.max(0, questions.length - completed),
      accuracy: attempted > 0 ? Math.round(correct / attempted * 100) : 0,
      progress: questions.length > 0 ? Math.round(completed / questions.length * 100) : 0
    };
  }, [answers, questions]);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(sscTopicPracticeStorageKey(topic.slug), JSON.stringify({
      index,
      answers,
      topicSlug: topic.slug,
      topicTitle: topic.title,
      subject: topic.subject,
      totalQuestions: questions.length,
      correct: metrics.correct,
      wrong: metrics.wrong,
      skipped: metrics.skipped,
      savedAt: new Date().toISOString()
    } satisfies SscStoredTopicPractice));
  }, [answers, hydrated, index, metrics.correct, metrics.skipped, metrics.wrong, questions.length, topic.slug, topic.subject, topic.title]);

  useEffect(() => {
    if (!currentQuestionId || revealed) return;
    const startedAt = Date.now();
    const timer = window.setInterval(() => {
      setPacerTick({
        questionId: currentQuestionId,
        elapsedSeconds: Math.floor((Date.now() - startedAt) / 1000)
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [currentQuestionId, revealed]);

  const moveWithinQueue = useCallback((delta: number) => {
    if (filteredQuestions.length === 0 || queuePosition < 0) return;
    const nextQueueIndex = clampIndex(queuePosition + delta, filteredQuestions.length);
    const nextQuestion = filteredQuestions[nextQueueIndex];
    if (!nextQuestion) return;
    const nextIndex = questions.findIndex((item) => item.id === nextQuestion.id);
    if (nextIndex >= 0) setIndex(nextIndex);
  }, [filteredQuestions, queuePosition, questions]);

  const persistMistakeBank = useCallback((item: SscCglQuestion, selectedAnswer: SscCglOptionId | "z") => {
    const savedAt = new Date().toISOString();
    const existing = parseSscMistakeBank(window.localStorage.getItem(sscMistakeBankStorageKey));
    const questionElapsedSeconds = item.id === currentQuestionId ? elapsedSeconds : 0;
    const nextItem = buildSscTopicPracticeMistakeBankItem(item, topic, selectedAnswer, savedAt, questionElapsedSeconds, targetSecondsPerQuestion);
    const correctedQuestionIds = selectedAnswer === item.correctOption && questionElapsedSeconds <= targetSecondsPerQuestion ? [item.id] : [];
    const merged = mergeSscMistakeBank(existing, nextItem ? [nextItem] : [], correctedQuestionIds);
    window.localStorage.setItem(sscMistakeBankStorageKey, serializeSscMistakeBank(merged));
    persistLearnerAttemptEvidenceBatch([{
      attemptId: `topic-practice-${topic.slug}-${savedAt}`,
      exam: { id: "ssc-cgl-tier-i", label: "SSC CGL Tier I" },
      subject: { id: item.section, label: topic.subject },
      topic: { id: topic.slug, label: topic.title },
      question: { id: item.id, label: item.stem },
      correct: selectedAnswer === item.correctOption,
      answered: selectedAnswer !== "z",
      confidence: "medium",
      timeSpentSeconds: questionElapsedSeconds,
      targetTimeSeconds: targetSecondsPerQuestion,
      answeredAt: savedAt,
      context: "practice"
    } satisfies LearnerAttemptEvidenceInput]);
    setSpeedRepairQuestionIds((current) => {
      const next = new Set(current);
      if (selectedAnswer === item.correctOption && questionElapsedSeconds > targetSecondsPerQuestion) {
        next.add(item.id);
      } else {
        next.delete(item.id);
      }
      return [...next];
    });
  }, [currentQuestionId, elapsedSeconds, topic]);

  const choose = useCallback((optionId: SscCglOptionId) => {
    if (!question) return;
    setAnswers((current) => ({ ...current, [question.id]: optionId }));
    persistMistakeBank(question, optionId);
  }, [persistMistakeBank, question]);

  const skipQuestion = useCallback(() => {
    if (!question) return;
    setAnswers((current) => ({ ...current, [question.id]: "z" }));
    persistMistakeBank(question, "z");
  }, [persistMistakeBank, question]);

  const nextUnanswered = useCallback(() => {
    const queue = practiceMode === "unanswered" ? filteredQuestions : questions.filter((item) => !answers[item.id]);
    if (queue.length === 0) return;
    const currentAbsoluteIndex = question ? questions.findIndex((item) => item.id === question.id) : index;
    const afterCurrent = queue.find((item) => questions.findIndex((candidate) => candidate.id === item.id) > currentAbsoluteIndex);
    if (afterCurrent) {
      const nextIndex = questions.findIndex((item) => item.id === afterCurrent.id);
      if (nextIndex >= 0) {
        setIndex(nextIndex);
      }
      return;
    }
    const wrapped = queue[0];
    const wrappedIndex = wrapped ? questions.findIndex((item) => item.id === wrapped.id) : -1;
    setIndex(wrappedIndex >= 0 ? wrappedIndex : clampIndex(index + 1, questions.length));
  }, [answers, filteredQuestions, index, practiceMode, question, questions]);

  function resetPractice() {
    setAnswers({});
    setIndex(0);
    window.localStorage.removeItem(sscTopicPracticeStorageKey(topic.slug));
  }

  function switchToAllQuestions() {
    setPracticeMode("all");
    setIndex(0);
  }

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (isEditableTarget(event.target) || queueComplete || !question) return;
      const key = event.key.toLowerCase();
      const byNumber = key >= "1" && key <= "4" ? question.options[Number(key) - 1]?.id : undefined;
      const byLetter = key === "a" || key === "b" || key === "c" || key === "d" ? key : undefined;
      const optionId = byNumber ?? byLetter;

      if (optionId) {
        event.preventDefault();
        choose(optionId);
        return;
      }
      if (key === "s") {
        event.preventDefault();
        skipQuestion();
        return;
      }
      if (key === "n" || event.key === "ArrowRight") {
        event.preventDefault();
        moveWithinQueue(1);
        return;
      }
      if (key === "u") {
        event.preventDefault();
        nextUnanswered();
        return;
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        moveWithinQueue(-1);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [choose, moveWithinQueue, nextUnanswered, queueComplete, question, skipQuestion]);

  if (queueComplete) {
    return (
      <section className="ssc-topic-practice-shell">
        <header className="panel ssc-topic-practice-hero">
          <div>
            <p className="panel-kicker">{topic.subject} · topic practice</p>
            <h1>{topic.title}</h1>
            <p>One question at a time. Answer, check the key, read the explanation, then move to the next unanswered item.</p>
          </div>
          <div className="ssc-topic-practice-stats">
            <span><strong>{questions.length}</strong><small>questions</small></span>
            <span><strong>{metrics.progress}%</strong><small>complete</small></span>
            <span><strong>{metrics.accuracy}%</strong><small>accuracy</small></span>
            <span><strong>{metrics.remaining}</strong><small>left</small></span>
          </div>
        </header>

        <section className="panel ssc-topic-practice-complete" aria-live="polite">
          <Target size={22} aria-hidden="true" />
          <div>
            <p className="panel-kicker">Queue complete</p>
            <h2>All questions complete in this queue.</h2>
            <p>{practiceModes.find((mode) => mode.id === practiceMode)?.label ?? "This queue"} currently has no remaining questions. Move to another queue, reset the topic, or continue to the next topic.</p>
          </div>
          <div className="ssc-test-actions">
            <button className="button primary" type="button" onClick={switchToAllQuestions}>Switch to all questions</button>
            <button className="button ghost" type="button" onClick={resetPractice}>
              <RotateCcw size={15} aria-hidden="true" />
              Reset topic
            </button>
            {nextTopicHref ? (
              <Link className="button primary" href={nextTopicHref}>Continue to next topic <ArrowRight size={15} aria-hidden="true" /></Link>
            ) : (
              <Link className="button primary" href="/exams/ssc-cgl/practice">Continue to next topic <ArrowRight size={15} aria-hidden="true" /></Link>
            )}
          </div>
        </section>
      </section>
    );
  }

  if (!question) {
    return (
      <section className="panel ssc-empty-state">
        <Target size={22} aria-hidden="true" />
        <h1>{topic.title}</h1>
        <p>No usable practice questions are currently attached to this topic.</p>
        <Link className="button primary" href="/exams/ssc-cgl/practice">Back to topic practice</Link>
      </section>
    );
  }

  const isCorrect = selected && selected !== "z" && selected === question.correctOption;
  const isWrong = selected && selected !== "z" && selected !== question.correctOption;

  return (
    <section className="ssc-topic-practice-shell">
      <header className="panel ssc-topic-practice-hero">
        <div>
          <p className="panel-kicker">{topic.subject} · topic practice</p>
          <h1>{topic.title}</h1>
          <p>One question at a time. Answer, check the key, read the explanation, then move to the next unanswered item.</p>
        </div>
        <div className="ssc-topic-practice-stats">
          <span><strong>{questions.length}</strong><small>questions</small></span>
          <span><strong>{metrics.progress}%</strong><small>complete</small></span>
          <span><strong>{metrics.accuracy}%</strong><small>accuracy</small></span>
          <span><strong>{metrics.remaining}</strong><small>left</small></span>
        </div>
      </header>

      <div className="ssc-topic-practice-layout">
        <aside className="panel ssc-topic-practice-rail" aria-label="Topic practice progress">
          <div className="ssc-topic-practice-meter" aria-label={`${metrics.progress}% complete`}>
            <i style={{ width: `${metrics.progress}%` }} />
          </div>
          <div className="ssc-topic-practice-filters" aria-label="Queue mode">
            <strong>Queue mode</strong>
            {practiceModes.map((mode) => {
              const count = questions.filter((item) => {
                const answer = answers[item.id];
                if (mode.id === "unanswered") return !answer;
                if (mode.id === "misses") return answer === "z" || (Boolean(answer) && answer !== item.correctOption);
                if (mode.id === "speed") return speedRepairQuestionIdSet.has(item.id);
                if (mode.id === "book") return item.provenance.sourceType === "book_user_provided";
                if (mode.id === "gap") return item.provenance.sourceType === "original_practice" && item.conceptTags.includes("gap-repair");
                return true;
              }).length;

              return (
                <button
                  className={`ssc-topic-practice-filter${practiceMode === mode.id ? " active" : ""}`}
                  type="button"
                  onClick={() => setPracticeMode(mode.id)}
                  key={mode.id}
                  aria-pressed={practiceMode === mode.id}
                >
                  <span>{mode.label}</span>
                  <small>{count} · {mode.help}</small>
                </button>
              );
            })}
          </div>
          <div className="ssc-topic-practice-metrics">
            <span><CheckCircle2 size={15} aria-hidden="true" /><strong>{metrics.correct}</strong><small>correct</small></span>
            <span><XCircle size={15} aria-hidden="true" /><strong>{metrics.wrong}</strong><small>wrong</small></span>
            <span><Circle size={15} aria-hidden="true" /><strong>{metrics.skipped}</strong><small>skipped</small></span>
          </div>
          <div className="ssc-topic-practice-jump">
            {questions.map((item, questionIndex) => {
              const answer = answers[item.id];
              const status = !answer ? "todo" : answer === "z" ? "skipped" : answer === item.correctOption ? "correct" : "wrong";
              return (
                <button
                  type="button"
                  className={`status-${status}${question?.id === item.id ? " active" : ""}`}
                  onClick={() => setIndex(questionIndex)}
                  key={item.id}
                  aria-label={`Question ${questionIndex + 1}, ${status}`}
                >
                  {questionIndex + 1}
                </button>
              );
            })}
          </div>
          <button className="button ghost" type="button" onClick={resetPractice}>
            <RotateCcw size={15} aria-hidden="true" />
            Reset topic
          </button>
        </aside>

        <main className="panel ssc-topic-practice-card">
          <div className="ssc-question-meta">
            <span>Q{absoluteQuestionIndex >= 0 ? absoluteQuestionIndex + 1 : 0} of {questions.length}</span>
            <span>Current queue {filteredQuestions.length ? queuePosition + 1 : 0} of {filteredQuestions.length}</span>
            <span>{question.subtopic}</span>
            <span>{question.difficulty}</span>
            <span>{question.source}</span>
          </div>
          <div className={`ssc-topic-practice-pacer status-${paceStatus}`} aria-label={`36-second pace tracker: ${elapsedSeconds} seconds elapsed`}>
            <div>
              <strong>{paceLabel}</strong>
              <span>{elapsedSeconds}s / {targetSecondsPerQuestion}s</span>
            </div>
            <i style={{ width: `${pacePercent}%` }} />
          </div>
          <h2><MathText text={question.stem} /></h2>
          <div className="ssc-options" role="list" aria-label="Answer options">
            {question.options.map((option, optionIndex) => {
              const optionIsCorrect = revealed && option.id === question.correctOption;
              const optionIsWrongSelection = revealed && selected === option.id && option.id !== question.correctOption;
              return (
                <button
                  key={option.id}
                  className={[
                    "ssc-option",
                    "ssc-topic-practice-option",
                    selected === option.id ? "selected" : "",
                    optionIsCorrect ? "correct" : "",
                    optionIsWrongSelection ? "wrong" : ""
                  ].filter(Boolean).join(" ")}
                  type="button"
                  onClick={() => choose(option.id)}
                  aria-keyshortcuts={`${option.id.toUpperCase()} ${optionIndex + 1}`}
                >
                  <span>{option.id.toUpperCase()}</span>
                  <strong><MathText text={option.text} /></strong>
                </button>
              );
            })}
          </div>

          {revealed ? (
            <section className={`ssc-topic-practice-answer ${isCorrect ? "status-correct" : isWrong ? "status-wrong" : "status-skipped"}`} aria-live="polite">
              <strong>
                {isCorrect ? "Correct" : isWrong ? "Wrong" : "Skipped"} · Answer {question.correctOption.toUpperCase()}.{" "}
                <MathText text={answerText(question, question.correctOption)} />
              </strong>
              <SscExplanationPanel explanation={question.explanation} />
            </section>
          ) : (
            <section className="ssc-topic-practice-answer status-waiting" aria-live="polite">
              <strong>Pick an option to reveal the answer.</strong>
              <p>Use this bank for accuracy first. Timed section tests are still available when you want 36-second pressure.</p>
            </section>
          )}

          <details className="ssc-provenance">
            <summary><Flag size={14} aria-hidden="true" /> Source and review state</summary>
            <p>{formatSource(question)}</p>
            {question.provenance.url ? <Link href={question.provenance.url} target="_blank">{question.provenance.url}</Link> : null}
          </details>

          <div className="ssc-test-actions">
            <button className="button ghost" type="button" onClick={() => moveWithinQueue(-1)} disabled={queuePosition <= 0} aria-keyshortcuts="ArrowLeft">
              <ArrowLeft size={15} aria-hidden="true" />
              Previous
            </button>
            <button className="button ghost" type="button" onClick={skipQuestion} aria-keyshortcuts="S">Skip</button>
            <button className="button primary" type="button" onClick={() => moveWithinQueue(1)} disabled={queuePosition < 0 || queuePosition >= filteredQuestions.length - 1} aria-keyshortcuts="N ArrowRight">
              Next <ArrowRight size={15} aria-hidden="true" />
            </button>
            <button className="button primary" type="button" onClick={nextUnanswered} aria-keyshortcuts="U">
              Next unanswered <ArrowRight size={15} aria-hidden="true" />
            </button>
          </div>

          <nav className="ssc-topic-practice-neighbors" aria-label="Adjacent topic practice">
            {previousTopicHref ? <Link href={previousTopicHref}>Previous topic</Link> : <span />}
            <Link href="/exams/ssc-cgl/practice">All topics</Link>
            {nextTopicHref ? <Link href={nextTopicHref}>Next topic</Link> : <span />}
          </nav>
        </main>
      </div>
    </section>
  );
}
