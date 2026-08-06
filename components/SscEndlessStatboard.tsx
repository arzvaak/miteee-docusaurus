"use client";

import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  Bookmark,
  BookmarkCheck,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Target,
  X
} from "lucide-react";
import { useMemo, useState } from "react";
import { MathText } from "@/components/MathText";
import { SscExplanationPanel } from "@/components/SscExplanationPanel";
import { SscQuestionStimulus } from "@/components/SscQuestionStimulus";
import { useSscEndlessMemory } from "@/components/useSscEndlessMemory";
import type { SscCglOptionId, SscCglSectionId } from "@/lib/exam-types";
import {
  getOpenSscEndlessReviewItems,
  resolveSscEndlessReviewItem,
  setSscEndlessQuestionMarked
} from "@/lib/ssc-cgl-endless-memory";
import styles from "@/components/SscEndlessStatboard.module.css";

const sectionIds: SscCglSectionId[] = [
  "reasoning",
  "general-awareness",
  "quantitative-aptitude",
  "english-comprehension"
];

const sectionTitles: Record<SscCglSectionId, string> = {
  reasoning: "Reasoning",
  "general-awareness": "General Awareness",
  "quantitative-aptitude": "Quantitative Aptitude",
  "english-comprehension": "English"
};

function titleCase(value: string) {
  return value.split("-").map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(" ");
}

function formatDate(value: string | null) {
  if (!value) return "Not started";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "Saved locally"
    : new Intl.DateTimeFormat("en-IN", { dateStyle: "medium" }).format(date);
}

function formatOutcome(value: string | null) {
  if (!value) return "Saved manually";
  return value === "skipped" ? "Skipped" : titleCase(value);
}

export function SscEndlessStatboard() {
  const { memory, updateMemory, hydrated } = useSscEndlessMemory();
  const openItems = useMemo(() => getOpenSscEndlessReviewItems(memory), [memory]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [selected, setSelected] = useState<SscCglOptionId | null>(null);
  const [revealed, setRevealed] = useState(false);
  const activeQuestionId = useMemo(() => (
    activeId && openItems.some((item) => item.questionId === activeId)
      ? activeId
      : openItems[0]?.questionId ?? null
  ), [activeId, openItems]);
  const activeItem = openItems.find((item) => item.questionId === activeQuestionId) ?? null;
  const answered = memory.stats.answered;
  const accuracy = answered > 0 ? Math.round(memory.stats.correct / answered * 100) : 0;
  const markedCount = openItems.filter((item) => item.marked).length;
  const missedCount = openItems.filter((item) => item.lastOutcome === "wrong" || item.lastOutcome === "skipped").length;
  const activePosition = activeItem ? openItems.findIndex((item) => item.questionId === activeItem.questionId) : -1;

  function moveReview(delta: number) {
    if (activePosition < 0 || openItems.length === 0) return;
    const nextIndex = Math.max(0, Math.min(openItems.length - 1, activePosition + delta));
    setActiveId(openItems[nextIndex]?.questionId ?? null);
    setSelected(null);
    setRevealed(false);
  }

  function selectReviewItem(questionId: string) {
    setActiveId(questionId);
    setSelected(null);
    setRevealed(false);
  }

  function toggleMark() {
    if (!activeItem) return;
    updateMemory((current) => setSscEndlessQuestionMarked(
      current,
      activeItem.question,
      !activeItem.marked,
      new Date().toISOString()
    ));
  }

  function markMastered() {
    if (!activeItem || !revealed) return;
    const nextItem = openItems[activePosition + 1] ?? openItems[activePosition - 1] ?? null;
    updateMemory((current) => resolveSscEndlessReviewItem(current, activeItem.questionId));
    setActiveId(nextItem?.questionId ?? null);
    setSelected(null);
    setRevealed(false);
  }

  return (
    <section className={`${styles.page} page`}>
      <header className={`${styles.hero} panel`}>
        <div>
          <p className={styles.eyebrow}>Your SSC CGL statboard</p>
          <h1>Turn misses into solved questions.</h1>
          <p>Endless practice remembers what you got wrong, skipped, or deliberately saved. Come back here when you want a clean repair queue instead of starting from zero.</p>
          <div className={styles.heroActions}>
            <Link className="button primary" href="/exams/ssc-cgl/session?mode=endless&section=all&length=endless&timer=off&source=book&difficulty=all">
              <RotateCcw size={16} aria-hidden="true" /> Continue endless practice
            </Link>
            <Link className="button ghost" href="/exams/ssc-cgl">
              <ArrowLeft size={16} aria-hidden="true" /> SSC CGL home
            </Link>
          </div>
        </div>
        <div className={styles.heroMark} aria-hidden="true"><BarChart3 size={34} /></div>
      </header>

      <section className={styles.metrics} aria-label="Endless practice totals">
        <div className={styles.metric}><strong>{memory.stats.sessions}</strong><span>sessions</span></div>
        <div className={styles.metric}><strong>{memory.stats.questionsSeen}</strong><span>questions seen</span></div>
        <div className={styles.metric}><strong>{accuracy}%</strong><span>accuracy</span></div>
        <div className={styles.metric}><strong>{memory.stats.correct}</strong><span>correct</span></div>
        <div className={styles.metric}><strong>{openItems.length}</strong><span>open review</span></div>
      </section>

      <section className={styles.sectionStats} aria-label="Section performance">
        <div className={styles.sectionHeading}>
          <div>
            <p className={styles.eyebrow}>Where your time goes</p>
            <h2>Section performance</h2>
          </div>
          <span>{formatDate(memory.stats.lastSessionAt)}</span>
        </div>
        <div className={styles.sectionGrid}>
          {sectionIds.map((sectionId) => {
            const stats = memory.stats.sections[sectionId];
            const sectionAccuracy = stats.answered > 0 ? Math.round(stats.correct / stats.answered * 100) : 0;
            return (
              <article className={styles.sectionCard} key={sectionId}>
                <strong>{sectionTitles[sectionId]}</strong>
                <span>{sectionAccuracy}% accuracy · {stats.seen} seen</span>
                <div className={styles.sectionBar} aria-label={`${sectionTitles[sectionId]} ${sectionAccuracy}% accuracy`}>
                  <i style={{ width: `${sectionAccuracy}%` }} />
                </div>
                <small>{stats.correct} correct · {stats.wrong} wrong · {stats.skipped} skipped</small>
              </article>
            );
          })}
        </div>
      </section>

      <div className={styles.reviewLayout}>
        <aside className={`${styles.queue} panel`} aria-label="Endless review queue">
          <header className={styles.queueHeader}>
            <div>
              <p className={styles.eyebrow}>Personal queue</p>
              <h2>Review these next.</h2>
            </div>
            <strong>{openItems.length}</strong>
          </header>
          <div className={styles.queueSummary}>
            <span><BookmarkCheck size={14} aria-hidden="true" /> {markedCount} marked</span>
            <span><Target size={14} aria-hidden="true" /> {missedCount} missed</span>
          </div>
          {openItems.length > 0 ? (
            <div className={styles.queueList}>
              {openItems.map((item, index) => (
                <button
                  className={`${styles.queueItem} ${item.questionId === activeQuestionId ? styles.queueItemActive : ""}`}
                  type="button"
                  onClick={() => selectReviewItem(item.questionId)}
                  key={item.questionId}
                >
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <div>
                    <strong>{titleCase(item.question.topic)}</strong>
                    <small>{formatOutcome(item.lastOutcome)} · {item.question.subtopic}</small>
                  </div>
                  {item.marked ? <Bookmark size={14} aria-label="Marked for review" /> : null}
                </button>
              ))}
            </div>
          ) : (
            <div className={styles.emptyQueue}>
              <CheckCircle2 size={24} aria-hidden="true" />
              <strong>Your review queue is clear.</strong>
              <p>Wrong, skipped, and marked questions from endless practice will appear here.</p>
            </div>
          )}
        </aside>

        <main className={`${styles.reviewCard} panel`} aria-label="Review question">
          {!hydrated ? (
            <div className={styles.emptyReview}><RotateCcw size={22} aria-hidden="true" /><strong>Loading your statboard…</strong></div>
          ) : !activeItem ? (
            <div className={styles.emptyReview}>
              <CheckCircle2 size={28} aria-hidden="true" />
              <p className={styles.eyebrow}>Nothing waiting</p>
              <h2>Keep the queue clean.</h2>
              <p>Start endless practice and use “Mark for review” whenever a question deserves another pass.</p>
              <Link className="button primary" href="/exams/ssc-cgl/session?mode=endless&section=all&length=endless&timer=off&source=book&difficulty=all">Start endless practice <ArrowRight size={15} aria-hidden="true" /></Link>
            </div>
          ) : (
            <>
              <header className={styles.reviewHeader}>
                <div>
                  <p className={styles.eyebrow}>Question {activePosition + 1} of {openItems.length}</p>
                  <strong>{titleCase(activeItem.question.section)} · {titleCase(activeItem.question.topic)}</strong>
                </div>
                <span>{formatOutcome(activeItem.lastOutcome)} · {activeItem.question.difficulty}</span>
              </header>
              <div className={styles.reviewMeta}>
                <span>Saved {formatDate(activeItem.updatedAt)}</span>
                <span>{activeItem.attempts} endless attempt{activeItem.attempts === 1 ? "" : "s"}</span>
                {activeItem.marked ? <span><BookmarkCheck size={14} aria-hidden="true" /> Marked</span> : null}
              </div>
              <h2 className={styles.reviewStem}><MathText text={activeItem.question.stem} /></h2>
              <SscQuestionStimulus stimulus={activeItem.question.stimulus} />
              <div className={styles.reviewOptions} role="radiogroup" aria-label="Review answer options">
                {activeItem.question.options.map((option) => {
                  const isSelected = selected === option.id;
                  const isCorrect = revealed && option.id === activeItem.question.correctOption;
                  const isWrong = revealed && isSelected && option.id !== activeItem.question.correctOption;
                  return (
                    <button
                      className={`${styles.reviewOption} ${isSelected ? styles.reviewOptionSelected : ""} ${isCorrect ? styles.reviewOptionCorrect : ""} ${isWrong ? styles.reviewOptionWrong : ""}`}
                      type="button"
                      role="radio"
                      aria-checked={isSelected}
                      disabled={revealed}
                      onClick={() => setSelected(option.id)}
                      key={option.id}
                    >
                      <span>{option.id.toUpperCase()}</span>
                      <strong><MathText text={option.text} /></strong>
                      {isCorrect ? <Check size={17} aria-hidden="true" /> : null}
                      {isWrong ? <X size={17} aria-hidden="true" /> : null}
                    </button>
                  );
                })}
              </div>
              {revealed ? (
                <section className={selected === activeItem.question.correctOption ? styles.reviewCorrect : styles.reviewFeedback} aria-live="polite">
                  <strong>{selected === activeItem.question.correctOption ? "Correct — this one is ready to leave the queue." : `Answer: ${activeItem.question.correctOption.toUpperCase()}. Repair the method before moving on.`}</strong>
                  <SscExplanationPanel explanation={activeItem.question.explanation} />
                </section>
              ) : (
                <p className={styles.reviewHint}>Choose an answer, then check it. You can also reveal the explanation without choosing.</p>
              )}
              <div className={styles.reviewActions}>
                <button className="button ghost" type="button" onClick={() => moveReview(-1)} disabled={activePosition <= 0}><ChevronLeft size={15} aria-hidden="true" /> Previous</button>
                <button className="button ghost" type="button" onClick={toggleMark} aria-pressed={activeItem.marked}>
                  {activeItem.marked ? <BookmarkCheck size={15} aria-hidden="true" /> : <Bookmark size={15} aria-hidden="true" />}
                  {activeItem.marked ? "Unmark" : "Mark for review"}
                </button>
                {!revealed ? (
                  <button className="button primary" type="button" onClick={() => setRevealed(true)}>{selected ? "Check answer" : "Reveal answer"} <Check size={15} aria-hidden="true" /></button>
                ) : (
                  <button className="button primary" type="button" onClick={markMastered}>Mark mastered <CheckCircle2 size={15} aria-hidden="true" /></button>
                )}
                <button className="button ghost" type="button" onClick={() => moveReview(1)} disabled={activePosition < 0 || activePosition >= openItems.length - 1}>Next <ChevronRight size={15} aria-hidden="true" /></button>
              </div>
            </>
          )}
        </main>
      </div>
    </section>
  );
}
