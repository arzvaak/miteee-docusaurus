import type { LearnerMemoryPriority, RevisionAttempt, RevisionCard } from "@/lib/learner-memory";
import type { StudyNoteRef, StudyTask, StudyTodayPlan } from "@/lib/study-system";
import { truncateText } from "@/lib/text";

type MemoryStudySource = RevisionCard | RevisionAttempt;

function memoryNoteRef(source: MemoryStudySource, excerpt: string): StudyNoteRef {
  return {
    slug: source.slug,
    title: source.title,
    label: source.title,
    courseCode: source.courseCode,
    courseName: source.courseName,
    week: null,
    stats: {
      codeBlocks: 0,
      mermaidBlocks: 0,
      mathBlocks: 0,
      details: 0,
      questionBlocks: 0
    },
    excerpt: truncateText(excerpt, 150)
  };
}

export function buildMemoryAwareStudyTodayPlan(plan: StudyTodayPlan, priority: LearnerMemoryPriority): StudyTodayPlan {
  const dueCard = priority.dueCards[0];
  const weakAttempt = priority.weakAttempts[0];
  if (!dueCard && !weakAttempt) return plan;
  const memorySource = dueCard ?? weakAttempt;
  const course = memorySource.courseCode && memorySource.courseName ? { code: memorySource.courseCode, name: memorySource.courseName } : null;

  const memoryTask: StudyTask = {
    id: dueCard ? "memory-repair" : "attempt-repair",
    title: dueCard
      ? dueCard.source === "mistake" ? "Repair due mistake" : "Repair due recall"
      : "Repair failed recall",
    method: dueCard
      ? dueCard.source === "mistake" ? "self-explanation" : "retrieval"
      : "self-explanation",
    minutes: 20,
    prompt: dueCard
      ? dueCard.prompt
      : `Your last attempt: ${weakAttempt?.attempt ?? ""} Repair it, then answer again from memory: ${weakAttempt?.prompt ?? ""}`,
    why: dueCard
      ? "Your own past work exposed this gap, so it gets first claim on today's attention."
      : "A recent hard recall is fresh evidence of a gap, so it becomes today's first repair block.",
    checklist: dueCard ? undefined : [
      "Rewrite the failed attempt in one corrected rule.",
      "Answer the original prompt again with the note closed.",
      "Open the source note, compare, and log a mistake if the same gap remains."
    ],
    note: dueCard ? memoryNoteRef(dueCard, dueCard.prompt) : memoryNoteRef(weakAttempt, weakAttempt.attempt),
    course
  };

  const targetMinutes = plan.totalMinutes;
  const tasks = [
    memoryTask,
    ...plan.tasks.filter((task) => task.id !== "error-log")
  ];

  let overflow = tasks.reduce((sum, task) => sum + task.minutes, 0) - targetMinutes;
  const trimmedTasks = tasks.map((task) => ({ ...task }));

  for (let index = trimmedTasks.length - 1; index >= 1 && overflow > 0; index -= 1) {
    const task = trimmedTasks[index];
    if (!task) continue;
    const reducible = Math.max(0, task.minutes - 15);
    const reduction = Math.min(reducible, overflow);
    task.minutes -= reduction;
    overflow -= reduction;
  }

  return {
    ...plan,
    totalMinutes: trimmedTasks.reduce((sum, task) => sum + task.minutes, 0),
    summary: dueCard
      ? "Starts with due memory repair, then keeps the recall, spacing, and interleaving loop moving."
      : "Starts with a failed recall attempt repair, then keeps the recall, spacing, and interleaving loop moving.",
    focusMix: Array.from(new Set([dueCard ? "Due memory repair" : "Weak attempt repair", ...plan.focusMix])),
    tasks: trimmedTasks
  };
}
