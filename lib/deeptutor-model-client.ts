"use client";

import { useCallback, useEffect, useState } from "react";
import type { DeepTutorModelOption, DeepTutorModelSelection } from "@/lib/deeptutor";

export const deepTutorModelStorageKey = "miteee-deeptutor-model-v1";
const modelChangedEvent = "miteee-deeptutor-model-changed";

type ModelResponse = {
  options: DeepTutorModelOption[];
  active: DeepTutorModelSelection | null;
  oauth: {
    connection: "disconnected" | "authorizing" | "connected" | "error";
    operationState: string | null;
    authorizeUrl: string | null;
    expiresIn: number | null;
    callbackPort: number | null;
    modelCount: number;
    activeModel: string | null;
    errorCode: string | null;
  } | null;
  sshCommand: string | null;
};

function readSelection(): DeepTutorModelSelection | null {
  try {
    const value = JSON.parse(window.localStorage.getItem(deepTutorModelStorageKey) || "null") as Partial<DeepTutorModelSelection> | null;
    return value && typeof value.profileId === "string" && typeof value.modelId === "string"
      ? { profileId: value.profileId, modelId: value.modelId }
      : null;
  } catch {
    return null;
  }
}

export function useDeepTutorModels(enabled = true) {
  const [data, setData] = useState<ModelResponse>({ options: [], active: null, oauth: null, sshCommand: null });
  const [selected, setSelectedState] = useState<DeepTutorModelSelection | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const response = await fetch("/api/deeptutor/models", { cache: "no-store" });
    if (!response.ok) throw new Error("Model settings are unavailable.");
    const payload = await response.json() as ModelResponse;
    setData(payload);
    setSelectedState((current) => {
      const stored = current || readSelection();
      const validStored = stored && payload.options.some((option) => option.profileId === stored.profileId && option.modelId === stored.modelId);
      return validStored ? stored : payload.active;
    });
    setLoading(false);
    return payload;
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const timer = window.setTimeout(() => {
      setSelectedState(readSelection());
      refresh().catch(() => setLoading(false));
    }, 0);
    const onChange = () => setSelectedState(readSelection());
    window.addEventListener(modelChangedEvent, onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener(modelChangedEvent, onChange);
      window.removeEventListener("storage", onChange);
    };
  }, [enabled, refresh]);

  const select = useCallback((selection: DeepTutorModelSelection | null) => {
    setSelectedState(selection);
    try {
      if (selection) window.localStorage.setItem(deepTutorModelStorageKey, JSON.stringify(selection));
      else window.localStorage.removeItem(deepTutorModelStorageKey);
      window.dispatchEvent(new Event(modelChangedEvent));
    } catch {}
  }, []);

  return { ...data, selected, select, refresh, loading };
}
