import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ListChecks } from "lucide-react";
import { MarkdownNote } from "@/components/MarkdownNote";
import { NoteQuizClient } from "@/components/NoteQuizClient";
import { SscExplanationPanel } from "@/components/SscExplanationPanel";
import { getSscTopic, getSscTopicPracticePreview, getSscTopics } from "@/lib/ssc-cgl";
import { buildPageMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return getSscTopics().map((topic) => ({ slug: topic.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const topic = getSscTopic(slug);
  return buildPageMetadata({
    title: topic ? `${topic.title} - SSC CGL` : "SSC CGL Topic",
    description: topic?.study.summary || "SSC CGL topic study material and drills.",
    pathname: `/exams/ssc-cgl/topics/${slug}`
  });
}

export default async function SscCglTopicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const topic = getSscTopic(slug);
  if (!topic) notFound();
  const previewQuestions = getSscTopicPracticePreview(topic.slug);
  const sourceBreakdown = topic.practice.sourceBreakdown;
  const routeSteps = [
    {
      label: "01",
      title: "Read concept",
      body: `${topic.study.sections.length} study blocks plus the flowchart. Stop only when the rule and trap are both recallable.`,
      href: "#study-flow"
    },
    {
      label: "02",
      title: "Practice every question",
      body: `${topic.practice.questionIds.length} topic questions in one-by-one mode with instant answer, explanation, source, and mistake capture.`,
      href: `/exams/ssc-cgl/practice/${topic.slug}`
    },
    {
      label: "03",
      title: "Timed drills",
      body: "Shift to 36-second pressure only after the route is understood. Use topic drills until misses stop repeating.",
      href: `/exams/ssc-cgl/tests?topic=${topic.slug}`
    },
    {
      label: "04",
      title: "Mistake repair",
      body: "Wrong and skipped practice items feed the mistake notebook. Re-open the topic, rewrite the rule, then retest.",
      href: "/exams/ssc-cgl/tests#mistake-notebook"
    }
  ];

  return (
    <section className="page ssc-page">
      <NoteQuizClient />
      <header className="panel ssc-hero">
        <div>
          <p className="panel-kicker">{topic.subject}</p>
          <h1>{topic.title}</h1>
          <p>{topic.study.summary}</p>
        </div>
        <Link className="button primary" href={`/exams/ssc-cgl/practice/${topic.slug}`}>Practice now <ArrowRight size={15} aria-hidden="true" /></Link>
      </header>

      <section className="panel ssc-topic-mastery-route" aria-label={`${topic.title} 200/200 route`}>
        <div className="ssc-panel-heading"><ListChecks size={18} aria-hidden="true" /><strong>200/200 route</strong></div>
        <div className="ssc-topic-pressure-grid" aria-label="Corpus pressure">
          <span><strong>{topic.practice.questionIds.length}</strong><small>Corpus pressure</small></span>
          <span><strong>{sourceBreakdown.bookUserProvided}</strong><small>book-backed</small></span>
          <span><strong>{sourceBreakdown.originalPractice}</strong><small>gap-repair</small></span>
          <span><strong>{sourceBreakdown.otherReviewed}</strong><small>other reviewed</small></span>
        </div>
        <div className="ssc-topic-route-grid">
          {routeSteps.map((step) => (
            <Link className="ssc-topic-route-step" href={step.href} key={step.label}>
              <span>{step.label}</span>
              <strong>{step.title}</strong>
              <p>{step.body}</p>
              <ArrowRight size={15} aria-hidden="true" />
            </Link>
          ))}
        </div>
      </section>

      <div className="ssc-topic-detail">
        <section className="panel" id="study-flow">
          <div className="ssc-panel-heading"><ListChecks size={18} aria-hidden="true" /><strong>Study flow</strong></div>
          {topic.study.sections.map((section) => (
            <article className="ssc-study-block" key={section.title}>
              <h2>{section.title}</h2>
              <div className="markdown-body">
                <MarkdownNote content={section.body} sectionName={section.title} />
              </div>
            </article>
          ))}
        </section>
        <aside className="panel">
          <strong>Formula and trap table</strong>
          <div className="ssc-trap-table">
            {topic.study.formulaTable.map((row) => (
              <article key={row.cue}>
                <span>{row.cue}</span>
                <p>{row.rule}</p>
                <small>{row.trap}</small>
              </article>
            ))}
          </div>
        </aside>
      </div>

      <section className="panel">
        <strong>Flowchart</strong>
        <div className="markdown-body ssc-flowchart-rendered">
          <MarkdownNote content={topic.study.flowchart} />
        </div>
      </section>

      <section className="panel ssc-drill-panel">
        <strong>End drill</strong>
        <p>{topic.practice.drillPrompt}</p>
        <div className="ssc-source-split" aria-label="Topic practice source coverage">
          <span>{sourceBreakdown.bookUserProvided} book-backed</span>
          <span>{sourceBreakdown.originalPractice} gap-repair</span>
          <span>{sourceBreakdown.otherReviewed} other reviewed</span>
        </div>
        <div className="ssc-topic-action-row">
          <Link className="button primary" href={`/exams/ssc-cgl/practice/${topic.slug}`}>Practice all questions</Link>
          <Link className="button ghost" href={`/exams/ssc-cgl/tests?topic=${topic.slug}`}>Timed drills</Link>
        </div>
      </section>

      <section className="panel ssc-topic-pyq-panel">
        <div className="ssc-panel-heading"><ListChecks size={18} aria-hidden="true" /><strong>Reviewed PYQ-style questions from this topic</strong></div>
        <div className="ssc-topic-question-list">
          {previewQuestions.map((question, index) => {
            const answer = question.options.find((option) => option.id === question.correctOption);
            return (
              <article className="quiz-block note-quiz-block ssc-topic-quiz-block" key={question.id} data-answer={question.correctOption}>
                <div className="quiz-meta">
                  <span className="quiz-num">Q{index + 1}</span>
                  <span className="quiz-tag">Book PYQ</span>
                  <span className="quiz-type">{question.provenance.title}</span>
                </div>
                <p className="quiz-q">{question.stem}</p>
                <div className="quiz-options" role="list">
                  {question.options.map((option) => (
                    <div className="quiz-option" data-opt={option.id} key={option.id} role="listitem">
                      <span className="opt-key">{option.id.toUpperCase()}</span>
                      <span className="opt-text">{option.text}</span>
                    </div>
                  ))}
                </div>
                <details className="quiz-exp ssc-topic-answer">
                  <summary>Show answer and explanation</summary>
                  <div className="quiz-exp-body">
                    <p><strong>Answer: {question.correctOption.toUpperCase()}.</strong> {answer?.text}</p>
                    <SscExplanationPanel explanation={question.explanation} />
                  </div>
                </details>
              </article>
            );
          })}
        </div>
      </section>
    </section>
  );
}
