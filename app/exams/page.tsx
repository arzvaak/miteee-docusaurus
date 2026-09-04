import Link from "next/link";
import { ArrowRight, Calculator, Gauge, GraduationCap, Target } from "lucide-react";
import { getCatQuantQuestions, getCatQuantTopics } from "@/lib/cat";
import { getGateDashboard } from "@/lib/gate";
import { getSscCglDashboard } from "@/lib/ssc-cgl";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "Exams - MITEEE",
  description: "Choose an exam, then study by subject and topic before moving into focused practice and timed tests.",
  pathname: "/exams"
});

export default function ExamsPage() {
  const ssc = getSscCglDashboard();
  const catTopics = getCatQuantTopics();
  const catQuestions = getCatQuantQuestions();
  const gate = getGateDashboard();

  return (
    <section className="page ssc-page">
      <header className="panel ssc-hero">
        <div>
          <p className="panel-kicker">Exams</p>
          <h1>Choose an exam. Then choose a subject.</h1>
          <p>Each exam keeps its subjects, topic lessons, practice sets, and timed tests in one clear path.</p>
        </div>
      </header>

      <Link className="panel ssc-exam-card" href="/exams/ssc-cgl">
        <span className="home-icon-badge"><Target size={20} aria-hidden="true" /></span>
        <div>
          <strong>SSC CGL Tier-I</strong>
          <p>Four subjects, {ssc.readiness.topics} topic lessons, {ssc.readiness.reviewedQuestions} practice questions, and {ssc.readiness.tests} tests.</p>
        </div>
        <Gauge size={18} aria-hidden="true" />
        <ArrowRight size={18} aria-hidden="true" />
      </Link>

      <Link className="panel ssc-exam-card" href="/exams/cat">
        <span className="home-icon-badge"><Calculator size={20} aria-hidden="true" /></span>
        <div>
          <strong>CAT</strong>
          <p>Quantitative Aptitude is active with {catTopics.length} chapter notes and {catQuestions.length.toLocaleString("en-IN")} reviewed questions.</p>
        </div>
        <Gauge size={18} aria-hidden="true" />
        <ArrowRight size={18} aria-hidden="true" />
      </Link>

      <Link className="panel ssc-exam-card" href="/exams/gate">
        <span className="home-icon-badge"><GraduationCap size={20} aria-hidden="true" /></span>
        <div>
          <strong>GATE EE &amp; DA</strong>
          <p>Topic-wise Electrical Engineering and Data Science practice with {gate.questionCount.toLocaleString("en-IN")} official-key-backed questions.</p>
        </div>
        <Gauge size={18} aria-hidden="true" />
        <ArrowRight size={18} aria-hidden="true" />
      </Link>
    </section>
  );
}
