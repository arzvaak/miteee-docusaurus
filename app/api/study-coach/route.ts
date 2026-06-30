import { NextResponse } from "next/server";
import { buildFallbackStudyCoach, buildMistralStudyCoachPayload, getStudyCoachProviderStatus, parseStudyCoachModelResponse, type StudyCoachDiagnosisRequest, type StudyCoachMemoryContext, type StudyCoachPlanRequest, type StudyCoachRequest } from "@/lib/study-coach";
import type { StudyTodayPlan } from "@/lib/study-system";
import type { LearnerWeaknessInsight } from "@/lib/learner-memory";

const allowedModes = new Set<StudyCoachPlanRequest["mode"]>(["exam-sprint", "balanced", "weakness-repair"]);
const allowedMinutes = new Set<StudyCoachPlanRequest["minutes"]>([45, 90, 120]);
const maxDiagnosisTextLength = 2400;
const weaknessThemes = new Set([
  "Formula selection",
  "Definition recall",
  "Unit conversion",
  "Concept separation",
  "Procedure setup",
  "Recall accuracy"
]);

type MistralResponse = {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
};

export async function GET() {
  return NextResponse.json(getStudyCoachProviderStatus(process.env));
}

function isStudyPlan(value: unknown): value is StudyTodayPlan {
  return Boolean(value && typeof value === "object" && Array.isArray((value as StudyTodayPlan).tasks));
}

function isWeaknessCourseInsight(value: unknown) {
  if (!value || typeof value !== "object") return false;
  const input = value as NonNullable<LearnerWeaknessInsight["topCourse"]>;
  return (input.courseCode === null || typeof input.courseCode === "string") &&
    (input.courseName === null || typeof input.courseName === "string") &&
    typeof input.label === "string" &&
    typeof input.score === "number" &&
    typeof input.openMistakes === "number" &&
    typeof input.weakAttempts === "number" &&
    typeof input.dueCards === "number";
}

function isWeaknessThemeInsight(value: unknown) {
  if (!value || typeof value !== "object") return false;
  const input = value as NonNullable<LearnerWeaknessInsight["topTheme"]>;
  return weaknessThemes.has(input.theme) &&
    typeof input.count === "number" &&
    typeof input.courseCount === "number" &&
    Array.isArray(input.examples) &&
    input.examples.every((example) => typeof example === "string");
}

function isLearnerWeaknessInsight(value: unknown): value is LearnerWeaknessInsight {
  if (!value || typeof value !== "object") return false;
  const input = value as Partial<LearnerWeaknessInsight>;
  return typeof input.hasSignals === "boolean" &&
    (input.topCourse === null || isWeaknessCourseInsight(input.topCourse)) &&
    (input.topTheme === null || isWeaknessThemeInsight(input.topTheme)) &&
    typeof input.nextAction === "string" &&
    Array.isArray(input.courseInsights) &&
    input.courseInsights.every(isWeaknessCourseInsight) &&
    Array.isArray(input.themeInsights) &&
    input.themeInsights.every(isWeaknessThemeInsight);
}

function isStudyCoachMemoryContext(value: unknown): value is StudyCoachMemoryContext {
  if (!value || typeof value !== "object") return false;
  const input = value as Partial<StudyCoachMemoryContext>;
  if (!Array.isArray(input.dueCards) || !Array.isArray(input.openMistakes)) return false;
  if (!input.summary || typeof input.summary !== "object") return false;
  const summary = input.summary as Partial<StudyCoachMemoryContext["summary"]>;
  const hasValidSummary = typeof summary.dueCards === "number" &&
    typeof summary.openMistakes === "number" &&
    (summary.weakRevisionAttempts === undefined || typeof summary.weakRevisionAttempts === "number") &&
    typeof summary.readNotes === "number";
  const hasValidDueCards = input.dueCards.every((card) => (
    card &&
    typeof card === "object" &&
    ((card as StudyCoachMemoryContext["dueCards"][number]).source === "note" || (card as StudyCoachMemoryContext["dueCards"][number]).source === "mistake") &&
    typeof (card as StudyCoachMemoryContext["dueCards"][number]).title === "string" &&
    typeof (card as StudyCoachMemoryContext["dueCards"][number]).prompt === "string"
  ));
  const hasValidMistakes = input.openMistakes.every((mistake) => (
    mistake &&
    typeof mistake === "object" &&
    typeof (mistake as StudyCoachMemoryContext["openMistakes"][number]).title === "string" &&
    typeof (mistake as StudyCoachMemoryContext["openMistakes"][number]).mistake === "string" &&
    typeof (mistake as StudyCoachMemoryContext["openMistakes"][number]).correction === "string" &&
    (
      (mistake as StudyCoachMemoryContext["openMistakes"][number]).catchQuestion === null ||
      typeof (mistake as StudyCoachMemoryContext["openMistakes"][number]).catchQuestion === "string"
    )
  ));
  const weakAttempts = input.weakAttempts ?? [];
  const hasValidWeakAttempts = Array.isArray(weakAttempts) && weakAttempts.every((attempt) => (
    attempt &&
    typeof attempt === "object" &&
    typeof (attempt as NonNullable<StudyCoachMemoryContext["weakAttempts"]>[number]).title === "string" &&
    typeof (attempt as NonNullable<StudyCoachMemoryContext["weakAttempts"]>[number]).prompt === "string" &&
    typeof (attempt as NonNullable<StudyCoachMemoryContext["weakAttempts"]>[number]).attempt === "string" &&
    (
      (attempt as NonNullable<StudyCoachMemoryContext["weakAttempts"]>[number]).grade === "again" ||
      (attempt as NonNullable<StudyCoachMemoryContext["weakAttempts"]>[number]).grade === "hard" ||
      (attempt as NonNullable<StudyCoachMemoryContext["weakAttempts"]>[number]).grade === "good" ||
      (attempt as NonNullable<StudyCoachMemoryContext["weakAttempts"]>[number]).grade === "easy"
    )
  ));
  const hasValidWeaknessInsight = input.weaknessInsight === undefined || isLearnerWeaknessInsight(input.weaknessInsight);
  return hasValidSummary && hasValidDueCards && hasValidMistakes && hasValidWeakAttempts && hasValidWeaknessInsight;
}

function isStudyCoachTaskProgress(value: unknown): value is NonNullable<StudyCoachPlanRequest["taskProgress"]> {
  return Array.isArray(value) && value.every((progress) => (
    progress &&
    typeof progress === "object" &&
    typeof (progress as NonNullable<StudyCoachPlanRequest["taskProgress"]>[number]).taskId === "string" &&
    typeof (progress as NonNullable<StudyCoachPlanRequest["taskProgress"]>[number]).title === "string" &&
    typeof (progress as NonNullable<StudyCoachPlanRequest["taskProgress"]>[number]).completedChecklistItems === "number" &&
    typeof (progress as NonNullable<StudyCoachPlanRequest["taskProgress"]>[number]).totalChecklistItems === "number" &&
    typeof (progress as NonNullable<StudyCoachPlanRequest["taskProgress"]>[number]).label === "string"
  ));
}

function cleanRequestText(value: unknown, maxLength = maxDiagnosisTextLength) {
  if (typeof value !== "string") return null;
  const cleaned = value.replace(/\s+/g, " ").trim();
  if (!cleaned) return null;
  return cleaned.slice(0, maxLength);
}

function parseDiagnosisRequest(input: Partial<StudyCoachDiagnosisRequest>): StudyCoachDiagnosisRequest | null {
  const prompt = cleanRequestText(input.prompt);
  const userAnswer = cleanRequestText(input.userAnswer);
  if (!prompt || !userAnswer) return null;
  const sourceContext = typeof input.sourceContext === "string" ? input.sourceContext.replace(/\s+/g, " ").trim().slice(0, maxDiagnosisTextLength) : undefined;
  const noteLabel = typeof input.noteLabel === "string" ? input.noteLabel.replace(/\s+/g, " ").trim().slice(0, 120) : undefined;
  const courseName = typeof input.courseName === "string" ? input.courseName.replace(/\s+/g, " ").trim().slice(0, 120) : undefined;
  return {
    requestType: "diagnose",
    prompt,
    userAnswer,
    ...(sourceContext ? { sourceContext } : {}),
    ...(noteLabel ? { noteLabel } : {}),
    ...(courseName ? { courseName } : {})
  };
}

function parseRequest(value: unknown): StudyCoachRequest | null {
  if (!value || typeof value !== "object") return null;
  const input = value as Partial<StudyCoachRequest>;
  if (input.requestType === "diagnose" || (input as { requestType?: unknown }).requestType === "diagnosis") {
    return parseDiagnosisRequest(input as Partial<StudyCoachDiagnosisRequest>);
  }

  const planInput = input as Partial<StudyCoachPlanRequest>;
  if (!allowedModes.has(planInput.mode as StudyCoachPlanRequest["mode"])) return null;
  if (!allowedMinutes.has(planInput.minutes as StudyCoachPlanRequest["minutes"])) return null;
  if (!Array.isArray(planInput.completedTaskIds) || !planInput.completedTaskIds.every((id) => typeof id === "string")) return null;
  if (!isStudyPlan(planInput.plan)) return null;
  if (planInput.taskProgress && !isStudyCoachTaskProgress(planInput.taskProgress)) return null;
  if (planInput.memoryContext && !isStudyCoachMemoryContext(planInput.memoryContext)) return null;
  return {
    requestType: "plan",
    mode: planInput.mode as StudyCoachPlanRequest["mode"],
    minutes: planInput.minutes as StudyCoachPlanRequest["minutes"],
    completedTaskIds: planInput.completedTaskIds,
    plan: planInput.plan,
    taskProgress: planInput.taskProgress,
    memoryContext: planInput.memoryContext
  };
}

export async function POST(request: Request) {
  const parsed = parseRequest(await request.json().catch(() => null));
  if (!parsed) {
    return NextResponse.json({ error: "Invalid study coach request." }, { status: 400 });
  }

  const fallback = buildFallbackStudyCoach(parsed);
  const key = process.env.MISTRAL_API_KEY || process.env.MISTRAK_API_KEY;
  const model = process.env.MISTRAL_MODEL || "mistral-small-latest";

  if (!key) {
    return NextResponse.json(fallback);
  }

  try {
    const response = await fetch("https://api.mistral.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(buildMistralStudyCoachPayload(model, parsed))
    });

    if (!response.ok) {
      return NextResponse.json({ ...fallback, message: `${fallback.message} Mistral returned ${response.status}.` });
    }

    const payload = await response.json() as MistralResponse;
    const content = payload.choices?.[0]?.message?.content?.trim();

    if (!content) {
      return NextResponse.json({ ...fallback, message: `${fallback.message} Mistral returned an empty response.` });
    }

    const parsedModelResponse = parseStudyCoachModelResponse(content, model, parsed);
    if (!parsedModelResponse.accepted) {
      const fallbackLabel = parsed.requestType === "diagnose" ? "grounded local diagnosis" : "grounded local plan";
      return NextResponse.json({ ...fallback, message: `${parsedModelResponse.reason} This is the ${fallbackLabel} instead.` });
    }

    return NextResponse.json(parsedModelResponse.response);
  } catch {
    return NextResponse.json({ ...fallback, message: `${fallback.message} Mistral could not be reached.` });
  }
}
