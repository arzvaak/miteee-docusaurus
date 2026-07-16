"use client";

import {
  BookOpenCheck,
  CalendarDays,
  CheckCircle2,
  Clipboard,
  Download,
  HardDrive,
  RotateCcw,
  Search,
  Settings2,
  TimerReset,
  Upload
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { Course } from "@/lib/content";
import {
  createDefaultStudyPlanPreferences,
  reconcileStudyPlanSubjects,
  setStudyPlanDailyMinutes,
  setStudyPlanEnabled,
  setStudyPlanSubjects,
  studyPlanDayOptions,
  toggleStudyPlanDay
} from "@/lib/study-plan-preferences";
import {
  createEmptyStudySpacePreferences,
  serializeStudySpacePreferences,
  studySpacePreferencesChangeEvent,
  studySpacePreferencesStorageKey,
  studySpaceStatusOptions,
  type StudySpacePreferences
} from "@/lib/study-space-preferences";
import { buildStudySettingsBackup, restoreStudySettingsBackup } from "@/lib/study-settings-backup";
import { useStudyPlanPreferences } from "@/components/useStudyPlanPreferences";
import { useStudySpacePreferences } from "@/components/useStudySpacePreferences";
import { SettingsAccountCard } from "@/components/SettingsAccountCard";
import { ReaderLayoutSettings } from "@/components/ReaderLayoutSettings";
import { ThemeGallery } from "@/components/ThemeToggle";
import styles from "@/components/StudySettings.module.css";

function persistStudySpacePreferences(preferences: StudySpacePreferences) {
  const serialized = serializeStudySpacePreferences(preferences);
  try {
    window.localStorage.setItem(studySpacePreferencesStorageKey, serialized);
  } catch {
    // The visible settings still update for this browser session when storage is blocked.
  }
  queueMicrotask(() => {
    window.dispatchEvent(new CustomEvent(studySpacePreferencesChangeEvent, { detail: serialized }));
  });
}

function compactCourseCode(code: string) {
  if (code === "UPSC-CSE-POLITICAL-SCIENCE") return "UPSC-PS";
  return code.replace("SEM", "S");
}

export function StudySettings({ courses }: { courses: Course[] }) {
  const { preferences: studySpace, getCourseStatus, updateCourseStatus } = useStudySpacePreferences();
  const {
    preferences: studyPlan,
    updatePreferences: updateStudyPlan,
    replacePreferences: replaceStudyPlan,
    resetPreferences: resetStudyPlan
  } = useStudyPlanPreferences();
  const [query, setQuery] = useState("");
  const [backupTimestamp, setBackupTimestamp] = useState("1970-01-01T00:00:00.000Z");
  const [restoreText, setRestoreText] = useState("");
  const [dataMessage, setDataMessage] = useState<string | null>(null);

  const counts = useMemo(() => ({
    available: courses.filter((course) => getCourseStatus(course.code) === "available").length,
    active: courses.filter((course) => getCourseStatus(course.code) === "active").length,
    completed: courses.filter((course) => getCourseStatus(course.code) === "completed").length
  }), [courses, getCourseStatus]);
  const activeCourses = useMemo(
    () => courses.filter((course) => getCourseStatus(course.code) === "active"),
    [courses, getCourseStatus]
  );
  const activeCourseCodeKey = activeCourses.map((course) => course.code).join("|");
  const visibleCourses = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return courses;
    return courses.filter((course) => `${course.code} ${course.name} ${course.category} ${course.level}`.toLowerCase().includes(needle));
  }, [courses, query]);
  const backupText = useMemo(
    () => buildStudySettingsBackup(studySpace, studyPlan, backupTimestamp),
    [backupTimestamp, studyPlan, studySpace]
  );

  useEffect(() => {
    queueMicrotask(() => setBackupTimestamp(new Date().toISOString()));
  }, [studyPlan, studySpace]);

  useEffect(() => {
    const activeCodes = activeCourseCodeKey ? activeCourseCodeKey.split("|") : [];
    if (studyPlan.subjectCodes.some((courseCode) => !activeCodes.includes(courseCode))) {
      updateStudyPlan((current) => reconcileStudyPlanSubjects(current, activeCodes));
    }
  }, [activeCourseCodeKey, studyPlan.subjectCodes, updateStudyPlan]);

  function togglePlanSubject(courseCode: string) {
    updateStudyPlan((current) => setStudyPlanSubjects(
      current,
      current.subjectCodes.includes(courseCode)
        ? current.subjectCodes.filter((item) => item !== courseCode)
        : [...current.subjectCodes, courseCode]
    ));
  }

  async function copyBackup() {
    try {
      await navigator.clipboard.writeText(backupText);
      setDataMessage("Settings backup copied.");
    } catch {
      setDataMessage("Copy failed. Select the export text manually.");
    }
  }

  function downloadBackup() {
    const blob = new Blob([backupText], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `miteee-study-settings-${new Date().toISOString().slice(0, 10)}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
    setDataMessage("Settings backup downloaded.");
  }

  function restoreBackup() {
    const restored = restoreStudySettingsBackup(restoreText);
    if (!restored.ok) {
      setDataMessage(restored.error);
      return;
    }
    persistStudySpacePreferences(restored.backup.studySpace);
    replaceStudyPlan(restored.backup.studyPlan);
    setRestoreText("");
    setDataMessage("Device settings restored.");
  }

  function resetPreferences() {
    if (!window.confirm("Reset all subject statuses and the optional study plan on this device?")) return;
    persistStudySpacePreferences(createEmptyStudySpacePreferences());
    resetStudyPlan();
    setRestoreText("");
    setDataMessage("Device settings reset.");
  }

  return (
    <div className={`page ${styles.page}`}>
      <header className={styles.hero}>
        <div className={styles.heroIcon}><Settings2 size={24} aria-hidden="true" /></div>
        <div>
          <span className={styles.eyebrow}>Study settings</span>
          <h1>Make this study space yours.</h1>
          <p>Choose what you are studying and shape a light weekly rhythm. These preferences stay in this browser.</p>
        </div>
        <span className={styles.deviceBadge}><HardDrive size={15} aria-hidden="true" /> This device</span>
      </header>

      <div className={styles.layout}>
        <main className={styles.primaryColumn}>
          <section className={styles.card} aria-label="Appearance settings">
            <ThemeGallery />
          </section>

          <section className={styles.card} aria-label="Reader layout settings">
            <ReaderLayoutSettings />
          </section>

          <section className={styles.card} aria-labelledby="subject-status-heading">
            <div className={styles.sectionHeading}>
              <div>
                <span className={styles.eyebrow}>Library status</span>
                <h2 id="subject-status-heading">Decide what belongs in focus.</h2>
                <p>Every collection remains available. Status only changes how your study space is organised.</p>
              </div>
              <span className={styles.savedLabel}><HardDrive size={14} aria-hidden="true" /> Saved on this device</span>
            </div>

            <div className={styles.statusSummary} aria-label="Library status summary">
              <span><strong>{counts.available}</strong> Available</span>
              <span><strong>{counts.active}</strong> Studying now</span>
              <span><strong>{counts.completed}</strong> Completed</span>
            </div>

            <label className={styles.searchBox}>
              <Search size={17} aria-hidden="true" />
              <span className={styles.srOnly}>Search collections</span>
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search collections" />
              <small>{visibleCourses.length} shown</small>
            </label>

            <div className={styles.courseList}>
              {visibleCourses.map((course) => {
                const status = getCourseStatus(course.code);
                return (
                  <article className={styles.courseRow} key={course.code}>
                    <div className={styles.courseCopy}>
                      <span>{compactCourseCode(course.code)}</span>
                      <strong>{course.name}</strong>
                      <small>{course.noteCount} {course.noteCount === 1 ? "note" : "notes"} · {course.category}</small>
                    </div>
                    <div className={styles.statusPicker} role="group" aria-label={`${course.name} status`}>
                      {studySpaceStatusOptions.map((option) => (
                        <button
                          aria-pressed={status === option.value}
                          className={status === option.value ? styles.selectedStatus : undefined}
                          key={option.value}
                          onClick={() => updateCourseStatus(course.code, option.value)}
                          type="button"
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

          <section className={styles.card} aria-labelledby="study-plan-heading">
            <div className={styles.planHeading}>
              <div className={styles.sectionIcon}><CalendarDays size={19} aria-hidden="true" /></div>
              <div>
                <span className={styles.eyebrow}>Optional study plan</span>
                <h2 id="study-plan-heading">Set a rhythm, not a rigid timetable.</h2>
                <p>Build a small plan from subjects marked Studying now. It is off by default.</p>
              </div>
              <button
                aria-checked={studyPlan.enabled}
                aria-label={studyPlan.enabled ? "Disable optional study plan" : "Enable optional study plan"}
                className={styles.switch}
                disabled={!studyPlan.enabled && activeCourses.length === 0}
                onClick={() => updateStudyPlan((current) => setStudyPlanEnabled(current, !current.enabled))}
                role="switch"
                type="button"
              >
                <span />
              </button>
            </div>

            {activeCourses.length === 0 && (
              <div className={styles.planEmpty}>
                <BookOpenCheck size={19} aria-hidden="true" />
                <div><strong>Choose a current subject first.</strong><span>Mark at least one subject as Studying now to enable a plan.</span></div>
              </div>
            )}

            {studyPlan.enabled && activeCourses.length > 0 && (
              <div className={styles.planEditor}>
                <fieldset>
                  <legend>Subjects in this plan</legend>
                  <p>Only subjects marked Studying now can be selected.</p>
                  <div className={styles.planSubjects}>
                    {activeCourses.map((course) => (
                      <label key={course.code}>
                        <input
                          checked={studyPlan.subjectCodes.includes(course.code)}
                          onChange={() => togglePlanSubject(course.code)}
                          type="checkbox"
                        />
                        <span><strong>{course.name}</strong><small>{compactCourseCode(course.code)}</small></span>
                      </label>
                    ))}
                  </div>
                </fieldset>

                <div className={styles.planControls}>
                  <label className={styles.minuteField}>
                    <span><TimerReset size={17} aria-hidden="true" /> Daily study time</span>
                    <span><input
                      aria-label="Daily study minutes"
                      max={300}
                      min={10}
                      onChange={(event) => updateStudyPlan((current) => setStudyPlanDailyMinutes(current, Number(event.target.value)))}
                      step={5}
                      type="number"
                      value={studyPlan.dailyMinutes}
                    /> minutes</span>
                  </label>
                  <fieldset className={styles.dayField}>
                    <legend>Study days</legend>
                    <div>
                      {studyPlanDayOptions.map((day) => (
                        <button
                          aria-label={day.label}
                          aria-pressed={studyPlan.studyDays.includes(day.value)}
                          key={day.value}
                          onClick={() => updateStudyPlan((current) => toggleStudyPlanDay(current, day.value))}
                          type="button"
                        >
                          {day.shortLabel}
                        </button>
                      ))}
                    </div>
                  </fieldset>
                </div>

                <div className={styles.planSummary}>
                  <CheckCircle2 size={18} aria-hidden="true" />
                  <p><strong>{studyPlan.subjectCodes.length || "No"} subject{studyPlan.subjectCodes.length === 1 ? "" : "s"}</strong> · {studyPlan.dailyMinutes} minutes · {studyPlan.studyDays.length} days each week</p>
                </div>
              </div>
            )}
          </section>
        </main>

        <aside className={styles.sideColumn}>
          <SettingsAccountCard />

          <section className={styles.sideCard} aria-labelledby="settings-data-heading">
            <div className={styles.sideIcon}><Clipboard size={20} aria-hidden="true" /></div>
            <span className={styles.eyebrow}>Data controls</span>
            <h2 id="settings-data-heading">Keep a small backup.</h2>
            <p>Export subject status and plan settings before changing browsers or clearing site data.</p>
            <label className={styles.backupField}>
              <span>Export JSON</span>
              <textarea aria-label="Study settings export JSON" readOnly rows={5} value={backupText} />
            </label>
            <div className={styles.dataActions}>
              <button onClick={copyBackup} type="button"><Clipboard size={15} aria-hidden="true" /> Copy</button>
              <button onClick={downloadBackup} type="button"><Download size={15} aria-hidden="true" /> Download</button>
            </div>
            <label className={styles.backupField}>
              <span>Restore JSON</span>
              <textarea
                aria-label="Restore study settings JSON"
                onChange={(event) => setRestoreText(event.target.value)}
                placeholder="Paste a study settings backup"
                rows={5}
                value={restoreText}
              />
            </label>
            <button className={styles.restoreButton} disabled={!restoreText.trim()} onClick={restoreBackup} type="button">
              <Upload size={15} aria-hidden="true" /> Restore settings
            </button>
            <button className={styles.resetButton} onClick={resetPreferences} type="button">
              <RotateCcw size={15} aria-hidden="true" /> Reset device settings
            </button>
            {dataMessage && <p className={styles.dataMessage} aria-live="polite">{dataMessage}</p>}
          </section>
        </aside>
      </div>
    </div>
  );
}
