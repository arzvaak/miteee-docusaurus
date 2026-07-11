import { StudyDashboard } from "@/components/StudyDashboard";
import { getAllCourses, getCatalog, getPreviewCandidates } from "@/lib/content";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "MITEEE Study - Notes, Subjects, Practice, and Revision",
  description: "Explore MIT EEE, SSC CGL, and UPSC notes, tutorials, formulas, question banks, practice, and revision paths.",
  pathname: "/"
});

export default function HomePage() {
  const catalog = getCatalog();
  const courses = getAllCourses();
  const notes = getPreviewCandidates(28);

  return <StudyDashboard totals={catalog.totals} courses={courses} notes={notes} />;
}
