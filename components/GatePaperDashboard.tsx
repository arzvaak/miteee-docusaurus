import Link from "next/link";
import { ArrowRight, BookOpen, ChevronRight, ListChecks, Target } from "lucide-react";
import type { GatePaper, GateTopic } from "@/components/GateUi";
import { GateBuilder } from "@/components/GateBuilder";
import styles from "@/components/Gate.module.css";

export function GatePaperDashboard({ paper, topics, years, questionTypes, questionCount }: { paper: GatePaper; topics: GateTopic[]; years: number[]; questionTypes: Array<"mcq" | "msq" | "nat">; questionCount: number }) {
  const sections = [...new Set(topics.map((topic) => topic.section))];
  return <section className={styles.page}>
    <div className={styles.breadcrumb}><Link href="/exams/gate">GATE series</Link><ChevronRight size={14} aria-hidden="true" /><span>{paper.title}</span></div>
    <header className={styles.subjectHero}><div><p className={styles.eyebrow}>GATE · {paper.id.toUpperCase()}</p><h1>{paper.title}</h1><p>{paper.description}</p></div><div className={styles.heroStats}><span><strong>{questionCount.toLocaleString("en-IN")}</strong><small>questions</small></span><span><strong>{topics.length}</strong><small>topics</small></span><span><strong>{sections.length}</strong><small>{sections.length === 1 ? "section" : "sections"}</small></span></div></header>
    <div className={styles.actionRow}><Link className={styles.primaryButton} href={`/exams/gate/${paper.id}/practice/all`}><Target size={16} aria-hidden="true" /> Practice all <ArrowRight size={15} aria-hidden="true" /></Link><Link className={styles.secondaryButton} href={`/exams/gate/${paper.id}/practice`}><ListChecks size={16} aria-hidden="true" /> Open test builder</Link></div>
    <GateBuilder paper={paper.id} topics={topics} years={years} questionTypes={questionTypes} questionCount={questionCount} />
    <section className={styles.topicSection}><div className={styles.sectionHeading}><div><p className={styles.eyebrow}>Syllabus map</p><h2>Pick a topic and keep going.</h2></div><span className={styles.muted}>{topics.length} focused practice lanes</span></div>{sections.map((section) => <div className={styles.sectionGroup} key={section}><div className={styles.sectionGroupHeading}><span>{topics.find((topic) => topic.section === section)?.sectionTitle ?? section}</span><small>{topics.filter((topic) => topic.section === section).length} topics</small></div><div className={styles.topicGrid}>{topics.filter((topic) => topic.section === section).map((topic) => <Link className={styles.topicCard} href={`/exams/gate/${paper.id}/practice/${topic.slug}`} key={topic.slug}><BookOpen size={17} aria-hidden="true" /><strong>{topic.title}</strong><p>{topic.summary}</p><span>{topic.questionCount.toLocaleString("en-IN")} questions{topic.years.length ? ` · ${topic.years[0]}–${topic.years[topic.years.length - 1]}` : ""}</span><ArrowRight size={15} aria-hidden="true" /></Link>)}</div></div>)}</section>
    {!topics.length ? <div className={styles.empty}><BookOpen size={23} aria-hidden="true" /><h2>No topic map yet</h2><p>The paper’s reviewed topics will appear here when the corpus is ready.</p></div> : null}
  </section>;
}
