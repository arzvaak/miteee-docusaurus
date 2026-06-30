import assert from "node:assert/strict";
import test from "node:test";
import {
  addMistake,
  buildLearnerMemoryBriefing,
  buildLearnerWeaknessInsight,
  buildLearnerMemoryPriority,
  buildLearnerMemoryBackup,
  createEmptyLearnerMemory,
  getDueRevisionCards,
  getLearnerMemoryStats,
  getStudyMethodBalance,
  getStudyMomentum,
  getStudyNudge,
  parseLearnerMemory,
  recordStudyTaskCompletion,
  recordNoteRead,
  removeStudyTaskCompletion,
  restoreLearnerMemoryBackup,
  reviewRevisionCard,
  reviewRevisionCardWithAttempt
} from "../lib/learner-memory";

const now = "2026-06-24T06:00:00.000Z";
const note = {
  slug: "sem5-em2-pyq-answer-bank",
  title: "PYQ Answer Bank",
  courseCode: "SEM5-EM2",
  courseName: "Electrical Machines II"
};

const upscNote = {
  slug: "upsc-polity-parliament",
  title: "Parliament",
  courseCode: "UPSC-CSE-POLITICAL-SCIENCE",
  courseName: "UPSC CSE Political Science"
};

const studyTask = {
  id: "retrieval",
  title: "Retrieval sprint",
  method: "retrieval" as const,
  minutes: 30,
  note
};

test("recordNoteRead stores note progress and creates a due revision card", () => {
  const memory = recordNoteRead(createEmptyLearnerMemory(), note, now);

  assert.equal(memory.notes[note.slug]?.readCount, 1);
  assert.equal(memory.notes[note.slug]?.lastReadAt, now);
  assert.equal(memory.revisionCards[`note:${note.slug}`]?.source, "note");
  assert.equal(memory.revisionCards[`note:${note.slug}`]?.dueAt, "2026-06-25T06:00:00.000Z");
});

test("addMistake creates a mistake entry and prioritizes it in the due queue", () => {
  const memory = addMistake(createEmptyLearnerMemory(), note, {
    id: "m1",
    createdAt: now,
    mistake: "Confused synchronous speed with rotor speed.",
    correction: "Slip is based on the difference between synchronous and rotor speed.",
    catchQuestion: "Which speed belongs in the slip numerator?"
  });

  assert.equal(memory.mistakes[0]?.mistake, "Confused synchronous speed with rotor speed.");
  assert.equal(memory.mistakes[0]?.catchQuestion, "Which speed belongs in the slip numerator?");
  assert.equal(memory.revisionCards["mistake:m1"]?.source, "mistake");
  assert.match(memory.revisionCards["mistake:m1"]?.prompt ?? "", /Catch question: Which speed belongs in the slip numerator/);

  const due = getDueRevisionCards(memory, now);
  assert.equal(due[0]?.id, "mistake:m1");
});

test("buildLearnerMemoryPriority surfaces due cards and open mistakes for Study Today", () => {
  const withRead = recordNoteRead(createEmptyLearnerMemory(), note, "2026-06-23T06:00:00.000Z");
  const withOlderMistake = addMistake(withRead, note, {
    id: "older",
    createdAt: "2026-06-23T08:00:00.000Z",
    mistake: "Used the wrong induced-emf sign.",
    correction: "Keep generator and motor sign conventions separate."
  });
  const withNewestMistake = addMistake(withOlderMistake, note, {
    id: "newest",
    createdAt: "2026-06-24T05:00:00.000Z",
    mistake: "Skipped the slip conversion.",
    correction: "Convert percentage slip to per-unit before substitution."
  });

  const priority = buildLearnerMemoryPriority(withNewestMistake, now, 2);

  assert.equal(priority.summary.dueCards, 3);
  assert.equal(priority.summary.openMistakes, 2);
  assert.equal(priority.dueCards[0]?.id, "mistake:older");
  assert.equal(priority.dueCards[1]?.id, "mistake:newest");
  assert.equal(priority.openMistakes[0]?.id, "newest");
  assert.equal(priority.openMistakes[1]?.id, "older");
});

test("reviewRevisionCard reschedules cards based on recall quality", () => {
  const withRead = recordNoteRead(createEmptyLearnerMemory(), note, now);
  const reviewed = reviewRevisionCard(withRead, `note:${note.slug}`, "good", "2026-06-25T06:00:00.000Z");

  assert.equal(reviewed.revisionCards[`note:${note.slug}`]?.repetitions, 1);
  assert.equal(reviewed.revisionCards[`note:${note.slug}`]?.intervalDays, 2);
  assert.equal(reviewed.revisionCards[`note:${note.slug}`]?.dueAt, "2026-06-27T06:00:00.000Z");
});

test("reviewRevisionCard keeps hard mistake reviews open until recall is good", () => {
  const withMistake = addMistake(createEmptyLearnerMemory(), note, {
    id: "slip",
    createdAt: now,
    mistake: "Forgot slip conversion before torque substitution.",
    correction: "Convert percentage slip to per-unit before substitution."
  });
  const hard = reviewRevisionCard(withMistake, "mistake:slip", "hard", "2026-06-24T07:00:00.000Z");
  const good = reviewRevisionCard(withMistake, "mistake:slip", "good", "2026-06-24T07:00:00.000Z");

  assert.equal(hard.mistakes[0]?.resolvedAt, null);
  assert.equal(getLearnerMemoryStats(hard, "2026-06-24T07:05:00.000Z").openMistakes, 1);
  assert.equal(good.mistakes[0]?.resolvedAt, "2026-06-24T07:00:00.000Z");
  assert.equal(getLearnerMemoryStats(good, "2026-06-24T07:05:00.000Z").openMistakes, 0);
});

test("reviewRevisionCardWithAttempt stores the written recall attempt with the grade", () => {
  const withMistake = addMistake(createEmptyLearnerMemory(), note, {
    id: "ratio",
    createdAt: now,
    mistake: "Mixed up transformer voltage ratio with current ratio.",
    correction: "Current ratio is inverse to turns ratio.",
    catchQuestion: "Which ratio flips for current?"
  });

  const reviewed = reviewRevisionCardWithAttempt(withMistake, "mistake:ratio", "good", " current ratio flips the turns ratio ", "2026-06-24T07:00:00.000Z");

  assert.equal(reviewed.revisionCards["mistake:ratio"]?.repetitions, 1);
  assert.equal(reviewed.mistakes[0]?.resolvedAt, "2026-06-24T07:00:00.000Z");
  assert.equal(reviewed.revisionAttempts[0]?.cardId, "mistake:ratio");
  assert.equal(reviewed.revisionAttempts[0]?.grade, "good");
  assert.equal(reviewed.revisionAttempts[0]?.attempt, "current ratio flips the turns ratio");
  assert.equal(reviewed.revisionAttempts[0]?.prompt, withMistake.revisionCards["mistake:ratio"]?.prompt);
  assert.equal(reviewed.revisionAttempts[0]?.reviewedAt, "2026-06-24T07:00:00.000Z");
});

test("buildLearnerMemoryPriority surfaces recent weak revision attempts", () => {
  const withRead = recordNoteRead(createEmptyLearnerMemory(), note, "2026-06-23T06:00:00.000Z");
  const hardReview = reviewRevisionCardWithAttempt(withRead, `note:${note.slug}`, "hard", "Used percent value directly.", "2026-06-24T07:00:00.000Z");
  const easyReview = reviewRevisionCardWithAttempt(hardReview, `note:${note.slug}`, "easy", "Converted the value before substituting.", "2026-06-24T08:00:00.000Z");

  const priority = buildLearnerMemoryPriority(easyReview, "2026-06-24T09:00:00.000Z", 2);

  assert.equal(priority.summary.weakRevisionAttempts, 1);
  assert.equal(priority.weakAttempts[0]?.grade, "hard");
  assert.equal(priority.weakAttempts[0]?.attempt, "Used percent value directly.");
  assert.equal(priority.weakAttempts.some((attempt) => attempt.grade === "easy"), false);
});

test("buildLearnerWeaknessInsight returns an empty local-memory state without pressure", () => {
  const insight = buildLearnerWeaknessInsight(createEmptyLearnerMemory(), now);

  assert.equal(insight.hasSignals, false);
  assert.equal(insight.topCourse, null);
  assert.equal(insight.topTheme, null);
  assert.equal(insight.nextAction, "Seed learner memory with one graded recall attempt or logged mistake.");
  assert.deepEqual(insight.courseInsights, []);
  assert.deepEqual(insight.themeInsights, []);
});

test("buildLearnerWeaknessInsight ranks courses from open mistakes, weak attempts, and due cards", () => {
  const withEmMistake = addMistake(createEmptyLearnerMemory(), note, {
    id: "em-slip",
    createdAt: "2026-06-24T05:00:00.000Z",
    mistake: "Used percent slip directly in the torque formula.",
    correction: "Convert percentage slip to per-unit before formula substitution."
  });
  const withUpscMistake = addMistake(withEmMistake, upscNote, {
    id: "upsc-bill",
    createdAt: "2026-06-24T05:15:00.000Z",
    mistake: "Forgot who certifies a money bill.",
    correction: "The Speaker certifies a money bill."
  });
  const withEmAttempt = {
    ...withUpscMistake,
    revisionAttempts: [
      {
        ...note,
        id: "attempt:em-hard",
        cardId: "mistake:em-slip",
        source: "mistake" as const,
        prompt: "Repair slip conversion.",
        attempt: "I used the percent value directly again.",
        grade: "hard" as const,
        reviewedAt: "2026-06-24T07:00:00.000Z"
      }
    ]
  };

  const insight = buildLearnerWeaknessInsight(withEmAttempt, "2026-06-24T08:00:00.000Z");

  assert.equal(insight.hasSignals, true);
  assert.equal(insight.topCourse?.courseCode, "SEM5-EM2");
  assert.equal(insight.topCourse?.label, "Electrical Machines II");
  assert.equal(insight.topCourse?.openMistakes, 1);
  assert.equal(insight.topCourse?.weakAttempts, 1);
  assert.equal(insight.topCourse?.dueCards, 1);
  assert.equal(insight.courseInsights[1]?.courseCode, "UPSC-CSE-POLITICAL-SCIENCE");
  assert.match(insight.nextAction, /Electrical Machines II/);
  assert.match(insight.nextAction, /formula/i);
});

test("buildLearnerWeaknessInsight groups recurring repair themes across courses", () => {
  const em = addMistake(createEmptyLearnerMemory(), note, {
    id: "em-formula",
    createdAt: "2026-06-24T05:00:00.000Z",
    mistake: "Used the wrong torque formula.",
    correction: "Pick the formula after identifying the operating region."
  });
  const upsc = addMistake(em, upscNote, {
    id: "upsc-definition",
    createdAt: "2026-06-24T05:30:00.000Z",
    mistake: "Forgot the definition of a money bill.",
    correction: "Memorize the Article 110 definition before examples."
  });
  const memory = {
    ...upsc,
    revisionAttempts: [
      {
        ...upscNote,
        id: "attempt:upsc-definition",
        cardId: "mistake:upsc-definition",
        source: "mistake" as const,
        prompt: "Recall the definition.",
        attempt: "I confused the definition with ordinary financial bills.",
        grade: "again" as const,
        reviewedAt: "2026-06-24T07:00:00.000Z"
      }
    ]
  };

  const insight = buildLearnerWeaknessInsight(memory, "2026-06-24T08:00:00.000Z");

  assert.equal(insight.topTheme?.theme, "Definition recall");
  assert.equal(insight.topTheme?.count, 2);
  assert.equal(insight.topTheme?.courseCount, 1);
  assert.equal(insight.themeInsights[1]?.theme, "Formula selection");
  assert.match(insight.nextAction, /Definition recall/);
});

test("getStudyNudge prioritizes weak recall attempts after due cards", () => {
  const memory = {
    ...createEmptyLearnerMemory(),
    revisionAttempts: [
      {
        ...note,
        id: "attempt:weak",
        cardId: `note:${note.slug}`,
        source: "note" as const,
        prompt: "Recall the transformer ratio.",
        attempt: "I used the percent value directly.",
        grade: "again" as const,
        reviewedAt: "2026-06-24T07:00:00.000Z"
      }
    ]
  };

  const nudge = getStudyNudge(memory, "2026-06-24T09:00:00.000Z");

  assert.equal(nudge.kind, "attempt-repair");
  assert.match(nudge.title, /failed recall/i);
  assert.match(nudge.body, /I used the percent value directly/);
  assert.equal(nudge.href, `/notes/${note.slug}`);
});

test("buildLearnerMemoryBriefing prioritizes weak recall attempts before generic momentum", () => {
  const withStudy = recordStudyTaskCompletion(createEmptyLearnerMemory(), studyTask, "2026-06-24T06:00:00.000Z");
  const memory = {
    ...withStudy,
    revisionAttempts: [
      {
        ...note,
        id: "attempt:hard",
        cardId: `note:${note.slug}`,
        source: "note" as const,
        prompt: "Recall the transformer ratio.",
        attempt: "I used the percent value directly.",
        grade: "hard" as const,
        reviewedAt: "2026-06-24T07:00:00.000Z"
      }
    ]
  };

  const briefing = buildLearnerMemoryBriefing(memory, "2026-06-24T09:00:00.000Z");

  assert.equal(briefing.tone, "attempt");
  assert.equal(briefing.title, "Repair failed recall: PYQ Answer Bank");
  assert.equal(briefing.href, `/notes/${note.slug}`);
  assert.equal(briefing.primaryLabel, "Repair attempt");
  assert.match(briefing.body, /I used the percent value directly/);
});

test("parseLearnerMemory rejects invalid persisted data safely", () => {
  const parsed = parseLearnerMemory("{ bad json");
  const stats = getLearnerMemoryStats(parsed, now);

  assert.equal(stats.readNotes, 0);
  assert.equal(stats.mistakes, 0);
  assert.equal(stats.dueCards, 0);
});

test("parseLearnerMemory migrates older memory without study activity", () => {
  const parsed = parseLearnerMemory(JSON.stringify({
    version: 1,
    notes: {},
    mistakes: [],
    revisionCards: {}
  }));

  assert.deepEqual(parsed.studyActivity, []);
  assert.deepEqual(parsed.revisionAttempts, []);
});

test("parseLearnerMemory backfills older mistakes without catch questions", () => {
  const parsed = parseLearnerMemory(JSON.stringify({
    version: 1,
    notes: {},
    mistakes: [
      {
        ...note,
        id: "old-slip",
        createdAt: now,
        mistake: "Old mistake text",
        correction: "Old correction text",
        resolvedAt: null
      }
    ],
    revisionCards: {},
    studyActivity: []
  }));

  assert.equal(parsed.mistakes[0]?.catchQuestion, null);
});

test("recordStudyTaskCompletion stores durable daily study activity without double counting", () => {
  const once = recordStudyTaskCompletion(createEmptyLearnerMemory(), studyTask, now);
  const twice = recordStudyTaskCompletion(once, studyTask, "2026-06-24T07:00:00.000Z");
  const nextDay = recordStudyTaskCompletion(twice, studyTask, "2026-06-25T07:00:00.000Z");

  assert.equal(twice.studyActivity.length, 1);
  assert.equal(twice.studyActivity[0]?.completedAt, "2026-06-24T07:00:00.000Z");
  assert.equal(twice.studyActivity[0]?.minutes, 30);

  const stats = getLearnerMemoryStats(nextDay, "2026-06-25T08:00:00.000Z");
  assert.equal(stats.completedStudyBlocks, 2);
  assert.equal(stats.completedStudyMinutes, 60);
  assert.equal(stats.lastStudyAt, "2026-06-25T07:00:00.000Z");
});

test("removeStudyTaskCompletion reverses a daily study activity without touching other days", () => {
  const today = recordStudyTaskCompletion(createEmptyLearnerMemory(), studyTask, now);
  const tomorrow = recordStudyTaskCompletion(today, { ...studyTask, title: "Tomorrow retrieval" }, "2026-06-25T06:00:00.000Z");
  const removed = removeStudyTaskCompletion(tomorrow, studyTask.id, now);

  assert.equal(getLearnerMemoryStats(tomorrow, "2026-06-25T07:00:00.000Z").completedStudyBlocks, 2);
  assert.equal(getLearnerMemoryStats(removed, "2026-06-25T07:00:00.000Z").completedStudyBlocks, 1);
  assert.equal(getLearnerMemoryStats(removed, "2026-06-25T07:00:00.000Z").completedStudyMinutes, 30);
  assert.equal(removed.studyActivity[0]?.title, "Tomorrow retrieval");
});

test("getStudyMomentum summarizes recent minutes, streak, methods, and blocks", () => {
  const withOld = recordStudyTaskCompletion(createEmptyLearnerMemory(), {
    ...studyTask,
    id: "old",
    method: "spacing",
    minutes: 45
  }, "2026-06-10T06:00:00.000Z");
  const withThreeDaysAgo = recordStudyTaskCompletion(withOld, {
    ...studyTask,
    id: "three-days-ago",
    method: "interleaving",
    minutes: 20
  }, "2026-06-22T06:00:00.000Z");
  const withYesterday = recordStudyTaskCompletion(withThreeDaysAgo, {
    ...studyTask,
    id: "yesterday",
    method: "spacing",
    minutes: 25
  }, "2026-06-24T06:00:00.000Z");
  const withToday = recordStudyTaskCompletion(withYesterday, {
    ...studyTask,
    id: "today",
    method: "retrieval",
    minutes: 30
  }, "2026-06-25T06:00:00.000Z");

  const momentum = getStudyMomentum(withToday, "2026-06-25T08:00:00.000Z", 7);

  assert.equal(momentum.todayMinutes, 30);
  assert.equal(momentum.weekMinutes, 75);
  assert.equal(momentum.currentStreakDays, 2);
  assert.equal(momentum.methodMinutes.retrieval, 30);
  assert.equal(momentum.methodMinutes.spacing, 25);
  assert.equal(momentum.methodMinutes.interleaving, 20);
  assert.equal(momentum.recentActivity[0]?.taskId, "today");
  assert.equal(momentum.recentActivity.some((activity) => activity.taskId === "old"), false);
});

test("getStudyMethodBalance starts an empty week with retrieval practice", () => {
  const balance = getStudyMethodBalance(createEmptyLearnerMemory(), now, 7);

  assert.equal(balance.weekMinutes, 0);
  assert.equal(balance.nextMethod, "retrieval");
  assert.match(balance.summary, /closed-book/i);
  assert.deepEqual(balance.items.map((item) => item.status), ["empty", "empty", "empty", "empty"]);
});

test("getStudyMethodBalance surfaces the lowest missing method in an unbalanced week", () => {
  const withRetrieval = recordStudyTaskCompletion(createEmptyLearnerMemory(), {
    ...studyTask,
    id: "retrieval-heavy",
    method: "retrieval",
    minutes: 80
  }, "2026-06-24T06:00:00.000Z");
  const withSpacing = recordStudyTaskCompletion(withRetrieval, {
    ...studyTask,
    id: "spacing-light",
    method: "spacing",
    minutes: 10
  }, "2026-06-24T07:00:00.000Z");

  const balance = getStudyMethodBalance(withSpacing, "2026-06-25T06:00:00.000Z", 7);

  assert.equal(balance.weekMinutes, 90);
  assert.equal(balance.nextMethod, "interleaving");
  assert.equal(balance.items.find((item) => item.method === "retrieval")?.status, "on-track");
  assert.equal(balance.items.find((item) => item.method === "interleaving")?.status, "low");
  assert.equal(balance.items.find((item) => item.method === "self-explanation")?.status, "low");
  assert.match(balance.summary, /interleaving/i);
});

test("getStudyNudge prioritizes due repair before momentum advice", () => {
  const withMistake = addMistake(createEmptyLearnerMemory(), note, {
    id: "live-gap",
    createdAt: now,
    mistake: "Forgot slip conversion before torque substitution.",
    correction: "Convert percentage slip to per-unit before using the formula."
  });

  const nudge = getStudyNudge(withMistake, now);

  assert.equal(nudge.kind, "repair");
  assert.match(nudge.title, /Repair due recall/i);
  assert.match(nudge.body, /PYQ Answer Bank/);
  assert.equal(nudge.href, "/revision");
});

test("getStudyNudge detects missing retrieval practice in the weekly mix", () => {
  const withSpacing = recordStudyTaskCompletion(createEmptyLearnerMemory(), {
    ...studyTask,
    id: "spacing-only",
    method: "spacing",
    minutes: 40
  }, "2026-06-24T06:00:00.000Z");

  const nudge = getStudyNudge(withSpacing, "2026-06-25T06:00:00.000Z");

  assert.equal(nudge.kind, "retrieval");
  assert.match(nudge.title, /retrieval/i);
  assert.match(nudge.body, /closed-book/i);
});

test("getStudyNudge restores UPSC CSE balance when the week is only technical", () => {
  const withTechnical = recordStudyTaskCompletion(createEmptyLearnerMemory(), {
    ...studyTask,
    id: "technical-only",
    method: "retrieval",
    minutes: 40,
    note
  }, "2026-06-24T06:00:00.000Z");

  const nudge = getStudyNudge(withTechnical, "2026-06-25T06:00:00.000Z");

  assert.equal(nudge.kind, "upsc-balance");
  assert.match(nudge.title, /UPSC CSE/i);
  assert.equal(nudge.href, "/courses/UPSC-CSE-POLITICAL-SCIENCE");
});

test("getStudyNudge restores MITEEE balance when the week is only UPSC", () => {
  const withUpsc = recordStudyTaskCompletion(createEmptyLearnerMemory(), {
    ...studyTask,
    id: "upsc-only",
    method: "retrieval",
    minutes: 40,
    note: upscNote
  }, "2026-06-24T06:00:00.000Z");

  const nudge = getStudyNudge(withUpsc, "2026-06-25T06:00:00.000Z");

  assert.equal(nudge.kind, "technical-balance");
  assert.match(nudge.title, /MITEEE/i);
  assert.equal(nudge.href, "/courses/SEM5-EM2");
});

test("buildLearnerMemoryBriefing prioritizes due recall above other homepage actions", () => {
  const withRead = recordNoteRead(createEmptyLearnerMemory(), note, "2026-06-23T06:00:00.000Z");
  const withStudy = recordStudyTaskCompletion(withRead, studyTask, now);
  const briefing = buildLearnerMemoryBriefing(withStudy, now);

  assert.equal(briefing.tone, "repair");
  assert.equal(briefing.title, "Repair due recall: PYQ Answer Bank");
  assert.equal(briefing.href, "/revision");
  assert.equal(briefing.primaryLabel, "Review now");
  assert.equal(briefing.stats.dueCards, 1);
  assert.equal(briefing.stats.todayMinutes, 30);
});

test("buildLearnerMemoryBriefing falls back to open mistakes before generic momentum", () => {
  const memory = addMistake(createEmptyLearnerMemory(), upscNote, {
    id: "upsc-miss",
    createdAt: "2026-06-24T05:00:00.000Z",
    mistake: "Forgot the difference between money bill and financial bill.",
    correction: "Money bills are certified by the Speaker and have stricter Rajya Sabha limits.",
    catchQuestion: "Who certifies a money bill and what can Rajya Sabha do?"
  });
  const briefing = buildLearnerMemoryBriefing({ ...memory, revisionCards: {} }, now);

  assert.equal(briefing.tone, "mistake");
  assert.equal(briefing.title, "Close open mistake: Parliament");
  assert.equal(briefing.href, "/notes/upsc-polity-parliament");
  assert.match(briefing.body, /Who certifies a money bill/);
  assert.equal(briefing.primaryLabel, "Repair mistake");
});

test("buildLearnerMemoryBriefing starts the day when no memory pressure exists", () => {
  const briefing = buildLearnerMemoryBriefing(createEmptyLearnerMemory(), now);

  assert.equal(briefing.tone, "start");
  assert.equal(briefing.href, "/#study-today");
  assert.equal(briefing.stats.todayMinutes, 0);
});

test("buildLearnerMemoryBackup wraps memory with portable metadata", () => {
  const memory = addMistake(createEmptyLearnerMemory(), note, {
    id: "m1",
    createdAt: now,
    mistake: "Confused synchronous speed with rotor speed.",
    correction: "Slip is based on the difference between synchronous and rotor speed."
  });

  const backup = JSON.parse(buildLearnerMemoryBackup(memory, now));

  assert.equal(backup.kind, "miteee-learner-memory-backup");
  assert.equal(backup.version, 1);
  assert.equal(backup.exportedAt, now);
  assert.equal(backup.memory.mistakes[0].id, "m1");
});

test("restoreLearnerMemoryBackup accepts only valid backup envelopes", () => {
  const memory = recordNoteRead(createEmptyLearnerMemory(), note, now);
  const restored = restoreLearnerMemoryBackup(buildLearnerMemoryBackup(memory, now));
  const rejected = restoreLearnerMemoryBackup(JSON.stringify({ kind: "wrong", memory }));

  assert.equal(restored.ok, true);
  assert.equal(restored.ok ? restored.memory.notes[note.slug]?.readCount : 0, 1);
  assert.equal(rejected.ok, false);
});

test("restoreLearnerMemoryBackup accepts backups that contain only revision attempts", () => {
  const memory = {
    ...createEmptyLearnerMemory(),
    revisionAttempts: [
      {
        ...note,
        id: "attempt:weak-only",
        cardId: `note:${note.slug}`,
        source: "note" as const,
        prompt: "Recall transformer ratio without opening note.",
        attempt: "I used the percent value directly.",
        grade: "hard" as const,
        reviewedAt: "2026-06-24T07:00:00.000Z"
      }
    ]
  };

  const restored = restoreLearnerMemoryBackup(buildLearnerMemoryBackup(memory, now));

  assert.equal(restored.ok, true);
  assert.equal(restored.ok ? restored.memory.revisionAttempts[0]?.attempt : "", "I used the percent value directly.");
});
