import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";
import test from "node:test";
import { buildExamData } from "@/scripts/build-exam-data";
import { getSscCglBookQuestionsPath } from "@/lib/ssc-cgl-corpus-paths";

const root = process.cwd();
const scriptPath = path.join(root, "scripts", "ssc_cgl_promote_agent_reviewed.py");

type MinimalBookQuestion = {
  section?: string;
  topic?: string;
  stem?: string;
  options?: Array<{ text?: string }>;
  correctOption?: string;
};

function writeJson(filePath: string, value: unknown) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(value, null, 2) + "\n", "utf8");
}

function normalizedMcqBody(value: string) {
  return value.toLowerCase().replace(/\s+/g, " ").trim();
}

function uniqueMcqBodyCount(questions: MinimalBookQuestion[]) {
  const bodies = new Set<string>();

  for (const question of questions) {
    bodies.add([
      question.section ?? "",
      question.topic ?? "",
      normalizedMcqBody(question.stem ?? ""),
      ...(question.options ?? []).map((option) => normalizedMcqBody(option.text ?? ""))
    ].join("\u0001"));
  }

  return bodies.size;
}

function inferTopic(section: string, text: string): string {
  const output = execFileSync("python", [
    "-c",
    [
      "import importlib.util, json, sys",
      `spec = importlib.util.spec_from_file_location("promotion", ${JSON.stringify(scriptPath)})`,
      "module = importlib.util.module_from_spec(spec)",
      "sys.modules[spec.name] = module",
      "spec.loader.exec_module(module)",
      `print(module.topic_from_text(${JSON.stringify(section)}, module.normalize_text(${JSON.stringify(text)})))`
    ].join("; ")
  ], { cwd: root, encoding: "utf8" });
  return output.trim();
}

test("SSC CGL trusted book topic inference splits common SSC English, GA, and Quant cues", () => {
  assert.equal(
    inferTopic("english-comprehension", "The workers demand higher wages for a long time. (a) have been demanding higher wages (b) demanded higher wages (c) No improvement"),
    "sentence-improvement"
  );
  assert.equal(
    inferTopic("english-comprehension", "Everyone except she have travelled by air. Options include No error."),
    "grammar-error-spotting"
  );
  assert.equal(
    inferTopic("english-comprehension", "Select the correctly spelt word: exhibit, exhail, exheract, exhoust"),
    "spelling-one-word"
  );
  assert.equal(
    inferTopic("general-awareness", "Bharatanatyam traces its origins to the Natyashastra and includes Bhav, Rag and Tala."),
    "art-culture"
  );
  assert.equal(
    inferTopic("quantitative-aptitude", "In triangle ABC, right-angled at C, if sin A = 3/5, then cos B = ?"),
    "trigonometry"
  );
  assert.equal(
    inferTopic("quantitative-aptitude", "A commodity has cost price Rs. 400 and selling price Rs. 500. Find the profit percentage."),
    "profit-loss-discount"
  );
});

test("SSC CGL trusted book topic inference keeps high-volume book topics out of fallback buckets", () => {
  assert.equal(
    inferTopic("english-comprehension", "Around sixty bands in colourful _______ took part in the carnival. (a) clothings (b) costumes (c) apparels (d) dressing"),
    "fill-in-the-blanks"
  );
  assert.equal(
    inferTopic("english-comprehension", "Select the word which is nearest in meaning to ABUNDANT."),
    "synonyms-antonyms"
  );
  assert.equal(
    inferTopic("general-awareness", "Who among the following was the first Chief Election Commissioner of India?"),
    "indian-polity-basics"
  );
  assert.equal(
    inferTopic("general-awareness", "Which phenomenon is opposite to solidification in basic science?"),
    "science-everyday"
  );
  assert.equal(
    inferTopic("general-awareness", "In Microsoft Excel, which chart type is best suited for comparing proportions or percentages of a whole?"),
    "computer-awareness"
  );
  assert.equal(
    inferTopic("general-awareness", "Gugga is the famous ritualistic dance performed in the procession taken out in memory of Gugga Pir."),
    "art-culture"
  );
  assert.equal(
    inferTopic("reasoning", "Select the option figure that is embedded in the given figure after rotating the cube/dice."),
    "non-verbal-reasoning"
  );
  assert.equal(
    inferTopic("quantitative-aptitude", "Find the value of 375.25 + 42.08 - 19.6 x 3."),
    "calculation-speed"
  );
  assert.equal(
    inferTopic("quantitative-aptitude", "Work and Time: A and B can complete a work in 12 days and 18 days respectively. How many days will they take together?"),
    "time-work-pipes"
  );
  assert.equal(
    inferTopic("quantitative-aptitude", "Data Interpretation: Table - Daily wages of 5 workers over 4 days. What is the average daily earning of Worker C?"),
    "data-interpretation"
  );
  assert.equal(
    inferTopic("quantitative-aptitude", "If A and B are events with P(A) = 3/8, P(B) = 1/2 and P(A intersection B) = 1/4, find P(not A and not B)."),
    "probability"
  );
});

test("SSC CGL trusted book topic inference separates reasoning syllogism and seating cues", () => {
  assert.equal(
    inferTopic("reasoning", "What was the day of the week on 29 June 2010?"),
    "calendar-clock"
  );
  assert.equal(
    inferTopic("reasoning", "Arrange the activities in a logical order: setting up alarm clock, solving question paper, reaching examination centre."),
    "analogy-classification"
  );
  assert.equal(
    inferTopic("reasoning", "Select the option in which the words share the same relationship as Clock : Time."),
    "analogy-classification"
  );
  assert.equal(
    inferTopic("reasoning", "Select the word pair that has the same relationship as Distance : Kilometres."),
    "analogy-classification"
  );
  assert.equal(
    inferTopic("reasoning", "In a certain code language, RIGHT is written as 98653 and CLERK is written as 04297. What is the code for GREET?"),
    "series-coding"
  );
  assert.equal(
    inferTopic("reasoning", "If EAST is coded as 180 and NORTH is coded as 375, then how will SOUTH be coded?"),
    "series-coding"
  );
  assert.equal(
    inferTopic("reasoning", "Three different positions of the same dice are shown. Find the number on the face opposite to 1."),
    "non-verbal-reasoning"
  );
  assert.equal(
    inferTopic("reasoning", "Six laptops are placed in a row facing towards the north. N is placed to the immediate left of A."),
    "seating-arrangement"
  );
  assert.equal(
    inferTopic("reasoning", "A + B means A is the mother of B and A - B means A is the brother of B. How is P related to R?"),
    "blood-relation"
  );
  assert.equal(
    inferTopic("reasoning", "Statements: Some plants are trees. All trees are bushes. Conclusions: I. Some bushes are plants. II. All bushes are plants."),
    "syllogism-venn"
  );
  assert.equal(
    inferTopic("reasoning", "Select the option related to the third letter-cluster in the same way. GROW : IMRZ :: CROW : ?"),
    "series-coding"
  );
  assert.equal(
    inferTopic("reasoning", "Five books B, G, N, P and T are kept one above the other. Only one book is kept between N and G. Which book is on top?"),
    "seating-arrangement"
  );
});

test("SSC CGL trusted book promotion uses option text for English question-type tags", () => {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "ssc-cgl-english-option-topic-"));
  const dataDir = path.join(tempRoot, "ssc-cgl");
  const sourceId = "pinnacle-ssc-english";

  writeJson(path.join(dataDir, "aligned-mistral", sourceId, "range-a", "aligned-candidates.json"), [
    {
      id: "english-p001-q1",
      sourceId,
      sourceType: "book_user_provided",
      pageNumber: 1,
      questionNumber: "1",
      stem: "The workers of this textile factory demand higher wages for a long time.",
      options: [
        { id: "a", text: "have been demanding higher wages" },
        { id: "b", text: "demanded higher wages" },
        { id: "c", text: "No improvement" },
        { id: "d", text: "has demanded higher wages" }
      ],
      correctOption: "a",
      alignmentStatus: "matched",
      reviewStatus: "needs_topic_duplicate_review",
      answerEvidence: {
        sourceType: "mistral_ocr_solution_marker",
        questionNumber: "1",
        correctOption: "a",
        pageNumber: 2,
        evidenceText: "Sol.1.(a) have been demanding higher wages"
      },
      provenance: { sourceId, sourceType: "book_user_provided", pageNumber: 1 }
    }
  ]);

  execFileSync("python", [
    scriptPath,
    "--data-dir",
    dataDir,
    "--output-root",
    path.join(dataDir, "book-imports"),
    "--source-type",
    "book_user_provided",
    "--trust-book-format-dedupe"
  ], { cwd: root, stdio: "pipe" });

  const promoted = JSON.parse(fs.readFileSync(path.join(dataDir, "book-imports", "questions.json"), "utf8")) as Array<{
    topic: string;
    subtopic: string;
  }>;

  assert.equal(promoted.length, 1);
  assert.equal(promoted[0]?.topic, "sentence-improvement");
});

test("SSC CGL trusted book promotion classifies English sentence-fragment options as grammar error spotting", () => {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "ssc-cgl-english-error-topic-"));
  const dataDir = path.join(tempRoot, "ssc-cgl");
  const sourceId = "pinnacle-ssc-english";

  writeJson(path.join(dataDir, "aligned-mistral", sourceId, "range-a", "aligned-candidates.json"), [
    {
      id: "english-p001-q2",
      sourceId,
      sourceType: "book_user_provided",
      pageNumber: 1,
      questionNumber: "2",
      stem: "Every employee of the company were given a two bedroom flat as Diwali bonus.",
      options: [
        { id: "a", text: "Every employee" },
        { id: "b", text: "were given" },
        { id: "c", text: "a two bedroom flat" },
        { id: "d", text: "as Diwali bonus" }
      ],
      correctOption: "b",
      alignmentStatus: "matched",
      reviewStatus: "needs_topic_duplicate_review",
      answerEvidence: {
        sourceType: "mistral_ocr_solution_marker",
        questionNumber: "2",
        correctOption: "b",
        pageNumber: 2,
        evidenceText: "Sol.2.(b) should be was given"
      },
      provenance: { sourceId, sourceType: "book_user_provided", pageNumber: 1 }
    }
  ]);

  execFileSync("python", [
    scriptPath,
    "--data-dir",
    dataDir,
    "--output-root",
    path.join(dataDir, "book-imports"),
    "--source-type",
    "book_user_provided",
    "--trust-book-format-dedupe"
  ], { cwd: root, stdio: "pipe" });

  const promoted = JSON.parse(fs.readFileSync(path.join(dataDir, "book-imports", "questions.json"), "utf8")) as Array<{
    topic: string;
  }>;

  assert.equal(promoted.length, 1);
  assert.equal(promoted[0]?.topic, "grammar-error-spotting");
});

test("SSC CGL trusted book promotion uses English book ranges for chapter-style topics", () => {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "ssc-cgl-english-range-topics-"));
  const dataDir = path.join(tempRoot, "ssc-cgl");
  const sourceId = "pinnacle-ssc-english";

  writeJson(path.join(dataDir, "aligned-mistral", sourceId, "range-a", "aligned-candidates.json"), [
    {
      id: "english-p126-q1",
      sourceId,
      sourceType: "book_user_provided",
      chapterSlug: "ocr-range-p0126-p0150",
      chapterTitle: "pinnacle-ssc-english-p0126-p0150",
      pageNumber: 126,
      questionNumber: "1",
      stem: "He said to me, \"What are you doing?\"",
      options: [
        { id: "a", text: "He said what I had been doing" },
        { id: "b", text: "He said that what I was doing" },
        { id: "c", text: "He asked me what I was doing" },
        { id: "d", text: "He asked me that what was I doing" }
      ],
      correctOption: "c",
      alignmentStatus: "matched",
      reviewStatus: "needs_topic_duplicate_review",
      answerEvidence: { sourceType: "mistral_ocr_solution_marker", questionNumber: "1", correctOption: "c" },
      provenance: { sourceId, sourceType: "book_user_provided", chapterTitle: "pinnacle-ssc-english-p0126-p0150", pageNumber: 126 }
    },
    {
      id: "english-p451-q2",
      sourceId,
      sourceType: "book_user_provided",
      chapterSlug: "ocr-range-p0451-p0475",
      chapterTitle: "pinnacle-ssc-english-p0451-p0475",
      pageNumber: 451,
      questionNumber: "2",
      stem: "To play ducks and drakes",
      options: [
        { id: "a", text: "to use recklessly" },
        { id: "b", text: "to change places" },
        { id: "c", text: "to be friendly" },
        { id: "d", text: "to act cleverly" }
      ],
      correctOption: "a",
      alignmentStatus: "matched",
      reviewStatus: "needs_topic_duplicate_review",
      answerEvidence: { sourceType: "mistral_ocr_solution_marker", questionNumber: "2", correctOption: "a" },
      provenance: { sourceId, sourceType: "book_user_provided", chapterTitle: "pinnacle-ssc-english-p0451-p0475", pageNumber: 451 }
    },
    {
      id: "english-p501-q3",
      sourceId,
      sourceType: "book_user_provided",
      chapterSlug: "ocr-range-p0501-p0525",
      chapterTitle: "pinnacle-ssc-english-p0501-p0525",
      pageNumber: 501,
      questionNumber: "3",
      stem: "Guile CHSL 12/10/20 Morning",
      options: [
        { id: "a", text: "Intuition" },
        { id: "b", text: "Surfeit" },
        { id: "c", text: "Sincerity" },
        { id: "d", text: "Deceit" }
      ],
      correctOption: "d",
      alignmentStatus: "matched",
      reviewStatus: "needs_topic_duplicate_review",
      answerEvidence: { sourceType: "mistral_ocr_solution_marker", questionNumber: "3", correctOption: "d" },
      provenance: { sourceId, sourceType: "book_user_provided", chapterTitle: "pinnacle-ssc-english-p0501-p0525", pageNumber: 501 }
    },
    {
      id: "english-p551-q4",
      sourceId,
      sourceType: "book_user_provided",
      chapterSlug: "ocr-range-p0551-p0569",
      chapterTitle: "pinnacle-ssc-english-p0551-p0569",
      pageNumber: 551,
      questionNumber: "4",
      stem: "SSC CGL Tier II - 11/9/2019",
      options: [
        { id: "a", text: "Immediate" },
        { id: "b", text: "Illiterate" },
        { id: "c", text: "Implement" },
        { id: "d", text: "Illogical" }
      ],
      correctOption: "a",
      alignmentStatus: "matched",
      reviewStatus: "needs_topic_duplicate_review",
      answerEvidence: { sourceType: "mistral_ocr_solution_marker", questionNumber: "4", correctOption: "a" },
      provenance: { sourceId, sourceType: "book_user_provided", chapterTitle: "pinnacle-ssc-english-p0551-p0569", pageNumber: 551 }
    }
  ]);

  execFileSync("python", [
    scriptPath,
    "--data-dir",
    dataDir,
    "--output-root",
    path.join(dataDir, "book-imports"),
    "--source-type",
    "book_user_provided",
    "--trust-book-format-dedupe"
  ], { cwd: root, stdio: "pipe" });

  const promoted = JSON.parse(fs.readFileSync(path.join(dataDir, "book-imports", "questions.json"), "utf8")) as Array<{
    stem: string;
    topic: string;
  }>;
  const topicByStem = new Map(promoted.map((question) => [question.stem, question.topic]));

  assert.equal(topicByStem.get("He said to me, \"What are you doing?\""), "active-passive-direct-indirect");
  assert.equal(topicByStem.get("To play ducks and drakes"), "idioms-phrases");
  assert.equal(topicByStem.get("Guile CHSL 12/10/20 Morning"), "synonyms-antonyms");
  assert.equal(topicByStem.get("SSC CGL Tier II - 11/9/2019"), "spelling-one-word");
});

test("SSC CGL promotion turns high-consensus agent-reviewed imports into app questions", () => {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "ssc-cgl-curated-promotion-"));
  const dataDir = path.join(tempRoot, "ssc-cgl");
  const sourceSlug = "user-supplied-ssc-cgl-2023-question-paper-shift-1";
  const questionId = `${sourceSlug}-p001-q1`;

  writeJson(path.join(dataDir, "aligned", `${sourceSlug}-agent-consensus`, "aligned-candidates.json"), [
    {
      id: questionId,
      sourceId: `${sourceSlug}-source`,
      sourceType: "web_pdf_unverified",
      sourceUrl: "https://example.test/ssc-cgl-2023-shift-1",
      pageNumber: 1,
      questionNumber: "1",
      stem: "If a value is increased by 20% and then decreased by 10%, what is the net percentage change?",
      options: [
        { id: "a", text: "8% increase" },
        { id: "b", text: "10% increase" },
        { id: "c", text: "12% decrease" },
        { id: "d", text: "No change" }
      ],
      correctOption: "a",
      alignmentStatus: "agent_consensus_matched",
      reviewStatus: "needs_topic_duplicate_review",
      answerEvidence: {
        providers: ["deepseek", "mistral"],
        agreementCount: 2,
        averageConfidence: 0.96,
        explanations: [
          { provider: "deepseek", confidence: 0.96, explanation: "Successive change is 20 - 10 - 2 = 8% increase." }
        ]
      }
    },
    {
      id: `${sourceSlug}-p001-q2`,
      sourceId: `${sourceSlug}-source`,
      sourceType: "web_pdf_unverified",
      sourceUrl: "https://example.test/ssc-cgl-2023-shift-1",
      pageNumber: 1,
      stem: "Weak evidence row should not promote.",
      options: [
        { id: "a", text: "A" },
        { id: "b", text: "B" },
        { id: "c", text: "C" },
        { id: "d", text: "D" }
      ],
      correctOption: "b",
      alignmentStatus: "agent_consensus_matched",
      reviewStatus: "needs_topic_duplicate_review",
      answerEvidence: {
        providers: ["deepseek"],
        agreementCount: 1,
        averageConfidence: 0.5,
        explanations: []
      }
    }
  ]);

  writeJson(path.join(dataDir, "agent-review", `${sourceSlug}-deepseek-mistral-full`, "agent-review-decisions.json"), [
    {
      questionId,
      provider: "deepseek",
      finalSection: "quantitative-aptitude",
      finalTopic: "percentages",
      finalSubtopic: "successive percentage change",
      duplicateDecision: "unique",
      duplicateOf: null,
      provenanceDecision: "needs_source_review",
      confidence: 0.94,
      reasons: ["The row is a valid SSC-style percentage item."],
      flags: [],
      rankedEligible: false,
      acceptedAt: "2026-06-26T00:00:00.000Z"
    }
  ]);

  execFileSync("python", [
    scriptPath,
    "--data-dir",
    dataDir,
    "--output-root",
    path.join(dataDir, "curated-imports")
  ], { cwd: root, stdio: "pipe" });

  const promoted = JSON.parse(fs.readFileSync(path.join(dataDir, "curated-imports", "questions.json"), "utf8")) as Array<{
    reviewStatus: string;
    topic: string;
    provenance: { sourceType: string; url: string };
    curation: { answerAgreementCount: number; reviewConfidence: number };
  }>;
  const report = JSON.parse(fs.readFileSync(path.join(dataDir, "curated-imports", "promotion-report.json"), "utf8")) as {
    promotedQuestions: number;
    rejected: Record<string, number>;
  };

  assert.equal(promoted.length, 1);
  assert.equal(report.promotedQuestions, 1);
  assert.equal(report.rejected.missing_agent_review, 1);
  assert.equal(promoted[0]?.reviewStatus, "reviewed");
  assert.equal(promoted[0]?.topic, "percentages");
  assert.equal(promoted[0]?.provenance.sourceType, "user_provided");
  assert.match(promoted[0]?.provenance.url ?? "", /ssc-cgl-2023/);
  assert.equal(promoted[0]?.curation.answerAgreementCount, 2);
  assert.equal(promoted[0]?.curation.reviewConfidence, 0.94);
});

test("SSC CGL promotion preserves uploaded-book provenance without requiring a URL", () => {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "ssc-cgl-book-promotion-"));
  const dataDir = path.join(tempRoot, "ssc-cgl");
  const sourceSlug = "ssc-maths-6800-mcq";
  const chunkSlug = "percentage-p444-p461";
  const questionId = `${sourceSlug}-${chunkSlug}-p446-q7`;

  writeJson(path.join(dataDir, "aligned", sourceSlug, chunkSlug, "aligned-candidates.json"), [
    {
      id: questionId,
      sourceId: sourceSlug,
      sourceType: "book_user_provided",
      sourceUrl: null,
      chapterSlug: "percentage",
      chapterTitle: "Percentage",
      pageNumber: 446,
      questionNumber: "7",
      stem: "SSC CGL 18/09/2025: If 40% of a number is 72, then what is 25% of the same number?",
      options: [
        { id: "a", text: "45" },
        { id: "b", text: "48" },
        { id: "c", text: "50" },
        { id: "d", text: "54" }
      ],
      correctOption: "a",
      alignmentStatus: "agent_consensus_matched",
      reviewStatus: "needs_topic_duplicate_review",
      answerEvidence: {
        providers: ["deepseek", "mistral"],
        agreementCount: 2,
        averageConfidence: 0.97,
        explanations: [
          { provider: "deepseek", confidence: 0.97, explanation: "40% is 72, so the number is 180 and 25% is 45." }
        ]
      },
      provenance: {
        sourceId: sourceSlug,
        sourceType: "book_user_provided",
        file: "data/exams/ssc-cgl/book-sources/ssc-maths-6800-mcq.pdf",
        chapterSlug: "percentage",
        chapterTitle: "Percentage",
        pageNumber: 446
      }
    },
    {
      id: `${sourceSlug}-${chunkSlug}-web-q1`,
      sourceId: "older-web-source",
      sourceType: "web_pdf_unverified",
      sourceUrl: "https://example.test/older-web-pdf",
      pageNumber: 1,
      questionNumber: "1",
      stem: "SSC CGL 2024: Older web candidate should not enter the uploaded-book import pool.",
      options: [
        { id: "a", text: "A" },
        { id: "b", text: "B" },
        { id: "c", text: "C" },
        { id: "d", text: "D" }
      ],
      correctOption: "a",
      alignmentStatus: "agent_consensus_matched",
      reviewStatus: "needs_topic_duplicate_review",
      answerEvidence: {
        providers: ["deepseek", "mistral"],
        agreementCount: 2,
        averageConfidence: 0.97,
        explanations: [
          { provider: "deepseek", confidence: 0.97, explanation: "Fixture web explanation." }
        ]
      },
      provenance: {
        sourceId: "older-web-source",
        sourceType: "web_pdf_unverified",
        url: "https://example.test/older-web-pdf",
        pageNumber: 1
      }
    }
  ]);

  writeJson(path.join(dataDir, "agent-review", sourceSlug, chunkSlug, "agent-review-decisions.json"), [
    {
      questionId,
      provider: "deepseek",
      finalSection: "quantitative-aptitude",
      finalTopic: "percentages",
      finalSubtopic: "basic percentage value",
      duplicateDecision: "unique",
      duplicateOf: null,
      provenanceDecision: "needs_source_review",
      confidence: 0.93,
      reasons: ["The uploaded-book row is a valid SSC CGL percentage item."],
      flags: [],
      rankedEligible: false,
      acceptedAt: "2026-06-26T00:00:00.000Z"
    },
    {
      questionId: `${sourceSlug}-${chunkSlug}-web-q1`,
      provider: "deepseek",
      finalSection: "quantitative-aptitude",
      finalTopic: "percentages",
      finalSubtopic: "fixture",
      duplicateDecision: "unique",
      duplicateOf: null,
      provenanceDecision: "needs_source_review",
      confidence: 0.93,
      reasons: ["Fixture web row would be valid in the old curated pool."],
      flags: [],
      rankedEligible: false,
      acceptedAt: "2026-06-26T00:00:00.000Z"
    }
  ]);

  execFileSync("python", [
    scriptPath,
    "--data-dir",
    dataDir,
    "--output-root",
    path.join(dataDir, "book-imports"),
    "--source-type",
    "book_user_provided"
  ], { cwd: root, stdio: "pipe" });

  const promoted = JSON.parse(fs.readFileSync(path.join(dataDir, "book-imports", "questions.json"), "utf8")) as Array<{
    year: number;
    topic: string;
    provenance: { sourceType: string; url?: string; file?: string; pageNumber?: number; chapterSlug?: string; chapterTitle?: string };
    curation: { sourceTypeBeforePromotion: string };
  }>;
  const report = JSON.parse(fs.readFileSync(path.join(dataDir, "book-imports", "promotion-report.json"), "utf8")) as {
    promotedQuestions: number;
  };

  assert.equal(report.promotedQuestions, 1);
  assert.equal(promoted.length, 1);
  assert.equal(promoted[0]?.year, 2025);
  assert.equal(promoted[0]?.topic, "percentages");
  assert.equal(promoted[0]?.provenance.sourceType, "book_user_provided");
  assert.equal(promoted[0]?.provenance.url, undefined);
  assert.match(promoted[0]?.provenance.file ?? "", /ssc-maths-6800-mcq\.pdf/);
  assert.equal(promoted[0]?.provenance.pageNumber, 446);
  assert.equal(promoted[0]?.provenance.chapterSlug, "percentage");
  assert.equal(promoted[0]?.provenance.chapterTitle, "Percentage");
  assert.equal(promoted[0]?.curation.sourceTypeBeforePromotion, "book_user_provided");
});

test("SSC CGL promotion accepts Mistral OCR solution-marker answers after agent review", () => {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "ssc-cgl-ocr-book-promotion-"));
  const dataDir = path.join(tempRoot, "ssc-cgl");
  const sourceSlug = "ssc-maths-6800-mcq";
  const chunkSlug = "ocr-range-p0021-p0040-p021-p040";
  const questionId = `${sourceSlug}-${chunkSlug}-q227`;

  writeJson(path.join(dataDir, "aligned", sourceSlug, chunkSlug, "aligned-candidates.json"), [
    {
      id: questionId,
      sourceId: sourceSlug,
      sourceType: "book_user_provided",
      sourceUrl: null,
      chapterSlug: "ocr-range-p0021-p0040",
      chapterTitle: "ssc-maths-6800-mcq-p0021-p0040",
      pageNumber: 21,
      questionNumber: "227",
      stem: "(8^6 + 1) when divided by 7 leaves:",
      options: [
        { id: "a", text: "1" },
        { id: "b", text: "4" },
        { id: "c", text: "2" },
        { id: "d", text: "6" }
      ],
      correctOption: "c",
      alignmentStatus: "matched",
      reviewStatus: "needs_topic_duplicate_review",
      answerEvidence: {
        sourceType: "mistral_ocr_solution_marker_cross_range",
        questionNumber: "227",
        correctOption: "c",
        pageNumber: 32,
        evidenceText: "Sol.227.(c) leaves 2."
      },
      provenance: {
        sourceId: sourceSlug,
        sourceType: "book_user_provided",
        file: "G:/SSC BOOKS/1000747369-SSC-Maths-6800-MCQ-Book-2026-Eduquity-Based-New-Pattern-Chapterwise.pdf",
        chapterSlug: "ocr-range-p0021-p0040",
        chapterTitle: "ssc-maths-6800-mcq-p0021-p0040",
        pageNumber: 21
      }
    }
  ]);

  writeJson(path.join(dataDir, "agent-review", sourceSlug, chunkSlug, "agent-review-decisions.json"), [
    {
      questionId,
      provider: "mistral",
      finalSection: "quantitative-aptitude",
      finalTopic: "number-system",
      finalSubtopic: "remainders",
      duplicateDecision: "unique",
      duplicateOf: null,
      provenanceDecision: "needs_source_review",
      confidence: 0.91,
      reasons: ["The OCR row has four options, a solution-marker answer, and book provenance."],
      flags: [],
      rankedEligible: false,
      acceptedAt: "2026-06-26T00:00:00.000Z"
    }
  ]);

  execFileSync("python", [
    scriptPath,
    "--data-dir",
    dataDir,
    "--output-root",
    path.join(dataDir, "book-imports"),
    "--source-type",
    "book_user_provided"
  ], { cwd: root, stdio: "pipe" });

  const promoted = JSON.parse(fs.readFileSync(path.join(dataDir, "book-imports", "questions.json"), "utf8")) as Array<{
    topic: string;
    correctOption: string;
    provenance: { sourceType: string; file?: string; pageNumber?: number };
    curation: { answerAgreementCount: number; answerAverageConfidence: number; answerProviders: string[] };
  }>;
  const report = JSON.parse(fs.readFileSync(path.join(dataDir, "book-imports", "promotion-report.json"), "utf8")) as {
    promotedQuestions: number;
  };

  assert.equal(report.promotedQuestions, 1);
  assert.equal(promoted.length, 1);
  assert.equal(promoted[0]?.topic, "number-system");
  assert.equal(promoted[0]?.correctOption, "c");
  assert.equal(promoted[0]?.provenance.sourceType, "book_user_provided");
  assert.match(promoted[0]?.provenance.file ?? "", /SSC-Maths-6800-MCQ/);
  assert.equal(promoted[0]?.provenance.pageNumber, 21);
  assert.deepEqual(promoted[0]?.curation.answerProviders, ["mistral_ocr_solution_marker_cross_range"]);
  assert.equal(promoted[0]?.curation.answerAgreementCount, 1);
  assert.equal(promoted[0]?.curation.answerAverageConfidence, 0.96);
});

test("SSC CGL trusted book promotion uses format and duplicate gates without agent review", () => {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "ssc-cgl-trusted-book-promotion-"));
  const dataDir = path.join(tempRoot, "ssc-cgl");
  const sourceSlug = "pinnacle-ssc-english";
  const chunkSlug = "ocr-range-p0001-p0025-p001-p025";
  const validQuestion = {
    id: `${sourceSlug}-${chunkSlug}-q1`,
    sourceId: sourceSlug,
    sourceType: "book_user_provided",
    sourceUrl: null,
    chapterSlug: "ocr-range-p0001-p0025",
    chapterTitle: "pinnacle-ssc-english-p0001-p0025",
    pageNumber: 8,
    questionNumber: "1",
    stem: "SSC CGL 04/06/2019: Choose the correct synonym of Abundant.",
    options: [
      { id: "a", text: "Scarce" },
      { id: "b", text: "Plentiful" },
      { id: "c", text: "Weak" },
      { id: "d", text: "Late" }
    ],
    correctOption: "b",
    alignmentStatus: "matched",
    reviewStatus: "needs_topic_duplicate_review",
    answerEvidence: {
      sourceType: "mistral_ocr_solution_marker",
      questionNumber: "1",
      correctOption: "b",
      pageNumber: 9,
      evidenceText: "Sol.1.(b) Abundant means plentiful."
    },
    provenance: {
      sourceId: sourceSlug,
      sourceType: "book_user_provided",
      file: "G:/SSC BOOKS/pinnacle-ssc-english.pdf",
      chapterSlug: "ocr-range-p0001-p0025",
      chapterTitle: "pinnacle-ssc-english-p0001-p0025",
      pageNumber: 8
    }
  };

  writeJson(path.join(dataDir, "aligned-mistral", sourceSlug, chunkSlug, "aligned-candidates.json"), [
    validQuestion,
    {
      ...validQuestion,
      id: `${sourceSlug}-${chunkSlug}-q1-duplicate`,
      questionNumber: "1b"
    },
    {
      ...validQuestion,
      id: `${sourceSlug}-${chunkSlug}-q2-bad-options`,
      questionNumber: "2",
      stem: "Malformed row should not promote because it has only three options.",
      options: [
        { id: "a", text: "A" },
        { id: "b", text: "B" },
        { id: "c", text: "C" }
      ]
    },
    {
      ...validQuestion,
      id: `${sourceSlug}-${chunkSlug}-q4-boilerplate`,
      questionNumber: "4",
      stem: "TG @Exams_Pdfss Download Pinnacle Exam Preparation Answer Key :-",
      options: [
        { id: "a", text: "Search on TG @SSC_PINNACLEE" },
        { id: "b", text: "Pinnacle" },
        { id: "c", text: "Day: 10th" },
        { id: "d", text: "Solutions :-" }
      ]
    },
    {
      ...validQuestion,
      id: `${sourceSlug}-${chunkSlug}-q3-web`,
      sourceId: "web-source",
      sourceType: "web_pdf_unverified",
      sourceUrl: "https://example.test/web-source",
      stem: "Web rows must not be promoted by trusted book mode.",
      provenance: {
        sourceId: "web-source",
        sourceType: "web_pdf_unverified",
        url: "https://example.test/web-source",
        pageNumber: 1
      }
    }
  ]);

  execFileSync("python", [
    scriptPath,
    "--data-dir",
    dataDir,
    "--output-root",
    path.join(dataDir, "book-imports"),
    "--source-type",
    "book_user_provided",
    "--trust-book-format-dedupe"
  ], { cwd: root, stdio: "pipe" });

  const promoted = JSON.parse(fs.readFileSync(path.join(dataDir, "book-imports", "questions.json"), "utf8")) as Array<{
    source: string;
    reviewStatus: string;
    topic: string;
    provenance: { sourceType: string; file?: string };
    curation: { reviewProvider: string; reviewConfidence: number; promotionGate: string };
  }>;
  const report = JSON.parse(fs.readFileSync(path.join(dataDir, "book-imports", "promotion-report.json"), "utf8")) as {
    promotedQuestions: number;
    rejected: Record<string, number>;
  };

  assert.equal(report.promotedQuestions, 1);
  assert.equal(report.rejected.duplicate_stem, 1);
  assert.equal(report.rejected.invalid_projection, 2);
  assert.equal(promoted.length, 1);
  assert.equal(promoted[0]?.source, "PYQ");
  assert.equal(promoted[0]?.reviewStatus, "reviewed");
  assert.equal(promoted[0]?.topic, "synonyms-antonyms");
  assert.equal(promoted[0]?.provenance.sourceType, "book_user_provided");
  assert.match(promoted[0]?.provenance.file ?? "", /pinnacle-ssc-english/);
  assert.equal(promoted[0]?.curation.reviewProvider, "trusted_book_format_dedupe");
  assert.equal(promoted[0]?.curation.reviewConfidence, 0.9);
  assert.equal(promoted[0]?.curation.promotionGate, "trusted_book_format_dedupe");
});

test("SSC CGL trusted book promotion accepts forward-range OCR solution answers", () => {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "ssc-cgl-forward-range-promotion-"));
  const dataDir = path.join(tempRoot, "ssc-cgl");
  const sourceSlug = "pinnacle-ssc-reasoning";
  const chunkSlug = "ocr-range-p0126-p0150-p126-p150";

  writeJson(path.join(dataDir, "aligned-mistral", sourceSlug, chunkSlug, "aligned-candidates.json"), [
    {
      id: `${sourceSlug}-${chunkSlug}-q212`,
      sourceId: sourceSlug,
      sourceType: "book_user_provided",
      sourceUrl: null,
      chapterSlug: "ocr-range-p0126-p0150",
      chapterTitle: "pinnacle-ssc-reasoning-p0126-p0150",
      pageNumber: 129,
      questionNumber: "212",
      stem: "Six girls are sitting around a circular table and facing the centre.",
      options: [
        { id: "a", text: "P" },
        { id: "b", text: "Q" },
        { id: "c", text: "R" },
        { id: "d", text: "S" }
      ],
      correctOption: "c",
      alignmentStatus: "matched",
      reviewStatus: "needs_topic_duplicate_review",
      answerEvidence: {
        sourceType: "mistral_ocr_solution_marker_forward_range",
        questionNumber: "212",
        correctOption: "c",
        pageNumber: 151,
        evidenceText: "Sol.212.(c) Circular seating solution."
      },
      provenance: {
        sourceId: sourceSlug,
        sourceType: "book_user_provided",
        file: "G:/SSC BOOKS/pinnacle-ssc-reasoning.pdf",
        chapterSlug: "ocr-range-p0126-p0150",
        chapterTitle: "pinnacle-ssc-reasoning-p0126-p0150",
        pageNumber: 129
      }
    }
  ]);

  execFileSync("python", [
    scriptPath,
    "--data-dir",
    dataDir,
    "--output-root",
    path.join(dataDir, "book-imports"),
    "--source-type",
    "book_user_provided",
    "--trust-book-format-dedupe"
  ], { cwd: root, stdio: "pipe" });

  const promoted = JSON.parse(fs.readFileSync(path.join(dataDir, "book-imports", "questions.json"), "utf8")) as Array<{
    section: string;
    correctOption: string;
    curation: { answerProviders: string[] };
  }>;

  assert.equal(promoted.length, 1);
  assert.equal(promoted[0]?.section, "reasoning");
  assert.equal(promoted[0]?.correctOption, "c");
  assert.deepEqual(promoted[0]?.curation.answerProviders, ["mistral_ocr_solution_marker_forward_range"]);
});

test("SSC CGL trusted book promotion accepts the Maths QR Data Interpretation supplement", () => {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "ssc-cgl-qr-supplement-promotion-"));
  const dataDir = path.join(tempRoot, "ssc-cgl");
  const sourceSlug = "pinnacle-maths-6800-di-qr-english";
  const chunkSlug = "data-interpretation-qr-supplement-p003-p074";

  writeJson(path.join(dataDir, "book-sources", "manifest.json"), {
    sources: [
      {
        id: sourceSlug,
        sourceType: "book_user_provided",
        role: "mcq_corpus_supplement",
        section: "quantitative-aptitude"
      }
    ]
  });
  writeJson(path.join(dataDir, "aligned-mistral", sourceSlug, chunkSlug, "aligned-candidates.json"), [
    {
      id: `${sourceSlug}-${chunkSlug}-q1`,
      sourceId: sourceSlug,
      sourceType: "book_user_provided",
      sourceUrl: "https://drive.google.com/file/d/1cYO7JCjVtM42YhoqjNmm-xrnzhA4wo4y/view?usp=sharing",
      chapterSlug: "data-interpretation-qr-supplement",
      chapterTitle: "Data Interpretation QR Supplement",
      pageNumber: 3,
      questionNumber: "1",
      stem: "Study the table and find the total number of candidates selected from all zones.",
      options: [
        { id: "a", text: "425" },
        { id: "b", text: "400" },
        { id: "c", text: "375" },
        { id: "d", text: "450" }
      ],
      correctOption: "a",
      alignmentStatus: "matched",
      reviewStatus: "needs_topic_duplicate_review",
      answerEvidence: {
        sourceType: "mistral_ocr_solution_marker",
        questionNumber: "1",
        correctOption: "a",
        pageNumber: 54,
        evidenceText: "Sol.1.(a) Add all table values to get 425."
      },
      provenance: {
        sourceId: sourceSlug,
        sourceType: "book_user_provided",
        file: "G:/MITEEE/data/exams/ssc-cgl/downloads/book-supplements/pinnacle-maths-6800-data-interpretation-qr-english.pdf",
        chapterSlug: "data-interpretation-qr-supplement",
        chapterTitle: "Data Interpretation QR Supplement",
        pageNumber: 3
      }
    }
  ]);

  execFileSync("python", [
    scriptPath,
    "--data-dir",
    dataDir,
    "--output-root",
    path.join(dataDir, "book-imports"),
    "--source-type",
    "book_user_provided",
    "--trust-book-format-dedupe"
  ], { cwd: root, stdio: "pipe" });

  const promoted = JSON.parse(fs.readFileSync(path.join(dataDir, "book-imports", "questions.json"), "utf8")) as Array<{
    section: string;
    topic: string;
    provenance: { sourceId: string; sourceType: string };
    curation: { promotionGate: string };
  }>;

  assert.equal(promoted.length, 1);
  assert.equal(promoted[0]?.section, "quantitative-aptitude");
  assert.equal(promoted[0]?.topic, "data-interpretation");
  assert.equal(promoted[0]?.provenance.sourceId, sourceSlug);
  assert.equal(promoted[0]?.provenance.sourceType, "book_user_provided");
  assert.equal(promoted[0]?.curation.promotionGate, "trusted_book_format_dedupe");
});

test("SSC CGL trusted book promotion removes only exact duplicate question copies", () => {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "ssc-cgl-exact-duplicate-promotion-"));
  const dataDir = path.join(tempRoot, "ssc-cgl");
  const sourceSlug = "ssc-maths-6800-mcq";
  const chunkSlug = "number-system-p013-p022";
  const baseQuestion = {
    id: `${sourceSlug}-${chunkSlug}-q1`,
    sourceId: sourceSlug,
    sourceType: "book_user_provided",
    sourceUrl: null,
    chapterSlug: "number-system",
    chapterTitle: "Number System",
    pageNumber: 13,
    questionNumber: "1",
    stem: "Find the value of x if 40% of x is 72.",
    options: [
      { id: "a", text: "160" },
      { id: "b", text: "170" },
      { id: "c", text: "180" },
      { id: "d", text: "190" }
    ],
    correctOption: "c",
    alignmentStatus: "matched",
    reviewStatus: "needs_topic_duplicate_review",
    answerEvidence: {
      sourceType: "mistral_ocr_solution_marker",
      questionNumber: "1",
      correctOption: "c",
      pageNumber: 20,
      evidenceText: "Sol.1.(c) 40% of 180 is 72."
    },
    provenance: {
      sourceId: sourceSlug,
      sourceType: "book_user_provided",
      file: "G:/SSC BOOKS/ssc-maths.pdf",
      chapterSlug: "number-system",
      chapterTitle: "Number System",
      pageNumber: 13
    }
  };

  writeJson(path.join(dataDir, "aligned-mistral", sourceSlug, chunkSlug, "aligned-candidates.json"), [
    baseQuestion,
    {
      ...baseQuestion,
      id: `${sourceSlug}-${chunkSlug}-q1-exact-copy`,
      questionNumber: "1-copy"
    },
    {
      ...baseQuestion,
      id: `${sourceSlug}-${chunkSlug}-q1-different-options`,
      questionNumber: "1b",
      options: [
        { id: "a", text: "180" },
        { id: "b", text: "170" },
        { id: "c", text: "160" },
        { id: "d", text: "190" }
      ],
      correctOption: "a",
      answerEvidence: {
        sourceType: "mistral_ocr_solution_marker",
        questionNumber: "1b",
        correctOption: "a",
        pageNumber: 20,
        evidenceText: "Sol.1b.(a) 40% of 180 is 72."
      }
    }
  ]);

  execFileSync("python", [
    scriptPath,
    "--data-dir",
    dataDir,
    "--output-root",
    path.join(dataDir, "book-imports"),
    "--source-type",
    "book_user_provided",
    "--trust-book-format-dedupe"
  ], { cwd: root, stdio: "pipe" });

  const promoted = JSON.parse(fs.readFileSync(path.join(dataDir, "book-imports", "questions.json"), "utf8")) as Array<{
    stem: string;
    correctOption: string;
    options: Array<{ id: string; text: string }>;
  }>;
  const report = JSON.parse(fs.readFileSync(path.join(dataDir, "book-imports", "promotion-report.json"), "utf8")) as {
    promotedQuestions: number;
    rejected: Record<string, number>;
  };

  assert.equal(report.promotedQuestions, 2);
  assert.equal(report.rejected.duplicate_stem, 1);
  assert.equal(promoted.length, 2);
  assert.deepEqual(promoted.map((question) => question.correctOption).sort(), ["a", "c"]);
});

test("SSC CGL trusted book promotion keeps distinct OCR figure placeholder rows", () => {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "ssc-cgl-figure-placeholder-promotion-"));
  const dataDir = path.join(tempRoot, "ssc-cgl");
  const sourceSlug = "pinnacle-ssc-reasoning";
  const chunkSlug = "ocr-range-p0251-p0275-p251-p275";
  const baseQuestion = {
    id: `${sourceSlug}-${chunkSlug}-q154`,
    sourceId: sourceSlug,
    sourceType: "book_user_provided",
    sourceUrl: null,
    chapterSlug: "embedded-figure",
    chapterTitle: "Embedded Figure",
    pageNumber: 264,
    questionNumber: "154",
    stem: "Non-verbal figure question preserved from OCR label-only block.",
    options: [
      { id: "a", text: "Option A (see figure)" },
      { id: "b", text: "Option B (see figure)" },
      { id: "c", text: "Option C (see figure)" },
      { id: "d", text: "Option D (see figure)" }
    ],
    correctOption: "b",
    alignmentStatus: "matched",
    reviewStatus: "needs_topic_duplicate_review",
    answerEvidence: {
      sourceType: "mistral_ocr_solution_marker_forward_range",
      questionNumber: "154",
      correctOption: "b",
      pageNumber: 270,
      evidenceText: "Sol.154.(b)"
    },
    provenance: {
      sourceId: sourceSlug,
      sourceType: "book_user_provided",
      file: "G:/SSC BOOKS/pinnacle-reasoning.pdf",
      chapterSlug: "embedded-figure",
      chapterTitle: "Embedded Figure",
      pageNumber: 264
    }
  };

  writeJson(path.join(dataDir, "aligned-mistral", sourceSlug, chunkSlug, "aligned-candidates.json"), [
    baseQuestion,
    {
      ...baseQuestion,
      id: `${sourceSlug}-${chunkSlug}-q155`,
      questionNumber: "155",
      answerEvidence: {
        sourceType: "mistral_ocr_solution_marker_forward_range",
        questionNumber: "155",
        correctOption: "b",
        pageNumber: 270,
        evidenceText: "Sol.155.(b)"
      }
    }
  ]);

  execFileSync("python", [
    scriptPath,
    "--data-dir",
    dataDir,
    "--output-root",
    path.join(dataDir, "book-imports"),
    "--source-type",
    "book_user_provided",
    "--trust-book-format-dedupe"
  ], { cwd: root, stdio: "pipe" });

  const report = JSON.parse(fs.readFileSync(path.join(dataDir, "book-imports", "promotion-report.json"), "utf8")) as {
    promotedQuestions: number;
    rejected: Record<string, number>;
  };
  const promoted = JSON.parse(fs.readFileSync(path.join(dataDir, "book-imports", "questions.json"), "utf8")) as Array<{
    provenance: { pageNumber: number };
  }>;

  assert.equal(report.promotedQuestions, 2);
  assert.equal(report.rejected.duplicate_stem, 0);
  assert.equal(promoted.length, 2);
  assert.deepEqual(promoted.map((question) => question.provenance.pageNumber), [264, 264]);
});

test("SSC CGL trusted book promotion cleans solution tails from option text", () => {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "ssc-cgl-option-tail-promotion-"));
  const dataDir = path.join(tempRoot, "ssc-cgl");
  const sourceSlug = "pinnacle-ssc-english";
  const chunkSlug = "ocr-range-p0026-p0050-p026-p050";

  writeJson(path.join(dataDir, "aligned-mistral", sourceSlug, chunkSlug, "aligned-candidates.json"), [
    {
      id: `${sourceSlug}-${chunkSlug}-q293`,
      sourceId: sourceSlug,
      sourceType: "book_user_provided",
      sourceUrl: null,
      chapterSlug: "spot-the-error",
      chapterTitle: "Spot the Error",
      pageNumber: 35,
      questionNumber: "293",
      stem: "Are you having your own transport to go home from work?",
      options: [
        { id: "a", text: "to go home" },
        { id: "b", text: "from work" },
        { id: "c", text: "Are you having" },
        { id: "d", text: "your own transport\n\n### Solutions:-\n\n**Sol.254.**(b) No error." }
      ],
      correctOption: "c",
      alignmentStatus: "matched",
      reviewStatus: "needs_topic_duplicate_review",
      answerEvidence: {
        sourceType: "mistral_ocr_solution_marker",
        questionNumber: "293",
        correctOption: "c",
        pageNumber: 36,
        evidenceText: "Sol.293.(c) Use do you have."
      },
      provenance: {
        sourceId: sourceSlug,
        sourceType: "book_user_provided",
        file: "G:/SSC BOOKS/pinnacle-english.pdf",
        chapterSlug: "spot-the-error",
        chapterTitle: "Spot the Error",
        pageNumber: 35
      }
    }
  ]);

  execFileSync("python", [
    scriptPath,
    "--data-dir",
    dataDir,
    "--output-root",
    path.join(dataDir, "book-imports"),
    "--source-type",
    "book_user_provided",
    "--trust-book-format-dedupe"
  ], { cwd: root, stdio: "pipe" });

  const promoted = JSON.parse(fs.readFileSync(path.join(dataDir, "book-imports", "questions.json"), "utf8")) as Array<{
    options: Array<{ id: string; text: string }>;
  }>;

  assert.equal(promoted.length, 1);
  assert.equal(promoted[0]?.options.find((option) => option.id === "d")?.text, "your own transport");
});

test("SSC CGL trusted book promotion strips next-question spillover from option text", () => {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "ssc-cgl-option-next-question-promotion-"));
  const dataDir = path.join(tempRoot, "ssc-cgl");
  const sourceSlug = "pinnacle-ssc-reasoning";
  const chunkSlug = "scribd-html-p351-p375";

  writeJson(path.join(dataDir, "aligned-mistral", sourceSlug, chunkSlug, "aligned-candidates.json"), [
    {
      id: `${sourceSlug}-${chunkSlug}-q34`,
      sourceId: sourceSlug,
      sourceType: "book_user_provided",
      sourceUrl: null,
      chapterSlug: "scribd-html",
      chapterTitle: "Scribd HTML Pages",
      pageNumber: 368,
      questionNumber: "34",
      stem: "Kartik walks 40 m straight from his home towards the North, then turns left and walks 25 m. What is the shortest distance between his home and point X?",
      options: [
        { id: "a", text: "55" },
        { id: "b", text: "22" },
        { id: "c", text: "25" },
        { id: "d", text: "15 Q35 If the minute hand of a clock points towards the South at 12:00 a.m., then in which direction will it point at 3:00 a.m.?" }
      ],
      correctOption: "c",
      alignmentStatus: "matched",
      reviewStatus: "needs_topic_duplicate_review",
      answerEvidence: {
        sourceType: "mistral_ocr_solution_marker",
        questionNumber: "34",
        correctOption: "c",
        pageNumber: 368,
        evidenceText: "Sol.34.(c) Direction distance solution."
      },
      provenance: {
        sourceId: sourceSlug,
        sourceType: "book_user_provided",
        file: "G:/SSC BOOKS/pinnacle-reasoning.htm",
        chapterSlug: "scribd-html",
        chapterTitle: "Scribd HTML Pages",
        pageNumber: 368
      }
    }
  ]);

  execFileSync("python", [
    scriptPath,
    "--data-dir",
    dataDir,
    "--output-root",
    path.join(dataDir, "book-imports"),
    "--source-type",
    "book_user_provided",
    "--trust-book-format-dedupe"
  ], { cwd: root, stdio: "pipe" });

  const promoted = JSON.parse(fs.readFileSync(path.join(dataDir, "book-imports", "questions.json"), "utf8")) as Array<{
    topic: string;
    options: Array<{ id: string; text: string }>;
  }>;

  assert.equal(promoted.length, 1);
  assert.equal(promoted[0]?.topic, "direction-distance");
  assert.equal(promoted[0]?.options.find((option) => option.id === "d")?.text, "15");
});

test("SSC CGL trusted book promotion strips OCR watermark lines from valid questions", () => {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "ssc-cgl-watermark-promotion-"));
  const dataDir = path.join(tempRoot, "ssc-cgl");
  const sourceSlug = "ssc-maths-6800-mcq";
  const chunkSlug = "ocr-range-p0001-p0020-p001-p020";

  writeJson(path.join(dataDir, "aligned-mistral", sourceSlug, chunkSlug, "aligned-candidates.json"), [
    {
      id: `${sourceSlug}-${chunkSlug}-q18`,
      sourceId: sourceSlug,
      sourceType: "book_user_provided",
      sourceUrl: null,
      chapterSlug: "number-system",
      chapterTitle: "Number System",
      pageNumber: 13,
      questionNumber: "18",
      stem: "If 3c2933k is divisible by both 5 and 11, then c + k = ______.\n\nwww.sscgplinnacle.com\n\nDownload Pinnacle Exam Preparation App",
      options: [
        { id: "a", text: "6" },
        { id: "b", text: "8" },
        { id: "c", text: "5" },
        { id: "d", text: "7\n\nTG @Exams_Pdfss\n\nSearch on TG @SSC_PINNACLEE" }
      ],
      correctOption: "b",
      alignmentStatus: "matched",
      reviewStatus: "needs_topic_duplicate_review",
      answerEvidence: {
        sourceType: "mistral_ocr_solution_marker_cross_range",
        questionNumber: "18",
        correctOption: "b",
        pageNumber: 24,
        evidenceText: "Sol.18.(b) Divisibility gives c + k = 8."
      },
      provenance: {
        sourceId: sourceSlug,
        sourceType: "book_user_provided",
        file: "G:/SSC BOOKS/ssc-maths.pdf",
        chapterSlug: "number-system",
        chapterTitle: "Number System",
        pageNumber: 13
      }
    }
  ]);

  execFileSync("python", [
    scriptPath,
    "--data-dir",
    dataDir,
    "--output-root",
    path.join(dataDir, "book-imports"),
    "--source-type",
    "book_user_provided",
    "--trust-book-format-dedupe"
  ], { cwd: root, stdio: "pipe" });

  const promoted = JSON.parse(fs.readFileSync(path.join(dataDir, "book-imports", "questions.json"), "utf8")) as Array<{
    stem: string;
    options: Array<{ id: string; text: string }>;
  }>;

  assert.equal(promoted.length, 1);
  assert.equal(promoted[0]?.stem, "If 3c2933k is divisible by both 5 and 11, then c + k = ______.");
  assert.equal(promoted[0]?.options.find((option) => option.id === "d")?.text, "7");
});

test("SSC CGL generated exam data excludes old curated imports but includes promoted uploaded-book rows", () => {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "ssc-cgl-build-with-curated-"));
  const result = buildExamData({ generatedRoot: path.join(tempRoot, "generated") });
  const imported = result.data.questions.filter((question) => question.conceptTags.includes("agent-curated-import"));
  const promotedQuestions = JSON.parse(fs.readFileSync(getSscCglBookQuestionsPath(root), "utf8")) as MinimalBookQuestion[];
  const gapRepairQuestions = result.data.questions.filter((question) => question.provenance.sourceType === "original_practice");
  const uniquePromotedBookBodies = uniqueMcqBodyCount(promotedQuestions);

  assert.equal(imported.length, uniquePromotedBookBodies, "only non-conflicting promoted uploaded-book rows should feed generated exam data after the book-corpus reset");
  assert.ok(promotedQuestions.length > uniquePromotedBookBodies, "conflicting duplicate book rows should stay out of ranked generated exam data");
  assert.ok(imported.every((question) => question.provenance.sourceType === "book_user_provided"));
  assert.deepEqual(
    [...new Set(imported.map((question) => question.section))].sort(),
    ["english-comprehension", "general-awareness", "quantitative-aptitude", "reasoning"].sort()
  );
  assert.equal(result.validation.ok, true, result.validation.errors.join("\n"));
  assert.ok(gapRepairQuestions.length > 0, "200/200 topic-depth repair rows should be explicit original practice");
  assert.equal(result.data.questions.length, uniquePromotedBookBodies + gapRepairQuestions.length);
  assert.ok(imported.every((question) => question.source === "PYQ"));
  assert.ok(result.data.tests.every((practiceTest) => practiceTest.questionIds.length > 0));
  const percentages = result.data.topics.find((topic) => topic.slug === "percentages");
  assert.ok((percentages?.practice.pyqQuestionIds.length ?? 0) >= 12);
});
