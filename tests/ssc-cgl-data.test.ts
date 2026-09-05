import assert from "node:assert/strict";
import test from "node:test";
import { buildExamData } from "@/scripts/build-exam-data";
import {
  getSscCglDashboard,
  getSscCglTopicCoverageMap,
  getSscCglTests,
  getSscCglTest,
  getSscCglPracticeTopics,
  getSscCglTopicPracticeSet,
  getSscCglResources,
  getSscQuestions,
  getSscTopic,
  getSscTopicPracticePreview,
  getSscTopics,
  validateSscCglExamData
} from "@/lib/ssc-cgl";
import { isLearnerGradeSscQuestion } from "@/lib/ssc-cgl-quality";

test.before(() => {
  buildExamData();
});

test("SSC CGL dashboard exposes the official 2026 Tier-I pattern", () => {
  const dashboard = getSscCglDashboard();

  assert.equal(dashboard.exam.code, "SSC-CGL");
  assert.equal(dashboard.exam.year, 2026);
  assert.equal(dashboard.exam.pattern.totalQuestions, 100);
  assert.equal(dashboard.exam.pattern.totalMarks, 200);
  assert.equal(dashboard.exam.pattern.negativeMarks, -0.5);
  assert.equal(dashboard.exam.pattern.sections.length, 4);
  assert.deepEqual(dashboard.exam.pattern.sections.map((section) => section.timerSeconds), [900, 900, 900, 900]);
  assert.equal(dashboard.readiness.reviewedQuestions, getSscQuestions().filter((question) => question.reviewStatus === "reviewed").length);
  assert.equal(dashboard.readiness.reviewQueue, 0);
  assert.equal(dashboard.readiness.fullMocks, getSscCglTests().filter((test) => test.mode === "full_mock").length);
  assert.equal(dashboard.readiness.sectionReadiness.length, 4);
  assert.ok(dashboard.readiness.sectionReadiness.every((section) => section.reviewedQuestions >= 150 * section.topics));
  assert.ok(dashboard.readiness.sectionReadiness.every((section) => section.thinTopics === 0));
  assert.ok(dashboard.readiness.topicReadiness.length >= dashboard.readiness.topics);
  assert.ok(dashboard.readiness.pressureQueue.length > 0);
  assert.ok(dashboard.readiness.pressureQueue.every((topic) => topic.nextAction.length > 20));
  assert.equal(dashboard.readiness.testModeCounts.full_mock, dashboard.readiness.fullMocks);
  assert.ok(dashboard.readiness.repairPlan.length >= 5);
  assert.equal(dashboard.readiness.repairPlan[0]?.id, "quant-36-second-sprint");
  assert.match(dashboard.readiness.repairPlan[0]?.title ?? "", /36-second/i);
  assert.ok(dashboard.readiness.repairPlan.some((item) => item.href === "/exams/ssc-cgl/current-affairs"));
  assert.ok(dashboard.readiness.repairPlan.some((item) => item.href.startsWith("/exams/ssc-cgl/practice/")));
  assert.ok(dashboard.readiness.repairPlan.every((item) => item.minutes > 0 && item.target.length > 20));
  assert.equal(dashboard.readiness.studyDepth.totalTopics, dashboard.readiness.topics);
  assert.equal(dashboard.readiness.studyDepth.topicsWithNotes, 0);
  assert.equal(dashboard.readiness.studyDepth.missingNotes, dashboard.readiness.topics);
  assert.equal(dashboard.readiness.studyDepth.deepNotes, 0);
  assert.equal(dashboard.readiness.studyDepth.totalExamples, 0);
  assert.ok(dashboard.readiness.studyDepth.weakestNotes.length > 0);
  assert.ok(dashboard.readiness.studyDepth.weakestNotes.every((note) => note.href.startsWith("/exams/ssc-cgl/practice/")));
  assert.equal(dashboard.readiness.strictAudit.readyFor200, true);
  assert.ok(dashboard.readiness.strictAudit.gates.length >= 7);
  assert.deepEqual(
    dashboard.readiness.strictAudit.gates
      .filter((gate) => gate.status !== "pass")
      .map((gate) => gate.id),
    []
  );
  assert.deepEqual(
    ["book-corpus-completeness", "topic-mastery", "current-affairs"].filter((gateId) => (
      !dashboard.readiness.strictAudit.gates.some((gate) => gate.id === gateId)
    )),
    []
  );
  const bookBackedQuestions = getSscQuestions().filter((question) => (
    question.reviewStatus === "reviewed"
    && question.provenance.sourceType === "book_user_provided"
  )).length;
  assert.ok(dashboard.readiness.strictAudit.summary.includes(bookBackedQuestions.toLocaleString("en-US")));
  assert.ok(dashboard.readiness.strictAudit.summary.includes("46/46"));
  assert.match(dashboard.readiness.strictAudit.summary, /current affairs \d{4}-\d{2}-\d{2}/);
});

test("SSC CGL topic coverage map proves every question-only sublevel has corpus depth", () => {
  const coverage = getSscCglTopicCoverageMap();

  assert.equal(coverage.sections.length, 4);
  assert.equal(coverage.totalTopics, getSscTopics().length);
  assert.equal(coverage.totalReviewedQuestions, getSscQuestions().filter((question) => question.reviewStatus === "reviewed").length);
  assert.equal(coverage.masteryTargetQuestionsPerTopic, 500);
  assert.ok(coverage.minimumReviewedQuestions >= coverage.masteryTargetQuestionsPerTopic);
  assert.equal(coverage.topicsAtMastery + coverage.topicsBelowMastery, coverage.totalTopics);
  assert.equal(coverage.topicsAtMastery, coverage.totalTopics);
  assert.equal(coverage.topicsBelowMastery, 0);
  assert.equal(coverage.weakestTopics.length, Math.min(8, coverage.totalTopics));
  assert.equal(coverage.thinTopics, 0);
  assert.equal(coverage.deepNotes, 0);
  assert.ok(coverage.sections.every((section) => section.rows.length === section.topics));
  assert.ok(coverage.sections.every((section) => section.reviewedQuestions >= 150 * section.topics));
  assert.ok(coverage.sections.every((section) => section.deepNotes === 0));

  const allRows = coverage.sections.flatMap((section) => section.rows);
  assert.equal(allRows.length, coverage.totalTopics);
  assert.deepEqual(
    allRows
      .filter((row) => row.href !== `/exams/ssc-cgl/practice/${row.slug}`)
      .map((row) => ({ slug: row.slug, href: row.href })),
    []
  );
  assert.ok(allRows.every((row) => row.drillHref.startsWith("/exams/ssc-cgl/tests")));
  assert.ok(allRows.every((row) => row.reviewedQuestions >= coverage.masteryTargetQuestionsPerTopic));
  assert.ok(allRows.every((row) => row.exampleCount === 0));
  assert.equal(coverage.minimumReviewedQuestions, Math.min(...allRows.map((row) => row.reviewedQuestions)));
  assert.deepEqual(
    coverage.weakestTopics.map((row) => row.slug),
    [...allRows]
      .sort((a, b) => a.reviewedQuestions - b.reviewedQuestions || a.bookBackedQuestions - b.bookBackedQuestions || a.title.localeCompare(b.title))
      .slice(0, 8)
      .map((row) => row.slug)
  );
  assert.ok(allRows.some((row) => row.sectionRank === 1 && row.section === "quantitative-aptitude"));
});

test("SSC CGL generated data is book-only after the first uploaded-book promotions", () => {
  const report = validateSscCglExamData();
  const tests = getSscCglTests();

  assert.equal(report.ok, true, report.errors.join("\n"));
  assert.equal(report.duplicateQuestionIds.length, 0);
  assert.equal(report.reviewedQuestions, getSscQuestions().filter((question) => question.reviewStatus === "reviewed").length);
  assert.equal(report.unverifiedQuestions, 0);
  assert.ok(tests.length > 0);
  assert.ok(tests.every((practiceTest) => practiceTest.questionCount > 0));
});

test("SSC CGL resource map exposes learner-facing source lanes", () => {
  const resources = getSscCglResources();
  const laneById = new Map(resources.lanes.map((lane) => [lane.id, lane]));

  assert.ok(resources.totalCandidates >= 180);
  assert.ok(resources.sourceRegistryCount >= 8);
  assert.equal(resources.activePracticeQuestions, getSscQuestions().filter((question) => question.reviewStatus === "reviewed").length);
  assert.equal(resources.bookBackedQuestions, getSscQuestions().filter((question) => question.reviewStatus === "reviewed" && question.provenance.sourceType === "book_user_provided").length);
  assert.ok((laneById.get("book-pyq")?.count ?? 0) >= 1);
  assert.ok((laneById.get("official")?.count ?? 0) >= 1);
  assert.ok((laneById.get("web-pdf")?.count ?? 0) >= 1);
  assert.ok((laneById.get("scribd-reference")?.count ?? 0) >= 1);
  assert.ok((laneById.get("model-practice")?.count ?? 0) >= 1);
  assert.ok(resources.lanes.every((lane) => lane.label.length > 5 && lane.nextUse.length > 15));
  assert.ok(resources.featuredCandidates.length > 0);
  assert.ok(resources.featuredCandidates.every((candidate) => candidate.statusLabel.length > 0 && candidate.snippet.length > 0));
});

test("SSC CGL corpus explanations use the question type, not a generic structured shell", () => {
  const numberAnalogy = getSscQuestions().find((question) => (
    question.reviewStatus === "reviewed"
    && question.topic === "analogy-classification"
    && /number-pair|numbers are related|set in which the numbers/i.test(question.stem)
  ));

  assert.ok(numberAnalogy, "expected at least one reviewed number analogy question");
  assert.match(numberAnalogy.explanation, /number|square|cube|digit|operation|ratio|difference|series/i);
  assert.doesNotMatch(numberAnalogy.explanation, /synonym, function, part-whole, class-member, cause-effect/i);
  assert.doesNotMatch(numberAnalogy.explanation, /answer must match the exact condition in the stem/i);

  const genericShells = getSscQuestions()
    .filter((question) => question.reviewStatus === "reviewed")
    .filter((question) => (
      /answer must match the exact condition in the stem/i.test(question.explanation)
      || /synonym, function, part-whole, class-member, cause-effect/i.test(question.explanation)
    ))
    .slice(0, 10)
    .map((question) => question.id);

  assert.deepEqual(genericShells, []);
});

test("SSC CGL DI practice excludes orphaned table fragments and uses DI-specific explanation routes", () => {
  const questions = getSscQuestions();
  const badFragmentIds = new Set([
    "ssc-cgl-agent-curated-2026-6d3622f96168",
    "ssc-cgl-agent-curated-2026-c923881eb9eb"
  ]);
  const presentBadFragments = questions
    .filter((question) => badFragmentIds.has(question.id))
    .map((question) => question.id);

  assert.deepEqual(presentBadFragments, []);

  const diQuestions = questions.filter((question) => (
    question.reviewStatus === "reviewed"
    && question.topic === "data-interpretation"
  ));
  assert.ok(diQuestions.length >= 500);

  const passageOptionFragments = diQuestions
    .filter((question) => {
      const longOptions = question.options.filter((option) => option.text.length > 70).length;
      return question.stem.split(/\s+/).length <= 16 && longOptions >= 2;
    })
    .slice(0, 5)
    .map((question) => question.id);
  assert.deepEqual(passageOptionFragments, []);

  const orphanedTableRows = diQuestions
    .filter((question) => /^\s*(?:[%:.,]|\d|\b[PQRSTUV]\b|\b[ABCDE]\b|\s)+/i.test(question.stem))
    .filter((question) => /\b(?:what|which|find|calculate|how many|percentage|ratio|average|difference|total)\b/i.test(question.stem))
    .filter((question) => !/\b(?:given|following|table|chart|graph|pie|bar|line|study)\b/i.test(question.stem))
    .slice(0, 5)
    .map((question) => question.id);
  assert.deepEqual(orphanedTableRows, []);

  const sample = diQuestions.find((question) => /table|chart|graph|sales|candidates|data interpretation/i.test(question.stem));
  assert.ok(sample);
  assert.match(sample.explanation, /data interpretation/i);
  assert.match(sample.explanation, /36-second DI route/i);
  assert.match(sample.explanation, /row, column, unit, and base/i);
  assert.match(sample.explanation, /option gap/i);
  assert.doesNotMatch(sample.explanation, /classification question/i);
});

test("SSC CGL word analogies are not explained as coded-letter drills", () => {
  const wordAnalogy = getSscQuestions().find((question) => (
    question.reviewStatus === "reviewed"
    && question.topic === "analogy-classification"
    && /word-pair|related to.*same way|same relationship/i.test(question.stem)
    && !/\b[A-Z]{2,}\b/.test(question.stem)
  ));

  assert.ok(wordAnalogy, "expected at least one reviewed word analogy question");
  assert.match(wordAnalogy.explanation, /word analogy|relation family|same relation/i);
  assert.doesNotMatch(wordAnalogy.explanation, /coded-letter|Convert letters to positions|letter group/i);

  const dayPlanetAnalogy = getSscQuestions().find((question) => (
    question.reviewStatus === "reviewed"
    && question.topic === "analogy-classification"
    && /Tuesday|Thursday|Mars|Jupiter/i.test(question.stem)
  ));

  assert.ok(dayPlanetAnalogy, "expected day/planet analogy from the book corpus");
  assert.match(dayPlanetAnalogy.explanation, /word analogy|relation family|same relation/i);
  assert.doesNotMatch(dayPlanetAnalogy.explanation, /coded-letter|letter group|letters to positions/i);
});

test("SSC CGL full mocks are generated once the book corpus is section-balanced", () => {
  const tests = getSscCglTests();
  const fullMocks = tests.filter((item) => item.mode === "full_mock" && item.id.startsWith("ssc-cgl-book-200-mode-mock-"));

  assert.ok(fullMocks.length >= 1);
  assert.ok(fullMocks.every((mock) => mock.questionCount === 100 && mock.maxScore === 200 && mock.durationSeconds === 3600));
  assert.equal(getSscCglTest("ssc-cgl-200-mode-seed"), null);
});

test("SSC CGL old promoted full mocks do not survive the book-corpus reset", () => {
  const tests = getSscCglTests();
  const yearMocks = tests.filter((item) => item.mode === "full_mock" && item.id.startsWith("ssc-cgl-agent-curated-pyq-year-"));

  assert.deepEqual(yearMocks, []);
  for (const pyqShift of tests.filter((item) => item.mode === "pyq_shift")) {
    const detail = getSscCglTest(pyqShift.id);
    assert.ok(detail);
    assert.ok(detail.sections.flatMap((section) => section.questions).every((question) => question.provenance.sourceType === "book_user_provided"));
  }
});

test("SSC CGL topic records preserve every reviewed practice mapping", () => {
  const topic = getSscTopic("percentages");
  const probability = getSscTopic("probability");

  assert.ok(topic);
  assert.equal(topic.slug, "percentages");
  assert.equal(topic.subject, "Quantitative Aptitude");
  assert.equal(
    topic.practice.questionIds.length,
    topic.practice.bookQuestionIds.length + topic.practice.gapRepairQuestionIds.length + topic.practice.sourceBreakdown.otherReviewed
  );
  assert.ok(topic.practice.gapRepairQuestionIds.length > 0);
  assert.ok(topic.practice.pyqQuestionIds.length >= 12);
  assert.ok(probability);
  assert.equal(probability.subject, "Quantitative Aptitude");
  assert.ok(probability.practice.pyqQuestionIds.length >= 50);
});

test("SSC CGL reasoning book corpus has usable practice depth for every core reasoning topic", () => {
  const reasoningQuestions = getSscQuestions().filter((question) => question.section === "reasoning");
  const counts = new Map<string, number>();

  for (const question of reasoningQuestions) {
    counts.set(question.topic, (counts.get(question.topic) ?? 0) + 1);
  }

  const requiredMinimums = new Map([
    ["analogy-classification", 250],
    ["series-coding", 250],
    ["non-verbal-reasoning", 200],
    ["syllogism-venn", 150],
    ["blood-relation", 150],
    ["mathematical-operations", 100],
    ["direction-distance", 100],
    ["seating-arrangement", 100],
    ["statement-conclusion", 100],
    ["calendar-clock", 100]
  ]);

  const underfilled = [...requiredMinimums.entries()]
    .map(([topic, minimum]) => ({ topic, minimum, actual: counts.get(topic) ?? 0 }))
    .filter((item) => item.actual < item.minimum);

  assert.deepEqual(underfilled, []);
});

test("SSC CGL reviewed corpus reaches the 500-question mastery floor for every topic", () => {
  const counts = new Map<string, number>();

  for (const question of getSscQuestions().filter((item) => item.reviewStatus === "reviewed")) {
    const key = `${question.section} | ${question.topic}`;
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }

  const underfilled = getSscTopics()
    .map((topic) => {
      const key = `${topic.section} | ${topic.slug}`;
      return { key, actual: counts.get(key) ?? 0, minimum: 500 };
    })
    .filter((item) => item.actual < item.minimum);

  assert.deepEqual(underfilled, []);
});

test("SSC CGL topic practice exposes book-backed versus gap-repair coverage", () => {
  const questions = getSscQuestions();

  for (const topic of getSscTopics()) {
    const topicQuestions = questions.filter((question) => question.topic === topic.slug && question.reviewStatus === "reviewed");
    const bookBacked = topicQuestions.filter((question) => question.provenance.sourceType === "book_user_provided");
    const gapRepair = topicQuestions.filter((question) => question.provenance.sourceType === "original_practice" && question.conceptTags.includes("gap-repair"));

    assert.equal(topic.practice.bookQuestionIds.length, bookBacked.length, `${topic.slug} book-backed count should match provenance`);
    assert.equal(topic.practice.gapRepairQuestionIds.length, gapRepair.length, `${topic.slug} gap-repair count should match provenance`);
    assert.equal(topic.practice.sourceBreakdown.bookUserProvided, bookBacked.length);
    assert.equal(topic.practice.sourceBreakdown.originalPractice, gapRepair.length);
    assert.equal(
      topic.practice.sourceBreakdown.bookUserProvided + topic.practice.sourceBreakdown.originalPractice + topic.practice.sourceBreakdown.otherReviewed,
      topic.practice.questionIds.length
    );
  }

  const vocabularyCloze = getSscTopic("vocabulary-cloze");
  assert.ok(vocabularyCloze);
  assert.ok(vocabularyCloze.practice.sourceBreakdown.bookUserProvided >= 300);
  assert.ok(vocabularyCloze.practice.sourceBreakdown.originalPractice <= 150);
});

test("SSC CGL one-by-one practice exposes every usable question by topic", () => {
  const practiceTopics = getSscCglPracticeTopics();
  const usableQuestions = getSscQuestions().filter((question) => (
    question.reviewStatus !== "rejected"
    && isLearnerGradeSscQuestion(question)
    && question.options.length === 4
    && question.options.some((option) => option.id === question.correctOption)
    && question.stem.trim().length > 0
    && question.options.every((option) => option.text.trim().length > 0)
  ));
  const totalPracticeQuestions = practiceTopics.reduce((sum, topic) => sum + topic.totalQuestions, 0);

  assert.equal(practiceTopics.length, getSscTopics().length);
  assert.equal(totalPracticeQuestions, usableQuestions.length);
  assert.ok(practiceTopics.every((topic) => topic.href === `/exams/ssc-cgl/practice/${topic.slug}`));
  assert.ok(practiceTopics.every((topic) => topic.totalQuestions >= 1));

  const percentages = getSscCglTopicPracticeSet("percentages");
  assert.ok(percentages);
  assert.equal(percentages.questions.length, practiceTopics.find((topic) => topic.slug === "percentages")?.totalQuestions);
  assert.ok(percentages.questions.every((question) => question.topic === "percentages"));
  assert.ok(percentages.questions.every((question) => question.reviewStatus !== "rejected"));
  assert.ok(percentages.questions.every((question) => question.options.some((option) => option.id === question.correctOption)));
  assert.equal(percentages.stats.totalQuestions, percentages.questions.length);
  assert.equal(percentages.stats.bookBackedQuestions, percentages.questions.filter((question) => question.provenance.sourceType === "book_user_provided").length);
  assert.ok(percentages.nextTopicHref?.startsWith("/exams/ssc-cgl/practice/") ?? false);
});

test("SSC CGL topic pages expose reviewed corpus questions at chapter end", () => {
  const preview = getSscTopicPracticePreview("percentages");

  assert.equal(preview.length, 5);
  assert.ok(preview.every((question) => question.topic === "percentages"));
  assert.ok(preview.every((question) => question.reviewStatus === "reviewed"));
  assert.ok(preview.every((question) => question.source === "PYQ"));
  assert.ok(preview.every((question) => question.provenance.sourceType === "book_user_provided"));
  assert.ok(preview.every((question) => question.options.length === 4));
  assert.ok(preview.every((question) => question.options.some((option) => option.id === question.correctOption)));
  assert.ok(preview.every((question) => !/##|###|Examination wise|^\s*Q\.?\d+/im.test([
    question.stem,
    ...question.options.map((option) => option.text)
  ].join("\n"))));
});

test("SSC CGL reasoning calendar-clock topic excludes surface-word analogy prompts", () => {
  const calendarClockQuestions = getSscQuestions().filter((question) => question.topic === "calendar-clock");
  const mislabeledAnalogyPrompts = calendarClockQuestions.filter((question) => (
    /same way as|related to the third|word-pair|word pair|letter-cluster/i.test(question.stem)
    && !/day of the week|odd days|leap year|ordinary year|hour hand|minute hand|clock angle|hands of (?:a )?clock/i.test(question.stem)
  ));

  assert.deepEqual(
    mislabeledAnalogyPrompts.map((question) => ({ id: question.id, stem: question.stem })),
    []
  );
});

test("SSC CGL reasoning direction and statement topics exclude surface analogy prompts", () => {
  const analogyPattern = /same way as|related to the third|word-pair|word pair|letter-cluster|number-pair|does not belong|odd one/i;
  const checkedTopics = new Set(["direction-distance", "statement-conclusion"]);
  const mislabeledAnalogyPrompts = getSscQuestions().filter((question) => (
    checkedTopics.has(question.topic)
    && analogyPattern.test(question.stem)
  ));

  assert.deepEqual(
    mislabeledAnalogyPrompts.map((question) => ({ id: question.id, topic: question.topic, stem: question.stem })),
    []
  );
});

test("SSC CGL generated question text is English-only", () => {
  const devanagari = /[\u0900-\u097F]/;
  const rowsWithIndicText = getSscQuestions()
    .map((question) => ({
      id: question.id,
      text: [
        question.stem,
        question.explanation,
        ...question.options.map((option) => option.text)
      ].join(" ")
    }))
    .filter((row) => devanagari.test(row.text));

  assert.deepEqual(rowsWithIndicText.map((row) => row.id), []);
});

test("SSC CGL generated corpus has no exact duplicate MCQ content", () => {
  const normalize = (value: string) => value.toLowerCase().replace(/\s+/g, " ").trim();
  const seen = new Map<string, string>();
  const duplicates: Array<{ duplicateId: string; originalId: string }> = [];

  for (const question of getSscQuestions()) {
    const fingerprint = [
      question.section,
      normalize(question.stem),
      ...question.options.map((option) => normalize(option.text)),
      question.correctOption
    ].join("\u0001");
    const originalId = seen.get(fingerprint);

    if (originalId) duplicates.push({ duplicateId: question.id, originalId });
    else seen.set(fingerprint, question.id);
  }

  assert.deepEqual(duplicates, []);
});

test("SSC CGL generated corpus has no conflicting answer keys for identical MCQ bodies", () => {
  const normalize = (value: string) => value.toLowerCase().replace(/\s+/g, " ").trim();
  const seen = new Map<string, { id: string; correctOption: string }>();
  const conflicts: Array<{ duplicateId: string; originalId: string; originalAnswer: string; duplicateAnswer: string }> = [];

  for (const question of getSscQuestions()) {
    const fingerprint = [
      question.section,
      question.topic,
      normalize(question.stem),
      ...question.options.map((option) => normalize(option.text))
    ].join("\u0001");
    const original = seen.get(fingerprint);

    if (original && original.correctOption !== question.correctOption) {
      conflicts.push({
        duplicateId: question.id,
        originalId: original.id,
        originalAnswer: original.correctOption,
        duplicateAnswer: question.correctOption
      });
    } else if (!original) {
      seen.set(fingerprint, { id: question.id, correctOption: question.correctOption });
    }
  }

  assert.deepEqual(conflicts, []);
});
