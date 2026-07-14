export const currentAffairsActionsVersion = 1 as const;
export const currentAffairsActionsStorageKey = "miteee-current-affairs-actions-v1";

export type CurrentAffairsLens = "ssc" | "upsc";

export type CurrentAffairsStoryIdentity = {
  id: string;
  title: string;
  source?: string;
  url?: string;
  publishedAt?: string;
};

export type CurrentAffairsStoryActionEntry = {
  story: CurrentAffairsStoryIdentity;
  updatedAt: string;
};

export type CurrentAffairsActionsState = {
  version: typeof currentAffairsActionsVersion;
  lens: CurrentAffairsLens;
  saved: Record<string, CurrentAffairsStoryActionEntry>;
  hidden: Record<string, CurrentAffairsStoryActionEntry>;
  updatedAt: string | null;
};

export type CurrentAffairsActionMutation =
  | { type: "set-lens"; lens: CurrentAffairsLens }
  | { type: "set-saved"; story: CurrentAffairsStoryIdentity; saved: boolean }
  | { type: "set-hidden"; story: CurrentAffairsStoryIdentity; hidden: boolean }
  | { type: "restore-hidden"; storyIds?: string[] };

export type MaybePromise<Value> = Value | Promise<Value>;

/**
 * Persistence seam for the current device fallback and a future account-backed
 * implementation. A server adapter must authenticate and authorize every
 * mutation independently; client capability props are presentation only.
 */
export type CurrentAffairsActionsAdapter = {
  load: () => MaybePromise<CurrentAffairsActionsState | null>;
  persist: (
    next: CurrentAffairsActionsState,
    mutation: CurrentAffairsActionMutation
  ) => MaybePromise<CurrentAffairsActionsState | void>;
};

function cleanText(value: unknown, maxLength: number) {
  if (typeof value !== "string") return "";
  return value.replace(/\s+/g, " ").trim().slice(0, maxLength);
}

export function normalizeCurrentAffairsStoryIdentity(value: unknown): CurrentAffairsStoryIdentity | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const input = value as Partial<CurrentAffairsStoryIdentity>;
  const id = cleanText(input.id, 500);
  const title = cleanText(input.title, 300);
  if (!id || !title) return null;

  const source = cleanText(input.source, 120);
  const url = cleanText(input.url, 1000);
  const publishedAt = cleanText(input.publishedAt, 80);
  return {
    id,
    title,
    ...(source ? { source } : {}),
    ...(url ? { url } : {}),
    ...(publishedAt ? { publishedAt } : {})
  };
}

export function currentAffairsStoryKey(story: CurrentAffairsStoryIdentity) {
  return normalizeCurrentAffairsStoryIdentity(story)?.id ?? "";
}

export function createCurrentAffairsActionsState(lens: CurrentAffairsLens = "ssc"): CurrentAffairsActionsState {
  return {
    version: currentAffairsActionsVersion,
    lens,
    saved: {},
    hidden: {},
    updatedAt: null
  };
}

function parseEntryMap(value: unknown) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  const entries: Record<string, CurrentAffairsStoryActionEntry> = {};

  for (const candidate of Object.values(value).slice(0, 1000)) {
    if (!candidate || typeof candidate !== "object" || Array.isArray(candidate)) continue;
    const input = candidate as Partial<CurrentAffairsStoryActionEntry>;
    const story = normalizeCurrentAffairsStoryIdentity(input.story);
    const updatedAt = cleanText(input.updatedAt, 80);
    if (!story || !updatedAt) continue;
    entries[story.id] = { story, updatedAt };
  }

  return entries;
}

export function parseCurrentAffairsActionsState(value: string | null | undefined): CurrentAffairsActionsState {
  if (!value) return createCurrentAffairsActionsState();

  try {
    const parsed = JSON.parse(value) as unknown;
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return createCurrentAffairsActionsState();
    const input = parsed as Partial<CurrentAffairsActionsState>;
    return {
      version: currentAffairsActionsVersion,
      lens: input.lens === "upsc" ? "upsc" : "ssc",
      saved: parseEntryMap(input.saved),
      hidden: parseEntryMap(input.hidden),
      updatedAt: typeof input.updatedAt === "string" ? cleanText(input.updatedAt, 80) || null : null
    };
  } catch {
    return createCurrentAffairsActionsState();
  }
}

export function serializeCurrentAffairsActionsState(state: CurrentAffairsActionsState) {
  return JSON.stringify(state);
}

export function isCurrentAffairsStorySaved(state: CurrentAffairsActionsState, story: CurrentAffairsStoryIdentity) {
  const key = currentAffairsStoryKey(story);
  return Boolean(key && state.saved[key]);
}

export function isCurrentAffairsStoryHidden(state: CurrentAffairsActionsState, story: CurrentAffairsStoryIdentity) {
  const key = currentAffairsStoryKey(story);
  return Boolean(key && state.hidden[key]);
}

function withoutKey(
  entries: Record<string, CurrentAffairsStoryActionEntry>,
  key: string
) {
  const next = { ...entries };
  delete next[key];
  return next;
}

export function reduceCurrentAffairsActions(
  state: CurrentAffairsActionsState,
  mutation: CurrentAffairsActionMutation,
  updatedAt: string
): CurrentAffairsActionsState {
  const cleanUpdatedAt = cleanText(updatedAt, 80) || new Date(0).toISOString();

  if (mutation.type === "set-lens") {
    return { ...state, lens: mutation.lens, updatedAt: cleanUpdatedAt };
  }

  if (mutation.type === "restore-hidden") {
    const requestedIds = mutation.storyIds?.map((id) => cleanText(id, 500)).filter(Boolean);
    const hidden = requestedIds
      ? requestedIds.reduce((entries, id) => withoutKey(entries, id), state.hidden)
      : {};
    return { ...state, hidden, updatedAt: cleanUpdatedAt };
  }

  const story = normalizeCurrentAffairsStoryIdentity(mutation.story);
  if (!story) return state;
  const key = story.id;
  const entry = { story, updatedAt: cleanUpdatedAt };

  if (mutation.type === "set-saved") {
    return {
      ...state,
      saved: mutation.saved ? { ...state.saved, [key]: entry } : withoutKey(state.saved, key),
      updatedAt: cleanUpdatedAt
    };
  }

  return {
    ...state,
    hidden: mutation.hidden ? { ...state.hidden, [key]: entry } : withoutKey(state.hidden, key),
    updatedAt: cleanUpdatedAt
  };
}
