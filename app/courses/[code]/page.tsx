import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight, BookOpen, FileText, ListChecks, Sigma } from "lucide-react";
import { CourseOutline } from "@/components/CourseOutline";
import { CoursePracticeSection } from "@/components/CoursePracticeSection";
import { CourseResumePanel } from "@/components/CourseResumePanel";
import { JsonLd } from "@/components/JsonLd";
import { SscCglLibraryLanding } from "@/components/SscCglLibraryLanding";
import { UpscActiveRecallSection } from "@/components/UpscActiveRecallSection";
import { courseDisplaySummary, formatNumber, getAllCourses, getCourse, getCourseNavigationGroups, getCourseNotes } from "@/lib/content";
import { buildCoursePracticeDrills } from "@/lib/course-practice";
import { buildBreadcrumbJsonLd, buildCourseJsonLd, buildPageMetadata, courseDescription } from "@/lib/seo";
import { getSscCglDashboard } from "@/lib/ssc-cgl";
import { buildUpscActiveRecallDrills } from "@/lib/upsc-active-recall";

type CoursePageProps = {
  params: Promise<{ code: string }>;
};

export function generateStaticParams() {
  return getAllCourses().map((course) => ({ code: course.code }));
}

export async function generateMetadata({ params }: CoursePageProps) {
  const { code } = await params;
  const course = getCourse(code);
  if (!course) return {};
  return buildPageMetadata({
    title: `${course.name} (${course.code})`,
    description: courseDescription(course),
    pathname: `/courses/${course.code}`
  });
}

export default async function CoursePage({ params }: CoursePageProps) {
  const { code } = await params;
  const course = getCourse(code);
  if (!course) notFound();
  const notes = getCourseNotes(course.code);
  const courseGroups = getCourseNavigationGroups(course.code);
  const structuredData = [
    buildCourseJsonLd(course),
    buildBreadcrumbJsonLd([
      { name: "Home", pathname: "/" },
      { name: "Courses", pathname: "/courses" },
      { name: course.code, pathname: `/courses/${course.code}` }
    ])
  ];

  if (course.code === "SSC-CGL") {
    const dashboard = getSscCglDashboard();
    return (
      <>
        <JsonLd data={structuredData} />
        <SscCglLibraryLanding
          groups={courseGroups}
          corpus={{
            reviewedQuestions: dashboard.readiness.reviewedQuestions,
            fullMocks: dashboard.readiness.fullMocks,
            sections: dashboard.readiness.sectionReadiness.map((section) => ({
              section: section.section,
              title: section.title,
              reviewedQuestions: section.reviewedQuestions,
              bookBackedQuestions: section.bookBackedQuestions,
              drillHref: section.drillHref
            }))
          }}
        />
      </>
    );
  }

  const upscDrills = course.code === "UPSC-CSE-POLITICAL-SCIENCE" ? buildUpscActiveRecallDrills(notes, 4) : [];
  const coursePracticeDrills = course.code === "UPSC-CSE-POLITICAL-SCIENCE" ? [] : buildCoursePracticeDrills(course, notes, 3);
  const activePracticeCount = course.questionCount + (course.practicePromptCount ?? 0);
  const activePracticeLabel = (course.practicePromptCount ?? 0) > 0 ? "Practice" : "Questions";

  return (
    <div className="page course-detail-page">
      <JsonLd
        data={structuredData}
      />
      <section className="course-page-header">
        <div className="course-header-copy">
          <p className="eyebrow">{course.level}</p>
          <h1>{course.name}</h1>
          <p className="section-copy">{courseDisplaySummary(course)}</p>
          <div className="course-header-actions" aria-label="Course shortcuts">
            <a className="button primary" href="#course-resume">Resume <ArrowRight size={14} aria-hidden="true" /></a>
            <a className="button ghost" href="#course-map">Course map</a>
            <a className="button ghost" href={upscDrills.length > 0 || coursePracticeDrills.length > 0 ? "#course-practice" : "#course-map"}>Practice</a>
            <Link className="button ghost" href="/courses">All courses</Link>
          </div>
        </div>
        <details className="course-detail-metrics">
          <summary>Course numbers</summary>
          <div className="stats-grid">
            <Stat icon={<BookOpen size={17} aria-hidden="true" />} label="Notes" value={formatNumber(course.noteCount)} />
            <Stat icon={<ListChecks size={17} aria-hidden="true" />} label={activePracticeLabel} value={formatNumber(activePracticeCount)} />
            <Stat icon={<Sigma size={17} aria-hidden="true" />} label="Math" value={formatNumber(notes.filter((note) => note.stats.mathBlocks > 0).length)} />
            <Stat icon={<FileText size={17} aria-hidden="true" />} label="Code" value={formatNumber(course.runnableNoteCount)} />
          </div>
        </details>
      </section>

      <div id="course-resume">
        <CourseResumePanel courseCode={course.code} courseName={course.name} />
      </div>
      <CourseOutline groups={courseGroups} courseName={course.name} courseCode={course.code} />

      <div id="course-practice" className="course-practice-anchor">
        {upscDrills.length > 0 && <UpscActiveRecallSection drills={upscDrills} />}
        {coursePracticeDrills.length > 0 && <CoursePracticeSection courseName={course.name} drills={coursePracticeDrills} />}
      </div>
    </div>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="stat-card">
      <p className="stat-label">{icon}{label}</p>
      <div className="stat-value">{value}</div>
    </div>
  );
}
