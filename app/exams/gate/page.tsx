import { getGateDashboard, getGateQuestions } from "@/lib/gate";
import { buildPageMetadata } from "@/lib/seo";
import { GateLanding } from "@/components/GateLanding";
import { normalizeGateDashboard } from "@/components/GateUi";

export const metadata = buildPageMetadata({ title: "GATE Test Series", description: "Topic-wise GATE Electrical Engineering and Data Science practice for MITEEE.", pathname: "/exams/gate" });

export default async function GatePage() {
  const [rawDashboard, rawQuestions] = await Promise.all([Promise.resolve(getGateDashboard()), Promise.resolve(getGateQuestions())]);
  const allQuestions = Array.isArray(rawQuestions) ? rawQuestions : [];
  const playableBySubject = (subject: string) => new Set(allQuestions.filter((question) => typeof question === "object" && question !== null && "subject" in question && question.subject === subject).map((question) => typeof question === "object" && question !== null && "topic" in question ? question.topic : "").filter(Boolean)).size;
  const normalized = normalizeGateDashboard(rawDashboard);
  const dashboard = { ...normalized, topicCount: normalized.papers.reduce((sum, paper) => sum + (playableBySubject(paper.id.toUpperCase()) || paper.topicCount), 0), papers: normalized.papers.map((paper) => ({ ...paper, topicCount: playableBySubject(paper.id.toUpperCase()) || paper.topicCount })) };
  return <GateLanding dashboard={dashboard} />;
}
