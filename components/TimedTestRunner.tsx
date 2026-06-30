"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2, Clock3, Flag, RotateCcw } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
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
import { scoreSscAttempt } from "@/lib/ssc-cgl-tests";

type StoredAttempt = {
  test: SscCglTestDetail;
  result: ReturnType<typeof scoreSscAttempt>;
  answers: Record<string, SscCglOptionId | null>;
  savedAt: string;
};

const storagePrefix = "ssc-cgl-attempt:";

function attemptStorageKey(attemptId: string) {
  return `${storagePrefix}${attemptId}`;
}

function formatTimer(seconds: number) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

export function TimedTestRunner({ test }: { test: SscCglTestDetail }) {
  const [sectionIndex, setSectionIndex] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, SscCglOptionId | null>>({});
  const [remaining, setRemaining] = useState(test.sections[0]?.timerSeconds ?? 0);
  const [sectionSpent, setSectionSpent] = useState<Record<string, number>>({});
  const [startedAt] = useState(() => new Date().toISOString());
  const [submittedAttemptId, setSubmittedAttemptId] = useState<string | null>(null);
  const section = test.sections[sectionIndex] ?? test.sections[0]!;
  const question = section.questions[questionIndex] ?? section.questions[0]!;
  const answeredCount = Object.values(answers).filter(Boolean).length;
  const sectionAnswered = section.questions.filter((item) => answers[item.id]).length;

  useEffect(() => {
    let cancelled = false;
    queueMicrotask(() => {
      if (cancelled) return;
      setRemaining(section.timerSeconds);
      setQuestionIndex(0);
    });
    return () => {
      cancelled = true;
    };
  }, [section.id, section.timerSeconds]);

  const moveToNextSection = useCallback(() => {
    setSectionIndex((current) => Math.min(test.sections.length - 1, current + 1));
  }, [test.sections.length]);

  useEffect(() => {
    if (submittedAttemptId) return;
    const interval = window.setInterval(() => {
      setRemaining((current) => {
        if (current <= 1) {
          window.clearInterval(interval);
          moveToNextSection();
          return 0;
        }
        return current - 1;
      });
      setSectionSpent((current) => ({
        ...current,
        [section.id]: Math.min(section.timerSeconds, (current[section.id] ?? 0) + 1)
      }));
    }, 1000);
    return () => window.clearInterval(interval);
  }, [moveToNextSection, section.id, section.timerSeconds, submittedAttemptId]);

  function selectOption(optionId: SscCglOptionId) {
    setAnswers((current) => ({ ...current, [question.id]: optionId }));
  }

  function submit() {
    const attemptId = `ssc-cgl-${Date.now()}`;
    const submittedAt = new Date().toISOString();
    const result = scoreSscAttempt(test, {
      attemptId,
      startedAt,
      submittedAt,
      answers,
      sectionTimeSpentSeconds: Object.fromEntries(test.sections.map((item) => [item.id, sectionSpent[item.id] ?? (item.id === section.id ? item.timerSeconds - remaining : 0)]))
    });
    const stored: StoredAttempt = { test, result, answers, savedAt: submittedAt };
    window.localStorage.setItem(attemptStorageKey(attemptId), JSON.stringify(stored));
    const currentHistory = parseSscAttemptHistory(window.localStorage.getItem(sscAttemptHistoryStorageKey));
    const nextHistoryItem = buildSscAttemptHistoryItem(test, result, submittedAt);
    window.localStorage.setItem(sscAttemptHistoryStorageKey, serializeSscAttemptHistory(mergeSscAttemptHistory(currentHistory, nextHistoryItem)));
    const reviewRows = buildSscAttemptQuestionReview(test, answers);
    const currentMistakes = parseSscMistakeBank(window.localStorage.getItem(sscMistakeBankStorageKey));
    const nextMistakes = buildSscMistakeBankItems(reviewRows, {
      attemptId,
      testId: test.id,
      testTitle: test.title,
      savedAt: submittedAt
    });
    const correctedQuestionIds = reviewRows.filter((row) => row.status === "correct").map((row) => row.questionId);
    window.localStorage.setItem(sscMistakeBankStorageKey, serializeSscMistakeBank(mergeSscMistakeBank(currentMistakes, nextMistakes, correctedQuestionIds)));
    setSubmittedAttemptId(attemptId);
    window.location.href = `/exams/ssc-cgl/results/${attemptId}`;
  }

  const progress = useMemo(() => Math.round((answeredCount / Math.max(test.questionCount, 1)) * 100), [answeredCount, test.questionCount]);

  return (
    <section className="ssc-test-runner">
      <header className="ssc-test-top panel">
        <div>
          <p className="panel-kicker">Timed SSC CGL test</p>
          <h1>{test.title}</h1>
          <p>{test.description}</p>
        </div>
        <div className="ssc-test-timer" aria-label={`${remaining} seconds left in this section`}>
          <Clock3 size={18} aria-hidden="true" />
          <strong>{formatTimer(remaining)}</strong>
          <span>{section.title}</span>
        </div>
      </header>

      <div className="ssc-test-shell">
        <aside className="panel ssc-section-rail" aria-label="Test sections">
          {test.sections.map((item, index) => (
            <button
              key={item.id}
              className={item.id === section.id ? "ssc-section-tab active" : "ssc-section-tab"}
              type="button"
              disabled={index > sectionIndex}
              onClick={() => setSectionIndex(index)}
            >
              <span>{index + 1}</span>
              <strong>{item.title}</strong>
              <small>{item.questions.filter((entry) => answers[entry.id]).length}/{item.questions.length} answered</small>
            </button>
          ))}
          <div className="ssc-progress-box">
            <strong>{progress}%</strong>
            <span>{answeredCount}/{test.questionCount} attempted</span>
          </div>
        </aside>

        <main className="panel ssc-question-workspace">
          <div className="ssc-question-meta">
            <span>Q{questionIndex + 1} of {section.questions.length}</span>
            <span>{question.subtopic}</span>
            <span>{question.difficulty}</span>
          </div>
          <h2>{question.stem}</h2>
          <div className="ssc-options" role="list" aria-label="Answer options">
            {question.options.map((option) => (
              <button
                key={option.id}
                className={answers[question.id] === option.id ? "ssc-option ssc-test-option selected" : "ssc-option ssc-test-option"}
                type="button"
                onClick={() => selectOption(option.id)}
              >
                <span>{option.id.toUpperCase()}</span>
                <strong>{option.text}</strong>
              </button>
            ))}
          </div>
          <details className="ssc-provenance">
            <summary><Flag size={14} aria-hidden="true" /> Source and review state</summary>
            <p>{question.provenance.title} · {question.provenance.sourceType} · {question.reviewStatus}</p>
            {question.provenance.url ? <Link href={question.provenance.url} target="_blank">{question.provenance.url}</Link> : null}
          </details>
          <div className="ssc-test-actions">
            <button className="button ghost" type="button" onClick={() => setQuestionIndex(Math.max(0, questionIndex - 1))} disabled={questionIndex === 0}>Previous</button>
            <button className="button primary" type="button" onClick={() => setQuestionIndex(Math.min(section.questions.length - 1, questionIndex + 1))}>
              Next <ArrowRight size={15} aria-hidden="true" />
            </button>
            <button className="button ghost" type="button" onClick={moveToNextSection} disabled={sectionIndex >= test.sections.length - 1}>Lock section</button>
            <button className="button primary" type="button" onClick={submit}>
              Submit <CheckCircle2 size={15} aria-hidden="true" />
            </button>
            <button className="button ghost" type="button" onClick={() => setAnswers({})}>
              Clear attempt <RotateCcw size={15} aria-hidden="true" />
            </button>
          </div>
          <p className="ssc-section-footnote">{sectionAnswered}/{section.questions.length} answered in this section. Moving forward manually locks your current timer state for review.</p>
        </main>
      </div>
    </section>
  );
}
