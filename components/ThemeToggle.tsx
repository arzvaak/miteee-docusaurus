"use client";

import { BookOpen, Check, Contrast, Monitor, Moon, Palette, Sun } from "lucide-react";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import {
  normalizeThemePreference,
  resolveThemePreference,
  themeDefinitionById,
  themeOptions,
  themeStorageKey,
  type ThemePreference
} from "@/lib/themes";

const themeChangeEventName = "miteee-theme-change";
const themeIcons: Partial<Record<ThemePreference, typeof Monitor>> = {
  system: Monitor,
  dark: Moon,
  light: Sun,
  paper: BookOpen,
  "high-contrast": Contrast
};

function currentSystemPreference() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function applyThemePreference(preference: ThemePreference) {
  const resolved = resolveThemePreference(preference, currentSystemPreference());
  const definition = themeDefinitionById[resolved];
  const root = document.documentElement;
  root.dataset.themePreference = preference;
  root.dataset.theme = resolved;
  root.dataset.themeMode = definition.mode;
  root.style.colorScheme = definition.mode;
}

function readThemePreference() {
  try {
    return normalizeThemePreference(window.localStorage.getItem(themeStorageKey));
  } catch {
    return "system";
  }
}

function announceThemePreference(preference: ThemePreference) {
  window.dispatchEvent(new CustomEvent(themeChangeEventName, { detail: { preference } }));
}

function useThemePreference() {
  const [preference, setPreference] = useState<ThemePreference>("system");

  useEffect(() => {
    let cancelled = false;
    const storedPreference = readThemePreference();
    applyThemePreference(storedPreference);
    queueMicrotask(() => {
      if (!cancelled) setPreference(storedPreference);
    });

    function handleStorage(event: StorageEvent) {
      if (event.key !== themeStorageKey) return;
      const nextPreference = normalizeThemePreference(event.newValue);
      setPreference(nextPreference);
      applyThemePreference(nextPreference);
    }

    function handleThemeChange(event: Event) {
      const detail = (event as CustomEvent<{ preference?: unknown }>).detail;
      setPreference(normalizeThemePreference(detail?.preference));
    }

    window.addEventListener("storage", handleStorage);
    window.addEventListener(themeChangeEventName, handleThemeChange);
    return () => {
      cancelled = true;
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener(themeChangeEventName, handleThemeChange);
    };
  }, []);

  useEffect(() => {
    if (preference !== "system") return;
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handleSystemThemeChange = () => applyThemePreference("system");
    media.addEventListener("change", handleSystemThemeChange);
    return () => media.removeEventListener("change", handleSystemThemeChange);
  }, [preference]);

  const chooseTheme = useCallback((nextPreference: ThemePreference) => {
    setPreference(nextPreference);
    applyThemePreference(nextPreference);
    try {
      window.localStorage.setItem(themeStorageKey, nextPreference);
    } catch {
      // The selected theme still applies for this session when storage is unavailable.
    }
    announceThemePreference(nextPreference);
  }, []);

  return { chooseTheme, preference };
}

export function ThemeToggle({ compact = false }: { compact?: boolean }) {
  const { chooseTheme, preference } = useThemePreference();
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const focusOnOpenRef = useRef<number | null>(null);
  const selectedOption = themeOptions.find((option) => option.value === preference) ?? themeOptions[0]!;
  const selectedOptionIndex = Math.max(0, themeOptions.findIndex((option) => option.value === preference));
  const SelectedIcon = themeIcons[selectedOption.value] ?? Palette;

  useEffect(() => {
    if (!open) return;

    let cancelled = false;
    const focusIndex = focusOnOpenRef.current ?? selectedOptionIndex;
    focusOnOpenRef.current = null;
    queueMicrotask(() => {
      if (!cancelled) optionRefs.current[focusIndex]?.focus();
    });

    function handlePointerDown(event: PointerEvent) {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      setOpen(false);
      triggerRef.current?.focus();
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      cancelled = true;
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, selectedOptionIndex]);

  function openMenuAt(index: number) {
    focusOnOpenRef.current = index;
    setOpen(true);
  }

  function moveMenuFocus(index: number, event: React.KeyboardEvent<HTMLButtonElement>) {
    let nextIndex: number | null = null;
    if (event.key === "ArrowDown") nextIndex = (index + 1) % themeOptions.length;
    if (event.key === "ArrowUp") nextIndex = (index - 1 + themeOptions.length) % themeOptions.length;
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = themeOptions.length - 1;
    if (nextIndex === null) return;
    event.preventDefault();
    optionRefs.current[nextIndex]?.focus();
  }

  function selectTheme(nextPreference: ThemePreference) {
    chooseTheme(nextPreference);
    setOpen(false);
    triggerRef.current?.focus();
  }

  return (
    <div
      className="theme-picker"
      onBlur={(event) => {
        if (!containerRef.current?.contains(event.relatedTarget as Node | null)) setOpen(false);
      }}
      ref={containerRef}
    >
      <button
        aria-controls={menuId}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={`Theme: ${selectedOption.label}. Choose theme`}
        className={compact ? "theme-toggle compact-toggle" : "theme-toggle"}
        onClick={() => {
          if (open) setOpen(false);
          else openMenuAt(selectedOptionIndex);
        }}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown") {
            event.preventDefault();
            openMenuAt(0);
          }
          if (event.key === "ArrowUp") {
            event.preventDefault();
            openMenuAt(themeOptions.length - 1);
          }
        }}
        ref={triggerRef}
        title={`Theme: ${selectedOption.label}`}
        type="button"
      >
        <SelectedIcon size={17} aria-hidden="true" />
        {!compact && <span>{selectedOption.label}</span>}
      </button>

      {open ? (
        <div aria-label="Choose theme" className="theme-menu" id={menuId} role="menu">
          <span className="theme-menu-heading" role="presentation">Appearance</span>
          {themeOptions.map((option, index) => {
            const OptionIcon = themeIcons[option.value] ?? Palette;
            const selected = option.value === preference;
            return (
              <button
                aria-checked={selected}
                className={selected ? "theme-menu-option selected" : "theme-menu-option"}
                key={option.value}
                onClick={() => selectTheme(option.value)}
                onKeyDown={(event) => moveMenuFocus(index, event)}
                ref={(node) => {
                  optionRefs.current[index] = node;
                }}
                role="menuitemradio"
                tabIndex={-1}
                type="button"
              >
                <OptionIcon size={17} aria-hidden="true" />
                <span>
                  <strong>{option.label}</strong>
                  <small>{option.description}</small>
                </span>
                {selected ? <Check className="theme-menu-check" size={16} aria-hidden="true" /> : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

export function ThemeGallery({ className = "" }: { className?: string }) {
  const { chooseTheme, preference } = useThemePreference();
  const groupName = useId();
  const descriptionId = useId();

  return (
    <fieldset className={`theme-gallery${className ? ` ${className}` : ""}`} aria-describedby={descriptionId}>
      <legend>Appearance</legend>
      <p id={descriptionId}>Choose a reading palette. Your selection is saved on this device.</p>
      <div className="theme-gallery-grid">
        {themeOptions.map((option) => (
          <label className={option.value === preference ? "theme-gallery-option selected" : "theme-gallery-option"} key={option.value}>
            <input
              checked={option.value === preference}
              className="theme-gallery-radio"
              name={groupName}
              onChange={() => chooseTheme(option.value)}
              type="radio"
              value={option.value}
            />
            <span className="theme-gallery-swatch" aria-hidden="true">
              {option.swatch.map((color) => <i key={color} style={{ backgroundColor: color }} />)}
            </span>
            <span className="theme-gallery-copy">
              <strong>{option.label}</strong>
              <small>{option.description}</small>
            </span>
            {option.value === preference ? <Check size={17} aria-hidden="true" /> : null}
          </label>
        ))}
      </div>
    </fieldset>
  );
}
