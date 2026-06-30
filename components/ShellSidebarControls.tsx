"use client";

import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { useEffect, useSyncExternalStore } from "react";

const sidebarStorageKey = "miteee-shell-sidebar-collapsed";
const sidebarStateChangeEvent = "miteee-shell-sidebar-state-change";

function applySidebarState(collapsed: boolean) {
  if (typeof document === "undefined") return;
  if (collapsed) {
    document.documentElement.dataset.sidebarCollapsed = "true";
  } else {
    delete document.documentElement.dataset.sidebarCollapsed;
  }
}

function readSidebarSnapshot() {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(sidebarStorageKey) === "true";
}

function subscribeSidebarState(callback: () => void) {
  if (typeof window === "undefined") return () => {};

  window.addEventListener("storage", callback);
  window.addEventListener(sidebarStateChangeEvent, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(sidebarStateChangeEvent, callback);
  };
}

export function ShellSidebarControls() {
  const collapsed = useSyncExternalStore(subscribeSidebarState, readSidebarSnapshot, () => false);

  useEffect(() => {
    applySidebarState(collapsed);
  }, [collapsed]);

  const Icon = collapsed ? PanelLeftOpen : PanelLeftClose;

  function toggleSidebar() {
    const next = !collapsed;
    window.localStorage.setItem(sidebarStorageKey, String(next));
    applySidebarState(next);
    window.dispatchEvent(new Event(sidebarStateChangeEvent));
  }

  return (
    <button
      aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      aria-pressed={collapsed}
      className="sidebar-collapse-toggle"
      title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      type="button"
      onClick={toggleSidebar}
    >
      <Icon size={16} aria-hidden="true" />
      <span>{collapsed ? "Expand" : "Collapse"}</span>
    </button>
  );
}
