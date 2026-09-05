import { permanentRedirect } from "next/navigation";

export default async function SscCglTopicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  permanentRedirect(`/exams/ssc-cgl/practice/${slug}`);
}
