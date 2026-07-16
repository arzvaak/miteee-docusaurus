"use client";

import clsx from "clsx";
import Link from "next/link";
import {
  Activity,
  ArrowRight,
  BookOpen,
  BriefcaseBusiness,
  CheckCircle2,
  CircleDot,
  Database,
  FileText,
  FlaskConical,
  GraduationCap,
  HardDrive,
  Landmark,
  Settings2,
  Sparkles,
  Target,
  Zap
} from "lucide-react";
import { useMemo, type ReactNode } from "react";
import type { Course } from "@/lib/content";
import type { LearnerMemory } from "@/lib/learner-memory";
import { studySpaceStatusOptions, type StudySpaceStatus } from "@/lib/study-space-preferences";
import { useLearnerMemory } from "@/components/useLearnerMemory";
import { useStudyPlanPreferences } from "@/components/useStudyPlanPreferences";
import { useStudySpacePreferences } from "@/components/useStudySpacePreferences";
import styles from "./StudyDashboard.module.css";

type Totals = {
  courses: number;
  notes: number;
};

type CourseGroup = {
  key: string;
  label: string;
  courses: Course[];
};

type DashboardActivity = {
  title: string;
  context: string;
  href: string;
  recordedAt: string;
};

const statusLabels: Record<StudySpaceStatus, string> = {
  available: "Available",
  active: "Studying now",
  completed: "Completed"
};

function compactCode(code: string) {
  if (code === "UPSC-CSE-POLITICAL-SCIENCE") return "UPSC-PS";
  return code.replace("SEM", "S");
}

function courseBucket(course: Course) {
  const value = `${course.code} ${course.name} ${course.level} ${course.category}`.toLowerCase();
  if (value.includes("research")) return "research";
  if (value.includes("upsc") || value.includes("ssc") || value.includes("civil services") || value.includes("competitive")) return "exams";
  if (course.category.toLowerCase() === "general" || value.includes("management") || value.includes("financial") || value.includes("sejarah") || value.includes("power sharing")) return "skills";
  return "engineering";
}

function groupCourses(courses: Course[]): CourseGroup[] {
  const groups: CourseGroup[] = [
    { key: "exams", label: "Competitive exams", courses: [] },
    { key: "engineering", label: "Engineering", courses: [] },
    { key: "skills", label: "Skills & management", courses: [] },
    { key: "research", label: "Research notes", courses: [] }
  ];
  for (const course of courses) groups.find((group) => group.key === courseBucket(course))?.courses.push(course);
  return groups.filter((group) => group.courses.length > 0);
}

function courseHref(course: Course) {
  return course.code === "SSC-CGL" ? "/exams/ssc-cgl" : `/courses/${encodeURIComponent(course.code)}`;
}

function courseMatches(course: Course, courseCode: string | null, courseName: string | null) {
  if (courseCode && courseCode.trim().toUpperCase() === course.code.trim().toUpperCase()) return true;
  return Boolean(courseName && courseName.trim().toLowerCase() === course.name.trim().toLowerCase());
}

function safeTimestamp(value: string) {
  const timestamp = Date.parse(value);
  return Number.isFinite(timestamp) ? timestamp : 0;
}

function latestActivityForCourse(memory: LearnerMemory, course: Course): DashboardActivity | null {
  const candidates: DashboardActivity[] = [];

  for (const note of Object.values(memory.notes)) {
    if (!courseMatches(course, note.courseCode, note.courseName)) continue;
    candidates.push({
      title: note.title,
      context: "Last opened note recorded on this device",
      href: `/notes/${note.slug}`,
      recordedAt: note.lastReadAt
    });
  }

  for (const activity of memory.studyActivity) {
    if (!activity.note || !courseMatches(course, activity.note.courseCode, activity.note.courseName)) continue;
    candidates.push({
      title: activity.title,
      context: "Completed study block recorded on this device",
      href: activity.note.slug ? `/notes/${activity.note.slug}` : courseHref(course),
      recordedAt: activity.completedAt
    });
  }

  return candidates.sort((a, b) => safeTimestamp(b.recordedAt) - safeTimestamp(a.recordedAt))[0] ?? null;
}

function courseIcon(course: Course, size = 24): ReactNode {
  const value = `${course.code} ${course.name}`.toLowerCase();
  const props = { size, strokeWidth: 1.7, "aria-hidden": true as const };
  if (value.includes("ssc")) return <Target {...props} />;
  if (value.includes("upsc") || value.includes("political")) return <Landmark {...props} />;
  if (value.includes("machine") || value.includes("power") || value.includes("grid")) return <Zap {...props} />;
  if (value.includes("signal") || value.includes("measurement")) return <Activity {...props} />;
  if (value.includes("data")) return <Database {...props} />;
  if (value.includes("management") || value.includes("financial")) return <BriefcaseBusiness {...props} />;
  return <BookOpen {...props} />;
}

function toneForCourse(course: Course) {
  const value = `${course.code} ${course.name}`.toLowerCase();
  if (value.includes("ssc")) return styles.toneViolet;
  if (value.includes("upsc") || value.includes("political")) return styles.toneGreen;
  if (value.includes("machine") || value.includes("power") || value.includes("grid")) return styles.toneAmber;
  if (value.includes("management") || value.includes("financial")) return styles.toneRose;
  return styles.toneBlue;
}

export function StudyDashboard({ totals, courses }: { totals: Totals; courses: Course[] }) {
  const { memory } = useLearnerMemory();
  const { preferences: studyPlan } = useStudyPlanPreferences();
  const { getCourseStatus, updateCourseStatus } = useStudySpacePreferences();
  const courseGroups = useMemo(() => groupCourses(courses), [courses]);
  const activeCourses = courses.filter((course) => getCourseStatus(course.code) === "active");
  const plannedCourseCodes = new Set(studyPlan.subjectCodes.map((courseCode) => courseCode.toUpperCase()));
  const plannedActiveCourses = activeCourses.filter((course) => plannedCourseCodes.has(course.code.toUpperCase()));
  const hasActivePlan = studyPlan.enabled && studyPlan.subjectCodes.length > 0 && plannedActiveCourses.length > 0;
  const focusCourses = hasActivePlan ? plannedActiveCourses : activeCourses;
  const completedCount = courses.filter((course) => getCourseStatus(course.code) === "completed").length;
  const availableCount = Math.max(0, courses.length - activeCourses.length - completedCount);
  const hasStudyState = activeCourses.length > 0 || completedCount > 0 || studyPlan.enabled;

  const subjectSpaces = (
    <section className={clsx(styles.panel, styles.subjectSpaces)} id="subject-spaces" aria-labelledby="subject-spaces-title">
      <div className={styles.spacesHeading}>
        <div>
          <p className={styles.eyebrow}>{hasStudyState ? "Full library" : "Start here"}</p>
          <h2 id="subject-spaces-title">Library spaces</h2>
          <p>
            {hasStudyState
              ? "Every collection stays here, including the ones you have completed. Change its status whenever your priorities change."
              : "Explore every collection, then mark only the ones you want to study now. Nothing is forced into your dashboard."}
          </p>
        </div>
        <div className={styles.spacesActions}>
          <span className={styles.localLabel}><HardDrive size={15} aria-hidden="true" /> Status saved on this device</span>
          <Link className={styles.planShortcut} href="/settings"><Settings2 size={16} aria-hidden="true" /> Create a study plan</Link>
        </div>
      </div>

      <div className={styles.groupStack}>
        {courseGroups.map((group) => (
          <section className={styles.courseGroup} key={group.key} aria-labelledby={`space-group-${group.key}`}>
            <div className={styles.groupHeading}>
              <h3 id={`space-group-${group.key}`}>{group.label}</h3>
              <span>{group.courses.length} {group.courses.length === 1 ? "space" : "spaces"}</span>
            </div>
            <div className={styles.spaceGrid}>
              {group.courses.map((course) => (
                <SubjectSpaceCard
                  course={course}
                  key={course.code}
                  onStatusChange={(status) => updateCourseStatus(course.code, status)}
                  status={getCourseStatus(course.code)}
                />
              ))}
            </div>
          </section>
        ))}
      </div>
    </section>
  );

  return (
    <div className={clsx("page", "public-home-page", styles.dashboard, !hasStudyState && styles.firstVisit)}>
      <header className={styles.intro}>
        <div>
          <p className={styles.eyebrow}>{hasStudyState ? "Study dashboard" : "Your learning library"}</p>
          <h1>{hasStudyState ? "Make room for what matters now." : "Choose what you want to learn."}</h1>
          <p className={styles.introCopy}>
            {hasStudyState
            ? "Every collection stays available. Your active spaces and their real activity stay close without hiding the rest of the library."
              : "Start with any library space. Mark it Studying now when you want it in your focused dashboard, or leave it available for later."}
          </p>
        </div>
        <div className={styles.libraryFacts} aria-label="Library totals">
          <span><strong>{totals.courses}</strong> collections</span>
          <span><strong>{totals.notes}</strong> notes</span>
        </div>
      </header>

      {!hasStudyState && subjectSpaces}

      {hasStudyState && <div className={styles.dashboardGrid}>
        <section className={clsx(styles.panel, styles.activePanel)} aria-labelledby="active-study-title">
          <div className={styles.panelHeading}>
            <div>
              <p className={styles.eyebrow}>Active study</p>
              <h2 id="active-study-title">What you need to do</h2>
              <p>Only spaces marked Studying now appear here. Activity comes from this device.</p>
            </div>
            <span className={styles.localLabel}><HardDrive size={15} aria-hidden="true" /> Device-local</span>
          </div>

          {focusCourses.length === 0 ? (
            <div className={styles.emptyState}>
              <span className={styles.emptyIcon}><Sparkles size={26} strokeWidth={1.6} aria-hidden="true" /></span>
              <div>
                <h3>Choose what deserves your attention.</h3>
                <p>No subject is marked Studying now. Set one below, or create a study plan when you want more structure.</p>
              </div>
              <div className={styles.emptyActions}>
                <a className={styles.primaryAction} href="#subject-spaces">Browse subject spaces <ArrowRight size={17} aria-hidden="true" /></a>
                <Link className={styles.secondaryAction} href="/settings"><Settings2 size={17} aria-hidden="true" /> Create a study plan</Link>
              </div>
            </div>
          ) : (
            <>
              {hasActivePlan && (
                <div className={styles.planSummary}>
                  <div>
                    <span>Active study plan</span>
                    <strong>{studyPlan.dailyMinutes} minutes · {studyPlan.studyDays.length} {studyPlan.studyDays.length === 1 ? "day" : "days"} each week</strong>
                  </div>
                  <span>{focusCourses.length} planned {focusCourses.length === 1 ? "space" : "spaces"}</span>
                  <Link href="/settings">Adjust plan <ArrowRight size={15} aria-hidden="true" /></Link>
                </div>
              )}
              <div className={styles.activeGrid}>
              {focusCourses.map((course) => {
                const activity = latestActivityForCourse(memory, course);
                return (
                  <article className={clsx(styles.activeCard, toneForCourse(course))} key={course.code}>
                    <div className={styles.activeCardHeader}>
                      <span className={styles.courseIcon}>{courseIcon(course)}</span>
                      <span className={styles.statusPill}><CircleDot size={14} aria-hidden="true" /> Studying now</span>
                    </div>
                    <div>
                      <p className={styles.courseCode}>{compactCode(course.code)}</p>
                      <h3>{course.name}</h3>
                    </div>
                    {activity ? (
                      <div className={styles.realActivity}>
                        <span><FileText size={17} aria-hidden="true" /></span>
                        <div>
                          <small>{activity.context}</small>
                          <strong>{activity.title}</strong>
                        </div>
                      </div>
                    ) : (
                      <p className={styles.noActivity}>No study activity has been recorded for this space on this device yet.</p>
                    )}
                    <Link prefetch={false} className={styles.cardAction} href={activity?.href ?? courseHref(course)}>
                      {activity ? "Continue from activity" : "Open subject"} <ArrowRight size={17} aria-hidden="true" />
                    </Link>
                  </article>
                );
              })}
              </div>
            </>
          )}
        </section>

        <aside className={styles.sideRail} aria-label="Dashboard context">
          <section className={clsx(styles.panel, styles.spaceSummary)} aria-labelledby="space-summary-title">
            <div className={styles.panelHeadingCompact}>
              <span className={styles.summaryIcon}><GraduationCap size={22} strokeWidth={1.6} aria-hidden="true" /></span>
              <div>
                <p className={styles.eyebrow}>Your spaces</p>
                <h2 id="space-summary-title">A clear, local study state</h2>
              </div>
            </div>
            <div className={styles.summaryMetrics}>
              <span><strong>{activeCourses.length}</strong><small>Studying now</small></span>
              <span><strong>{completedCount}</strong><small>Completed</small></span>
              <span><strong>{availableCount}</strong><small>Available</small></span>
            </div>
            <p className={styles.localNotice}><HardDrive size={15} aria-hidden="true" /> These choices are stored on this device until account sync is available.</p>
          </section>

          <section className={clsx(styles.panel, styles.researchCard)} aria-labelledby="research-feature-title">
            <div className={styles.researchLabel}><span>Research spotlight</span><FlaskConical size={21} strokeWidth={1.6} aria-hidden="true" /></div>
            <h2 id="research-feature-title">Can agent composition predict a professional VALORANT map?</h2>
            <p>Early results from 1,684 maps across regional and global VCT events, with team strength, patches, chronology and calibration kept in view.</p>
            <Link className={styles.cardAction} href="/notes/research-valorant-preliminary-findings-index">
              Read note <ArrowRight size={17} aria-hidden="true" />
            </Link>
          </section>
        </aside>
      </div>}

      {hasStudyState && subjectSpaces}
    </div>
  );
}

function SubjectSpaceCard({
  course,
  status,
  onStatusChange
}: {
  course: Course;
  status: StudySpaceStatus;
  onStatusChange: (status: StudySpaceStatus) => void;
}) {
  const headingId = `space-${course.code.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}`;
  return (
    <article
      className={clsx(
        styles.spaceCard,
        toneForCourse(course),
        status === "active" && styles.spaceCardActive,
        status === "completed" && styles.spaceCardCompleted
      )}
      aria-labelledby={headingId}
    >
      <div className={styles.spaceCardTop}>
        <span className={styles.courseIcon}>{courseIcon(course, 26)}</span>
        <span className={styles.statusPill}>
          {status === "completed" ? <CheckCircle2 size={14} aria-hidden="true" /> : <CircleDot size={14} aria-hidden="true" />}
          {statusLabels[status]}
        </span>
      </div>
      <div className={styles.spaceCardCopy}>
        <p className={styles.courseCode}>{compactCode(course.code)}</p>
        <h4 id={headingId}>{course.name}</h4>
        <p>{course.noteCount} {course.noteCount === 1 ? "note" : "notes"} · {course.level}</p>
      </div>
      <div className={styles.statusControl} role="group" aria-label={`Study status for ${course.name}`}>
        {studySpaceStatusOptions.map((option) => (
          <button
            aria-pressed={status === option.value}
            className={clsx(styles.statusButton, status === option.value && styles.statusButtonSelected)}
            key={option.value}
            onClick={() => onStatusChange(option.value)}
            type="button"
          >
            {option.label}
          </button>
        ))}
      </div>
      <Link className={styles.openSpace} href={courseHref(course)}>
        Open space <ArrowRight size={17} aria-hidden="true" />
      </Link>
    </article>
  );
}
