"use client";

import {
  Bookmark,
  BookmarkCheck,
  EyeOff,
  RotateCcw
} from "lucide-react";
import {
  type ReactNode,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState
} from "react";
import {
  createCurrentAffairsActionsState,
  currentAffairsActionsStorageKey,
  isCurrentAffairsStoryHidden,
  isCurrentAffairsStorySaved,
  parseCurrentAffairsActionsState,
  reduceCurrentAffairsActions,
  serializeCurrentAffairsActionsState,
  type CurrentAffairsActionMutation,
  type CurrentAffairsActionsAdapter,
  type CurrentAffairsActionsState,
  type CurrentAffairsLens,
  type CurrentAffairsStoryIdentity
} from "@/lib/current-affairs-actions";

const currentAffairsActionsStateEvent = "miteee:current-affairs-actions-change";

export const localCurrentAffairsActionsAdapter: CurrentAffairsActionsAdapter = {
  load() {
    if (typeof window === "undefined") return null;
    return parseCurrentAffairsActionsState(window.localStorage.getItem(currentAffairsActionsStorageKey));
  },
  persist(next) {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(currentAffairsActionsStorageKey, serializeCurrentAffairsActionsState(next));
  }
};

type CurrentAffairsStateEvent = CustomEvent<CurrentAffairsActionsState>;

function announceState(next: CurrentAffairsActionsState) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(currentAffairsActionsStateEvent, { detail: next }));
}

export function useCurrentAffairsActions(adapter: CurrentAffairsActionsAdapter = localCurrentAffairsActionsAdapter) {
  const [state, setState] = useState<CurrentAffairsActionsState>(createCurrentAffairsActionsState);
  const [ready, setReady] = useState(false);
  const [persistenceMessage, setPersistenceMessage] = useState("");
  const stateRef = useRef(state);

  const applyState = useCallback((next: CurrentAffairsActionsState) => {
    stateRef.current = next;
    setState(next);
  }, []);

  useEffect(() => {
    let active = true;
    Promise.resolve(adapter.load())
      .then((loaded) => {
        if (!active) return;
        if (loaded) applyState(loaded);
        setReady(true);
      })
      .catch(() => {
        if (!active) return;
        setPersistenceMessage("Saved actions could not be loaded.");
        setReady(true);
      });

    function syncFromActionEvent(event: Event) {
      const next = (event as CurrentAffairsStateEvent).detail;
      if (next?.version === 1) applyState(next);
    }

    function syncFromStorage(event: StorageEvent) {
      if (event.key !== currentAffairsActionsStorageKey) return;
      applyState(parseCurrentAffairsActionsState(event.newValue));
    }

    window.addEventListener(currentAffairsActionsStateEvent, syncFromActionEvent);
    window.addEventListener("storage", syncFromStorage);
    return () => {
      active = false;
      window.removeEventListener(currentAffairsActionsStateEvent, syncFromActionEvent);
      window.removeEventListener("storage", syncFromStorage);
    };
  }, [adapter, applyState]);

  const mutate = useCallback((mutation: CurrentAffairsActionMutation) => {
    const optimistic = reduceCurrentAffairsActions(stateRef.current, mutation, new Date().toISOString());
    applyState(optimistic);
    announceState(optimistic);
    setPersistenceMessage("");

    Promise.resolve(adapter.persist(optimistic, mutation))
      .then((canonical) => {
        if (!canonical) return;
        applyState(canonical);
        announceState(canonical);
      })
      .catch(() => {
        setPersistenceMessage("This action could not be synced. It is only reflected in the current view.");
      });
  }, [adapter, applyState]);

  return { state, ready, persistenceMessage, mutate };
}

export function CurrentAffairsLensSelector({
  adapter,
  className,
  onLensChange
}: {
  adapter?: CurrentAffairsActionsAdapter;
  className?: string;
  onLensChange?: (lens: CurrentAffairsLens) => void;
}) {
  const { state, ready, persistenceMessage, mutate } = useCurrentAffairsActions(adapter);

  function selectLens(lens: CurrentAffairsLens) {
    mutate({ type: "set-lens", lens });
    onLensChange?.(lens);
  }

  return (
    <div className={className}>
      <div aria-label="Current affairs exam lens" role="group">
        <button aria-pressed={state.lens === "ssc"} onClick={() => selectLens("ssc")} type="button">
          SSC lens
        </button>
        <button aria-pressed={state.lens === "upsc"} onClick={() => selectLens("upsc")} type="button">
          UPSC lens
        </button>
      </div>
      <span aria-live="polite" role="status">
        {ready ? `${state.lens.toUpperCase()} lens selected.` : "Loading saved lens."}
        {persistenceMessage ? ` ${persistenceMessage}` : ""}
      </span>
    </div>
  );
}

export function CurrentAffairsLensContent({
  adapter,
  children,
  lens
}: {
  adapter?: CurrentAffairsActionsAdapter;
  children: ReactNode;
  lens: CurrentAffairsLens;
}) {
  const { state, ready } = useCurrentAffairsActions(adapter);
  if (!ready || state.lens !== lens) return null;
  return <>{children}</>;
}

export function CurrentAffairsStoryActions({
  adapter,
  canAdmin = false,
  className,
  onHiddenChange,
  onSavedChange,
  story
}: {
  adapter?: CurrentAffairsActionsAdapter;
  /** UI capability only. A future server adapter must authorize hide mutations. */
  canAdmin?: boolean;
  className?: string;
  onHiddenChange?: (hidden: boolean, story: CurrentAffairsStoryIdentity) => void;
  onSavedChange?: (saved: boolean, story: CurrentAffairsStoryIdentity) => void;
  story: CurrentAffairsStoryIdentity;
}) {
  const { state, ready, persistenceMessage, mutate } = useCurrentAffairsActions(adapter);
  const [actionMessage, setActionMessage] = useState("");
  const saved = isCurrentAffairsStorySaved(state, story);
  const hidden = isCurrentAffairsStoryHidden(state, story);

  function toggleSaved() {
    const nextSaved = !saved;
    mutate({ type: "set-saved", story, saved: nextSaved });
    setActionMessage(nextSaved ? "Saved for revision." : "Removed from revision.");
    onSavedChange?.(nextSaved, story);
  }

  function toggleHidden() {
    if (!canAdmin) return;
    const nextHidden = !hidden;
    mutate({ type: "set-hidden", story, hidden: nextHidden });
    setActionMessage(nextHidden ? "Story hidden from this view." : "Story restored to this view.");
    onHiddenChange?.(nextHidden, story);
  }

  return (
    <div className={className}>
      <div aria-label={`Actions for ${story.title}`} role="group">
        <button
          aria-label={saved ? `Remove ${story.title} from revision` : `Save ${story.title} for revision`}
          aria-pressed={saved}
          disabled={!ready}
          onClick={toggleSaved}
          type="button"
        >
          {saved ? <BookmarkCheck aria-hidden="true" size={16} /> : <Bookmark aria-hidden="true" size={16} />}
          {saved ? "Saved" : "Save for revision"}
        </button>
        {canAdmin ? (
          <button
            aria-label={hidden ? `Restore ${story.title}` : `Hide ${story.title}`}
            aria-pressed={hidden}
            disabled={!ready}
            onClick={toggleHidden}
            type="button"
          >
            {hidden ? <RotateCcw aria-hidden="true" size={16} /> : <EyeOff aria-hidden="true" size={16} />}
            {hidden ? "Restore" : "Hide"}
          </button>
        ) : null}
      </div>
      <span aria-live="polite" role="status">
        {actionMessage}{persistenceMessage ? ` ${persistenceMessage}` : ""}
      </span>
    </div>
  );
}

export function CurrentAffairsStoryVisibility({
  adapter,
  canAdmin = false,
  children,
  hiddenFallback = null,
  story
}: {
  adapter?: CurrentAffairsActionsAdapter;
  /** UI capability only. It does not replace server-side authorization. */
  canAdmin?: boolean;
  children: ReactNode;
  hiddenFallback?: ReactNode;
  story: CurrentAffairsStoryIdentity;
}) {
  const { state, ready } = useCurrentAffairsActions(adapter);
  if (ready && canAdmin && isCurrentAffairsStoryHidden(state, story)) return <>{hiddenFallback}</>;
  return <>{children}</>;
}

export function CurrentAffairsHiddenStories({
  adapter,
  canAdmin = false,
  className
}: {
  adapter?: CurrentAffairsActionsAdapter;
  /** UI capability only. A future server adapter must authorize restores. */
  canAdmin?: boolean;
  className?: string;
}) {
  const headingId = useId();
  const { state, ready, persistenceMessage, mutate } = useCurrentAffairsActions(adapter);
  const hiddenStories = Object.values(state.hidden)
    .map((entry) => entry.story)
    .sort((left, right) => left.title.localeCompare(right.title));

  if (!canAdmin) return null;

  function restore(story: CurrentAffairsStoryIdentity) {
    mutate({ type: "restore-hidden", storyIds: [story.id] });
  }

  return (
    <section aria-labelledby={headingId} className={className}>
      <h3 id={headingId}>Hidden stories</h3>
      {!ready ? <p aria-live="polite" role="status">Loading hidden stories.</p> : null}
      {ready && hiddenStories.length === 0 ? <p aria-live="polite" role="status">No hidden stories.</p> : null}
      {hiddenStories.length > 0 ? (
        <>
          <button onClick={() => mutate({ type: "restore-hidden" })} type="button">
            <RotateCcw aria-hidden="true" size={16} /> Restore all hidden stories
          </button>
          <ul>
            {hiddenStories.map((story) => (
              <li key={story.id}>
                <span>{story.title}{story.source ? ` · ${story.source}` : ""}</span>
                <button aria-label={`Restore ${story.title}`} onClick={() => restore(story)} type="button">Restore</button>
              </li>
            ))}
          </ul>
        </>
      ) : null}
      {persistenceMessage ? <p aria-live="polite" role="status">{persistenceMessage}</p> : null}
    </section>
  );
}
