"use client";

import { BookMarked, RotateCcw } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  calculateReaderProgress,
  parseReaderProgressStore,
  readerProgressStorageKey,
  serializeReaderProgressStore,
  upsertReaderProgress,
  type ReaderProgressEntry
} from "@/lib/reader-progress";
import type { MemoryNoteRef } from "@/lib/learner-memory";

export function ReaderProgressPanel({ note }: { note: MemoryNoteRef }) {
  const [saved, setSaved] = useState<ReaderProgressEntry | null>(null);
  const [progress, setProgress] = useState(0);
  const lastWriteAt = useRef(0);
  const savedRef = useRef<ReaderProgressEntry | null>(null);
  const hasHandledResumeIntent = useRef(false);

  const noteLabel = useMemo(() => note.courseName ?? note.courseCode ?? "Study note", [note.courseCode, note.courseName]);

  const readStore = useCallback(() => {
    try {
      return parseReaderProgressStore(window.localStorage.getItem(readerProgressStorageKey));
    } catch {
      return {};
    }
  }, []);

  const writeProgress = useCallback((nextProgress: number) => {
    const now = Date.now();
    if (now - lastWriteAt.current < 600 && nextProgress < 100) return;
    lastWriteAt.current = now;
    const entry: ReaderProgressEntry = {
      slug: note.slug,
      title: note.title,
      courseCode: note.courseCode,
      courseName: note.courseName,
      pathname: window.location.pathname,
      scrollY: Math.round(window.scrollY),
      progress: nextProgress,
      updatedAt: new Date().toISOString()
    };
    try {
      const nextStore = upsertReaderProgress(readStore(), entry);
      window.localStorage.setItem(readerProgressStorageKey, serializeReaderProgressStore(nextStore));
      window.dispatchEvent(new CustomEvent("reader-progress"));
      savedRef.current = entry;
      setSaved(entry);
    } catch {
      savedRef.current = entry;
      setSaved(entry);
    }
  }, [note, readStore]);

  const jumpToSavedPosition = useCallback((entry: ReaderProgressEntry) => {
    const root = document.documentElement;
    const previousScrollBehavior = root.style.scrollBehavior;
    root.style.scrollBehavior = "auto";
    window.scrollTo(0, entry.scrollY);
    requestAnimationFrame(() => {
      root.style.scrollBehavior = previousScrollBehavior;
    });
  }, []);

  useEffect(() => {
    let cancelled = false;

    function updateProgress() {
      const nextProgress = calculateReaderProgress(window.scrollY, document.documentElement.scrollHeight, window.innerHeight);
      const previous = savedRef.current;
      if (previous && previous.progress > 2 && nextProgress + 2 < previous.progress) {
        setProgress(previous.progress);
        return;
      }
      setProgress(nextProgress);
      writeProgress(nextProgress);
    }

    queueMicrotask(() => {
      if (cancelled) return;
      const store = readStore();
      const stored = store[note.slug] ?? null;
      if (stored) {
        savedRef.current = stored;
        setSaved(stored);
        setProgress(stored.progress);
        if (!hasHandledResumeIntent.current && new URLSearchParams(window.location.search).get("resume") === "1") {
          hasHandledResumeIntent.current = true;
          requestAnimationFrame(() => {
            jumpToSavedPosition(stored);
            window.history.replaceState(null, "", window.location.pathname);
          });
        }
        return;
      }
      updateProgress();
    });

    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);
    return () => {
      cancelled = true;
      window.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
    };
  }, [jumpToSavedPosition, note.slug, readStore, writeProgress]);

  function resume() {
    if (!saved) return;
    jumpToSavedPosition(saved);
  }

  function restart() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const canResume = Boolean(saved && saved.scrollY > 80 && saved.progress > 2);

  return (
    <div className="reader-progress-card" aria-label="Reading progress">
      <div className="reader-memory-heading">
        <span className="home-small-icon"><BookMarked size={16} aria-hidden="true" /></span>
        <div>
          <span className="micro-label">Reading position</span>
          <strong>{progress}% complete</strong>
        </div>
      </div>

      <div className="reader-progress-track" aria-hidden="true">
        <span style={{ width: `${progress}%` }} />
      </div>

      <p>{canResume ? `Resume ${noteLabel} from ${saved?.progress}% complete.` : `Progress saves automatically for ${noteLabel}.`}</p>

      <div className="reader-progress-actions">
        <button className="button primary" type="button" onClick={resume} disabled={!canResume}>
          Resume <BookMarked size={15} aria-hidden="true" />
        </button>
        <button className="button ghost" type="button" onClick={restart}>
          Top <RotateCcw size={15} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
