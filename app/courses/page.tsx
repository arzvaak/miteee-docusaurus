import { CourseCatalog } from "@/components/CourseCatalog";
import { JsonLd } from "@/components/JsonLd";
import { getAllCourses, getCatalog } from "@/lib/content";
import { buildBreadcrumbJsonLd, buildCourseListJsonLd, buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "MITEEE Course Library",
  description: "Find MITEEE courses by semester, exam readiness, and practice depth with notes, question banks, diagrams, and tutorials.",
  pathname: "/courses"
});

export default function CoursesPage() {
  const catalog = getCatalog();
  const courses = getAllCourses();

  return (
    <div className="page courses-page">
      <JsonLd
        data={[
          buildCourseListJsonLd(courses),
          buildBreadcrumbJsonLd([
            { name: "Home", pathname: "/" },
            { name: "Courses", pathname: "/courses" }
          ])
        ]}
      />
      <section className="course-page-header">
        <div>
          <p className="eyebrow">Library</p>
          <h1>Explore every subject.</h1>
          <p className="section-copy">Open something familiar or begin somewhere new. All {catalog.totals.courses} subjects and {catalog.totals.notes} notes stay available without prescribing a path.</p>
        </div>
      </section>
      <CourseCatalog courses={courses} />
    </div>
  );
}
