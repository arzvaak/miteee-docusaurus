import { getGateQuestions, getGateDashboard, getGatePaper } from "@/lib/gate";
import type { GateCustomTest, GateQuestion, GateTestFilters } from "@/lib/gate-types";

function hashSeed(seed: string) {
  let hash = 2166136261;
  for (let index = 0; index < seed.length; index += 1) {
    hash ^= seed.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function seededRandom(seed: string) {
  let state = hashSeed(seed) || 0x9e3779b9;
  return () => {
    // Mulberry32 is small, deterministic, and does not use process-global RNG state.
    state = (state + 0x6d2b79f5) | 0;
    let value = Math.imul(state ^ (state >>> 15), 1 | state);
    value ^= value + Math.imul(value ^ (value >>> 7), 61 | value);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function arrayOrSingle<T>(single: T | undefined, many: T[] | undefined) {
  return many && many.length > 0 ? many : single === undefined ? undefined : [single];
}

export function validateGateTestFilters(filters: GateTestFilters): string[] {
  const errors: string[] = [];
  const count = filters.questionCount ?? filters.count;
  if (count !== undefined && count !== "all") {
    const numericCount = typeof count === "number" ? count : Number(count);
    if (!Number.isInteger(numericCount) || numericCount < 0 || (typeof count === "string" && count.trim() === "")) errors.push("question count must be a non-negative integer or all");
  }
  const years = arrayOrSingle(filters.year, filters.years);
  if (years?.some((year) => !Number.isInteger(year) || year < 0)) errors.push("years must be non-negative integers");
  const types = arrayOrSingle(filters.type, filters.types);
  if (types?.some((type) => !["mcq", "msq", "nat"].includes(type))) errors.push("unknown GATE question type");
  return errors;
}

function matches(question: GateQuestion, filters: GateTestFilters) {
  const subjects = arrayOrSingle(filters.subject, filters.subjects);
  const sections = arrayOrSingle(filters.section, filters.sections);
  const topics = arrayOrSingle(filters.topic, filters.topics);
  const years = arrayOrSingle(filters.year, filters.years);
  const types = arrayOrSingle(filters.type, filters.types);
  return (!subjects || subjects.includes(question.subject))
    && (!sections || sections.includes(question.section))
    && (!topics || topics.includes(question.topic))
    && (!years || (question.year !== undefined && years.includes(question.year)))
    && (!types || types.includes(question.type));
}

export function selectGateQuestions(questions: GateQuestion[], filters: GateTestFilters = {}) {
  const errors = validateGateTestFilters(filters);
  if (errors.length > 0) throw new Error(`Invalid GATE test filters: ${errors.join("; ")}`);
  const requestedCount = filters.questionCount ?? filters.count ?? "all";
  const count = requestedCount === "all" ? "all" : Number(requestedCount);
  const matching = questions.filter((question) => matches(question, filters));
  if (count === "all") return matching;
  return matching.slice(0, count);
}

export function shuffleGateQuestions(questions: GateQuestion[], seed: string | number) {
  const result = [...questions];
  const random = seededRandom(String(seed));
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [result[index], result[swapIndex]] = [result[swapIndex]!, result[index]!];
  }
  return result;
}

type BuildGateTestInput = GateTestFilters | GateQuestion[] | undefined;

/**
 * Builds a deterministic ad-hoc paper from any question pool.  Both calling
 * forms are supported so server routes can use the loaded corpus while tests
 * and study tools can inject a small fixture pool:
 *
 *   buildGateTest(questions, { subject: "EE", topic: "power-factor" })
 *   buildGateTest({ subject: "DA", count: 20, seed: "today" })
 */
export function buildGateTest(questions: GateQuestion[], filters?: GateTestFilters): GateCustomTest;
export function buildGateTest(filters?: GateTestFilters, questions?: GateQuestion[]): GateCustomTest;
export function buildGateTest(first?: BuildGateTestInput, second?: BuildGateTestInput): GateCustomTest {
  const questions = Array.isArray(first)
    ? first
    : Array.isArray(second) ? second : getGateQuestions();
  const filters = (Array.isArray(first) ? second : first) as GateTestFilters | undefined ?? {};
  const seed = String(filters.seed ?? "gate-default");
  const selected = selectGateQuestions(questions, { ...filters, count: "all", questionCount: "all" });
  const ordered = filters.seed === undefined ? selected : shuffleGateQuestions(selected, seed);
  const requestedCount = filters.questionCount ?? filters.count ?? "all";
  // Select after shuffling so seeded tests sample a different, reproducible set.
  const normalizedCount = requestedCount === "all" ? "all" : Number(requestedCount);
  const finalQuestions = normalizedCount === "all"
    ? ordered
    : ordered.slice(0, Number(normalizedCount));
  const subjects = [...new Set(finalQuestions.map((question) => question.subject))];
  const requestedSubjects = filters.subjects ?? (filters.subject ? [filters.subject] : undefined);
  const requestedSubject = requestedSubjects?.length === 1 && (requestedSubjects[0] === "EE" || requestedSubjects[0] === "DA")
    ? requestedSubjects[0] as "EE" | "DA"
    : undefined;
  const subject: GateCustomTest["subject"] = subjects.length === 1
    ? subjects[0]!
    : requestedSubject ?? "mixed";
  const identity = JSON.stringify({
    subject: filters.subject,
    subjects: filters.subjects,
    section: filters.section,
    sections: filters.sections,
    topic: filters.topic,
    topics: filters.topics,
    year: filters.year,
    years: filters.years,
    type: filters.type,
    types: filters.types,
    count: requestedCount,
    seed
  });
  return {
    id: `gate-custom-${hashSeed(identity).toString(16).padStart(8, "0")}`,
    title: subject === "mixed" ? "GATE mixed practice" : `GATE ${subject} practice`,
    subject,
    filters: { ...filters, count: requestedCount, seed },
    seed,
    questionCount: finalQuestions.length,
    maxScore: finalQuestions.reduce((sum, question) => sum + question.marks, 0),
    questions: finalQuestions
  };
}

export const buildGateCustomTest = buildGateTest;

export function getGateTestQuestions(filters: GateTestFilters = {}) {
  return buildGateTest(filters).questions;
}

export function getGateTests() {
  // GATE practice papers are intentionally user-built; generated corpora do
  // not need to maintain a stale finite list of tests.
  return [] as GateCustomTest[];
}

// Keep the test-builder module a convenient import surface for callers that
// used the original brief's consolidated GATE helpers.
export { getGateDashboard, getGatePaper };
