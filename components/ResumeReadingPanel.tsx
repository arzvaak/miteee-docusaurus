"use client";

import Link from "next/link";
import { ArrowRight, BookMarked } from "lucide-react";
import { useEffect, useState } from "react";
import {
  parseReaderProgressStore,
  readerProgressResumeHref,
  readerProgressStorageKey,
  selectResumableReaderProgress,
  type ReaderProgressEntry
} from "@/lib/reader-progress";

export function ResumeReadingPanel() {
  const [entries, setEntries] = useState<ReaderProgressEntry[]>([]);

  useEffect(() => {
    let cancelled = false;
    queueMicrotask(() => {
      if (cancelled) return;
      try {
        const store = parseReaderProgressStore(window.localStorage.getItem(readerProgressStorageKey));
        setEntries(selectResumableReaderProgress(store, 3));
      } catch {
        setEntries([]);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className={`panel resume-reading-panel ${entries.length === 0 ? "empty" : ""}`} id="resume-reading">
      <div className="section-header">
        <div>
          <span className="micro-label">Resume reading</span>
          <h2 className="section-title">Pick up exactly where I stopped.</h2>
        </div>
        <BookMarked size={20} aria-hidden="true" />
      </div>

      {entries.length > 0 ? (
        <div className="resume-reading-list">
          {entries.map((entry) => (
            <Link prefetch={false} className="resume-reading-row" href={readerProgressResumeHref(entry)} key={entry.slug}>
              <span className="resume-reading-main">
                <strong>{entry.title}</strong>
                <small>{[entry.courseName ?? entry.courseCode ?? "Study note", `${entry.progress}% complete`].join(" · ")}</small>
                <span className="resume-reading-track" aria-hidden="true"><span style={{ width: `${entry.progress}%` }} /></span>
              </span>
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          ))}
        </div>
      ) : (
        <div className="resume-reading-empty">
          <p>Open a long note and scroll once; this desk will remember where to continue.</p>
          <Link className="button ghost" href="/courses">Open subjects <ArrowRight size={15} aria-hidden="true" /></Link>
        </div>
      )}
    </div>
  );
}
