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

export function buildFormulaReaderSignal(stats: NoteStats): FormulaReaderSignal | null {
  if (stats.mathBlocks <= 0) return null;

  if (stats.mathBlocks >= 1000 && stats.questionBlocks >= 20) {
    return {
      tone: "pyq-formula",
      title: "Formula and question practice",
      summary: "Choose a small set of formulas and questions to practise instead of trying to finish the whole page at once.",
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
      title: "Formula practice",
      summary: "Choose a few important formulas from this page and check that you know what they mean and when to use them.",
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
    summary: "Pause before each equation and check whether you can explain what it means and when it applies.",
    steps: [
      "Cover the next equation and say what it should express.",
      "Name every symbol before reading the explanation.",
      "Turn one miss into a corrected rule."
    ]
  };
}
