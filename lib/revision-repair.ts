import {
  buildLearnerMemoryPriority,
  buildLearnerWeaknessInsight,
  type LearnerMemory,
  type MistakeEntry,
  type RevisionAttempt,
  type RevisionCard
} from "@/lib/learner-memory";

export type RevisionAttemptRepairBrief = {
  tone: "repair" | "extend";
  label: "Repair" | "Extend";
  action: string;
  check: string;
};

export type RevisionRepairSprint = {
  kind: "due-card" | "open-mistake" | "weak-attempt" | "start";
  label: string;
  title: string;
  body: string;
  focus: string;
  href: string;
  primaryLabel: string;
  plan: string[];
  gradingHint: string;
};

function extractBetween(value: string, start: string, end: string) {
  const startIndex = value.indexOf(start);
  if (startIndex < 0) return null;
  const contentStart = startIndex + start.length;
  const endIndex = end ? value.indexOf(end, contentStart) : -1;
  return value
    .slice(contentStart, endIndex >= 0 ? endIndex : undefined)
    .replace(/\s+/g, " ")
    .trim()
    .replace(/[.。]\s*$/, "");
}

export function buildRevisionAttemptRepairBrief(attempt: RevisionAttempt): RevisionAttemptRepairBrief {
  const correctRule = extractBetween(attempt.prompt, "Correct rule:", "Catch question:");
  const catchQuestion = extractBetween(attempt.prompt, "Catch question:", "");
  const needsRepair = attempt.grade === "again" || attempt.grade === "hard";
  const source = attempt.title || "the source note";

  if (needsRepair) {
    return {
      tone: "repair",
      label: "Repair",
      action: correctRule
        ? `Rewrite the corrected rule: ${correctRule}.`
        : `Compare the attempt with ${source} and rewrite the missing rule.`,
      check: catchQuestion
        ? `Answer this without opening the note: ${catchQuestion}`
        : "Close the note and answer the same prompt once more."
    };
  }

  return {
    tone: "extend",
    label: "Extend",
    action: `Create one new question that tests the same idea from ${source}.`,
    check: "Answer the new question without reopening the source, then log any gap."
  };
}

function noteHref(item: { slug: string }) {
  return `/notes/${item.slug}`;
}

function courseFocus(item: { courseName: string | null; courseCode: string | null }) {
  return item.courseName || item.courseCode || "Current study queue";
}

function dueCardBody(card: RevisionCard) {
  if (card.source === "mistake") return card.prompt;
  return `${card.prompt} Treat this as a closed-book check before reading.`;
}

function openMistakeBody(mistake: MistakeEntry) {
  return mistake.catchQuestion
    ? `${mistake.mistake} Catch question: ${mistake.catchQuestion}`
    : `${mistake.mistake} Correct rule: ${mistake.correction}`;
}

export function buildRevisionRepairSprint(memory: LearnerMemory, at: string): RevisionRepairSprint {
  const priority = buildLearnerMemoryPriority(memory, at, 1);
  const weakness = buildLearnerWeaknessInsight(memory, at, 1);
  const dueCard = priority.dueCards[0];

  if (dueCard) {
    return {
      kind: "due-card",
      label: dueCard.source === "mistake" ? "Top repair" : "Due recall",
      title: `Repair now: ${dueCard.title}`,
      body: dueCardBody(dueCard),
      focus: weakness.topCourse ? `${weakness.topCourse.label} · ${weakness.nextAction}` : courseFocus(dueCard),
      href: noteHref(dueCard),
      primaryLabel: "Open source after attempt",
      plan: [
        "Write the recall attempt before opening the source.",
        "Check the corrected rule or note only after the attempt is written.",
        "Grade honestly: Again or Hard keeps it in repair; Good or Easy moves it forward."
      ],
      gradingHint: "Again = blank or wrong. Hard = partly right but unstable. Good = correct with effort. Easy = fast and clean."
    };
  }

  const openMistake = priority.openMistakes[0];
  if (openMistake) {
    return {
      kind: "open-mistake",
      label: "Open mistake",
      title: `Close mistake: ${openMistake.title}`,
      body: openMistakeBody(openMistake),
      focus: weakness.topCourse ? `${weakness.topCourse.label} · ${weakness.nextAction}` : courseFocus(openMistake),
      href: noteHref(openMistake),
      primaryLabel: "Repair in note",
      plan: [
        "Open the source note and find the exact corrected rule.",
        "Answer the catch question without looking at the correction.",
        "Add or review the repair card so this mistake reappears in the queue."
      ],
      gradingHint: "Do not call it closed until the catch question is answerable without the note."
    };
  }

  const weakAttempt = priority.weakAttempts[0];
  if (weakAttempt) {
    const brief = buildRevisionAttemptRepairBrief(weakAttempt);
    return {
      kind: "weak-attempt",
      label: "Weak attempt",
      title: `Repair weak attempt: ${weakAttempt.title}`,
      body: weakAttempt.attempt,
      focus: weakness.topCourse ? `${weakness.topCourse.label} · ${weakness.nextAction}` : courseFocus(weakAttempt),
      href: noteHref(weakAttempt),
      primaryLabel: "Open repair source",
      plan: [
        "Compare the old attempt with the source note.",
        brief.action,
        brief.check
      ],
      gradingHint: "Do not upgrade the card until the missing rule can be produced from memory."
    };
  }

  return {
    kind: "start",
    label: "Start sprint",
    title: "Seed a repair sprint.",
    body: weakness.nextAction,
    focus: "No active weakness is recorded yet.",
    href: "/#study-today",
    primaryLabel: "Start Study Today",
    plan: [
      "Pick one question-heavy note.",
      "Write a closed-book answer before reading.",
      "Log the first miss as a mistake so the repair queue has something real to track."
    ],
    gradingHint: "Use grading only after an actual written attempt, even if the attempt is just 'I do not know'."
  };
}
