import { CourseCatalog } from "@/components/CourseCatalog";
import { JsonLd } from "@/components/JsonLd";
import { getAllCourses, getCatalog } from "@/lib/content";
import { buildBreadcrumbJsonLd, buildCourseListJsonLd, buildPageMetadata } from "@/lib/seo";
import { BookOpen, Layers3, ListChecks } from "lucide-react";
import styles from "./CoursesPage.module.css";

export const metadata = buildPageMetadata({
  title: "MITEEE Course Library",
  description: "Find MITEEE courses by semester, exam readiness, and practice depth with notes, question banks, diagrams, and tutorials.",
  pathname: "/courses"
});

export default function CoursesPage() {
  const catalog = getCatalog();
  const courses = getAllCourses();
  const practiceTotal = courses.reduce((total, course) => total + course.questionCount + (course.practicePromptCount ?? 0), 0);
  const runnableTotal = courses.reduce((total, course) => total + course.runnableNoteCount, 0);

  return (
    <div className={`${styles.page} page courses-page`} data-shell-full-bleed="true">
      <JsonLd
        data={[
          buildCourseListJsonLd(courses),
          buildBreadcrumbJsonLd([
            { name: "Home", pathname: "/" },
            { name: "Courses", pathname: "/courses" }
          ])
        ]}
      />
      <section className={`${styles.masthead} course-page-header`}>
        <div className={styles.mastheadCopy}>
          <p className="eyebrow">Subject library</p>
          <h1>Choose a subject, then go deep.</h1>
          <p className="section-copy">Every exam system, engineering course, research space, and study vault stays open—now arranged for scanning instead of scrolling.</p>
        </div>
        <div className={styles.libraryFacts} aria-label="Library totals">
          <span><BookOpen size={17} aria-hidden="true" /><strong>{catalog.totals.courses}</strong><small>subject spaces</small></span>
          <span><Layers3 size={17} aria-hidden="true" /><strong>{catalog.totals.notes}</strong><small>indexed notes</small></span>
          <span><ListChecks size={17} aria-hidden="true" /><strong>{practiceTotal}</strong><small>practice items</small></span>
          <span><BookOpen size={17} aria-hidden="true" /><strong>{runnableTotal}</strong><small>runnable notes</small></span>
        </div>
      </section>
      <CourseCatalog courses={courses} />
    </div>
  );
}
