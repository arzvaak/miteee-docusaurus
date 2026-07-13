"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  createEmptyStudySpacePreferences,
  getStudySpaceStatus,
  parseStudySpacePreferences,
  serializeStudySpacePreferences,
  setStudySpaceStatus,
  studySpacePreferencesChangeEvent,
  studySpacePreferencesStorageKey,
  type StudySpaceStatus
} from "@/lib/study-space-preferences";

function readStoredPreferences() {
  try {
    return parseStudySpacePreferences(window.localStorage.getItem(studySpacePreferencesStorageKey));
  } catch {
    return createEmptyStudySpacePreferences();
  }
}

export function useStudySpacePreferences() {
  const [preferences, setPreferences] = useState(() => createEmptyStudySpacePreferences());
  const hasLoaded = useRef(false);

  useEffect(() => {
    let cancelled = false;

    function syncPreferences(value?: string | null) {
      if (cancelled) return;
      hasLoaded.current = true;
      setPreferences(value === undefined ? readStoredPreferences() : parseStudySpacePreferences(value));
    }

    function handleLocalChange(event: Event) {
      const detail = event instanceof CustomEvent && typeof event.detail === "string" ? event.detail : undefined;
      syncPreferences(detail);
    }

    function handleStorage(event: StorageEvent) {
      if (event.key === studySpacePreferencesStorageKey) syncPreferences(event.newValue);
    }

    queueMicrotask(() => syncPreferences());
    window.addEventListener(studySpacePreferencesChangeEvent, handleLocalChange);
    window.addEventListener("storage", handleStorage);

    return () => {
      cancelled = true;
      window.removeEventListener(studySpacePreferencesChangeEvent, handleLocalChange);
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  useEffect(() => {
    if (!hasLoaded.current) return;
    try {
      window.localStorage.setItem(studySpacePreferencesStorageKey, serializeStudySpacePreferences(preferences));
    } catch {
      // The dashboard remains usable when device storage is blocked or unavailable.
    }
  }, [preferences]);

  const updateCourseStatus = useCallback((courseCode: string, status: StudySpaceStatus) => {
    setPreferences((current) => {
      const next = setStudySpaceStatus(current, courseCode, status);
      const serialized = serializeStudySpacePreferences(next);
      try {
        window.localStorage.setItem(studySpacePreferencesStorageKey, serialized);
      } catch {
        // The visible state still updates for this session when persistence is unavailable.
      }
      queueMicrotask(() => {
        window.dispatchEvent(new CustomEvent(studySpacePreferencesChangeEvent, { detail: serialized }));
      });
      return next;
    });
  }, []);

  return {
    preferences,
    getCourseStatus: (courseCode: string) => getStudySpaceStatus(preferences, courseCode),
    updateCourseStatus,
    persistence: "device-local" as const
  };
}
