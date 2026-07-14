import { StudySettings } from "@/components/StudySettings";
import { getAllCourses } from "@/lib/content";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "Study Settings",
  description: "Manage your MITEEE account, active subjects, and device-only study plan.",
  pathname: "/settings"
});

export default function SettingsPage() {
  return <StudySettings courses={getAllCourses()} />;
}
