import Link from "next/link";
import { ArrowRight, BarChart3, BrainCircuit, ChevronRight, Layers3, Zap } from "lucide-react";
import type { GateDashboard, GatePaper } from "@/components/GateUi";
import styles from "@/components/Gate.module.css";

function PaperIcon({ id }: { id: string }) {
  return id.toLowerCase() === "da" ? <BrainCircuit size={25} aria-hidden="true" /> : <Zap size={25} aria-hidden="true" />;
}

export function GateLanding({ dashboard }: { dashboard: GateDashboard }) {
  return (
    <section className={styles.page}>
      <header className={styles.hero}>
        <div><p className={styles.eyebrow}>MITEEE · GATE series</p><h1>Turn every GATE topic into a practice lane.</h1><p>Choose your paper, narrow the syllabus, and keep working through as many reviewed questions as you need.</p></div>
        <div className={styles.heroStats}><span><strong>{dashboard.questionCount.toLocaleString("en-IN")}</strong><small>questions</small></span><span><strong>{dashboard.topicCount}</strong><small>topics</small></span></div>
      </header>
      <div className={styles.breadcrumb}><Link href="/exams">Exams</Link><ChevronRight size={14} aria-hidden="true" /><span>GATE test series</span></div>
      <section className={styles.sectionHeading}><div><p className={styles.eyebrow}>Choose a paper</p><h2>Two papers. One focused workspace.</h2></div><span className={styles.muted}>Topic-first · year-aware · locally saved</span></section>
      <div className={styles.paperGrid}>
        {dashboard.papers.map((paper) => <PaperCard key={paper.id} paper={paper} />)}
      </div>
      {!dashboard.papers.length ? <div className={styles.empty}><Layers3 size={23} aria-hidden="true" /><h2>GATE papers are being prepared</h2><p>The practice workspace will appear as soon as the reviewed bank is available.</p></div> : null}
      <section className={styles.callout}><BarChart3 size={20} aria-hidden="true" /><div><strong>Practice memory is yours</strong><p>Answers, marks, and last position are kept in this browser. You can return to a topic without losing your place.</p></div></section>
    </section>
  );
}

function PaperCard({ paper }: { paper: GatePaper }) {
  return <Link className={styles.paperCard} href={`/exams/gate/${paper.id}`}><span className={styles.paperIcon}><PaperIcon id={paper.id} /></span><div><p className={styles.eyebrow}>{paper.id.toUpperCase()} paper</p><h2>{paper.title}</h2><p>{paper.description}</p><div className={styles.cardMeta}><span>{paper.questionCount.toLocaleString("en-IN")} questions</span><span>{paper.topicCount} topics</span>{paper.sectionCount ? <span>{paper.sectionCount} {paper.sectionCount === 1 ? "section" : "sections"}</span> : null}</div></div><ArrowRight size={19} aria-hidden="true" /></Link>;
}
