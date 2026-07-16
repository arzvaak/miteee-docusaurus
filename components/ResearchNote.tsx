import Link from "next/link";
import { ArrowLeft, ArrowRight, CalendarDays, FlaskConical, NotebookTabs } from "lucide-react";
import { JsonLd } from "@/components/JsonLd";
import { MarkdownNote } from "@/components/MarkdownNote";
import type { Note } from "@/lib/content";
import { buildHeadingAnchors } from "@/lib/heading-anchors";
import { buildBreadcrumbJsonLd, buildNoteJsonLd } from "@/lib/seo";

function formatPublishedDate(value: string | null | undefined) {
  if (!value) return "Undated note";
  const date = new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(date.valueOf())) return value;
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(date);
}

export function ResearchNote({ note }: { note: Note }) {
  const outline = buildHeadingAnchors(note.headings, 18).filter((heading) => heading.level === 2);
  const notePath = `/notes/${note.slug}`;

  return (
    <div className="page research-note-page">
      <JsonLd
        data={[
          buildNoteJsonLd(note),
          buildBreadcrumbJsonLd([
            { name: "Home", pathname: "/" },
            { name: "Library", pathname: "/courses" },
            { name: "Research notes", pathname: "/courses/RESEARCH" },
            { name: note.sidebarLabel || note.title, pathname: notePath }
          ])
        ]}
      />

      <nav className="research-note-breadcrumbs" aria-label="Breadcrumb">
        <Link href="/courses"><ArrowLeft size={14} aria-hidden="true" /> Library</Link>
        <span>/</span>
        <Link href="/courses/RESEARCH">Research notes</Link>
        <span>/</span>
        <span>{note.sidebarLabel || note.title}</span>
      </nav>

      <header className="research-note-header">
        <div className="research-note-heading">
          <p className="eyebrow"><FlaskConical size={14} aria-hidden="true" /> Research note</p>
          <h1>{note.title}</h1>
          <p className="research-note-deck">{note.description || note.excerpt}</p>
        </div>
        <dl className="research-note-facts">
          <div>
            <dt>Status</dt>
            <dd>{note.status || "Working note"}</dd>
          </div>
          <div>
            <dt>Published</dt>
            <dd><CalendarDays size={14} aria-hidden="true" /> {formatPublishedDate(note.publishedAt)}</dd>
          </div>
          <div>
            <dt>Collection</dt>
            <dd><NotebookTabs size={14} aria-hidden="true" /> Research notes</dd>
          </div>
        </dl>
      </header>

      <aside className="research-note-status" aria-label="Research status">
        <strong>This is a working note, not a final result.</strong>
        <span>The models were developed on the current map set. A future untouched tournament is still needed for the final check.</span>
      </aside>

      {outline.length > 0 ? (
        <nav className="research-note-outline" aria-label="On this page">
          <strong>On this page</strong>
          <div>
            {outline.map((heading) => <a href={`#${heading.id}`} key={heading.id}>{heading.text}</a>)}
          </div>
        </nav>
      ) : null}

      <article className="article research-note-article">
        <MarkdownNote content={note.content} sectionName={note.sidebarLabel || note.title} />
      </article>

      <footer className="research-note-footer">
        <div>
          <span>Research notebook</span>
          <strong>More notes will live in this collection.</strong>
        </div>
        <Link href="/courses/RESEARCH">Browse research notes <ArrowRight size={15} aria-hidden="true" /></Link>
      </footer>
    </div>
  );
}
