import { JsonLd } from "@/components/JsonLd";
import { SscCglLibraryLanding } from "@/components/SscCglLibraryLanding";
import { getCourseNavigationGroups } from "@/lib/content";
import { getSscCglDashboard, getSscTopics } from "@/lib/ssc-cgl";
import { sscCglSubjectDefinitions } from "@/lib/ssc-cgl-subjects";
import { buildBreadcrumbJsonLd, buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "SSC CGL Tier-I",
  description: "Study SSC CGL by subject, open focused topic lessons, and move into topic practice, section drills, or full tests.",
  pathname: "/exams/ssc-cgl"
});

export default function SscCglPage() {
  const dashboard = getSscCglDashboard();
  const canonicalNoteSlugs = new Set(
    sscCglSubjectDefinitions.flatMap((subject) =>
      getSscTopics()
        .filter((topic) => topic.section === subject.section)
        .map((topic) => `${subject.notePrefix}${topic.slug}`)
    )
  );
  const groups = getCourseNavigationGroups("SSC-CGL").map((group) => ({
    ...group,
    notes: group.notes.filter((note) => canonicalNoteSlugs.has(note.slug))
  }));

  return (
    <>
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: "Home", pathname: "/" },
          { name: "Exams", pathname: "/exams" },
          { name: "SSC CGL", pathname: "/exams/ssc-cgl" }
        ])}
      />
      <SscCglLibraryLanding
        groups={groups}
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
