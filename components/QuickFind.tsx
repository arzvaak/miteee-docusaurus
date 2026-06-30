"use client";

import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { PreviewCard } from "@/components/PreviewLink";
import type { NotePreview } from "@/lib/content";

type QuickFindPreview = Pick<NotePreview, "slug" | "label" | "courseCode" | "week" | "excerpt" | "stats">;

type QuickFindResult = {
  preview: QuickFindPreview;
  groupLabel: string;
  signalLabel: string;
};

function toPreviewCardPreview(preview: QuickFindPreview): NotePreview {
  return {
    ...preview,
    title: preview.label,
    aliases: [],
    headings: [],
    courseName: null,
    runnable: false
  };
}

export function QuickFind() {
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsId = useId();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [results, setResults] = useState<QuickFindResult[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [loadError, setLoadError] = useState(false);

  const highlightedIndex = Math.min(activeIndex, Math.max(0, results.length - 1));
  const activeResult = results[highlightedIndex] || results[0];
  const activePreview = activeResult?.preview;

  const openLauncher = useCallback(() => {
    setLoaded(false);
    setLoadError(false);
    setOpen(true);
  }, []);

  useEffect(() => {
    if (!open) return;

    const controller = new AbortController();
    const params = new URLSearchParams({ limit: "6" });
    const trimmedQuery = query.trim();
    if (trimmedQuery) params.set("q", trimmedQuery);

    fetch(`/api/search?${params.toString()}`, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error("Search request failed");
        return response.json() as Promise<{ results: QuickFindResult[] }>;
      })
      .then((payload) => {
        setResults(Array.isArray(payload.results) ? payload.results : []);
        setLoaded(true);
        setLoadError(false);
      })
      .catch((error) => {
        if ((error as Error).name === "AbortError") return;
        setResults([]);
        setLoaded(true);
        setLoadError(true);
      });

    return () => controller.abort();
  }, [open, query]);

  useEffect(() => {
    function isEditable(target: EventTarget | null) {
      const element = target as HTMLElement | null;
      return Boolean(element?.closest("input, textarea, select, [contenteditable='true']"));
    }

    function isRenderedShortcutTarget(element: HTMLElement | null) {
      if (!element) return false;
      const style = window.getComputedStyle(element);
      return style.display !== "none" && style.visibility !== "hidden" && element.getClientRects().length > 0;
    }

    function handleShortcut(event: KeyboardEvent) {
      const key = event.key.toLowerCase();
      const wantsCommand = (event.ctrlKey || event.metaKey) && key === "k";
      const wantsSlash = key === "/" && !isEditable(event.target);

      if ((!wantsCommand && !wantsSlash) || !isRenderedShortcutTarget(rootRef.current)) return;
      event.preventDefault();
      inputRef.current?.focus();
      openLauncher();
    }

    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, [openLauncher]);

  function moveActive(delta: number) {
    if (results.length === 0) return;
    setActiveIndex((index) => (index + delta + results.length) % results.length);
  }

  function openActiveResult(preview: QuickFindPreview) {
    setOpen(false);
    window.location.href = `/notes/${preview.slug}`;
  }

  return (
    <div
      className="quick-find"
      ref={rootRef}
      onBlur={(event) => {
        if (!rootRef.current?.contains(event.relatedTarget as Node | null)) setOpen(false);
      }}
    >
      <p className="panel-kicker">Quick Find</p>
      <label className="quick-find-input">
        <Search size={15} aria-hidden="true" />
        <input
          ref={inputRef}
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setActiveIndex(0);
            setLoaded(false);
            setLoadError(false);
            setOpen(true);
          }}
          onFocus={openLauncher}
          onKeyDown={(event) => {
            if (event.key === "ArrowDown") {
              event.preventDefault();
              moveActive(1);
            }
            if (event.key === "ArrowUp") {
              event.preventDefault();
              moveActive(-1);
            }
            if (event.key === "Escape") setOpen(false);
            if (event.key === "Enter" && activePreview) {
              event.preventDefault();
              openActiveResult(activePreview);
            }
          }}
          placeholder="Search UPSC, practice, answer framework, federalism, EM2"
          role="combobox"
          aria-label="Search notes and question banks"
          aria-expanded={open}
          aria-controls={resultsId}
          aria-activedescendant={open && activeResult ? `${resultsId}-${activeResult.preview.slug}` : undefined}
          aria-autocomplete="list"
        />
        <kbd>Ctrl K</kbd>
      </label>
      {open && (
        <div className="quick-find-popover">
          <div className="quick-find-results" id={resultsId} role="listbox" aria-label="Note search results">
            {results.length > 0 ? (
              results.map((result, index) => (
                <button
                  className={index === highlightedIndex ? "quick-find-result active" : "quick-find-result"}
                  key={result.preview.slug}
                  id={`${resultsId}-${result.preview.slug}`}
                  type="button"
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => setActiveIndex(index)}
                  role="option"
                  aria-selected={index === highlightedIndex}
                >
                  <span className="quick-find-result-title">{result.preview.label}</span>
                  <span className="quick-find-result-meta">
                    <strong>{result.groupLabel}</strong>
                    {result.preview.week ? <span>Week {result.preview.week}</span> : null}
                    <span>{result.signalLabel}</span>
                  </span>
                </button>
              ))
            ) : (
              <div className="quick-find-empty">
                {!loaded ? "Loading search..." : loadError ? "Search is unavailable. Try again." : "No preview match. Try UPSC, practice, federalism, EM2, or a course code."}
              </div>
            )}
          </div>
          {activePreview && (
            <div className="quick-find-preview">
              <PreviewCard preview={toPreviewCardPreview(activePreview)} compact />
              <Link prefetch={false} className="quick-find-open" href={`/notes/${activePreview.slug}`} onClick={() => setOpen(false)}>
                Open note <ArrowRight size={14} aria-hidden="true" />
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
