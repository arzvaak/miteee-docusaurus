import { permanentRedirect } from "next/navigation";

const reportSlug = "research-valorant-preliminary-findings-index";

export default function LegacyValorantPreliminaryFindingsPage() {
  permanentRedirect(`/notes/${reportSlug}`);
}
