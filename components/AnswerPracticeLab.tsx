"use client";

import Link from "next/link";
import { AlertCircle, CheckCircle2, FileText, ListChecks, Loader2, PenLine, Plus, RotateCcw, Send, Sparkles, Target } from "lucide-react";
import { useMemo, useState } from "react";
import {
  buildAnswerPracticeRepairInput,
  filterAnswerPracticePrompts,
  getAnswerPracticeLanes,
  type AnswerPracticeLane,
  type AnswerPracticePrompt
} from "@/lib/answer-practice";
import { useLearnerMemory } from "@/components/useLearnerMemory";
import { addMistake } from "@/lib/learner-memory";
import type { StudyCoachDiagnosisResponse } from "@/lib/study-coach";

type DiagnosisState = {
  loading: boolean;
  error: string | null;
  result: StudyCoachDiagnosisResponse | null;
};

function wordCount(value: string) {
  return value.trim().split(/\s+/).filter(Boolean).length;
}

export function AnswerPracticeLab({ prompts }: { prompts: AnswerPracticePrompt[] }) {
  const { updateMemory } = useLearnerMemory();
  const [selectedId, setSelectedId] = useState(prompts[0]?.id ?? "");
  const [activeLane, setActiveLane] = useState<AnswerPracticeLane>("All practice");
  const [answer, setAnswer] = useState("");
  const [diagnosis, setDiagnosis] = useState<DiagnosisState>({ loading: false, error: null, result: null });
  const [savedRepairId, setSavedRepairId] = useState<string | null>(null);
  const lanes = useMemo(() => getAnswerPracticeLanes(prompts), [prompts]);
  const visiblePrompts = useMemo(() => filterAnswerPracticePrompts(prompts, activeLane), [prompts, activeLane]);
  const selected = useMemo(() => visiblePrompts.find((prompt) => prompt.id === selectedId) ?? visiblePrompts[0] ?? prompts[0] ?? null, [prompts, selectedId, visiblePrompts]);
  const answerWords = wordCount(answer);
  const canDiagnose = Boolean(selected && answerWords >= 8 && !diagnosis.loading);

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
    setAnswer("");
    setDiagnosis({ loading: false, error: null, result: null });
    setSavedRepairId(null);
  }

  function saveRepair() {
    if (!selected || !diagnosis.result || savedRepairId) return;
    const createdAt = new Date().toISOString();
    const repair = buildAnswerPracticeRepairInput(selected, diagnosis.result, createdAt);
    updateMemory((current) => addMistake(current, repair.note, repair.mistake));
    setSavedRepairId(repair.mistake.id);
  }

  if (!selected) {
    return (
      <section className="page practice-page">
        <div className="panel answer-practice-empty">
          <AlertCircle size={22} aria-hidden="true" />
          <strong>No practice prompts found</strong>
          <p>Build the generated content index first, then come back to answer practice.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="page practice-page">
      <header className="practice-hero panel">
        <div>
          <p className="panel-kicker">Answer practice</p>
          <h1>Write, diagnose, repair.</h1>
          <p>Pick a prompt from the note index, write the answer closed-book, then get a focused weakness check and next drill.</p>
        </div>
        <div className="practice-hero-stats" aria-label="Practice prompt summary">
          <span><strong>{prompts.length}</strong><small>suggested prompts</small></span>
          <span><strong>{activeLane}</strong><small>active lane</small></span>
          <span><strong>{answerWords}</strong><small>answer words</small></span>
        </div>
      </header>

      <div className="practice-lab">
        <aside className="practice-prompt-list panel" aria-label="Suggested prompts">
          <div className="practice-panel-heading">
            <span className="home-small-icon"><Sparkles size={16} aria-hidden="true" /></span>
            <div>
              <p className="panel-kicker">Suggested from notes</p>
              <strong>Prompt queue</strong>
            </div>
          </div>

          <div className="practice-actions" aria-label="Practice lanes">
            {lanes.map((lane) => (
              <button
                className={lane === activeLane ? "button primary" : "button ghost"}
                key={lane}
                type="button"
                onClick={() => {
                  const lanePrompts = filterAnswerPracticePrompts(prompts, lane);
                  setActiveLane(lane);
                  setSelectedId(lanePrompts[0]?.id ?? prompts[0]?.id ?? "");
                  setDiagnosis({ loading: false, error: null, result: null });
                  setSavedRepairId(null);
                }}
              >
                {lane}
              </button>
            ))}
          </div>

          <div className="practice-prompt-scroll">
            {visiblePrompts.map((prompt) => (
              <button
                aria-pressed={prompt.id === selected.id}
                className={prompt.id === selected.id ? "practice-prompt-card active" : "practice-prompt-card"}
                key={prompt.id}
                type="button"
                onClick={() => {
                  setSelectedId(prompt.id);
                  setDiagnosis({ loading: false, error: null, result: null });
                  setSavedRepairId(null);
                }}
              >
                <span>{prompt.lane}</span>
                <strong>{prompt.noteLabel}</strong>
                <small>{prompt.courseName ?? prompt.courseCode ?? "Study note"} · {prompt.evidence}</small>
              </button>
            ))}
          </div>
        </aside>

        <main className="practice-workspace panel">
          <div className="practice-selected-top">
            <div className="practice-panel-heading">
              <span className="home-small-icon"><PenLine size={16} aria-hidden="true" /></span>
              <div>
                <p className="panel-kicker">{selected.focus}</p>
                <strong>{selected.noteLabel}</strong>
              </div>
            </div>
            <Link prefetch={false} className="button ghost" href={`/notes/${selected.slug}`}>
              Source <FileText size={15} aria-hidden="true" />
            </Link>
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
                <div>
                  <span><Target size={15} aria-hidden="true" /> Current prompt</span>
                  <p>{selected.prompt}</p>
                </div>
                {selected.framing ? <small>{selected.framing}</small> : null}
                <small>{selected.evidence}</small>
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
                  placeholder="Write the answer first. Keep it tight: definition or rule, working steps, conclusion."
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
                <span>{answerWords < 8 ? "Write at least 8 words." : "Ready for diagnosis."}</span>
              </div>
            </div>

            <section className="practice-diagnosis" aria-live="polite">
              <div className="practice-panel-heading">
                <span className="home-small-icon"><CheckCircle2 size={16} aria-hidden="true" /></span>
                <div>
                  <p className="panel-kicker">Diagnosis</p>
                  <strong>{diagnosis.result ? (diagnosis.result.aiAvailable ? "Mistral check" : "Local check") : "Weakness report"}</strong>
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
                    <span>{savedRepairId ? "Due now in revision." : "Adds an open mistake and revision card."}</span>
                  </div>
                </div>
              ) : (
                <div className="practice-diagnosis-placeholder">
                  <p>The diagnosis will stay grounded in the selected prompt, your answer, and the indexed note context.</p>
                  <span>No key required: the server returns the local fallback when Mistral is not configured.</span>
                </div>
              )}
            </section>
          </div>
        </main>
      </div>
    </section>
  );
}
