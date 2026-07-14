"use client";

import { useEffect, useMemo, useState } from "react";
import {
  buildLearnerWeaknessReport,
  createLearnerWeaknessState,
  learnerWeaknessStorageKey,
  parseLearnerWeaknessState,
  type LearnerWeaknessState
} from "@/lib/learner-weakness-engine";
import {
  learnerWeaknessChangeEvent,
  readLocalLearnerWeaknessState
} from "@/lib/learner-weakness-client";

function readStoredWeaknessState() {
  return readLocalLearnerWeaknessState();
}

export function useLearnerWeakness() {
  const [state, setState] = useState<LearnerWeaknessState>(() => createLearnerWeaknessState());
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let cancelled = false;

    function sync(next?: LearnerWeaknessState) {
      if (cancelled) return;
      setState(next ?? readStoredWeaknessState());
      setHydrated(true);
    }

    function handleLocalChange(event: Event) {
      const detail = event instanceof CustomEvent ? event.detail : null;
      sync(detail && typeof detail === "object" ? detail as LearnerWeaknessState : undefined);
    }

    function handleStorage(event: StorageEvent) {
      if (event.key === learnerWeaknessStorageKey) {
        sync(parseLearnerWeaknessState(event.newValue));
      }
    }

    queueMicrotask(() => sync());
    window.addEventListener(learnerWeaknessChangeEvent, handleLocalChange);
    window.addEventListener("storage", handleStorage);

    return () => {
      cancelled = true;
      window.removeEventListener(learnerWeaknessChangeEvent, handleLocalChange);
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  const report = useMemo(
    () => buildLearnerWeaknessReport(state, new Date().toISOString()),
    [state]
  );

  return { state, report, hydrated };
}
