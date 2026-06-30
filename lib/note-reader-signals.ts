type NoteStats = {
  codeBlocks: number;
  details: number;
  mathBlocks: number;
  mermaidBlocks: number;
  questionBlocks: number;
};

export type FormulaReaderSignal = {
  tone: "formula" | "pyq-formula";
  title: string;
  summary: string;
  steps: string[];
};

const numberFormatter = new Intl.NumberFormat("en-IN");

function formatNumber(value: number) {
  return numberFormatter.format(value);
}

export function buildFormulaReaderSignal(stats: NoteStats): FormulaReaderSignal | null {
  if (stats.mathBlocks <= 0) return null;

  if (stats.mathBlocks >= 1000 && stats.questionBlocks >= 20) {
    return {
      tone: "pyq-formula",
      title: "PYQ formula bank",
      summary: `${formatNumber(stats.mathBlocks)} math blocks and ${formatNumber(stats.questionBlocks)} question sections. Sample, solve, then repair instead of scrolling the whole bank.`,
      steps: [
        "Pick five formulas before reading and write what each symbol means.",
        "Solve one nearby question closed-book, then check the worked line.",
        "Log the exact rule or conversion that broke the attempt."
      ]
    };
  }

  if (stats.mathBlocks >= 8) {
    return {
      tone: "formula",
      title: "Derivation rebuild",
      summary: `${formatNumber(stats.mathBlocks)} math blocks. Treat this page as active reconstruction, not rereading.`,
      steps: [
        "Choose three equations and write the symbols and conditions from memory.",
        "Rebuild one derivation step-by-step before opening the surrounding text.",
        "If a step slips, log the exact rule as a tomorrow catch question."
      ]
    };
  }

  return {
    tone: "formula",
    title: "Formula check",
    summary: `${formatNumber(stats.mathBlocks)} math ${stats.mathBlocks === 1 ? "block" : "blocks"}. Pause before the equation and predict the missing condition.`,
    steps: [
      "Cover the next equation and say what it should express.",
      "Name every symbol before reading the explanation.",
      "Turn one miss into a corrected rule."
    ]
  };
}
