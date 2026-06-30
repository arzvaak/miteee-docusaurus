import assert from "node:assert/strict";
import test from "node:test";
import { buildFallbackStudyCoach, buildMistralStudyCoachPayload, buildStudyCoachPrompt, getStudyCoachProviderStatus, isGroundedCoachContent, parseStudyCoachModelResponse } from "../lib/study-coach";
import { buildMemoryAwareStudyTodayPlan } from "../lib/study-plan-personalization";
import { buildStudyTodayDiagnosisRepairInput, completeStudyTodayTask, logStudyTodayDiagnosisRepairOutcome, logStudyTodayRepairOutcome, resetStudyTodayTasks } from "../lib/study-today-memory";
import { buildStudyTodayPlan } from "../lib/study-system";
import { createEmptyLearnerMemory } from "../lib/learner-memory";
import type { Course, NoteIndexItem } from "../scripts/build-content-data";

type IndexedNote = Omit<NoteIndexItem, "content">;

function note(overrides: Partial<IndexedNote>): IndexedNote {
  return {
    slug: "note",
    title: "Note",
    sidebarLabel: "Note",
    sidebarPosition: null,
    description: "Reference note",
    tags: [],
    runnable: false,
    courseCode: "SEM6-MI",
    courseFolder: "sem6/mi",
    courseName: "Measurements & Instrumentation",
    level: "Semester 6",
    week: null,
    relativePath: "docs/sem6/mi/note.md",
    sourcePath: "docs/sem6/mi/note.md",
    excerpt: "Reference note excerpt",
    headings: [],
    stats: {
      codeBlocks: 0,
      mermaidBlocks: 0,
      mathBlocks: 0,
      details: 0,
      questionBlocks: 0,
      practicePrompts: 0
    },
    ...overrides
  };
}

const courses: Course[] = [
  {
    code: "SEM6-MI",
    folder: "sem6/mi",
    name: "Measurements & Instrumentation",
    level: "Semester 6",
    category: "Semester 6",
    noteCount: 12,
    runnableNoteCount: 1,
    questionCount: 24,
    syllabusSummary: [],
    quizSets: []
  },
  {
    code: "UPSC-CSE-POLITICAL-SCIENCE",
    folder: "upsc-cse/political-science",
    name: "UPSC CSE Political Science",
    level: "UPSC CSE",
    category: "UPSC CSE",
    noteCount: 6,
    runnableNoteCount: 0,
    questionCount: 8,
    syllabusSummary: [],
    quizSets: []
  }
];

test("study planner creates an evidence-backed daily loop from indexed notes", () => {
  const plan = buildStudyTodayPlan(
    [
      note({ slug: "question-bank", sidebarLabel: "PYQ Answer Bank", stats: { codeBlocks: 0, mermaidBlocks: 0, mathBlocks: 2, details: 1, questionBlocks: 14 } }),
      note({ slug: "formula-review", sidebarLabel: "Formula Review", week: 2, stats: { codeBlocks: 0, mermaidBlocks: 0, mathBlocks: 18, details: 0, questionBlocks: 2 } }),
      note({ slug: "upsc-polity", sidebarLabel: "Parliament", courseCode: "UPSC-CSE-POLITICAL-SCIENCE", courseName: "UPSC CSE Political Science", stats: { codeBlocks: 0, mermaidBlocks: 0, mathBlocks: 0, details: 0, questionBlocks: 4 } })
    ],
    courses
  );

  assert.equal(plan.totalMinutes, 90);
  assert.equal(plan.tasks.length, 4);
  assert.equal(plan.tasks[0]?.note?.slug, "question-bank");
  assert.equal(plan.tasks[1]?.note?.slug, "formula-review");
  assert.deepEqual(plan.focusMix, ["Measurements & Instrumentation", "UPSC CSE Political Science"]);
  assert.ok(plan.sources.some((source) => source.label === "Practice testing"));
  assert.deepEqual(plan.protocols.map((protocol) => protocol.method), ["retrieval", "spacing", "interleaving", "self-explanation"]);
  assert.ok(plan.protocols.every((protocol) => protocol.action.length > 24));
  assert.ok(plan.protocols.every((protocol) => protocol.avoid.length > 24));
  assert.ok(plan.protocols.some((protocol) => protocol.source.href.includes("16507066")));
});

test("study planner promotes due memory repair into the daily task budget", () => {
  const plan = buildStudyTodayPlan(
    [
      note({ slug: "question-bank", sidebarLabel: "PYQ Answer Bank", stats: { codeBlocks: 0, mermaidBlocks: 0, mathBlocks: 2, details: 1, questionBlocks: 14 } }),
      note({ slug: "formula-review", sidebarLabel: "Formula Review", week: 2, stats: { codeBlocks: 0, mermaidBlocks: 0, mathBlocks: 18, details: 0, questionBlocks: 2 } }),
      note({ slug: "upsc-polity", sidebarLabel: "Parliament", courseCode: "UPSC-CSE-POLITICAL-SCIENCE", courseName: "UPSC CSE Political Science", stats: { codeBlocks: 0, mermaidBlocks: 0, mathBlocks: 0, details: 0, questionBlocks: 4 } })
    ],
    courses
  );

  const personalized = buildMemoryAwareStudyTodayPlan(plan, {
    dueCards: [
      {
        id: "mistake:slip",
        source: "mistake",
        prompt: "Forgot to convert percentage slip before torque substitution.",
        dueAt: "2026-06-24T06:00:00.000Z",
        intervalDays: 1,
        repetitions: 0,
        lastReviewedAt: null,
        createdAt: "2026-06-24T06:00:00.000Z",
        mistakeId: "slip",
        slug: "question-bank",
        title: "PYQ Answer Bank",
        courseCode: "SEM5-EM2",
        courseName: "Electrical Machines II"
      }
    ],
    openMistakes: [],
    weakAttempts: [],
    summary: {
      readNotes: 1,
      totalReads: 1,
      mistakes: 1,
      openMistakes: 1,
      weakRevisionAttempts: 0,
      dueCards: 1,
      completedStudyBlocks: 0,
      completedStudyMinutes: 0,
      lastStudyAt: null
    }
  });

  assert.equal(personalized.totalMinutes, 90);
  assert.equal(personalized.tasks[0]?.id, "memory-repair");
  assert.equal(personalized.tasks[0]?.note?.slug, "question-bank");
  assert.match(personalized.tasks[0]?.prompt ?? "", /percentage slip/);
  assert.equal(personalized.tasks.some((task) => task.id === "error-log"), false);
  assert.ok(personalized.summary.includes("due memory repair"));
});

test("study planner promotes weak recall attempts into the daily task budget", () => {
  const plan = buildStudyTodayPlan(
    [
      note({ slug: "question-bank", sidebarLabel: "PYQ Answer Bank", stats: { codeBlocks: 0, mermaidBlocks: 0, mathBlocks: 2, details: 1, questionBlocks: 14 } }),
      note({ slug: "formula-review", sidebarLabel: "Formula Review", week: 2, stats: { codeBlocks: 0, mermaidBlocks: 0, mathBlocks: 18, details: 0, questionBlocks: 2 } })
    ],
    courses
  );

  const personalized = buildMemoryAwareStudyTodayPlan(plan, {
    dueCards: [],
    openMistakes: [],
    weakAttempts: [
      {
        id: "attempt:weak",
        cardId: "note:question-bank",
        source: "note",
        slug: "question-bank",
        title: "PYQ Answer Bank",
        courseCode: "SEM5-EM2",
        courseName: "Electrical Machines II",
        prompt: "Recall transformer ratio without opening note.",
        attempt: "I used the percent value directly.",
        grade: "hard",
        reviewedAt: "2026-06-24T07:00:00.000Z"
      }
    ],
    summary: {
      readNotes: 1,
      totalReads: 1,
      mistakes: 0,
      openMistakes: 0,
      weakRevisionAttempts: 1,
      dueCards: 0,
      completedStudyBlocks: 0,
      completedStudyMinutes: 0,
      lastStudyAt: null
    }
  });

  assert.equal(personalized.totalMinutes, 90);
  assert.equal(personalized.tasks[0]?.id, "attempt-repair");
  assert.equal(personalized.tasks[0]?.note?.slug, "question-bank");
  assert.equal(personalized.tasks[0]?.method, "self-explanation");
  assert.match(personalized.tasks[0]?.prompt ?? "", /I used the percent value directly/);
  assert.match(personalized.tasks[0]?.prompt ?? "", /Recall transformer ratio/);
  assert.deepEqual(personalized.tasks[0]?.checklist, [
    "Rewrite the failed attempt in one corrected rule.",
    "Answer the original prompt again with the note closed.",
    "Open the source note, compare, and log a mistake if the same gap remains."
  ]);
  assert.equal(personalized.tasks.some((task) => task.id === "error-log"), false);
  assert.ok(personalized.summary.includes("failed recall attempt"));
});

test("completeStudyTodayTask records activity and marks the source note read", () => {
  const completedAt = "2026-06-24T08:00:00.000Z";
  const plan = buildStudyTodayPlan(
    [
      note({
        slug: "question-bank",
        sidebarLabel: "PYQ Answer Bank",
        stats: { codeBlocks: 0, mermaidBlocks: 0, mathBlocks: 2, details: 1, questionBlocks: 14, practicePrompts: 0 }
      })
    ],
    courses
  );
  const task = plan.tasks[0];
  assert.ok(task);

  const memory = completeStudyTodayTask(createEmptyLearnerMemory(), task, completedAt);

  assert.equal(memory.studyActivity[0]?.taskId, task.id);
  assert.equal(memory.studyActivity[0]?.minutes, task.minutes);
  assert.equal(memory.notes["question-bank"]?.readCount, 1);
  assert.equal(memory.notes["question-bank"]?.lastReadAt, completedAt);
  assert.equal(memory.revisionCards["note:question-bank"]?.source, "note");
});

test("logStudyTodayRepairOutcome closes the repair loop with a durable mistake card", () => {
  const completedAt = "2026-06-24T08:30:00.000Z";
  const plan = buildStudyTodayPlan(
    [
      note({
        slug: "question-bank",
        sidebarLabel: "PYQ Answer Bank",
        stats: { codeBlocks: 0, mermaidBlocks: 0, mathBlocks: 2, details: 1, questionBlocks: 14, practicePrompts: 0 }
      })
    ],
    courses
  );
  const task = plan.tasks[0];
  assert.ok(task);

  const memory = logStudyTodayRepairOutcome(createEmptyLearnerMemory(), task, {
    id: "study-repair:2026-06-24:retrieval-sprint",
    missed: "Used percent slip directly during the recall sprint.",
    correction: "Convert percent slip to per-unit before substituting into the torque expression.",
    catchQuestion: "What must happen to percent slip before torque substitution?"
  }, completedAt);

  assert.equal(memory.studyActivity[0]?.taskId, task.id);
  assert.equal(memory.studyActivity[0]?.minutes, task.minutes);
  assert.equal(memory.notes["question-bank"]?.readCount, 1);
  assert.equal(memory.mistakes[0]?.id, "study-repair:2026-06-24:retrieval-sprint");
  assert.equal(memory.mistakes[0]?.mistake, "Used percent slip directly during the recall sprint.");
  assert.equal(memory.mistakes[0]?.correction, "Convert percent slip to per-unit before substituting into the torque expression.");
  assert.equal(memory.mistakes[0]?.catchQuestion, "What must happen to percent slip before torque substitution?");
  assert.equal(memory.revisionCards["mistake:study-repair:2026-06-24:retrieval-sprint"]?.dueAt, "2026-06-25T08:30:00.000Z");
});

test("study coach diagnosis can be saved as a durable repair card without completing the task", () => {
  const diagnosedAt = "2026-06-24T09:15:00.000Z";
  const plan = buildStudyTodayPlan(
    [
      note({
        slug: "question-bank",
        sidebarLabel: "PYQ Answer Bank",
        stats: { codeBlocks: 0, mermaidBlocks: 0, mathBlocks: 2, details: 1, questionBlocks: 14, practicePrompts: 0 }
      })
    ],
    courses
  );
  const task = plan.tasks[0];
  assert.ok(task);

  const repairInput = buildStudyTodayDiagnosisRepairInput({
    id: "coach-diagnosis:2026-06-24:retrieval-sprint",
    weaknesses: [
      "You substituted percent slip directly instead of converting it to per-unit slip.",
      "You skipped the condition before applying the torque expression."
    ],
    nextDrill: "Answer again: what must happen to percent slip before torque substitution?"
  });
  const memory = logStudyTodayDiagnosisRepairOutcome(createEmptyLearnerMemory(), task, repairInput, diagnosedAt);

  assert.equal(memory.studyActivity.length, 0);
  assert.equal(memory.mistakes[0]?.id, "coach-diagnosis:2026-06-24:retrieval-sprint");
  assert.equal(memory.mistakes[0]?.mistake, "You substituted percent slip directly instead of converting it to per-unit slip.");
  assert.equal(memory.mistakes[0]?.correction, "Repair with next drill: Answer again: what must happen to percent slip before torque substitution?");
  assert.equal(memory.mistakes[0]?.catchQuestion, "Answer again: what must happen to percent slip before torque substitution?");
  assert.equal(memory.revisionCards["mistake:coach-diagnosis:2026-06-24:retrieval-sprint"]?.dueAt, "2026-06-25T09:15:00.000Z");
});

test("resetStudyTodayTasks clears daily task activity but keeps durable note memory", () => {
  const completedAt = "2026-06-24T08:00:00.000Z";
  const resetAt = "2026-06-24T12:00:00.000Z";
  const plan = buildStudyTodayPlan(
    [
      note({
        slug: "question-bank",
        sidebarLabel: "PYQ Answer Bank",
        stats: { codeBlocks: 0, mermaidBlocks: 0, mathBlocks: 2, details: 1, questionBlocks: 14, practicePrompts: 0 }
      })
    ],
    courses
  );
  const taskIds = plan.tasks.map((task) => task.id);
  assert.ok(taskIds.length > 0);

  const completedMemory = plan.tasks.reduce(
    (memory, task) => completeStudyTodayTask(memory, task, completedAt),
    createEmptyLearnerMemory()
  );
  assert.ok(completedMemory.studyActivity.length > 0);

  const resetMemory = resetStudyTodayTasks(completedMemory, taskIds, resetAt);

  assert.equal(resetMemory.studyActivity.some((entry) => taskIds.includes(entry.taskId)), false);
  assert.equal(resetMemory.notes["question-bank"]?.readCount, completedMemory.notes["question-bank"]?.readCount);
  assert.equal(resetMemory.notes["question-bank"]?.lastReadAt, completedMemory.notes["question-bank"]?.lastReadAt);
  assert.equal(resetMemory.revisionCards["note:question-bank"]?.source, "note");
});

test("study coach fallback stays local and includes open tasks", () => {
  const plan = buildStudyTodayPlan([note({ slug: "question-bank", sidebarLabel: "PYQ Answer Bank", stats: { codeBlocks: 0, mermaidBlocks: 0, mathBlocks: 1, details: 0, questionBlocks: 8 } })], courses);
  const request = {
    mode: "balanced" as const,
    minutes: 90 as const,
    completedTaskIds: [],
    plan
  };

  const prompt = buildStudyCoachPrompt(request);
  const fallback = buildFallbackStudyCoach(request);

  assert.match(prompt, /retrieval practice/i);
  assert.equal(fallback.aiAvailable, false);
  assert.ok(fallback.bullets.join(" ").includes("PYQ Answer Bank"));
});

test("study coach prompt asks Mistral for grounded JSON only", () => {
  const plan = buildStudyTodayPlan([note({ slug: "question-bank", sidebarLabel: "PYQ Answer Bank", stats: { codeBlocks: 0, mermaidBlocks: 0, mathBlocks: 1, details: 0, questionBlocks: 8 } })], courses);
  const prompt = buildStudyCoachPrompt({
    mode: "balanced",
    minutes: 90,
    completedTaskIds: [],
    plan
  });

  assert.match(prompt, /Return JSON only/i);
  assert.match(prompt, /"bullets"/);
  assert.match(prompt, /No markdown/i);
  assert.match(prompt, /Do not invent/i);
});

test("study coach provider status supports Mistral and mistrak env aliases", () => {
  assert.deepEqual(getStudyCoachProviderStatus({}), {
    aiAvailable: false,
    model: null,
    provider: "local",
    label: "Local fallback ready"
  });

  assert.deepEqual(getStudyCoachProviderStatus({ MISTRAK_API_KEY: "dev-key" }), {
    aiAvailable: true,
    model: "mistral-small-latest",
    provider: "mistral",
    label: "Mistral ready"
  });

  assert.equal(getStudyCoachProviderStatus({ MISTRAL_API_KEY: "dev-key", MISTRAL_MODEL: "mistral-large-latest" }).model, "mistral-large-latest");
});

test("study coach Mistral payload requests JSON mode", () => {
  const plan = buildStudyTodayPlan([note({ slug: "question-bank", sidebarLabel: "PYQ Answer Bank", stats: { codeBlocks: 0, mermaidBlocks: 0, mathBlocks: 1, details: 0, questionBlocks: 8 } })], courses);
  const payload = buildMistralStudyCoachPayload("mistral-small-latest", {
    mode: "balanced",
    minutes: 90,
    completedTaskIds: [],
    plan
  });

  assert.equal(payload.model, "mistral-small-latest");
  assert.deepEqual(payload.response_format, { type: "json_object" });
  assert.match(payload.messages[0]?.content ?? "", /Return JSON only/i);
});

test("study coach uses learner memory priorities when mistakes are due", () => {
  const plan = buildStudyTodayPlan([note({ slug: "question-bank", sidebarLabel: "PYQ Answer Bank", stats: { codeBlocks: 0, mermaidBlocks: 0, mathBlocks: 1, details: 0, questionBlocks: 8 } })], courses);
  const request = {
    mode: "weakness-repair" as const,
    minutes: 45 as const,
    completedTaskIds: [],
    plan,
    memoryContext: {
      dueCards: [
        {
          source: "mistake" as const,
          title: "PYQ Answer Bank",
          prompt: "Forgot to convert percent slip. Correct rule: convert percent slip to per-unit before substitution.",
          courseCode: "SEM5-EM2",
          courseName: "Electrical Machines II"
        }
      ],
      openMistakes: [
        {
          title: "PYQ Answer Bank",
          mistake: "Forgot to convert percent slip.",
          correction: "Convert percent slip to per-unit before substitution.",
          catchQuestion: "What must happen to percent slip before torque substitution?",
          courseCode: "SEM5-EM2",
          courseName: "Electrical Machines II"
        }
      ],
      summary: {
        dueCards: 1,
        openMistakes: 1,
        readNotes: 3
      }
    }
  };

  const prompt = buildStudyCoachPrompt(request);
  const fallback = buildFallbackStudyCoach(request);

  assert.match(prompt, /Learner memory:/);
  assert.match(prompt, /Forgot to convert percent slip/);
  assert.match(prompt, /What must happen to percent slip before torque substitution/);
  assert.match(fallback.bullets[0] ?? "", /Forgot to convert percent slip/);
  assert.match(fallback.bullets[1] ?? "", /Convert percent slip to per-unit/);
  assert.match(fallback.bullets[1] ?? "", /What must happen to percent slip before torque substitution/);
});

test("study coach uses weak recall attempts when no due card is available", () => {
  const plan = buildStudyTodayPlan([note({ slug: "question-bank", sidebarLabel: "PYQ Answer Bank", stats: { codeBlocks: 0, mermaidBlocks: 0, mathBlocks: 1, details: 0, questionBlocks: 8 } })], courses);
  const request = {
    mode: "weakness-repair" as const,
    minutes: 45 as const,
    completedTaskIds: [],
    plan,
    memoryContext: {
      dueCards: [],
      openMistakes: [],
      weakAttempts: [
        {
          title: "PYQ Answer Bank",
          prompt: "Recall transformer ratio without opening note.",
          attempt: "I used the percent value directly.",
          grade: "hard" as const,
          courseCode: "SEM5-EM2",
          courseName: "Electrical Machines II"
        }
      ],
      summary: {
        dueCards: 0,
        openMistakes: 0,
        weakRevisionAttempts: 1,
        readNotes: 3
      }
    }
  };

  const prompt = buildStudyCoachPrompt(request);
  const fallback = buildFallbackStudyCoach(request);

  assert.match(prompt, /1 weak attempts/);
  assert.match(prompt, /I used the percent value directly/);
  assert.match(fallback.bullets[0] ?? "", /failed recall attempt/i);
  assert.match(fallback.bullets[0] ?? "", /I used the percent value directly/);
  assert.doesNotMatch(fallback.bullets[0] ?? "", /\.\./);
});

test("study coach surfaces aggregate weakness insight in fallback and Mistral prompt", () => {
  const plan = buildStudyTodayPlan([note({ slug: "question-bank", sidebarLabel: "PYQ Answer Bank", stats: { codeBlocks: 0, mermaidBlocks: 0, mathBlocks: 1, details: 0, questionBlocks: 8 } })], courses);
  const request = {
    mode: "balanced" as const,
    minutes: 90 as const,
    completedTaskIds: [],
    plan,
    memoryContext: {
      dueCards: [],
      openMistakes: [],
      weakAttempts: [],
      weaknessInsight: {
        hasSignals: true,
        topCourse: {
          courseCode: "SEM5-EM2",
          courseName: "Electrical Machines II",
          label: "Electrical Machines II",
          score: 6,
          openMistakes: 1,
          weakAttempts: 1,
          dueCards: 1
        },
        topTheme: {
          theme: "Formula selection" as const,
          count: 2,
          courseCount: 1,
          examples: ["Used percent slip directly in the torque formula."]
        },
        nextAction: "Review Electrical Machines II: do one closed-book repair focused on Formula selection.",
        courseInsights: [],
        themeInsights: []
      },
      summary: {
        dueCards: 0,
        openMistakes: 0,
        weakRevisionAttempts: 0,
        readNotes: 3
      }
    }
  };

  const prompt = buildStudyCoachPrompt(request);
  const fallback = buildFallbackStudyCoach(request);

  assert.match(prompt, /Top weakness course: Electrical Machines II/);
  assert.match(prompt, /Recurring weakness theme: Formula selection/);
  assert.match(prompt, /closed-book repair focused on Formula selection/);
  assert.match(fallback.bullets.join(" "), /Electrical Machines II/);
  assert.match(fallback.bullets.join(" "), /Formula selection/);
  assert.match(fallback.bullets.join(" "), /closed-book repair/);
});

test("study coach uses partial checklist progress before adding new repair work", () => {
  const plan = buildStudyTodayPlan([note({ slug: "question-bank", sidebarLabel: "PYQ Answer Bank", stats: { codeBlocks: 0, mermaidBlocks: 0, mathBlocks: 1, details: 0, questionBlocks: 8 } })], courses);
  const request = {
    mode: "weakness-repair" as const,
    minutes: 45 as const,
    completedTaskIds: [],
    plan,
    taskProgress: [
      {
        taskId: "attempt-repair",
        title: "Repair failed recall",
        completedChecklistItems: 1,
        totalChecklistItems: 3,
        label: "1/3 repair steps"
      }
    ]
  };

  const prompt = buildStudyCoachPrompt(request);
  const fallback = buildFallbackStudyCoach(request);

  assert.match(prompt, /Task progress:/);
  assert.match(prompt, /Repair failed recall: 1\/3 repair steps/);
  assert.match(fallback.bullets[0] ?? "", /Continue Repair failed recall at 1\/3 repair steps/);
  assert.match(fallback.bullets[0] ?? "", /next unchecked repair step/i);
});

test("study coach rejects model output that drops the supplied weak recall attempt", () => {
  const plan = buildStudyTodayPlan([note({ slug: "question-bank", sidebarLabel: "PYQ Answer Bank", stats: { codeBlocks: 0, mermaidBlocks: 0, mathBlocks: 1, details: 0, questionBlocks: 8 } })], courses);
  const request = {
    mode: "balanced" as const,
    minutes: 90 as const,
    completedTaskIds: [],
    plan,
    memoryContext: {
      dueCards: [],
      openMistakes: [],
      weakAttempts: [
        {
          title: "PYQ Answer Bank",
          prompt: "Recall transformer ratio without opening note.",
          attempt: "Coach memory test: I used the percent value directly.",
          grade: "again" as const,
          courseCode: "SEM5-EM2",
          courseName: "Electrical Machines II"
        }
      ],
      summary: {
        dueCards: 0,
        openMistakes: 0,
        weakRevisionAttempts: 1,
        readNotes: 1
      }
    }
  };

  assert.equal(isGroundedCoachContent("Start with PYQ Answer Bank and review transformer formulas.", request), false);
  assert.equal(isGroundedCoachContent("Start with Coach memory test: I used the percent value directly.", request), true);
});

test("study coach rejects model output that drops the supplied memory mistake", () => {
  const plan = buildStudyTodayPlan([note({ slug: "question-bank", sidebarLabel: "PYQ Answer Bank", stats: { codeBlocks: 0, mermaidBlocks: 0, mathBlocks: 1, details: 0, questionBlocks: 8 } })], courses);
  const request = {
    mode: "balanced" as const,
    minutes: 90 as const,
    completedTaskIds: [],
    plan,
    memoryContext: {
      dueCards: [
        {
          source: "mistake" as const,
          title: "PYQ Answer Bank",
          prompt: "Coach memory test: forgot to convert percent slip before using torque formula.",
          courseCode: "SEM5-EM2",
          courseName: "Electrical Machines II"
        }
      ],
      openMistakes: [],
      summary: {
        dueCards: 1,
        openMistakes: 0,
        readNotes: 1
      }
    }
  };

  assert.equal(isGroundedCoachContent("Start with PYQ Answer Bank and review torque formulas.", request), false);
  assert.equal(isGroundedCoachContent("Start with Coach memory test: forgot to convert percent slip before using torque formula.", request), true);
});

test("study coach parses structured grounded Mistral JSON", () => {
  const plan = buildStudyTodayPlan([note({ slug: "question-bank", sidebarLabel: "PYQ Answer Bank", stats: { codeBlocks: 0, mermaidBlocks: 0, mathBlocks: 1, details: 0, questionBlocks: 8 } })], courses);
  const request = {
    mode: "weakness-repair" as const,
    minutes: 45 as const,
    completedTaskIds: [],
    plan,
    memoryContext: {
      dueCards: [
        {
          source: "mistake" as const,
          title: "PYQ Answer Bank",
          prompt: "Coach memory test: forgot to convert percent slip before using torque formula.",
          courseCode: "SEM5-EM2",
          courseName: "Electrical Machines II"
        }
      ],
      openMistakes: [],
      summary: {
        dueCards: 1,
        openMistakes: 0,
        readNotes: 1
      }
    }
  };

  const parsed = parseStudyCoachModelResponse(JSON.stringify({
    message: "Grounded Mistral plan for the current queue.",
    bullets: [
      "Start with Coach memory test: forgot to convert percent slip before using torque formula.",
      "Close PYQ Answer Bank and write the conversion rule before opening the answer.",
      "Use one nearby question to test the same rule.",
      "Stop at 45 minutes and log the miss if the rule still slips."
    ]
  }), "mistral-small-latest", request);

  assert.equal(parsed.accepted, true);
  assert.equal(parsed.response.aiAvailable, true);
  assert.equal(parsed.response.model, "mistral-small-latest");
  assert.equal(parsed.response.bullets.length, 4);
});

test("study coach trims extra structured Mistral bullets instead of rejecting the plan", () => {
  const plan = buildStudyTodayPlan([note({ slug: "question-bank", sidebarLabel: "PYQ Answer Bank", stats: { codeBlocks: 0, mermaidBlocks: 0, mathBlocks: 1, details: 0, questionBlocks: 8 } })], courses);
  const parsed = parseStudyCoachModelResponse(JSON.stringify({
    message: "Grounded Mistral plan for the current queue.",
    bullets: [
      "Start with PYQ Answer Bank and hide answer sections.",
      "Write answers from memory before opening the source.",
      "Switch to a different subject after the first block.",
      "Log the weakest rule for tomorrow.",
      "Ignore this extra fifth bullet."
    ]
  }), "mistral-small-latest", {
    mode: "balanced",
    minutes: 90,
    completedTaskIds: [],
    plan
  });

  assert.equal(parsed.accepted, true);
  assert.equal(parsed.response.bullets.length, 4);
  assert.equal(parsed.response.bullets.includes("Ignore this extra fifth bullet."), false);
});

test("study coach rejects structured Mistral JSON with too few bullets", () => {
  const plan = buildStudyTodayPlan([note({ slug: "question-bank", sidebarLabel: "PYQ Answer Bank", stats: { codeBlocks: 0, mermaidBlocks: 0, mathBlocks: 1, details: 0, questionBlocks: 8 } })], courses);
  const parsed = parseStudyCoachModelResponse(JSON.stringify({
    message: "Too short.",
    bullets: [
      "Start with PYQ Answer Bank.",
      "Stop early."
    ]
  }), "mistral-small-latest", {
    mode: "balanced",
    minutes: 90,
    completedTaskIds: [],
    plan
  });

  assert.equal(parsed.accepted, false);
});

test("study coach refuses structured Mistral JSON that ignores learner memory", () => {
  const plan = buildStudyTodayPlan([note({ slug: "question-bank", sidebarLabel: "PYQ Answer Bank", stats: { codeBlocks: 0, mermaidBlocks: 0, mathBlocks: 1, details: 0, questionBlocks: 8 } })], courses);
  const request = {
    mode: "balanced" as const,
    minutes: 90 as const,
    completedTaskIds: [],
    plan,
    memoryContext: {
      dueCards: [
        {
          source: "mistake" as const,
          title: "PYQ Answer Bank",
          prompt: "Coach memory test: forgot to convert percent slip before using torque formula.",
          courseCode: "SEM5-EM2",
          courseName: "Electrical Machines II"
        }
      ],
      openMistakes: [],
      summary: {
        dueCards: 1,
        openMistakes: 0,
        readNotes: 1
      }
    }
  };

  const parsed = parseStudyCoachModelResponse(JSON.stringify({
    message: "Generic plan.",
    bullets: [
      "Read the chapter carefully.",
      "Summarize the main idea.",
      "Review formulas.",
      "Take a short break."
    ]
  }), "mistral-small-latest", request);

  assert.equal(parsed.accepted, false);
  assert.ok(parsed.reason);
  assert.match(parsed.reason, /dropped|outside/i);
});

test("study coach refuses malformed JSON-looking Mistral output instead of showing raw fragments", () => {
  const plan = buildStudyTodayPlan([note({ slug: "question-bank", sidebarLabel: "PYQ Answer Bank", stats: { codeBlocks: 0, mermaidBlocks: 0, mathBlocks: 1, details: 0, questionBlocks: 8 } })], courses);
  const parsed = parseStudyCoachModelResponse(`{"message":"Start with retrieval.",
"bullets":["Open PYQ Answer Bank and hide answer sections.",
"Compare your answer with the note.",
"Write one corrected rule.",
"Stop at the timer."`, "mistral-small-latest", {
    mode: "balanced",
    minutes: 90,
    completedTaskIds: [],
    plan
  });

  assert.equal(parsed.accepted, false);
  assert.equal(parsed.response.bullets.length, 0);
  assert.ok(parsed.reason);
  assert.match(parsed.reason, /expected/i);
});

test("study coach fallback diagnoses a written answer against supplied context", () => {
  const diagnosis = buildFallbackStudyCoach({
    requestType: "diagnose",
    prompt: "What must happen to percent slip before torque substitution?",
    userAnswer: "I directly substituted 5 percent as the slip value.",
    sourceContext: "Convert percent slip to per-unit slip before substituting into the torque expression.",
    noteLabel: "PYQ Answer Bank",
    courseName: "Electrical Machines II"
  });

  assert.equal(diagnosis.aiAvailable, false);
  assert.equal(diagnosis.responseType, "diagnosis");
  assert.ok(diagnosis.diagnosis.weaknesses.join(" ").includes("per-unit"));
  assert.match(diagnosis.diagnosis.nextDrill, /percent slip/i);
  assert.equal(diagnosis.bullets.length, 4);
});

test("study coach fallback diagnoses answers gracefully without source context", () => {
  const diagnosis = buildFallbackStudyCoach({
    requestType: "diagnose",
    prompt: "State the rule before applying the formula.",
    userAnswer: "I wrote the final formula but skipped the condition.",
    noteLabel: "Formula Review"
  });

  assert.equal(diagnosis.aiAvailable, false);
  assert.equal(diagnosis.responseType, "diagnosis");
  assert.match(diagnosis.message, /Local fallback diagnosis/i);
  assert.match(diagnosis.diagnosis.weaknesses[0] ?? "", /too thin|missing step|condition/i);
  assert.match(diagnosis.diagnosis.nextDrill, /State the rule/i);
});

test("study coach Mistral payload requests grounded answer diagnosis JSON", () => {
  const payload = buildMistralStudyCoachPayload("mistral-small-latest", {
    requestType: "diagnose",
    prompt: "What must happen to percent slip before torque substitution?",
    userAnswer: "I directly substituted 5 percent as the slip value.",
    sourceContext: "Convert percent slip to per-unit slip before substituting into the torque expression.",
    noteLabel: "PYQ Answer Bank",
    courseName: "Electrical Machines II"
  });

  assert.equal(payload.response_format.type, "json_object");
  assert.match(payload.messages[0]?.content ?? "", /answer-diagnosis/i);
  assert.match(payload.messages[0]?.content ?? "", /weaknesses/);
  assert.match(payload.messages[0]?.content ?? "", /Next drill/i);
  assert.match(payload.messages[0]?.content ?? "", /PYQ Answer Bank/);
});

test("study coach parses grounded Mistral answer diagnosis", () => {
  const parsed = parseStudyCoachModelResponse(JSON.stringify({
    message: "Your answer shows the right topic but misses the conversion step.",
    strengths: ["You identified percent slip as the relevant quantity."],
    weaknesses: ["You substituted percent slip directly instead of converting it to per-unit slip."],
    nextDrill: "Answer again: what must happen to percent slip before torque substitution?"
  }), "mistral-small-latest", {
    requestType: "diagnose",
    prompt: "What must happen to percent slip before torque substitution?",
    userAnswer: "I directly substituted 5 percent as the slip value.",
    sourceContext: "Convert percent slip to per-unit slip before substituting into the torque expression.",
    noteLabel: "PYQ Answer Bank",
    courseName: "Electrical Machines II"
  });

  assert.equal(parsed.accepted, true);
  assert.equal(parsed.response.aiAvailable, true);
  assert.equal(parsed.response.responseType, "diagnosis");
  assert.match(parsed.response.diagnosis.weaknesses[0] ?? "", /per-unit slip/);
  assert.match(parsed.response.diagnosis.nextDrill, /percent slip/);
});

test("study coach rejects ungrounded Mistral answer diagnosis", () => {
  const parsed = parseStudyCoachModelResponse(JSON.stringify({
    message: "You need to memorize induction motor starting methods.",
    strengths: ["You know something about machines."],
    weaknesses: ["You did not discuss star-delta starters or rotor resistance."],
    nextDrill: "For example, list three starter circuits."
  }), "mistral-small-latest", {
    requestType: "diagnose",
    prompt: "What must happen to percent slip before torque substitution?",
    userAnswer: "I directly substituted 5 percent as the slip value.",
    sourceContext: "Convert percent slip to per-unit slip before substituting into the torque expression.",
    noteLabel: "PYQ Answer Bank",
    courseName: "Electrical Machines II"
  });

  assert.equal(parsed.accepted, false);
  assert.match(parsed.reason ?? "", /outside|grounded/i);
});
