import Link from "next/link";
import { ArrowRight, BookOpenCheck, Gauge } from "lucide-react";
import { getSscCglTopicCoverageMap } from "@/lib/ssc-cgl";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "SSC CGL Topic Map",
  description: "SSC CGL Tier-I topics with rules, traps, flowcharts, and linked practice.",
  pathname: "/exams/ssc-cgl/topics"
});

export default function SscCglTopicsPage() {
  const coverage = getSscCglTopicCoverageMap();
  const focusBySection = {
    reasoning: "patterns, relations, arrangements, non-verbal logic",
    "general-awareness": "static GK, science, polity, economy, current anchors",
    "quantitative-aptitude": "36-second arithmetic, algebra, geometry, DI, speed traps",
    "english-comprehension": "grammar, vocabulary, cloze, sentence flow, reading precision"
  };

  return (
    <section className="page ssc-page">
      <header className="panel ssc-hero">
        <div>
          <p className="panel-kicker">Topic map</p>
          <h1>Rules, traps, flowcharts, drills.</h1>
          <p>Every topic page ends in reviewed question practice and an explicit repair prompt.</p>
        </div>
        <div className="ssc-score-grid">
          <span><strong>{coverage.totalReviewedQuestions}</strong><small>reviewed questions</small></span>
          <span><strong>{coverage.totalTopics}</strong><small>sublevels</small></span>
          <span><strong>{coverage.deepNotes}</strong><small>deep notes</small></span>
          <span><strong>{coverage.thinTopics}</strong><small>thin topics</small></span>
        </div>
      </header>

      <section className="panel ssc-topic-sufficiency" aria-label="SSC CGL topic sufficiency ledger">
        <div className="ssc-panel-heading">
          <Gauge size={18} aria-hidden="true" />
          <strong>Sufficiency ledger</strong>
        </div>
        <div className="ssc-inventory-grid">
          <span><strong>{coverage.masteryTargetQuestionsPerTopic}</strong><small>target per topic</small></span>
          <span><strong>{coverage.bookBackedTargetQuestionsPerTopic}</strong><small>book-backed floor</small></span>
          <span><strong>{coverage.minimumReviewedQuestions}</strong><small>lowest topic bank</small></span>
          <span><strong>{coverage.topicsPracticeSufficient}</strong><small>practice-ready</small></span>
          <span><strong>{coverage.topicsFullySufficient}</strong><small>fully sufficient</small></span>
          <span><strong>{coverage.masteryGateFailures}</strong><small>gate failures</small></span>
          <span><strong>{coverage.topicsWithTimedDrills}</strong><small>timed drills</small></span>
        </div>
        <div className="ssc-topic-weakest" aria-label="Lowest-volume topic repair queue">
          {coverage.weakestTopics.map((topic) => (
            <Link href={topic.href} key={topic.slug}>
              <span>
                <strong>{topic.title}</strong>
                <small>{topic.subject} · {topic.reviewedQuestions} reviewed · {topic.bookBackedQuestions} book-backed</small>
              </span>
              <em>{topic.coverageLabel}</em>
              <ArrowRight size={15} aria-hidden="true" />
            </Link>
          ))}
        </div>
      </section>

      <div className="ssc-topic-levels">
        {coverage.sections.map((section, index) => {
          return (
            <section className="panel ssc-topic-level" key={section.section}>
              <header>
                <span>Level {index + 1}</span>
                <div>
                  <h2>{section.title}</h2>
                  <p>{focusBySection[section.section]}</p>
                </div>
                <strong>{section.topics} sublevels · {section.reviewedQuestions} questions</strong>
              </header>
              <div className="ssc-topic-sublevels">
                {section.rows.map((row) => (
                  <Link className="ssc-topic-card" href={row.href} key={row.slug}>
                    <BookOpenCheck size={18} aria-hidden="true" />
                    <strong>{row.title}</strong>
                    <p>{row.nextAction}</p>
                    <span>{row.reviewedQuestions} reviewed drills <ArrowRight size={14} aria-hidden="true" /></span>
                    <small>{row.bookBackedQuestions} book-backed · {row.gapRepairQuestions} gap-repair · rank {row.sectionRank}</small>
                  </Link>
                ))}
              </div>
              <section className="ssc-topic-coverage" aria-label={`${section.title} 200/200 coverage matrix`}>
                <div className="ssc-panel-heading">
                  <Gauge size={18} aria-hidden="true" />
                  <strong>200/200 coverage matrix</strong>
                </div>
                <div className="ssc-topic-coverage-list">
                  {section.rows.map((row) => (
                    <article className={`ssc-topic-coverage-row status-${row.readinessLabel}`} key={row.slug}>
                      <div>
                        <span>#{row.sectionRank}</span>
                        <strong>{row.title}</strong>
                        <small>{row.coverageLabel} · {row.sufficiencyScore}% gate · {row.priority}</small>
                      </div>
                      <div className="ssc-topic-coverage-meter" aria-label={`${row.readinessPercent}% coverage readiness`}>
                        <i style={{ width: `${row.readinessPercent}%` }} />
                      </div>
                      <dl>
                        <div><dt>Questions</dt><dd>{row.reviewedQuestions}</dd></div>
                        <div><dt>Book</dt><dd>{row.bookBackedQuestions}</dd></div>
                        <div><dt>Note</dt><dd>{Math.round(row.noteBodyLength / 1000)}k</dd></div>
                        <div><dt>Examples</dt><dd>{row.exampleCount}</dd></div>
                      </dl>
                      <div className="ssc-topic-mastery-gates" aria-label={`${row.title} 200/200 mastery gates`}>
                        <span className={row.practiceReady ? "status-pass" : "status-fail"}>{row.practiceReady ? "Practice-ready" : "Practice gap"}</span>
                        <span className={row.masteryReady ? "status-pass" : "status-fail"}>{row.masteryReady ? "Mastery-ready" : "Gaps remain"}</span>
                        <span className={row.bookFloorGap === 0 ? "status-pass" : "status-fail"}>{row.bookFloorGap === 0 ? "Book floor" : `${row.bookFloorGap} book gap`}</span>
                        <span className={row.hasTimedDrill ? "status-pass" : "status-fail"}>{row.hasTimedDrill ? "36-sec drill" : "No timed drill"}</span>
                        <span className={row.hasFlowchart ? "status-pass" : "status-fail"}>{row.hasFlowchart ? "Flowchart" : "Needs flowchart"}</span>
                        <span className={row.hasTrapTable ? "status-pass" : "status-fail"}>{row.hasTrapTable ? "Trap table" : "Needs trap table"}</span>
                      </div>
                      {row.sufficiencyGaps.length > 0 ? (
                        <p className="ssc-topic-gaps">Next gap: {row.sufficiencyGaps.slice(0, 2).join(" · ")}</p>
                      ) : (
                        <p className="ssc-topic-gaps">Ready for rotation through full mocks and mixed-speed repair.</p>
                      )}
                      <div className="ssc-topic-coverage-actions">
                        <Link href={row.href}>Open note</Link>
                        <Link href={`/exams/ssc-cgl/practice/${row.slug}`}>Practice bank</Link>
                        <Link href={row.drillHref}>Timed drill</Link>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            </section>
          );
        })}
      </div>
    </section>
  );
}
