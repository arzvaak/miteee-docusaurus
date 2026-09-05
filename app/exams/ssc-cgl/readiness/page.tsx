import Link from "next/link";
import { ArrowRight, BookOpenCheck, CheckCircle2, Clock3, Gauge, Newspaper, SearchCheck, ShieldCheck, Trophy } from "lucide-react";
import { getCurrentAffairsStudyBrief } from "@/lib/current-affairs";
import { getSscCglDashboard, getSscCglResources } from "@/lib/ssc-cgl";
import { getSscQuantBookChapters } from "@/lib/ssc-quant-book";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "SSC CGL 200/200 Readiness Proof",
  description: "Learner-facing SSC CGL 200/200 proof board for question depth, mocks, the Quant course, resources, and current affairs freshness.",
  pathname: "/exams/ssc-cgl/readiness"
});

const gateLinks: Record<string, string> = {
  "book-corpus-completeness": "/exams/ssc-cgl/practice",
  "fifty-year-ranked-corpus": "/exams/ssc-cgl/tests",
  "book-pyq-provenance": "/exams/ssc-cgl/resources",
  "topic-mastery": "/exams/ssc-cgl/practice",
  "type-system-coverage": "/exams/ssc-cgl/practice",
  "visual-study-material": "/exams/ssc-cgl/subjects/quantitative-aptitude",
  "practice-explanations": "/exams/ssc-cgl/practice",
  "source-manifest": "/exams/ssc-cgl/resources",
  "current-affairs": "/exams/ssc-cgl/current-affairs"
};

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-IN").format(value);
}

export default function SscCglReadinessPage() {
  const dashboard = getSscCglDashboard();
  const resources = getSscCglResources();
  const currentAffairs = getCurrentAffairsStudyBrief();
  const gates = dashboard.readiness.strictAudit.gates;
  const passCount = gates.filter((gate) => gate.status === "pass").length;
  const quantChapters = getSscQuantBookChapters();
  const totalExamples = quantChapters.reduce((sum, chapter) => sum + chapter.examples.length, 0);
  const totalExercises = quantChapters.reduce((sum, chapter) => sum + chapter.exercises.length, 0);

  const evidenceCards = [
    {
      label: "Question bank",
      value: formatNumber(dashboard.readiness.reviewedQuestions),
      detail: `${formatNumber(resources.bookBackedQuestions)} book-PYQ questions plus focused gap-repair practice.`,
      href: "/exams/ssc-cgl/practice"
    },
    {
      label: "Timed mocks",
      value: formatNumber(dashboard.readiness.fullMocks),
      detail: `${formatNumber(dashboard.readiness.tests)} total tests with 15-minute section locks and 36-second sprint lanes.`,
      href: "/exams/ssc-cgl/tests"
    },
    {
      label: "Quant course",
      value: `${quantChapters.length} chapters`,
      detail: `${formatNumber(totalExamples)} worked examples and ${formatNumber(totalExercises)} separate source-book exercises.`,
      href: "/exams/ssc-cgl/subjects/quantitative-aptitude"
    },
    {
      label: "Resources",
      value: formatNumber(resources.totalCandidates),
      detail: "Official SSC anchors, web PDF leads, Scribd/reference lanes, books, and model-practice sources are mapped.",
      href: "/exams/ssc-cgl/resources"
    },
    {
      label: "Current affairs",
      value: currentAffairs.runState.freshnessLabel,
      detail: `${currentAffairs.sourceQuality.totalItems} facts, ${currentAffairs.recallCards.length} recall cards, ${currentAffairs.sourceQuality.officialSourceItems} official-source items.`,
      href: "/exams/ssc-cgl/current-affairs"
    }
  ];

  return (
    <section className="page ssc-page ssc-proof-page">
      <header className="panel ssc-hero ssc-proof-hero">
        <div>
          <p className="panel-kicker">SSC CGL 200/200 proof</p>
          <h1>{dashboard.readiness.strictAudit.readyFor200 ? "The system is ready for full-score practice." : "The system still has repair gates."}</h1>
          <p>Use this board as the single evidence view: question depth, timed tests, the Quant source course, source coverage, and daily GA freshness.</p>
        </div>
        <div className="ssc-score-grid">
          <span><strong>{passCount}/{gates.length}</strong><small>proof gates</small></span>
          <span><strong>{formatNumber(dashboard.readiness.reviewedQuestions)}</strong><small>practice questions</small></span>
          <span><strong>{quantChapters.length}</strong><small>Quant chapters</small></span>
          <span><strong>{currentAffairs.runState.freshnessLabel}</strong><small>news status</small></span>
        </div>
      </header>

      <section className="panel ssc-proof-launch">
        <div className="ssc-panel-heading">
          <Trophy size={18} aria-hidden="true" />
          <span className="micro-label">Launch order</span>
          <strong>Use proof to decide work, then go straight into practice.</strong>
        </div>
        <div className="ssc-proof-launch-grid">
          <Link href="/exams/ssc-cgl/practice"><Gauge size={18} aria-hidden="true" /><strong>Question bank</strong><span>one-by-one topic queues</span></Link>
          <Link href="/exams/ssc-cgl/tests"><Clock3 size={18} aria-hidden="true" /><strong>Timed tests</strong><span>mocks and section locks</span></Link>
          <Link href="/exams/ssc-cgl/subjects/quantitative-aptitude"><BookOpenCheck size={18} aria-hidden="true" /><strong>Quant course</strong><span>notes, examples, and exercises</span></Link>
          <Link href="/exams/ssc-cgl/current-affairs"><Newspaper size={18} aria-hidden="true" /><strong>Current affairs</strong><span>fresh GA recall</span></Link>
          <Link href="/exams/ssc-cgl/resources"><SearchCheck size={18} aria-hidden="true" /><strong>Resources</strong><span>source and PDF leads</span></Link>
        </div>
      </section>

      <section className="panel ssc-proof-evidence" aria-labelledby="ssc-proof-evidence-heading">
        <div className="ssc-panel-heading">
          <ShieldCheck size={18} aria-hidden="true" />
          <span className="micro-label">Evidence board</span>
          <strong id="ssc-proof-evidence-heading">The five surfaces that make the 200/200 system usable</strong>
        </div>
        <div className="ssc-proof-evidence-grid">
          {evidenceCards.map((card) => (
            <Link className="ssc-proof-evidence-card" href={card.href} key={card.label}>
              <span>{card.label}</span>
              <strong>{card.value}</strong>
              <p>{card.detail}</p>
              <em>Open <ArrowRight size={14} aria-hidden="true" /></em>
            </Link>
          ))}
        </div>
      </section>

      <section className="panel ssc-proof-gates" aria-labelledby="ssc-proof-gates-heading">
        <div className="ssc-panel-heading">
          <CheckCircle2 size={18} aria-hidden="true" />
          <span className="micro-label">{dashboard.readiness.strictAudit.readyFor200 ? "ready" : "needs repair"}</span>
          <strong id="ssc-proof-gates-heading">Strict proof gates</strong>
        </div>
        <p>{dashboard.readiness.strictAudit.summary}</p>
        <div className="ssc-proof-gate-list">
          {gates.map((gate) => (
            <Link className={`ssc-proof-gate status-${gate.status}`} href={gateLinks[gate.id] ?? "/exams/ssc-cgl"} key={gate.id}>
              <span>{gate.status}</span>
              <strong>{gate.label}</strong>
              <p>{gate.evidence}</p>
              <em>Inspect <ArrowRight size={14} aria-hidden="true" /></em>
            </Link>
          ))}
        </div>
      </section>

      <footer className="panel ssc-proof-footer">
        <span>Generated evidence: {dashboard.generatedAt}</span>
        <Link href="/exams/ssc-cgl">Back to command center <ArrowRight size={14} aria-hidden="true" /></Link>
      </footer>
    </section>
  );
}
