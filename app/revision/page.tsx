import { RevisionDashboard } from "@/components/RevisionDashboard";
import { getPreviewCandidates } from "@/lib/content";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "Revision Queue - MITEEE Study",
  description: "Track local reading progress, mistakes, and due recall cards for MITEEE and UPSC CSE study.",
  pathname: "/revision"
});

export default function RevisionPage() {
  return <RevisionDashboard suggestions={getPreviewCandidates(18)} />;
}
