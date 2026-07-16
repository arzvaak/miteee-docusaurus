export const readerGuideStorageKey = "miteee-reader-guide-collapsed";
export const readerGuideStateChangeEvent = "miteee-reader-guide-state-change";
export const readerToolsStorageKey = "miteee-reader-tools-collapsed";
export const readerToolsStateChangeEvent = "miteee-reader-tools-state-change";

export type ReaderLayoutPreference = {
  guideVisible: boolean;
  toolsVisible: boolean;
};

export const defaultReaderLayoutPreference: ReaderLayoutPreference = {
  guideVisible: true,
  toolsVisible: true
};

function readCollapsed(storageKey: string) {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(storageKey) === "true";
}

export function readReaderLayoutPreference(): ReaderLayoutPreference {
  return {
    guideVisible: !readCollapsed(readerGuideStorageKey),
    toolsVisible: !readCollapsed(readerToolsStorageKey)
  };
}

export function readReaderLayoutSnapshot() {
  const preference = readReaderLayoutPreference();
  return `${preference.guideVisible}:${preference.toolsVisible}`;
}

export function parseReaderLayoutSnapshot(snapshot: string): ReaderLayoutPreference {
  const [guideVisible, toolsVisible] = snapshot.split(":");
  return {
    guideVisible: guideVisible !== "false",
    toolsVisible: toolsVisible !== "false"
  };
}

export function subscribeReaderLayoutPreference(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("storage", callback);
  window.addEventListener(readerGuideStateChangeEvent, callback);
  window.addEventListener(readerToolsStateChangeEvent, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(readerGuideStateChangeEvent, callback);
    window.removeEventListener(readerToolsStateChangeEvent, callback);
  };
}

export function saveReaderLayoutPreference(preference: ReaderLayoutPreference) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(readerGuideStorageKey, String(!preference.guideVisible));
  window.localStorage.setItem(readerToolsStorageKey, String(!preference.toolsVisible));
  window.dispatchEvent(new Event(readerGuideStateChangeEvent));
  window.dispatchEvent(new Event(readerToolsStateChangeEvent));
}
