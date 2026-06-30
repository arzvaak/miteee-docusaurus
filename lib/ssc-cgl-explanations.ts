export type SscExplanationBlockType = "answer" | "method" | "why" | "trap" | "source" | "general";

export type SscExplanationBlock = {
  type: SscExplanationBlockType;
  label: string;
  body: string;
};

const fallbackExplanation = "No separate explanation is attached yet. Use the keyed answer and source line to review the exact item.";

const labelTypes: Record<string, SscExplanationBlockType> = {
  "Correct answer": "answer",
  Method: "method",
  "Why it fits": "why",
  "Trap to avoid": "trap",
  "Source cue": "source"
};

const knownLabelPattern = /(Correct answer|Method|Why it fits|Trap to avoid|Source cue):/gi;

function cleanBody(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

export function parseSscExplanationBlocks(explanation: string): SscExplanationBlock[] {
  const normalized = cleanBody(explanation);
  if (!normalized) {
    return [{ type: "general", label: "Explanation", body: fallbackExplanation }];
  }

  const matches = [...normalized.matchAll(knownLabelPattern)];
  if (matches.length === 0) {
    return [{ type: "general", label: "Explanation", body: normalized }];
  }

  return matches.map((match, index) => {
    const rawLabel = match[1] ?? "Explanation";
    const label = Object.keys(labelTypes).find((item) => item.toLowerCase() === rawLabel.toLowerCase()) ?? rawLabel;
    const bodyStart = match.index! + match[0].length;
    const bodyEnd = matches[index + 1]?.index ?? normalized.length;
    const body = cleanBody(normalized.slice(bodyStart, bodyEnd));

    return {
      type: labelTypes[label] ?? "general",
      label,
      body: body || fallbackExplanation
    };
  });
}
