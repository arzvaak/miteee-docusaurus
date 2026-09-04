import { notFound } from "next/navigation";
import { buildGateTest, getGateQuestions, getGateTopic } from "@/lib/gate";
import { GateRunner } from "@/components/GateRunner";
import { getBuildQuestions, normalizeGateQuestions } from "@/components/GateUi";
import { buildPageMetadata } from "@/lib/seo";
import type { GateSubject, GateTestFilters } from "@/lib/gate-types";

type Params = Promise<{ paper: string; topic: string }>;
type SearchParams = Promise<Record<string, string | string[] | undefined>>;
function first(value: string | string[] | undefined) { return Array.isArray(value) ? value[0] : value; }
function subjectForRoute(paper: string): GateSubject | null { const normalized = paper.toUpperCase(); return normalized === "DA" || normalized === "EE" ? normalized as GateSubject : null; }
function csv(value: string | undefined) { return value?.split(",").map((item) => item.trim()).filter(Boolean) ?? []; }

export default async function GateTopicPracticePage({ params, searchParams }: { params: Params; searchParams?: SearchParams }) {
  const { paper: routePaper, topic: routeTopic } = await params;
  const subject = subjectForRoute(routePaper);
  if (!subject) notFound();
  const query = await searchParams;
  const topic = routeTopic === "all" ? null : getGateTopic(subject, routeTopic);
  if (routeTopic !== "all" && !topic) notFound();
  const years = csv(first(query?.years)).map(Number).filter(Number.isFinite);
  const types = csv(first(query?.types)).filter((type): type is "mcq" | "msq" | "nat" => type === "mcq" || type === "msq" || type === "nat");
  const section = first(query?.section);
  const countValue = first(query?.length) ?? "all";
  const mode = first(query?.mode) === "timed" ? "timed" : "practice";
  const requestedCount: number | "all" = ["5", "10", "20", "30"].includes(countValue) ? Number(countValue) : "all";
  const filter: GateTestFilters = { subject, ...(section ? { section } : {}), ...(routeTopic === "all" ? {} : { topic: routeTopic }), ...(years.length ? { years } : {}), ...(types.length ? { types } : {}), count: requestedCount, seed: first(query?.seed) ?? `${subject}-${routeTopic}` };
  const built = await Promise.resolve(buildGateTest(filter));
  const fallback = await Promise.resolve(getGateQuestions(filter));
  const questions = getBuildQuestions(built, subject).length ? getBuildQuestions(built, subject) : normalizeGateQuestions(fallback, subject);
  const title = topic?.title ?? `${subject} · All topics`;
  return <GateRunner paper={routePaper.toLowerCase()} topic={routeTopic} title={title} questions={questions} mode={mode} durationSeconds={Math.max(questions.length * 90, 300)} />;
}
