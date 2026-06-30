"use client";

import Link from "next/link";
import { AlertTriangle, ArrowRight, BookMarked, BrainCircuit, Command, FileText, Gauge, ListChecks, Maximize2, Search, Sigma, Target, TimerReset } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { ResumeReadingPanel } from "@/components/ResumeReadingPanel";
import { StudyToday } from "@/components/StudyToday";
import { HomeMemoryBriefing } from "@/components/HomeMemoryBriefing";
import type { Course, NotePreview } from "@/lib/content";
import { buildStudyReadinessMap, type StudyReadinessLane } from "@/lib/study-readiness";
import type { StudyTodayPlan } from "@/lib/study-system";

type Totals = {
  courses: number;
  notes: number;
  runnableNotes: number;
  quizzes: number;
  questions: number;
  practicePrompts: number;
  mermaidNotes: number;
  mathNotes: number;
};

type HomeSearchResult = {
  preview: Pick<NotePreview, "slug" | "label" | "courseCode" | "week" | "excerpt" | "stats">;
};

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-IN").format(value);
}

function courseAccent(course: Course) {
  const key = `${course.code} ${course.name}`.toLowerCase();
  if (key.includes("math") || key.includes("em2")) return "blue";
  if (key.includes("mi") || key.includes("instrument")) return "emerald";
  if (key.includes("upsc") || key.includes("political")) return "amber";
  if (key.includes("management")) return "amber";
  return "emerald";
}

function courseBadge(course: Course) {
  if (course.code === "UPSC-CSE-POLITICAL-SCIENCE") return "UPSC Polity";
  return course.code.replace("SEM", "S");
}

function courseContext(course: Course) {
  return course.level === course.category ? course.level : `${course.level} · ${course.category}`;
}

function readinessStatusLabel(status: StudyReadinessLane["status"]) {
  if (status === "answer-practice-debt") return "Answer practice debt";
  if (status === "practice-anchor") return "Practice anchor";
  if (status === "question-bank-ready") return "Question bank ready";
  if (status === "interactive-review") return "Interactive review";
  return "Needs recall prompts";
}

function readinessTrackLabel(track: StudyReadinessLane["track"]) {
  if (track === "civil-services") return "UPSC CSE";
  if (track === "technical-core") return "Technical core";
  if (track === "technical-support") return "Support subject";
  return "Study vault";
}

function coursePracticeCount(course: Course) {
  return course.questionCount + (course.practicePromptCount ?? 0);
}

function coursePracticeLabel(course: Course) {
  return (course.practicePromptCount ?? 0) > 0 ? "practice prompts" : "question sections";
}

export function StudyDashboard({
  totals,
  courses,
  notes,
  studyPlan
}: {
  totals: Totals;
  courses: Course[];
  notes: NotePreview[];
  studyPlan: StudyTodayPlan;
}) {
  const [query, setQuery] = useState("");
  const [remoteNoteSearch, setRemoteNoteSearch] = useState<{ query: string; results: NotePreview[]; state: "idle" | "error" }>({
    query: "",
    results: [],
    state: "idle"
  });

  const filteredCourses = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return courses.slice(0, 4);
    return courses.filter((course) => `${course.code} ${course.name} ${course.level} ${course.category}`.toLowerCase().includes(needle)).slice(0, 6);
  }, [courses, query]);

  const filteredNotes = useMemo(() => {
    const needle = query.trim();
    if (!needle) return notes.slice(0, 4);
    return remoteNoteSearch.query === needle ? remoteNoteSearch.results : [];
  }, [notes, query, remoteNoteSearch]);
  const readiness = useMemo(() => buildStudyReadinessMap(courses), [courses]);
  const questionHeavyCourses = useMemo(() => courses.filter((course) => course.questionCount > 0).slice(0, 3), [courses]);
  const activeNote = filteredNotes[0] ?? notes[0] ?? null;
  const primaryCourse = filteredCourses[0] ?? courses[0] ?? null;
  const remoteNoteSearchState = !query.trim()
    ? "idle"
    : remoteNoteSearch.query === query.trim()
      ? remoteNoteSearch.state
      : "loading";

  useEffect(() => {
    const needle = query.trim();
    if (!needle) return;

    const controller = new AbortController();
    fetch(`/api/search?${new URLSearchParams({ q: needle, limit: "5" }).toString()}`, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error("Search failed");
        return response.json() as Promise<{ results: HomeSearchResult[] }>;
      })
      .then((payload) => {
        const results = Array.isArray(payload.results) ? payload.results : [];
        setRemoteNoteSearch({
          query: needle,
          state: "idle",
          results: results.map(({ preview }) => ({
            ...preview,
            title: preview.label,
            aliases: [],
            headings: [],
            courseName: null,
            runnable: false
          }))
        });
      })
      .catch((error) => {
        if ((error as Error).name === "AbortError") return;
        setRemoteNoteSearch({ query: needle, state: "error", results: [] });
      });

    return () => controller.abort();
  }, [query]);

  return (
    <div className="page public-home-page">
      <section className="home-hero home-desk" aria-label="Study desk">
        <div className="home-hero-copy">
          <h1>Your study desk.</h1>
          <p className="home-lede">
            Search, resume, or start the day&apos;s next useful study loop.
          </p>
          <label className="command-search home-search">
            <Command size={17} aria-hidden="true" />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search notes, formulas, PYQs" aria-label="Search courses and notes" />
            <Search size={16} aria-hidden="true" />
          </label>

          <div className="home-desk-actions">
            <div className="home-desk-rail" aria-label="Primary study actions">
              <Link className="home-action-row primary" href="#study-today">
                <span className="home-small-icon"><TimerReset size={17} aria-hidden="true" /></span>
                <span>
                  <strong>Study Today</strong>
                  <small>{studyPlan.summary}</small>
                </span>
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
              <HomePrimaryCourseEntry course={primaryCourse} />
            </div>

            <div className="home-focus-strip" aria-label="Secondary study shortcuts">
              <Link href={readiness.priority.href}>
                <Target size={14} aria-hidden="true" />
                <span>{readiness.priority.name}</span>
              </Link>
              <Link href="#resume-reading">
                <BookMarked size={14} aria-hidden="true" />
                <span>Resume reading</span>
              </Link>
              <Link href="#courses">
                <ListChecks size={14} aria-hidden="true" />
                <span>{formatNumber(totals.courses)} subjects</span>
              </Link>
            </div>
          </div>
        </div>

        <HomeReaderPreview note={activeNote} totals={totals} />
      </section>

      <StudyToday plan={studyPlan} />

      <details className="readiness-map readiness-disclosure home-secondary-disclosure">
        <summary className="section-header">
          <div>
            <span className="micro-label">Coverage map</span>
            <h2 className="section-title">Readiness and weak spots</h2>
          </div>
          <Gauge size={20} aria-hidden="true" />
        </summary>

        <div className="readiness-layout">
          <Link className={`readiness-priority status-${readiness.priority.status}`} href={readiness.priority.href}>
            <span className="home-icon-badge"><Target size={19} aria-hidden="true" /></span>
            <span>
              <small>Next pressure point</small>
              <strong>{readiness.priority.name}</strong>
              <em>{readiness.priority.nextAction}</em>
            </span>
            <ArrowRight size={15} aria-hidden="true" />
          </Link>

          <div className="readiness-summary" aria-label="Readiness summary">
            <HomeStat label="UPSC notes" value={formatNumber(readiness.summary.civilServicesNotes)} />
            <HomeStat label="UPSC prompts" value={formatNumber(readiness.summary.civilServicesPracticePrompts)} />
            <HomeStat label="Tech questions" value={formatNumber(readiness.summary.technicalQuestions)} />
            <HomeStat label="Active courses" value={formatNumber(readiness.summary.activePracticeCourses)} />
          </div>
        </div>

        <div className="readiness-lane-grid">
          {readiness.lanes.slice(0, 3).map((lane) => (
            <Link className={`readiness-lane status-${lane.status} track-${lane.track}`} href={lane.href} key={lane.code}>
              <div className="readiness-lane-top">
                <span>{readinessTrackLabel(lane.track)}</span>
                {lane.status === "answer-practice-debt" ? <AlertTriangle size={14} aria-hidden="true" /> : <Gauge size={14} aria-hidden="true" />}
              </div>
              <strong>{lane.name}</strong>
              <p>{lane.summary}</p>
              <div className="readiness-meter" aria-label={`${lane.score}% active practice coverage`}>
                <i style={{ width: `${lane.score}%` }} />
              </div>
              <footer>
                <span>{readinessStatusLabel(lane.status)}</span>
                <span>{lane.score}%</span>
              </footer>
            </Link>
          ))}
        </div>
      </details>

      <details className="home-secondary-disclosure memory-briefing-disclosure">
        <summary className="section-header">
          <div>
            <span className="micro-label">Memory briefing</span>
            <h2 className="section-title">Due recalls, mistakes, and momentum</h2>
          </div>
          <BrainCircuit size={20} aria-hidden="true" />
        </summary>
        <HomeMemoryBriefing />
      </details>

      <section className="home-course-section" id="courses">
        <div className="section-header home-section-header">
          <div>
            <span className="micro-label">Subjects</span>
            <h2 className="section-title">Open a folder</h2>
          </div>
          <Link className="home-section-count" href="/courses">{filteredCourses.length} shown · View all</Link>
        </div>
        <div className="home-course-list">
          {filteredCourses.map((course) => <HomeCourseRow key={course.code} course={course} />)}
        </div>
        {filteredCourses.length === 0 && <div className="empty-state">No matching courses. Try a course code, subject, or semester.</div>}
      </section>

      <section className="home-compact-grid">
        <ResumeReadingPanel />

        <details className="panel home-path-panel home-resource-disclosure" id="question-banks">
          <summary className="section-header">
            <div>
              <span className="micro-label">Exam prep</span>
              <h2 className="section-title">Question-heavy paths.</h2>
            </div>
            <ListChecks size={20} aria-hidden="true" />
          </summary>
          <div className="home-tool-list home-resource-body">
            {questionHeavyCourses.map((course) => (
              <ToolRow key={course.code} title={course.name} detail={`${formatNumber(course.questionCount)} question sections · ${formatNumber(course.noteCount)} notes`} href={`/courses/${course.code}`} />
            ))}
          </div>
        </details>

        <details className="panel home-note-panel home-resource-disclosure" id="recent-notes">
          <summary className="section-header">
            <div>
              <span className="micro-label">Recently indexed notes</span>
              <h2 className="section-title">Quick reading entry points.</h2>
            </div>
            <FileText size={20} aria-hidden="true" />
          </summary>
          <div className="home-note-list home-resource-body">
            {filteredNotes.map((note) => (
              <Link prefetch={false} className="home-note-row" key={note.slug} href={`/notes/${note.slug}`}>
              <span className="note-row-main">
                <strong>{note.label}</strong>
                  <small>{[note.courseCode || "MITEEE", note.week ? `Week ${note.week}` : "Reference", `${note.stats.questionBlocks} questions`].join(" · ")}</small>
                </span>
                <span className="note-row-stats"><ArrowRight size={15} aria-hidden="true" /></span>
              </Link>
            ))}
          </div>
          {query.trim() && remoteNoteSearchState === "loading" && <div className="empty-state">Searching notes...</div>}
          {query.trim() && remoteNoteSearchState === "error" && <div className="empty-state">Search is unavailable. Try the note list or Quick Find.</div>}
          {query.trim() && remoteNoteSearchState === "idle" && filteredNotes.length === 0 && <div className="empty-state">No matching notes. Try UPSC, federalism, practice, or EM2.</div>}
        </details>
      </section>
    </div>
  );
}

function HomeStat({ label, value }: { label: string; value: string }) {
  return <div className="home-stat"><strong>{value}</strong><span>{label}</span></div>;
}

function HomeCourseRow({ course }: { course: Course }) {
  return (
    <Link className={`home-course-row accent-${courseAccent(course)}`} href={`/courses/${course.code}`}>
      <span className="home-course-code">{courseBadge(course)}</span>
      <span className="home-course-main">
        <strong>{course.name}</strong>
        <small>{courseContext(course)}</small>
      </span>
      <span className="home-course-meta">{formatNumber(course.noteCount)} notes · {formatNumber(coursePracticeCount(course))} {coursePracticeLabel(course)}</span>
      <ArrowRight size={15} aria-hidden="true" />
    </Link>
  );
}

function HomePrimaryCourseEntry({ course }: { course: Course | null }) {
  if (!course) {
    return (
      <Link className="home-primary-entry" href="/courses">
        <span className="home-small-icon"><ListChecks size={17} aria-hidden="true" /></span>
        <span>
          <strong>Browse courses</strong>
          <small>Open the full MITEEE and UPSC folder list.</small>
        </span>
        <ArrowRight size={16} aria-hidden="true" />
      </Link>
    );
  }

  return (
    <Link className={`home-primary-entry accent-${courseAccent(course)}`} href={`/courses/${course.code}`}>
      <span className="home-course-code">{courseBadge(course)}</span>
      <span>
        <strong>{course.name}</strong>
        <small>{formatNumber(course.noteCount)} notes / {formatNumber(coursePracticeCount(course))} {coursePracticeLabel(course)}</small>
      </span>
      <ArrowRight size={16} aria-hidden="true" />
    </Link>
  );
}

function HomeReaderPreview({ note, totals }: { note: NotePreview | null; totals: Totals }) {
  if (!note) {
    return (
      <div className="home-reader-preview empty" aria-label="Reader preview">
        <div className="home-reader-toolbar">
          <span className="home-reader-dot" />
          <span className="home-reader-dot" />
          <span className="home-reader-dot" />
        </div>
        <div className="home-reader-page">
          <span className="micro-label">Reader</span>
          <h2>No notes indexed yet</h2>
          <p>Build the content index to fill this desk with your current study material.</p>
        </div>
      </div>
    );
  }

  const headings = note.headings.slice(0, 3);
  const meta = [note.courseName ?? note.courseCode ?? "MITEEE", note.week ? `Week ${note.week}` : "Reference"].join(" / ");
  const signalItems = [
    note.stats.questionBlocks > 0 ? `${formatNumber(note.stats.questionBlocks)} questions` : null,
    note.stats.mathBlocks > 0 ? `${formatNumber(note.stats.mathBlocks)} math blocks` : null,
    note.runnable ? "Code-ready" : null
  ].filter(Boolean);

  return (
    <Link prefetch={false} className="home-reader-preview" href={`/notes/${note.slug}`} aria-label={`Continue reading ${note.label}`}>
      <div className="home-reader-toolbar" aria-hidden="true">
        <span className="home-reader-dot" />
        <span className="home-reader-dot" />
        <span className="home-reader-dot" />
        <span className="home-reader-tool"><Maximize2 size={15} /></span>
      </div>
      <div className="home-reader-breadcrumb">{meta}</div>
      <div className="home-reader-page">
        <div className="home-reader-title-row">
          <span className="micro-label">Active reader</span>
          <span>{formatNumber(totals.notes)} notes</span>
        </div>
        <h2>{note.label}</h2>
        <p>{note.excerpt || "Open the note and continue from the current reading surface."}</p>
        {headings.length > 0 && (
          <ol className="home-reader-outline" aria-label="Preview outline">
            {headings.map((heading) => <li key={heading}>{heading}</li>)}
          </ol>
        )}
      </div>
      <div className="home-reader-footer">
        <span>{signalItems.length > 0 ? signalItems.join(" / ") : "Continue reading"}</span>
        <strong>Open note <ArrowRight size={14} aria-hidden="true" /></strong>
      </div>
    </Link>
  );
}

function ToolRow({ title, detail, href }: { title: string; detail: string; href: string }) {
  return (
    <Link className="home-tool-row" href={href}>
      <span className="home-small-icon"><Sigma size={17} aria-hidden="true" /></span>
      <span>
        <strong>{title}</strong>
        <small>{detail}</small>
      </span>
      <ArrowRight size={15} aria-hidden="true" />
    </Link>
  );
}
