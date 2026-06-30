"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowDownToLine, ArrowRight, BookOpenCheck, BrainCircuit, CheckCircle2, Clipboard, DatabaseBackup, Flame, ListTodo, RotateCcw, Sigma, Target, TimerReset, Trash2, Upload } from "lucide-react";
import { buildLearnerMemoryBackup, buildLearnerWeaknessInsight, createEmptyLearnerMemory, getDueRevisionCards, getLearnerMemoryStats, getStudyMomentum, getStudyNudge, restoreLearnerMemoryBackup, reviewRevisionCardWithAttempt, type RecallGrade } from "@/lib/learner-memory";
import { recallGradeOptions } from "@/lib/recall-grades";
import { buildRecallAttemptState } from "@/lib/revision-attempt";
import { buildRevisionAttemptRepairBrief, buildRevisionRepairSprint } from "@/lib/revision-repair";
import type { NotePreview } from "@/lib/content";
import { useLearnerMemory } from "@/components/useLearnerMemory";

function formatDate(value: string | null | undefined) {
  if (!value) return "Not reviewed";
  return new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "short" }).format(new Date(value));
}

export function RevisionDashboard({ suggestions }: { suggestions: NotePreview[] }) {
  const { memory, updateMemory } = useLearnerMemory();
  const now = new Date().toISOString();
  const dueCards = getDueRevisionCards(memory, now);
  const stats = getLearnerMemoryStats(memory, now);
  const momentum = getStudyMomentum(memory, now, 7);
  const studyNudge = getStudyNudge(memory, now);
  const weaknessInsight = buildLearnerWeaknessInsight(memory, now);
  const repairSprint = buildRevisionRepairSprint(memory, now);
  const recentMistakes = memory.mistakes.slice(0, 6);
  const recentAttempts = memory.revisionAttempts.slice(0, 4);
  const [importValue, setImportValue] = useState("");
  const [dataMessage, setDataMessage] = useState<string | null>(null);
  const [recallAttempts, setRecallAttempts] = useState<Record<string, string>>({});
  const backupText = buildLearnerMemoryBackup(memory, now);

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
    <div className="page revision-page">
      <section className="revision-hero">
        <div>
          <span className="micro-label">Revision queue</span>
          <h1>Fix the things that are actually weak.</h1>
          <p className="section-copy">This is local learner memory: notes read, mistakes logged, and due recall cards. Nothing needs an account.</p>
        </div>
        <div className="revision-stat-grid">
          <RevisionStat icon={BookOpenCheck} label="Read notes" value={stats.readNotes} />
          <RevisionStat icon={Sigma} label="Open mistakes" value={stats.openMistakes} />
          <RevisionStat icon={RotateCcw} label="Due cards" value={stats.dueCards} />
          <RevisionStat icon={Clipboard} label="Study minutes" value={stats.completedStudyMinutes} />
        </div>
      </section>

      <section className="revision-layout">
        <div className="revision-main-panel">
          <div className="section-header">
            <div>
              <span className="micro-label">Due now</span>
              <h2 className="section-title">Recall before reading.</h2>
            </div>
            <ListTodo size={20} aria-hidden="true" />
          </div>

          <div className={`study-nudge kind-${weaknessInsight.hasSignals ? "attempt-repair" : "start"}`} aria-label="Weakness insight">
            <span className="micro-label">Weakness insight</span>
            <strong>
              {weaknessInsight.topCourse
                ? `${weaknessInsight.topCourse.label} needs the most repair.`
                : "No weak pattern recorded yet."}
            </strong>
            <p>{weaknessInsight.nextAction}</p>
            {weaknessInsight.topTheme && <small>Recurring theme: {weaknessInsight.topTheme.theme} · {weaknessInsight.topTheme.count} signal{weaknessInsight.topTheme.count === 1 ? "" : "s"}</small>}
          </div>

          <article className={`repair-sprint-card kind-${repairSprint.kind}`} aria-label="Repair sprint priority">
            <div className="repair-sprint-heading">
              <span className="home-small-icon"><Target size={17} aria-hidden="true" /></span>
              <div>
                <span className="micro-label">{repairSprint.label}</span>
                <h3>{repairSprint.title}</h3>
              </div>
              <Link prefetch={false} className="button primary" href={repairSprint.href}>{repairSprint.primaryLabel} <ArrowRight size={15} aria-hidden="true" /></Link>
            </div>
            <p>{repairSprint.body}</p>
            <small>{repairSprint.focus}</small>
            <ol className="repair-sprint-plan">
              {repairSprint.plan.map((step) => <li key={step}>{step}</li>)}
            </ol>
            <div className="repair-grade-hint" aria-label="Recall grading guide">
              <strong>Grade meaning</strong>
              <span>{repairSprint.gradingHint}</span>
            </div>
          </article>

          <div className="revision-card-list">
            {dueCards.length > 0 ? dueCards.map((card) => {
              const attempt = recallAttempts[card.id] ?? "";
              const attemptState = buildRecallAttemptState(attempt);

              return (
                <article className={`revision-card source-${card.source}`} key={card.id}>
                  <div>
                    <span className="revision-source">{card.source === "mistake" ? "Mistake repair" : "Note recall"}</span>
                    <h3>{card.title}</h3>
                    <p>{card.prompt}</p>
                    <small>{card.courseName || card.courseCode || "Study note"} · due {formatDate(card.dueAt)}</small>
                  </div>

                  <label className="recall-attempt-box">
                    <span>My recall attempt</span>
                    <textarea
                      value={attempt}
                      onChange={(event) => setRecallAttempts((current) => ({ ...current, [card.id]: event.target.value }))}
                      placeholder="Answer from memory first. A rough attempt or 'I do not know' counts."
                      rows={4}
                    />
                    <small>{attemptState.helperText}</small>
                  </label>

                  <div className="revision-card-actions">
                    <Link prefetch={false} className="button ghost" href={`/notes/${card.slug}`}>Open note <ArrowRight size={15} aria-hidden="true" /></Link>
                    <span className="revision-grade-guide">Again = repair · Hard = unstable · Good/Easy = move forward</span>
                    {recallGradeOptions.map((option) => (
                      <button
                        className={option.emphasis === "primary" ? "button primary" : `button ghost recall-grade-${option.grade}`}
                        type="button"
                        onClick={() => review(card.id, option.grade, attempt)}
                        title={attemptState.canGrade ? option.description : attemptState.helperText}
                        disabled={!attemptState.canGrade}
                        key={option.grade}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </article>
              );
            }) : (
              <div className="revision-empty">
                <BrainCircuit size={28} aria-hidden="true" />
                <strong>No cards due yet.</strong>
                <p>Mark notes as read or add a mistake from any note page. Until then, start with a question-heavy page below.</p>
              </div>
            )}
          </div>
        </div>

        <aside className="revision-side-panel">
          <div className="section-header">
            <div>
              <span className="micro-label">Mistake book</span>
              <h2 className="section-title">Recent repairs.</h2>
            </div>
            <CheckCircle2 size={19} aria-hidden="true" />
          </div>
          <div className="mistake-list">
            {weaknessInsight.courseInsights.length > 0 && (
              <div className="attempt-history" aria-label="Course weakness ranking">
                <span className="micro-label">Weak courses</span>
                {weaknessInsight.courseInsights.map((course) => (
                  <div className="attempt-row tone-repair" key={`${course.courseCode ?? course.label}:weakness`}>
                    <span>{course.score} pressure points</span>
                    <strong>{course.label}</strong>
                    <p>{course.openMistakes} open · {course.weakAttempts} weak attempts · {course.dueCards} due</p>
                  </div>
                ))}
              </div>
            )}
            {recentMistakes.length > 0 ? recentMistakes.map((mistake) => (
              <Link prefetch={false} className="mistake-row" href={`/notes/${mistake.slug}`} key={mistake.id}>
                <strong>{mistake.mistake}</strong>
                <span>{mistake.correction}</span>
                {mistake.catchQuestion && <span>Catch: {mistake.catchQuestion}</span>}
                <small>{mistake.courseName || mistake.courseCode || "Study note"} · {mistake.resolvedAt ? "reviewed" : "open"}</small>
              </Link>
            )) : <p className="memory-empty">Mistakes you log from notes will appear here.</p>}
          </div>
        </aside>
      </section>

      <section className="revision-momentum-panel">
        <div className="section-header">
          <div>
            <span className="micro-label">Study momentum</span>
            <h2 className="section-title">Blocks completed this week.</h2>
          </div>
          <Flame size={20} aria-hidden="true" />
        </div>

        <div className="momentum-grid">
          <MomentumStat icon={TimerReset} label="Today" value={`${momentum.todayMinutes} min`} />
          <MomentumStat icon={Clipboard} label="7 days" value={`${momentum.weekMinutes} min`} />
          <MomentumStat icon={Flame} label="Streak" value={`${momentum.currentStreakDays} day${momentum.currentStreakDays === 1 ? "" : "s"}`} />
          <div className="momentum-methods" aria-label="Study method mix">
            {Object.entries(momentum.methodMinutes).map(([method, minutes]) => (
              <span key={method}><strong>{minutes}</strong>{method.replace("-", " ")}</span>
            ))}
          </div>
        </div>

        <Link prefetch={false} className={`study-nudge kind-${studyNudge.kind}`} href={studyNudge.href}>
          <span className="micro-label">Next move</span>
          <strong>{studyNudge.title}</strong>
          <p>{studyNudge.body}</p>
        </Link>

        <div className="activity-list">
          {momentum.recentActivity.length > 0 ? momentum.recentActivity.slice(0, 5).map((activity) => (
            <Link prefetch={false} className="activity-row" href={activity.note ? `/notes/${activity.note.slug}` : "/"} key={activity.id}>
              <span>{formatDate(activity.completedAt)}</span>
              <strong>{activity.title}</strong>
              <small>{activity.minutes} min · {activity.method.replace("-", " ")}{activity.note ? ` · ${activity.note.title}` : ""}</small>
            </Link>
          )) : <p className="memory-empty">Complete Study Today blocks to build a visible momentum trail.</p>}
        </div>

        <div className="attempt-history" aria-label="Recent recall attempts">
          <span className="micro-label">Recent attempts</span>
          {recentAttempts.length > 0 ? recentAttempts.map((attempt) => {
            const brief = buildRevisionAttemptRepairBrief(attempt);

            return (
              <Link prefetch={false} className={`attempt-row tone-${brief.tone} grade-${attempt.grade}`} href={`/notes/${attempt.slug}`} key={attempt.id}>
                <span>{formatDate(attempt.reviewedAt)} · {attempt.grade} · {brief.label}</span>
                <strong>{attempt.title}</strong>
                <p>{attempt.attempt}</p>
                <em>{brief.action}</em>
                <small>{brief.check}</small>
              </Link>
            );
          }) : <p className="memory-empty">Graded recall attempts will appear here after you write and score them.</p>}
        </div>
      </section>

      <section className="revision-data-panel">
        <div className="section-header">
          <div>
            <span className="micro-label">Data safety</span>
            <h2 className="section-title">Backup learner memory.</h2>
          </div>
          <DatabaseBackup size={20} aria-hidden="true" />
        </div>
        <div className="revision-data-grid">
          <div className="data-export-box">
            <label>
              Export JSON
              <textarea readOnly value={backupText} rows={8} aria-label="Exported learner memory JSON" />
            </label>
            <div className="data-action-row">
              <button className="button primary" type="button" onClick={copyBackup}>Copy <Clipboard size={15} aria-hidden="true" /></button>
              <button className="button ghost" type="button" onClick={downloadBackup}>Download <ArrowDownToLine size={15} aria-hidden="true" /></button>
            </div>
          </div>
          <div className="data-import-box">
            <label>
              Restore JSON
              <textarea value={importValue} onChange={(event) => setImportValue(event.target.value)} rows={8} placeholder="Paste a MITEEE learner-memory backup here" aria-label="Restore learner memory JSON" />
            </label>
            <div className="data-action-row">
              <button className="button primary" type="button" onClick={restoreBackup} disabled={!importValue.trim()}>Restore <Upload size={15} aria-hidden="true" /></button>
              <button className="button ghost" type="button" onClick={resetMemory}>Reset <Trash2 size={15} aria-hidden="true" /></button>
            </div>
            {dataMessage && <p className="data-message">{dataMessage}</p>}
          </div>
        </div>
      </section>

      <section className="revision-suggestions">
        <div className="section-header">
          <div>
            <span className="micro-label">Seed the queue</span>
            <h2 className="section-title">Question-heavy starting points.</h2>
          </div>
        </div>
        <div className="revision-suggestion-grid">
          {suggestions.slice(0, 6).map((note) => (
            <Link prefetch={false} className="revision-suggestion-card" key={note.slug} href={`/notes/${note.slug}`}>
              <strong>{note.label}</strong>
              <p>{note.excerpt}</p>
              <span>{note.courseName || note.courseCode || "MITEEE"} · {note.stats.questionBlocks} questions</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

function RevisionStat({ icon: Icon, label, value }: { icon: typeof BookOpenCheck; label: string; value: number }) {
  return (
    <div className="revision-stat">
      <span><Icon size={17} aria-hidden="true" /> {label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function MomentumStat({ icon: Icon, label, value }: { icon: typeof BookOpenCheck; label: string; value: string }) {
  return (
    <div className="momentum-stat">
      <span><Icon size={16} aria-hidden="true" /> {label}</span>
      <strong>{value}</strong>
    </div>
  );
}
