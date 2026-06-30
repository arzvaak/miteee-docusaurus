import Link from "next/link";
import { ArrowRight, BookOpenCheck, Calculator, Clock3, Gauge, Newspaper, Target, Trophy } from "lucide-react";
import { getSscCglDashboard, getSscCglPracticeTopics, getSscCglTests } from "@/lib/ssc-cgl";
import type { SscCglSectionId } from "@/lib/exam-types";
import type { ReactNode } from "react";

type Section50CockpitProps = {
  section: SscCglSectionId;
  eyebrow: string;
  heading: string;
  lede: string;
  speedTitle: string;
  speedBody: string;
  repairTopicSlug: string;
  repairBody: string;
  depthBody: string;
  accent: "quant" | "reasoning" | "ga" | "english";
};

const sectionIcon = {
  "quantitative-aptitude": <Calculator size={18} aria-hidden="true" />,
  reasoning: <Target size={18} aria-hidden="true" />,
  "general-awareness": <Newspaper size={18} aria-hidden="true" />,
  "english-comprehension": <BookOpenCheck size={18} aria-hidden="true" />
} satisfies Record<SscCglSectionId, ReactNode>;

export function Section50Cockpit({
  section,
  eyebrow,
  heading,
  lede,
  speedTitle,
  speedBody,
  repairTopicSlug,
  repairBody,
  depthBody,
  accent
}: Section50CockpitProps) {
  const dashboard = getSscCglDashboard();
  const allTests = getSscCglTests();
  const practiceTopics = getSscCglPracticeTopics();
  const sectionReadiness = dashboard.readiness.sectionReadiness.find((item) => item.section === section);
  const topics = practiceTopics
    .filter((topic) => topic.section === section)
    .sort((a, b) => b.totalQuestions - a.totalQuestions || a.title.localeCompare(b.title));
  const sprints = getSscCglTests({ section, mode: "speed_sprint" }).slice(0, 8);
  const topicDrills = getSscCglTests({ section, mode: "topic_drill" }).slice(0, 8);
  const firstSprint = sprints[0] ?? allTests.find((test) => test.mode === "speed_sprint");
  const fullMock = allTests.find((test) => test.mode === "full_mock");
  const totalQuestions = topics.reduce((sum, topic) => sum + topic.totalQuestions, 0);
  const bookBackedQuestions = topics.reduce((sum, topic) => sum + topic.bookBackedQuestions, 0);
  const gapRepairQuestions = topics.reduce((sum, topic) => sum + topic.gapRepairQuestions, 0);
  const pyqQuestions = topics.reduce((sum, topic) => sum + topic.pyqQuestions, 0);
  const highestVolumeTopic = topics[0];

  const launchOrder = [
    {
      label: "01 Clock",
      title: speedTitle,
      body: speedBody,
      href: firstSprint ? `/exams/ssc-cgl/tests/${firstSprint.id}` : `/exams/ssc-cgl/tests?section=${section}&mode=speed_sprint`,
      meta: "25 questions · 50 marks · 900 sec",
      icon: <Clock3 size={18} aria-hidden="true" />
    },
    {
      label: "02 Repair",
      title: "Clear section leaks",
      body: repairBody,
      href: `/exams/ssc-cgl/practice/${repairTopicSlug}?mode=misses`,
      meta: "wrong, skipped, and slow rows",
      icon: <Gauge size={18} aria-hidden="true" />
    },
    {
      label: "03 Depth",
      title: "Finish the highest-volume topic bank",
      body: depthBody,
      href: highestVolumeTopic?.href ?? "/exams/ssc-cgl/practice",
      meta: highestVolumeTopic ? `${formatNumber(highestVolumeTopic.totalQuestions)} questions · ${highestVolumeTopic.title}` : "topic practice",
      icon: sectionIcon[section]
    },
    {
      label: "04 Audit",
      title: "Retest inside a full mock",
      body: "A 50/50 section only counts when it survives the full four-section paper without leaking time or marks.",
      href: fullMock ? `/exams/ssc-cgl/tests/${fullMock.id}` : "/exams/ssc-cgl/tests?mode=full_mock",
      meta: "100 questions · 200 marks",
      icon: <Trophy size={18} aria-hidden="true" />
    }
  ];

  return (
    <section className={`page ssc-page ssc-quant-page ssc-section50-page section-${accent}`}>
      <header className="panel ssc-quant-hero ssc-section50-hero">
        <div>
          <p className="panel-kicker">{eyebrow}</p>
          <h1>{heading}</h1>
          <p>{lede}</p>
        </div>
        <div className="ssc-score-grid">
          <span><strong>{formatNumber(totalQuestions)}</strong><small>section questions</small></span>
          <span><strong>{formatNumber(bookBackedQuestions)}</strong><small>book PYQ-style</small></span>
          <span><strong>{formatNumber(gapRepairQuestions)}</strong><small>repair rows</small></span>
          <span><strong>50 marks</strong><small>section target</small></span>
        </div>
      </header>

      <section className="panel ssc-quant-launch ssc-section50-launch" aria-labelledby={`${accent}-launch-heading`}>
        <div className="ssc-panel-heading">
          <Target size={18} aria-hidden="true" />
          <div>
            <p className="panel-kicker">Launch order</p>
            <h2 id={`${accent}-launch-heading`}>Section score first, browsing second.</h2>
          </div>
        </div>
        <div className="ssc-quant-launch-grid">
          {launchOrder.map((item) => (
            <Link className="ssc-quant-launch-card" href={item.href} key={item.label}>
              {item.icon}
              <span>{item.label}</span>
              <strong>{item.title}</strong>
              <p>{item.body}</p>
              <small>{item.meta}</small>
              <ArrowRight size={15} aria-hidden="true" />
            </Link>
          ))}
        </div>
      </section>

      <section className="panel ssc-quant-scoreline" aria-label={`${eyebrow} scoreline`}>
        <div>
          <p className="panel-kicker">50/50 bar</p>
          <strong>{sectionReadiness?.title ?? eyebrow}</strong>
          <span>{sectionReadiness ? `${formatNumber(sectionReadiness.reviewedQuestions)} reviewed questions across ${sectionReadiness.topics} sublevels.` : "This section follows the official 25-question Tier-I section clock."}</span>
        </div>
        <div className="ssc-quant-scoreline-grid">
          <span><strong>{formatNumber(pyqQuestions)}</strong><small>PYQ-style rows</small></span>
          <span><strong>{topics.length}</strong><small>sublevels</small></span>
          <span><strong>{sprints.length}</strong><small>section sprints</small></span>
          <span><strong>{topicDrills.length}</strong><small>topic drills</small></span>
        </div>
      </section>

      <section className="panel ssc-quant-sprints" aria-labelledby={`${accent}-sprints-heading`}>
        <div className="ssc-panel-heading">
          <Clock3 size={18} aria-hidden="true" />
          <strong id={`${accent}-sprints-heading`}>15-minute section sprints</strong>
        </div>
        <div className="ssc-quant-sprint-list">
          {sprints.map((test) => (
            <Link href={`/exams/ssc-cgl/tests/${test.id}`} key={test.id}>
              <span>
                <strong>{test.title}</strong>
                <small>{test.questionCount} questions · {test.maxScore} marks · {Math.round(test.durationSeconds / 60)} min</small>
              </span>
              <em>{test.description}</em>
              <ArrowRight size={15} aria-hidden="true" />
            </Link>
          ))}
        </div>
      </section>

      <section className="panel ssc-quant-topics" aria-labelledby={`${accent}-topics-heading`}>
        <div className="ssc-panel-heading">
          {sectionIcon[section]}
          <strong id={`${accent}-topics-heading`}>{eyebrow} sublevels</strong>
        </div>
        <div className="ssc-quant-topic-grid">
          {topics.map((topic) => (
            <Link className="ssc-quant-topic-card" href={`${topic.href}?mode=unanswered`} key={topic.slug}>
              <strong>{topic.title}</strong>
              <p>{formatNumber(topic.totalQuestions)} questions · {formatNumber(topic.bookBackedQuestions)} book-backed · {formatNumber(topic.gapRepairQuestions)} repair</p>
              <div className="ssc-quant-topic-meter" aria-label={`${topic.reviewedQuestions} reviewed questions`}>
                <i style={{ width: `${Math.min(100, Math.round(topic.totalQuestions / 500 * 100))}%` }} />
              </div>
              <span>Practice unanswered <ArrowRight size={14} aria-hidden="true" /></span>
            </Link>
          ))}
        </div>
      </section>

      <section className="panel ssc-quant-drills" aria-labelledby={`${accent}-drills-heading`}>
        <div className="ssc-panel-heading">
          <Gauge size={18} aria-hidden="true" />
          <strong id={`${accent}-drills-heading`}>Topic drill shortcuts</strong>
        </div>
        <div className="ssc-quant-drill-list">
          {topicDrills.map((test) => (
            <Link href={`/exams/ssc-cgl/tests/${test.id}`} key={test.id}>
              <span>{test.title}</span>
              <small>{test.questionCount} questions · {Math.round(test.durationSeconds / 60)} min</small>
            </Link>
          ))}
        </div>
      </section>
    </section>
  );
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-IN").format(value);
}
