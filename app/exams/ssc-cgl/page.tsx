import { SscExamSetup } from "@/components/SscExamSetup";
import { getSscCglDashboard, getSscCglTests } from "@/lib/ssc-cgl";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "SSC CGL Tier-I Practice",
  description: "Choose an SSC CGL Tier-I mock, section test, PYQ shift, quick drill, endless session, or weakness-repair test.",
  pathname: "/exams/ssc-cgl"
});

export default function SscCglPage() {
  const dashboard = getSscCglDashboard();
  const tests = getSscCglTests();
  const featuredTest = tests.find((test) => test.mode === "full_mock");
  const modeCounts = dashboard.readiness.testModeCounts;

  return (
    <SscExamSetup
      reviewedQuestions={dashboard.readiness.reviewedQuestions}
      testCount={dashboard.readiness.tests}
      topicCount={dashboard.readiness.topics}
      fullMockCount={dashboard.readiness.fullMocks}
      pyqShiftCount={modeCounts.pyq_shift ?? 0}
      sectionSprintCount={modeCounts.speed_sprint ?? 0}
      sections={dashboard.readiness.sectionReadiness.map((section) => ({
        id: section.section,
        title: section.title,
        readinessPercent: section.readinessPercent,
        reviewedQuestions: section.reviewedQuestions
      }))}
      featuredTest={featuredTest ? {
        id: featuredTest.id,
        title: featuredTest.title,
        questionCount: featuredTest.questionCount,
        durationMinutes: Math.round(featuredTest.durationSeconds / 60)
      } : undefined}
    />
  );
}
