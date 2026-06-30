import { BookOpen, ListChecks, Sigma } from "lucide-react";
import { CourseCatalog } from "@/components/CourseCatalog";
import { JsonLd } from "@/components/JsonLd";
import { formatNumber, getAllCourses, getCatalog } from "@/lib/content";
import { buildBreadcrumbJsonLd, buildCourseListJsonLd, buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "MITEEE Course Library",
  description: "Find MITEEE courses by semester, exam readiness, and practice depth with notes, question banks, diagrams, and tutorials.",
  pathname: "/courses"
});

export default function CoursesPage() {
  const catalog = getCatalog();
  const courses = getAllCourses();
  const practiceTotal = catalog.totals.questions + (catalog.totals.practicePrompts ?? 0);

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
          <p className="eyebrow">Course library</p>
          <h1>All courses</h1>
          <p className="section-copy">Pick a guided lane, then open the course with the right mix of reading, high-yield review, and practice.</p>
        </div>
        <div className="stats-grid">
          <Stat icon={<BookOpen size={17} aria-hidden="true" />} label="Courses" value={formatNumber(catalog.totals.courses)} />
          <Stat icon={<BookOpen size={17} aria-hidden="true" />} label="Notes" value={formatNumber(catalog.totals.notes)} />
          <Stat icon={<ListChecks size={17} aria-hidden="true" />} label="Practice" value={formatNumber(practiceTotal)} />
          <Stat icon={<Sigma size={17} aria-hidden="true" />} label="Math notes" value={formatNumber(catalog.totals.mathNotes)} />
        </div>
      </section>
      <CourseCatalog courses={courses} />
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
