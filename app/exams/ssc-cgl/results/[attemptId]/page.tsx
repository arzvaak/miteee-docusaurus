import { SscAttemptResultClient } from "@/components/SscAttemptResultClient";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "SSC CGL Attempt Result",
  description: "Local SSC CGL timed attempt score, rank simulation, section analysis, and weak-topic repair.",
  pathname: "/exams/ssc-cgl/results"
});

export default async function SscCglResultPage({ params }: { params: Promise<{ attemptId: string }> }) {
  const { attemptId } = await params;
  return <SscAttemptResultClient attemptId={attemptId} />;
}
