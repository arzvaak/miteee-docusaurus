"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowDownToLine,
  ArrowRight,
  BookOpenCheck,
  Brain,
  Calculator,
  CheckCircle2,
  Clipboard,
  DatabaseBackup,
  Gauge,
  Globe2,
  RotateCcw,
  SearchCheck,
  Target,
  TimerReset,
  Trash2,
  TrendingUp,
  Upload
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import {
  buildLearnerMemoryBackup,
  buildLearnerWeaknessInsight,
  createEmptyLearnerMemory,
  getDueRevisionCards,
  getLearnerMemoryStats,
  getStudyMomentum,
  restoreLearnerMemoryBackup,
  reviewRevisionCardWithAttempt,
  type RecallGrade
} from "@/lib/learner-memory";
import type {
  LearnerDrillRecommendation,
  LearnerTopicWeakness
} from "@/lib/learner-weakness-engine";
import { recallGradeOptions } from "@/lib/recall-grades";
import { buildRecallAttemptState } from "@/lib/revision-attempt";
import { buildRevisionAttemptRepairBrief, buildRevisionRepairSprint } from "@/lib/revision-repair";
import type { NotePreview } from "@/lib/content";
import { useLearnerMemory } from "@/components/useLearnerMemory";
import { useLearnerWeakness } from "@/components/useLearnerWeakness";
import styles from "@/components/RevisionDashboard.module.css";

const subjectDiagnostics: Array<{
  id: string;
  label: string;
  shortLabel: string;
  icon: LucideIcon;
  tone: "blue" | "amber" | "rose" | "green";
}> = [
  { id: "reasoning", label: "General Intelligence & Reasoning", shortLabel: "Reasoning", icon: Brain, tone: "blue" },
  { id: "general-awareness", label: "General Awareness", shortLabel: "General Awareness", icon: Globe2, tone: "amber" },
  { id: "quantitative-aptitude", label: "Quantitative Aptitude", shortLabel: "Quant", icon: Calculator, tone: "rose" },
  { id: "english-comprehension", label: "English Comprehension", shortLabel: "English", icon: BookOpenCheck, tone: "green" }
];

function formatDate(value: string | null | undefined) {
  if (!value) return "Not reviewed";
  return new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "short" }).format(new Date(value));
}

function formatPercent(value: number) {
  return `${Math.round(value * 100)}%`;
}

function humanize(value: string) {
  return value.replaceAll("-", " ");
}

function drillLabel(drill: LearnerDrillRecommendation) {
  const labels: Record<LearnerDrillRecommendation["mode"], string> = {
    diagnostic: "Diagnostic",
    "accuracy-repair": "Accuracy repair",
    "confidence-calibration": "Confidence check",
    "speed-repair": "Speed repair",
    "spaced-recall": "Spaced recall",
    "mixed-practice": "Mixed practice"
  };
  return labels[drill.mode];
}

function drillHref(drill: LearnerDrillRecommendation) {
  if (drill.topic) {
    const mode = drill.mode === "speed-repair" ? "speed" : drill.mode === "accuracy-repair" ? "misses" : "unanswered";
    return `/exams/ssc-cgl/practice/${encodeURIComponent(drill.topic.id)}?mode=${mode}`;
  }
  const section = drill.subject?.id ?? "reasoning";
  return `/exams/ssc-cgl/session?mode=quick&section=${encodeURIComponent(section)}&length=10&timer=exam&source=book&difficulty=all`;
}

function topicEvidenceLine(topic: LearnerTopicWeakness) {
  if (topic.evidenceCount < 3) return `${topic.evidenceCount} answer${topic.evidenceCount === 1 ? "" : "s"} · more evidence needed`;
  return `${topic.correct}/${topic.evidenceCount} correct · ${formatPercent(topic.recencyWeightedAccuracy)} recent accuracy`;
}

export function RevisionDashboard({ suggestions }: { suggestions: NotePreview[] }) {
  const { memory, updateMemory } = useLearnerMemory();
  const { report, hydrated } = useLearnerWeakness();
  const now = new Date().toISOString();
  const dueCards = getDueRevisionCards(memory, now);
  const stats = getLearnerMemoryStats(memory, now);
  const momentum = getStudyMomentum(memory, now, 7);
  const noteWeakness = buildLearnerWeaknessInsight(memory, now);
  const repairSprint = buildRevisionRepairSprint(memory, now);
  const recentMistakes = memory.mistakes.slice(0, 4);
  const recentAttempts = memory.revisionAttempts.slice(0, 4);
  const [importValue, setImportValue] = useState("");
  const [dataMessage, setDataMessage] = useState<string | null>(null);
  const [recallAttempts, setRecallAttempts] = useState<Record<string, string>>({});
  const backupText = buildLearnerMemoryBackup(memory, now);
  const hasExamEvidence = hydrated && report.usableEvidenceCount > 0;
  const primaryTopic = hasExamEvidence ? report.weakestTopic : null;
  const recommendedDrill = report.nextDrill;

  const subjectSummaries = useMemo(() => subjectDiagnostics.map((subject) => {
    const topics = report.topics.filter((topic) => topic.subject.id === subject.id);
    const evidenceCount = topics.reduce((sum, topic) => sum + topic.evidenceCount, 0);
    const mastery = evidenceCount > 0
      ? Math.round(topics.reduce((sum, topic) => sum + topic.masteryScore * topic.evidenceCount, 0) / evidenceCount)
      : null;
    const weakest = topics[0] ?? null;
    return { ...subject, topics, evidenceCount, mastery, weakest };
  }), [report.topics]);

  function review(cardId: string, grade: RecallGrade, attempt: string) {
    setRecallAttempts((current) => {
      const next = { ...current };
      delete next[cardId];
      return next;
    });
    updateMemory((current) => reviewRevisionCardWithAttempt(current, cardId, grade, attempt, new Date().toISOString()));
  }

  async function copyBackup() {
    try {
      await navigator.clipboard.writeText(backupText);
      setDataMessage("Backup copied.");
    } catch {
      setDataMessage("Copy failed. Select the export text manually.");
    }
  }

  function downloadBackup() {
    const blob = new Blob([backupText], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `miteee-learner-memory-${new Date().toISOString().slice(0, 10)}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
    setDataMessage("Backup file prepared.");
  }

  function restoreBackup() {
    const result = restoreLearnerMemoryBackup(importValue);
    if (!result.ok) {
      setDataMessage(result.error);
      return;
    }
    updateMemory(() => result.memory);
    setImportValue("");
    setDataMessage(`Restored backup from ${formatDate(result.exportedAt)}.`);
  }

  function resetMemory() {
    updateMemory(() => createEmptyLearnerMemory());
    setDataMessage("Learner memory reset.");
  }

  return (
    <div className={styles.page}>
      <header className={styles.masthead}>
        <div className={styles.mastheadCopy}>
          <span className={styles.eyebrow}>Revision intelligence</span>
          <h1>Know what to fix next.</h1>
          <p>MITEEE now turns actual answers, mistakes, confidence, pace, and recency into a repair order. No vague “weak subject” labels.</p>
        </div>
        <div className={styles.evidenceStrip} aria-label="Evidence summary">
          <span><strong>{hasExamEvidence ? report.usableEvidenceCount : "—"}</strong><small>graded answers</small></span>
          <span><strong>{hasExamEvidence ? report.topics.length : "—"}</strong><small>topics measured</small></span>
          <span><strong>{primaryTopic ? `${primaryTopic.masteryScore}` : "—"}</strong><small>weakest mastery</small></span>
          <span><strong>{stats.dueCards}</strong><small>recall cards due</small></span>
        </div>
      </header>

      <section className={styles.commandGrid}>
        <article className={styles.commandCard} aria-label="Repair sprint priority">
          <div className={styles.commandTopline}>
            <span className={styles.iconBadge}><Target size={20} aria-hidden="true" /></span>
            <span>{hasExamEvidence ? "Next best drill" : "Build your baseline"}</span>
            {primaryTopic ? <em>{humanize(primaryTopic.status)}</em> : <em>not measured</em>}
          </div>
          <h2>{primaryTopic ? `Repair ${primaryTopic.topic.label}` : "Take one short diagnostic."}</h2>
          <Link className={styles.primaryAction} href={drillHref(recommendedDrill)}>
            {primaryTopic ? "Start recommended drill" : "Start a Quick 10"} <ArrowRight size={17} aria-hidden="true" />
          </Link>
          <p>{primaryTopic ? recommendedDrill.reason : "A ten-question section sprint is enough to start separating missing knowledge from slow recall and careless errors."}</p>
          <div className={styles.commandMeta}>
            <span>{drillLabel(recommendedDrill)}</span>
            <span>{recommendedDrill.questionCount} questions</span>
            <span>{recommendedDrill.timed ? `${recommendedDrill.targetSecondsPerQuestion ?? 36}s target` : "untimed first"}</span>
          </div>
        </article>

        <aside className={styles.explanationCard}>
          <span className={styles.eyebrow}>Why this recommendation</span>
          {primaryTopic ? (
            <>
              <strong>{topicEvidenceLine(primaryTopic)}</strong>
              <ul>
                {primaryTopic.reasons.slice(0, 3).map((reason) => <li key={reason}>{reason}</li>)}
              </ul>
              <small>Scores shrink toward neutral until enough evidence exists, so one lucky answer cannot mark a topic “mastered”.</small>
            </>
          ) : (
            <>
              <strong>There is no SSC attempt evidence yet.</strong>
              <p>The old screen showed four zeroes and guessed from note activity. This state is honest: take a short test and the first evidence will appear here.</p>
              <small>Note recall and SSC MCQ evidence remain separate, then meet in one repair queue.</small>
            </>
          )}
        </aside>
      </section>

      <section className={styles.subjectSection} aria-labelledby="subject-map-title">
        <div className={styles.sectionHeading}>
          <div>
            <span className={styles.eyebrow}>Subject map</span>
            <h2 id="subject-map-title">Four sections, measured separately.</h2>
          </div>
          <Link href="/exams/ssc-cgl">Configure another test <ArrowRight size={15} aria-hidden="true" /></Link>
        </div>
        <div className={styles.subjectGrid}>
          {subjectSummaries.map((subject) => {
            const Icon = subject.icon;
            return (
              <Link
                className={`${styles.subjectCard} ${styles[subject.tone]}`}
                href={`/exams/ssc-cgl/session?mode=quick&section=${subject.id}&length=10&timer=exam&source=book&difficulty=all`}
                key={subject.id}
              >
                <span className={styles.subjectIcon}><Icon size={22} aria-hidden="true" /></span>
                <div>
                  <small>{subject.evidenceCount > 0 ? `${subject.evidenceCount} graded answers` : "No evidence yet"}</small>
                  <h3>{subject.shortLabel}</h3>
                  <p>{subject.weakest ? `Needs attention: ${subject.weakest.topic.label}` : "Run a baseline to map this section."}</p>
                </div>
                <strong>{subject.mastery === null ? "Start" : `${subject.mastery}`}</strong>
                <span className={styles.subjectMeter} aria-label={subject.mastery === null ? "Not measured" : `${subject.mastery} mastery score`}>
                  <i style={{ width: `${subject.mastery ?? 0}%` }} />
                </span>
                <em>{subject.mastery === null ? "Take baseline" : "Open section"} <ArrowRight size={14} aria-hidden="true" /></em>
              </Link>
            );
          })}
        </div>
      </section>

      <section className={styles.weaknessSection} aria-labelledby="weakness-map-title">
        <div className={styles.sectionHeading}>
          <div>
            <span className={styles.eyebrow}>Weakness map</span>
            <h2 id="weakness-map-title">Evidence, not guesswork.</h2>
          </div>
          {hasExamEvidence ? <span>Updated from {report.usableEvidenceCount} recorded answers</span> : <span>Waiting for your first SSC drill</span>}
        </div>

        {hasExamEvidence ? (
          <div className={styles.weaknessGrid}>
            {report.topics.slice(0, 6).map((topic, index) => (
              <article className={`${styles.weaknessCard} ${styles[`status-${topic.status}`]}`} key={topic.key}>
                <header>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <div><small>{topic.subject.label}</small><h3>{topic.topic.label}</h3></div>
                  <strong>{topic.masteryScore}</strong>
                </header>
                <div className={styles.masteryTrack} aria-label={`${topic.masteryScore} mastery score`}><i style={{ width: `${topic.masteryScore}%` }} /></div>
                <div className={styles.metricRow}>
                  <span><strong>{formatPercent(topic.recencyWeightedAccuracy)}</strong><small>recent accuracy</small></span>
                  <span><strong>{topic.evidenceCount}</strong><small>answers</small></span>
                  <span><strong>{topic.timedEvidenceCount ? `${Math.round(topic.averageTimeSeconds)}s` : "—"}</strong><small>average pace</small></span>
                </div>
                <p>{topic.reasons[0]}</p>
                <Link href={drillHref(topic.nextDrill)}>{drillLabel(topic.nextDrill)} <ArrowRight size={14} aria-hidden="true" /></Link>
              </article>
            ))}
          </div>
        ) : (
          <div className={styles.noEvidence}>
            <span><SearchCheck size={25} aria-hidden="true" /></span>
            <div><strong>Your map will fill itself from real attempts.</strong><p>Correct, wrong, skipped, pace, confidence, sample size, and age all change the recommendation.</p></div>
            <Link href="/practice">Open practice <ArrowRight size={15} aria-hidden="true" /></Link>
          </div>
        )}
      </section>

      <section className={styles.repairLayout}>
        <div className={styles.recallPanel}>
          <div className={styles.sectionHeading}>
            <div><span className={styles.eyebrow}>Due recall</span><h2>Answer before opening the source.</h2></div>
            <RotateCcw size={19} aria-hidden="true" />
          </div>

          <div className={styles.noteSignal}>
            <span>Note-memory signal</span>
            <strong>{noteWeakness.topCourse ? `${noteWeakness.topCourse.label} needs repair.` : "No note weakness has been recorded."}</strong>
            <p>{noteWeakness.nextAction}</p>
          </div>

          {dueCards.length > 0 ? dueCards.slice(0, 3).map((card) => {
            const attempt = recallAttempts[card.id] ?? "";
            const attemptState = buildRecallAttemptState(attempt);
            return (
              <article className={styles.recallCard} key={card.id}>
                <header>
                  <span>{card.source === "mistake" ? "Mistake repair" : "Note recall"}</span>
                  <small>due {formatDate(card.dueAt)}</small>
                </header>
                <h3>{card.title}</h3>
                <p>{card.prompt}</p>
                <label>
                  <span>My closed-book answer</span>
                  <textarea
                    value={attempt}
                    onChange={(event) => setRecallAttempts((current) => ({ ...current, [card.id]: event.target.value }))}
                    placeholder="Write what you remember—even ‘I do not know’ is useful evidence."
                    rows={4}
                  />
                  <small>{attemptState.helperText}</small>
                </label>
                <footer>
                  <Link href={`/notes/${card.slug}`}>Open source</Link>
                  <span>Again = repair · Hard = unstable · Good/Easy = move forward</span>
                  {recallGradeOptions.map((option) => (
                    <button
                      type="button"
                      onClick={() => review(card.id, option.grade, attempt)}
                      disabled={!attemptState.canGrade}
                      title={attemptState.canGrade ? option.description : attemptState.helperText}
                      key={option.grade}
                    >
                      {option.label}
                    </button>
                  ))}
                </footer>
              </article>
            );
          }) : (
            <div className={styles.compactEmpty}>
              <CheckCircle2 size={21} aria-hidden="true" />
              <div><strong>No note cards are due.</strong><p>Keep the queue clean by running the recommended SSC drill above.</p></div>
            </div>
          )}
        </div>

        <aside className={styles.repairSidebar}>
          <article className={styles.sprintCard}>
            <span className={styles.eyebrow}>{repairSprint.label}</span>
            <h2>{repairSprint.title}</h2>
            <p>{repairSprint.body}</p>
            <ol>{repairSprint.plan.map((step) => <li key={step}>{step}</li>)}</ol>
            <Link href={repairSprint.href}>{repairSprint.primaryLabel} <ArrowRight size={14} aria-hidden="true" /></Link>
          </article>

          <article className={styles.mistakeCard}>
            <div className={styles.cardTitle}><Target size={17} aria-hidden="true" /><strong>Recent repairs</strong><span>{stats.openMistakes} open</span></div>
            {recentMistakes.length > 0 ? recentMistakes.map((mistake) => (
              <Link href={`/notes/${mistake.slug}`} key={mistake.id}>
                <strong>{mistake.mistake}</strong>
                <small>{mistake.courseName || mistake.courseCode || "Study note"} · {mistake.resolvedAt ? "reviewed" : "open"}</small>
              </Link>
            )) : <p>No note mistakes have been logged yet.</p>}
          </article>
        </aside>
      </section>

      <section className={styles.momentumPanel}>
        <div className={styles.sectionHeading}>
          <div><span className={styles.eyebrow}>Study rhythm</span><h2>Keep repair work visible.</h2></div>
          <TrendingUp size={19} aria-hidden="true" />
        </div>
        <div className={styles.momentumGrid}>
          <MomentumStat icon={TimerReset} label="Today" value={`${momentum.todayMinutes} min`} />
          <MomentumStat icon={Clipboard} label="Last 7 days" value={`${momentum.weekMinutes} min`} />
          <MomentumStat icon={Gauge} label="Current streak" value={`${momentum.currentStreakDays} day${momentum.currentStreakDays === 1 ? "" : "s"}`} />
          <MomentumStat icon={Target} label="Open repair" value={`${stats.openMistakes + stats.dueCards}`} />
        </div>
        {recentAttempts.length > 0 && (
          <div className={styles.attemptStrip}>
            {recentAttempts.map((attempt) => {
              const brief = buildRevisionAttemptRepairBrief(attempt);
              return (
                <Link href={`/notes/${attempt.slug}`} key={attempt.id}>
                  <span>{formatDate(attempt.reviewedAt)} · {brief.label}</span>
                  <strong>{attempt.title}</strong>
                  <small>{brief.action}</small>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      <section className={styles.exploreSection}>
        <div className={styles.sectionHeading}>
          <div><span className={styles.eyebrow}>Build more evidence</span><h2>Question-heavy starting points.</h2></div>
        </div>
        <div className={styles.exploreGrid}>
          {suggestions.slice(0, 4).map((note) => (
            <Link href={`/notes/${note.slug}`} key={note.slug}>
              <span>{note.courseName || note.courseCode || "MITEEE"}</span>
              <strong>{note.label}</strong>
              <p>{note.excerpt}</p>
              <small>Practise this note <ArrowRight size={13} aria-hidden="true" /></small>
            </Link>
          ))}
        </div>
      </section>

      <details className={styles.dataPanel}>
        <summary><DatabaseBackup size={18} aria-hidden="true" /><span><strong>Backup learner memory</strong><small>Export, restore, or reset note-based memory.</small></span><ArrowRight size={15} aria-hidden="true" /></summary>
        <div className={styles.dataGrid}>
          <label>Export JSON<textarea readOnly value={backupText} rows={7} aria-label="Exported learner memory JSON" /></label>
          <label>Restore JSON<textarea value={importValue} onChange={(event) => setImportValue(event.target.value)} rows={7} placeholder="Paste a MITEEE learner-memory backup here" aria-label="Restore learner memory JSON" /></label>
        </div>
        <div className={styles.dataActions}>
          <button type="button" onClick={copyBackup}>Copy <Clipboard size={14} aria-hidden="true" /></button>
          <button type="button" onClick={downloadBackup}>Save file <ArrowDownToLine size={14} aria-hidden="true" /></button>
          <button type="button" onClick={restoreBackup} disabled={!importValue.trim()}>Restore <Upload size={14} aria-hidden="true" /></button>
          <button type="button" onClick={resetMemory}>Reset <Trash2 size={14} aria-hidden="true" /></button>
          {dataMessage && <span>{dataMessage}</span>}
        </div>
      </details>
    </div>
  );
}

function MomentumStat({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  return <div className={styles.momentumStat}><Icon size={17} aria-hidden="true" /><span><small>{label}</small><strong>{value}</strong></span></div>;
}
