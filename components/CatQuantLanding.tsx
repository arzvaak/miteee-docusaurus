import Link from "next/link";
import { ArrowRight, BookOpen, Calculator, Target } from "lucide-react";
import type { CatQuantTopic } from "@/lib/exam-types";

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-IN").format(value);
}

export function CatQuantLanding({ topics, questionCount }: { topics: CatQuantTopic[]; questionCount: number }) {
  return (
    <section className="page ssc-page">
      <header className="panel ssc-hero">
        <div>
          <p className="panel-kicker">CAT · Quantitative Aptitude</p>
          <h1>Build the method. Then finish the book.</h1>
          <p>Chapter notes and the complete reviewed Quantum CAT question bank stay together, so every concept can move straight into practice.</p>
        </div>
        <div className="ssc-score-grid">
          <span><strong>{topics.length}</strong><small>chapters</small></span>
          <span><strong>{formatNumber(questionCount)}</strong><small>reviewed questions</small></span>
        </div>
      </header>

      <section className="panel ssc-practice-start-panel">
        <div className="ssc-panel-heading">
          <Target size={18} aria-hidden="true" />
          <div><p className="panel-kicker">Practice path</p><strong>Choose a chapter or open the full Quant bank.</strong></div>
        </div>
        <Link className="button primary" href="/exams/cat/quant/practice">Open Quant practice <ArrowRight size={15} aria-hidden="true" /></Link>
      </section>

      <div className="ssc-practice-topic-grid">
        {topics.map((topic) => (
          <article className="panel" key={topic.slug}>
            <p className="panel-kicker">Chapter {String(topic.chapterNumber).padStart(2, "0")}</p>
            <h2>{topic.title}</h2>
            <p>{topic.summary}</p>
            <div className="ssc-score-grid">
              <span><strong>{formatNumber(topic.questionCount)}</strong><small>questions</small></span>
            </div>
            <div className="button-row">
              <Link className="button ghost" href={`/exams/cat/quant/topics/${topic.slug}`}><BookOpen size={15} aria-hidden="true" /> Study</Link>
              <Link className="button primary" href={`/exams/cat/quant/practice/${topic.slug}`}><Calculator size={15} aria-hidden="true" /> Practice</Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
