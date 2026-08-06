"use client";

import { useCallback, useEffect, useState } from "react";
import {
  createEmptySscEndlessMemory,
  parseSscEndlessMemory,
  serializeSscEndlessMemory,
  sscEndlessMemoryChangeEvent,
  sscEndlessMemoryStorageKey,
  type SscEndlessMemory
} from "@/lib/ssc-cgl-endless-memory";

function readStoredMemory() {
  try {
    return parseSscEndlessMemory(window.localStorage.getItem(sscEndlessMemoryStorageKey));
  } catch {
    return createEmptySscEndlessMemory();
  }
}

export function useSscEndlessMemory() {
  const [memory, setMemory] = useState<SscEndlessMemory>(() => createEmptySscEndlessMemory());
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let cancelled = false;

    function syncMemory(value?: string | null) {
      if (cancelled) return;
      setMemory(value === undefined ? readStoredMemory() : parseSscEndlessMemory(value));
      setHydrated(true);
    }

    function handleStorage(event: StorageEvent) {
      if (event.key === sscEndlessMemoryStorageKey) syncMemory(event.newValue);
    }

    function handleLocalChange(event: Event) {
      const detail = event instanceof CustomEvent && typeof event.detail === "string" ? event.detail : undefined;
      syncMemory(detail);
    }

    queueMicrotask(() => syncMemory());
    window.addEventListener("storage", handleStorage);
    window.addEventListener(sscEndlessMemoryChangeEvent, handleLocalChange);
    return () => {
      cancelled = true;
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener(sscEndlessMemoryChangeEvent, handleLocalChange);
    };
  }, []);

  const updateMemory = useCallback((updater: (current: SscEndlessMemory) => SscEndlessMemory) => {
    setMemory((current) => {
      const next = updater(current);
      const serialized = serializeSscEndlessMemory(next);
      try {
        window.localStorage.setItem(sscEndlessMemoryStorageKey, serialized);
      } catch {
        // Private browsing or blocked storage should not break endless practice.
      }
      queueMicrotask(() => window.dispatchEvent(new CustomEvent(sscEndlessMemoryChangeEvent, { detail: serialized })));
      return next;
    });
  }, []);

  return { memory, updateMemory, hydrated };
}
