import { notFound } from "next/navigation";
import { DeepTutorChat } from "@/components/DeepTutorChat";
import { requireAuthSession } from "@/lib/auth-server";
import { getNote } from "@/lib/content";
import { hasDeepTutorAccess, type DeepTutorNoteContext } from "@/lib/deeptutor";
import { buildPageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";
export const metadata = buildPageMetadata({
  title: "DeepTutor chat",
  description: "My private AI tutor grounded in the MITEEE note library.",
  pathname: "/tutor",
  noIndex: true
});

type TutorPageProps = {
  searchParams: Promise<{ note?: string }>;
};

export default async function TutorPage({ searchParams }: TutorPageProps) {
  const { note: noteSlug } = await searchParams;
  const tutorPath = typeof noteSlug === "string"
    ? `/tutor?note=${encodeURIComponent(noteSlug)}`
    : "/tutor";
  const session = await requireAuthSession(`/login?next=${encodeURIComponent(tutorPath)}`);
  if (!hasDeepTutorAccess(session.user.email)) notFound();

  const note = typeof noteSlug === "string" ? getNote(noteSlug) : null;
  const noteContext: DeepTutorNoteContext | null = note ? {
    slug: note.slug,
    title: note.sidebarLabel || note.title,
    courseCode: note.courseCode,
    courseName: note.courseName,
    pathname: `/notes/${note.slug}`
  } : null;

  return <DeepTutorChat initialNote={noteContext} />;
}
