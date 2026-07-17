import type { MetadataRoute } from "next";
import { getAllCourses, getNotesIndex } from "@/lib/content";
import { SITE_URL } from "@/lib/seo";
import { getSscTopics } from "@/lib/ssc-cgl";
import { sscCglSubjectDefinitions, sscCglSubjectHref } from "@/lib/ssc-cgl-subjects";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const sscTopicNoteSlugs = new Set(
    sscCglSubjectDefinitions.flatMap((subject) =>
      getSscTopics()
        .filter((topic) => topic.section === subject.section)
        .map((topic) => `${subject.notePrefix}${topic.slug}`)
    )
  );
  return [
    { url: `${SITE_URL}/`, lastModified: now },
    { url: `${SITE_URL}/courses`, lastModified: now },
    { url: `${SITE_URL}/exams`, lastModified: now },
    { url: `${SITE_URL}/exams/ssc-cgl`, lastModified: now },
    { url: `${SITE_URL}/notes/research-valorant-preliminary-findings-index`, lastModified: now },
    ...getAllCourses()
      .filter((course) => !["SSC-CGL", "MITEEE", "SUPERPOWERS"].includes(course.code))
      .map((course) => ({ url: `${SITE_URL}/courses/${course.code}`, lastModified: now })),
    ...sscCglSubjectDefinitions.map((subject) => ({
      url: `${SITE_URL}${sscCglSubjectHref(subject.section)}`,
      lastModified: now
    })),
    ...getSscTopics().map((topic) => ({
      url: `${SITE_URL}/exams/ssc-cgl/topics/${topic.slug}`,
      lastModified: now
    })),
    ...getNotesIndex()
      .filter((note) => !sscTopicNoteSlugs.has(note.slug))
      .map((note) => ({ url: `${SITE_URL}/notes/${note.slug}`, lastModified: now }))
  ];
}
