"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowRight, Bookmark, Check, CheckCircle2, ChevronLeft, ChevronRight, Clock3, Flag, RotateCcw, Send, XCircle } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { MathText } from "@/components/MathText";
import type { GateQuestion } from "@/components/GateUi";
import styles from "@/components/Gate.module.css";

type Answer = string | string[];
type GateRunnerProps = { paper: string; topic: string; title: string; questions: GateQuestion[]; mode: "practice" | "timed"; durationSeconds?: number };
type SavedState = { index: number; answers: Record<string, Answer>; marked: string[]; checkedMultiple: string[]; submitted: boolean; remaining: number };

function questionSetFingerprint(questionIds: string[]) {
  let hash = 2166136261;
  for (const character of questionIds.join("|")) {
    hash ^= character.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(16);
}
function storageKey(paper: string, topic: string, mode: string, questionIds: string[]) { return `gate-test-progress:${paper}:${topic}:${mode}:${questionSetFingerprint(questionIds)}`; }
function sameAnswers(question: GateQuestion, answer: Answer | undefined) {
  if (question.questionType === "msq") return Array.isArray(answer) && [...answer].sort().join("|") === [...question.correctOptions].sort().join("|");
  if (question.questionType === "nat") {
    const value = Number(Array.isArray(answer) ? answer[0] : answer);
    if (!Number.isFinite(value)) return false;
    if (question.answerRange?.min !== undefined && question.answerRange.max !== undefined) return value >= question.answerRange.min && value <= question.answerRange.max;
    const expected = Number(question.correctAnswer);
    return Number.isFinite(expected) && Math.abs(value - expected) <= 1e-6;
  }
  return answer === question.correctOption;
}
function answerLabel(question: GateQuestion) {
  if (question.questionType === "nat") return question.correctAnswer ?? (question.answerRange ? `${question.answerRange.min}–${question.answerRange.max}` : "—");
  const ids = question.questionType === "msq" ? question.correctOptions : question.correctOption ? [question.correctOption] : [];
  return ids.map((id) => question.options.find((option) => option.id === id)?.text ?? id).join(", ");
}

export function GateRunner({ paper, topic, title, questions, mode, durationSeconds = 90 }: GateRunnerProps) {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const [marked, setMarked] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [remaining, setRemaining] = useState(durationSeconds);
  const [natValue, setNatValue] = useState("");
  const [checkedMultiple, setCheckedMultiple] = useState<string[]>([]);
  const progressKey = useMemo(() => storageKey(paper, topic, mode, questions.map((item) => item.id)), [mode, paper, questions, topic]);
  const question = questions[index] ?? null;
  const answer = question ? answers[question.id] : undefined;
  const practiceRevealed = mode === "practice" && answer !== undefined && (question?.questionType !== "msq" || checkedMultiple.includes(question.id));
  const reveal = submitted || practiceRevealed;
  const correct = question ? sameAnswers(question, answer) : false;

  useEffect(() => {
    let cancelled = false;
    queueMicrotask(() => {
      if (cancelled) return;
      try {
        const parsed = JSON.parse(window.localStorage.getItem(progressKey) ?? "null") as Partial<SavedState> | null;
        if (parsed) {
          setIndex(Math.min(Math.max(parsed.index ?? 0, 0), Math.max(questions.length - 1, 0)));
          setAnswers(parsed.answers ?? {});
          setMarked(parsed.marked ?? []);
          setCheckedMultiple(parsed.checkedMultiple ?? []);
          setSubmitted(Boolean(parsed.submitted));
          if (typeof parsed.remaining === "number" && Number.isFinite(parsed.remaining)) setRemaining(Math.min(durationSeconds, Math.max(0, parsed.remaining)));
        }
      } catch { /* malformed local state is safely ignored */ }
      setHydrated(true);
    });
    return () => { cancelled = true; };
  }, [durationSeconds, progressKey, questions.length]);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(progressKey, JSON.stringify({ index, answers, marked, checkedMultiple, submitted, remaining } satisfies SavedState));
  }, [answers, checkedMultiple, hydrated, index, marked, progressKey, remaining, submitted]);

  useEffect(() => {
    if (mode !== "timed" || submitted || !hydrated) return;
    const timer = window.setInterval(() => setRemaining((value) => {
      if (value <= 1) { window.clearInterval(timer); setSubmitted(true); return 0; }
      return value - 1;
    }), 1000);
    return () => window.clearInterval(timer);
  }, [hydrated, mode, submitted]);

  const stats = useMemo(() => {
    const attempted = questions.filter((item) => answers[item.id] !== undefined);
    const correctCount = attempted.filter((item) => sameAnswers(item, answers[item.id])).length;
    const marks = attempted.reduce((sum, item) => sum + (sameAnswers(item, answers[item.id]) ? item.marks : -item.negativeMarks), 0);
    return { attempted: attempted.length, correct: correctCount, wrong: attempted.length - correctCount, marks };
  }, [answers, questions]);

  function setSingle(value: string) { if (!question || reveal) return; setAnswers((current) => ({ ...current, [question.id]: value })); }
  function toggleMultiple(value: string) { if (!question || reveal) return; const current = Array.isArray(answers[question.id]) ? answers[question.id] as string[] : []; setAnswers((all) => ({ ...all, [question.id]: current.includes(value) ? current.filter((item) => item !== value) : [...current, value] })); }
  function saveNat() { if (!question || reveal || !natValue.trim()) return; setAnswers((current) => ({ ...current, [question.id]: natValue.trim() })); }
  function checkMultiple() { if (!question || question.questionType !== "msq" || !answer || reveal) return; setCheckedMultiple((current) => current.includes(question.id) ? current : [...current, question.id]); }
  function go(delta: number) { setIndex((value) => Math.max(0, Math.min(questions.length - 1, value + delta))); setNatValue(""); }
  function reset() { setIndex(0); setAnswers({}); setMarked([]); setCheckedMultiple([]); setSubmitted(false); setRemaining(durationSeconds); setNatValue(""); window.localStorage.removeItem(progressKey); }
  function toggleMark() { if (!question) return; setMarked((current) => current.includes(question.id) ? current.filter((id) => id !== question.id) : [...current, question.id]); }

  if (!question) return <section className={styles.page}><div className={styles.empty}><h1>No questions found</h1><p>Widen the builder filters and try again.</p><Link className={styles.secondaryButton} href={`/exams/gate/${paper}/practice`}><ArrowLeft size={15} aria-hidden="true" /> Back to builder</Link></div></section>;

  if (submitted && mode === "timed") return <GateResult paper={paper} topic={topic} title={title} questions={questions} answers={answers} marked={marked} stats={stats} onReset={reset} />;

  const answered = answer !== undefined;
  const timerLabel = `${Math.floor(remaining / 60).toString().padStart(2, "0")}:${(remaining % 60).toString().padStart(2, "0")}`;
  return <section className={styles.page}>
    <header className={styles.runnerHeader}><div><Link className={styles.backLink} href={`/exams/gate/${paper}`}><ArrowLeft size={15} aria-hidden="true" /> {paper.toUpperCase()} paper</Link><p className={styles.eyebrow}>{mode === "timed" ? "Timed test" : "Topic practice"}</p><h1>{title}</h1><p>{questions.length} questions · {stats.attempted} attempted · {marked.length} marked</p></div><div className={styles.runnerClock}>{mode === "timed" ? <><Clock3 size={16} aria-hidden="true" /><strong>{timerLabel}</strong><small>remaining</small></> : <><strong>{stats.correct}</strong><small>correct so far</small></>}</div></header>
    <div className={styles.runnerLayout}>
      <article className={styles.questionCard}>
        <div className={styles.questionTop}><span>Question {index + 1} of {questions.length}</span><button className={marked.includes(question.id) ? styles.markButtonActive : styles.markButton} onClick={toggleMark} type="button" aria-pressed={marked.includes(question.id)}><Bookmark size={15} aria-hidden="true" /> {marked.includes(question.id) ? "Marked" : "Mark for review"}</button></div>
        <div className={styles.sourceLine}><span>{question.year ? `GATE ${question.year}` : "GATE source"}</span><span>{question.source}{question.sourcePage ? ` · page ${question.sourcePage}` : ""}</span><span className={styles.questionType}>{question.questionType.toUpperCase()}</span></div>
        <div className={styles.stem}><MathText text={question.stem} /></div>
        {question.stimulus ? <figure className={styles.stimulus}><Image src={question.stimulus.src} alt={question.stimulus.alt} width={860} height={480} unoptimized /><figcaption>{question.stimulus.caption ?? "Verified question stimulus"}</figcaption></figure> : null}
        {question.questionType === "nat" ? <form className={styles.natForm} onSubmit={(event) => { event.preventDefault(); saveNat(); }}><label>Enter your numerical answer<input inputMode="decimal" disabled={reveal} value={answered ? String(Array.isArray(answer) ? answer[0] : answer) : natValue} onChange={(event) => setNatValue(event.target.value)} /></label><button className={styles.primaryButton} disabled={reveal || !natValue.trim()} type="submit"><Check size={15} aria-hidden="true" /> Check answer</button>{reveal && question.answerRange ? <small>Accepted range: {question.answerRange.min}–{question.answerRange.max}</small> : null}</form> : <div className={styles.options} role={question.questionType === "msq" ? "group" : "radiogroup"}>{question.questionType === "msq" ? <p className={styles.optionHint}>Select all correct options, then check your answer.</p> : null}{question.options.map((option) => { const selected = question.questionType === "msq" ? Array.isArray(answer) && answer.includes(option.id) : answer === option.id; const optionCorrect = question.questionType === "msq" ? question.correctOptions.includes(option.id) : question.correctOption === option.id; return <button className={`${styles.option} ${selected ? styles.optionSelected : ""} ${reveal && optionCorrect ? styles.optionCorrect : ""} ${reveal && selected && !optionCorrect ? styles.optionWrong : ""}`} aria-pressed={selected} disabled={reveal} key={option.id} onClick={() => question.questionType === "msq" ? toggleMultiple(option.id) : setSingle(option.id)} type="button"><span>{option.id.toUpperCase()}</span><MathText text={option.text} />{reveal && optionCorrect ? <CheckCircle2 size={17} aria-label="Correct option" /> : null}</button>; })}{question.questionType === "msq" ? <button className={styles.primaryButton} disabled={reveal || !answered} onClick={checkMultiple} type="button"><Check size={15} aria-hidden="true" /> Check answer</button> : null}</div>}
        {reveal ? <section className={`${styles.explanation} ${correct ? styles.explanationCorrect : styles.explanationWrong}`} aria-live="polite"><div><strong>{correct ? <><CheckCircle2 size={17} aria-hidden="true" /> Correct</> : <><XCircle size={17} aria-hidden="true" /> Review this one</>}</strong><span>Official answer: <b>{answerLabel(question)}</b></span>{question.officialKeyTitle ? <small>Verified against {question.officialKeyTitle}</small> : <small>Official answer key attached to this source</small>}</div>{question.explanationAvailable ? <p><MathText text={question.explanation} /></p> : <p className={styles.unavailable}>No written explanation is available for this question yet. The official answer above remains the scored key.</p>}</section> : null}
        <div className={styles.runnerFooter}><button className={styles.secondaryButton} disabled={index === 0} onClick={() => go(-1)} type="button"><ChevronLeft size={16} aria-hidden="true" /> Previous</button>{mode === "timed" && index === questions.length - 1 ? <button className={styles.primaryButton} onClick={() => setSubmitted(true)} type="button"><Send size={15} aria-hidden="true" /> Submit test</button> : <button className={styles.primaryButton} disabled={mode === "practice" && !reveal} onClick={() => go(1)} type="button">Next <ChevronRight size={16} aria-hidden="true" /></button>}</div>
      </article>
      <aside className={styles.palette}><div className={styles.paletteHeading}><strong>Question map</strong><small>{stats.attempted}/{questions.length} answered</small></div><div className={styles.paletteGrid}>{questions.map((item, itemIndex) => <button className={`${styles.paletteButton} ${itemIndex === index ? styles.paletteCurrent : ""} ${answers[item.id] !== undefined ? styles.paletteAnswered : ""} ${marked.includes(item.id) ? styles.paletteMarked : ""}`} key={item.id} onClick={() => { setIndex(itemIndex); setNatValue(""); }} type="button" aria-label={`Question ${itemIndex + 1}${answers[item.id] !== undefined ? ", answered" : ", unanswered"}`}>{itemIndex + 1}</button>)}</div><div className={styles.paletteLegend}><span><i className={styles.legendAnswered} /> Answered</span><span><i className={styles.legendMarked} /> Marked</span></div><button className={styles.resetButton} onClick={reset} type="button"><RotateCcw size={14} aria-hidden="true" /> Reset this set</button></aside>
    </div>
  </section>;
}

function GateResult({ paper, topic, title, questions, answers, marked, stats, onReset }: { paper: string; topic: string; title: string; questions: GateQuestion[]; answers: Record<string, Answer>; marked: string[]; stats: { attempted: number; correct: number; wrong: number; marks: number }; onReset: () => void }) {
  return <section className={styles.page}><header className={styles.resultHero}><p className={styles.eyebrow}>Test submitted</p><h1>{title}</h1><div className={styles.resultStats}><span><strong>{stats.marks.toFixed(2)}</strong><small>marks</small></span><span><strong>{stats.correct}/{questions.length}</strong><small>correct</small></span><span><strong>{stats.attempted}</strong><small>attempted</small></span><span><strong>{marked.length}</strong><small>marked</small></span></div></header><div className={styles.resultActions}><Link className={styles.secondaryButton} href={`/exams/gate/${paper}/practice`}><ArrowLeft size={15} aria-hidden="true" /> Change filters</Link><button className={styles.primaryButton} onClick={onReset} type="button"><RotateCcw size={15} aria-hidden="true" /> Retake test</button></div><section className={styles.reviewList}><div className={styles.sectionHeading}><div><p className={styles.eyebrow}>Answer review</p><h2>Official answers and explanations</h2></div><span className={styles.muted}>Source labels stay attached to every question.</span></div>{questions.map((question, index) => { const isCorrect = sameAnswers(question, answers[question.id]); return <article className={styles.reviewCard} key={question.id}><div className={styles.reviewNumber}><span className={isCorrect ? styles.reviewPass : styles.reviewFail}>{isCorrect ? <Check size={15} aria-hidden="true" /> : <XCircle size={15} aria-hidden="true" />}</span><strong>Q{index + 1}</strong></div><div><p className={styles.sourceLine}>{question.year ? `GATE ${question.year}` : "GATE source"} · {question.source}{question.officialKeyTitle ? ` · Official key: ${question.officialKeyTitle}` : ""}</p><h3><MathText text={question.stem} /></h3><p><strong>Official answer:</strong> {answerLabel(question)}</p>{question.explanationAvailable ? <p className={styles.reviewExplanation}><MathText text={question.explanation} /></p> : <p className={styles.unavailable}>No written explanation is available yet; review the official key above.</p>}</div></article>; })}</section><div className={styles.resultBottom}><Link className={styles.secondaryButton} href={`/exams/gate/${paper}/practice/${topic}`}><ArrowLeft size={15} aria-hidden="true" /> Back to practice</Link></div></section>;
}
