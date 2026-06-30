"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createEmptyLearnerMemory, parseLearnerMemory, serializeLearnerMemory, type LearnerMemory } from "@/lib/learner-memory";

const learnerMemoryStorageKey = "miteee-learner-memory-v1";
const learnerMemoryChangeEvent = "miteee-learner-memory-change";

function readStoredLearnerMemory() {
  try {
    return parseLearnerMemory(window.localStorage.getItem(learnerMemoryStorageKey));
  } catch {
    return createEmptyLearnerMemory();
  }
}

export function useLearnerMemory() {
  const [memory, setMemory] = useState<LearnerMemory>(() => createEmptyLearnerMemory());
  const hasLoaded = useRef(false);

  useEffect(() => {
    let cancelled = false;
    function syncMemory(value?: string | null) {
      if (cancelled) return;
      hasLoaded.current = true;
      setMemory(value === undefined ? readStoredLearnerMemory() : parseLearnerMemory(value));
    }

    function handleLocalMemoryChange(event: Event) {
      const detail = event instanceof CustomEvent && typeof event.detail === "string" ? event.detail : undefined;
      syncMemory(detail);
    }

    function handleStorage(event: StorageEvent) {
      if (event.key === learnerMemoryStorageKey) syncMemory(event.newValue);
    }

    queueMicrotask(() => {
      syncMemory();
    });
    window.addEventListener(learnerMemoryChangeEvent, handleLocalMemoryChange);
    window.addEventListener("storage", handleStorage);

    return () => {
      cancelled = true;
      window.removeEventListener(learnerMemoryChangeEvent, handleLocalMemoryChange);
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  useEffect(() => {
    if (!hasLoaded.current) return;
    try {
      window.localStorage.setItem(learnerMemoryStorageKey, serializeLearnerMemory(memory));
    } catch {
      // Private browsing or blocked storage should not break the study UI.
    }
  }, [memory]);

  const updateMemory = useCallback((updater: (current: LearnerMemory) => LearnerMemory) => {
    setMemory((current) => {
      const next = updater(current);
      const serialized = serializeLearnerMemory(next);
      try {
        window.localStorage.setItem(learnerMemoryStorageKey, serialized);
      } catch {
        // Private browsing or blocked storage should not break the study UI.
      }
      queueMicrotask(() => {
        window.dispatchEvent(new CustomEvent(learnerMemoryChangeEvent, { detail: serialized }));
      });
      return next;
    });
  }, []);

  return { memory, updateMemory };
}
