import Link from "next/link";
import { ArrowRight, Gauge, Target } from "lucide-react";
import { getSscCglDashboard } from "@/lib/ssc-cgl";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "Exam Systems - MITEEE Study OS",
  description: "First-class exam modules with timed practice, ranked attempts, topic repair, and daily current affairs.",
  pathname: "/exams"
});

export default function ExamsPage() {
  const ssc = getSscCglDashboard();

  return (
    <section className="page ssc-page">
      <header className="panel ssc-hero">
        <div>
          <p className="panel-kicker">Exam systems</p>
          <h1>Ranked practice, source-aware content, repair loops.</h1>
          <p>Exam modules sit beside the note vault so timed MCQs, PYQ provenance, and weak-topic analytics stay structured.</p>
        </div>
      </header>

      <Link className="panel ssc-exam-card" href="/exams/ssc-cgl">
        <span className="home-icon-badge"><Target size={20} aria-hidden="true" /></span>
        <div>
          <strong>SSC CGL Tier-I 200/200 system</strong>
          <p>{ssc.readiness.reviewedQuestions} reviewed questions, {ssc.readiness.topics} topic maps, {ssc.readiness.tests} tests.</p>
        </div>
        <Gauge size={18} aria-hidden="true" />
        <ArrowRight size={18} aria-hidden="true" />
      </Link>
    </section>
  );
}
