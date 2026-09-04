import { notFound } from "next/navigation";
import { getGateQuestions, getGateTopics, buildGateTest } from "@/lib/gate";
import { GateBuilder } from "@/components/GateBuilder";
import { enrichGateTopics, normalizeGateQuestions, normalizeGateTopics } from "@/components/GateUi";
import { buildPageMetadata } from "@/lib/seo";
import styles from "@/components/Gate.module.css";
import type { GateSubject } from "@/lib/gate-types";

type Params = Promise<{ paper: string }>;
type SearchParams = Promise<Record<string, string | string[] | undefined>>;
function first(value: string | string[] | undefined) { return Array.isArray(value) ? value[0] : value; }
function subjectForRoute(paper: string): GateSubject | null { const normalized = paper.toUpperCase(); return normalized === "DA" || normalized === "EE" ? normalized as GateSubject : null; }

export async function generateMetadata({ params }: { params: Params }) { const { paper } = await params; return buildPageMetadata({ title: `Build GATE ${paper.toUpperCase()} Practice`, description: "Configure a topic-wise GATE test set.", pathname: `/exams/gate/${paper}/practice` }); }

export default async function GatePracticeBuilderPage({ params, searchParams }: { params: Params; searchParams?: SearchParams }) {
  const { paper: routePaper } = await params;
  const subject = subjectForRoute(routePaper);
  if (!subject) notFound();
  const [rawTopics, rawQuestions] = await Promise.all([Promise.resolve(getGateTopics(subject)), Promise.resolve(getGateQuestions({ subject }))]);
  const questions = normalizeGateQuestions(rawQuestions, subject);
  const topics = enrichGateTopics(normalizeGateTopics(rawTopics, subject), questions);
  const years = [...new Set(questions.map((question) => question.year).filter((year): year is number => Boolean(year)))].sort((a, b) => b - a);
  const questionTypes = [...new Set(questions.map((question) => question.questionType))];
  const query = await searchParams;
  const selectedTopic = first(query?.topic);
  if (selectedTopic || first(query?.length) || first(query?.mode)) {
    // The dedicated [topic] route is the canonical runner; this keeps bookmarked builder links useful.
    const target = selectedTopic && selectedTopic !== "all" ? selectedTopic : "all";
    const paramsOut = new URLSearchParams();
    for (const key of ["section", "topic", "years", "types", "length", "mode"]) { const value = first(query?.[key]); if (value) paramsOut.set(key, value); }
    const { redirect } = await import("next/navigation");
    redirect(`/exams/gate/${routePaper}/practice/${target}?${paramsOut.toString()}`);
  }
  return <section className={styles.page}><GateBuilder paper={routePaper.toLowerCase()} topics={topics} years={years} questionTypes={questionTypes.length ? questionTypes : ["mcq", "msq", "nat"]} questionCount={questions.length} /></section>;
}

void buildGateTest;
