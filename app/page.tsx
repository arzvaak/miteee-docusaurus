import { StudyDashboard } from "@/components/StudyDashboard";
import { getCatalog, getFeaturedCourses, getNotesIndex, getPreviewCandidates } from "@/lib/content";
import { buildPageMetadata } from "@/lib/seo";
import { buildStudyTodayPlan } from "@/lib/study-system";

export const metadata = buildPageMetadata({
  title: "MITEEE Personal Study Desk - Notes, UPSC CSE, and Revision",
  description: "Search MIT EEE and UPSC CSE notes, tutorials, diagrams, question banks, learner memory, and revision paths from the local study vault.",
  pathname: "/"
});

export default function HomePage() {
  const catalog = getCatalog();
  const courses = getFeaturedCourses();
  const notes = getPreviewCandidates(28);
  const studyPlan = buildStudyTodayPlan(getNotesIndex(), catalog.courses);

  return <StudyDashboard totals={catalog.totals} courses={courses} notes={notes} studyPlan={studyPlan} />;
}
