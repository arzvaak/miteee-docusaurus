import Link from "next/link";
import { ArrowLeft, ArrowRight, FileText, FlaskConical, ListTree } from "lucide-react";
import type { Course, NoteIndexItem } from "@/lib/content";

export function ResearchCollection({ course, notes }: { course: Course; notes: Array<Omit<NoteIndexItem, "content">> }) {
  const headingCount = notes.reduce((total, note) => total + note.headings.length, 0);

  return (
    <div className="page research-collection-page">
      <nav className="research-note-breadcrumbs" aria-label="Breadcrumb">
        <Link href="/courses"><ArrowLeft size={14} aria-hidden="true" /> Library</Link>
        <span>/</span>
        <span>Research notes</span>
      </nav>

      <header className="research-collection-header">
        <div>
          <p className="eyebrow"><FlaskConical size={14} aria-hidden="true" /> Note collection</p>
          <h1>Research notes</h1>
          <p>Exploratory findings, methods, and progress reports live here as individual notes. This collection grows without pretending each note is a separate subject.</p>
        </div>
        <dl>
          <div><dt>Notes</dt><dd>{course.noteCount}</dd></div>
          <div><dt>Sections</dt><dd>{headingCount}</dd></div>
        </dl>
      </header>

      <section className="research-collection-list" aria-labelledby="research-notes-heading">
        <div className="research-collection-title">
          <div>
            <span>Notebook</span>
            <h2 id="research-notes-heading">All research notes</h2>
          </div>
          <p>{notes.length === 1 ? "One note so far. New work will appear beside it here." : `${notes.length} notes, kept together in one growing collection.`}</p>
        </div>
        <div className="research-note-cards">
          {notes.map((note, index) => (
            <Link className="research-note-card" href={`/notes/${note.slug}`} key={note.slug} prefetch={false}>
              <span className="research-note-card-number">{String(index + 1).padStart(2, "0")}</span>
              <span className="research-note-card-copy">
                <small>{note.status || "Research note"}</small>
                <strong>{note.sidebarLabel || note.title}</strong>
                <span>{note.description || note.excerpt}</span>
              </span>
              <span className="research-note-card-meta">
                <span><FileText size={14} aria-hidden="true" /> Note</span>
                <span><ListTree size={14} aria-hidden="true" /> {note.headings.length} sections</span>
              </span>
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
