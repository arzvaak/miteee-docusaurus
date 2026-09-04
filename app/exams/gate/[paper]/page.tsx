import { notFound } from "next/navigation";
import { getGatePaper, getGateQuestions, getGateTopics } from "@/lib/gate";
import { GatePaperDashboard } from "@/components/GatePaperDashboard";
import { enrichGateTopics, normalizeGateQuestions, normalizeGateTopics, type GatePaper } from "@/components/GateUi";
import { buildPageMetadata } from "@/lib/seo";
import type { GateSubject } from "@/lib/gate-types";

function subjectForRoute(paper: string): GateSubject | null { const normalized = paper.toUpperCase(); return normalized === "EE" || normalized === "DA" ? normalized as GateSubject : null; }

export async function generateStaticParams() { return [{ paper: "ee" }, { paper: "da" }]; }

export async function generateMetadata({ params }: { params: Promise<{ paper: string }> }) {
  const { paper } = await params;
  return buildPageMetadata({ title: `GATE ${paper.toUpperCase()} Practice`, description: "Topic-wise GATE test series and practice builder.", pathname: `/exams/gate/${paper}` });
}

export default async function GatePaperPage({ params }: { params: Promise<{ paper: string }> }) {
  const { paper: routePaper } = await params;
  const subject = subjectForRoute(routePaper);
  if (!subject) notFound();
  const [rawPaper, rawTopics, rawQuestions] = await Promise.all([
    Promise.resolve(getGatePaper(subject)),
    Promise.resolve(getGateTopics(subject)),
    Promise.resolve(getGateQuestions({ subject }))
  ]);
  const questions = normalizeGateQuestions(rawQuestions, subject);
  const topics = enrichGateTopics(normalizeGateTopics(rawTopics, subject), questions);
  const paperRecord = rawPaper as unknown as Record<string, unknown>;
  const paper: GatePaper = {
    id: routePaper.toLowerCase(),
    title: typeof paperRecord.title === "string" ? paperRecord.title : subject === "EE" ? "Electrical Engineering" : "Data Science & Artificial Intelligence",
    shortTitle: subject,
    description: typeof paperRecord.description === "string" ? paperRecord.description : `Topic-wise ${subject} practice with official answer review.`,
    questionCount: questions.length,
    topicCount: topics.length,
    sectionCount: new Set(topics.map((topic) => topic.section)).size
  };
  const years = [...new Set(questions.map((question) => question.year).filter((year): year is number => Boolean(year)))].sort((a, b) => b - a);
  const questionTypes = [...new Set(questions.map((question) => question.questionType))];
  return <GatePaperDashboard paper={paper} topics={topics} years={years} questionTypes={questionTypes.length ? questionTypes : ["mcq", "msq", "nat"]} questionCount={questions.length} />;
}
