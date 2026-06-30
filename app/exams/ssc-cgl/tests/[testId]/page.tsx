import { notFound } from "next/navigation";
import { TimedTestRunner } from "@/components/TimedTestRunner";
import { getSscCglTest } from "@/lib/ssc-cgl";
import { buildPageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ testId: string }> }) {
  const { testId } = await params;
  const test = getSscCglTest(testId);
  return buildPageMetadata({
    title: test ? `${test.title} - SSC CGL` : "SSC CGL Test",
    description: test?.description || "Timed SSC CGL Tier-I practice test.",
    pathname: `/exams/ssc-cgl/tests/${testId}`
  });
}

export default async function SscCglTestPage({ params }: { params: Promise<{ testId: string }> }) {
  const { testId } = await params;
  const test = getSscCglTest(testId);
  if (!test) notFound();

  return <TimedTestRunner test={test} />;
}
