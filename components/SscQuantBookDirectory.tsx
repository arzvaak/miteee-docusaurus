import Link from "next/link";
import { ArrowRight, BookOpen, FileText } from "lucide-react";
import type { SscQuantBookChapter } from "@/lib/ssc-quant-book-types";
import { sscQuantBookChapterHref, sscQuantBookPracticeHref } from "@/lib/ssc-quant-book";
import styles from "@/components/SscQuantBook.module.css";

export function SscQuantBookDirectory({ chapters }: { chapters: SscQuantBookChapter[] }) {
  const exampleCount = chapters.reduce((total, chapter) => total + (chapter.readingSections?.filter(section => section.kind === "example").length ?? chapter.examples.length), 0);
  const exerciseCount = chapters.reduce((total, chapter) => total + chapter.exercises.length, 0);
  return (
    <main className={styles.page}>
      <header className={styles.hero}><div><p className={styles.eyebrow}>SSC CGL · Quantitative Aptitude</p><h1>The Quantitative Aptitude Notebook</h1><p>Twenty chapters in book order. Read the concepts, follow each worked solution, then practise.</p></div><div className={styles.meta}><span><BookOpen size={14} aria-hidden="true" /> {chapters.length} chapters</span><span><FileText size={14} aria-hidden="true" /> {exampleCount} examples · {exerciseCount} exercises</span><span><FileText size={14} aria-hidden="true" /> Public study access</span></div></header>
      {chapters.length ? <div className={styles.directoryGrid}>{chapters.map((chapter) => { const studyBlocks = chapter.readingSections?.filter(section => section.kind === "concept").length ?? chapter.sections.length; const examples = chapter.readingSections?.filter(section => section.kind === "example").length ?? chapter.examples.length; return <article className={styles.directoryCard} key={chapter.slug}><div className={styles.directoryNumber}>{String(chapter.chapterNumber).padStart(2, "0")}</div><div><p className={styles.kicker}>PDF pages {chapter.pdfPageStart || "—"}–{chapter.pdfPageEnd || "—"}</p><h2>{chapter.title}</h2><p>{studyBlocks} concepts · {examples} worked examples · {chapter.exercises.length} exercises</p></div><div className={styles.directoryActions}><Link className={styles.secondaryAction} href={sscQuantBookChapterHref(chapter.slug)}>Read chapter <ArrowRight size={14} aria-hidden="true" /></Link><Link className={styles.primaryAction} href={sscQuantBookPracticeHref(chapter.slug)}>Practice</Link></div></article>; })}</div> : <section className={styles.empty}><h2>Quant notes are being prepared.</h2><p>The chapter index will appear here once the source-PDF data worker publishes it.</p></section>}
    </main>
  );
}
