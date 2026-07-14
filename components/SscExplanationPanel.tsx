import { parseSscExplanationBlocks } from "@/lib/ssc-cgl-explanations";
import { MathText } from "@/components/MathText";

export function SscExplanationPanel({
  explanation,
  className = ""
}: {
  explanation: string;
  className?: string;
}) {
  const blocks = parseSscExplanationBlocks(explanation);

  return (
    <div className={["ssc-explanation-panel", className].filter(Boolean).join(" ")}>
      <small>Explanation</small>
      <div className="ssc-explanation-blocks">
        {blocks.map((block) => (
          <section className={`ssc-explanation-block type-${block.type}`} key={`${block.type}-${block.label}`}>
            <strong>{block.label}</strong>
            <p><MathText text={block.body} /></p>
          </section>
        ))}
      </div>
    </div>
  );
}
