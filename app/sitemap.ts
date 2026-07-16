import type { MetadataRoute } from "next";
import { getAllCourses, getNotesIndex } from "@/lib/content";
import { SITE_URL } from "@/lib/seo";
import { sscCglSubjectDefinitions, sscCglSubjectHref } from "@/lib/ssc-cgl-subjects";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: `${SITE_URL}/`, lastModified: now },
    { url: `${SITE_URL}/courses`, lastModified: now },
    { url: `${SITE_URL}/notes/research-valorant-preliminary-findings-index`, lastModified: now },
    ...getAllCourses().map((course) => ({ url: `${SITE_URL}/courses/${course.code}`, lastModified: now })),
    ...sscCglSubjectDefinitions.map((subject) => ({
      url: `${SITE_URL}${sscCglSubjectHref(subject.section)}`,
      lastModified: now
    })),
    ...getNotesIndex().map((note) => ({ url: `${SITE_URL}/notes/${note.slug}`, lastModified: now }))
  ];
}
