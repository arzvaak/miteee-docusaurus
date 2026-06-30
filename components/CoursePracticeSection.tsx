"use client";

import Link from "next/link";
import { ArrowRight, Check, Dumbbell, PenLine, Target, Timer } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useLearnerMemory } from "@/components/useLearnerMemory";
import { recordStudyTaskCompletion, removeStudyTaskCompletion } from "@/lib/learner-memory";
import { buildCoursePracticeStudyTask, type CoursePracticeDrill } from "@/lib/course-practice";

function dayKey(value: string) {
  return value.slice(0, 10);
}

export function CoursePracticeSection({ courseName, drills }: { courseName: string; drills: CoursePracticeDrill[] }) {
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

  function toggleDrill(drill: CoursePracticeDrill) {
    const completedAt = new Date().toISOString();
    const activeDayKey = dayKey(completedAt);
    const task = buildCoursePracticeStudyTask(drill);
    setTodayKey(activeDayKey);
    updateMemory((latest) => {
      const alreadyLogged = latest.studyActivity.some((activity) => activity.taskId === task.id && dayKey(activity.completedAt) === activeDayKey);
      return alreadyLogged
        ? removeStudyTaskCompletion(latest, task.id, completedAt)
        : recordStudyTaskCompletion(latest, task, completedAt);
    });
  }

  return (
    <section className="course-practice-panel" aria-label={`${courseName} practice drills`}>
      <div className="section-header">
        <div>
          <span className="micro-label">Course practice</span>
          <h2 className="section-title">Turn this subject into work.</h2>
        </div>
        <Dumbbell size={20} aria-hidden="true" />
      </div>
      <div className="course-practice-grid">
        {drills.map((drill) => {
          const task = buildCoursePracticeStudyTask(drill);
          const logged = loggedTaskIds.has(task.id);
          return (
            <article className={`course-practice-card method-${drill.method} ${logged ? "logged" : ""}`} key={drill.id}>
              <div className="course-practice-topline">
                <span><Target size={13} aria-hidden="true" /> {drill.focus}</span>
                <Link prefetch={false} href={`/notes/${drill.slug}`}>Open note <ArrowRight size={13} aria-hidden="true" /></Link>
              </div>
              <h3>{drill.title}</h3>
              <p>{drill.prompt}</p>
              <small>{drill.reason}</small>
              <ul>
                {drill.checklist.map((item) => <li key={item}><PenLine size={13} aria-hidden="true" /> {item}</li>)}
              </ul>
              <div className="course-practice-actions">
                <button className={logged ? "button ghost" : "button primary"} type="button" onClick={() => toggleDrill(drill)} aria-pressed={logged}>
                  {logged ? <Check size={15} aria-hidden="true" /> : <Timer size={15} aria-hidden="true" />}
                  {logged ? "Logged today" : `Log ${drill.minutes} min`}
                </button>
                <span>{drill.method.replace("-", " ")}</span>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
