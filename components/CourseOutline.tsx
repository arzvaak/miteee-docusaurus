"use client";

import Link from "next/link";
import { ArrowRight, BookOpen, ChevronDown, ListChecks, Search, Sigma } from "lucide-react";
import { useMemo, useState } from "react";
import type { CourseNavigationGroup, NotePreview } from "@/lib/content";
import { buildCourseStudyPath, filterCourseNavigationGroups } from "@/lib/course-outline";

type CourseOutlineProps = {
  groups: CourseNavigationGroup[];
  courseName: string;
  courseCode?: string;
};

export function CourseOutline({ groups, courseName, courseCode }: CourseOutlineProps) {
  const [query, setQuery] = useState("");
  const [collapsedGroupKeys, setCollapsedGroupKeys] = useState(() => new Set(groups.slice(2).map((group) => group.key)));
  const studyPath = useMemo(() => buildCourseStudyPath(groups), [groups]);
  const visibleGroups = useMemo(() => filterCourseNavigationGroups(groups, query), [groups, query]);
  const visibleNoteCount = visibleGroups.reduce((total, group) => total + group.notes.length, 0);
  const hasQuery = query.trim().length > 0;
  const isSscCgl = courseCode === "SSC-CGL";
  const unitLabel = isSscCgl ? "sublevel" : "note";
  const unitPluralLabel = isSscCgl ? "sublevels" : "notes";

  function toggleGroup(groupKey: string) {
    setCollapsedGroupKeys((current) => {
      const next = new Set(current);
      if (next.has(groupKey)) {
        next.delete(groupKey);
      } else {
        next.add(groupKey);
      }
      return next;
    });
  }

  function openGroup(groupKey: string) {
    setCollapsedGroupKeys((current) => {
      if (!current.has(groupKey)) return current;
      const next = new Set(current);
      next.delete(groupKey);
      return next;
    });
  }

  return (
    <section className={isSscCgl ? "panel course-outline-panel ssc-course-outline" : "panel course-outline-panel"} aria-labelledby="course-outline-heading" id="course-map">
      <div className="section-header">
        <div>
          <span className="micro-label">{isSscCgl ? "SSC CGL" : "Course map"}</span>
          <h2 className="section-title" id="course-outline-heading">{isSscCgl ? "Tier-I level map" : "Reading order"}</h2>
        </div>
        <Link className="button ghost" href={isSscCgl ? "/exams/ssc-cgl" : "/courses"}>
          {isSscCgl ? "SSC dashboard" : "All courses"}
        </Link>
      </div>

      <div className="course-path-strip" aria-label={`${courseName} study path`}>
        <div className="course-path-card primary">
          <span><BookOpen size={16} aria-hidden="true" /> {isSscCgl ? "Resume level" : "Start / resume"}</span>
          <strong>{studyPath.start ? studyPath.start.label : "No lessons yet"}</strong>
          {studyPath.start ? (
            <Link href={`/notes/${studyPath.start.slug}`} prefetch={false}>{isSscCgl ? "Open sublevel" : "Begin path"} <ArrowRight size={14} aria-hidden="true" /></Link>
          ) : (
            <small>{studyPath.noteCount} {unitPluralLabel} indexed</small>
          )}
        </div>
        <CoursePathCard
          icon={<Sigma size={16} aria-hidden="true" />}
          label={isSscCgl ? "Sublevel notes" : "High-yield"}
          notes={studyPath.highYield}
          emptyText={isSscCgl ? "No formula or diagram-heavy sublevels yet" : "No math or diagram-heavy lessons yet"}
        />
        <CoursePathCard
          icon={<ListChecks size={16} aria-hidden="true" />}
          label={isSscCgl ? "200/200 drills" : "Practice-heavy"}
          notes={studyPath.practiceHeavy}
          emptyText={isSscCgl ? "No question-heavy sublevels yet" : "No question-heavy lessons yet"}
        />
        <div className="course-path-card">
          <span><Search size={16} aria-hidden="true" /> {isSscCgl ? "Four-level outline" : "Full outline"}</span>
          <strong>{studyPath.groupCount} {isSscCgl ? "levels" : "sections"} · {studyPath.noteCount} {isSscCgl ? "sublevels" : "lessons"}</strong>
          <a href="#course-full-outline">Browse all <ArrowRight size={14} aria-hidden="true" /></a>
        </div>
      </div>

      {isSscCgl && (
        <nav className="course-ssc-level-strip" aria-label="SSC CGL Tier-I levels">
          {groups.map((group, index) => (
            <a className="course-ssc-level-node" href={`#${courseOutlineId(group)}`} key={group.key} onClick={() => openGroup(group.key)}>
              <span>Level {index + 1}</span>
              <strong>{group.label}</strong>
              <small>{group.notes.length} {group.notes.length === 1 ? "sublevel" : "sublevels"}</small>
            </a>
          ))}
        </nav>
      )}

      <details className="course-outline-tools">
        <summary>
          <span>{isSscCgl ? "Find SSC sublevels" : "Find in course map"}</span>
          <small>{isSscCgl ? "Search topics and jump across the four levels" : "Search lessons and jump to sections"}</small>
          <ChevronDown size={15} aria-hidden="true" />
        </summary>
        <div className="course-outline-tool-body">
          <label className="course-outline-search">
            <Search size={15} aria-hidden="true" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={`Search ${courseName}`}
              aria-label={isSscCgl ? "Search SSC CGL level map" : "Search this course outline"}
            />
            <span>{visibleNoteCount} shown</span>
          </label>

          {visibleGroups.length > 0 && (
            <nav className="course-outline-jump" aria-label="Jump to course section">
              {visibleGroups.map((group) => (
                <a href={`#${courseOutlineId(group)}`} key={group.key} onClick={() => openGroup(group.key)}>{group.label}</a>
              ))}
            </nav>
          )}
        </div>
      </details>

      {visibleGroups.length > 0 ? (
        <>
          <div className="course-outline-grid" id="course-full-outline">
            {visibleGroups.map((group) => {
              const collapsed = !hasQuery && collapsedGroupKeys.has(group.key);
              const listId = `${courseOutlineId(group)}-notes`;
              return (
                <section className={collapsed ? "course-outline-group collapsed" : "course-outline-group"} id={courseOutlineId(group)} key={group.key}>
                  <header>
                    <h3>
                      <button
                        aria-controls={listId}
                        aria-expanded={!collapsed}
                        className="course-outline-group-toggle"
                        type="button"
                        onClick={() => toggleGroup(group.key)}
                      >
                        <ChevronDown size={15} aria-hidden="true" />
                        <span>{group.label}</span>
                      </button>
                    </h3>
                    <span>{group.notes.length} {group.notes.length === 1 ? unitLabel : unitPluralLabel}</span>
                  </header>
                  <div className="course-outline-list" hidden={collapsed} id={listId}>
                    {group.notes.map((note, index) => <CourseOutlineNote key={note.slug} note={note} position={index + 1} />)}
                  </div>
                </section>
              );
            })}
          </div>
        </>
      ) : (
        <div className="empty-state course-outline-empty">No matching lessons in this course.</div>
      )}
    </section>
  );
}

function CoursePathCard({ icon, label, notes, emptyText }: { icon: React.ReactNode; label: string; notes: NotePreview[]; emptyText: string }) {
  return (
    <div className="course-path-card">
      <span>{icon}{label}</span>
      {notes.length > 0 ? (
        <div className="course-path-links">
          {notes.map((note) => (
            <Link href={`/notes/${note.slug}`} key={note.slug} prefetch={false}>
              {note.label}
            </Link>
          ))}
        </div>
      ) : (
        <small>{emptyText}</small>
      )}
    </div>
  );
}

function courseOutlineId(group: CourseNavigationGroup) {
  return `course-section-${group.key.replace(/[^a-z0-9-]+/gi, "-")}`;
}

function CourseOutlineNote({ note, position }: { note: NotePreview; position: number }) {
  return (
    <Link prefetch={false} className="course-outline-note" href={`/notes/${note.slug}`}>
      <span className="course-outline-position">{String(position).padStart(2, "0")}</span>
      <span>
        <strong>{note.label}</strong>
        <small>Open lesson</small>
      </span>
      <ArrowRight size={14} aria-hidden="true" />
    </Link>
  );
}
