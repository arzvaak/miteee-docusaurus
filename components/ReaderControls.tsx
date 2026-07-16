"use client";

import Link from "next/link";
import { BookOpen, ChevronDown, Keyboard, ListChecks, Map, Maximize2, PanelLeftClose, PanelLeftOpen, RotateCcw, Search } from "lucide-react";
import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import type { CourseNavigationGroup, NotePreview } from "@/lib/content";
import { parseReaderProgressStore, readerProgressStorageKey } from "@/lib/reader-progress";
import type { HeadingAnchor } from "@/lib/heading-anchors";
import {
  readerGuideStateChangeEvent,
  readerGuideStorageKey,
  readerToolsStateChangeEvent,
  readerToolsStorageKey
} from "@/lib/reader-layout-preferences";

type ReaderCourseNavigatorProps = {
  groups: CourseNavigationGroup[];
  courseLabel: string;
};

const readerCourseMapStorageKey = "miteee-reader-course-map-collapsed";
const readerCourseMapStateChangeEvent = "miteee-reader-course-map-state-change";
const readerCourseGroupsStorageKey = "miteee-reader-course-groups-collapsed";
const readerCourseGroupsStateChangeEvent = "miteee-reader-course-groups-state-change";
const shellSidebarStorageKey = "miteee-shell-sidebar-collapsed";
const shellSidebarStateChangeEvent = "miteee-shell-sidebar-state-change";

function normalizeSearch(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function progressClass(progress: number | undefined) {
  if (typeof progress !== "number") return "";
  if (progress >= 95) return " read";
  if (progress > 4) return " in-progress";
  return "";
}

function readProgressBySlug() {
  if (typeof window === "undefined") return {};
  try {
    const store = parseReaderProgressStore(window.localStorage.getItem(readerProgressStorageKey));
    return Object.fromEntries(Object.entries(store).map(([slug, entry]) => [slug, entry.progress]));
  } catch {
    return {};
  }
}

function parseCollapsedCourseGroupKeys(value: string | null) {
  try {
    const parsed = JSON.parse(value || "[]");
    if (!Array.isArray(parsed)) return new Set<string>();
    return new Set(parsed.filter((item): item is string => typeof item === "string"));
  } catch {
    return new Set<string>();
  }
}

function readCollapsedCourseGroupsSnapshot() {
  if (typeof window === "undefined") return "[]";
  return window.localStorage.getItem(readerCourseGroupsStorageKey) || "[]";
}

function subscribeCollapsedCourseGroups(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("storage", callback);
  window.addEventListener(readerCourseGroupsStateChangeEvent, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(readerCourseGroupsStateChangeEvent, callback);
  };
}

function readReaderToolsSnapshot() {
  if (typeof window === "undefined") return false;
  const stored = window.localStorage.getItem(readerToolsStorageKey);
  if (stored === "true") return true;
  if (stored === "false") return false;
  return false;
}

function subscribeReaderToolsState(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("storage", callback);
  window.addEventListener(readerToolsStateChangeEvent, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(readerToolsStateChangeEvent, callback);
  };
}

function readReaderCourseMapSnapshot() {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(readerCourseMapStorageKey) === "true";
}

function subscribeReaderCourseMapState(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("storage", callback);
  window.addEventListener(readerCourseMapStateChangeEvent, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(readerCourseMapStateChangeEvent, callback);
  };
}

function writeCollapsedCourseGroupKeys(keys: Set<string>) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(readerCourseGroupsStorageKey, JSON.stringify(Array.from(keys)));
  window.dispatchEvent(new Event(readerCourseGroupsStateChangeEvent));
}

function goToReaderTarget(targetId: string, options: { guide?: boolean; tools?: boolean; courseMap?: boolean } = {}) {
  if (typeof window === "undefined") return;
  if (options.guide) {
    window.localStorage.setItem(readerGuideStorageKey, "false");
    applyReaderGuideState(false);
    window.dispatchEvent(new Event(readerGuideStateChangeEvent));
  }
  if (options.tools) {
    window.localStorage.setItem(readerToolsStorageKey, "false");
    applyReaderToolsState(false);
    window.dispatchEvent(new Event(readerToolsStateChangeEvent));
  }
  if (options.courseMap) {
    window.localStorage.setItem(readerCourseMapStorageKey, "false");
    window.dispatchEvent(new Event(readerCourseMapStateChangeEvent));
  }
  requestAnimationFrame(() => {
    document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth", block: "start" });
  });
}

function applyReaderGuideState(collapsed: boolean) {
  if (typeof document === "undefined") return;
  if (collapsed) {
    document.documentElement.dataset.readerGuideCollapsed = "true";
  } else {
    delete document.documentElement.dataset.readerGuideCollapsed;
  }
}

function applyReaderToolsState(collapsed: boolean) {
  if (typeof document === "undefined") return;
  if (collapsed) {
    document.documentElement.dataset.readerToolsCollapsed = "true";
  } else {
    delete document.documentElement.dataset.readerToolsCollapsed;
  }
}

function readReaderGuideSnapshot() {
  if (typeof window === "undefined") return false;
  const stored = window.localStorage.getItem(readerGuideStorageKey);
  if (stored === "true") return true;
  if (stored === "false") return false;
  return false;
}

function subscribeReaderGuideState(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("storage", callback);
  window.addEventListener(readerGuideStateChangeEvent, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(readerGuideStateChangeEvent, callback);
  };
}

export function ReaderGuideRail({ children }: { children: React.ReactNode }) {
  const collapsed = useSyncExternalStore(subscribeReaderGuideState, readReaderGuideSnapshot, () => false);
  const Icon = collapsed ? PanelLeftOpen : PanelLeftClose;

  useEffect(() => {
    applyReaderGuideState(collapsed);
  }, [collapsed]);

  function toggleGuide() {
    const next = !collapsed;
    window.localStorage.setItem(readerGuideStorageKey, String(next));
    applyReaderGuideState(next);
    window.dispatchEvent(new Event(readerGuideStateChangeEvent));
  }

  return (
    <aside className={collapsed ? "reader-rail left reader-guide-rail collapsed" : "reader-rail left reader-guide-rail"}>
      <button
        aria-label={collapsed ? "Show course map and reader guide" : "Hide reader guide"}
        aria-pressed={collapsed}
        className="reader-guide-toggle"
        title={collapsed ? "Show course map and reader guide" : "Hide reader guide"}
        type="button"
        onClick={toggleGuide}
      >
        <Icon size={15} aria-hidden="true" />
        <span>{collapsed ? "Map" : "Hide guide"}</span>
      </button>
      {!collapsed && <div className="reader-guide-body">{children}</div>}
    </aside>
  );
}

export function ReaderCourseNavigator({ groups, courseLabel }: ReaderCourseNavigatorProps) {
  const [query, setQuery] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("all");
  const [progressBySlug, setProgressBySlug] = useState<Record<string, number>>({});
  const courseNavigatorRef = useRef<HTMLDivElement | null>(null);
  const currentCourseLinkRef = useRef<HTMLAnchorElement | null>(null);
  const courseMapCollapsed = useSyncExternalStore(subscribeReaderCourseMapState, readReaderCourseMapSnapshot, () => false);
  const collapsedCourseGroupSnapshot = useSyncExternalStore(subscribeCollapsedCourseGroups, readCollapsedCourseGroupsSnapshot, () => "[]");
  const collapsedGroupKeys = useMemo(() => parseCollapsedCourseGroupKeys(collapsedCourseGroupSnapshot), [collapsedCourseGroupSnapshot]);
  const normalizedQuery = normalizeSearch(query);
  const expanded = !courseMapCollapsed;
  const collapsibleCourseGroupKeys = useMemo(() => {
    return groups.filter((group) => !group.notes.some((item) => item.current)).map((group) => group.key);
  }, [groups]);
  const showBulkCourseActions = selectedGroup === "all" && !normalizedQuery && collapsibleCourseGroupKeys.length > 0;

  useEffect(() => {
    let cancelled = false;

    function refreshProgress() {
      if (cancelled) return;
      setProgressBySlug(readProgressBySlug());
    }

    queueMicrotask(refreshProgress);
    window.addEventListener("storage", refreshProgress);
    window.addEventListener("reader-progress", refreshProgress);
    return () => {
      cancelled = true;
      window.removeEventListener("storage", refreshProgress);
      window.removeEventListener("reader-progress", refreshProgress);
    };
  }, []);

  const visibleGroups = useMemo(() => {
    return groups
      .filter((group) => selectedGroup === "all" || group.key === selectedGroup)
      .map((group) => ({
        ...group,
        notes: group.notes.filter((note) => {
          if (!normalizedQuery) return true;
          return normalizeSearch(`${note.label} ${note.title} ${note.courseCode || ""} ${note.headings.join(" ")}`).includes(normalizedQuery);
        })
      }))
      .filter((group) => group.notes.length > 0);
  }, [groups, normalizedQuery, selectedGroup]);

  useEffect(() => {
    if (!expanded || normalizedQuery || !courseNavigatorRef.current || !currentCourseLinkRef.current) return;
    const navigatorRect = courseNavigatorRef.current.getBoundingClientRect();
    const currentRect = currentCourseLinkRef.current.getBoundingClientRect();
    const currentTop = currentRect.top - navigatorRect.top + courseNavigatorRef.current.scrollTop;
    const targetTop = currentTop - (courseNavigatorRef.current.clientHeight - currentCourseLinkRef.current.offsetHeight) / 2;
    courseNavigatorRef.current.scrollTo({ top: Math.max(0, targetTop), behavior: "smooth" });
  }, [expanded, normalizedQuery, selectedGroup, visibleGroups]);

  if (groups.length === 0) return null;

  function toggleCourseGroup(group: CourseNavigationGroup) {
    if (group.notes.some((item) => item.current)) return;
    const next = new Set(collapsedGroupKeys);
    if (next.has(group.key)) {
      next.delete(group.key);
    } else {
      next.add(group.key);
    }
    writeCollapsedCourseGroupKeys(next);
  }

  function collapseOtherCourseGroups() {
    writeCollapsedCourseGroupKeys(new Set(collapsibleCourseGroupKeys));
  }

  function expandAllCourseGroups() {
    writeCollapsedCourseGroupKeys(new Set());
  }

  function toggleCourseMap() {
    const next = !expanded;
    window.localStorage.setItem(readerCourseMapStorageKey, String(!next));
    window.dispatchEvent(new Event(readerCourseMapStateChangeEvent));
  }

  return (
    <nav className="course-map-shell" id="course-map" aria-label="Course lessons">
      <div className="course-map-heading">
        <span className="micro-label">Course map</span>
        <button className="button ghost compact-map-toggle" type="button" onClick={toggleCourseMap} aria-expanded={expanded}>
          <PanelLeftOpen size={14} aria-hidden="true" />
          <span>{expanded ? "Hide" : "Map"}</span>
        </button>
      </div>

      {expanded && (
        <div className="course-map-body">
          <label className="course-map-search">
            <Search size={14} aria-hidden="true" />
            <input
              className="course-search-input"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={`Search ${courseLabel}`}
              aria-label="Search this course"
            />
          </label>

          <div className="course-map-jump" aria-label="Jump to week">
            <button className={selectedGroup === "all" ? "active" : ""} type="button" onClick={() => setSelectedGroup("all")}>All</button>
            {groups.map((group) => (
              <button className={selectedGroup === group.key ? "active" : ""} key={group.key} type="button" onClick={() => setSelectedGroup(group.key)}>
                {group.label.replace("Week ", "W")}
              </button>
            ))}
          </div>

          {showBulkCourseActions && (
            <div className="course-map-bulk-actions" aria-label="Course section controls">
              <button type="button" onClick={collapseOtherCourseGroups} aria-label="Collapse other course sections">
                <ChevronDown size={13} aria-hidden="true" />
                <span>Collapse others</span>
              </button>
              <button type="button" onClick={expandAllCourseGroups} aria-label="Expand all course sections">
                <PanelLeftOpen size={13} aria-hidden="true" />
                <span>Expand all</span>
              </button>
            </div>
          )}

          <div className="course-navigator" ref={courseNavigatorRef}>
            <div className="course-navigator-groups">
              {visibleGroups.map((group) => {
                const groupHasCurrent = group.notes.some((item) => item.current);
                const collapsed = !normalizedQuery && selectedGroup === "all" && !groupHasCurrent && collapsedGroupKeys.has(group.key);
                const listId = `reader-course-group-${group.key.replace(/[^a-z0-9-]+/gi, "-")}`;
                return (
                  <section className={collapsed ? "course-navigator-group collapsed" : "course-navigator-group"} key={group.key}>
                    <div className="course-navigator-group-header">
                      <button
                        aria-controls={listId}
                        aria-expanded={!collapsed}
                        className="course-navigator-group-toggle"
                        disabled={groupHasCurrent}
                        type="button"
                        onClick={() => toggleCourseGroup(group)}
                      >
                        <ChevronDown size={13} aria-hidden="true" />
                        <span>{group.label}</span>
                      </button>
                      <span className="course-navigator-group-count">
                        {groupHasCurrent ? "Current" : `${group.notes.length} ${group.notes.length === 1 ? "note" : "notes"}`}
                      </span>
                    </div>
                    <div className="course-navigator-list" hidden={collapsed} id={listId}>
                      {group.notes.map((item) => {
                        const progress = progressBySlug[item.slug];
                        const className = `${item.current ? "course-navigator-link current" : "course-navigator-link"}${progressClass(progress)}`;
                        return (
                          <Link
                            prefetch={false}
                            aria-current={item.current ? "page" : undefined}
                            className={className}
                            data-current-course-note={item.current ? "true" : undefined}
                            href={`/notes/${item.slug}`}
                            key={item.slug}
                            ref={item.current ? currentCourseLinkRef : undefined}
                          >
                            <span>{item.label}</span>
                            <small>{progress ? `${progress}% read · ` : ""}{item.stats.questionBlocks}q · {item.stats.mathBlocks}m</small>
                          </Link>
                        );
                      })}
                    </div>
                  </section>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

export function ReaderOutlineNav({ outline }: { outline: HeadingAnchor[] }) {
  const [activeId, setActiveId] = useState(outline[0]?.id || "");

  useEffect(() => {
    if (outline.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (visible?.target.id) setActiveId(visible.target.id);
      },
      { rootMargin: "-16% 0px -70% 0px", threshold: [0, 1] }
    );
    for (const item of outline) {
      const element = document.getElementById(item.id);
      if (element) observer.observe(element);
    }
    return () => observer.disconnect();
  }, [outline]);

  if (outline.length === 0) return null;

  return (
    <nav className="reader-outline" aria-label="On this page">
      <span className="micro-label">On this page</span>
      <div className="reader-outline-list">
        {outline.map((item) => (
          <a className={`reader-outline-link depth-${item.level}${activeId === item.id ? " active" : ""}`} href={`#${item.id}`} key={`${item.id}-${item.text}`}>
            {item.text}
          </a>
        ))}
      </div>
    </nav>
  );
}

export function ReaderQuestionNavigator({ questions }: { questions: HeadingAnchor[] }) {
  const [query, setQuery] = useState("");
  const [activeId, setActiveId] = useState(questions[0]?.id || "");
  const normalizedQuery = normalizeSearch(query);

  useEffect(() => {
    if (questions.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (visible?.target.id) setActiveId(visible.target.id);
      },
      { rootMargin: "-12% 0px -74% 0px", threshold: [0, 1] }
    );
    for (const item of questions) {
      const element = document.getElementById(item.id);
      if (element) observer.observe(element);
    }
    return () => observer.disconnect();
  }, [questions]);

  const visibleQuestions = useMemo(() => {
    if (!normalizedQuery) return questions;
    return questions.filter((item) => normalizeSearch(item.text).includes(normalizedQuery));
  }, [normalizedQuery, questions]);

  if (questions.length < 20) return null;

  return (
    <nav className="reader-question-navigator" aria-label="Question jumps">
      <div className="reader-question-heading">
        <span className="micro-label"><ListChecks size={13} aria-hidden="true" /> Questions</span>
        <span className="question-nav-count">{visibleQuestions.length} / {questions.length}</span>
      </div>
      <label className="reader-question-search">
        <Search size={14} aria-hidden="true" />
        <input
          className="question-search-input"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Find question"
          aria-label="Search questions in this note"
        />
      </label>
      <div className="question-jump-list">
        {visibleQuestions.length > 0 ? (
          visibleQuestions.map((item) => (
            <a className={`question-jump-link${activeId === item.id ? " active" : ""}`} href={`#${item.id}`} key={item.id}>
              {item.text}
            </a>
          ))
        ) : (
          <span className="question-jump-empty">No matching questions</span>
        )}
      </div>
    </nav>
  );
}

export function ReaderToolsPanel({ children }: { children: React.ReactNode }) {
  const collapsed = useSyncExternalStore(subscribeReaderToolsState, readReaderToolsSnapshot, () => false);

  useEffect(() => {
    applyReaderToolsState(collapsed);
    return () => applyReaderToolsState(false);
  }, [collapsed]);

  function toggleTools() {
    const next = !collapsed;
    window.localStorage.setItem(readerToolsStorageKey, String(next));
    applyReaderToolsState(next);
    window.dispatchEvent(new Event(readerToolsStateChangeEvent));
  }

  return (
    <aside id="reader-tools" className={collapsed ? "reader-rail reader-tools-panel collapsed" : "reader-rail reader-tools-panel"}>
      <button
        aria-expanded={!collapsed}
        aria-label={collapsed ? "Show reader tools" : "Hide reader tools"}
        aria-pressed={collapsed}
        className="button primary reader-tools-toggle"
        title={collapsed ? "Show reader tools" : "Hide reader tools"}
        type="button"
        onClick={toggleTools}
      >
        <BookOpen size={15} aria-hidden="true" />
        <span>{collapsed ? "Tools" : "Hide tools"}</span>
        <ChevronDown size={14} aria-hidden="true" />
      </button>
      {!collapsed && <div className="reader-tools-body">{children}</div>}
    </aside>
  );
}

export function ReaderQuickActions() {
  return (
    <nav className="reader-quick-actions" aria-label="Reader actions">
      <button type="button" onClick={() => goToReaderTarget("lesson-body")}>
        <BookOpen size={15} aria-hidden="true" />
        <span>Continue</span>
      </button>
      <button type="button" onClick={() => goToReaderTarget("note-practice", { tools: true })}>
        <ListChecks size={15} aria-hidden="true" />
        <span>Practice</span>
      </button>
      <button type="button" onClick={() => goToReaderTarget("course-map", { guide: true, courseMap: true })}>
        <Map size={15} aria-hidden="true" />
        <span>Map</span>
      </button>
      <button type="button" onClick={() => goToReaderTarget("reader-tools", { tools: true })}>
        <RotateCcw size={15} aria-hidden="true" />
        <span>Revision</span>
      </button>
    </nav>
  );
}

export function ReaderFocusButton() {
  function focusLesson() {
    window.localStorage.setItem(shellSidebarStorageKey, "true");
    window.localStorage.setItem(readerGuideStorageKey, "true");
    window.localStorage.setItem(readerToolsStorageKey, "true");
    document.documentElement.dataset.sidebarCollapsed = "true";
    applyReaderGuideState(true);
    applyReaderToolsState(true);
    window.dispatchEvent(new Event(shellSidebarStateChangeEvent));
    window.dispatchEvent(new Event(readerGuideStateChangeEvent));
    window.dispatchEvent(new Event(readerToolsStateChangeEvent));
    document.getElementById("lesson-content")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <button className="button ghost reader-focus-button" type="button" aria-label="Focus lesson content" onClick={focusLesson}>
      <Maximize2 size={15} aria-hidden="true" />
      <span>Focus lesson</span>
    </button>
  );
}

export function ReaderKeyboardShortcuts({ previous, next }: { previous: NotePreview | null; next: NotePreview | null }) {
  useEffect(() => {
    function isEditable(target: EventTarget | null) {
      const element = target as HTMLElement | null;
      return Boolean(element?.closest("input, textarea, select, [contenteditable='true']"));
    }

    function handleKeyDown(event: KeyboardEvent) {
      const key = event.key.toLowerCase();
      if (isEditable(event.target)) return;
      if (((event.altKey && event.key === "ArrowLeft") || key === "[") && previous) {
        event.preventDefault();
        window.location.href = `/notes/${previous.slug}`;
      }
      if (((event.altKey && event.key === "ArrowRight") || key === "]") && next) {
        event.preventDefault();
        window.location.href = `/notes/${next.slug}`;
      }
      if (key === "m") {
        event.preventDefault();
        document.getElementById("course-map")?.scrollIntoView({ behavior: "smooth", block: "start" });
        const toggle = document.querySelector<HTMLButtonElement>(".compact-map-toggle");
        if (toggle?.getAttribute("aria-expanded") === "false") toggle.click();
      }
      if (key === "s") {
        event.preventDefault();
        document.querySelector<HTMLInputElement>(".course-search-input")?.focus();
      }
      if (key === "q") {
        const questionSearch = document.querySelector<HTMLInputElement>(".question-search-input");
        if (questionSearch) {
          event.preventDefault();
          questionSearch.focus();
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [next, previous]);

  return (
    <div className="keyboard-shortcut-hint" aria-label="Reader keyboard shortcuts">
      <Keyboard size={13} aria-hidden="true" />
      <span>[ ] lessons · M map · S/Q search</span>
    </div>
  );
}
