"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle2, RotateCcw, XCircle } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { MathText } from "@/components/MathText";
import { CatQuestionStimulus } from "@/components/CatQuestionStimulus";
import type { CatQuantQuestion, CatQuantTopic } from "@/lib/exam-types";
import { catPracticeStorageKey, parseStoredCatPractice } from "@/lib/cat-practice-memory";

function clamp(value: number, total: number) {
  return Math.max(0, Math.min(Math.max(0, total - 1), value));
}

function normalized(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

export function CatTopicPracticeClient({ topic, questions }: { topic: CatQuantTopic; questions: CatQuantQuestion[] }) {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [titaValue, setTitaValue] = useState("");
  const [hydrated, setHydrated] = useState(false);
  const question = questions[index] ?? null;
  const selected = question ? answers[question.id] : undefined;
  const revealed = Boolean(selected);
  const correct = question ? question.questionType === "mcq"
    ? selected === question.correctOption
    : normalized(selected ?? "") === normalized(question.correctAnswer ?? "") : false;

  useEffect(() => {
    let cancelled = false;
    queueMicrotask(() => {
      if (cancelled) return;
      const stored = parseStoredCatPractice(window.localStorage.getItem(catPracticeStorageKey(topic.slug)));
      if (stored) {
        setIndex(clamp(stored.index, questions.length));
        setAnswers(stored.answers);
      }
      setHydrated(true);
    });
    return () => { cancelled = true; };
  }, [questions.length, topic.slug]);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(catPracticeStorageKey(topic.slug), JSON.stringify({ index, answers, savedAt: new Date().toISOString() }));
  }, [answers, hydrated, index, topic.slug]);

  const stats = useMemo(() => {
    const answered = questions.filter((item) => answers[item.id]);
    const correctCount = answered.filter((item) => item.questionType === "mcq"
      ? answers[item.id] === item.correctOption
      : normalized(answers[item.id] ?? "") === normalized(item.correctAnswer ?? "")).length;
    return { answered: answered.length, correct: correctCount, wrong: answered.length - correctCount };
  }, [answers, questions]);

  function submit(answer: string) {
    if (!question || revealed || !answer.trim()) return;
    setAnswers((current) => ({ ...current, [question.id]: answer.trim() }));
  }

  function reset() {
    setAnswers({});
    setIndex(0);
    setTitaValue("");
  }

  function move(delta: number) {
    setIndex((current) => clamp(current + delta, questions.length));
    setTitaValue("");
  }

  if (!question) {
    return <section className="page ssc-page"><div className="panel ssc-empty-state"><h1>{topic.title}</h1><p>No reviewed practice questions are available for this chapter yet.</p><Link className="button ghost" href="/exams/cat/quant">Back to CAT Quant</Link></div></section>;
  }

  return (
    <section className="page ssc-page ssc-topic-practice-shell">
      <header className="panel ssc-topic-practice-hero">
        <div><p className="panel-kicker">CAT Quant · Chapter {topic.chapterNumber}</p><h1>{topic.title} practice</h1><p>Work through every reviewed question from the source book with the answer and method revealed after each attempt.</p></div>
        <div className="ssc-topic-practice-stats">
          <span><strong>{index + 1}/{questions.length}</strong><small>position</small></span>
          <span><strong>{stats.correct}</strong><small>correct</small></span>
          <span><strong>{stats.wrong}</strong><small>wrong</small></span>
        </div>
      </header>

      <article className="panel ssc-topic-practice-card">
        <p className="panel-kicker">Question {index + 1} · {question.difficulty} · source page {question.provenance.pageNumber ?? "—"}</p>
        <h2><MathText text={question.stem} /></h2>
        <CatQuestionStimulus stimulus={question.stimulus} />
        {question.questionType === "mcq" ? (
          <div className="ssc-answer-option-grid">
            {question.options?.map((option) => (
              <button
                aria-pressed={selected === option.id}
                className={[
                  "cat-practice-option",
                  selected === option.id ? "active" : "",
                  revealed && option.id === question.correctOption ? "correct" : "",
                  revealed && selected === option.id && option.id !== question.correctOption ? "wrong" : ""
                ].filter(Boolean).join(" ")}
                disabled={revealed}
                key={option.id}
                onClick={() => submit(option.id)}
                type="button"
              >
                <strong>{option.id.toUpperCase()}</strong><MathText text={option.text} />
              </button>
            ))}
          </div>
        ) : (
          <form className="ssc-test-filter-strip" onSubmit={(event) => { event.preventDefault(); submit(titaValue); }}>
            <label>Type your answer <input disabled={revealed} value={titaValue} onChange={(event) => setTitaValue(event.target.value)} /></label>
            <button className="button primary" disabled={revealed || !titaValue.trim()} type="submit">Check answer</button>
          </form>
        )}

        {revealed ? (
          <section className="ssc-explanation-panel" aria-live="polite">
            <div className="ssc-panel-heading">{correct ? <CheckCircle2 size={20} aria-hidden="true" /> : <XCircle size={20} aria-hidden="true" />}<strong>{correct ? "Correct" : "Not quite"}</strong></div>
            <p><strong>Answer:</strong> <MathText text={question.questionType === "mcq" ? question.options?.find((option) => option.id === question.correctOption)?.text ?? "" : question.correctAnswer ?? ""} /></p>
            <p><MathText text={question.explanation} /></p>
          </section>
        ) : null}

        <div className="button-row">
          <button className="button ghost" disabled={index === 0} onClick={() => move(-1)} type="button"><ArrowLeft size={15} aria-hidden="true" /> Previous</button>
          <button className="button ghost" onClick={reset} type="button"><RotateCcw size={15} aria-hidden="true" /> Reset chapter</button>
          <button className="button primary" disabled={index === questions.length - 1} onClick={() => move(1)} type="button">Next <ArrowRight size={15} aria-hidden="true" /></button>
        </div>
        <label className="cat-practice-jump-field">
          Jump to question
          <input
            aria-label="Question number"
            max={questions.length}
            min={1}
            onChange={(event) => {
              const target = Number(event.target.value);
              if (Number.isInteger(target) && target >= 1 && target <= questions.length) {
                setIndex(target - 1);
                setTitaValue("");
              }
            }}
            type="number"
            value={index + 1}
          />
          <span>of {questions.length}</span>
        </label>
      </article>
    </section>
  );
}
