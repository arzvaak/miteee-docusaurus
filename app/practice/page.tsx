import Link from "next/link";
import { ArrowRight, Calculator, GraduationCap } from "lucide-react";
import { getGateDashboard } from "@/lib/gate";
import { SscExamSetup } from "@/components/SscExamSetup";
import { getSscCglDashboard, getSscCglTests } from "@/lib/ssc-cgl";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "Exam Practice - MITEEE",
  description: "Practice CAT Quant chapter questions or choose an SSC CGL drill by section, length, timing, source, difficulty, and weakness evidence.",
  pathname: "/practice"
});

export default function PracticePage() {
  const dashboard = getSscCglDashboard();
  const tests = getSscCglTests();
  const featuredTest = tests.find((test) => test.mode === "full_mock");
  const modeCounts = dashboard.readiness.testModeCounts;
  const gate = getGateDashboard();

  return (
    <>
      <section className="page ssc-page">
        <Link className="panel ssc-exam-card" href="/exams/cat/quant/practice">
          <span className="home-icon-badge"><Calculator size={20} aria-hidden="true" /></span>
          <div><strong>CAT Quant practice</strong><p>Work through the Quantum CAT bank chapter by chapter.</p></div>
          <ArrowRight size={18} aria-hidden="true" />
        </Link>
        <Link className="panel ssc-exam-card" href="/exams/gate">
          <span className="home-icon-badge"><GraduationCap size={20} aria-hidden="true" /></span>
          <div><strong>GATE EE &amp; DA practice</strong><p>Build a topic-wise set from {gate.questionCount.toLocaleString("en-IN")} verified questions.</p></div>
          <ArrowRight size={18} aria-hidden="true" />
        </Link>
      </section>
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
    </>
  );
}
