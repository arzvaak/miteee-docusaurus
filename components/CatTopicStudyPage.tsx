import Link from "next/link";
import { ArrowLeft, ArrowRight, BookOpen, ChevronRight } from "lucide-react";
import { MarkdownNote } from "@/components/MarkdownNote";
import type { CatQuantTopic } from "@/lib/exam-types";

type Neighbor = Pick<CatQuantTopic, "slug" | "title">;

export function CatTopicStudyPage({ topic, previousTopic, nextTopic }: { topic: CatQuantTopic; previousTopic: Neighbor | null; nextTopic: Neighbor | null }) {
  return (
    <section className="page ssc-page">
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <Link href="/exams">Exams</Link><ChevronRight size={13} aria-hidden="true" />
        <Link href="/exams/cat">CAT</Link><ChevronRight size={13} aria-hidden="true" />
        <Link href="/exams/cat/quant">Quant</Link><ChevronRight size={13} aria-hidden="true" />
        <span aria-current="page">{topic.title}</span>
      </nav>
      <header className="panel ssc-hero">
        <div>
          <p className="panel-kicker">Chapter {String(topic.chapterNumber).padStart(2, "0")} · CAT Quant</p>
          <h1>{topic.title}</h1>
          <p>{topic.summary}</p>
        </div>
        <Link className="button primary" href={`/exams/cat/quant/practice/${topic.slug}`}><BookOpen size={16} aria-hidden="true" /> Practice {topic.questionCount} questions</Link>
      </header>
      <article className="panel article">
        {topic.noteBody ? <MarkdownNote content={topic.noteBody} sectionName={topic.title} /> : <p>The chapter note is being prepared from the reviewed OCR source.</p>}
      </article>
      <nav className="button-row" aria-label="CAT Quant chapters">
        {previousTopic ? <Link className="button ghost" href={`/exams/cat/quant/topics/${previousTopic.slug}`}><ArrowLeft size={15} aria-hidden="true" /> {previousTopic.title}</Link> : <span />}
        {nextTopic ? <Link className="button ghost" href={`/exams/cat/quant/topics/${nextTopic.slug}`}>{nextTopic.title} <ArrowRight size={15} aria-hidden="true" /></Link> : <span />}
      </nav>
    </section>
  );
}
