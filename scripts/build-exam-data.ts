import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { buildSscCglQuestions, buildSscCglTestSummaries, buildSscCglTopics, sscCglPattern } from "@/lib/ssc-cgl-source";
import { validateSscCglExamData } from "@/lib/ssc-cgl";
import { buildCatQuantQuestions, buildCatQuantTopics } from "@/lib/cat-quant-source";
import { validateCatQuantData } from "@/lib/cat";
import { buildGateDataFromSource, validateGateData } from "@/lib/gate";
import type { CatQuantQuestion, CatQuantTopic, SscCglQuestion, SscCglTopic } from "@/lib/exam-types";

type BuildExamDataOptions = {
  generatedRoot?: string;
};

function ensureDirectory(directory: string) {
  fs.mkdirSync(directory, { recursive: true });
}

function writeJson(filePath: string, value: unknown) {
  ensureDirectory(path.dirname(filePath));
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

function countBy<T extends string>(values: T[]) {
  return values.reduce<Record<T, number>>((counts, value) => {
    counts[value] = (counts[value] ?? 0) + 1;
    return counts;
  }, {} as Record<T, number>);
}

function buildSscCglAiAuditReport(questions: SscCglQuestion[], topics: SscCglTopic[]) {
  const reviewed = questions.filter((question) => question.reviewStatus === "reviewed");
  const explanationMissing = reviewed.filter((question) => !question.explanation.trim());
  const weakExplanations = reviewed.filter((question) => question.explanation.trim().length < 80);
  const topicRows = topics.map((topic) => {
    const topicQuestions = reviewed.filter((question) => question.topic === topic.slug);
    const bookBacked = topicQuestions.filter((question) => question.provenance.sourceType === "book_user_provided");
    return {
      slug: topic.slug,
      title: topic.title,
      section: topic.section,
      reviewedQuestions: topicQuestions.length,
      bookBackedQuestions: bookBacked.length,
      sourceTypes: countBy(topicQuestions.map((question) => question.provenance.sourceType)),
      needsAiSpotCheck: topicQuestions.length < 150 || weakExplanations.some((question) => question.topic === topic.slug)
    };
  });

  return {
    generatedAt: new Date().toISOString(),
    reviewer: {
      orchestrator: "DeepSeek V4 Pro content audit hook",
      workerPolicy: "Shard notes/questions by section and topic; run flash reviewer agents for coverage, explanation quality, duplicate risk, and 200/200 speed usefulness.",
      status: "report-ready; provider calls run through dedicated audit/review scripts when API keys are configured"
    },
    corpus: {
      totalQuestions: questions.length,
      reviewedQuestions: reviewed.length,
      sourceTypes: countBy(questions.map((question) => question.provenance.sourceType)),
      reviewStatuses: countBy(questions.map((question) => question.reviewStatus)),
      explanationCoverage: {
        withExplanation: reviewed.length - explanationMissing.length,
        missing: explanationMissing.length,
        weakUnder80Chars: weakExplanations.length
      }
    },
    topics: {
      total: topics.length,
      readyAt150Reviewed: topicRows.filter((topic) => topic.reviewedQuestions >= 150).length,
      readyAt500Reviewed: topicRows.filter((topic) => topic.reviewedQuestions >= 500).length,
      weakest: [...topicRows].sort((a, b) => a.reviewedQuestions - b.reviewedQuestions).slice(0, 12),
      spotCheckQueue: topicRows.filter((topic) => topic.needsAiSpotCheck).slice(0, 24)
    },
    gates: {
      allReviewedQuestionsHaveExplanations: explanationMissing.length === 0,
      noThinTopicBelow150Reviewed: topicRows.every((topic) => topic.reviewedQuestions >= 150),
      allSectionsRepresented: sscCglPattern.sections.every((section) => reviewed.some((question) => question.section === section.id))
    }
  };
}

export function buildExamData(options: BuildExamDataOptions = {}) {
  const generatedRoot = options.generatedRoot || path.join(process.cwd(), "data", "generated");
  const outputRoot = path.join(generatedRoot, "exams", "ssc-cgl");
  const questions = buildSscCglQuestions();
  const topics = buildSscCglTopics(questions);
  const tests = buildSscCglTestSummaries(questions);
  const data = {
    generatedAt: new Date().toISOString(),
    exam: {
      code: "SSC-CGL" as const,
      year: 2026 as const,
      tier: "Tier-I" as const,
      officialNoticeUrl: "https://ssc.gov.in/api/attachment/uploads/masterData/NoticeBoards/Notice_of_adv_cgl_2026.pdf",
      pattern: sscCglPattern
    },
    questions,
    topics,
    tests
  };
  const validation = validateSscCglExamData(data);
  const aiAudit = buildSscCglAiAuditReport(questions, topics);

  if (!validation.ok) {
    throw new Error(`SSC CGL generated data failed validation:\n${validation.errors.join("\n")}`);
  }

  writeJson(path.join(outputRoot, "index.json"), data);
  writeJson(path.join(outputRoot, "questions.json"), questions);
  writeJson(path.join(outputRoot, "topics.json"), topics);
  writeJson(path.join(outputRoot, "tests.json"), tests);
  writeJson(path.join(outputRoot, "validation-report.json"), validation);
  writeJson(path.join(outputRoot, "ai-audit-report.json"), aiAudit);

  const catOutputRoot = path.join(generatedRoot, "exams", "cat");
  const catQuestions: CatQuantQuestion[] = buildCatQuantQuestions();
  const catTopics: CatQuantTopic[] = buildCatQuantTopics(catQuestions);
  const catData = {
    generatedAt: new Date().toISOString(),
    exam: {
      code: "CAT" as const,
      activeSection: "quantitative-aptitude" as const,
      sourceTitle: "Quantitative Aptitude Quantum CAT by Sarvesh K. Verma"
    },
    questions: catQuestions,
    topics: catTopics
  };
  const catValidation = validateCatQuantData(catData);
  if (!catValidation.ok) {
    throw new Error(`CAT Quant generated data failed validation:\n${catValidation.errors.join("\n")}`);
  }
  writeJson(path.join(catOutputRoot, "index.json"), catData);
  writeJson(path.join(catOutputRoot, "questions.json"), catQuestions);
  writeJson(path.join(catOutputRoot, "topics.json"), catTopics);
  writeJson(path.join(catOutputRoot, "validation-report.json"), catValidation);

  const gateOutputRoot = path.join(generatedRoot, "exams", "gate");
  const gateSourceRoot = path.join(process.cwd(), "data", "exams", "gate");
  const gateData = buildGateDataFromSource(
    JSON.parse(fs.readFileSync(path.join(gateSourceRoot, "questions.json"), "utf8")),
    JSON.parse(fs.readFileSync(path.join(gateSourceRoot, "topics.json"), "utf8"))
  );
  const gateValidation = validateGateData(gateData);
  if (!gateValidation.ok) {
    throw new Error(`GATE generated data failed validation:\n${gateValidation.errors.join("\n")}`);
  }
  writeJson(path.join(gateOutputRoot, "index.json"), gateData);
  writeJson(path.join(gateOutputRoot, "questions.json"), gateData.questions);
  writeJson(path.join(gateOutputRoot, "topics.json"), gateData.topics);
  writeJson(path.join(gateOutputRoot, "validation-report.json"), gateValidation);

  return { data, validation, aiAudit, catData, catValidation, gateData, gateValidation };
}

if (import.meta.url === pathToFileURL(process.argv[1] || "").href) {
  const result = buildExamData();
  console.log(`Generated ${result.data.questions.length} SSC CGL questions, ${result.data.topics.length} topics, and ${result.data.tests.length} tests.`);
  console.log(`Generated ${result.catData.questions.length} CAT Quant questions and ${result.catData.topics.length} topics.`);
  console.log(`Generated ${result.gateData.questions.length} GATE EE/DA questions and ${result.gateData.topics.length} syllabus topics.`);
}
