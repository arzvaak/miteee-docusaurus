"use client";

import { BookOpen, Check, PanelLeft, PanelsTopLeft } from "lucide-react";
import { useSyncExternalStore } from "react";
import {
  parseReaderLayoutSnapshot,
  readReaderLayoutSnapshot,
  saveReaderLayoutPreference,
  subscribeReaderLayoutPreference,
  type ReaderLayoutPreference
} from "@/lib/reader-layout-preferences";
import styles from "@/components/StudySettings.module.css";

const options: Array<{
  label: string;
  description: string;
  icon: typeof BookOpen;
  value: ReaderLayoutPreference;
}> = [
  {
    label: "Guide and tools",
    description: "Open both panels automatically on every note.",
    icon: PanelsTopLeft,
    value: { guideVisible: true, toolsVisible: true }
  },
  {
    label: "Guide only",
    description: "Keep navigation open and reader tools tucked away.",
    icon: PanelLeft,
    value: { guideVisible: true, toolsVisible: false }
  },
  {
    label: "Tools only",
    description: "Show revision tools without the course guide.",
    icon: BookOpen,
    value: { guideVisible: false, toolsVisible: true }
  },
  {
    label: "Hide both",
    description: "Start every note with a distraction-free canvas.",
    icon: BookOpen,
    value: { guideVisible: false, toolsVisible: false }
  }
];

function samePreference(left: ReaderLayoutPreference, right: ReaderLayoutPreference) {
  return left.guideVisible === right.guideVisible && left.toolsVisible === right.toolsVisible;
}

export function ReaderLayoutSettings() {
  const snapshot = useSyncExternalStore(subscribeReaderLayoutPreference, readReaderLayoutSnapshot, () => "true:true");
  const preference = parseReaderLayoutSnapshot(snapshot);

  function choose(next: ReaderLayoutPreference) {
    saveReaderLayoutPreference(next);
  }

  return (
    <fieldset className={styles.readerLayoutSettings}>
      <legend>Reader layout</legend>
      <p>Choose which side panels should already be open when you enter a note. The default is both.</p>
      <div className={styles.readerLayoutOptions}>
        {options.map((option) => {
          const selected = samePreference(preference, option.value);
          const Icon = option.icon;
          return (
            <button
              aria-pressed={selected}
              className={selected ? styles.readerLayoutOptionSelected : styles.readerLayoutOption}
              key={option.label}
              onClick={() => choose(option.value)}
              type="button"
            >
              <span className={styles.readerLayoutIcon}><Icon size={18} aria-hidden="true" /></span>
              <span>
                <strong>{option.label}</strong>
                <small>{option.description}</small>
              </span>
              {selected ? <Check size={17} aria-hidden="true" /> : null}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
