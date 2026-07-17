import { CourseCatalog } from "@/components/CourseCatalog";
import { JsonLd } from "@/components/JsonLd";
import { getAllCourses } from "@/lib/content";
import { buildBreadcrumbJsonLd, buildCourseListJsonLd, buildPageMetadata } from "@/lib/seo";
import { BookOpen, Layers3, ListChecks } from "lucide-react";
import styles from "./CoursesPage.module.css";

export const metadata = buildPageMetadata({
  title: "MIT EEE Subjects",
  description: "Choose an academic subject or research collection. Competitive-exam preparation lives in the separate Exams area.",
  pathname: "/courses"
});

export default function CoursesPage() {
  const courses = getAllCourses().filter((course) => !["SSC-CGL", "MITEEE", "SUPERPOWERS"].includes(course.code));
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
          <p className="eyebrow">Academic subjects</p>
          <h1>Choose a subject, then go deep.</h1>
          <p className="section-copy">MIT EEE subjects and research collections live here. Competitive exams have their own structure under Exams.</p>
        </div>
        <div className={styles.libraryFacts} aria-label="Library totals">
          <span><BookOpen size={17} aria-hidden="true" /><strong>{courses.length}</strong><small>subjects</small></span>
          <span><Layers3 size={17} aria-hidden="true" /><strong>{courses.reduce((total, course) => total + course.noteCount, 0)}</strong><small>indexed notes</small></span>
          <span><ListChecks size={17} aria-hidden="true" /><strong>{practiceTotal}</strong><small>practice items</small></span>
          <span><BookOpen size={17} aria-hidden="true" /><strong>{runnableTotal}</strong><small>runnable notes</small></span>
        </div>
      </section>
      <CourseCatalog courses={courses} />
    </div>
  );
}
