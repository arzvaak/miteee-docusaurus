"use client";

import Link from "next/link";
import { Activity, ArrowRight, Clock3, Compass, FileText, FlaskConical, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { Course, NotePreview } from "@/lib/content";

type Totals = {
  courses: number;
  notes: number;
};

type HomeSearchResult = {
  preview: Pick<NotePreview, "slug" | "label" | "courseCode" | "week" | "excerpt" | "stats">;
};

type CourseGroup = {
  key: string;
  label: string;
  courses: Course[];
};

function compactCode(code: string) {
  if (code === "UPSC-CSE-POLITICAL-SCIENCE") return "UPSC-PS";
  return code.replace("SEM", "S");
}

function courseBucket(course: Course) {
  const value = `${course.code} ${course.name} ${course.level} ${course.category}`.toLowerCase();
  if (value.includes("upsc") || value.includes("ssc") || value.includes("civil services") || value.includes("competitive")) return "exams";
  if (course.category.toLowerCase() === "general" || value.includes("management") || value.includes("financial") || value.includes("sejarah") || value.includes("power sharing")) return "skills";
  return "engineering";
}

function noteSignal(note: NotePreview) {
  if (note.stats.questionBlocks >= 100) return "Question bank";
  if (note.stats.questionBlocks > 0) return `${note.stats.questionBlocks} questions`;
  if (note.stats.mathBlocks >= 20) return "Formula-rich";
  if (note.stats.mathBlocks > 0) return `${note.stats.mathBlocks} formulas`;
  return "Open note";
}

function groupCourses(courses: Course[]): CourseGroup[] {
  const groups: CourseGroup[] = [
    { key: "engineering", label: "Engineering", courses: [] },
    { key: "exams", label: "Competitive exams", courses: [] },
    { key: "skills", label: "Skills & management", courses: [] }
  ];
  for (const course of courses) groups.find((group) => group.key === courseBucket(course))?.courses.push(course);
  return groups.filter((group) => group.courses.length > 0);
}

export function StudyDashboard({ totals, courses, notes }: { totals: Totals; courses: Course[]; notes: NotePreview[] }) {
  const [query, setQuery] = useState("");
  const [remoteNoteSearch, setRemoteNoteSearch] = useState<{ query: string; results: NotePreview[]; state: "idle" | "error" }>({
    query: "",
    results: [],
    state: "idle"
  });

  const needle = query.trim().toLowerCase();
  const visibleCourses = useMemo(() => {
    if (!needle) return courses;
    return courses.filter((course) => `${course.code} ${course.name} ${course.level} ${course.category}`.toLowerCase().includes(needle));
  }, [courses, needle]);
  const courseGroups = useMemo(() => groupCourses(visibleCourses), [visibleCourses]);
  const visibleNotes = useMemo(() => {
    if (!needle) return notes.slice(0, 6);
    return remoteNoteSearch.query.toLowerCase() === needle ? remoteNoteSearch.results : [];
  }, [needle, notes, remoteNoteSearch]);
  const continueNote = notes[0] ?? null;
  const freshNotes = visibleNotes.slice(0, 3);
  const recentNotes = visibleNotes.slice(3, 6);
  const remoteNoteSearchState = !needle ? "idle" : remoteNoteSearch.query.toLowerCase() === needle ? remoteNoteSearch.state : "loading";

  useEffect(() => {
    const requestQuery = query.trim();
    if (!requestQuery) return;
    const controller = new AbortController();
    fetch(`/api/search?${new URLSearchParams({ q: requestQuery, limit: "8" }).toString()}`, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error("Search failed");
        return response.json() as Promise<{ results: HomeSearchResult[] }>;
      })
      .then((payload) => {
        setRemoteNoteSearch({
          query: requestQuery,
          state: "idle",
          results: (payload.results || []).map(({ preview }) => ({
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
        if ((error as Error).name !== "AbortError") setRemoteNoteSearch({ query: requestQuery, state: "error", results: [] });
      });
    return () => controller.abort();
  }, [query]);

  return (
    <div className="page public-home-page study-home">
      <header className="study-home-header">
        <p className="study-date">MITEEE Study · {totals.notes} notes across {totals.courses} subjects</p>
        <h1>What would you like to study?</h1>
        <p>Search subjects, notes, formulas, question banks and more.</p>
        <label className="study-global-search">
          <Search size={18} aria-hidden="true" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search UPSC, practice, answer frameworks, federalism, EM2…"
            aria-label="Search subjects and notes"
          />
          <kbd>Ctrl K</kbd>
        </label>
      </header>

      {!needle && continueNote && (
        <section className="study-continue" aria-labelledby="continue-title">
          <h2 id="continue-title">Continue where you left off</h2>
          <Link prefetch={false} href={`/notes/${continueNote.slug}`}>
            <span className="study-continue-icon"><Activity size={22} strokeWidth={1.6} aria-hidden="true" /></span>
            <span className="study-continue-copy">
              <strong>{continueNote.label}</strong>
              <small>{continueNote.courseCode || "MITEEE"}{continueNote.courseName ? ` · ${continueNote.courseName}` : ""}</small>
              <small>{continueNote.week ? `Next: Week ${continueNote.week}` : "Pick up from your last reading position"}</small>
            </span>
            <span className="study-text-action">Continue <ArrowRight size={17} aria-hidden="true" /></span>
          </Link>
        </section>
      )}

      {!needle && (
        <section className="study-research-feature" aria-labelledby="research-feature-title">
          <div className="study-research-icon"><FlaskConical size={22} strokeWidth={1.6} aria-hidden="true" /></div>
          <div className="study-research-copy">
            <span>Research · Preliminary exploratory findings</span>
            <h2 id="research-feature-title">Can agent composition predict a professional VALORANT map?</h2>
            <p>Early results from 1,684 maps across regional and global VCT events, with team strength, patches, chronology and calibration kept in view.</p>
          </div>
          <Link className="study-text-action" href="/research/valorant-preliminary-findings">
            Read findings <ArrowRight size={17} aria-hidden="true" />
          </Link>
        </section>
      )}

      <section className="study-subject-map" id="courses" aria-labelledby="subject-map-title">
        <div className="study-section-heading">
          <div>
            <h2 id="subject-map-title">{needle ? "Matching subjects" : "Subject map"}</h2>
            <p>{visibleCourses.length} {visibleCourses.length === 1 ? "subject" : "subjects"}</p>
          </div>
          <Link href="/courses">View library <ArrowRight size={15} aria-hidden="true" /></Link>
        </div>
        {courseGroups.length > 0 ? (
          <div className="study-subject-columns">
            {courseGroups.map((group) => (
              <section className="study-subject-group" key={group.key} aria-labelledby={`home-${group.key}`}>
                <h3 id={`home-${group.key}`}>{group.label}</h3>
                <div>
                  {group.courses.map((course) => (
                    <Link className={course.code === continueNote?.courseCode ? "active" : undefined} href={`/courses/${course.code}`} key={course.code}>
                      <span>{compactCode(course.code)}</span>
                      <strong>{course.name}</strong>
                      <small>{course.noteCount} notes</small>
                    </Link>
                  ))}
                </div>
              </section>
            ))}
          </div>
        ) : (
          <p className="study-empty">No subjects match “{query.trim()}”. Try a course code or a broader topic.</p>
        )}
      </section>

      <section className="study-discovery-grid" id="recent-notes">
        <StudyNoteList icon={<Compass size={19} />} title={needle ? "Matching notes" : "Fresh to explore"} notes={freshNotes} />
        <StudyNoteList icon={<Clock3 size={19} />} title="More to explore" notes={recentNotes.length ? recentNotes : notes.slice(0, 3)} />
      </section>

      {needle && remoteNoteSearchState === "loading" && <p className="study-search-state">Searching the note library…</p>}
      {needle && remoteNoteSearchState === "error" && <p className="study-search-state">Note search is temporarily unavailable. Subject results are still shown above.</p>}
    </div>
  );
}

function StudyNoteList({ icon, title, notes }: { icon: React.ReactNode; title: string; notes: NotePreview[] }) {
  return (
    <section className="study-note-list" aria-label={title}>
      <header>
        <span>{icon}</span>
        <h2>{title}</h2>
        <Link href="/#recent-notes">View all notes <ArrowRight size={14} aria-hidden="true" /></Link>
      </header>
      <div>
        {notes.length ? notes.map((note) => (
          <Link prefetch={false} href={`/notes/${note.slug}`} key={note.slug}>
            <FileText size={17} strokeWidth={1.6} aria-hidden="true" />
            <span>
              <strong>{note.label}</strong>
              <small>{note.courseName || note.courseCode || "MITEEE"}{note.week ? ` · Week ${note.week}` : ""}</small>
            </span>
            <small>{noteSignal(note)}</small>
          </Link>
        )) : <p className="study-empty">No matching notes yet.</p>}
      </div>
    </section>
  );
}
