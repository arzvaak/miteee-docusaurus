import { notFound, redirect } from "next/navigation";
import { sscCglSubjectDefinitions, sscCglSubjectHref } from "@/lib/ssc-cgl-subjects";

type LegacySscSubjectPageProps = {
  params: Promise<{ code: string; section: string }>;
};

export function generateStaticParams() {
  return sscCglSubjectDefinitions.map((subject) => ({
    code: "SSC-CGL",
    section: subject.section
  }));
}

export default async function LegacySscSubjectPage({ params }: LegacySscSubjectPageProps) {
  const { code, section } = await params;
  if (code.toUpperCase() !== "SSC-CGL") notFound();

  const subject = sscCglSubjectDefinitions.find((item) => item.section === section);
  if (!subject) notFound();
  redirect(sscCglSubjectHref(subject.section));
}
