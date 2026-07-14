"use client";

import Link from "next/link";
import {
  AlertCircle,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  FileText,
  Layers3,
  ListChecks,
  Loader2,
  PenLine,
  Plus,
  RotateCcw,
  Send,
  SlidersHorizontal,
  Sparkles,
  Target
} from "lucide-react";
import { useMemo, useState } from "react";
import {
  buildAnswerPracticeRepairInput,
  type AnswerPracticeFocus,
  type AnswerPracticePrompt
} from "@/lib/answer-practice";
import { useLearnerMemory } from "@/components/useLearnerMemory";
import { addMistake } from "@/lib/learner-memory";
import type { StudyCoachDiagnosisResponse } from "@/lib/study-coach";
import styles from "./AnswerPracticeLab.module.css";

type DiagnosisState = {
  loading: boolean;
  error: string | null;
  result: StudyCoachDiagnosisResponse | null;
};

type PracticeSubjectId =
  | "ssc-all"
  | "ssc-quant"
  | "ssc-english"
  | "ssc-reasoning"
  | "ssc-ga"
  | "all"
  | `course:${string}`;

type PracticeTypeId = "all" | AnswerPracticeFocus;
type PracticeLengthId = "1" | "3" | "5" | "endless";

type SubjectOption = {
  id: PracticeSubjectId;
  label: string;
  count: number;
  group: "SSC CGL" | "Library";
};

const typeOptions: Array<{ id: PracticeTypeId; label: string }> = [
  { id: "all", label: "Mixed" },
  { id: "Exam answer", label: "Exam answer" },
  { id: "Derivation", label: "Formula" },
  { id: "Diagram explanation", label: "Diagram" },
  { id: "Concept recall", label: "Recall" }
];

const lengthOptions: Array<{ id: PracticeLengthId; label: string; detail: string }> = [
  { id: "1", label: "Quick", detail: "1 question" },
  { id: "3", label: "Sprint", detail: "3 questions" },
  { id: "5", label: "Session", detail: "5 questions" },
  { id: "endless", label: "Endless", detail: "Keep going" }
];

const sscSubjectLabels: Record<Exclude<PracticeSubjectId, "all" | `course:${string}`>, string> = {
  "ssc-all": "SSC CGL · All sections",
  "ssc-quant": "Quantitative Aptitude",
  "ssc-english": "English Comprehension",
  "ssc-reasoning": "General Intelligence",
  "ssc-ga": "General Awareness"
};

function wordCount(value: string) {
  return value.trim().split(/\s+/).filter(Boolean).length;
}

function isSscPrompt(prompt: AnswerPracticePrompt) {
  return prompt.slug.startsWith("ssc-cgl-") || /SSC CGL/i.test(`${prompt.courseCode ?? ""} ${prompt.courseName ?? ""}`);
}

function sscSectionForPrompt(prompt: AnswerPracticePrompt): PracticeSubjectId | null {
  if (!isSscPrompt(prompt)) return null;
  if (prompt.slug.startsWith("ssc-cgl-quant-")) return "ssc-quant";
  if (prompt.slug.startsWith("ssc-cgl-english-")) return "ssc-english";
  if (prompt.slug.startsWith("ssc-cgl-reasoning-")) return "ssc-reasoning";
  if (prompt.slug.startsWith("ssc-cgl-ga-")) return "ssc-ga";
  return "ssc-all";
}

function courseKey(prompt: AnswerPracticePrompt) {
  return prompt.courseName ?? prompt.courseCode ?? "Study library";
}

function matchesSubject(prompt: AnswerPracticePrompt, subject: PracticeSubjectId) {
  if (subject === "all") return true;
  if (subject === "ssc-all") return isSscPrompt(prompt);
  if (subject.startsWith("course:")) return courseKey(prompt) === subject.slice("course:".length);
  return sscSectionForPrompt(prompt) === subject;
}

function matchesType(prompt: AnswerPracticePrompt, type: PracticeTypeId) {
  return type === "all" || prompt.focus === type;
}

function drillLength(length: PracticeLengthId, available: number) {
  if (length === "endless") return available;
  return Math.min(Number(length), available);
}

function buildSession(
  prompts: AnswerPracticePrompt[],
  subject: PracticeSubjectId,
  type: PracticeTypeId,
  length: PracticeLengthId
) {
  const candidates = prompts.filter((prompt) => matchesSubject(prompt, subject) && matchesType(prompt, type));
  return candidates.slice(0, drillLength(length, candidates.length));
}

function getDefaultSubject(prompts: AnswerPracticePrompt[]): PracticeSubjectId {
  return prompts.some(isSscPrompt) ? "ssc-all" : "all";
}

function getSubjectOptions(prompts: AnswerPracticePrompt[]): SubjectOption[] {
  const options: SubjectOption[] = [];
  const sscPrompts = prompts.filter(isSscPrompt);

  if (sscPrompts.length > 0) {
    options.push({ id: "ssc-all", label: sscSubjectLabels["ssc-all"], count: sscPrompts.length, group: "SSC CGL" });
    for (const id of ["ssc-quant", "ssc-english", "ssc-reasoning", "ssc-ga"] as const) {
      const count = prompts.filter((prompt) => sscSectionForPrompt(prompt) === id).length;
      if (count > 0) options.push({ id, label: sscSubjectLabels[id], count, group: "SSC CGL" });
    }
  }

  options.push({ id: "all", label: "Entire study library", count: prompts.length, group: "Library" });
  const courses = new Map<string, number>();
  for (const prompt of prompts) {
    if (isSscPrompt(prompt)) continue;
    const key = courseKey(prompt);
    courses.set(key, (courses.get(key) ?? 0) + 1);
  }
  for (const [label, count] of [...courses].sort(([a], [b]) => a.localeCompare(b))) {
    options.push({ id: `course:${label}`, label, count, group: "Library" });
  }
  return options;
}

export function AnswerPracticeLab({ prompts }: { prompts: AnswerPracticePrompt[] }) {
  const { updateMemory } = useLearnerMemory();
  const defaultSubject = getDefaultSubject(prompts);
  const [subject, setSubject] = useState<PracticeSubjectId>(defaultSubject);
  const [practiceType, setPracticeType] = useState<PracticeTypeId>("all");
  const [length, setLength] = useState<PracticeLengthId>("3");
  const initialSession = useMemo(() => buildSession(prompts, defaultSubject, "all", "3"), [defaultSubject, prompts]);
  const [sessionIds, setSessionIds] = useState<string[]>(() => initialSession.map((prompt) => prompt.id));
  const [selectedId, setSelectedId] = useState(initialSession[0]?.id ?? "");
  const [answer, setAnswer] = useState("");
  const [diagnosis, setDiagnosis] = useState<DiagnosisState>({ loading: false, error: null, result: null });
  const [savedRepairId, setSavedRepairId] = useState<string | null>(null);

  const subjectOptions = useMemo(() => getSubjectOptions(prompts), [prompts]);
  const subjectLabel = subjectOptions.find((option) => option.id === subject)?.label ?? "Study library";
  const candidates = useMemo(
    () => prompts.filter((prompt) => matchesSubject(prompt, subject) && matchesType(prompt, practiceType)),
    [practiceType, prompts, subject]
  );
  const promptById = useMemo(() => new Map(prompts.map((prompt) => [prompt.id, prompt])), [prompts]);
  const sessionPrompts = useMemo(
    () => sessionIds.map((id) => promptById.get(id)).filter((prompt): prompt is AnswerPracticePrompt => Boolean(prompt)),
    [promptById, sessionIds]
  );
  const selected = sessionPrompts.find((prompt) => prompt.id === selectedId) ?? sessionPrompts[0] ?? null;
  const recommended = candidates[0] ?? null;
  const answerWords = wordCount(answer);
  const canDiagnose = Boolean(selected && answerWords >= 8 && !diagnosis.loading);
  const activeQuestionIndex = selected ? Math.max(0, sessionPrompts.findIndex((prompt) => prompt.id === selected.id)) : 0;
  const sessionProgress = sessionPrompts.length > 0 ? ((activeQuestionIndex + 1) / sessionPrompts.length) * 100 : 0;
  const sscPromptCount = prompts.filter(isSscPrompt).length;

  function clearAttempt() {
    setAnswer("");
    setDiagnosis({ loading: false, error: null, result: null });
    setSavedRepairId(null);
  }

  function activatePrompt(id: string) {
    setSelectedId(id);
    clearAttempt();
  }

  function startConfiguredDrill() {
    const nextSession = buildSession(prompts, subject, practiceType, length);
    setSessionIds(nextSession.map((prompt) => prompt.id));
    setSelectedId(nextSession[0]?.id ?? "");
    clearAttempt();
  }

  function resetFilters() {
    const nextSubject = getDefaultSubject(prompts);
    setSubject(nextSubject);
    setPracticeType("all");
    setLength("3");
    const nextSession = buildSession(prompts, nextSubject, "all", "3");
    setSessionIds(nextSession.map((prompt) => prompt.id));
    setSelectedId(nextSession[0]?.id ?? "");
    clearAttempt();
  }

  function moveQuestion(direction: -1 | 1) {
    if (sessionPrompts.length === 0) return;
    const nextIndex = activeQuestionIndex + direction;
    if (nextIndex < 0 || nextIndex >= sessionPrompts.length) return;
    activatePrompt(sessionPrompts[nextIndex]!.id);
  }

  async function requestDiagnosis() {
    if (!selected || !canDiagnose) return;
    setDiagnosis({ loading: true, error: null, result: null });

    try {
      const response = await fetch("/api/study-coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requestType: "diagnose",
          prompt: selected.prompt,
          userAnswer: answer,
          sourceContext: selected.sourceContext,
          noteLabel: selected.noteLabel,
          courseName: selected.courseName ?? selected.courseCode ?? undefined
        })
      });

      if (!response.ok) throw new Error(`Study coach returned ${response.status}.`);
      const payload = await response.json() as StudyCoachDiagnosisResponse;
      if (payload.responseType !== "diagnosis") throw new Error("Study coach returned an unexpected response.");
      setDiagnosis({ loading: false, error: null, result: payload });
      setSavedRepairId(null);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Could not diagnose this answer.";
      setDiagnosis({ loading: false, error: message, result: null });
      setSavedRepairId(null);
    }
  }

  function resetAttempt() {
    clearAttempt();
  }

  function saveRepair() {
    if (!selected || !diagnosis.result || savedRepairId) return;
    const createdAt = new Date().toISOString();
    const repair = buildAnswerPracticeRepairInput(selected, diagnosis.result, createdAt);
    updateMemory((current) => addMistake(current, repair.note, repair.mistake));
    setSavedRepairId(repair.mistake.id);
  }

  if (prompts.length === 0) {
    return (
      <section className={`${styles.practice} page practice-page`} data-shell-full-bleed="true">
        <div className={`${styles.emptyPage} panel answer-practice-empty`}>
          <span className={styles.emptyIcon}><AlertCircle size={24} aria-hidden="true" /></span>
          <p className="panel-kicker">Practice workspace</p>
          <h1>No drills are indexed yet.</h1>
          <p>Open the library to check your study notes, or start an SSC mock while the drill index is being prepared.</p>
          <div className={styles.emptyActions}>
            <Link className="button primary" href="/library">Open library</Link>
            <Link className="button ghost" href="/exams/ssc-cgl/tests">Start SSC mock</Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={`${styles.practice} page practice-page`} data-shell-full-bleed="true">
      <header className="practice-hero panel">
        <div className={styles.heroCopy}>
          <p className="panel-kicker">SSC-first drill workspace</p>
          <h1>Practice with intent.</h1>
          <p>Choose a short drill, answer closed-book, and leave with one specific repair for the next attempt.</p>
          <div className={styles.heroLinks}>
            <Link href="/exams/ssc-cgl/tests">Full SSC mocks <ArrowRight size={15} aria-hidden="true" /></Link>
            <Link href="/exams/ssc-cgl/practice">Topic MCQs <ArrowRight size={15} aria-hidden="true" /></Link>
          </div>
        </div>
        <div className="practice-hero-stats" aria-label="Practice prompt summary">
          <span><strong>{sscPromptCount}</strong><small>SSC drills</small></span>
          <span><strong>{sessionPrompts.length || "—"}</strong><small>active queue</small></span>
          <span><strong>{answerWords}</strong><small>answer words</small></span>
        </div>
      </header>

      <div className={styles.launchGrid}>
        <section className={styles.recommendedCard} aria-labelledby="recommended-drill-title">
          <div className={styles.cardEyebrow}>
            <span><Sparkles size={15} aria-hidden="true" /> Recommended drill</span>
            <small>{subjectLabel}</small>
          </div>
          {recommended ? (
            <>
              <div className={styles.recommendedCopy}>
                <p>{recommended.focus}</p>
                <h2 id="recommended-drill-title">{recommended.noteLabel}</h2>
                <span>{recommended.prompt}</span>
              </div>
              <div className={styles.recommendedMeta}>
                <span><BookOpen size={15} aria-hidden="true" /> {recommended.courseName ?? recommended.courseCode ?? "Study note"}</span>
                <span><Layers3 size={15} aria-hidden="true" /> {recommended.evidence}</span>
              </div>
              <button className={styles.primaryAction} type="button" onClick={startConfiguredDrill}>
                Start recommended <ArrowRight size={16} aria-hidden="true" />
              </button>
            </>
          ) : (
            <div className={styles.filterEmpty}>
              <AlertCircle size={20} aria-hidden="true" />
              <div>
                <h2 id="recommended-drill-title">No drill matches this setup.</h2>
                <p>Switch the drill type or return to the full SSC mix.</p>
              </div>
              <button type="button" onClick={resetFilters}>Reset filters</button>
            </div>
          )}
        </section>

        <section className={styles.selectorCard} aria-labelledby="build-drill-title">
          <div className={styles.selectorHeading}>
            <span><SlidersHorizontal size={16} aria-hidden="true" /></span>
            <div>
              <p className="panel-kicker">Compact selector</p>
              <h2 id="build-drill-title">Build your drill</h2>
            </div>
          </div>

          <label className={styles.subjectSelect}>
            <span>Subject</span>
            <select value={subject} onChange={(event) => setSubject(event.target.value as PracticeSubjectId)}>
              {(["SSC CGL", "Library"] as const).map((group) => (
                <optgroup key={group} label={group}>
                  {subjectOptions.filter((option) => option.group === group).map((option) => (
                    <option key={option.id} value={option.id}>{option.label} · {option.count}</option>
                  ))}
                </optgroup>
              ))}
            </select>
          </label>

          <fieldset className={styles.modeFieldset}>
            <legend>Drill type</legend>
            <div className={styles.modeGrid}>
              {typeOptions.map((option) => (
                <button
                  aria-pressed={practiceType === option.id}
                  key={option.id}
                  type="button"
                  onClick={() => setPracticeType(option.id)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset className={styles.modeFieldset}>
            <legend>Length</legend>
            <div className={styles.lengthGrid}>
              {lengthOptions.map((option) => (
                <button
                  aria-pressed={length === option.id}
                  key={option.id}
                  type="button"
                  onClick={() => setLength(option.id)}
                >
                  <strong>{option.label}</strong>
                  <small>{option.detail}</small>
                </button>
              ))}
            </div>
          </fieldset>

          <div className={styles.selectorFooter}>
            <span>{candidates.length} matching {candidates.length === 1 ? "drill" : "drills"}</span>
            <button type="button" onClick={startConfiguredDrill} disabled={candidates.length === 0}>
              Build this drill <ArrowRight size={15} aria-hidden="true" />
            </button>
          </div>
        </section>
      </div>

      {selected ? (
        <main className="practice-workspace panel">
          <div className={styles.workspaceTop}>
            <div className="practice-panel-heading">
              <span className={styles.workspaceIcon}><PenLine size={16} aria-hidden="true" /></span>
              <div>
                <p className="panel-kicker">Active question</p>
                <strong>Question {activeQuestionIndex + 1} of {sessionPrompts.length}</strong>
              </div>
            </div>
            <div className={styles.queueActions}>
              <label>
                <span>Question queue</span>
                <select value={selected.id} onChange={(event) => activatePrompt(event.target.value)}>
                  {sessionPrompts.map((prompt, index) => (
                    <option key={prompt.id} value={prompt.id}>{index + 1}. {prompt.noteLabel}</option>
                  ))}
                </select>
              </label>
              <Link prefetch={false} className="button ghost" href={`/notes/${selected.slug}`}>
                Source <FileText size={15} aria-hidden="true" />
              </Link>
            </div>
          </div>

          <div className={styles.progressTrack} aria-label={`Question ${activeQuestionIndex + 1} of ${sessionPrompts.length}`}>
            <span style={{ width: `${sessionProgress}%` }} />
          </div>

          <div className="practice-step-strip" aria-label="Answer practice workflow">
            <span className="active"><strong>1</strong> Pick prompt</span>
            <span className={answerWords > 0 ? "active" : ""}><strong>2</strong> Write answer</span>
            <span className={diagnosis.result || diagnosis.loading ? "active" : ""}><strong>3</strong> Diagnose</span>
            <span className={savedRepairId ? "active" : ""}><strong>4</strong> Save repair</span>
          </div>

          <div className="practice-primary-grid">
            <div className="practice-answer-flow">
              <div className="practice-question">
                <div className={styles.questionHeading}>
                  <span><Target size={15} aria-hidden="true" /> Current prompt</span>
                  <small>{selected.focus}</small>
                </div>
                <p>{selected.prompt}</p>
                {selected.framing ? <small>{selected.framing}</small> : null}
                <div className={styles.questionEvidence}>
                  <span>{selected.courseName ?? selected.courseCode ?? "Study note"}</span>
                  <span>{selected.evidence}</span>
                </div>
              </div>

              <label className="practice-answer-box">
                <span>Your answer</span>
                <textarea
                  value={answer}
                  onChange={(event) => {
                    setAnswer(event.target.value);
                    if (diagnosis.result || diagnosis.error) setDiagnosis({ loading: false, error: null, result: null });
                    if (savedRepairId) setSavedRepairId(null);
                  }}
                  placeholder="Write from memory. Lead with the rule or idea, show the key steps, then close with a clear conclusion."
                />
              </label>

              <div className="practice-actions practice-submit-row">
                <button className="button primary" type="button" onClick={requestDiagnosis} disabled={!canDiagnose}>
                  {diagnosis.loading ? <Loader2 className="practice-spin" size={15} aria-hidden="true" /> : <Send size={15} aria-hidden="true" />}
                  Diagnose answer
                </button>
                <button className="button ghost" type="button" onClick={resetAttempt}>
                  <RotateCcw size={15} aria-hidden="true" />
                  Reset
                </button>
                <span>{answerWords < 8 ? `${answerWords}/8 words to unlock diagnosis` : `${answerWords} words · ready to diagnose`}</span>
              </div>

              <div className={styles.questionNav}>
                <button type="button" onClick={() => moveQuestion(-1)} disabled={activeQuestionIndex === 0}>
                  <ChevronLeft size={16} aria-hidden="true" /> Previous
                </button>
                <span>{subjectLabel}</span>
                <button type="button" onClick={() => moveQuestion(1)} disabled={activeQuestionIndex >= sessionPrompts.length - 1}>
                  Next <ChevronRight size={16} aria-hidden="true" />
                </button>
              </div>
            </div>

            <section className="practice-diagnosis" aria-live="polite">
              <div className="practice-panel-heading">
                <span className={styles.workspaceIcon}><CheckCircle2 size={16} aria-hidden="true" /></span>
                <div>
                  <p className="panel-kicker">Diagnosis</p>
                  <strong>{diagnosis.result ? (diagnosis.result.aiAvailable ? "Coach check" : "Local check") : "Your repair brief"}</strong>
                </div>
              </div>

              {diagnosis.error ? <p className="coach-error">{diagnosis.error}</p> : null}

              {diagnosis.result ? (
                <div className="practice-diagnosis-result">
                  <p>{diagnosis.result.message}</p>
                  <div className="practice-next-drill">
                    <span><ListChecks size={14} aria-hidden="true" /> Next drill</span>
                    <strong>{diagnosis.result.diagnosis.nextDrill}</strong>
                  </div>
                  <div className="practice-feedback-grid">
                    <div>
                      <span>Strength</span>
                      <ul>{diagnosis.result.diagnosis.strengths.map((item) => <li key={item}>{item}</li>)}</ul>
                    </div>
                    <div>
                      <span>Weaknesses</span>
                      <ul>{diagnosis.result.diagnosis.weaknesses.map((item) => <li key={item}>{item}</li>)}</ul>
                    </div>
                  </div>
                  <div className="practice-save-row">
                    <button className={savedRepairId ? "button ghost" : "button primary"} type="button" onClick={saveRepair} disabled={Boolean(savedRepairId)}>
                      {savedRepairId ? <CheckCircle2 size={15} aria-hidden="true" /> : <Plus size={15} aria-hidden="true" />}
                      {savedRepairId ? "Saved to revision" : "Save repair"}
                    </button>
                    <span>{savedRepairId ? "Due now in revision." : "Adds this weakness and next drill to revision."}</span>
                  </div>
                </div>
              ) : (
                <div className="practice-diagnosis-placeholder">
                  <span className={styles.diagnosisIcon}><Clock3 size={20} aria-hidden="true" /></span>
                  <strong>Your feedback will appear here.</strong>
                  <p>Write at least eight words, then diagnose to see what worked, what is missing, and the best next drill.</p>
                  <ol className={styles.diagnosisSteps}>
                    <li><span>1</span> Answer without opening the source.</li>
                    <li><span>2</span> Diagnose the structure and concepts.</li>
                    <li><span>3</span> Save one repair for revision.</li>
                  </ol>
                </div>
              )}
            </section>
          </div>
        </main>
      ) : (
        <section className={styles.workspaceEmpty} aria-live="polite">
          <AlertCircle size={22} aria-hidden="true" />
          <div>
            <h2>Your question workspace is empty.</h2>
            <p>Reset the filters or choose a setup with at least one indexed drill.</p>
          </div>
          <button type="button" onClick={resetFilters}>Restore SSC mix</button>
        </section>
      )}
    </section>
  );
}
