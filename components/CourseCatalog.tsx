"use client";

import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";
import { useMemo, useState } from "react";
import type { Course } from "@/lib/content";
import { buildCourseDiscoveryGroups, filterCourseDiscoveryGroups, type CourseDiscoveryFilterId } from "@/lib/course-outline";

function compactCode(code: string) {
  if (code === "UPSC-CSE-POLITICAL-SCIENCE") return "UPSC-PS";
  return code.replace("SEM", "S");
}

export function CourseCatalog({ courses }: { courses: Course[] }) {
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<CourseDiscoveryFilterId>("all");
  const discovery = useMemo(() => buildCourseDiscoveryGroups(courses), [courses]);
  const filteredGroups = useMemo(() => filterCourseDiscoveryGroups(discovery.groups, activeFilter, query), [activeFilter, discovery.groups, query]);
  const filteredCourseCount = filteredGroups.reduce((total, group) => total + group.courses.length, 0);

  return (
    <section className="course-index-section study-library-index">
      <div className="study-library-toolbar">
        <label>
          <Search size={18} aria-hidden="true" />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search subjects by code, title, or topic" aria-label="Search all subjects" />
        </label>
        <span>{filteredCourseCount} of {courses.length} subjects</span>
      </div>

      <div className="study-library-filters" aria-label="Subject filters">
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

      {filteredGroups.length > 0 ? (
        <div className="study-library-groups">
          {filteredGroups.map((group) => (
            <section key={group.key} aria-labelledby={`course-group-${group.key}`}>
              <header>
                <div>
                  <h2 id={`course-group-${group.key}`}>{group.label}</h2>
                  <p>{group.summary}</p>
                </div>
                <span>{group.courses.length} {group.courses.length === 1 ? "subject" : "subjects"}</span>
              </header>
              <div className="study-library-rows">
                {group.courses.map((course) => (
                  <Link key={course.code} href={`/courses/${course.code}`}>
                    <span>{compactCode(course.code)}</span>
                    <strong>{course.name}</strong>
                    <small>{course.noteCount} notes</small>
                    <small>{course.questionCount + (course.practicePromptCount ?? 0)} practice items</small>
                    <ArrowRight size={16} aria-hidden="true" />
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : <p className="study-empty">No subjects match this search.</p>}
    </section>
  );
}
