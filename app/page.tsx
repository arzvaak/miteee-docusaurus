import { StudyDashboard } from "@/components/StudyDashboard";
import { getAllCourses, getCatalog } from "@/lib/content";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "MITEEE - Notes, Subjects, Practice, and Revision",
  description: "Explore MIT EEE, CAT, SSC CGL, and UPSC notes, tutorials, formulas, question banks, practice, and revision paths.",
  pathname: "/"
});

export default function HomePage() {
  const catalog = getCatalog();
  const courses = getAllCourses();

  return <StudyDashboard totals={catalog.totals} courses={courses} />;
}
