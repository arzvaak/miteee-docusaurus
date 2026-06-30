function quoteLabel(label: string) {
  const trimmed = label.trim();
  if (!trimmed || trimmed.startsWith("\"")) return label;
  return `"${label.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
}

function quoteFlowchartLabels(line: string) {
  return line
    .replace(/\b([A-Za-z][\w-]*)\[([^\]\n]+)\]/g, (_match, nodeId: string, label: string) => `${nodeId}[${quoteLabel(label)}]`)
    .replace(/\b([A-Za-z][\w-]*)\{([^}\n]+)\}/g, (_match, nodeId: string, label: string) => `${nodeId}{${quoteLabel(label)}}`);
}

function splitCombinedEdge(line: string) {
  const combined = line.match(/^(\s*)([A-Za-z][\w-]*)\s*&\s*([A-Za-z][\w-]*)\s*((?:-->|---|==>|-.->)[\s\S]+)$/);
  if (!combined) return [line];

  const indent = combined[1] ?? "";
  const firstNode = combined[2] ?? "";
  const secondNode = combined[3] ?? "";
  const edge = combined[4] ?? "";
  return [`${indent}${firstNode} ${edge}`, `${indent}${secondNode} ${edge}`];
}

export function normalizeMermaidSource(source: string) {
  const lines = source.replace(/\r\n?/g, "\n").split("\n");

  while (lines.length > 0 && lines[0]?.trim() === "") lines.shift();
  while (lines.length > 0 && /^(?:text|mermaid)$/i.test(lines[0]?.trim() ?? "")) lines.shift();
  while (lines.length > 0 && lines.at(-1)?.trim() === "") lines.pop();

  return lines
    .flatMap(splitCombinedEdge)
    .map(quoteFlowchartLabels)
    .join("\n");
}
