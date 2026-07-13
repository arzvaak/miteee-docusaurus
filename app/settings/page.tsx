import { StudySettings } from "@/components/StudySettings";
import { getAllCourses } from "@/lib/content";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "Study Settings",
  description: "Choose active subjects and shape a device-only study plan for MITEEE Study.",
  pathname: "/settings"
});

export default function SettingsPage() {
  return <StudySettings courses={getAllCourses()} />;
}
