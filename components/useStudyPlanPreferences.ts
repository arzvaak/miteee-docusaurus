"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  createDefaultStudyPlanPreferences,
  parseStudyPlanPreferences,
  serializeStudyPlanPreferences,
  studyPlanPreferencesChangeEvent,
  studyPlanPreferencesStorageKey,
  type StudyPlanPreferences
} from "@/lib/study-plan-preferences";

function readStoredStudyPlan() {
  try {
    return parseStudyPlanPreferences(window.localStorage.getItem(studyPlanPreferencesStorageKey));
  } catch {
    return createDefaultStudyPlanPreferences();
  }
}

function persistStudyPlan(preferences: StudyPlanPreferences) {
  const serialized = serializeStudyPlanPreferences(preferences);
  try {
    window.localStorage.setItem(studyPlanPreferencesStorageKey, serialized);
  } catch {
    // The settings UI still works for this session when device storage is blocked.
  }
  queueMicrotask(() => {
    window.dispatchEvent(new CustomEvent(studyPlanPreferencesChangeEvent, { detail: serialized }));
  });
}

export function useStudyPlanPreferences() {
  const [preferences, setPreferences] = useState(() => createDefaultStudyPlanPreferences());
  const hasLoaded = useRef(false);

  useEffect(() => {
    let cancelled = false;

    function syncPreferences(value?: string | null) {
      if (cancelled) return;
      hasLoaded.current = true;
      setPreferences(value === undefined ? readStoredStudyPlan() : parseStudyPlanPreferences(value));
    }

    function handleLocalChange(event: Event) {
      const detail = event instanceof CustomEvent && typeof event.detail === "string" ? event.detail : undefined;
      syncPreferences(detail);
    }

    function handleStorage(event: StorageEvent) {
      if (event.key === studyPlanPreferencesStorageKey) syncPreferences(event.newValue);
    }

    queueMicrotask(() => syncPreferences());
    window.addEventListener(studyPlanPreferencesChangeEvent, handleLocalChange);
    window.addEventListener("storage", handleStorage);

    return () => {
      cancelled = true;
      window.removeEventListener(studyPlanPreferencesChangeEvent, handleLocalChange);
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  useEffect(() => {
    if (!hasLoaded.current) return;
    try {
      window.localStorage.setItem(studyPlanPreferencesStorageKey, serializeStudyPlanPreferences(preferences));
    } catch {
      // The settings UI remains usable without persistence.
    }
  }, [preferences]);

  const updatePreferences = useCallback((updater: (current: StudyPlanPreferences) => StudyPlanPreferences) => {
    setPreferences((current) => {
      const next = updater(current);
      persistStudyPlan(next);
      return next;
    });
  }, []);

  const replacePreferences = useCallback((next: StudyPlanPreferences) => {
    const normalized = parseStudyPlanPreferences(serializeStudyPlanPreferences(next));
    setPreferences(normalized);
    persistStudyPlan(normalized);
  }, []);

  const resetPreferences = useCallback(() => {
    const empty = createDefaultStudyPlanPreferences();
    setPreferences(empty);
    persistStudyPlan(empty);
  }, []);

  return {
    preferences,
    updatePreferences,
    replacePreferences,
    resetPreferences,
    persistence: "device-local" as const
  };
}
