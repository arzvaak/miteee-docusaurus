import type { CatQuantOptionId } from "@/lib/exam-types";

export const catPracticeStoragePrefix = "cat-quant-topic-practice:";

export type CatStoredPractice = {
  index: number;
  answers: Record<string, CatQuantOptionId | string | "z">;
  savedAt: string;
};

export function catPracticeStorageKey(slug: string) {
  return `${catPracticeStoragePrefix}${slug}`;
}

export function parseStoredCatPractice(value: string | null): CatStoredPractice | null {
  if (!value) return null;
  try {
    const parsed: unknown = JSON.parse(value);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return null;
    const row = parsed as Record<string, unknown>;
    if (!Number.isFinite(row.index) || !row.answers || typeof row.answers !== "object" || Array.isArray(row.answers)) return null;
    const answers = Object.fromEntries(Object.entries(row.answers as Record<string, unknown>).filter((entry): entry is [string, string] => typeof entry[1] === "string"));
    return {
      index: Number(row.index),
      answers,
      savedAt: typeof row.savedAt === "string" ? row.savedAt : new Date().toISOString()
    };
  } catch {
    return null;
  }
}
