import Link from "next/link";
import { ArrowRight, BarChart3, Clock3, FilterX, Gauge, Target, Trophy } from "lucide-react";
import { SscAttemptHistory } from "@/components/SscAttemptHistory";
import { SscMistakeNotebook } from "@/components/SscMistakeNotebook";
import { getSscCglTests, getSscTopic, sscCglPattern } from "@/lib/ssc-cgl";
import type { SscCglSectionId, SscCglTestMode } from "@/lib/exam-types";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "SSC CGL Timed Tests",
  description: "Start SSC CGL Tier-I full mocks and section sprints with 2026-style timers.",
  pathname: "/exams/ssc-cgl/tests"
});

const sectionIds = new Set<SscCglSectionId>(sscCglPattern.sections.map((section) => section.id));
const modeIds = new Set<SscCglTestMode>(["full_mock", "pyq_shift", "topic_drill", "weak_topic", "speed_sprint"]);
const modeOptions: Array<{ mode: SscCglTestMode; label: string; description: string; href: string }> = [
  {
    mode: "full_mock",
    label: "Full mocks",
    description: "100 questions, 200 marks, and all four section clocks.",
    href: "/exams/ssc-cgl/tests?mode=full_mock"
  },
  {
    mode: "speed_sprint",
    label: "Section sprints",
    description: "25-question clocked lanes for 50/50 section work.",
    href: "/exams/ssc-cgl/tests?mode=speed_sprint"
  },
  {
    mode: "topic_drill",
    label: "Topic drills",
    description: "Single-topic repair sets from the coverage map.",
    href: "/exams/ssc-cgl/tests?mode=topic_drill"
  },
  {
    mode: "pyq_shift",
    label: "Book PYQ shifts",
    description: "Uploaded-book PYQ-style shift sets for source practice.",
    href: "/exams/ssc-cgl/tests?mode=pyq_shift"
  },
  {
    mode: "weak_topic",
    label: "Weak-topic queue",
    description: "Reserved for personalized repair sets from attempt history.",
    href: "/exams/ssc-cgl/tests?mode=weak_topic"
  }
];

function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function normalizeSection(value: string | string[] | undefined): SscCglSectionId | undefined {
  const section = firstParam(value);
  return section && sectionIds.has(section as SscCglSectionId) ? section as SscCglSectionId : undefined;
}

function normalizeTopic(value: string | string[] | undefined) {
  const topic = firstParam(value);
  return topic && /^[a-z0-9-]+$/.test(topic) ? topic : undefined;
}

function normalizeMode(value: string | string[] | undefined): SscCglTestMode | undefined {
  const mode = firstParam(value);
  return mode && modeIds.has(mode as SscCglTestMode) ? mode as SscCglTestMode : undefined;
}

export default async function SscCglTestsPage({
  searchParams
}: {
  searchParams?: Promise<{ section?: string | string[]; topic?: string | string[]; mode?: string | string[] }>;
}) {
  const params = await searchParams;
  const section = normalizeSection(params?.section);
  const topic = normalizeTopic(params?.topic);
  const mode = normalizeMode(params?.mode);
  const allTests = getSscCglTests();
  const modeCounts = allTests.reduce((counts, test) => {
    counts[test.mode] = (counts[test.mode] ?? 0) + 1;
    return counts;
  }, Object.fromEntries(modeOptions.map((item) => [item.mode, 0])) as Record<SscCglTestMode, number>);
  const filteredTests = getSscCglTests({ section, topic, mode });
  const topicDetail = topic ? getSscTopic(topic) : null;
  const sectionDetail = section ? sscCglPattern.sections.find((item) => item.id === section) : null;
  const modeLabel = modeOptions.find((item) => item.mode === mode)?.label;
  const activeFilter = topicDetail?.title ?? sectionDetail?.title ?? modeLabel ?? null;
  const firstFullMock = allTests.find((test) => test.mode === "full_mock");
  const firstQuantSprint = allTests.find((test) => test.mode === "speed_sprint" && /quantitative aptitude|quant/i.test(test.title));
  const firstTopicDrill = allTests.find((test) => test.mode === "topic_drill" || test.mode === "weak_topic");
  const firstPyqShift = allTests.find((test) => test.mode === "pyq_shift");
  const launchPlan = [
    {
      label: "01 Baseline",
      title: "Start with a full 200-mark mock",
      body: "Set the first score line, expose section pressure, and create a repair queue from real losses.",
      href: firstFullMock ? `/exams/ssc-cgl/tests/${firstFullMock.id}` : "/exams/ssc-cgl/tests?mode=full_mock",
      meta: `${modeCounts.full_mock ?? 0} full mocks`,
      icon: <Trophy size={18} aria-hidden="true" />
    },
    {
      label: "02 Speed",
      title: "Protect Quant 50/50",
      body: "Use the 36-second section lane before slow reading. Every slow solution becomes a shorter rule.",
      href: firstQuantSprint ? `/exams/ssc-cgl/tests/${firstQuantSprint.id}` : "/exams/ssc-cgl/tests?section=quantitative-aptitude&mode=speed_sprint",
      meta: "25 questions · 900 sec",
      icon: <Gauge size={18} aria-hidden="true" />
    },
    {
      label: "03 Repair",
      title: "Attack the weakest topic",
      body: "Use mistake history or topic drills to turn wrong and unattempted questions into catch rules.",
      href: firstTopicDrill ? `/exams/ssc-cgl/tests/${firstTopicDrill.id}` : "/exams/ssc-cgl/topics",
      meta: `${modeCounts.topic_drill ?? 0} topic drills`,
      icon: <Target size={18} aria-hidden="true" />
    },
    {
      label: "04 Source",
      title: "Close with a book-PYQ shift",
      body: "End with source-style repetition so the corpus stays exam-shaped instead of abstract practice.",
      href: firstPyqShift ? `/exams/ssc-cgl/tests/${firstPyqShift.id}` : "/exams/ssc-cgl/tests?mode=pyq_shift",
      meta: `${modeCounts.pyq_shift ?? 0} shifts`,
      icon: <Clock3 size={18} aria-hidden="true" />
    }
  ];

  return (
    <section className="page ssc-page">
      <header className="panel ssc-hero">
        <div>
          <p className="panel-kicker">Timed tests</p>
          <h1>Practice under the real section clock.</h1>
          <p>Reviewed questions only enter ranked tests. Review-queue imports are visible in the dashboard but blocked from scores.</p>
        </div>
      </header>

      <SscAttemptHistory title="Recent attempt history" />
      <SscMistakeNotebook />

      <Link className="panel ssc-endless-statboard-link" href="/exams/ssc-cgl/statboard">
        <BarChart3 size={22} aria-hidden="true" />
        <span>
          <small>Endless practice memory</small>
          <strong>Open my statboard and review marked or missed questions.</strong>
        </span>
        <ArrowRight size={17} aria-hidden="true" />
      </Link>

      <section className="panel ssc-test-launch-panel" aria-labelledby="ssc-test-launch-heading">
        <div className="ssc-panel-heading">
          <Clock3 size={18} aria-hidden="true" />
          <div>
            <p className="panel-kicker">200/200 launch order</p>
            <h2 id="ssc-test-launch-heading">Choose the next timed action, not another list.</h2>
          </div>
        </div>
        <div className="ssc-test-launch-grid">
          {launchPlan.map((item) => (
            <Link className="ssc-test-launch-card" href={item.href} key={item.label}>
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

      <section className="panel ssc-test-mode-panel" aria-label="Mode shortcuts">
        <div className="ssc-panel-heading">
          <Clock3 size={18} aria-hidden="true" />
          <strong>Mode shortcuts</strong>
        </div>
        <div className="ssc-test-mode-grid">
          {modeOptions.map((item) => (
            <Link className={mode === item.mode ? "ssc-test-mode-card active" : "ssc-test-mode-card"} href={item.href} key={item.mode}>
              <strong>{item.label}</strong>
              <span>{modeCounts[item.mode] ?? 0} tests</span>
              <p>{item.description}</p>
            </Link>
          ))}
        </div>
      </section>

      {activeFilter ? (
        <section className="panel ssc-test-filter-strip" aria-label="Active drill filter">
          <div>
            <p className="panel-kicker">Active drill filter</p>
            <strong>{activeFilter}</strong>
            <span>{filteredTests.length} timed tests match this 200/200 repair lane.</span>
          </div>
          <Link className="button ghost" href="/exams/ssc-cgl/tests">
            <FilterX size={15} aria-hidden="true" />
            Clear filter
          </Link>
        </section>
      ) : null}

      <div id="ssc-tests" className="ssc-test-list">
        {filteredTests.length === 0 ? (
          <article className="panel ssc-empty-state">
            <Clock3 size={22} aria-hidden="true" />
            <h2>No timed tests for this filter yet</h2>
            <p>Open the topic note for end-of-chapter practice, or clear the filter for the full ranked mock bank.</p>
            <Link className="button primary" href="/exams/ssc-cgl/tests">Show all tests</Link>
          </article>
        ) : filteredTests.map((test) => (
          <Link className="panel ssc-test-card" key={test.id} href={`/exams/ssc-cgl/tests/${test.id}`}>
            <Clock3 size={20} aria-hidden="true" />
            <div>
              <strong>{test.title}</strong>
              <p>{test.description}</p>
              <small>{test.questionCount} questions · {test.maxScore} marks · {Math.round(test.durationSeconds / 60)} min · {test.reviewStatus}</small>
            </div>
            <ArrowRight size={18} aria-hidden="true" />
          </Link>
        ))}
      </div>
    </section>
  );
}
