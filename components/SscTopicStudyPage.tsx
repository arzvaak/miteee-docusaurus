import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  ChevronDown,
  ChevronRight,
  Clock3,
  Database,
  ListTree,
  Timer
} from "lucide-react";
import { MarkdownNote } from "@/components/MarkdownNote";
import { NoteQuizClient } from "@/components/NoteQuizClient";
import { ReaderProgressPanel } from "@/components/ReaderProgressPanel";
import type { SscCglSectionId, SscCglTopic } from "@/lib/exam-types";
import { getSscCglSubjectDefinition, sscCglSubjectHref } from "@/lib/ssc-cgl-subjects";
import styles from "@/components/SscTopicStudyPage.module.css";

type TopicNeighbor = Pick<SscCglTopic, "slug" | "title">;

const subjectTones = {
  reasoning: "blue",
  "general-awareness": "amber",
  "quantitative-aptitude": "violet",
  "english-comprehension": "green"
} satisfies Record<SscCglSectionId, "blue" | "amber" | "violet" | "green">;

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-IN").format(value);
}

function estimatedReadMinutes(topic: SscCglTopic) {
  const words = [
    topic.study.summary,
    ...topic.study.sections.map((section) => section.body)
  ]
    .join(" ")
    .replace(/<[^>]+>|[#_*\x60[\]()|>-]/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;

  return Math.max(1, Math.ceil(words / 220));
}

function sectionAnchor(title: string, index: number) {
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return "section-" + (index + 1) + "-" + (slug || "study");
}

export function SscTopicStudyPage({
  nextTopic,
  previousTopic,
  topic
}: {
  nextTopic: TopicNeighbor | null;
  previousTopic: TopicNeighbor | null;
  topic: SscCglTopic;
}) {
  const tone = subjectTones[topic.section];
  const readMinutes = estimatedReadMinutes(topic);
  const sections = topic.study.sections.map((section, index) => ({
    ...section,
    id: sectionAnchor(section.title, index),
    number: String(index + 1).padStart(2, "0")
  }));
  const practiceHref = "/exams/ssc-cgl/practice/" + topic.slug;
  const timedDrillHref = "/exams/ssc-cgl/tests?topic=" + topic.slug;
  const subject = getSscCglSubjectDefinition(topic.section);
  const noteSlug = `${subject?.notePrefix ?? "ssc-cgl-topic-"}${topic.slug}`;

  return (
    <div className={styles.page + " " + styles[tone]} data-ssc-topic-study={topic.slug}>
      <NoteQuizClient />

      <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
        <Link href="/exams">Exams</Link>
        <ChevronRight size={13} aria-hidden="true" />
        <Link href="/exams/ssc-cgl">SSC CGL</Link>
        <ChevronRight size={13} aria-hidden="true" />
        <Link href={sscCglSubjectHref(topic.section)}>{topic.subject}</Link>
        <ChevronRight size={13} aria-hidden="true" />
        <span aria-current="page">{topic.title}</span>
      </nav>

      <header className={styles.hero} aria-labelledby="ssc-topic-title">
        <div className={styles.heroCopy}>
          <span className={styles.eyebrow}>{topic.subject}</span>
          <h1 id="ssc-topic-title">{topic.title}</h1>
          <p>{topic.study.summary}</p>
          <div className={styles.heroMeta} aria-label="Study guide details">
            <span><Clock3 size={15} aria-hidden="true" /> About {readMinutes} min read</span>
            <span><ListTree size={15} aria-hidden="true" /> {sections.length} sections</span>
          </div>
        </div>
        <Link className={styles.primaryAction} href={practiceHref}>
          <BookOpen size={17} aria-hidden="true" />
          Practice this topic
          <ArrowRight size={15} aria-hidden="true" />
        </Link>
      </header>

      <div className={styles.readerLayout}>
        <aside className={styles.outline} aria-labelledby="ssc-topic-outline-title">
          <div className={styles.outlineHeading}>
            <ListTree size={17} aria-hidden="true" />
            <span>
              <small>Study guide</small>
              <strong id="ssc-topic-outline-title">On this page</strong>
            </span>
          </div>
          <ol>
            {sections.map((section) => (
              <li key={section.id}>
                <a href={"#" + section.id}>
                  <span>{section.number}</span>
                  <strong>{section.title}</strong>
                </a>
              </li>
            ))}
          </ol>
          <div className={styles.progressPanel}>
            <ReaderProgressPanel
              note={{
                slug: noteSlug,
                title: topic.title,
                courseCode: "SSC-CGL",
                courseName: `SSC CGL · ${topic.subject}`
              }}
            />
          </div>
        </aside>

        <article className={styles.reader} aria-label={topic.title + " study guide"}>
          {sections.map((section) => (
            <section className={styles.studySection} id={section.id} key={section.id}>
              <header className={styles.sectionHeading}>
                <span>{section.number}</span>
                <h2>{section.title}</h2>
              </header>
              <div className={styles.sectionBody}>
                <MarkdownNote content={section.body} sectionName={section.title} />
              </div>
            </section>
          ))}

          <section className={styles.practiceBlock} aria-labelledby="ssc-topic-practice-title">
            <div className={styles.practiceCopy}>
              <span className={styles.eyebrow}>Put it into practice</span>
              <h2 id="ssc-topic-practice-title">Apply the method while it is fresh.</h2>
              <p>Start with focused practice, then move to a timed drill when your choices feel consistent.</p>
            </div>
            <div className={styles.practiceActions}>
              <Link className={styles.primaryAction} href={practiceHref}>
                <BookOpen size={17} aria-hidden="true" />
                Practice topic
                <ArrowRight size={15} aria-hidden="true" />
              </Link>
              <Link className={styles.secondaryAction} href={timedDrillHref}>
                <Timer size={17} aria-hidden="true" />
                Start timed drill
              </Link>
            </div>
            <details className={styles.questionBankDetails}>
              <summary>
                <Database size={16} aria-hidden="true" />
                Question-bank details
                <span>{formatNumber(topic.practice.questionIds.length)} available</span>
                <ChevronDown className={styles.disclosureIcon} size={15} aria-hidden="true" />
              </summary>
              <div className={styles.questionBankGrid}>
                <span>
                  <strong>{formatNumber(topic.practice.pyqQuestionIds.length)}</strong>
                  <small>PYQ-tagged</small>
                </span>
                <span>
                  <strong>{formatNumber(topic.practice.sourceBreakdown.bookUserProvided)}</strong>
                  <small>Provided books</small>
                </span>
                <span>
                  <strong>{formatNumber(topic.practice.sourceBreakdown.originalPractice)}</strong>
                  <small>Original practice</small>
                </span>
                <span>
                  <strong>{formatNumber(topic.practice.sourceBreakdown.otherReviewed)}</strong>
                  <small>Other reviewed</small>
                </span>
              </div>
              <p>These counts describe the reviewed practice pool available after this lesson.</p>
            </details>
          </section>

          {(previousTopic || nextTopic) ? (
            <nav className={styles.topicNavigation} aria-label={"More " + topic.subject + " topics"}>
              {previousTopic ? (
                <Link className={styles.previousTopic} href={"/exams/ssc-cgl/topics/" + previousTopic.slug}>
                  <ArrowLeft size={16} aria-hidden="true" />
                  <span><small>Previous topic</small><strong>{previousTopic.title}</strong></span>
                </Link>
              ) : <span aria-hidden="true" />}
              {nextTopic ? (
                <Link className={styles.nextTopic} href={"/exams/ssc-cgl/topics/" + nextTopic.slug}>
                  <span><small>Next topic</small><strong>{nextTopic.title}</strong></span>
                  <ArrowRight size={16} aria-hidden="true" />
                </Link>
              ) : <span aria-hidden="true" />}
            </nav>
          ) : null}
        </article>
      </div>
    </div>
  );
}
