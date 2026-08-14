"use client";

import Link from "next/link";
import {
  ArrowUpRight,
  BookOpen,
  BrainCircuit,
  Braces,
  ChartNoAxesCombined,
  CircuitBoard,
  FlaskConical,
  Gauge,
  Landmark,
  LibraryBig,
  Search,
  SearchX,
  Trophy,
  Waves,
  X,
  Zap,
  type LucideIcon
} from "lucide-react";
import { useMemo, useState } from "react";
import type { Course } from "@/lib/content";
import { buildCourseDiscoveryGroups, filterCourseDiscoveryGroups, type CourseDiscoveryFilterId } from "@/lib/course-outline";
import styles from "./CourseCatalog.module.css";

type CourseTone = "amber" | "blue" | "emerald" | "rose" | "violet" | "neutral";

function compactCode(code: string) {
  if (code === "UPSC-CSE-POLITICAL-SCIENCE") return "UPSC-PS";
  if (code === "SSC-CGL") return "SSC-CGL";
  return code.replace("SEM", "S");
}

function coursePracticeTotal(course: Course) {
  return course.questionCount + (course.practicePromptCount ?? 0);
}

function iconForCourse(course: Course): LucideIcon {
  const identity = `${course.code} ${course.name}`;
  if (/SSC-CGL/i.test(identity)) return Trophy;
  if (/\bCAT\b|Quantitative Aptitude/i.test(identity)) return Gauge;
  if (/UPSC|Political Science/i.test(identity)) return Landmark;
  if (/Digital Signal|DSP/i.test(identity)) return Waves;
  if (/Electrical Machines|EM2/i.test(identity)) return Gauge;
  if (/Converter|MPC/i.test(identity)) return CircuitBoard;
  if (/Measurement|Instrumentation/i.test(identity)) return BrainCircuit;
  if (/Smart Grid|SGT/i.test(identity)) return Zap;
  if (/Data Science|CRA/i.test(identity)) return Braces;
  if (/Management|Financial|Economics/i.test(identity)) return ChartNoAxesCombined;
  if (/Research|Valorant/i.test(identity)) return FlaskConical;
  if (/MITEEE/i.test(identity)) return LibraryBig;
  return BookOpen;
}

function toneForCourse(course: Course): CourseTone {
  const identity = `${course.code} ${course.name}`;
  if (/SSC-CGL|Management|Financial|Economics/i.test(identity)) return "amber";
  if (/\bCAT\b|Quantitative Aptitude/i.test(identity)) return "violet";
  if (/UPSC|Political Science|Digital Signal|DSP/i.test(identity)) return "blue";
  if (/Data Science|Smart Grid|SGT/i.test(identity)) return "emerald";
  if (/Electrical Machines|EM2|Measurement|Instrumentation/i.test(identity)) return "rose";
  if (/Converter|MPC|Research|Valorant/i.test(identity)) return "violet";
  return "neutral";
}

function blurbForCourse(course: Course) {
  const identity = `${course.code} ${course.name}`;
  if (/SSC-CGL/i.test(identity)) return "Timed practice, section drills, topic maps, and a complete Tier-I preparation system.";
  if (/\bCAT\b|Quantitative Aptitude/i.test(identity)) return "Chapter notes and book-backed Quant practice for CAT preparation.";
  if (/UPSC|Political Science/i.test(identity)) return "NCERT-grounded reading with Prelims traps, Mains scaffolds, and active recall.";
  if (/Research|Valorant/i.test(identity)) return "An evidence-led research space with methods, findings, and reproducible analysis.";
  if (/Plans/i.test(identity)) return "Implementation notes and working plans kept together for deliberate project review.";
  if (course.runnableNoteCount > 0) return "A practical subject space combining structured notes, worked material, and runnable study tools.";
  if (coursePracticeTotal(course) > 0) return "Focused course notes paired with question banks and exam-oriented practice.";
  return "Structured notes and reference material for steady, topic-by-topic study.";
}

function isFeaturedCourse(course: Course) {
  return course.code === "SSC-CGL" || course.code === "CAT" || course.code === "UPSC-CSE-POLITICAL-SCIENCE";
}

export function CourseCatalog({ courses }: { courses: Course[] }) {
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<CourseDiscoveryFilterId>("all");
  const discovery = useMemo(() => buildCourseDiscoveryGroups(courses), [courses]);
  const filteredGroups = useMemo(() => filterCourseDiscoveryGroups(discovery.groups, activeFilter, query), [activeFilter, discovery.groups, query]);
  const filteredCourseCount = filteredGroups.reduce((total, group) => total + group.courses.length, 0);
  const activeFilterLabel = discovery.filters.find((filter) => filter.id === activeFilter)?.label ?? "All";

  function clearDiscovery() {
    setQuery("");
    setActiveFilter("all");
  }

  return (
    <section className={`${styles.catalog} course-index-section study-library-index`} aria-label="Study library">
      <div className={`${styles.controls} study-library-toolbar`}>
        <label className={styles.searchField}>
          <Search size={18} aria-hidden="true" />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search collections, codes, or topics" aria-label="Search all collections" />
          {query ? (
            <button type="button" onClick={() => setQuery("")} aria-label="Clear collection search">
              <X size={15} aria-hidden="true" />
            </button>
          ) : null}
        </label>
        <div className={styles.resultCount} aria-live="polite">
          <strong>{filteredCourseCount}</strong>
          <span>{filteredCourseCount === 1 ? "collection" : "collections"} shown</span>
        </div>

        <div className={`${styles.filters} study-library-filters`} aria-label="Collection filters">
          {discovery.filters.map((filter) => (
            <button
              aria-pressed={activeFilter === filter.id}
              className={activeFilter === filter.id ? "active" : ""}
              key={filter.id}
              type="button"
              onClick={() => setActiveFilter(filter.id)}
            >
              {filter.label} <span>{filter.count}</span>
            </button>
          ))}
        </div>
      </div>

      {filteredGroups.length > 0 ? (
        <div className={`${styles.groups} study-library-groups`}>
          {filteredGroups.map((group, groupIndex) => (
            <section className={styles.group} key={group.key} aria-labelledby={`course-group-${group.key}`}>
              <header className={styles.groupHeader}>
                <div>
                  <span>{String(groupIndex + 1).padStart(2, "0")}</span>
                  <div>
                    <h2 id={`course-group-${group.key}`}>{group.label}</h2>
                    <p>{group.summary}</p>
                  </div>
                </div>
                <strong>{group.courses.length} {group.courses.length === 1 ? "space" : "spaces"}</strong>
              </header>

              <div className={styles.cardGrid}>
                {group.courses.map((course) => {
                  const Icon = iconForCourse(course);
                  const practiceTotal = coursePracticeTotal(course);
                  return (
                    <Link
                      aria-label={`Open ${course.name}`}
                      className={styles.courseCard}
                      data-featured={isFeaturedCourse(course) ? "true" : "false"}
                      data-tone={toneForCourse(course)}
                      href={`/courses/${course.code}`}
                      key={course.code}
                      prefetch={false}
                    >
                      <header className={styles.cardTopline}>
                        <span className={styles.courseIcon}><Icon size={20} aria-hidden="true" /></span>
                        <span className={styles.courseCode}>{compactCode(course.code)}</span>
                        <ArrowUpRight size={17} aria-hidden="true" />
                      </header>

                      <div className={styles.cardBody}>
                        <p>{course.level || course.category}</p>
                        <h3>{course.name}</h3>
                        <span>{blurbForCourse(course)}</span>
                      </div>

                      <dl className={styles.cardMetrics}>
                        <div>
                          <dt>Notes</dt>
                          <dd>{course.noteCount}</dd>
                        </div>
                        <div>
                          <dt>Practice</dt>
                          <dd>{practiceTotal}</dd>
                        </div>
                        <div>
                          <dt>Runnable</dt>
                          <dd>{course.runnableNoteCount}</dd>
                        </div>
                      </dl>

                      <footer className={styles.cardFooter}>
                        <span>{course.code === "RESEARCH" ? "Growing note collection" : isFeaturedCourse(course) ? "Featured study space" : course.category || "Study space"}</span>
                        <strong>Open {course.code === "RESEARCH" ? "collection" : "subject"} <ArrowUpRight size={14} aria-hidden="true" /></strong>
                      </footer>
                    </Link>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <div className={styles.emptyState}>
          <span><SearchX size={23} aria-hidden="true" /></span>
          <p className="eyebrow">No match in {activeFilterLabel}</p>
          <h2>No collection fits that search.</h2>
          <p>Try a broader phrase, or reset the filters to reopen the full library.</p>
          <button type="button" onClick={clearDiscovery}>Show every collection</button>
        </div>
      )}
    </section>
  );
}
