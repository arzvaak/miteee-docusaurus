import assert from "node:assert/strict";
import test from "node:test";
import { buildExamData } from "@/scripts/build-exam-data";
import { scoreSscAttempt, simulateSscRank } from "@/lib/ssc-cgl-tests";
import { getSscCglTest, getSscCglTests, getSscQuestions, getSscTopic, getSscCglTopicCoverageMap, validateSscCglExamData } from "@/lib/ssc-cgl";
import { buildSscCglTestSummaries } from "@/lib/ssc-cgl-source";
import { isLearnerGradeSscQuestion } from "@/lib/ssc-cgl-quality";
import type { SscCglAttemptInput, SscCglQuestion, SscCglTestDetail } from "@/lib/exam-types";

test.before(() => {
  buildExamData();
});

function syntheticQuestion(id: string, topic: string, section: SscCglQuestion["section"] = "reasoning"): SscCglQuestion {
  return {
    id,
    exam: "SSC-CGL",
    tier: "Tier-I",
    year: 2026,
    shift: "Synthetic scoring fixture",
    source: "Imported PDF",
    section,
    topic,
    subtopic: topic,
    difficulty: "easy",
    language: "en",
    stem: `Fixture question ${id}`,
    options: [
      { id: "a", text: "Correct" },
      { id: "b", text: "Wrong B" },
      { id: "c", text: "Wrong C" },
      { id: "d", text: "Wrong D" }
    ],
    correctOption: "a",
    explanation: "Fixture explanation.",
    marksCorrect: 2,
    marksWrong: -0.5,
    marksUnattempted: 0,
    timerSeconds: 900,
    ocrConfidence: 1,
    reviewStatus: "reviewed",
    conceptTags: ["fixture"],
    provenance: {
      sourceId: "fixture",
      sourceType: "book_user_provided",
      title: "Fixture",
      licenseNote: "Fixture for scoring tests."
    }
  };
}

function syntheticTestDetail(questions: SscCglQuestion[]): SscCglTestDetail {
  const timerSeconds = questions.length * 36;
  return {
    id: "synthetic-scoring-test",
    title: "Synthetic Scoring Test",
    mode: "speed_sprint",
    questionCount: questions.length,
    maxScore: questions.length * 2,
    durationSeconds: timerSeconds,
    sourceType: "book_user_provided",
    reviewStatus: "reviewed",
    description: "Fixture test detail.",
    sections: [
      {
        id: questions[0]?.section ?? "reasoning",
        title: "General Intelligence and Reasoning",
        timerSeconds,
        questions
      }
    ]
  };
}

test("scoreSscAttempt applies +2, -0.5, and zero for unattempted", () => {
  const testDetail = syntheticTestDetail([
    syntheticQuestion("q1", "analogy-classification"),
    syntheticQuestion("q2", "series-coding"),
    syntheticQuestion("q3", "blood-relation"),
    syntheticQuestion("q4", "calendar-clock")
  ]);
  const questions = testDetail.sections.flatMap((section) => section.questions).slice(0, 4);
  const wrongOption = questions[1]!.options.find((option) => option.id !== questions[1]!.correctOption)!.id;

  const result = scoreSscAttempt(testDetail, {
    attemptId: "attempt-1",
    startedAt: "2026-06-25T01:30:00.000Z",
    submittedAt: "2026-06-25T02:30:00.000Z",
    answers: {
      [questions[0]!.id]: questions[0]!.correctOption,
      [questions[1]!.id]: wrongOption,
      [questions[2]!.id]: null
    },
    sectionTimeSpentSeconds: Object.fromEntries(testDetail.sections.map((section) => [section.id, 100]))
  });

  assert.equal(result.correct, 1);
  assert.equal(result.wrong, 1);
  assert.equal(result.unattempted, 2);
  assert.equal(result.score, 1.5);
  assert.equal(result.maxScore, 8);
  assert.equal(result.marksLost, 6.5);
  assert.equal(result.scoreGapTo200, 6.5);
  assert.equal(result.pacingStatus, "rushed");
  assert.match(result.nextBestAction, /wrong answers/i);
  assert.equal(result.sectionResults.length, 1);
  assert.equal(result.sectionResults[0]!.targetScore, 8);
  assert.equal(result.sectionResults[0]!.marksLost, 6.5);
  assert.equal(result.sectionResults[0]!.averageSecondsPerQuestion, 25);
  assert.equal(result.sectionResults[0]!.targetSecondsPerQuestion, 36);
  assert.equal(result.sectionResults[0]!.targetStatus, "repair-both");
});

test("scoreSscAttempt reports 50/50 section mastery and 36-second pacing", () => {
  const questions = Array.from({ length: 25 }, (_, index) => syntheticQuestion(
    `quant-perfect-${index + 1}`,
    "calculation-speed",
    "quantitative-aptitude"
  ));
  const testDetail = syntheticTestDetail(questions);
  const result = scoreSscAttempt(testDetail, {
    attemptId: "attempt-perfect-quant",
    startedAt: "2026-06-25T01:30:00.000Z",
    submittedAt: "2026-06-25T01:45:00.000Z",
    answers: Object.fromEntries(questions.map((question) => [question.id, question.correctOption])),
    sectionTimeSpentSeconds: { "quantitative-aptitude": 900 }
  });

  assert.equal(result.score, 50);
  assert.equal(result.maxScore, 50);
  assert.equal(result.marksLost, 0);
  assert.equal(result.averageSecondsPerQuestion, 36);
  assert.equal(result.targetSecondsPerQuestion, 36);
  assert.equal(result.pacingStatus, "on-pace");
  assert.match(result.nextBestAction, /Perfect stored attempt/i);
  assert.equal(result.sectionResults[0]!.score, 50);
  assert.equal(result.sectionResults[0]!.targetScore, 50);
  assert.equal(result.sectionResults[0]!.targetStatus, "perfect");
  assert.equal(result.sectionResults[0]!.recommendedAction.includes("Perfect section"), true);
});

test("scoreSscAttempt builds a repair queue from wrong and unattempted answers", () => {
  const testDetail = syntheticTestDetail([
    syntheticQuestion("q1", "analogy-classification"),
    syntheticQuestion("q2", "analogy-classification"),
    syntheticQuestion("q3", "series-coding"),
    syntheticQuestion("q4", "blood-relation")
  ]);
  const questions = testDetail.sections.flatMap((section) => section.questions);
  const firstQuestion = questions[0]!;
  const sameTopic = questions.find((question) => question.id !== firstQuestion.id && question.topic === firstQuestion.topic);
  const otherTopic = questions.find((question) => question.topic !== firstQuestion.topic);
  assert.ok(sameTopic);
  assert.ok(otherTopic);

  const wrongOption = firstQuestion.options.find((option) => option.id !== firstQuestion.correctOption)!.id;
  const answers: SscCglAttemptInput["answers"] = Object.fromEntries(questions.map((question) => [question.id, question.correctOption]));
  answers[firstQuestion.id] = wrongOption;
  answers[sameTopic.id] = null;
  answers[otherTopic.id] = null;
  const result = scoreSscAttempt(testDetail, {
    attemptId: "attempt-repair",
    startedAt: "2026-06-26T01:30:00.000Z",
    submittedAt: "2026-06-26T01:45:00.000Z",
    answers,
    sectionTimeSpentSeconds: { reasoning: 900 }
  });

  assert.ok(result.repairQueue.length >= 2);
  assert.equal(result.repairQueue[0]!.slug, firstQuestion.topic);
  assert.equal(result.repairQueue[0]!.wrong, 1);
  assert.equal(result.repairQueue[0]!.unattempted, 1);
  assert.equal(result.repairQueue[0]!.totalRepair, 2);
  assert.equal(result.repairQueue[0]!.href, `/exams/ssc-cgl/practice/${firstQuestion.topic}`);
  assert.match(result.repairQueue[0]!.recommendedAction, /wrong answer|unattempted/i);
  assert.ok(result.repairQueue.some((item) => item.slug === otherTopic.topic && item.unattempted >= 1));
});

test("simulateSscRank rewards higher score and speed", () => {
  const fastHigh = simulateSscRank({ score: 180, maxScore: 200, accuracy: 0.92, totalTimeSeconds: 3100 });
  const slowLow = simulateSscRank({ score: 92, maxScore: 200, accuracy: 0.58, totalTimeSeconds: 3550 });

  assert.ok(fastHigh.percentile > slowLow.percentile);
  assert.ok(fastHigh.rankBucket.includes("Top"));
  assert.ok(slowLow.rankBucket.includes("Repair"));
});

test("SSC CGL full mocks are generated from the balanced reviewed uploaded-book corpus", () => {
  const fullMocks = getSscCglTests().filter((item) => item.mode === "full_mock" && item.id.startsWith("ssc-cgl-book-200-mode-mock-"));
  const sectionCounts = new Map<string, number>();
  for (const question of getSscQuestions().filter((item) => item.provenance.sourceType === "book_user_provided" && isLearnerGradeSscQuestion(item))) {
    sectionCounts.set(question.section, (sectionCounts.get(question.section) ?? 0) + 1);
  }
  const expectedFullMocks = Math.min(...["reasoning", "general-awareness", "quantitative-aptitude", "english-comprehension"].map((section) => (
    Math.floor((sectionCounts.get(section) ?? 0) / 25)
  )));

  assert.ok(expectedFullMocks >= 1, "fixture corpus should be section-balanced enough for at least one full mock");
  assert.equal(fullMocks.length, expectedFullMocks);

  const firstFullMock = getSscCglTest("ssc-cgl-book-200-mode-mock-01");
  assert.ok(firstFullMock);
  assert.equal(firstFullMock.questionCount, 100);
  assert.equal(firstFullMock.maxScore, 200);
  assert.equal(firstFullMock.durationSeconds, 3600);
  assert.equal(firstFullMock.sections.length, 4);
  assert.deepEqual(firstFullMock.sections.map((section) => [section.id, section.questions.length]), [
    ["reasoning", 25],
    ["general-awareness", 25],
    ["quantitative-aptitude", 25],
    ["english-comprehension", 25]
  ]);
  assert.ok(firstFullMock.sections.flatMap((section) => section.questions).every((question) => question.provenance.sourceType === "book_user_provided"));
});

test("SSC CGL ranked practice questions carry method explanations, not answer-only keys", () => {
  const weakExplanations = getSscQuestions()
    .filter((question) => question.reviewStatus === "reviewed")
    .filter((question) => {
      const explanation = question.explanation.trim();
      return explanation.length < 120 || /^answer\s*[:\-]?\s*[abcd]\.?$/i.test(explanation);
    })
    .slice(0, 10)
    .map((question) => `${question.id}: ${question.explanation}`);

  assert.deepEqual(weakExplanations, []);
});

test("SSC CGL reviewed practice explanations expose answer, method, fit, and trap structure", () => {
  const unstructuredExplanations = getSscQuestions()
    .filter((question) => question.reviewStatus === "reviewed")
    .filter((question) => {
      const explanation = question.explanation.trim();
      return !/Correct answer:/i.test(explanation)
        || !/Method:/i.test(explanation)
        || !/Why it fits:/i.test(explanation)
        || !/Trap to avoid:/i.test(explanation);
    })
    .slice(0, 10)
    .map((question) => `${question.id}: ${question.explanation}`);

  assert.deepEqual(unstructuredExplanations, []);
});

test("SSC CGL grammar error explanations use the keyed grammar route instead of generic boilerplate", () => {
  const grammarQuestions = getSscQuestions().filter((question) => (
    question.reviewStatus === "reviewed"
    && question.topic === "grammar-error-spotting"
  ));
  const textFor = (question: SscCglQuestion) => [
    question.stem,
    ...question.options.map((option) => option.text),
    question.explanation
  ].join(" ");

  const connectorQuestion = grammarQuestions.find((question) => /in case that/i.test(textFor(question)));
  assert.ok(connectorQuestion);
  assert.match(connectorQuestion.explanation, /connector and fixed phrase|valid connector|in case/i);
  assert.doesNotMatch(connectorQuestion.explanation, /Find the real subject before choosing verb number/i);

  const verbFormQuestion = grammarQuestions.find((question) => /Knocking down|past simple|had not being/i.test(textFor(question)));
  assert.ok(verbFormQuestion);
  assert.match(verbFormQuestion.explanation, /tense and verb form|main verb timeline|verb-form/i);
  assert.doesNotMatch(verbFormQuestion.explanation, /Phrases between subject and verb distract from agreement/i);

  const sincePastQuestion = grammarQuestions.find((question) => /since the past one week/i.test(textFor(question)));
  assert.ok(sincePastQuestion);
  assert.match(sincePastQuestion.explanation, /time preposition|duration|starting point|36-second/i);
  assert.doesNotMatch(sincePastQuestion.explanation, /subject-verb agreement/i);

  const relativePronounQuestion = grammarQuestions.find((question) => /cobbler which mends/i.test(textFor(question)));
  assert.ok(relativePronounQuestion);
  assert.match(relativePronounQuestion.explanation, /relative pronoun|person|who|36-second/i);
  assert.doesNotMatch(relativePronounQuestion.explanation, /subject-verb agreement/i);

  const comparativeQuestion = grammarQuestions.find((question) => /more smarter/i.test(textFor(question)));
  assert.ok(comparativeQuestion);
  assert.match(comparativeQuestion.explanation, /comparative redundancy|double comparative|36-second/i);
  assert.doesNotMatch(comparativeQuestion.explanation, /conjunction logic/i);

  const unlessQuestion = grammarQuestions.find((question) => /Unless you did not/i.test(textFor(question)));
  assert.ok(unlessQuestion);
  assert.match(unlessQuestion.explanation, /conditional double negative|if not|36-second/i);

  const statePrepositionQuestion = grammarQuestions.find((question) => /at a pure state/i.test(textFor(question)));
  assert.ok(statePrepositionQuestion);
  assert.match(statePrepositionQuestion.explanation, /state preposition|in a state|36-second/i);
  assert.doesNotMatch(statePrepositionQuestion.explanation, /conjunction logic/i);

  const modifierQuestion = grammarQuestions.find((question) => /Entering the hall/i.test(textFor(question)));
  assert.ok(modifierQuestion);
  assert.match(modifierQuestion.explanation, /dangling modifier|opening -ing phrase|36-second/i);
  assert.doesNotMatch(modifierQuestion.explanation, /subject-verb agreement/i);

  const wordChoiceQuestion = grammarQuestions.find((question) => /sense pleasures/i.test(textFor(question)));
  assert.ok(wordChoiceQuestion);
  assert.match(wordChoiceQuestion.explanation, /word choice and collocation|sensuous|36-second/i);
  assert.doesNotMatch(wordChoiceQuestion.explanation, /subject-verb agreement/i);
});

test("SSC CGL validator rejects reviewed questions with answer-only explanations", () => {
  const weak = syntheticQuestion("weak-answer-key-only", "analogy-classification");
  weak.explanation = "Answer: D";
  weak.correctOption = "d";

  const report = validateSscCglExamData({
    generatedAt: "test",
    exam: {
      code: "SSC-CGL",
      year: 2026,
      tier: "Tier-I",
      officialNoticeUrl: "https://ssc.gov.in",
      pattern: {
        totalQuestions: 100,
        totalMarks: 200,
        negativeMarks: -0.5,
        sections: [
          { id: "reasoning", title: "General Intelligence and Reasoning", questionCount: 25, marks: 50, timerSeconds: 900, scribeTimerSeconds: 1200 },
          { id: "general-awareness", title: "General Awareness", questionCount: 25, marks: 50, timerSeconds: 900, scribeTimerSeconds: 1200 },
          { id: "quantitative-aptitude", title: "Quantitative Aptitude", questionCount: 25, marks: 50, timerSeconds: 900, scribeTimerSeconds: 1200 },
          { id: "english-comprehension", title: "English Comprehension", questionCount: 25, marks: 50, timerSeconds: 900, scribeTimerSeconds: 1200 }
        ]
      }
    },
    questions: [weak],
    topics: [
      {
        slug: "analogy-classification",
        title: "Analogy and Classification",
        subject: "General Intelligence and Reasoning",
        section: "reasoning",
        priority: "high-yield",
        study: {
          summary: "Fixture topic.",
          sections: [],
          formulaTable: [],
          flowchart: ""
        },
        practice: {
          questionIds: ["weak-answer-key-only"],
          pyqQuestionIds: ["weak-answer-key-only"],
          bookQuestionIds: ["weak-answer-key-only"],
          gapRepairQuestionIds: [],
          drillPrompt: "Fixture drill.",
          sourceBreakdown: {
            bookUserProvided: 1,
            originalPractice: 0,
            otherReviewed: 0
          }
        }
      }
    ],
    tests: []
  });

  assert.equal(report.ok, false);
  assert.ok(report.errors.some((error) => /weak-answer-key-only.*structured explanation/i.test(error)));
});

test("SSC CGL Quant 50/50 section mock starts from the promoted uploaded-book batch", () => {
  const quantMocks = getSscCglTests().filter((item) => item.id.startsWith("ssc-cgl-quant-50-50-set-"));
  const quantQuestionCount = getSscQuestions().filter((question) => question.section === "quantitative-aptitude" && isLearnerGradeSscQuestion(question)).length;
  const firstQuantMock = getSscCglTest("ssc-cgl-quant-50-50-set-01");
  const secondQuantMock = getSscCglTest("ssc-cgl-quant-50-50-set-02");

  assert.equal(quantMocks.length, Math.floor(quantQuestionCount / 25));
  assert.equal(quantMocks[0]?.questionCount, 25);
  assert.equal(quantMocks[0]?.maxScore, 50);
  assert.ok(firstQuantMock);
    assert.equal(firstQuantMock.sections.length, 1);
    assert.equal(firstQuantMock.sections[0]?.id, "quantitative-aptitude");
    assert.equal(firstQuantMock.sections[0]?.questions.length, 25);
    assert.ok(firstQuantMock.sections[0]?.questions.every((question) => question.provenance.sourceType === "book_user_provided"));
  assert.ok(secondQuantMock);
  assert.equal(secondQuantMock.sections[0]?.questions.length, 25);
  assert.ok(secondQuantMock.sections[0]?.questions.every((question) => question.provenance.sourceType === "book_user_provided"));
});

test("SSC CGL test loader filters section and topic drill landing pages", () => {
  const quantTests = getSscCglTests({ section: "quantitative-aptitude" });
  const calculationTests = getSscCglTests({ topic: "calculation-speed" });

  assert.ok(quantTests.length > 0);
  assert.ok(calculationTests.length > 0);
  assert.ok(quantTests.every((summary) => {
    const detail = getSscCglTest(summary.id);
    return detail?.sections.every((section) => section.id === "quantitative-aptitude");
  }));
  assert.ok(calculationTests.every((summary) => {
    const detail = getSscCglTest(summary.id);
    return detail?.sections.flatMap((section) => section.questions).every((question) => question.topic === "calculation-speed");
  }));
  assert.ok(calculationTests.some((summary) => summary.id === "ssc-cgl-topic-calculation-speed-36-second-drill"));
});

test("SSC CGL test loader filters by practice mode", () => {
  const fullMocks = getSscCglTests({ mode: "full_mock" });
  const topicDrills = getSscCglTests({ mode: "topic_drill" });

  assert.ok(fullMocks.length > 0);
  assert.ok(topicDrills.length > 0);
  assert.ok(fullMocks.every((summary) => summary.mode === "full_mock"));
  assert.ok(topicDrills.every((summary) => summary.mode === "topic_drill"));
  assert.ok(fullMocks.every((summary) => summary.questionCount === 100 && summary.maxScore === 200));
  assert.ok(topicDrills.every((summary) => summary.questionCount <= 25));
});

test("SSC CGL 50/50 section mocks use reviewed book questions plus marked 200/200 gap-repair practice", () => {
  const sectionCounts = new Map<string, number>();
  for (const question of getSscQuestions().filter(isLearnerGradeSscQuestion)) {
    sectionCounts.set(question.section, (sectionCounts.get(question.section) ?? 0) + 1);
  }
  const sections = [
    { id: "reasoning", prefix: "reasoning", title: "Reasoning" },
    { id: "general-awareness", prefix: "general-awareness", title: "General Awareness" },
    { id: "quantitative-aptitude", prefix: "quant", title: "Quantitative Aptitude" },
    { id: "english-comprehension", prefix: "english", title: "English Comprehension" }
  ] as const;

  for (const section of sections) {
    const mocks = getSscCglTests().filter((item) => item.id.startsWith(`ssc-cgl-${section.prefix}-50-50-set-`));
    assert.equal(mocks.length, Math.floor((sectionCounts.get(section.id) ?? 0) / 25));
    const usedQuestionIds = new Set<string>();
    for (const mock of mocks) {
      const detail = getSscCglTest(mock.id);
      assert.ok(detail);
      const questions = detail.sections.flatMap((testSection) => testSection.questions);
      assert.equal(questions.length, 25);
      assert.ok(questions.every((question) => (
        question.provenance.sourceType === "book_user_provided"
        || question.provenance.sourceType === "original_practice"
      )));
      for (const question of questions) {
        assert.equal(usedQuestionIds.has(question.id), false, `${section.title} section mocks should not reuse ${question.id}`);
        usedQuestionIds.add(question.id);
      }
    }
  }
});

test("SSC CGL topic coverage map enforces a real 200/200 sufficiency gate", () => {
  const coverage = getSscCglTopicCoverageMap();
  const allRows = coverage.sections.flatMap((section) => section.rows);

  assert.equal(allRows.length, coverage.totalTopics);
  assert.equal(coverage.masteryTargetQuestionsPerTopic, 500);
  assert.equal(coverage.bookBackedTargetQuestionsPerTopic, 300);
  assert.equal(coverage.deepNoteTargetChars, 9000);
  assert.equal(coverage.exampleTargetPerTopic, 10);
  assert.equal(coverage.topicsPracticeSufficient, allRows.filter((row) => row.practiceReady).length);
  assert.equal(coverage.topicsFullySufficient, allRows.filter((row) => row.masteryReady).length);
  assert.equal(coverage.masteryGateFailures, allRows.filter((row) => !row.masteryReady).length);
  assert.equal(coverage.topicsWithTimedDrills, allRows.filter((row) => row.hasTimedDrill).length);
  assert.equal(coverage.topicsWithTimedDrills, coverage.totalTopics);
  assert.equal(coverage.topicsPracticeSufficient, coverage.totalTopics);
  assert.equal(coverage.weakestTopics.length, Math.min(8, allRows.length));
  assert.ok(coverage.weakestTopics.every((row) => row.sufficiencyScore < 100 || !row.masteryReady));
  assert.ok(allRows.every((row) => row.sufficiencyScore >= 0 && row.sufficiencyScore <= 100));
  assert.ok(allRows.every((row) => row.practiceReady));
  assert.ok(allRows.every((row) => row.masteryReady === (row.sufficiencyGaps.length === 0)));
  assert.ok(allRows.every((row) => row.bookFloorGap === Math.max(0, coverage.bookBackedTargetQuestionsPerTopic - row.bookBackedQuestions)));
  assert.ok(allRows.every((row) => row.hasTimedDrill));
});

test("SSC CGL partial book imports do not create empty section tests", () => {
  const partialQuantQuestions = Array.from({ length: 10 }, (_, index) => syntheticQuestion(
    `book-quant-${index + 1}`,
    "percentages",
    "quantitative-aptitude"
  ));
  const summaries = buildSscCglTestSummaries(partialQuantQuestions);

  assert.ok(summaries.length > 0);
  assert.ok(summaries.every((summary) => summary.questionIds.length > 0));
  assert.ok(summaries.every((summary) => summary.questionIds.every((questionId) => questionId.startsWith("book-quant-"))));
});

test("SSC CGL Quant calculation-speed is a deep 36-second drill lane", () => {
  const topic = getSscTopic("calculation-speed");
  assert.ok(topic);
  assert.equal(topic.subject, "Quantitative Aptitude");
  assert.equal(topic.priority, "speed");
  assert.match(topic.study.summary, /36-second|calculation/i);
  assert.ok(topic.practice.questionIds.length >= 2);

  const drill = getSscCglTests().find((item) => item.id === "ssc-cgl-topic-calculation-speed-36-second-drill");
  assert.ok(drill);
  assert.equal(drill.questionCount, 25);
});

test("SSC CGL Quant averages-mixtures-alligation is a dedicated 36-second drill lane", () => {
  const topic = getSscTopic("averages-mixtures-alligation");
  assert.ok(topic);
  assert.equal(topic.subject, "Quantitative Aptitude");
  assert.equal(topic.priority, "high-yield");
  assert.match(topic.study.summary, /average|mixture|alligation|36-second/i);
  assert.ok(topic.practice.questionIds.length >= 200);

  const drill = getSscCglTests().find((item) => item.id === "ssc-cgl-topic-averages-mixtures-alligation-36-second-drill");
  assert.ok(drill);
  assert.equal(drill.questionCount, 25);
});
