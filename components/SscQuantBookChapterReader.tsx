"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, BookOpen, CheckCircle2, ChevronRight, Eye, FileText, Lightbulb, RotateCcw } from "lucide-react";
import { useState } from "react";
import { MathText } from "@/components/MathText";
import { SscQuantBookStimulus } from "@/components/SscQuantBookStimulus";
import type { SscQuantBookChapter, SscQuantWorkedExample } from "@/lib/ssc-quant-book-types";
import styles from "@/components/SscQuantBook.module.css";

const chapterHref = (slug: string) => `/exams/ssc-cgl/subjects/quantitative-aptitude/chapters/${slug}`;
const practiceHref = (slug: string) => `${chapterHref(slug)}/practice`;

function ExampleCard({ example, index }: { example: SscQuantWorkedExample; index: number }) {
  const [selected, setSelected] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const answered = Boolean(selected) || revealed;
  const isCorrect = Boolean(selected && example.correctOption && selected.toLowerCase() === example.correctOption.toLowerCase());
  return (
    <article className={styles.exampleCard}>
      <div className={styles.exampleHeading}><span>Example {String(index + 1).padStart(2, "0")}</span><Lightbulb size={16} aria-hidden="true" /><h3>{example.title}</h3></div>
      <SscQuantBookStimulus stimulus={example.stimulus} />
      <div className={`${styles.prompt} ${styles.sourceText}`}><MathText text={example.prompt} /></div>
      {example.options?.length ? (
        <div className={styles.optionGrid} aria-label={`Options for ${example.title}`}>
          {example.options.map((option) => (
            <button className={`${styles.option} ${selected === option.id ? styles.optionSelected : ""} ${answered && option.id === example.correctOption ? styles.optionCorrect : ""} ${answered && selected === option.id && !isCorrect ? styles.optionWrong : ""}`} disabled={answered} key={option.id} onClick={() => setSelected(option.id)} type="button">
              <strong>{option.id.toUpperCase()}</strong><MathText text={option.text} />
            </button>
          ))}
        </div>
      ) : null}
      {!answered && !example.options?.length ? <button className={styles.revealButton} onClick={() => setRevealed(true)} type="button"><Eye size={15} aria-hidden="true" /> Reveal worked solution</button> : null}
      {answered ? (
        <section className={styles.solution} aria-live="polite">
          <div className={styles.solutionTitle}>{isCorrect ? <CheckCircle2 size={17} aria-hidden="true" /> : <BookOpen size={17} aria-hidden="true" />}<strong>{isCorrect ? "Correct choice" : "Worked solution"}</strong></div>
          {example.answer || example.correctOption ? <p><strong>Answer:</strong> {example.answer || example.correctOption}</p> : null}
          {example.steps.length ? <ol>{example.steps.map((step) => <li key={step}><MathText text={step} /></li>)}</ol> : null}
          {example.solution ? <div className={styles.sourceText}><MathText text={example.solution} /></div> : <p className={styles.muted}>The source presents this as a direct illustration and does not print a separate solution.</p>}
        </section>
      ) : null}
    </article>
  );
}

export function SscQuantBookChapterReader({ chapter, previousSlug, nextSlug }: { chapter: SscQuantBookChapter; previousSlug?: string; nextSlug?: string }) {
  const [resetKey, setResetKey] = useState(0);
  const sections = chapter.sections.filter((section) => section.content.trim() || section.stimulus);
  return (
    <main className={styles.page} key={resetKey}>
      <nav className={styles.breadcrumbs} aria-label="Breadcrumb"><Link href="/exams">Exams</Link><ChevronRight size={13} aria-hidden="true" /><Link href="/exams/ssc-cgl">SSC CGL</Link><ChevronRight size={13} aria-hidden="true" /><Link href="/exams/ssc-cgl/subjects/quantitative-aptitude">Quantitative Aptitude</Link><ChevronRight size={13} aria-hidden="true" /><span aria-current="page">{chapter.title}</span></nav>
      <header className={styles.hero}>
        <div><p className={styles.eyebrow}>SSC CGL Quant · Chapter {String(chapter.chapterNumber).padStart(2, "0")}</p><h1>{chapter.title}</h1><p>Read the concept notes, test the worked examples, then practise this chapter with saved progress.</p><div className={styles.meta}><span><FileText size={14} aria-hidden="true" /> PDF pages {chapter.pdfPageStart || "—"}–{chapter.pdfPageEnd || "—"}</span><span>{sections.length} study blocks</span><span>{chapter.examples.length} worked examples</span><span>{chapter.exercises.length} exercises</span></div></div>
        <Link className={styles.primaryAction} href={practiceHref(chapter.slug)}><BookOpen size={17} aria-hidden="true" /> Start chapter practice <ArrowRight size={15} aria-hidden="true" /></Link>
      </header>
      <div className={styles.layout}>
        <aside className={styles.outline} aria-label="Chapter outline"><strong>On this chapter</strong><ol>{sections.map((section) => <li key={section.id}><a href={`#${section.id}`}>{section.title}</a></li>)}{chapter.examples.length ? <li><a href="#worked-examples">Worked examples</a></li> : null}</ol></aside>
        <article className={styles.reader}>
          {sections.map((section) => <section className={styles.section} id={section.id} key={section.id}><h2>{section.title}</h2>{section.content ? <div className={styles.sourceText}><MathText text={section.content} /></div> : null}<SscQuantBookStimulus stimulus={section.stimulus} /></section>)}
          {chapter.examples.length ? <section className={styles.examples} id="worked-examples"><div className={styles.sectionHeading}><p className={styles.eyebrow}>Worked examples</p><h2>See the decision path before you drill.</h2></div>{chapter.examples.map((example, index) => <ExampleCard example={example} index={index} key={example.id} />)}</section> : null}
          <footer className={styles.chapterNav}><div>{previousSlug ? <Link href={chapterHref(previousSlug)}><ArrowLeft size={15} aria-hidden="true" /> Previous chapter</Link> : null}</div><button className={styles.secondaryAction} onClick={() => setResetKey((current) => current + 1)} type="button"><RotateCcw size={15} aria-hidden="true" /> Reset reveals</button><div>{nextSlug ? <Link href={chapterHref(nextSlug)}>Next chapter <ArrowRight size={15} aria-hidden="true" /></Link> : null}</div></footer>
        </article>
      </div>
    </main>
  );
}
