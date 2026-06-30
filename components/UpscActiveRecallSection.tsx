"use client";

import Link from "next/link";
import { ArrowRight, Brain, Check, PenLine, Target, Timer } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useLearnerMemory } from "@/components/useLearnerMemory";
import { recordStudyTaskCompletion, removeStudyTaskCompletion } from "@/lib/learner-memory";
import { buildUpscDrillStudyTask, type UpscActiveRecallDrill } from "@/lib/upsc-active-recall";

function dayKey(value: string) {
  return value.slice(0, 10);
}

export function UpscActiveRecallSection({ drills }: { drills: UpscActiveRecallDrill[] }) {
  const { memory, updateMemory } = useLearnerMemory();
  const [todayKey, setTodayKey] = useState("");

  useEffect(() => {
    let cancelled = false;
    queueMicrotask(() => {
      if (!cancelled) setTodayKey(dayKey(new Date().toISOString()));
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const loggedTaskIds = useMemo(() => {
    if (!todayKey) return new Set<string>();
    return new Set(memory.studyActivity.filter((activity) => dayKey(activity.completedAt) === todayKey).map((activity) => activity.taskId));
  }, [memory.studyActivity, todayKey]);

  function toggleDrill(drill: UpscActiveRecallDrill) {
    const completedAt = new Date().toISOString();
    const activeDayKey = dayKey(completedAt);
    const task = buildUpscDrillStudyTask(drill);
    setTodayKey(activeDayKey);
    updateMemory((latest) => {
      const alreadyLogged = latest.studyActivity.some((activity) => activity.taskId === task.id && dayKey(activity.completedAt) === activeDayKey);
      return alreadyLogged
        ? removeStudyTaskCompletion(latest, task.id, completedAt)
        : recordStudyTaskCompletion(latest, task, completedAt);
    });
  }

  return (
    <section className="upsc-drill-panel" aria-label="UPSC active recall drills">
      <div className="section-header">
        <div>
          <span className="micro-label">UPSC active recall</span>
          <h2 className="section-title">Answer first, then open the chapter.</h2>
        </div>
        <Brain size={20} aria-hidden="true" />
      </div>
      <div className="upsc-drill-grid">
        {drills.map((drill) => {
          const task = buildUpscDrillStudyTask(drill);
          const logged = loggedTaskIds.has(task.id);
          return (
            <article className={`upsc-drill-card ${logged ? "logged" : ""}`} key={drill.slug}>
              <div className="upsc-drill-topline">
                <span><Target size={13} aria-hidden="true" /> {drill.sourceFocus}</span>
                <Link prefetch={false} href={`/notes/${drill.slug}`}>Open note <ArrowRight size={13} aria-hidden="true" /></Link>
              </div>
              <h3>{drill.title}</h3>
              <div className="upsc-drill-prompts">
                <p><strong>Prelims</strong>{drill.prelimsPrompt.replace(/^Prelims:\s*/i, "")}</p>
                <p><strong>Mains</strong>{drill.mainsPrompt.replace(/^Mains:\s*/i, "")}</p>
              </div>
              <ul>
                {drill.checklist.map((item) => <li key={item}><PenLine size={13} aria-hidden="true" /> {item}</li>)}
              </ul>
              <div className="upsc-drill-actions">
                <button className={logged ? "button ghost" : "button primary"} type="button" onClick={() => toggleDrill(drill)} aria-pressed={logged}>
                  {logged ? <Check size={15} aria-hidden="true" /> : <Timer size={15} aria-hidden="true" />}
                  {logged ? "Logged today" : "Log 25 min"}
                </button>
                <span>Saved to local learner memory.</span>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
