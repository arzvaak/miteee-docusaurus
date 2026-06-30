export const readerProgressStorageKey = "miteee-reader-progress-v1";

export type ReaderProgressEntry = {
  slug: string;
  title: string;
  courseCode: string | null;
  courseName: string | null;
  pathname: string;
  scrollY: number;
  progress: number;
  updatedAt: string;
};

export type ReaderProgressStore = Record<string, ReaderProgressEntry>;

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function cleanString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function cleanNullableString(value: unknown) {
  const cleaned = cleanString(value);
  return cleaned || null;
}

function clampNumber(value: unknown, min: number, max: number) {
  const numeric = typeof value === "number" && Number.isFinite(value) ? value : min;
  return Math.min(max, Math.max(min, numeric));
}

export function calculateReaderProgress(scrollY: number, scrollHeight: number, viewportHeight: number) {
  const maxScroll = Math.max(0, scrollHeight - viewportHeight);
  if (maxScroll === 0) return 100;
  return Math.round(clampNumber(scrollY, 0, maxScroll) / maxScroll * 100);
}

function normalizeReaderProgressEntry(value: unknown): ReaderProgressEntry | null {
  if (!isRecord(value)) return null;
  const slug = cleanString(value.slug);
  const title = cleanString(value.title);
  const pathname = cleanString(value.pathname);
  const updatedAt = cleanString(value.updatedAt);
  if (!slug || !title || !pathname || Number.isNaN(Date.parse(updatedAt))) return null;

  return {
    slug,
    title,
    courseCode: cleanNullableString(value.courseCode),
    courseName: cleanNullableString(value.courseName),
    pathname,
    scrollY: Math.round(clampNumber(value.scrollY, 0, Number.MAX_SAFE_INTEGER)),
    progress: Math.round(clampNumber(value.progress, 0, 100)),
    updatedAt
  };
}

export function parseReaderProgressStore(value: string | null | undefined): ReaderProgressStore {
  if (!value) return {};
  try {
    const parsed = JSON.parse(value) as unknown;
    if (!isRecord(parsed)) return {};
    return Object.fromEntries(
      Object.values(parsed)
        .map(normalizeReaderProgressEntry)
        .filter((entry): entry is ReaderProgressEntry => Boolean(entry))
        .sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt))
        .map((entry) => [entry.slug, entry])
    );
  } catch {
    return {};
  }
}

export function serializeReaderProgressStore(store: ReaderProgressStore) {
  return JSON.stringify(store);
}

export function upsertReaderProgress(store: ReaderProgressStore, entry: ReaderProgressEntry, limit = 20): ReaderProgressStore {
  const normalized = normalizeReaderProgressEntry(entry);
  if (!normalized) return store;
  const cappedLimit = Math.max(1, Math.floor(limit));
  const entries = Object.values({ ...store, [normalized.slug]: normalized })
    .map(normalizeReaderProgressEntry)
    .filter((item): item is ReaderProgressEntry => Boolean(item))
    .sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt))
    .slice(0, cappedLimit);

  return Object.fromEntries(entries.map((item) => [item.slug, item]));
}

export function selectResumableReaderProgress(store: ReaderProgressStore, limit = 3) {
  const cappedLimit = Math.max(1, Math.floor(limit));
  return Object.values(store)
    .map(normalizeReaderProgressEntry)
    .filter((entry): entry is ReaderProgressEntry => Boolean(entry && entry.progress >= 2 && entry.progress < 99 && entry.scrollY > 80))
    .sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt))
    .slice(0, cappedLimit);
}

export function selectCourseResumableReaderProgress(store: ReaderProgressStore, courseCode: string, limit = 3) {
  return selectResumableReaderProgress(store, Number.MAX_SAFE_INTEGER)
    .filter((entry) => entry.courseCode === courseCode)
    .slice(0, Math.max(1, Math.floor(limit)));
}

export function readerProgressResumeHref(entry: ReaderProgressEntry) {
  return `${entry.pathname}?resume=1`;
}
