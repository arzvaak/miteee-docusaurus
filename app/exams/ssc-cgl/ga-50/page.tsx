import { Section50Cockpit } from "@/app/exams/ssc-cgl/Section50Cockpit";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "SSC CGL GA 50/50 Cockpit",
  description: "A General Awareness practice cockpit for SSC CGL Tier-I 50/50 scoring.",
  pathname: "/exams/ssc-cgl/ga-50"
});

export default function SscCglGa50Page() {
  return (
    <Section50Cockpit
      section="general-awareness"
      eyebrow="General Awareness"
      heading="GA 50/50 cockpit."
      lede="The GA target is fast recall with static anchors: 25 questions, 50 marks, and no vague familiarity guesses."
      speedTitle="Run the 25-question GA sprint"
      speedBody="Answer from recall first. If the fact is not anchored, mark it for static repair instead of guessing by vibe."
      repairTopicSlug="current-affairs-static-gk"
      repairBody="Open the misses queue, connect each missed fact to a static anchor, and write one memory hook."
      depthBody="Work the highest-volume GA queue first, then rotate polity, science, history, geography, economics, and current affairs."
      accent="ga"
    />
  );
}
