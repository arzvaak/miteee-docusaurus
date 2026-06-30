"use client";

import Link from "next/link";
import { ArrowRight, BookMarked } from "lucide-react";
import { useEffect, useState } from "react";
import {
  parseReaderProgressStore,
  readerProgressResumeHref,
  readerProgressStorageKey,
  selectCourseResumableReaderProgress,
  type ReaderProgressEntry
} from "@/lib/reader-progress";

export function CourseResumePanel({ courseCode, courseName }: { courseCode: string; courseName: string }) {
  const [entries, setEntries] = useState<ReaderProgressEntry[]>([]);

  useEffect(() => {
    let cancelled = false;
    queueMicrotask(() => {
      if (cancelled) return;
      try {
        const store = parseReaderProgressStore(window.localStorage.getItem(readerProgressStorageKey));
        setEntries(selectCourseResumableReaderProgress(store, courseCode, 3));
      } catch {
        setEntries([]);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [courseCode]);

  if (entries.length === 0) return null;

  return (
    <section className="course-resume-panel panel" aria-label="Resume this course">
      <div className="section-header">
        <div>
          <span className="micro-label">Continue {courseName}</span>
          <h2 className="section-title">Pick up where you stopped.</h2>
        </div>
        <BookMarked size={20} aria-hidden="true" />
      </div>
      <div className="course-resume-list">
        {entries.map((entry) => (
          <Link prefetch={false} className="course-resume-row" href={readerProgressResumeHref(entry)} key={entry.slug}>
            <span className="resume-reading-main">
              <strong>{entry.title}</strong>
              <small>{entry.progress}% complete</small>
              <span className="resume-reading-track" aria-hidden="true"><span style={{ width: `${entry.progress}%` }} /></span>
            </span>
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        ))}
      </div>
    </section>
  );
}
