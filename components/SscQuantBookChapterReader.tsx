import Link from "next/link";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { ArrowLeft, ArrowRight, BookOpen, ExternalLink } from "lucide-react";
import type { SscQuantBookChapter } from "@/lib/ssc-quant-book-types";
import { SscBookReadingShell } from "@/components/SscBookReadingShell";
import styles from "./SscBookReader.module.css";

const chapterHref = (slug: string) => `/exams/ssc-cgl/subjects/quantitative-aptitude/chapters/${slug}`;

function BookMarkdown({ content }: { content: string }) {
  return <div className={styles.prose}><ReactMarkdown remarkPlugins={[[remarkGfm, { singleTilde: false }], remarkMath]} rehypePlugins={[[rehypeKatex, { strict: false, throwOnError: false, trust: false }]]} components={{
    h1: ({ children }) => <h3>{children}</h3>,
    h2: ({ children }) => <h3>{children}</h3>,
    table: ({ children }) => <div className={styles.tableScroll} tabIndex={0} role="region" aria-label="Book table"><table>{children}</table></div>,
    img: ({ src, alt }) => typeof src === "string" ? <a className={styles.figure} href={src} target="_blank" rel="noreferrer" aria-label={`${alt}. Open full-size diagram`}><Image src={src} alt={alt || "Book diagram"} width={760} height={420} unoptimized /><span>View diagram <ExternalLink size={12} aria-hidden="true" /></span></a> : null,
  }}>{content.replace(/\$\$([\s\S]*?)\$\$/g, (_, formula: string) => `\n\n$$\n${formula.trim()}\n$$\n\n`)}</ReactMarkdown></div>;
}

export function SscQuantBookChapterReader({ chapter, previousSlug, nextSlug }: { chapter: SscQuantBookChapter; previousSlug?: string; nextSlug?: string }) {
  const sections = chapter.readingSections || chapter.sections.map(section => ({ ...section, kind: "concept" as const }));
  const lessons = sections.filter(section => section.kind !== "exercise" && section.kind !== "answers");
  const references = sections.filter(section => section.kind === "exercise" || section.kind === "answers");
  const examples = lessons.filter(section => section.kind === "example").length;
  const minutes = Math.max(1, Math.ceil(lessons.reduce((n, s) => n + s.content.split(/\s+/).length, 0) / 180));
  return <main className={styles.page}>
    <nav className={styles.breadcrumb} aria-label="Breadcrumb"><Link href="/exams/ssc-cgl/subjects/quantitative-aptitude"><ArrowLeft size={15} /> Quantitative Aptitude</Link><span>Chapter {String(chapter.chapterNumber).padStart(2, "0")}</span></nav>
    <header className={styles.header}><p className={styles.eyebrow}>THE QUANTITATIVE APTITUDE NOTEBOOK</p><h1>{chapter.title}</h1><p className={styles.subtitle}>Concepts, worked examples and explanations — in the book’s original order.</p><div className={styles.meta}><span>Chapter {chapter.chapterNumber} / 20</span><span>{minutes} min read</span><span>{examples} worked examples</span><span>Book pages {chapter.pdfPageStart}–{chapter.pdfPageEnd}</span></div></header>
    <SscBookReadingShell slug={chapter.slug} outline={lessons.map(({ id, title, kind }) => ({ id, title, kind }))}>
      <article className={styles.article} id="chapter-reading" aria-label={`${chapter.title} chapter notes`}>
        {lessons.map((section, index) => <section className={section.kind === "example" ? styles.example : styles.concept} id={section.id} key={section.id} data-reading-section>
          <div className={styles.sectionMeta}><span>{section.kind === "example" ? "WORKED EXAMPLE" : index === 0 ? "START HERE" : "CONCEPT"}</span><span>p. {section.pdfPageStart}{section.pdfPageEnd !== section.pdfPageStart ? `–${section.pdfPageEnd}` : ""}</span></div>
          <h2>{section.title}</h2><BookMarkdown content={section.content} />
        </section>)}
        <section className={styles.practice}><BookOpen size={25} aria-hidden="true" /><div><p className={styles.eyebrow}>PUT IT INTO PRACTICE</p><h2>Ready to try it yourself?</h2><p>Work through the chapter’s exercises at your own pace.</p></div><Link href={`${chapterHref(chapter.slug)}/practice`}>Practise this chapter <ArrowRight size={16} /></Link></section>
        {references.map(section => <details className={styles.reference} id={section.id} key={section.id}><summary>{section.title}<span>Book reference · pp. {section.pdfPageStart}–{section.pdfPageEnd}</span></summary><BookMarkdown content={section.content} /></details>)}
        <footer className={styles.footer}><p>Transcribed from the supplied book export. Original notation and explanations are retained; transcription may contain source or OCR errors.</p><nav aria-label="Chapter navigation">{previousSlug ? <Link href={chapterHref(previousSlug)}><ArrowLeft size={16} /> Previous chapter</Link> : <span />}{nextSlug ? <Link href={chapterHref(nextSlug)}>Next chapter <ArrowRight size={16} /></Link> : <Link href="/exams/ssc-cgl/subjects/quantitative-aptitude">All chapters</Link>}</nav></footer>
      </article>
    </SscBookReadingShell>
  </main>;
}
