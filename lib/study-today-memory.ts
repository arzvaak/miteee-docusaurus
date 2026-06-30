import { addMistake, recordNoteRead, recordStudyTaskCompletion, removeStudyTaskCompletion, type LearnerMemory } from "@/lib/learner-memory";
import type { StudyTask } from "@/lib/study-system";

export type StudyTodayRepairOutcomeInput = {
  id: string;
  missed: string;
  correction: string;
  catchQuestion?: string;
};

export type StudyTodayDiagnosisRepairInput = {
  id: string;
  weaknesses: string[];
  nextDrill: string;
};

function addDays(isoDate: string, days: number) {
  const date = new Date(isoDate);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString();
}

function cleanText(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

export function completeStudyTodayTask(memory: LearnerMemory, task: StudyTask, completedAt: string): LearnerMemory {
  const withActivity = recordStudyTaskCompletion(memory, {
    id: task.id,
    title: task.title,
    method: task.method,
    minutes: task.minutes,
    note: task.note ? {
      slug: task.note.slug,
      title: task.note.label,
      courseCode: task.note.courseCode,
      courseName: task.note.courseName
    } : null
  }, completedAt);

  if (!task.note) return withActivity;
  return recordNoteRead(withActivity, {
    slug: task.note.slug,
    title: task.note.label,
    courseCode: task.note.courseCode,
    courseName: task.note.courseName
  }, completedAt);
}

export function buildStudyTodayDiagnosisRepairInput(input: StudyTodayDiagnosisRepairInput): StudyTodayRepairOutcomeInput {
  const missed = input.weaknesses.map(cleanText).find(Boolean) ?? "Coach diagnosed a weak answer step that needs repair.";
  const nextDrill = cleanText(input.nextDrill);
  return {
    id: input.id,
    missed,
    correction: nextDrill ? `Repair with next drill: ${nextDrill}` : "Redo the answer closed-book and state the missing rule explicitly.",
    catchQuestion: nextDrill || undefined
  };
}

export function logStudyTodayRepairOutcome(memory: LearnerMemory, task: StudyTask, input: StudyTodayRepairOutcomeInput, completedAt: string): LearnerMemory {
  const withCompletion = completeStudyTodayTask(memory, task, completedAt);
  if (!task.note) return withCompletion;

  const withMistake = addMistake(withCompletion, {
    slug: task.note.slug,
    title: task.note.label,
    courseCode: task.note.courseCode,
    courseName: task.note.courseName
  }, {
    id: input.id,
    createdAt: completedAt,
    mistake: input.missed,
    correction: input.correction,
    catchQuestion: input.catchQuestion
  });

  const cardId = `mistake:${input.id}`;
  return {
    ...withMistake,
    revisionCards: {
      ...withMistake.revisionCards,
      [cardId]: {
        ...withMistake.revisionCards[cardId],
        dueAt: addDays(completedAt, 1)
      }
    }
  };
}

export function logStudyTodayDiagnosisRepairOutcome(memory: LearnerMemory, task: StudyTask, input: StudyTodayRepairOutcomeInput, diagnosedAt: string): LearnerMemory {
  if (!task.note) return memory;

  const withMistake = addMistake(memory, {
    slug: task.note.slug,
    title: task.note.label,
    courseCode: task.note.courseCode,
    courseName: task.note.courseName
  }, {
    id: input.id,
    createdAt: diagnosedAt,
    mistake: input.missed,
    correction: input.correction,
    catchQuestion: input.catchQuestion
  });

  const cardId = `mistake:${input.id}`;
  return {
    ...withMistake,
    revisionCards: {
      ...withMistake.revisionCards,
      [cardId]: {
        ...withMistake.revisionCards[cardId],
        dueAt: addDays(diagnosedAt, 1)
      }
    }
  };
}

export function resetStudyTodayTasks(memory: LearnerMemory, taskIds: string[], resetAt: string): LearnerMemory {
  return taskIds.reduce((next, taskId) => removeStudyTaskCompletion(next, taskId, resetAt), memory);
}
