"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle2, Eye, RotateCcw, XCircle } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { MathText } from "@/components/MathText";
import { SscQuantBookStimulus } from "@/components/SscQuantBookStimulus";
import type { SscQuantBookChapter } from "@/lib/ssc-quant-book-types";
import styles from "@/components/SscQuantBook.module.css";

type SavedPractice = { index: number; answers: Record<string, string>; revealed: Record<string, boolean>; savedAt: string };
const storageKey = (slug: string) => `ssc-quant-book-practice:${slug}`;
const chapterHref = (slug: string) => `/exams/ssc-cgl/subjects/quantitative-aptitude/chapters/${slug}`;

export function SscQuantBookPracticeClient({ chapter }: { chapter: SscQuantBookChapter }) {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});
  const [hydrated, setHydrated] = useState(false);
  const exercise = chapter.exercises[index] ?? null;
  const select = useCallback((value: string) => { if (!exercise || answers[exercise.id]) return; setAnswers((current) => ({ ...current, [exercise.id]: value })); }, [answers, exercise]);
  const move = useCallback((delta: number) => { setIndex((current) => Math.max(0, Math.min(chapter.exercises.length - 1, current + delta))); }, [chapter.exercises.length]);
  useEffect(() => {
    let cancelled = false;
    queueMicrotask(() => {
      if (cancelled) return;
      try {
        const stored = JSON.parse(window.localStorage.getItem(storageKey(chapter.slug)) || "null") as SavedPractice | null;
        if (stored) { setIndex(Math.max(0, Math.min(chapter.exercises.length - 1, stored.index))); setAnswers(stored.answers || {}); setRevealed(stored.revealed || {}); }
      } catch { /* ignore malformed local progress */ }
      setHydrated(true);
    });
    return () => { cancelled = true; };
  }, [chapter.exercises.length, chapter.slug]);
  useEffect(() => {
    if (hydrated) window.localStorage.setItem(storageKey(chapter.slug), JSON.stringify({ index, answers, revealed, savedAt: new Date().toISOString() } satisfies SavedPractice));
  }, [answers, hydrated, index, chapter.slug, revealed]);
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const target = event.target;
      if (target instanceof HTMLElement && (target.isContentEditable || ["input", "textarea", "select"].includes(target.tagName.toLowerCase()))) return;
      if (event.key === "ArrowLeft") { event.preventDefault(); move(-1); return; }
      if (event.key === "ArrowRight") { event.preventDefault(); move(1); return; }
      const option = exercise?.options?.[Number(event.key) - 1];
      if (option) { event.preventDefault(); select(option.id); }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [exercise, index, move, select]);
  const stats = useMemo(() => {
    const attempted = chapter.exercises.filter((item) => answers[item.id]).length;
    const correct = chapter.exercises.filter((item) => answers[item.id] && ((item.correctOption && answers[item.id] === item.correctOption) || (item.answer && answers[item.id].trim().toLowerCase() === item.answer.trim().toLowerCase()))).length;
    return { attempted, correct, wrong: Math.max(0, attempted - correct), progress: chapter.exercises.length ? Math.round(attempted / chapter.exercises.length * 100) : 0 };
  }, [answers, chapter.exercises]);
  function revealKey() { if (exercise) setRevealed((current) => ({ ...current, [exercise.id]: true })); }
  function reset() { setIndex(0); setAnswers({}); setRevealed({}); if (typeof window !== "undefined") window.localStorage.removeItem(storageKey(chapter.slug)); }
  if (!exercise) return <main className={styles.page}><section className={styles.empty}><h1>{chapter.title} practice</h1><p>No exercises have been published for this chapter yet.</p><Link className={styles.secondaryAction} href={chapterHref(chapter.slug)}>Back to chapter</Link></section></main>;
  const selected = answers[exercise.id];
  const isCorrect = Boolean(selected && ((exercise.correctOption && selected === exercise.correctOption) || (exercise.answer && selected.trim().toLowerCase() === exercise.answer.trim().toLowerCase())));
  const showReveal = Boolean(selected || revealed[exercise.id]);
  return (
    <main className={styles.page}>
      <header className={styles.practiceHero}><div><p className={styles.eyebrow}>SSC CGL Quant · Chapter {chapter.chapterNumber}</p><h1>{chapter.title} practice</h1><p>Choose an answer or reveal the answer key only. Progress and stats are saved in this browser.</p></div><div className={styles.stats} aria-label="Practice statistics"><span><strong>{index + 1}/{chapter.exercises.length}</strong><small>position</small></span><span><strong>{stats.progress}%</strong><small>progress</small></span><span><strong>{stats.correct}</strong><small>correct</small></span><span><strong>{stats.wrong}</strong><small>wrong</small></span></div></header>
      <div className={styles.progressTrack} aria-label={`${stats.progress}% complete`} role="progressbar" aria-valuemax={100} aria-valuemin={0} aria-valuenow={stats.progress}><span style={{ width: `${stats.progress}%` }} /></div>
      <article className={styles.practiceCard}><p className={styles.kicker}>Exercise {index + 1} · Chapter {chapter.chapterNumber}</p><SscQuantBookStimulus stimulus={exercise.stimulus} /><div className={`${styles.prompt} ${styles.sourceText}`}><MathText text={exercise.prompt} /></div>
        {exercise.options?.length ? <div className={styles.optionGrid} aria-label="Answer options">{exercise.options.map((option) => <button className={`${styles.option} ${selected === option.id ? styles.optionSelected : ""} ${showReveal && option.id === exercise.correctOption ? styles.optionCorrect : ""} ${showReveal && selected === option.id && !isCorrect ? styles.optionWrong : ""}`} disabled={Boolean(selected)} key={option.id} onClick={() => select(option.id)} type="button"><strong>{option.id.toUpperCase()}</strong><MathText text={option.text} /></button>)}</div> : <p className={styles.muted}>This exercise is answer-key only. Solve it on paper, then reveal the key.</p>}
        {!showReveal ? <button className={styles.revealButton} onClick={revealKey} type="button"><Eye size={15} aria-hidden="true" /> Reveal answer key only</button> : <section className={styles.solution} aria-live="polite"><div className={styles.solutionTitle}>{isCorrect ? <CheckCircle2 size={17} aria-hidden="true" /> : <XCircle size={17} aria-hidden="true" />}<strong>{isCorrect ? "Correct" : "Answer key"}</strong></div><p><strong>Answer:</strong> {exercise.answer || exercise.correctOption || "Not supplied"}</p></section>}
        <div className={styles.controls}><button className={styles.secondaryAction} disabled={index === 0} onClick={() => move(-1)} type="button"><ArrowLeft size={15} aria-hidden="true" /> Previous</button><button className={styles.secondaryAction} onClick={reset} type="button"><RotateCcw size={15} aria-hidden="true" /> Reset chapter</button><button className={styles.primaryAction} disabled={index === chapter.exercises.length - 1} onClick={() => move(1)} type="button">Next <ArrowRight size={15} aria-hidden="true" /></button></div>
        <label className={styles.jump}>Jump to exercise <input aria-label="Exercise number" max={chapter.exercises.length} min={1} onChange={(event) => setIndex(Math.max(0, Math.min(chapter.exercises.length - 1, Number(event.target.value) - 1)))} type="number" value={index + 1} /> <span>of {chapter.exercises.length}</span></label>
      </article>
      <Link className={styles.backLink} href={chapterHref(chapter.slug)}><ArrowLeft size={14} aria-hidden="true" /> Back to chapter notes</Link>
    </main>
  );
}
