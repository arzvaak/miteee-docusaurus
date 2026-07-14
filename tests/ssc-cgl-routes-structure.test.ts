import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const root = process.cwd();

test("SSC CGL exam routes are mounted as first-class study surfaces", () => {
  const expectedFiles = [
    "app/exams/page.tsx",
    "app/exams/ssc-cgl/page.tsx",
    "app/exams/ssc-cgl/session/page.tsx",
    "app/api/exams/ssc-cgl/session/route.ts",
    "app/exams/ssc-cgl/tests/page.tsx",
    "app/exams/ssc-cgl/tests/[testId]/page.tsx",
    "app/exams/ssc-cgl/results/[attemptId]/page.tsx",
    "app/exams/ssc-cgl/practice/page.tsx",
    "app/exams/ssc-cgl/practice/[slug]/page.tsx",
    "app/exams/ssc-cgl/reasoning-50/page.tsx",
    "app/exams/ssc-cgl/ga-50/page.tsx",
    "app/exams/ssc-cgl/quant-50/page.tsx",
    "app/exams/ssc-cgl/english-50/page.tsx",
    "app/exams/ssc-cgl/readiness/page.tsx",
    "app/exams/ssc-cgl/topics/page.tsx",
    "app/exams/ssc-cgl/topics/[slug]/page.tsx",
    "app/exams/ssc-cgl/resources/page.tsx",
    "app/exams/ssc-cgl/import-review/page.tsx",
    "app/exams/ssc-cgl/current-affairs/page.tsx"
  ];

  for (const relativePath of expectedFiles) {
    assert.ok(fs.existsSync(path.join(root, relativePath)), `${relativePath} should exist`);
  }
});

test("SSC CGL runtime loader reads generated data without importing corpus builders", () => {
  const loader = fs.readFileSync(path.join(root, "lib", "ssc-cgl.ts"), "utf8");

  assert.doesNotMatch(loader, /ssc-cgl-source/);
  assert.doesNotMatch(loader, /ssc-cgl-corpus-paths/);
  assert.doesNotMatch(loader, /buildSscCglQuestions|buildSscCglTopics|buildSscCglTestSummaries/);
});

test("timed test runner exposes section timer, local attempts, and result routing", () => {
  const source = fs.readFileSync(path.join(root, "components", "TimedTestRunner.tsx"), "utf8");

  assert.match(source, /localStorage/);
  assert.match(source, /sscAttemptHistoryStorageKey/);
  assert.match(source, /sscMistakeBankStorageKey/);
  assert.match(source, /buildSscAttemptHistoryItem/);
  assert.match(source, /buildSscMistakeBankItems/);
  assert.match(source, /mergeSscMistakeBank/);
  assert.match(source, /mergeSscAttemptHistory/);
  assert.match(source, /section\.timerSeconds/);
  assert.match(source, /scoreSscAttempt/);
  assert.match(source, /styles\.option/);
  assert.match(source, /\/exams\/ssc-cgl\/results\//);
});

test("SSC CGL topic practice exposes one-by-one corpus practice", () => {
  const practiceIndex = fs.readFileSync(path.join(root, "app", "exams", "ssc-cgl", "practice", "page.tsx"), "utf8");
  const practiceDetail = fs.readFileSync(path.join(root, "app", "exams", "ssc-cgl", "practice", "[slug]", "page.tsx"), "utf8");
  const practiceDashboard = fs.readFileSync(path.join(root, "components", "SscPracticeDashboardClient.tsx"), "utf8");
  const practiceClient = fs.readFileSync(path.join(root, "components", "SscTopicPracticeClient.tsx"), "utf8");
  const explanationPanel = fs.readFileSync(path.join(root, "components", "SscExplanationPanel.tsx"), "utf8");
  const topicPracticeMemory = fs.readFileSync(path.join(root, "lib", "ssc-cgl-topic-practice-memory.ts"), "utf8");
  const topicDetail = fs.readFileSync(path.join(root, "app", "exams", "ssc-cgl", "topics", "[slug]", "page.tsx"), "utf8");
  const setup = fs.readFileSync(path.join(root, "components", "SscExamSetup.tsx"), "utf8");
  const css = fs.readFileSync(path.join(root, "app", "globals.css"), "utf8");

  assert.match(practiceIndex, /getSscCglPracticeTopics/);
  assert.match(practiceIndex, /SscPracticeDashboardClient/);
  assert.match(practiceIndex, /Practice every question, one by one/);
  assert.match(practiceDashboard, /sscTopicPracticeStorageKey/);
  assert.match(practiceDashboard, /parseStoredSscTopicPractice/);
  assert.match(practiceDashboard, /Resume next unfinished topic/);
  assert.match(practiceDashboard, /Overall topic queue/);
  assert.match(practiceDashboard, /Local progress/);
  assert.match(practiceDashboard, /Not started/);
  assert.match(practiceDashboard, /In progress/);
  assert.match(practiceDashboard, /Complete/);
  assert.match(practiceDashboard, /ssc-practice-topic-card/);
  assert.match(practiceDashboard, /ssc-practice-progress-meter/);
  assert.match(practiceDashboard, /ssc-practice-dashboard/);
  assert.match(practiceDetail, /getSscCglTopicPracticeSet/);
  assert.match(practiceDetail, /SscTopicPracticeClient/);
  assert.match(practiceClient, /localStorage/);
  assert.match(practiceClient, /sscTopicPracticeStorageKey/);
  assert.match(topicPracticeMemory, /ssc-cgl-topic-practice:/);
  assert.match(practiceClient, /sscMistakeBankStorageKey/);
  assert.match(practiceClient, /buildSscTopicPracticeMistakeBankItem/);
  assert.match(practiceClient, /mergeSscMistakeBank/);
  assert.match(practiceClient, /PracticeMode/);
  assert.match(practiceClient, /practiceMode/);
  assert.match(practiceClient, /filteredQuestions/);
  assert.match(practiceClient, /Queue mode/);
  assert.match(practiceClient, /All questions/);
  assert.match(practiceClient, /Unanswered/);
  assert.match(practiceClient, /Misses/);
  assert.match(practiceClient, /Speed repairs/);
  assert.match(practiceClient, /Book-backed/);
  assert.match(practiceClient, /Gap repair/);
  assert.match(practiceDetail, /searchParams/);
  assert.match(practiceDetail, /initialMode=\{mode\}/);
  assert.match(practiceClient, /Current queue/);
  assert.match(practiceClient, /Next unanswered/);
  assert.match(practiceClient, /Pick an option to reveal the answer/);
  assert.match(practiceClient, /Source and review state/);
  assert.match(practiceClient, /queueComplete/);
  assert.match(practiceClient, /All questions complete in this queue/);
  assert.match(practiceClient, /Switch to all questions/);
  assert.match(practiceClient, /Continue to next topic/);
  assert.match(practiceClient, /question\.explanation/);
  assert.match(practiceClient, /SscExplanationPanel/);
  assert.match(practiceClient, /"ssc-topic-practice-option"/);
  assert.match(practiceClient, /targetSecondsPerQuestion/);
  assert.match(practiceClient, /elapsedSeconds/);
  assert.match(practiceClient, /setInterval/);
  assert.match(practiceClient, /keydown/);
  assert.match(practiceClient, /event\.key/);
  assert.match(practiceClient, /aria-keyshortcuts/);
  assert.match(practiceClient, /36-second pace/);
  assert.match(practiceClient, /Over pace/);
  assert.match(practiceClient, /elapsedSeconds > targetSecondsPerQuestion/);
  assert.match(explanationPanel, /parseSscExplanationBlocks/);
  assert.match(topicDetail, /\/exams\/ssc-cgl\/practice\/\$\{topic\.slug\}/);
  assert.match(setup, /href: "\/exams\/ssc-cgl\/practice"/);
  assert.match(setup, /href: "\/exams\/ssc-cgl\/topics"/);
  assert.match(setup, /href: "\/exams\/ssc-cgl\/current-affairs"/);
  assert.match(setup, /Open question bank/);
  assert.match(setup, /Section question-bank readiness/);
  assert.match(css, /\.ssc-topic-practice-shell/);
  assert.match(css, /\.ssc-topic-practice-filters/);
  assert.match(css, /\.ssc-topic-practice-filter/);
  assert.match(css, /\.ssc-topic-practice-filter\.active/);
  assert.match(css, /\.ssc-topic-practice-jump/);
  assert.match(css, /\.ssc-topic-practice-complete/);
  assert.match(css, /\.ssc-topic-practice-answer/);
  assert.match(css, /\.ssc-topic-practice-pacer/);
  assert.match(css, /\.ssc-topic-practice-pacer\.status-over-pace/);
  assert.match(css, /\.ssc-practice-dashboard/);
  assert.match(css, /\.ssc-practice-overview/);
  assert.match(css, /\.ssc-practice-resume-card/);
  assert.match(css, /\.ssc-practice-progress-meter/);
  assert.match(css, /\.ssc-practice-topic-card/);
});

test("SSC CGL tests page exposes browser-local attempt history", () => {
  const testsPage = fs.readFileSync(path.join(root, "app", "exams", "ssc-cgl", "tests", "page.tsx"), "utf8");
  const historyComponent = fs.readFileSync(path.join(root, "components", "SscAttemptHistory.tsx"), "utf8");
  const mistakeComponent = fs.readFileSync(path.join(root, "components", "SscMistakeNotebook.tsx"), "utf8");
  const css = fs.readFileSync(path.join(root, "app", "globals.css"), "utf8");

  assert.match(testsPage, /searchParams/);
  assert.match(testsPage, /section/);
  assert.match(testsPage, /topic/);
  assert.match(testsPage, /mode/);
  assert.match(testsPage, /modeOptions/);
  assert.match(testsPage, /Mode shortcuts/);
  assert.match(testsPage, /200\/200 launch order/);
  assert.match(testsPage, /launchPlan/);
  assert.match(testsPage, /ssc-test-launch-panel/);
  assert.match(testsPage, /ssc-test-launch-grid/);
  assert.match(testsPage, /ssc-test-launch-card/);
  assert.match(testsPage, /Start with a full 200-mark mock/);
  assert.match(testsPage, /Protect Quant 50\/50/);
  assert.match(testsPage, /book-PYQ shift/);
  assert.match(testsPage, /modeCounts/);
  assert.match(testsPage, /filteredTests/);
  assert.match(testsPage, /Active drill filter/);
  assert.match(testsPage, /getSscCglTests\(\{/);
  assert.match(testsPage, /SscAttemptHistory/);
  assert.match(testsPage, /SscMistakeNotebook/);
  assert.match(testsPage, /Recent attempt history/);
  assert.match(historyComponent, /sscAttemptHistoryStorageKey/);
  assert.match(historyComponent, /localStorage/);
  assert.match(historyComponent, /topRepairHref/);
  assert.match(historyComponent, /\/exams\/ssc-cgl\/results\//);
  assert.match(mistakeComponent, /Mistake notebook/);
  assert.match(mistakeComponent, /sscMistakeBankStorageKey/);
  assert.match(mistakeComponent, /localStorage/);
  assert.match(mistakeComponent, /item\.topicHref/);
  assert.match(mistakeComponent, /item\.resultHref/);
  assert.match(css, /\.ssc-attempt-history/);
  assert.match(css, /\.ssc-history-list/);
  assert.match(css, /\.ssc-mistake-notebook/);
  assert.match(css, /\.ssc-mistake-list/);
  assert.match(css, /\.ssc-test-mode-grid/);
  assert.match(css, /\.ssc-test-mode-card/);
  assert.match(css, /\.ssc-test-launch-panel/);
  assert.match(css, /\.ssc-test-launch-grid/);
  assert.match(css, /\.ssc-test-launch-card/);
  assert.match(css, /\.ssc-test-filter-strip/);
});

test("SSC CGL result page exposes question-by-question answer review", () => {
  const resultClient = fs.readFileSync(path.join(root, "components", "SscAttemptResultClient.tsx"), "utf8");
  const explanationPanel = fs.readFileSync(path.join(root, "components", "SscExplanationPanel.tsx"), "utf8");
  const css = fs.readFileSync(path.join(root, "app", "globals.css"), "utf8");

  assert.match(resultClient, /answers/);
  assert.match(resultClient, /buildSscAttemptQuestionReview/);
  assert.match(resultClient, /postTestLoop/);
  assert.match(resultClient, /200\/200 post-test loop/);
  assert.match(resultClient, /Do not start another mock before closing this loop/);
  assert.match(resultClient, /ssc-result-loop/);
  assert.match(resultClient, /ssc-result-loop-card/);
  assert.match(resultClient, /Question review/);
  assert.match(resultClient, /row\.chosenOptionText/);
  assert.match(resultClient, /row\.correctOptionText/);
  assert.match(resultClient, /row\.explanation/);
  assert.match(resultClient, /SscExplanationPanel/);
  assert.match(explanationPanel, /ssc-explanation-block/);
  assert.match(resultClient, /row\.sourceLabel/);
  assert.match(resultClient, /row\.topicHref/);
  assert.match(css, /\.ssc-answer-review/);
  assert.match(css, /\.ssc-result-loop/);
  assert.match(css, /\.ssc-result-loop-card/);
  assert.match(css, /\.ssc-answer-review-card/);
  assert.match(css, /\.ssc-answer-option-grid/);
  assert.match(css, /\.ssc-explanation-panel/);
  assert.match(css, /\.ssc-explanation-block/);
});

test("SSC CGL topic pages show book-backed and gap-repair practice coverage", () => {
  const topicIndex = fs.readFileSync(path.join(root, "app", "exams", "ssc-cgl", "topics", "page.tsx"), "utf8");
  const topicDetail = fs.readFileSync(path.join(root, "app", "exams", "ssc-cgl", "topics", "[slug]", "page.tsx"), "utf8");
  const css = fs.readFileSync(path.join(root, "app", "globals.css"), "utf8");

  assert.match(topicIndex, /row\.bookBackedQuestions/);
  assert.match(topicIndex, /row\.gapRepairQuestions/);
  assert.match(topicDetail, /ssc-source-split/);
  assert.match(topicDetail, /ssc-topic-mastery-route/);
  assert.match(topicDetail, /200\/200 route/);
  assert.match(topicDetail, /Corpus pressure/);
  assert.match(topicDetail, /Read concept/);
  assert.match(topicDetail, /Practice every question/);
  assert.match(topicDetail, /Timed drills/);
  assert.match(topicDetail, /Mistake repair/);
  assert.match(topicDetail, /book-backed/);
  assert.match(topicDetail, /gap-repair/);
  assert.match(topicDetail, /getSscTopicPracticePreview/);
  assert.match(topicDetail, /NoteQuizClient/);
  assert.match(topicDetail, /SscExplanationPanel/);
  assert.match(topicDetail, /Reviewed PYQ-style questions from this topic/);
  assert.match(topicDetail, /Show answer and explanation/);
  assert.match(topicDetail, /className="quiz-block note-quiz-block ssc-topic-quiz-block"/);
  assert.match(topicDetail, /className="quiz-options"/);
  assert.match(topicDetail, /className="quiz-option"/);
  assert.match(topicDetail, /data-opt=\{option\.id\}/);
  assert.match(topicDetail, /className="opt-key"/);
  assert.match(topicDetail, /className="opt-text"/);
  assert.match(topicDetail, /className="markdown-body ssc-flowchart-rendered"/);
  assert.doesNotMatch(topicDetail, /<pre className="ssc-flowchart"/);
  assert.match(css, /\.ssc-source-split/);
  assert.match(css, /\.ssc-topic-mastery-route/);
  assert.match(css, /\.ssc-topic-route-step/);
  assert.match(css, /\.ssc-topic-pressure-grid/);
  assert.match(css, /\.ssc-topic-quiz-block/);
  assert.match(css, /\.ssc-topic-answer/);
  assert.match(css, /\.ssc-topic-detail > \*/);
  assert.match(css, /\.ssc-study-block \.markdown-body/);
  assert.match(css, /overflow-wrap:\s*anywhere/);
});

test("SSC CGL topic index is grouped into the four Tier-I subject levels", () => {
  const topicIndex = fs.readFileSync(path.join(root, "app", "exams", "ssc-cgl", "topics", "page.tsx"), "utf8");
  const css = fs.readFileSync(path.join(root, "app", "globals.css"), "utf8");

  assert.match(topicIndex, /getSscCglTopicCoverageMap/);
  assert.match(topicIndex, /200\/200 coverage matrix/);
  assert.match(topicIndex, /Sufficiency ledger/);
  assert.match(topicIndex, /coverage\.masteryTargetQuestionsPerTopic/);
  assert.match(topicIndex, /coverage\.bookBackedTargetQuestionsPerTopic/);
  assert.match(topicIndex, /coverage\.minimumReviewedQuestions/);
  assert.match(topicIndex, /coverage\.topicsPracticeSufficient/);
  assert.match(topicIndex, /coverage\.topicsFullySufficient/);
  assert.match(topicIndex, /coverage\.masteryGateFailures/);
  assert.match(topicIndex, /coverage\.topicsWithTimedDrills/);
  assert.match(topicIndex, /coverage\.weakestTopics/);
  assert.match(topicIndex, /coverage\.sections/);
  assert.match(topicIndex, /row\.sectionRank/);
  assert.match(topicIndex, /row\.reviewedQuestions/);
  assert.match(topicIndex, /row\.sufficiencyScore/);
  assert.match(topicIndex, /row\.practiceReady/);
  assert.match(topicIndex, /row\.masteryReady/);
  assert.match(topicIndex, /row\.bookFloorGap/);
  assert.match(topicIndex, /row\.sufficiencyGaps/);
  assert.match(topicIndex, /row\.hasTimedDrill/);
  assert.match(topicIndex, /row\.noteBodyLength/);
  assert.match(topicIndex, /Practice-ready/);
  assert.match(topicIndex, /Book floor/);
  assert.match(topicIndex, /36-sec drill/);
  assert.match(topicIndex, /Next gap:/);
  assert.match(topicIndex, /section\.title/);
  assert.match(topicIndex, /focusBySection/);
  assert.match(topicIndex, /reasoning/);
  assert.match(topicIndex, /general-awareness/);
  assert.match(topicIndex, /quantitative-aptitude/);
  assert.match(topicIndex, /english-comprehension/);
  assert.match(topicIndex, /Level \{index \+ 1\}/);
  assert.match(topicIndex, /ssc-topic-sublevels/);
  assert.match(css, /\.ssc-topic-levels/);
  assert.match(css, /\.ssc-topic-sublevels/);
  assert.match(css, /\.ssc-topic-coverage/);
  assert.match(css, /\.ssc-topic-sufficiency/);
  assert.match(css, /\.ssc-topic-weakest/);
  assert.match(css, /\.ssc-topic-coverage-row/);
  assert.match(css, /\.ssc-topic-coverage-meter/);
  assert.match(css, /\.ssc-topic-mastery-gates/);
  assert.match(css, /\.ssc-topic-gaps/);
});

test("SSC CGL landing page exposes a complete exam setup flow", () => {
  const page = fs.readFileSync(path.join(root, "app", "exams", "ssc-cgl", "page.tsx"), "utf8");
  const setup = fs.readFileSync(path.join(root, "components", "SscExamSetup.tsx"), "utf8");
  const css = fs.readFileSync(path.join(root, "components", "SscExamSetup.module.css"), "utf8");

  assert.match(page, /SscExamSetup/);
  assert.match(page, /sectionReadiness/);
  assert.match(page, /readinessPercent/);
  assert.match(setup, /Quick 10/);
  assert.match(setup, /Section Test/);
  assert.match(setup, /Full Mock/);
  assert.match(setup, /Endless Practice/);
  assert.match(setup, /Book \/ PYQ Practice/);
  assert.match(setup, /Weakness Repair/);
  assert.match(setup, /All four sections/);
  assert.match(setup, /10 Q/);
  assert.match(setup, /25 Q/);
  assert.match(setup, /50 Q/);
  assert.match(setup, /100 Q/);
  assert.match(setup, /Exam clock/);
  assert.match(setup, /Relaxed/);
  assert.match(setup, /No timer/);
  assert.match(setup, /\/exams\/ssc-cgl\/session/);
  assert.match(setup, /sscAttemptHistoryStorageKey/);
  assert.match(setup, /sscMistakeBankStorageKey/);
  assert.doesNotMatch(setup, /pipeline|OCR|Import review/i);
  assert.match(css, /\.modeGrid/);
  assert.match(css, /\.configPanel/);
  assert.match(css, /\.sectionProgress/);
});

test("SSC CGL section 50/50 cockpits expose four section workflows", () => {
  const shared = fs.readFileSync(path.join(root, "app", "exams", "ssc-cgl", "Section50Cockpit.tsx"), "utf8");
  const reasoning = fs.readFileSync(path.join(root, "app", "exams", "ssc-cgl", "reasoning-50", "page.tsx"), "utf8");
  const ga = fs.readFileSync(path.join(root, "app", "exams", "ssc-cgl", "ga-50", "page.tsx"), "utf8");
  const quant = fs.readFileSync(path.join(root, "app", "exams", "ssc-cgl", "quant-50", "page.tsx"), "utf8");
  const english = fs.readFileSync(path.join(root, "app", "exams", "ssc-cgl", "english-50", "page.tsx"), "utf8");
  const setup = fs.readFileSync(path.join(root, "components", "SscExamSetup.tsx"), "utf8");
  const css = fs.readFileSync(path.join(root, "app", "globals.css"), "utf8");

  assert.match(shared, /getSscCglDashboard/);
  assert.match(shared, /getSscCglPracticeTopics/);
  assert.match(shared, /getSscCglTests/);
  assert.match(shared, /section,/);
  assert.match(shared, /mode: "speed_sprint"/);
  assert.match(shared, /mode: "topic_drill"/);
  assert.match(shared, /50\/50 bar/);
  assert.match(shared, /15-minute section sprints/);
  assert.match(shared, /Practice unanswered/);
  assert.match(shared, /mode=unanswered/);
  assert.match(reasoning, /Reasoning 50\/50 cockpit/);
  assert.match(reasoning, /section="reasoning"/);
  assert.match(reasoning, /analogy-classification/);
  assert.match(ga, /GA 50\/50 cockpit/);
  assert.match(ga, /section="general-awareness"/);
  assert.match(ga, /current-affairs-static-gk/);
  assert.match(quant, /Quant 50\/50 cockpit/);
  assert.match(quant, /section="quantitative-aptitude"/);
  assert.match(quant, /calculation-speed/);
  assert.match(quant, /zero slow leaks/);
  assert.match(english, /English 50\/50 cockpit/);
  assert.match(english, /section="english-comprehension"/);
  assert.match(english, /grammar-error-spotting/);
  for (const source of [shared, reasoning, ga, quant, english]) {
    assert.doesNotMatch(source, /pipeline|OCR|Import review|quarantine/i);
  }
  assert.match(setup, /value: "reasoning"/);
  assert.match(setup, /value: "general-awareness"/);
  assert.match(setup, /value: "quantitative-aptitude"/);
  assert.match(setup, /value: "english-comprehension"/);
  assert.match(setup, /Section question-bank readiness/);
  assert.match(css, /\.ssc-section50-page/);
  assert.match(css, /\.ssc-section-cockpit-strip/);
  assert.match(css, /\.ssc-section-cockpit-grid/);
  assert.match(css, /\.ssc-section-cockpit-card/);
  assert.match(css, /\.ssc-quant-page/);
  assert.match(css, /\.ssc-quant-hero/);
  assert.match(css, /\.ssc-quant-launch-grid/);
  assert.match(css, /\.ssc-quant-launch-card/);
  assert.match(css, /\.ssc-quant-scoreline/);
  assert.match(css, /\.ssc-quant-sprint-list/);
  assert.match(css, /\.ssc-quant-topic-grid/);
  assert.match(css, /\.ssc-quant-drill-list/);
});

test("SSC CGL current-affairs page mounts the same-screen magazine and account-ready actions", () => {
  const page = fs.readFileSync(path.join(root, "app", "exams", "ssc-cgl", "current-affairs", "page.tsx"), "utf8");
  const actions = fs.readFileSync(path.join(root, "components", "CurrentAffairsActions.tsx"), "utf8");

  assert.match(page, /CurrentAffairsFeed/);
  assert.match(page, /ssc-current-affairs-page/);
  assert.match(page, /data-shell-full-bleed/);
  assert.match(page, /buildCurrentAffairsStoryRecords/);
  assert.match(page, /getCurrentAffairsWeeklyIssue/);
  assert.match(page, /getCurrentAffairsMonthlyIssue/);
  assert.match(actions, /CurrentAffairsActionsAdapter/);
  assert.match(actions, /Save for revision/);
  assert.match(actions, /Hide/);
});

test("SSC CGL readiness page exposes clean 200/200 proof", () => {
  const page = fs.readFileSync(path.join(root, "app", "exams", "ssc-cgl", "readiness", "page.tsx"), "utf8");
  const landing = fs.readFileSync(path.join(root, "app", "exams", "ssc-cgl", "page.tsx"), "utf8");
  const css = fs.readFileSync(path.join(root, "app", "globals.css"), "utf8");

  assert.match(page, /getSscCglDashboard/);
  assert.match(page, /getSscCglResources/);
  assert.match(page, /getCurrentAffairsStudyBrief/);
  assert.match(page, /SSC CGL 200\/200 proof/);
  assert.match(page, /Question bank/);
  assert.match(page, /Timed mocks/);
  assert.match(page, /Deep notes/);
  assert.match(page, /Resources/);
  assert.match(page, /Current affairs/);
  assert.match(page, /Strict proof gates/);
  assert.match(page, /gateLinks/);
  assert.match(page, /book-corpus-completeness/);
  assert.match(page, /source-manifest/);
  assert.match(page, /current-affairs/);
  assert.doesNotMatch(page, /pipeline|OCR|Import review|quarantine/i);
  assert.match(landing, /SscExamSetup/);
  assert.match(css, /\.ssc-proof-page/);
  assert.match(css, /\.ssc-proof-evidence-grid/);
  assert.match(css, /\.ssc-proof-gate-list/);
  assert.match(css, /\.ssc-proof-gate\.status-pass/);
});

test("SSC CGL resources page is learner-facing source map, not an import cockpit", () => {
  const page = fs.readFileSync(path.join(root, "app", "exams", "ssc-cgl", "resources", "page.tsx"), "utf8");
  const loader = fs.readFileSync(path.join(root, "lib", "ssc-cgl.ts"), "utf8");
  const css = fs.readFileSync(path.join(root, "app", "globals.css"), "utf8");
  const standalone = fs.readFileSync(path.join(root, "scripts", "standalone-assets.mjs"), "utf8");

  assert.match(page, /getSscCglResources/);
  assert.match(page, /Sources organized for practice, not clutter/);
  assert.match(page, /Practice every question/);
  assert.doesNotMatch(page, /pipeline|OCR|quarantine|gate|Import review/i);
  assert.match(loader, /resourceCandidatesPath/);
  assert.match(loader, /sourceRegistryPath/);
  assert.match(loader, /getSscCglResources/);
  assert.match(loader, /resourceLaneFor/);
  assert.match(loader, /Book-PYQ practice pool/);
  assert.match(loader, /Official SSC baseline/);
  assert.match(loader, /Web PDF leads/);
  assert.match(loader, /Scribd\/reference leads/);
  assert.match(loader, /SSC-like model practice/);
  assert.match(css, /\.ssc-resource-lane-grid/);
  assert.match(css, /\.ssc-resource-lead-card/);
  assert.match(css, /\.ssc-resource-footer/);
  assert.match(standalone, /resource-candidates\.json/);
  assert.match(standalone, /source-registry\.json/);
});
