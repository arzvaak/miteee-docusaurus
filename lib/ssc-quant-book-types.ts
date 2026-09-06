export type SscQuantBookStimulus =
  | { type: "table"; headers: string[]; rows: string[][]; caption?: string }
  | { type: "image"; src: string; alt: string; caption?: string }
  | { type: "chart"; kind?: "bar" | "line" | "pie"; labels: string[]; values: number[]; ariaLabel: string; caption?: string }
  | { type: "diagram"; nodes: Array<{ id: string; label: string; x: number; y: number }>; edges: Array<{ from: string; to: string; label?: string }>; ariaLabel: string; caption?: string };

export type SscQuantBookSection = { id: string; title: string; content: string; pdfPageStart?: number; pdfPageEnd?: number; stimulus?: SscQuantBookStimulus };
export type SscQuantBookOption = { id: string; text: string };
export type SscQuantWorkedExample = { id: string; title: string; prompt: string; steps: string[]; answer: string; solution: string; pdfPageStart?: number; pdfPageEnd?: number; provenance?: { sourceId?: string; pdfPages?: number[] }; options?: SscQuantBookOption[]; correctOption?: string; stimulus?: SscQuantBookStimulus };
export type SscQuantBookExercise = { id: string; prompt: string; options?: SscQuantBookOption[]; correctOption?: string; answer?: string; solution?: string; explanation?: string; pdfPageStart?: number; pdfPageEnd?: number; provenance?: { sourceId?: string; pdfPages?: number[] }; stimulus?: SscQuantBookStimulus };
export type SscQuantReadingSection = SscQuantBookSection & { kind: "concept" | "example" | "exercise" | "answers" };
export type SscQuantBookChapter = { readingSections?: SscQuantReadingSection[]; slug: string; title: string; chapterNumber: number; pdfPageStart: number; pdfPageEnd: number; sections: SscQuantBookSection[]; examples: SscQuantWorkedExample[]; exercises: SscQuantBookExercise[] };
export type SscQuantBook = { generatedAt?: string; sourceTitle?: string; chapters: SscQuantBookChapter[] };
