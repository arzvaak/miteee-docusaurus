import Link from "next/link";
import { ArrowRight, Gauge, Target } from "lucide-react";
import type { SscCglSubjectDefinition } from "@/lib/ssc-cgl-subjects";
import styles from "@/components/SscCglQuestionSubjectLanding.module.css";

export type SscCglQuestionSubjectTopic = {
  slug: string;
  title: string;
  summary: string;
  reviewedQuestions: number;
  bookBackedQuestions: number;
  readinessPercent: number;
  coverageLabel: string | null;
};

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-IN").format(value);
}

export function SscCglQuestionSubjectLanding({
  subject,
  topics,
  reviewedQuestions,
  bookBackedQuestions
}: {
  subject: SscCglSubjectDefinition;
  topics: SscCglQuestionSubjectTopic[];
  reviewedQuestions: number;
  bookBackedQuestions: number;
}) {
  return (
    <main className={styles.page} data-ssc-question-subject={subject.section}>
      <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
        <Link href="/exams">Exams</Link><span aria-hidden="true">/</span>
        <Link href="/exams/ssc-cgl">SSC CGL</Link><span aria-hidden="true">/</span>
        <span aria-current="page">{subject.shortTitle}</span>
      </nav>

      <header className={styles.hero}>
        <div>
          <p className={styles.eyebrow}>SSC CGL Tier-I · Question bank</p>
          <h1>{subject.title}</h1>
          <p>The old study notes have been retired. Every reviewed question remains available here, grouped by topic for focused practice.</p>
          <div className={styles.actions}>
            <Link className={styles.primary} href="/exams/ssc-cgl/practice"><Gauge size={16} aria-hidden="true" /> Open question bank</Link>
            <Link className={styles.secondary} href={subject.cockpitHref}><Target size={16} aria-hidden="true" /> 50/50 cockpit</Link>
          </div>
        </div>
        <dl className={styles.stats}>
          <div><dt>Topics</dt><dd>{topics.length}</dd></div>
          <div><dt>Reviewed</dt><dd>{formatNumber(reviewedQuestions)}</dd></div>
          <div><dt>Book-backed</dt><dd>{formatNumber(bookBackedQuestions)}</dd></div>
        </dl>
      </header>

      <section className={styles.topicSection} aria-labelledby="question-topics-title">
        <header><p className={styles.eyebrow}>Practice by topic</p><h2 id="question-topics-title">Choose a focused question set.</h2></header>
        <div className={styles.grid}>
          {topics.map((topic) => (
            <article className={styles.card} key={topic.slug}>
              <div>
                <p className={styles.eyebrow}>{topic.coverageLabel || "Reviewed practice"}</p>
                <h3>{topic.title}</h3>
                <p>{topic.summary}</p>
              </div>
              <div className={styles.cardStats}>
                <span><strong>{formatNumber(topic.reviewedQuestions)}</strong> reviewed</span>
                <span><strong>{formatNumber(topic.bookBackedQuestions)}</strong> source-backed</span>
                <span><strong>{topic.readinessPercent}%</strong> ready</span>
              </div>
              <Link href={`/exams/ssc-cgl/practice/${topic.slug}`}>Practice {topic.title} <ArrowRight size={14} aria-hidden="true" /></Link>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
