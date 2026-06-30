"use client";

import { Check, Dumbbell, PenLine, Timer } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useLearnerMemory } from "@/components/useLearnerMemory";
import { removeStudyTaskCompletion } from "@/lib/learner-memory";
import { buildNotePracticeStudyTask, completeNotePractice, type NotePractice } from "@/lib/note-practice";

function dayKey(value: string) {
  return value.slice(0, 10);
}

export function NotePracticePanel({ practice }: { practice: NotePractice }) {
  const { memory, updateMemory } = useLearnerMemory();
  const [todayKey, setTodayKey] = useState("");
  const task = useMemo(() => buildNotePracticeStudyTask(practice), [practice]);

  useEffect(() => {
    let cancelled = false;
    queueMicrotask(() => {
      if (!cancelled) setTodayKey(dayKey(new Date().toISOString()));
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const logged = useMemo(() => {
    if (!todayKey) return false;
    return memory.studyActivity.some((activity) => activity.taskId === task.id && dayKey(activity.completedAt) === todayKey);
  }, [memory.studyActivity, task.id, todayKey]);

  function togglePractice() {
    const completedAt = new Date().toISOString();
    const activeDayKey = dayKey(completedAt);
    setTodayKey(activeDayKey);
    updateMemory((latest) => {
      const alreadyLogged = latest.studyActivity.some((activity) => activity.taskId === task.id && dayKey(activity.completedAt) === activeDayKey);
      return alreadyLogged
        ? removeStudyTaskCompletion(latest, task.id, completedAt)
        : completeNotePractice(latest, practice, completedAt);
    });
  }

  return (
    <div id="note-practice" className={`note-practice-card ${logged ? "logged" : ""}`} aria-label="Note practice">
      <div className="reader-memory-heading">
        <span className="home-small-icon"><Dumbbell size={16} aria-hidden="true" /></span>
        <div>
          <span className="micro-label">Practice this note</span>
          <strong>{practice.focus}</strong>
        </div>
      </div>

      <div className="note-practice-actions">
        <button className={logged ? "button ghost memory-full-button" : "button primary memory-full-button"} type="button" onClick={togglePractice} aria-pressed={logged}>
          {logged ? <Check size={15} aria-hidden="true" /> : <Timer size={15} aria-hidden="true" />}
          {logged ? "Logged today" : `Log ${practice.minutes} min`}
        </button>
        <span>{practice.method.replace("-", " ")}</span>
      </div>

      <details className="note-practice-details">
        <summary>Practice steps</summary>
        <div className="note-practice-summary">
          <p>{practice.prompt}</p>
          <small>{practice.evidence}</small>

          {practice.expansionSections && practice.expansionSections.length > 0 && (
            <nav className="note-practice-jumps" aria-label="UPSC expansion drill jumps">
              {practice.expansionSections.map((section) => (
                <a href={`#${section.id}`} key={`${section.id}-${section.text}`}>
                  {section.text}
                </a>
              ))}
            </nav>
          )}

          <ul>
            {practice.checklist.map((item) => <li key={item}><PenLine size={13} aria-hidden="true" /> {item}</li>)}
          </ul>
        </div>
      </details>
    </div>
  );
}
