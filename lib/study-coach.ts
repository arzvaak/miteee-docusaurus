import type { StudyTodayPlan } from "@/lib/study-system";
import type { LearnerWeaknessInsight, WeaknessTheme } from "@/lib/learner-memory";
import { truncateText } from "@/lib/text";

export type StudyCoachPlanRequest = {
  requestType?: "plan";
  mode: "exam-sprint" | "balanced" | "weakness-repair";
  minutes: 45 | 90 | 120;
  completedTaskIds: string[];
  plan: StudyTodayPlan;
  taskProgress?: StudyCoachTaskProgress[];
  memoryContext?: StudyCoachMemoryContext;
};

export type StudyCoachDiagnosisRequest = {
  requestType: "diagnose";
  prompt: string;
  userAnswer: string;
  sourceContext?: string;
  noteLabel?: string;
  courseName?: string;
};

export type StudyCoachRequest = StudyCoachPlanRequest | StudyCoachDiagnosisRequest;

export type StudyCoachTaskProgress = {
  taskId: string;
  title: string;
  completedChecklistItems: number;
  totalChecklistItems: number;
  label: string;
};

export type StudyCoachMemoryContext = {
  dueCards: Array<{
    source: "note" | "mistake";
    title: string;
    prompt: string;
    courseCode: string | null;
    courseName: string | null;
  }>;
  openMistakes: Array<{
    title: string;
    mistake: string;
    correction: string;
    catchQuestion: string | null;
    courseCode: string | null;
    courseName: string | null;
  }>;
  weakAttempts?: Array<{
    title: string;
    prompt: string;
    attempt: string;
    grade: "again" | "hard" | "good" | "easy";
    courseCode: string | null;
    courseName: string | null;
  }>;
  summary: {
    dueCards: number;
    openMistakes: number;
    weakRevisionAttempts?: number;
    readNotes: number;
  };
  weaknessInsight?: LearnerWeaknessInsight;
};

export type StudyCoachDiagnosis = {
  strengths: string[];
  weaknesses: string[];
  nextDrill: string;
};

export type StudyCoachPlanResponse = {
  responseType?: "plan";
  aiAvailable: boolean;
  model: string | null;
  provider: "mistral" | "local";
  message: string;
  bullets: string[];
};

export type StudyCoachDiagnosisResponse = {
  responseType: "diagnosis";
  aiAvailable: boolean;
  model: string | null;
  provider: "mistral" | "local";
  message: string;
  bullets: string[];
  diagnosis: StudyCoachDiagnosis;
};

export type StudyCoachResponse = StudyCoachPlanResponse | StudyCoachDiagnosisResponse;

export type StudyCoachProviderStatus = {
  aiAvailable: boolean;
  model: string | null;
  provider: "mistral" | "local";
  label: string;
};

export type MistralStudyCoachPayload = {
  model: string;
  temperature: number;
  max_tokens: number;
  response_format: { type: "json_object" };
  messages: Array<{
    role: "user";
    content: string;
  }>;
};

export type StudyCoachModelParseResult = {
  accepted: boolean;
  reason: string | null;
  response: StudyCoachResponse;
};

const modeLabels: Record<StudyCoachPlanRequest["mode"], string> = {
  "exam-sprint": "exam sprint",
  balanced: "UPSC plus EEE balance",
  "weakness-repair": "weakness repair"
};

export function getStudyCoachProviderStatus(env: Partial<Record<string, string | undefined>>): StudyCoachProviderStatus {
  const hasMistralKey = Boolean(env.MISTRAL_API_KEY || env.MISTRAK_API_KEY);
  if (!hasMistralKey) {
    return {
      aiAvailable: false,
      model: null,
      provider: "local",
      label: "Local fallback ready"
    };
  }

  return {
    aiAvailable: true,
    model: env.MISTRAL_MODEL || "mistral-small-latest",
    provider: "mistral",
    label: "Mistral ready"
  };
}

function normalizeGroundingText(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function groundingAnchor(value: string) {
  return normalizeGroundingText(value).split(" ").slice(0, 8).join(" ");
}

function trimTerminalPunctuation(value: string) {
  return value.trim().replace(/[.!?]+$/, "");
}

function formatWeaknessFocus(insight: LearnerWeaknessInsight | undefined) {
  if (!insight?.hasSignals) return null;
  const parts = [];
  if (insight.topCourse) {
    parts.push(`Top weakness course: ${insight.topCourse.label} (${insight.topCourse.openMistakes} open mistakes, ${insight.topCourse.weakAttempts} weak attempts, ${insight.topCourse.dueCards} due cards).`);
  }
  if (insight.topTheme) {
    parts.push(`Recurring weakness theme: ${insight.topTheme.theme} (${insight.topTheme.count} signal${insight.topTheme.count === 1 ? "" : "s"}).`);
  }
  if (insight.nextAction) {
    parts.push(`Repair target: ${insight.nextAction}`);
  }
  return parts;
}

function topWeaknessTheme(insight: LearnerWeaknessInsight | undefined): WeaknessTheme | null {
  return insight?.hasSignals ? insight.topTheme?.theme ?? null : null;
}

export function isGroundedCoachContent(content: string, request: StudyCoachRequest) {
  if (request.requestType === "diagnose") return isGroundedDiagnosisContent(content, request);

  const memory = request.memoryContext;
  const weakAttempts = memory?.weakAttempts ?? [];
  if (!memory || (memory.dueCards.length === 0 && memory.openMistakes.length === 0 && weakAttempts.length === 0)) return true;

  const normalizedContent = normalizeGroundingText(content);
  const anchors = [
    ...memory.dueCards.map((card) => groundingAnchor(card.prompt)),
    ...memory.openMistakes.flatMap((mistake) => [groundingAnchor(mistake.mistake), mistake.catchQuestion ? groundingAnchor(mistake.catchQuestion) : ""]),
    ...weakAttempts.flatMap((attempt) => [groundingAnchor(attempt.attempt), groundingAnchor(attempt.prompt)])
  ].filter((anchor) => anchor.length >= 24);

  return anchors.length === 0 || anchors.some((anchor) => normalizedContent.includes(anchor));
}

export function buildStudyCoachPrompt(request: StudyCoachRequest) {
  if (request.requestType === "diagnose") return buildStudyCoachDiagnosisPrompt(request);

  const openTasks = request.plan.tasks.filter((task) => !request.completedTaskIds.includes(task.id));
  const taskProgress = request.taskProgress?.filter((progress) => progress.totalChecklistItems > 0) ?? [];
  const taskProgressLines = taskProgress.length > 0 ? [
    "Task progress:",
    ...taskProgress.map((progress) => `- ${progress.title}: ${progress.label}`)
  ] : [];
  const weakAttempts = request.memoryContext?.weakAttempts ?? [];
  const weakAttemptCount = request.memoryContext?.summary.weakRevisionAttempts ?? weakAttempts.length;
  const weaknessFocusLines = formatWeaknessFocus(request.memoryContext?.weaknessInsight) ?? [];
  const memoryLines = request.memoryContext ? [
    "Learner memory:",
    `- Queue: ${request.memoryContext.summary.dueCards} due cards, ${request.memoryContext.summary.openMistakes} open mistakes, ${weakAttemptCount} weak attempts, ${request.memoryContext.summary.readNotes} read notes.`,
    ...weaknessFocusLines.map((line) => `- ${line}`),
    ...request.memoryContext.dueCards.map((card) => `- Due ${card.source}: ${card.title} (${card.courseName ?? card.courseCode ?? "Study note"}) / ${card.prompt}`),
    ...request.memoryContext.openMistakes.map((mistake) => `- Open mistake: ${mistake.title} / ${mistake.mistake} / Correct rule: ${mistake.correction}${mistake.catchQuestion ? ` / Catch question: ${mistake.catchQuestion}` : ""}`),
    ...weakAttempts.map((attempt) => `- Weak recall attempt (${attempt.grade}): ${attempt.title} (${attempt.courseName ?? attempt.courseCode ?? "Study note"}) / Prompt: ${attempt.prompt} / Attempt: ${attempt.attempt}`)
  ] : [];
  return [
    "You are a strict evidence-based study coach for a personal MITEEE and UPSC CSE study site.",
    "Use retrieval practice, spaced practice, interleaving, and self-explanation. Do not suggest passive rereading as the main action.",
    "Return JSON only with this exact shape: {\"message\":\"one short sentence\",\"bullets\":[\"bullet 1\",\"bullet 2\",\"bullet 3\",\"bullet 4\"]}.",
    "No markdown, headings, LaTeX, formulas, tables, or invented subject details.",
    "Mention exact note labels only when they are supplied. If content is not supplied, do not invent derivation steps or facts.",
    "",
    `Mode: ${modeLabels[request.mode]}`,
    `Available minutes: ${request.minutes}`,
    `Completed task ids: ${request.completedTaskIds.join(", ") || "none"}`,
    ...taskProgressLines,
    ...memoryLines,
    "Open tasks:",
    ...openTasks.map((task) => `- ${task.title} (${task.minutes} min): ${task.note?.label ?? "no note"} / ${task.prompt}`)
  ].join("\n");
}

function buildStudyCoachDiagnosisPrompt(request: StudyCoachDiagnosisRequest) {
  return [
    "You are a strict evidence-based answer-diagnosis study coach for a personal MITEEE and UPSC CSE study site.",
    "Diagnose only the supplied answer against the supplied question and source context. Do not invent syllabus facts, formulas, examples, or extra textbook details.",
    "Return JSON only with this exact shape: {\"message\":\"one short sentence\",\"strengths\":[\"specific strength\"],\"weaknesses\":[\"specific weakness 1\",\"specific weakness 2\"],\"nextDrill\":\"one closed-book next drill\"}.",
    "No markdown, headings, LaTeX, formulas, tables, or invented subject details.",
    "Every weakness and the next drill must be grounded in the question, the user's answer, or the source context.",
    "If no source context is supplied, say that the source context is missing and diagnose only the answer's direct match to the question wording.",
    "",
    "Answer-diagnosis case:",
    `Question: ${truncateText(request.prompt, 700)}`,
    `User answer: ${truncateText(request.userAnswer, 900)}`,
    `Source context: ${truncateText(request.sourceContext?.trim() || "No source context supplied. Diagnose only obvious omissions, uncertainty, and mismatch with the question wording.", 1100)}`,
    `Note label: ${request.noteLabel?.trim() || "not supplied"}`,
    `Course: ${request.courseName?.trim() || "not supplied"}`,
    "Next drill: write one short closed-book question that tests the weakest missing step."
  ].join("\n");
}

export function buildMistralStudyCoachPayload(model: string, request: StudyCoachRequest): MistralStudyCoachPayload {
  return {
    model,
    temperature: 0.2,
    max_tokens: 520,
    response_format: { type: "json_object" },
    messages: [
      {
        role: "user",
        content: buildStudyCoachPrompt(request)
      }
    ]
  };
}

export function buildFallbackStudyCoach(request: StudyCoachRequest): StudyCoachResponse {
  if (request.requestType === "diagnose") return buildFallbackAnswerDiagnosis(request);

  const openTasks = request.plan.tasks.filter((task) => !request.completedTaskIds.includes(task.id));
  const selected = openTasks.length > 0 ? openTasks : request.plan.tasks;
  const dueMemory = request.memoryContext?.dueCards[0];
  const openMistake = request.memoryContext?.openMistakes[0];
  const weakAttempt = request.memoryContext?.weakAttempts?.[0];
  const weaknessInsight = request.memoryContext?.weaknessInsight;
  const weaknessTheme = topWeaknessTheme(weaknessInsight);
  const partialProgress = request.taskProgress?.find((progress) => (
    progress.totalChecklistItems > 0 &&
    progress.completedChecklistItems > 0 &&
    progress.completedChecklistItems < progress.totalChecklistItems
  ));
  const weakAttemptText = weakAttempt ? trimTerminalPunctuation(weakAttempt.attempt) : null;
  const minutes = request.minutes;
  const first = selected[0];
  const second = selected[1] ?? selected[0];
  const third = selected[2] ?? selected[selected.length - 1];
  const message = `No Mistral key is configured, so here is a local ${minutes}-minute ${modeLabels[request.mode]} plan.`;

  const bullets = [
    `Start with ${first.title.toLowerCase()}${first.note ? ` on ${first.note.label}` : ""}. Keep the note closed for the first five minutes.`,
    `Then do ${second.title.toLowerCase()}${second.note ? ` using ${second.note.label}` : ""}. Write one missed fact or formula before moving on.`,
    `${third.title} is the closeout. Turn the weakest point into one question for tomorrow.`,
    "Stop when the timer ends. Do not convert this into open-ended rereading."
  ];

  if (dueMemory) {
    bullets[0] = `Start with the due ${dueMemory.source === "mistake" ? "mistake repair" : "recall card"} on ${dueMemory.title}: ${dueMemory.prompt}`;
  } else if (partialProgress) {
    bullets[0] = `Continue ${partialProgress.title} at ${partialProgress.label}. Finish the next unchecked repair step before asking for new work.`;
  } else if (weakAttempt) {
    bullets[0] = `Start by repairing the failed recall attempt on ${weakAttempt.title}: ${weakAttemptText}. Rewrite the rule, then answer the original prompt closed-book.`;
  } else if (weaknessInsight?.hasSignals && weaknessInsight.topCourse) {
    bullets[0] = `Start with ${weaknessInsight.topCourse.label}: ${weaknessInsight.nextAction}`;
  }

  if (openMistake) {
    bullets[1] = `Write the corrected rule first: ${openMistake.correction}. Then answer ${openMistake.catchQuestion ?? "one nearby catch question"} without opening the answer.`;
  }

  if (request.mode === "weakness-repair") {
    bullets[0] = dueMemory
      ? `Pick the live weakness first: ${dueMemory.prompt}`
      : partialProgress
        ? `Continue ${partialProgress.title} at ${partialProgress.label}. Finish the next unchecked repair step before opening another source.`
      : weakAttempt
        ? `Pick the failed recall attempt first: ${weakAttemptText}. Then answer this prompt again without opening the note: ${weakAttempt.prompt}`
      : weaknessInsight?.hasSignals && weaknessInsight.topCourse
        ? `Pick the top weakness first: ${weaknessInsight.topCourse.label}${weaknessTheme ? ` / ${weaknessTheme}` : ""}. ${weaknessInsight.nextAction}`
      : `Pick the task that felt worst recently: ${first.title.toLowerCase()}${first.note ? ` on ${first.note.label}` : ""}.`;
  }

  if (request.mode === "balanced") {
    bullets[1] = `Force a subject switch after the first block. Use ${second.note?.courseName ?? "a different course"} to prevent autopilot.`;
  }

  if (weaknessInsight?.hasSignals && weaknessInsight.topCourse && !dueMemory && !openMistake && !weakAttempt) {
    bullets[2] = `Name the repair target before closeout: ${weaknessTheme ? `${weaknessTheme} in ` : ""}${weaknessInsight.topCourse.label}.`;
  }

  return {
    aiAvailable: false,
    model: null,
    provider: "local",
    message,
    bullets
  };
}

function meaningfulTokens(value: string) {
  const stopwords = new Set(["about", "again", "answer", "before", "directly", "happen", "must", "question", "source", "study", "that", "their", "there", "these", "thing", "using", "value", "what", "where", "which", "with", "write", "your"]);
  return normalizeGroundingText(value)
    .split(" ")
    .filter((token) => token.length >= 5 && !stopwords.has(token));
}

function isGroundedDiagnosisContent(content: string, request: StudyCoachDiagnosisRequest) {
  const anchors = [
    groundingAnchor(request.prompt),
    groundingAnchor(request.userAnswer),
    request.sourceContext ? groundingAnchor(request.sourceContext) : ""
  ].filter((anchor) => anchor.length >= 24);
  const normalizedContent = normalizeGroundingText(content);
  if (anchors.some((anchor) => normalizedContent.includes(anchor))) return true;

  const sourceTokens = new Set(meaningfulTokens([request.prompt, request.userAnswer, request.sourceContext ?? ""].join(" ")));
  const matchedTokens = meaningfulTokens(content).filter((token) => sourceTokens.has(token));
  return new Set(matchedTokens).size >= 2;
}

function cleanCoachList(values: unknown, limit: number) {
  if (!Array.isArray(values)) return [];
  return values
    .filter((value): value is string => typeof value === "string")
    .map(cleanCoachBullet)
    .filter(Boolean)
    .slice(0, limit);
}

function firstMissingGroundedPhrase(answer: string, context: string) {
  const answerText = normalizeGroundingText(answer);
  const phrases = context
    .split(/[.;:\n]/)
    .map((line) => trimTerminalPunctuation(line))
    .filter((line) => line.length >= 24);
  return phrases.find((phrase) => {
    const tokens = meaningfulTokens(phrase);
    return tokens.some((token) => !answerText.includes(token));
  }) ?? null;
}

function buildFallbackAnswerDiagnosis(request: StudyCoachDiagnosisRequest): StudyCoachDiagnosisResponse {
  const prompt = trimTerminalPunctuation(truncateText(request.prompt, 170));
  const answer = trimTerminalPunctuation(truncateText(request.userAnswer, 170));
  const context = request.sourceContext?.trim() ?? "";
  const missingPhrase = context ? firstMissingGroundedPhrase(request.userAnswer, context) : null;
  const noteScope = request.noteLabel || request.courseName || "the supplied question";
  const weakness = missingPhrase
    ? `Weakness: your answer does not clearly include this source rule: ${truncateText(missingPhrase, 150)}.`
    : `Weakness: the answer is too thin against the exact question; it needs the missing step, condition, or contrast stated explicitly.`;
  const nextDrill = `Answer again closed-book: ${prompt}`;
  const strengths = answer
    ? [`You attempted the target question instead of switching to passive review: ${answer}.`]
    : ["You selected a concrete prompt, but the written answer is still empty."];
  const weaknesses = [weakness];

  return {
    responseType: "diagnosis",
    aiAvailable: false,
    model: null,
    provider: "local",
    message: `Local fallback diagnosis against ${noteScope}: repair the weakest missing step before moving on.`,
    bullets: [
      strengths[0],
      weakness,
      context ? `Compare only against the supplied context, then rewrite the answer in two precise sentences.` : "Add the exact rule or condition that the question asks for before checking any new source.",
      `Next drill: ${nextDrill}`
    ],
    diagnosis: {
      strengths,
      weaknesses,
      nextDrill
    }
  };
}

export function cleanCoachBullet(value: string) {
  return truncateText(
    value
      .replace(/^#+\s*/, "")
      .replace(/^[-*\d.)\s]+/, "")
      .replace(/\*\*/g, "")
      .replace(/__/g, "")
      .replace(/`/g, "")
      .replace(/\\[()[\]{}]/g, "")
      .replace(/\\+/g, "")
      .replace(/\s+/g, " ")
      .trim(),
    190
  );
}

function fallbackRejectedResponse(model: string, reason: string): StudyCoachResponse {
  return {
    aiAvailable: false,
    model,
    provider: "local",
    message: reason,
    bullets: []
  };
}

function looksUngrounded(content: string) {
  return /\be\.g\./i.test(content) || /\bfor example\b/i.test(content);
}

function normalizeCoachJson(content: string) {
  const trimmed = content.trim();
  const fenced = trimmed.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);
  return fenced?.[1]?.trim() ?? trimmed;
}

function parseJsonCoachContent(content: string): { message: string; bullets: string[] } | null {
  try {
    const parsed = JSON.parse(normalizeCoachJson(content)) as unknown;
    if (!parsed || typeof parsed !== "object") return null;
    const input = parsed as Partial<{ message: unknown; bullets: unknown }>;
    if (typeof input.message !== "string" || !Array.isArray(input.bullets)) return null;
    const bullets = input.bullets.filter((bullet): bullet is string => typeof bullet === "string").map(cleanCoachBullet).filter(Boolean);
    if (bullets.length < 4) return null;
    return {
      message: truncateText(input.message.replace(/\s+/g, " ").trim(), 150),
      bullets: bullets.slice(0, 4)
    };
  } catch {
    return null;
  }
}

function parseJsonDiagnosisContent(content: string): { message: string; diagnosis: StudyCoachDiagnosis; bullets: string[] } | null {
  try {
    const parsed = JSON.parse(normalizeCoachJson(content)) as unknown;
    if (!parsed || typeof parsed !== "object") return null;
    const raw = parsed as Partial<{ diagnosis: unknown; message: unknown; strengths: unknown; weaknesses: unknown; nextDrill: unknown }>;
    const input = raw.diagnosis && typeof raw.diagnosis === "object"
      ? raw.diagnosis as Partial<{ message: unknown; strengths: unknown; weaknesses: unknown; nextDrill: unknown }>
      : raw;
    if (typeof input.message !== "string" || typeof input.nextDrill !== "string") return null;
    const strengths = cleanCoachList(input.strengths, 2);
    const weaknesses = cleanCoachList(input.weaknesses, 3);
    const nextDrill = cleanCoachBullet(input.nextDrill);
    if (weaknesses.length === 0 || !nextDrill) return null;
    const message = truncateText(input.message.replace(/\s+/g, " ").trim(), 150);
    return {
      message,
      diagnosis: {
        strengths: strengths.length > 0 ? strengths : ["You wrote a concrete answer that can be tested."],
        weaknesses,
        nextDrill
      },
      bullets: [
        ...(strengths.length > 0 ? strengths.slice(0, 1) : ["You wrote a concrete answer that can be tested."]),
        ...weaknesses,
        `Next drill: ${nextDrill}`
      ].slice(0, 4)
    };
  } catch {
    return null;
  }
}

function parsePlainTextCoachContent(content: string): { message: string; bullets: string[] } | null {
  if (/^\s*(?:```(?:json)?\s*)?[{[]/.test(content) || /"bullets"\s*:/.test(content)) return null;
  const bullets = content
    .split("\n")
    .map(cleanCoachBullet)
    .filter(Boolean)
    .filter((line) => !/^steps to recall:?$/i.test(line))
    .slice(0, 4);
  if (bullets.length !== 4) return null;
  return {
    message: "Mistral generated a focused study sequence for the current plan.",
    bullets
  };
}

export function parseStudyCoachModelResponse(content: string, model: string, request: StudyCoachRequest): StudyCoachModelParseResult {
  if (request.requestType === "diagnose") {
    const parsed = parseJsonDiagnosisContent(content);
    if (!parsed) {
      return {
        accepted: false,
        reason: "Mistral did not return the expected grounded answer-diagnosis shape.",
        response: fallbackRejectedResponse(model, "Mistral did not return the expected grounded answer-diagnosis shape.")
      };
    }

    const groundedText = [parsed.message, ...parsed.bullets, parsed.diagnosis.nextDrill].join("\n");
    if (looksUngrounded(groundedText) || !isGroundedDiagnosisContent(groundedText, request)) {
      return {
        accepted: false,
        reason: "Mistral added answer-diagnosis details outside the supplied question, answer, or source context.",
        response: fallbackRejectedResponse(model, "Mistral added answer-diagnosis details outside the supplied question, answer, or source context.")
      };
    }

    return {
      accepted: true,
      reason: null,
      response: {
        responseType: "diagnosis",
        aiAvailable: true,
        model,
        provider: "mistral",
        message: parsed.message || "Mistral diagnosed the answer against the supplied context.",
        bullets: parsed.bullets,
        diagnosis: parsed.diagnosis
      }
    };
  }

  const parsed = parseJsonCoachContent(content) ?? parsePlainTextCoachContent(content);
  if (!parsed) {
    return {
      accepted: false,
      reason: "Mistral did not return the expected grounded four-step plan shape.",
      response: fallbackRejectedResponse(model, "Mistral did not return the expected grounded four-step plan shape.")
    };
  }

  const groundedText = [parsed.message, ...parsed.bullets].join("\n");
  if (looksUngrounded(groundedText) || !isGroundedCoachContent(groundedText, request)) {
    return {
      accepted: false,
      reason: "Mistral dropped or added details outside the supplied plan.",
      response: fallbackRejectedResponse(model, "Mistral dropped or added details outside the supplied plan.")
    };
  }

  return {
    accepted: true,
    reason: null,
    response: {
      aiAvailable: true,
      model,
      provider: "mistral",
      message: parsed.message || "Mistral generated a focused study sequence for the current plan.",
      bullets: parsed.bullets
    }
  };
}
