import { SscExamSetup } from "@/components/SscExamSetup";
import { getSscCglDashboard, getSscCglTests } from "@/lib/ssc-cgl";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "SSC CGL MCQ Practice - MITEEE",
  description: "Choose an SSC CGL MCQ drill by section, length, timing, source, difficulty, or weakness evidence, including endless practice and full mocks.",
  pathname: "/practice"
});

export default function PracticePage() {
  const dashboard = getSscCglDashboard();
  const tests = getSscCglTests();
  const featuredTest = tests.find((test) => test.mode === "full_mock");
  const modeCounts = dashboard.readiness.testModeCounts;

  return (
    <SscExamSetup
      overviewHref="/practice"
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
