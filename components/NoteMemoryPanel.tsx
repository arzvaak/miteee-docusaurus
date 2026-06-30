"use client";

import { BookCheck, Brain, Plus, RotateCcw } from "lucide-react";
import { useMemo, useState } from "react";
import { addMistake, getDueRevisionCards, recordNoteRead, reviewRevisionCard, type MemoryNoteRef } from "@/lib/learner-memory";
import { recallGradeOptions } from "@/lib/recall-grades";
import { useLearnerMemory } from "@/components/useLearnerMemory";

export function NoteMemoryPanel({ note }: { note: MemoryNoteRef }) {
  const { memory, updateMemory } = useLearnerMemory();
  const [mistake, setMistake] = useState("");
  const [correction, setCorrection] = useState("");
  const [catchQuestion, setCatchQuestion] = useState("");
  const noteProgress = memory.notes[note.slug];

  const dueForNote = useMemo(() => {
    const now = new Date().toISOString();
    return getDueRevisionCards(memory, now).filter((card) => card.slug === note.slug).slice(0, 3);
  }, [memory, note.slug]);

  function markRead() {
    updateMemory((current) => recordNoteRead(current, note, new Date().toISOString()));
  }

  function saveMistake() {
    const cleanMistake = mistake.trim();
    const cleanCorrection = correction.trim();
    const cleanCatchQuestion = catchQuestion.trim();
    if (!cleanMistake || !cleanCorrection || !cleanCatchQuestion) return;
    const createdAt = new Date().toISOString();
    updateMemory((current) => addMistake(current, note, {
      id: `${note.slug}-${createdAt}`,
      createdAt,
      mistake: cleanMistake,
      correction: cleanCorrection,
      catchQuestion: cleanCatchQuestion
    }));
    setMistake("");
    setCorrection("");
    setCatchQuestion("");
  }

  function markReviewed(cardId: string, grade: (typeof recallGradeOptions)[number]["grade"]) {
    updateMemory((current) => reviewRevisionCard(current, cardId, grade, new Date().toISOString()));
  }

  return (
    <div className="reader-memory-card">
      <div className="reader-memory-heading">
        <span className="home-small-icon"><Brain size={16} aria-hidden="true" /></span>
        <div>
          <span className="micro-label">Study memory</span>
          <strong>{noteProgress ? `${noteProgress.readCount} read${noteProgress.readCount === 1 ? "" : "s"}` : "Not logged yet"}</strong>
        </div>
      </div>

      <button className="button primary memory-full-button" type="button" onClick={markRead}>
        Mark read <BookCheck size={16} aria-hidden="true" />
      </button>

      <div className="memory-mini-form">
        <label>
          Mistake
          <textarea value={mistake} onChange={(event) => setMistake(event.target.value)} placeholder="What did I get wrong here?" rows={3} />
        </label>
        <label>
          Correct rule
          <textarea value={correction} onChange={(event) => setCorrection(event.target.value)} placeholder="What rule fixes it?" rows={3} />
        </label>
        <label>
          Catch question
          <textarea value={catchQuestion} onChange={(event) => setCatchQuestion(event.target.value)} placeholder="What question catches this tomorrow?" rows={3} />
        </label>
        <button className="button ghost memory-full-button" type="button" onClick={saveMistake} disabled={!mistake.trim() || !correction.trim() || !catchQuestion.trim()}>
          Add to revision <Plus size={15} aria-hidden="true" />
        </button>
      </div>

      <div className="memory-due-list">
        <span className="micro-label">Due here</span>
        {dueForNote.length > 0 ? dueForNote.map((card) => (
          <div className="memory-due-card" key={card.id}>
            <p>{card.prompt}</p>
            <div className="memory-due-grade-row" aria-label="Grade recall">
              {recallGradeOptions.map((option) => (
                <button
                  className={option.emphasis === "primary" ? "primary-grade" : ""}
                  type="button"
                  onClick={() => markReviewed(card.id, option.grade)}
                  title={option.description}
                  key={option.grade}
                >
                  {option.label} <RotateCcw size={13} aria-hidden="true" />
                </button>
              ))}
            </div>
          </div>
        )) : <p className="memory-empty">No due card for this note yet.</p>}
      </div>
    </div>
  );
}
