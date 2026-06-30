"use client";

import Link from "next/link";
import { AlertTriangle, ArrowRight, Brain, Check, Clock3, ExternalLink, ListChecks, RotateCcw, Sparkles, TimerReset } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useLearnerMemory } from "@/components/useLearnerMemory";
import { buildLearnerMemoryPriority, buildLearnerWeaknessInsight, getStudyMethodBalance, getStudyNudge, removeStudyTaskCompletion } from "@/lib/learner-memory";
import { buildMemoryAwareStudyTodayPlan } from "@/lib/study-plan-personalization";
import { buildStudyTodayDiagnosisRepairInput, completeStudyTodayTask, logStudyTodayDiagnosisRepairOutcome, logStudyTodayRepairOutcome, resetStudyTodayTasks } from "@/lib/study-today-memory";
import { buildChecklistProgressLabel, parseStudyTodayProgressState, serializeStudyTodayProgress, studyTodayDayKey, studyTodayProgressStorageKey, type StudyTodayRepairDraft } from "@/lib/study-today-progress";
import type { StudyCoachPlanRequest, StudyCoachProviderStatus, StudyCoachResponse } from "@/lib/study-coach";
import type { StudyTodayPlan } from "@/lib/study-system";

const methodLabels: Record<StudyTodayPlan["tasks"][number]["method"], string> = {
  retrieval: "Practice testing",
  spacing: "Distributed practice",
  interleaving: "Interleaving",
  "self-explanation": "Self-explanation"
};

function checklistItemProgressId(taskId: string, index: number) {
  return `${taskId}:checklist:${index}`;
}

function repairOutcomeId(taskId: string, completedAt: string) {
  return `study-repair:${completedAt.slice(0, 10)}:${taskId}`;
}

function diagnosisRepairOutcomeId(taskId: string, savedAt: string) {
  return `coach-diagnosis:${savedAt.replace(/[:.]/g, "-")}:${taskId}`;
}

type RepairFormState = {
  missed: string;
  correction: string;
  catchQuestion: string;
  savedAt: string | null;
};

type RepairFormField = "missed" | "correction" | "catchQuestion";
type CoachTool = "plan" | "diagnose";

function emptyRepairForm(): RepairFormState {
  return {
    missed: "",
    correction: "",
    catchQuestion: "",
    savedAt: null
  };
}

export function StudyToday({ plan }: { plan: StudyTodayPlan }) {
  const { memory, updateMemory } = useLearnerMemory();
  const [completed, setCompleted] = useState<string[]>([]);
  const [completedChecklistItems, setCompletedChecklistItems] = useState<string[]>([]);
  const [repairForms, setRepairForms] = useState<Record<string, RepairFormState>>({});
  const [progressDayKey, setProgressDayKey] = useState<string | null>(null);
  const [memoryTimestamp, setMemoryTimestamp] = useState("1970-01-01T00:00:00.000Z");
  const memoryPriority = useMemo(() => buildLearnerMemoryPriority(memory, memoryTimestamp, 2), [memory, memoryTimestamp]);
  const weaknessInsight = useMemo(() => buildLearnerWeaknessInsight(memory, memoryTimestamp, 3), [memory, memoryTimestamp]);
  const defaultCoachMode = weaknessInsight.hasSignals ? "weakness-repair" : "balanced";
  const [coachModeOverride, setCoachModeOverride] = useState<StudyCoachPlanRequest["mode"] | null>(null);
  const selectedCoachMode = coachModeOverride ?? defaultCoachMode;
  const [minutes, setMinutes] = useState<StudyCoachPlanRequest["minutes"]>(90);
  const [coachTool, setCoachTool] = useState<CoachTool>("plan");
  const [diagnosisPrompt, setDiagnosisPrompt] = useState("");
  const [diagnosisSource, setDiagnosisSource] = useState("");
  const [diagnosisAnswer, setDiagnosisAnswer] = useState("");
  const [coach, setCoach] = useState<StudyCoachResponse | null>(null);
  const [savedDiagnosisRepairAt, setSavedDiagnosisRepairAt] = useState<string | null>(null);
  const [providerStatus, setProviderStatus] = useState<StudyCoachProviderStatus | null>(null);
  const [isLoadingCoach, setIsLoadingCoach] = useState(false);
  const [coachError, setCoachError] = useState<string | null>(null);
  const hasLoadedStoredProgress = useRef(false);

  useEffect(() => {
    let cancelled = false;
    queueMicrotask(() => {
      if (!cancelled) setMemoryTimestamp(new Date().toISOString());
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    queueMicrotask(() => {
      if (cancelled) return;
      hasLoadedStoredProgress.current = true;
      const dayKey = studyTodayDayKey(new Date());
      setProgressDayKey(dayKey);
      try {
        const storedProgress = parseStudyTodayProgressState(window.localStorage.getItem(studyTodayProgressStorageKey(dayKey)), dayKey);
        setCompleted(storedProgress.completedTaskIds);
        setCompletedChecklistItems(storedProgress.completedChecklistItemIds);
        setRepairForms(Object.fromEntries(Object.entries(storedProgress.repairDrafts).map(([taskId, draft]) => [taskId, { ...draft, savedAt: null }])));
      } catch {
        setCompleted([]);
        setCompletedChecklistItems([]);
        setRepairForms({});
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    queueMicrotask(() => {
      fetch("/api/study-coach")
        .then((response) => response.ok ? response.json() : null)
        .then((payload: StudyCoachProviderStatus | null) => {
          if (!cancelled && payload) setProviderStatus(payload);
        })
        .catch(() => {
          if (!cancelled) {
            setProviderStatus({
              aiAvailable: false,
              model: null,
              provider: "local",
              label: "Local fallback ready"
            });
          }
        });
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const completedSet = useMemo(() => new Set(completed), [completed]);
  const completedChecklistSet = useMemo(() => new Set(completedChecklistItems), [completedChecklistItems]);
  const repairDraftsToPersist = useMemo(() => Object.fromEntries(
    Object.entries(repairForms)
      .filter(([, draft]) => !draft.savedAt && (draft.missed.trim() || draft.correction.trim() || draft.catchQuestion.trim()))
      .map(([taskId, draft]): [string, StudyTodayRepairDraft] => [taskId, {
        missed: draft.missed,
        correction: draft.correction,
        catchQuestion: draft.catchQuestion
      }])
  ), [repairForms]);
  const methodBalance = useMemo(() => getStudyMethodBalance(memory, memoryTimestamp, 7), [memory, memoryTimestamp]);
  const studyNudge = useMemo(() => getStudyNudge(memory, memoryTimestamp), [memory, memoryTimestamp]);
  const activePlan = useMemo(() => buildMemoryAwareStudyTodayPlan(plan, memoryPriority), [plan, memoryPriority]);
  const hasMemoryPriority = memoryPriority.summary.dueCards > 0 || memoryPriority.summary.openMistakes > 0 || memoryPriority.summary.weakRevisionAttempts > 0;
  const coachTaskProgress = useMemo(() => activePlan.tasks.flatMap((task) => {
    if (!task.checklist || task.checklist.length === 0) return [];
    const label = buildChecklistProgressLabel(task.id, task.checklist.length, completedChecklistItems);
    if (!label) return [];
    return [{
      taskId: task.id,
      title: task.title,
      completedChecklistItems: task.checklist.filter((_, index) => completedChecklistSet.has(checklistItemProgressId(task.id, index))).length,
      totalChecklistItems: task.checklist.length,
      label
    }];
  }), [activePlan.tasks, completedChecklistItems, completedChecklistSet]);
  const coachMemoryContext = useMemo(() => ({
    dueCards: memoryPriority.dueCards.map((card) => ({
      source: card.source,
      title: card.title,
      prompt: card.prompt,
      courseCode: card.courseCode,
      courseName: card.courseName
    })),
    openMistakes: memoryPriority.openMistakes.map((mistake) => ({
      title: mistake.title,
      mistake: mistake.mistake,
      correction: mistake.correction,
      catchQuestion: mistake.catchQuestion,
      courseCode: mistake.courseCode,
      courseName: mistake.courseName
    })),
    weakAttempts: memoryPriority.weakAttempts.map((attempt) => ({
      title: attempt.title,
      prompt: attempt.prompt,
      attempt: attempt.attempt,
      grade: attempt.grade,
      courseCode: attempt.courseCode,
      courseName: attempt.courseName
    })),
    summary: {
      dueCards: memoryPriority.summary.dueCards,
      openMistakes: memoryPriority.summary.openMistakes,
      weakRevisionAttempts: memoryPriority.summary.weakRevisionAttempts,
      readNotes: memoryPriority.summary.readNotes
    },
    weaknessInsight
  }), [memoryPriority, weaknessInsight]);
  const primaryDueCard = memoryPriority.dueCards[0] ?? null;
  const latestMistake = memoryPriority.openMistakes[0] ?? null;
  const latestWeakAttempt = memoryPriority.weakAttempts[0] ?? null;
  const firstOpenTask = activePlan.tasks.find((task) => !completedSet.has(task.id)) ?? activePlan.tasks[0] ?? null;
  const diagnosisRepairTask = (firstOpenTask?.note ? firstOpenTask : activePlan.tasks.find((task) => task.note)) ?? null;
  const completedMinutes = activePlan.tasks.reduce((sum, task) => sum + (completedSet.has(task.id) ? task.minutes : 0), 0);
  const progress = activePlan.totalMinutes > 0 ? Math.round((completedMinutes / activePlan.totalMinutes) * 100) : 0;
  const effectiveDiagnosisPrompt = diagnosisPrompt.trim() || latestWeakAttempt?.prompt || primaryDueCard?.prompt || firstOpenTask?.prompt || "";
  const effectiveDiagnosisSource = diagnosisSource.trim() || latestMistake?.correction || firstOpenTask?.note?.label || "";
  const diagnosisPromptState = diagnosisPrompt.trim()
    ? "Using pasted question"
    : effectiveDiagnosisPrompt
      ? "Using today's suggested prompt"
      : "Paste a question";
  const diagnosisSourceState = diagnosisSource.trim()
    ? "Using pasted context"
    : effectiveDiagnosisSource
      ? "Using today's note context"
      : "Optional, but improves the diagnosis";
  const diagnosisAnswerState = diagnosisAnswer.trim()
    ? `${diagnosisAnswer.trim().split(/\s+/).length} words ready`
    : "Answer required";
  const canRequestDiagnosis = Boolean(effectiveDiagnosisPrompt && diagnosisAnswer.trim());

  useEffect(() => {
    if (!hasLoadedStoredProgress.current || !progressDayKey) return;
    try {
      window.localStorage.setItem(studyTodayProgressStorageKey(progressDayKey), serializeStudyTodayProgress(progressDayKey, completed, completedChecklistItems, repairDraftsToPersist));
    } catch {
      // Ignore blocked storage. The page still works for the current session.
    }
  }, [completed, completedChecklistItems, progressDayKey, repairDraftsToPersist]);

  function toggleTask(taskId: string) {
    const task = activePlan.tasks.find((entry) => entry.id === taskId);
    const willComplete = !completed.includes(taskId);
    const completedAt = new Date().toISOString();
    if (task) {
      setMemoryTimestamp(completedAt);
    }
    if (willComplete && task) {
      updateMemory((latest) => completeStudyTodayTask(latest, task, completedAt));
    } else if (task) {
      updateMemory((latest) => removeStudyTaskCompletion(latest, task.id, completedAt));
    }
    setCompleted((current) => {
      if (current.includes(taskId)) return current.filter((id) => id !== taskId);
      return [...current, taskId];
    });
  }

  function toggleChecklistItem(taskId: string, index: number) {
    const itemId = checklistItemProgressId(taskId, index);
    setCompletedChecklistItems((current) => {
      if (current.includes(itemId)) return current.filter((id) => id !== itemId);
      return [...current, itemId];
    });
  }

  function updateRepairForm(taskId: string, field: RepairFormField, value: string) {
    setRepairForms((current) => ({
      ...current,
      [taskId]: {
        ...(current[taskId] ?? emptyRepairForm()),
        [field]: value,
        savedAt: null
      }
    }));
  }

  function saveRepairOutcome(task: StudyTodayPlan["tasks"][number]) {
    const form = repairForms[task.id] ?? emptyRepairForm();
    const missed = (form.missed.trim() || latestWeakAttempt?.attempt || task.prompt).trim();
    const correction = form.correction.trim();
    const catchQuestion = form.catchQuestion.trim();
    if (!task.note || !missed || !correction) return;

    const completedAt = new Date().toISOString();
    setMemoryTimestamp(completedAt);
    updateMemory((latest) => logStudyTodayRepairOutcome(latest, task, {
      id: repairOutcomeId(task.id, completedAt),
      missed,
      correction,
      catchQuestion
    }, completedAt));
    setCompleted((current) => current.includes(task.id) ? current : [...current, task.id]);
    setRepairForms((current) => ({
      ...current,
      [task.id]: {
        missed,
        correction,
        catchQuestion,
        savedAt: completedAt
      }
    }));
  }

  function saveDiagnosisRepair() {
    if (!coach || coach.responseType !== "diagnosis" || !diagnosisRepairTask?.note) return;

    const savedAt = new Date().toISOString();
    const input = buildStudyTodayDiagnosisRepairInput({
      id: diagnosisRepairOutcomeId(diagnosisRepairTask.id, savedAt),
      weaknesses: coach.diagnosis.weaknesses,
      nextDrill: coach.diagnosis.nextDrill
    });
    setMemoryTimestamp(savedAt);
    updateMemory((latest) => logStudyTodayDiagnosisRepairOutcome(latest, diagnosisRepairTask, input, savedAt));
    setSavedDiagnosisRepairAt(savedAt);
  }

  function resetToday() {
    const resetAt = new Date().toISOString();
    setMemoryTimestamp(resetAt);
    updateMemory((latest) => resetStudyTodayTasks(latest, activePlan.tasks.map((task) => task.id), resetAt));
    setCompleted([]);
    setCompletedChecklistItems([]);
    setRepairForms({});
    setCoach(null);
    setSavedDiagnosisRepairAt(null);
    setDiagnosisAnswer("");
  }

  async function requestCoach() {
    setIsLoadingCoach(true);
    setCoachError(null);
    setSavedDiagnosisRepairAt(null);
    try {
      const requestBody = coachTool === "diagnose"
        ? {
          requestType: "diagnose",
          prompt: effectiveDiagnosisPrompt,
          userAnswer: diagnosisAnswer,
          sourceContext: effectiveDiagnosisSource,
          noteLabel: firstOpenTask?.note?.label ?? latestWeakAttempt?.title ?? primaryDueCard?.title,
          courseName: firstOpenTask?.note?.courseName ?? latestWeakAttempt?.courseName ?? primaryDueCard?.courseName
        }
        : { requestType: "plan", mode: selectedCoachMode, minutes, completedTaskIds: completed, plan: activePlan, taskProgress: coachTaskProgress, memoryContext: coachMemoryContext };
      const response = await fetch("/api/study-coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody)
      });
      const payload = await response.json() as StudyCoachResponse & { error?: string };
      if (!response.ok) throw new Error(payload.error || "Coach request failed.");
      setCoach(payload);
    } catch (error) {
      setCoachError(error instanceof Error ? error.message : "Coach request failed.");
    } finally {
      setIsLoadingCoach(false);
    }
  }

  return (
    <section className="study-today" id="study-today">
      <div className="study-today-header">
        <div>
          <span className="micro-label">Study Today</span>
          <h2 className="section-title">Today&apos;s hard loop.</h2>
          <p className="section-copy">{activePlan.summary}</p>
        </div>
        <div className="study-progress" aria-label={`${progress}% complete`}>
          <strong>{progress}%</strong>
          <span>{completedMinutes}/{activePlan.totalMinutes} min</span>
        </div>
      </div>

      <div className="study-focus-strip" aria-label="Today's focus mix">
        {activePlan.focusMix.map((focus, index) => <span key={`${focus}-${index}`}>{focus}</span>)}
      </div>

      <div className="study-command-row">
      <div className="study-balance-panel" aria-label="Seven day study method balance">
        <div className="study-balance-copy">
          <span className="micro-label">7-day method balance</span>
          <strong>{methodBalance.summary}</strong>
          <p>Use the mix only to choose the next block. The task list below stays the source of truth.</p>
        </div>
        <details className="study-balance-details">
          <summary>Method mix</summary>
          <div className="study-balance-bars">
            {methodBalance.items.map((item) => (
              <div className={`study-balance-row method-${item.method} status-${item.status}`} key={item.method}>
                <span>
                  <strong>{item.label}</strong>
                  <small>{item.minutes} min · {item.percent}% this week · target {item.targetPercent}%</small>
                </span>
                <i aria-hidden="true"><b style={{ width: `${Math.min(100, Math.max(item.percent, item.minutes > 0 ? 3 : 0))}%` }} /></i>
              </div>
            ))}
          </div>
        </details>
        <Link prefetch={false} className={`study-balance-nudge kind-${studyNudge.kind}`} href={studyNudge.href}>
          <span className="micro-label">Next move</span>
          <strong>{studyNudge.title}</strong>
          <p>{studyNudge.body}</p>
        </Link>
      </div>

      <div className={`study-memory-priority ${hasMemoryPriority ? "" : "empty"}`} aria-label="Personal memory priority">
        <div className="study-memory-summary">
            <span className="home-icon-badge"><ListChecks size={20} aria-hidden="true" /></span>
          <div>
            <span className="micro-label">Memory priority</span>
            <strong>{hasMemoryPriority ? "Repair exposed weaknesses." : "No memory pressure yet."}</strong>
            <p>{hasMemoryPriority ? "Due recall, unresolved mistakes, and weak attempts are already folded into today's plan." : "Complete tasks or log a repair to build the queue."}</p>
          </div>
        </div>

        <div className="study-memory-stats" aria-label="Memory queue counts">
          <span><strong>{memoryPriority.summary.dueCards}</strong> due</span>
          <span><strong>{memoryPriority.summary.openMistakes}</strong> mistakes</span>
          <span><strong>{memoryPriority.summary.weakRevisionAttempts}</strong> weak</span>
        </div>

        <div className="study-memory-actions">
          <Link className="button primary" href="/revision">Open revision <ArrowRight size={15} aria-hidden="true" /></Link>
          {primaryDueCard && <Link prefetch={false} className="button ghost" href={`/notes/${primaryDueCard.slug}`}>Open source note</Link>}
        </div>

        {hasMemoryPriority && (
          <details className="study-memory-details">
            <summary>Show queue details</summary>
            <div className="study-memory-cards">
              {primaryDueCard && (
                <Link className={`study-memory-card source-${primaryDueCard.source}`} href="/revision">
                  <span>{primaryDueCard.source === "mistake" ? "Due mistake repair" : "Due recall"}</span>
                  <strong>{primaryDueCard.title}</strong>
                  <p>{primaryDueCard.prompt}</p>
                </Link>
              )}
              {latestMistake && (
              <Link prefetch={false} className="study-memory-card source-open" href={`/notes/${latestMistake.slug}`}>
                  <span><AlertTriangle size={13} aria-hidden="true" /> Latest open mistake</span>
                  <strong>{latestMistake.title}</strong>
                  <p>{latestMistake.catchQuestion ?? latestMistake.mistake}</p>
                </Link>
              )}
              {latestWeakAttempt && (
              <Link prefetch={false} className="study-memory-card source-open" href={`/notes/${latestWeakAttempt.slug}`}>
                  <span><RotateCcw size={13} aria-hidden="true" /> Weak recall attempt</span>
                  <strong>{latestWeakAttempt.title}</strong>
                  <p>{latestWeakAttempt.attempt}</p>
                </Link>
              )}
            </div>
          </details>
        )}
      </div>
      </div>

      <details className="study-evidence-disclosure">
        <summary>Evidence protocol and sources</summary>
        <div className="study-protocol-grid" aria-label="Evidence-backed study protocols">
          {activePlan.protocols.map((protocol) => (
            <a className={`study-protocol-card method-${protocol.method}`} key={protocol.method} href={protocol.source.href} target="_blank" rel="noreferrer">
              <span className="study-protocol-method">{methodLabels[protocol.method]}</span>
              <strong>{protocol.label}</strong>
              <p>{protocol.action}</p>
              <small>{protocol.avoid}</small>
              <em>{protocol.source.label} <ExternalLink size={12} aria-hidden="true" /></em>
            </a>
          ))}
        </div>
      </details>

      <div className="study-layout">
        <div className="study-task-list">
          {activePlan.tasks.map((task, index) => {
            const checked = completedSet.has(task.id);
            const checklistProgressLabel = task.checklist
              ? buildChecklistProgressLabel(task.id, task.checklist.length, completedChecklistItems)
              : null;
            return (
              <article className={`study-task-card ${checked ? "completed" : ""}`} key={task.id}>
                <button className="study-check" type="button" onClick={() => toggleTask(task.id)} aria-pressed={checked} aria-label={`Mark ${task.title} ${checked ? "incomplete" : "complete"}`}>
                  {checked ? <Check size={16} aria-hidden="true" /> : <span>{index + 1}</span>}
                </button>
                <div className="study-task-main">
                  <div className="study-task-topline">
                    <span><Clock3 size={14} aria-hidden="true" /> {task.minutes} min</span>
                    <span>{methodLabels[task.method]}</span>
                    {checklistProgressLabel && <span className="study-task-step-progress">{checklistProgressLabel}</span>}
                  </div>
                  <h3>{task.title}</h3>
                  <p>{task.prompt}</p>
                  {task.checklist && task.checklist.length > 0 && (
                    <details className="study-task-workflow-disclosure">
                      <summary>{checklistProgressLabel ? `Checklist, repair log · ${checklistProgressLabel}` : "Checklist and repair log"}</summary>
                      <ul className="study-task-checklist" aria-label={`${task.title} checklist`}>
                        {task.checklist.map((item, checklistIndex) => {
                          const itemId = checklistItemProgressId(task.id, checklistIndex);
                          const checklistChecked = completedChecklistSet.has(itemId);
                          return (
                            <li className={checklistChecked ? "checked" : ""} key={itemId}>
                              <button
                                type="button"
                                onClick={() => toggleChecklistItem(task.id, checklistIndex)}
                                aria-pressed={checklistChecked}
                                aria-label={`${checklistChecked ? "Uncheck" : "Check"} ${item}`}
                              >
                                {checklistChecked && <Check size={12} aria-hidden="true" />}
                              </button>
                              <span>{item}</span>
                            </li>
                          );
                        })}
                      </ul>
                      {task.note && (
                        <div className="study-repair-log" aria-label={`${task.title} repair log`}>
                          <label>
                            Missed rule
                            <textarea
                              value={repairForms[task.id]?.missed ?? ""}
                              onChange={(event) => updateRepairForm(task.id, "missed", event.target.value)}
                              placeholder={latestWeakAttempt?.attempt ?? "What slipped during the closed-book answer?"}
                              rows={2}
                            />
                          </label>
                          <label>
                            Corrected rule
                            <textarea
                              value={repairForms[task.id]?.correction ?? ""}
                              onChange={(event) => updateRepairForm(task.id, "correction", event.target.value)}
                              placeholder="The rule I will test tomorrow"
                              rows={2}
                            />
                          </label>
                          <label>
                            Catch question
                            <input
                              value={repairForms[task.id]?.catchQuestion ?? ""}
                              onChange={(event) => updateRepairForm(task.id, "catchQuestion", event.target.value)}
                              placeholder={latestWeakAttempt?.prompt ?? "Question that exposes the same gap"}
                            />
                          </label>
                          <div className="study-repair-actions">
                            <button
                              className="button primary"
                              type="button"
                              onClick={() => saveRepairOutcome(task)}
                              disabled={!((repairForms[task.id]?.correction ?? "").trim())}
                            >
                              Save repair <Check size={14} aria-hidden="true" />
                            </button>
                            {repairForms[task.id]?.savedAt && <span>Saved for tomorrow</span>}
                          </div>
                        </div>
                      )}
                    </details>
                  )}
                  {task.note && (
                    <Link prefetch={false} className="study-note-link" href={`/notes/${task.note.slug}`}>
                      <span>
                        <strong>{task.note.label}</strong>
                        <small>{[task.note.courseName ?? task.note.courseCode ?? "Study note", task.note.week ? `Week ${task.note.week}` : "Reference"].join(" · ")}</small>
                      </span>
                      <ArrowRight size={15} aria-hidden="true" />
                    </Link>
                  )}
                  <details className="study-why-disclosure">
                    <summary><Brain size={14} aria-hidden="true" /> Why this task</summary>
                    <small className="study-why">{task.why}</small>
                  </details>
                </div>
              </article>
            );
          })}
        </div>

        <div className="study-weakness-brief" aria-label="Top weakness repair">
          <div>
            <span className="micro-label">Weakness repair</span>
            <strong>{weaknessInsight.topCourse?.label ?? "No top weakness yet"}</strong>
            <p>{weaknessInsight.hasSignals ? "Start with the course carrying the strongest memory pressure." : "Log one recall attempt or mistake to make this specific."}</p>
          </div>
          <div>
            <span className="micro-label">Theme</span>
            <strong>{weaknessInsight.topTheme?.theme ?? "Waiting for signals"}</strong>
            <p>{weaknessInsight.topTheme ? `${weaknessInsight.topTheme.count} signal${weaknessInsight.topTheme.count === 1 ? "" : "s"}` : "No repeated repair pattern yet."}</p>
          </div>
          <div>
            <span className="micro-label">Next repair</span>
            <strong>{weaknessInsight.nextAction}</strong>
          </div>
        </div>

        <aside className="study-coach-panel" aria-label="Study coach">
          <div className="study-coach-heading">
            <span className="home-icon-badge"><Sparkles size={20} aria-hidden="true" /></span>
            <div>
              <span className="micro-label">Coach</span>
              <strong>Ask for the next move.</strong>
            </div>
          </div>
          <p className={`coach-provider-status status-${providerStatus?.provider ?? "local"}`}>
            {providerStatus ? providerStatus.label : "Checking coach"}{providerStatus?.model ? ` · ${providerStatus.model}` : ""}
          </p>
          {weaknessInsight.hasSignals && (
            <p className="study-coach-weakness-nudge">
              Coach is set to weakness repair from your memory signals. Switch modes only if today is an exam sprint.
            </p>
          )}

          <label>
            Coach tool
            <select value={coachTool} onChange={(event) => {
              setCoachTool(event.target.value as CoachTool);
              setCoach(null);
              setSavedDiagnosisRepairAt(null);
            }}>
              <option value="plan">Next study move</option>
              <option value="diagnose">Diagnose my answer</option>
            </select>
          </label>

          {coachTool === "plan" ? (
            <>
              <label>
                Mode
                <select value={selectedCoachMode} onChange={(event) => setCoachModeOverride(event.target.value as StudyCoachPlanRequest["mode"])}>
                  <option value="balanced">UPSC + EEE balance</option>
                  <option value="exam-sprint">Exam sprint</option>
                  <option value="weakness-repair">Weakness repair</option>
                </select>
              </label>

              <label>
                Time
                <select value={minutes} onChange={(event) => setMinutes(Number(event.target.value) as StudyCoachPlanRequest["minutes"])}>
                  <option value={45}>45 minutes</option>
                  <option value={90}>90 minutes</option>
                  <option value={120}>120 minutes</option>
                </select>
              </label>
            </>
          ) : (
            <div className="study-coach-diagnosis-form">
              <div className="diagnosis-state-grid" aria-label="Diagnosis readiness">
                <span>{diagnosisPromptState}</span>
                <span>{diagnosisSourceState}</span>
                <span className={diagnosisAnswer.trim() ? "ready" : "needed"}>{diagnosisAnswerState}</span>
              </div>
              <label>
                Question
                <textarea
                  value={diagnosisPrompt}
                  onChange={(event) => setDiagnosisPrompt(event.target.value)}
                  placeholder={effectiveDiagnosisPrompt || "Paste the question you answered"}
                  rows={3}
                />
              </label>
              <label>
                Source context
                <textarea
                  value={diagnosisSource}
                  onChange={(event) => setDiagnosisSource(event.target.value)}
                  placeholder={effectiveDiagnosisSource || "Paste the expected rule, source excerpt, or marking clue"}
                  rows={3}
                />
              </label>
              <label>
                Your answer
                <textarea
                  value={diagnosisAnswer}
                  onChange={(event) => {
                    setDiagnosisAnswer(event.target.value);
                    setSavedDiagnosisRepairAt(null);
                  }}
                  placeholder="Write or paste your answer here"
                  rows={5}
                />
              </label>
            </div>
          )}

          <div className="study-coach-actions">
            <button className="button primary" type="button" onClick={requestCoach} disabled={isLoadingCoach || (coachTool === "diagnose" && !canRequestDiagnosis)}>
              {isLoadingCoach ? "Thinking" : coachTool === "diagnose" ? "Diagnose weakness" : "Get plan"} <TimerReset size={16} aria-hidden="true" />
            </button>
            <button className="button ghost" type="button" onClick={resetToday}>
              Reset <RotateCcw size={15} aria-hidden="true" />
            </button>
          </div>
          {coachTool === "diagnose" && !canRequestDiagnosis && <p className="diagnosis-help">A question and your answer are enough. Source context is optional.</p>}

          {coachError && <p className="coach-error">{coachError}</p>}
          {coach && (
            <div className={`coach-output ${coach.responseType === "diagnosis" ? "coach-output-diagnosis" : ""}`}>
              {coach.responseType === "diagnosis" ? (
                <div className="study-coach-diagnosis-output">
                  <div className="diagnosis-output-head">
                    <span>{coach.aiAvailable ? `Mistral · ${coach.model}` : "Local fallback"}</span>
                    <strong>Weakness analysis</strong>
                    <p>{coach.message}</p>
                  </div>
                  <div className="diagnosis-output-section">
                    <span>What held up</span>
                    <ul>{coach.diagnosis.strengths.map((strength) => <li key={strength}>{strength}</li>)}</ul>
                  </div>
                  <div className="diagnosis-output-section priority">
                    <span>Main weakness</span>
                    <ul>{coach.diagnosis.weaknesses.map((weakness) => <li key={weakness}>{weakness}</li>)}</ul>
                  </div>
                  <div className="diagnosis-next-drill">
                    <span>Next drill</span>
                    <strong>{coach.diagnosis.nextDrill}</strong>
                    <button className="button ghost" type="button" onClick={() => {
                      setDiagnosisPrompt(coach.diagnosis.nextDrill);
                      setDiagnosisAnswer("");
                      setCoach(null);
                      setSavedDiagnosisRepairAt(null);
                    }}>Use this drill</button>
                    <button className="button primary" type="button" onClick={saveDiagnosisRepair} disabled={Boolean(savedDiagnosisRepairAt) || !diagnosisRepairTask?.note}>
                      {savedDiagnosisRepairAt ? "Saved to revision" : "Save repair card"} <Check size={14} aria-hidden="true" />
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <strong>{coach.aiAvailable ? `Mistral: ${coach.model}` : "Local fallback"}</strong>
                  <p>{coach.message}</p>
                  <ul>
                    {coach.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}
                  </ul>
                </>
              )}
            </div>
          )}

          <details className="study-source-list">
            <summary>Sources</summary>
            {activePlan.sources.map((source) => (
              <a key={source.label} href={source.href} target="_blank" rel="noreferrer">
                <strong>{source.label}</strong>
                <span>{source.claim}</span>
              </a>
            ))}
          </details>
        </aside>
      </div>
    </section>
  );
}
