"use client";

import Link from "next/link";
import { ArrowRight, BookOpen, Command, ListChecks, Search, Sigma } from "lucide-react";
import { useMemo, useState } from "react";
import type { Course } from "@/lib/content";
import { buildCourseDiscoveryGroups, filterCourseDiscoveryGroups, type CourseDiscoveryFilterId } from "@/lib/course-outline";
import { truncateText } from "@/lib/text";

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-IN").format(value);
}

function courseAccent(course: Course) {
  const key = `${course.code} ${course.name}`.toLowerCase();
  if (key.includes("em2")) return "violet";
  if (key.includes("mi")) return "emerald";
  if (key.includes("upsc")) return "amber";
  if (key.includes("management")) return "rose";
  return "cyan";
}

function courseBadge(course: Course) {
  if (course.code === "UPSC-CSE-POLITICAL-SCIENCE") return "UPSC Polity";
  return course.code.replace("SEM", "S");
}

function courseContext(course: Course) {
  return course.level === course.category ? course.level : `${course.level} · ${course.category}`;
}

function practiceCount(course: Course) {
  return course.questionCount + (course.practicePromptCount ?? 0);
}

function practiceLabel(course: Course) {
  return (course.practicePromptCount ?? 0) > 0 ? "practice prompts" : "questions";
}

export function CourseCatalog({ courses }: { courses: Course[] }) {
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<CourseDiscoveryFilterId>("all");
  const discovery = useMemo(() => buildCourseDiscoveryGroups(courses), [courses]);
  const filteredGroups = useMemo(() => filterCourseDiscoveryGroups(discovery.groups, activeFilter, query), [activeFilter, discovery.groups, query]);
  const filteredCourseCount = filteredGroups.reduce((total, group) => total + group.courses.length, 0);

  return (
    <section className="course-index-section">
      <div className="course-index-toolbar">
        <label className="command-search course-index-search">
          <Command size={17} aria-hidden="true" />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search subjects by code, title, or topic" aria-label="Search all courses" />
          <Search size={16} aria-hidden="true" />
        </label>
        <span className="home-section-count">{formatNumber(filteredCourseCount)} of {formatNumber(courses.length)} shown</span>
      </div>

      <div className="course-filter-row" aria-label="Course filters">
        {discovery.filters.map((filter) => (
          <button
            aria-pressed={activeFilter === filter.id}
            className={activeFilter === filter.id ? "course-filter-chip active" : "course-filter-chip"}
            key={filter.id}
            type="button"
            onClick={() => setActiveFilter(filter.id)}
          >
            <span>{filter.label}</span>
            <strong>{formatNumber(filter.count)}</strong>
          </button>
        ))}
      </div>

      {filteredGroups.length > 0 ? (
        <div className="course-index-groups">
          {filteredGroups.map((group) => (
            <section className="course-index-group" key={group.key} aria-labelledby={`course-group-${group.key}`}>
              <header className="course-index-group-header">
                <div>
                  <h2 id={`course-group-${group.key}`}>{group.label}</h2>
                  <p>{group.summary}</p>
                </div>
                <span>{formatNumber(group.courses.length)} {group.courses.length === 1 ? "course" : "courses"}</span>
              </header>
              <div className="course-index-grid">
                {group.courses.map((course) => (
                  <Link className={`course-index-card accent-${courseAccent(course)}`} key={course.code} href={`/courses/${course.code}`}>
                    <span className="home-course-code">{courseBadge(course)}</span>
                    <h3>{course.name}</h3>
                    <p>{truncateText(course.syllabusSummary[0] || courseContext(course), 150)}</p>
                    <div className="course-index-signals" aria-label={`${course.name} study signals`}>
                      {courseSignals(course).map((signal) => <span key={signal}>{signal}</span>)}
                    </div>
                    <footer>
                      <span><BookOpen size={15} aria-hidden="true" /> {formatNumber(course.noteCount)} notes</span>
                      <span><ListChecks size={15} aria-hidden="true" /> {formatNumber(practiceCount(course))} {practiceLabel(course)}</span>
                      <span><Sigma size={15} aria-hidden="true" /> {formatNumber(course.runnableNoteCount)} code notes</span>
                    </footer>
                    <strong className="course-index-open">Open course <ArrowRight size={15} aria-hidden="true" /></strong>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <div className="empty-state">No matching courses. Try a different filter, course code, title, or subject.</div>
      )}
    </section>
  );
}

function courseSignals(course: Course) {
  const signals = [];
  const activePractice = practiceCount(course);
  if (activePractice >= 20) signals.push("Practice-heavy");
  if (course.noteCount >= 10 && activePractice > 0) signals.push("Exam-ready");
  if (course.runnableNoteCount > 0) signals.push("Code-ready");
  if (signals.length === 0) signals.push(courseContext(course));
  return signals.slice(0, 3);
}
