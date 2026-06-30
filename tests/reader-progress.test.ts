import assert from "node:assert/strict";
import test from "node:test";
import {
  calculateReaderProgress,
  parseReaderProgressStore,
  readerProgressStorageKey,
  readerProgressResumeHref,
  selectCourseResumableReaderProgress,
  selectResumableReaderProgress,
  serializeReaderProgressStore,
  upsertReaderProgress
} from "../lib/reader-progress";

test("calculateReaderProgress clamps scroll position into a percent", () => {
  assert.equal(calculateReaderProgress(0, 2000, 1000), 0);
  assert.equal(calculateReaderProgress(500, 2000, 1000), 50);
  assert.equal(calculateReaderProgress(2000, 2000, 1000), 100);
  assert.equal(calculateReaderProgress(-200, 2000, 1000), 0);
  assert.equal(calculateReaderProgress(0, 600, 800), 100);
});

test("upsertReaderProgress dedupes by note slug and keeps recent entries first", () => {
  const store = upsertReaderProgress({}, {
    slug: "old-note",
    title: "Old note",
    courseCode: "SEM5-EM2",
    courseName: "Electrical Machines II",
    pathname: "/notes/old-note",
    scrollY: 120,
    progress: 12,
    updatedAt: "2026-06-23T06:00:00.000Z"
  });

  const updated = upsertReaderProgress(store, {
    slug: "old-note",
    title: "Old note renamed",
    courseCode: "SEM5-EM2",
    courseName: "Electrical Machines II",
    pathname: "/notes/old-note",
    scrollY: 820,
    progress: 82,
    updatedAt: "2026-06-24T06:00:00.000Z"
  });

  const withNewest = upsertReaderProgress(updated, {
    slug: "new-note",
    title: "New note",
    courseCode: "UPSC-CSE-POLITICAL-SCIENCE",
    courseName: "UPSC CSE Political Science",
    pathname: "/notes/new-note",
    scrollY: 240,
    progress: 24,
    updatedAt: "2026-06-25T06:00:00.000Z"
  });

  assert.deepEqual(Object.keys(withNewest), ["new-note", "old-note"]);
  assert.equal(withNewest["old-note"]?.title, "Old note renamed");
  assert.equal(withNewest["old-note"]?.scrollY, 820);
  assert.equal(withNewest["old-note"]?.progress, 82);
});

test("reader progress storage is stable and rejects invalid payloads", () => {
  const store = upsertReaderProgress({}, {
    slug: "sem5-em2-pyq-answer-bank",
    title: "PYQ Answer Bank",
    courseCode: "SEM5-EM2",
    courseName: "Electrical Machines II",
    pathname: "/notes/sem5-em2-pyq-answer-bank",
    scrollY: 400,
    progress: 40,
    updatedAt: "2026-06-24T06:00:00.000Z"
  });

  assert.equal(readerProgressStorageKey, "miteee-reader-progress-v1");
  assert.deepEqual(parseReaderProgressStore(serializeReaderProgressStore(store)), store);
  assert.deepEqual(parseReaderProgressStore("{ bad json"), {});
  assert.deepEqual(parseReaderProgressStore(JSON.stringify({ nope: true })), {});
});

test("selectResumableReaderProgress returns recent useful resume targets only", () => {
  const store = {
    complete: {
      slug: "complete",
      title: "Complete note",
      courseCode: "SEM5-EM2",
      courseName: "Electrical Machines II",
      pathname: "/notes/complete",
      scrollY: 5000,
      progress: 100,
      updatedAt: "2026-06-26T06:00:00.000Z"
    },
    tiny: {
      slug: "tiny",
      title: "Barely started",
      courseCode: "SEM5-EM2",
      courseName: "Electrical Machines II",
      pathname: "/notes/tiny",
      scrollY: 20,
      progress: 1,
      updatedAt: "2026-06-25T06:00:00.000Z"
    },
    older: {
      slug: "older",
      title: "Older note",
      courseCode: "SEM6-MI",
      courseName: "Measurements & Instrumentation",
      pathname: "/notes/older",
      scrollY: 900,
      progress: 35,
      updatedAt: "2026-06-23T06:00:00.000Z"
    },
    newest: {
      slug: "newest",
      title: "Newest note",
      courseCode: "UPSC-CSE-POLITICAL-SCIENCE",
      courseName: "UPSC CSE Political Science",
      pathname: "/notes/newest",
      scrollY: 1200,
      progress: 28,
      updatedAt: "2026-06-24T06:00:00.000Z"
    }
  };

  assert.deepEqual(selectResumableReaderProgress(store, 2).map((entry) => entry.slug), ["newest", "older"]);
});

test("selectCourseResumableReaderProgress returns unfinished notes for one course", () => {
  const store = {
    complete: {
      slug: "complete",
      title: "Complete note",
      courseCode: "SEM5-DSP",
      courseName: "Digital Signal Processing",
      pathname: "/notes/complete",
      scrollY: 5000,
      progress: 100,
      updatedAt: "2026-06-26T06:00:00.000Z"
    },
    other: {
      slug: "other",
      title: "Other course",
      courseCode: "SEM6-MI",
      courseName: "Measurements & Instrumentation",
      pathname: "/notes/other",
      scrollY: 900,
      progress: 35,
      updatedAt: "2026-06-25T06:00:00.000Z"
    },
    older: {
      slug: "older",
      title: "Older DSP",
      courseCode: "SEM5-DSP",
      courseName: "Digital Signal Processing",
      pathname: "/notes/older",
      scrollY: 700,
      progress: 42,
      updatedAt: "2026-06-23T06:00:00.000Z"
    },
    newest: {
      slug: "newest",
      title: "Newest DSP",
      courseCode: "SEM5-DSP",
      courseName: "Digital Signal Processing",
      pathname: "/notes/newest",
      scrollY: 1300,
      progress: 63,
      updatedAt: "2026-06-24T06:00:00.000Z"
    }
  };

  assert.deepEqual(selectCourseResumableReaderProgress(store, "SEM5-DSP", 2).map((entry) => entry.slug), ["newest", "older"]);
});

test("readerProgressResumeHref marks note links as resume intents", () => {
  assert.equal(readerProgressResumeHref({
    slug: "note",
    title: "Note",
    courseCode: "SEM5-EM2",
    courseName: "Electrical Machines II",
    pathname: "/notes/note",
    scrollY: 900,
    progress: 35,
    updatedAt: "2026-06-24T06:00:00.000Z"
  }), "/notes/note?resume=1");
});
