"use client";

import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Flame,
  Infinity as InfinityIcon,
  RotateCcw,
  SkipForward,
  Target,
  X
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { SscCglOptionId, SscCglQuestion } from "@/lib/exam-types";
import type { SscEndlessBatch, SscSessionConfig } from "@/lib/ssc-cgl-session";
import styles from "@/components/SscSession.module.css";

type SessionScore = {
  correct: number;
  wrong: number;
  skipped: number;
  streak: number;
  bestStreak: number;
};

const emptyScore: SessionScore = { correct: 0, wrong: 0, skipped: 0, streak: 0, bestStreak: 0 };

function serializeSessionConfig(config: SscSessionConfig) {
  return Object.fromEntries(Object.entries(config).map(([key, value]) => [key, String(value)]));
}

export function SscEndlessRunner({
  config,
  initialBatch
}: {
  config: SscSessionConfig;
  initialBatch: SscEndlessBatch;
}) {
  const [questions, setQuestions] = useState(initialBatch.questions);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selected, setSelected] = useState<SscCglOptionId | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [score, setScore] = useState<SessionScore>(emptyScore);
  const [nextCursor, setNextCursor] = useState(initialBatch.nextCursor);
  const [exhausted, setExhausted] = useState(initialBatch.exhausted);
  const [cycle, setCycle] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const question = questions[questionIndex];
  const hasNextQuestion = questionIndex < questions.length - 1;

  const activeSeed = useCallback((targetCycle: number) => (
    targetCycle === 0 ? config.seed : `${config.seed}:cycle-${targetCycle}`
  ), [config.seed]);

  const loadMore = useCallback(async () => {
    if (loading) return;
    const targetCycle = exhausted ? cycle + 1 : cycle;
    const cursor = exhausted ? 0 : nextCursor;
    const params = new URLSearchParams({
      ...serializeSessionConfig({ ...config, mode: "endless", length: "endless", seed: activeSeed(targetCycle) }),
      cursor: String(cursor),
      limit: "20"
    });

    setLoading(true);
    setLoadError(null);
    try {
      const response = await fetch(`/api/exams/ssc-cgl/session?${params.toString()}`, { cache: "no-store" });
      if (!response.ok) throw new Error("Unable to load more questions");
      const batch = await response.json() as SscEndlessBatch;
      setQuestions((current) => [...current, ...batch.questions]);
      setNextCursor(batch.nextCursor);
      setExhausted(batch.exhausted);
      setCycle(targetCycle);
    } catch {
      setLoadError("The next batch could not be loaded.");
    } finally {
      setLoading(false);
    }
  }, [activeSeed, config, cycle, exhausted, loading, nextCursor]);

  useEffect(() => {
    if (loadError || questions.length - questionIndex > 6) return;
    const timeout = window.setTimeout(() => void loadMore(), 0);
    return () => window.clearTimeout(timeout);
  }, [loadError, loadMore, questionIndex, questions.length]);

  const checkAnswer = useCallback(() => {
    if (!question || !selected || revealed) return;
    const correct = selected === question.correctOption;
    setRevealed(true);
    setScore((current) => {
      const streak = correct ? current.streak + 1 : 0;
      return {
        ...current,
        correct: current.correct + (correct ? 1 : 0),
        wrong: current.wrong + (correct ? 0 : 1),
        streak,
        bestStreak: Math.max(current.bestStreak, streak)
      };
    });
  }, [question, revealed, selected]);

  const moveNext = useCallback(() => {
    if (!question || !hasNextQuestion) return;
    setQuestionIndex((current) => current + 1);
    setSelected(null);
    setRevealed(false);
  }, [hasNextQuestion, question]);

  const skip = useCallback(() => {
    if (!question || revealed || !hasNextQuestion) return;
    setScore((current) => ({ ...current, skipped: current.skipped + 1, streak: 0 }));
    moveNext();
  }, [hasNextQuestion, moveNext, question, revealed]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (!question || event.altKey || event.ctrlKey || event.metaKey) return;
      if (!revealed && /^[1-4]$/.test(event.key)) {
        const option = question.options[Number(event.key) - 1];
        if (option) setSelected(option.id);
      } else if (event.key === "Enter") {
        if (revealed) moveNext();
        else checkAnswer();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [checkAnswer, moveNext, question, revealed]);

  const answered = score.correct + score.wrong;
  const accuracy = useMemo(() => answered > 0 ? Math.round((score.correct / answered) * 100) : 0, [answered, score.correct]);

  if (!question) return null;

  return (
    <section className={styles.endlessPage}>
      <header className={styles.endlessHeader}>
        <div className={styles.endlessBrand}>
          <Link href="/exams/ssc-cgl" aria-label="Exit endless practice">
            <ArrowLeft size={18} aria-hidden="true" />
          </Link>
          <span><InfinityIcon size={18} aria-hidden="true" /></span>
          <div>
            <small>SSC CGL · Endless practice</small>
            <strong>{config.section === "all" ? "All four sections" : titleCase(config.section)}</strong>
          </div>
        </div>
        <div className={styles.liveStats} aria-label="Current session statistics">
          <span><CheckCircle2 size={15} aria-hidden="true" /><strong>{accuracy}%</strong><small>accuracy</small></span>
          <span><Flame size={15} aria-hidden="true" /><strong>{score.streak}</strong><small>streak</small></span>
          <span><Target size={15} aria-hidden="true" /><strong>{answered + score.skipped}</strong><small>seen</small></span>
        </div>
        <Link className={styles.exitLink} href="/exams/ssc-cgl">End session</Link>
      </header>

      <div className={styles.endlessWorkspace}>
        <main className={styles.endlessQuestion}>
          <div className={styles.questionMeta}>
            <span>Question {questionIndex + 1}</span>
            <span>{titleCase(question.section)}</span>
            <span>{question.difficulty}</span>
            <span>{question.source}</span>
          </div>
          <h1>{question.stem}</h1>
          <div className={styles.endlessOptions} role="radiogroup" aria-label="Answer options">
            {question.options.map((option, optionIndex) => {
              const isSelected = selected === option.id;
              const isCorrect = revealed && option.id === question.correctOption;
              const isWrong = revealed && isSelected && option.id !== question.correctOption;
              const className = [
                styles.endlessOption,
                isSelected ? styles.selectedOption : "",
                isCorrect ? styles.correctOption : "",
                isWrong ? styles.wrongOption : ""
              ].filter(Boolean).join(" ");
              return (
                <button
                  className={className}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  disabled={revealed}
                  key={option.id}
                  onClick={() => setSelected(option.id)}
                >
                  <span>{option.id.toUpperCase()}</span>
                  <strong>{option.text}</strong>
                  <kbd>{optionIndex + 1}</kbd>
                  {isCorrect ? <Check size={18} aria-hidden="true" /> : null}
                  {isWrong ? <X size={18} aria-hidden="true" /> : null}
                </button>
              );
            })}
          </div>

          {revealed ? (
            <aside className={selected === question.correctOption ? styles.correctFeedback : styles.wrongFeedback} aria-live="polite">
              <strong>{selected === question.correctOption ? "Correct — keep the rhythm." : "Not quite — repair the method now."}</strong>
              <p>{question.explanation}</p>
            </aside>
          ) : (
            <p className={styles.keyboardHint}>Use keys 1–4 to choose. Press Enter to check.</p>
          )}
        </main>

        <aside className={styles.endlessSidebar}>
          <span className={styles.infiniteMark}><InfinityIcon size={24} aria-hidden="true" /></span>
          <small>SESSION FLOW</small>
          <h2>No finish line. Just focused repetitions.</h2>
          <p>Questions arrive in fresh batches from the reviewed bank. Stop whenever the quality of your attention drops.</p>
          <dl>
            <div><dt>Correct</dt><dd>{score.correct}</dd></div>
            <div><dt>Wrong</dt><dd>{score.wrong}</dd></div>
            <div><dt>Skipped</dt><dd>{score.skipped}</dd></div>
            <div><dt>Best streak</dt><dd>{score.bestStreak}</dd></div>
          </dl>
          <span className={styles.bankStatus}>
            <RotateCcw size={14} aria-hidden="true" />
            {loading
              ? "Loading the next batch…"
              : loadError
                ? loadError
                : `${initialBatch.total.toLocaleString("en-IN")} matching questions in rotation`}
          </span>
          {loadError ? <button className={styles.retryButton} type="button" onClick={() => void loadMore()}>Retry loading</button> : null}
        </aside>
      </div>

      <footer className={styles.endlessActions}>
        <button type="button" onClick={skip} disabled={revealed || !hasNextQuestion}>
          <SkipForward size={17} aria-hidden="true" /> Skip
        </button>
        {revealed ? (
          <button className={styles.primaryAction} type="button" onClick={moveNext} disabled={!hasNextQuestion}>
            {loading && questionIndex >= questions.length - 2 ? "Loading…" : "Next question"} <ArrowRight size={17} aria-hidden="true" />
          </button>
        ) : (
          <button className={styles.primaryAction} type="button" onClick={checkAnswer} disabled={!selected}>
            Check answer <Check size={17} aria-hidden="true" />
          </button>
        )}
      </footer>
    </section>
  );
}

function titleCase(value: string) {
  return value.split("-").map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(" ");
}
