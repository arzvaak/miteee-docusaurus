import { chromium } from "playwright";

const baseUrl = (process.env.SSC_BROWSER_BASE_URL ?? "http://127.0.0.1:3000").replace(/\/$/, "");
const viewports = [
  { name: "desktop", width: 1366, height: 768 },
  { name: "mobile", width: 390, height: 844 }
];
const failures = [];

function fail(label, message) {
  failures.push(`${label}: ${message}`);
}

async function checkNoConsoleErrors(page, label, fn) {
  const errors = [];
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  page.on("pageerror", (error) => errors.push(error.message));

  await fn();

  if (errors.length) {
    fail(label, `console/page errors: ${errors.join(" | ")}`);
  }
}

async function checkNoHorizontalOverflow(page, label) {
  const hasOverflow = await page.evaluate(() => (
    document.documentElement.scrollWidth > document.documentElement.clientWidth + 2
  ));
  if (hasOverflow) fail(label, "horizontal overflow");
}

async function checkDashboard(page, label) {
  await page.goto(`${baseUrl}/exams/ssc-cgl`, { waitUntil: "networkidle" });
  await page.getByText("Strict 200/200 gates").waitFor({ timeout: 15000 });

  const cards = await page.locator(".ssc-strict-gate-card").count();
  if (cards !== 9) fail(label, `expected 9 strict gate cards, found ${cards}`);

  const nonPass = await page.locator(".ssc-strict-gate-card:not(.status-pass)").count();
  if (nonPass !== 0) fail(label, `expected all strict gates pass, found ${nonPass} non-pass`);

  const text = await page.locator("body").innerText();
  for (const needle of ["22,160", "46/46", "29378/29378", "Current affairs", "Question bank", "Start topic queue"]) {
    if (!text.toLowerCase().includes(needle.toLowerCase())) fail(label, `missing dashboard text ${needle}`);
  }

  const background = await page.locator("body").evaluate((node) => getComputedStyle(node).backgroundColor);
  if (background === "rgb(255, 255, 255)" || background === "rgba(0, 0, 0, 0)") {
    fail(label, `body background still looks blank/white: ${background}`);
  }

  await checkNoHorizontalOverflow(page, label);
}

async function checkTopicPractice(page, label) {
  await page.goto(`${baseUrl}/exams/ssc-cgl/practice/analogy-classification`, { waitUntil: "networkidle" });
  await page.getByText("Pick an option to reveal the answer").waitFor({ timeout: 15000 });

  const waitingBefore = await page.locator(".ssc-topic-practice-answer.status-waiting").count();
  if (waitingBefore !== 1) fail(label, `expected one waiting panel before answer, found ${waitingBefore}`);

  const revealedBefore = await page.locator(".ssc-topic-practice-answer:not(.status-waiting)").count();
  if (revealedBefore !== 0) fail(label, `revealed answer panel visible before selecting option (${revealedBefore})`);

  const optionCount = await page.locator(".ssc-topic-practice-option").count();
  if (optionCount < 4) fail(label, `expected at least 4 topic practice options, found ${optionCount}`);

  const firstQuestionMeta = await page.locator(".ssc-question-meta span").first().innerText();
  // keyboard option answer
  await page.keyboard.press("2");
  await page.locator(".ssc-topic-practice-answer:not(.status-waiting)").waitFor({ timeout: 10000 });

  const selectedCount = await page.locator(".ssc-topic-practice-option.selected").count();
  if (selectedCount !== 1) fail(label, `expected one selected option after keyboard answer, found ${selectedCount}`);

  const explanationText = await page.locator(".ssc-topic-practice-answer:not(.status-waiting)").innerText();
  for (const needle of ["Correct answer", "Method", "Why it fits", "Trap"]) {
    if (!new RegExp(needle, "i").test(explanationText)) fail(label, `practice explanation missing ${needle}`);
  }

  await page.keyboard.press("n");
  await page.waitForFunction((previousMeta) => {
    const node = document.querySelector(".ssc-question-meta span");
    return node?.textContent && node.textContent !== previousMeta;
  }, firstQuestionMeta, { timeout: 10000 });

  await checkNoHorizontalOverflow(page, label);
}

async function checkPracticeHub(page, label) {
  await page.goto(`${baseUrl}/exams/ssc-cgl`, { waitUntil: "networkidle" });
  await page.evaluate(() => {
    window.localStorage.setItem("ssc-cgl-topic-practice:series-coding", JSON.stringify({
      index: 12,
      answers: {
        "smoke-series-coding-1": "b",
        "smoke-series-coding-2": "z"
      },
      savedAt: new Date().toISOString(),
      topicSlug: "series-coding",
      topicTitle: "Series and Coding",
      subject: "Reasoning",
      totalQuestions: 500,
      correct: 1,
      wrong: 0,
      skipped: 1
    }));
  });
  await page.goto(`${baseUrl}/exams/ssc-cgl/practice`, { waitUntil: "networkidle" });
  await page.getByText("Overall topic queue").waitFor({ timeout: 15000 });
  await page.getByText("Resume next unfinished topic").waitFor({ timeout: 15000 });
  await page.getByText("Local progress").first().waitFor({ timeout: 15000 });
  await page.getByText("In progress").first().waitFor({ timeout: 15000 });

  const topicCards = await page.locator(".ssc-practice-topic-card").count();
  if (topicCards < 40) fail(label, `expected at least 40 topic practice cards, found ${topicCards}`);

  const progressMeters = await page.locator(".ssc-practice-progress-meter").count();
  if (progressMeters < 10) fail(label, `expected practice progress meters, found ${progressMeters}`);

  await checkNoHorizontalOverflow(page, label);
}

async function checkResourceMap(page, label) {
  await page.goto(`${baseUrl}/exams/ssc-cgl/resources`, { waitUntil: "networkidle" });
  await page.getByText("Sources organized for practice, not clutter.").waitFor({ timeout: 15000 });

  const text = await page.locator("body").innerText();
  for (const needle of ["Book-PYQ practice pool", "Official SSC baseline", "Web PDF leads", "Scribd/reference leads", "SSC-like model practice", "Practice every question"]) {
    if (!text.includes(needle)) fail(label, `missing resource map text ${needle}`);
  }

  for (const forbidden of ["pipeline", "OCR", "quarantine", "Import review"]) {
    if (text.toLowerCase().includes(forbidden.toLowerCase())) fail(label, `resource map exposes internal word ${forbidden}`);
  }

  const leadCards = await page.locator(".ssc-resource-lead-card").count();
  if (leadCards < 8) fail(label, `expected resource lead cards, found ${leadCards}`);

  await checkNoHorizontalOverflow(page, label);
}

async function checkReadinessProof(page, label) {
  await page.goto(`${baseUrl}/exams/ssc-cgl/readiness`, { waitUntil: "networkidle" });
  await page.getByText("SSC CGL 200/200 proof").waitFor({ timeout: 15000 });
  await page.getByText("Strict proof gates").waitFor({ timeout: 15000 });

  const text = await page.locator("body").innerText();
  for (const needle of ["Question bank", "Timed tests", "Deep notes", "Resources", "Current affairs", "Fresh for today"]) {
    if (!text.includes(needle)) fail(label, `missing readiness proof text ${needle}`);
  }

  for (const forbidden of ["pipeline", "OCR", "quarantine", "Import review"]) {
    if (text.toLowerCase().includes(forbidden.toLowerCase())) fail(label, `readiness proof exposes internal word ${forbidden}`);
  }

  const gateCards = await page.locator(".ssc-proof-gate").count();
  if (gateCards < 9) fail(label, `expected at least 9 proof gates, found ${gateCards}`);

  await checkNoHorizontalOverflow(page, label);
}

async function checkSection50(page, label, path, heading) {
  await page.goto(`${baseUrl}${path}`, { waitUntil: "networkidle" });
  await page.getByText(heading).waitFor({ timeout: 15000 });
  await page.getByText("Section score first, browsing second.").waitFor({ timeout: 15000 });

  const text = await page.locator("body").innerText();
  for (const needle of ["50/50 bar", "15-minute section sprints", "Practice unanswered", "Topic drill shortcuts"]) {
    if (!new RegExp(needle.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i").test(text)) fail(label, `missing section cockpit text ${needle}`);
  }

  for (const forbidden of ["pipeline", "OCR", "quarantine", "Import review"]) {
    if (text.toLowerCase().includes(forbidden.toLowerCase())) fail(label, `section cockpit exposes internal word ${forbidden}`);
  }

  const launchCards = await page.locator(".ssc-quant-launch-card").count();
  if (launchCards !== 4) fail(label, `expected 4 section launch cards, found ${launchCards}`);

  const topicCards = await page.locator(".ssc-quant-topic-card").count();
  if (topicCards < 4) fail(label, `expected section topic cards, found ${topicCards}`);

  const sprintRows = await page.locator(".ssc-quant-sprint-list a").count();
  if (sprintRows < 1) fail(label, `expected section sprint rows, found ${sprintRows}`);

  await checkNoHorizontalOverflow(page, label);
}

async function checkSectionCockpits(page, label) {
  await checkSection50(page, `${label} reasoning 50`, "/exams/ssc-cgl/reasoning-50", "Reasoning 50/50 cockpit.");
  await checkSection50(page, `${label} ga 50`, "/exams/ssc-cgl/ga-50", "GA 50/50 cockpit.");
  await checkSection50(page, `${label} quant 50`, "/exams/ssc-cgl/quant-50", "Quant 50/50 cockpit.");
  await checkSection50(page, `${label} english 50`, "/exams/ssc-cgl/english-50", "English 50/50 cockpit.");
}

async function checkTopicPracticeQueueComplete(page, label) {
  await page.goto(`${baseUrl}/exams/ssc-cgl/practice/analogy-classification`, { waitUntil: "networkidle" });
  await page.evaluate(() => window.localStorage.clear());
  await page.reload({ waitUntil: "networkidle" });
  await page.getByText("Pick an option to reveal the answer").waitFor({ timeout: 15000 });

  await page.getByRole("button", { name: /Misses/i }).click();
  await page.getByText("All questions complete in this queue").waitFor({ timeout: 10000 });

  const completePanelCount = await page.locator(".ssc-topic-practice-complete").count();
  if (completePanelCount !== 1) fail(label, `expected one complete queue panel, found ${completePanelCount}`);

  await page.goto(`${baseUrl}/exams/ssc-cgl/practice/analogy-classification?mode=speed`, { waitUntil: "networkidle" });
  await page.getByText("All questions complete in this queue").waitFor({ timeout: 10000 });
  const speedQueueText = await page.locator("body").innerText();
  if (!/Speed repairs currently has no remaining questions/i.test(speedQueueText)) {
    fail(label, "speed repair query did not open the speed repair queue");
  }

  await page.getByRole("button", { name: /Switch to all questions/i }).click();
  await page.getByText("Pick an option to reveal the answer").waitFor({ timeout: 10000 });

  await checkNoHorizontalOverflow(page, label);
}

async function checkCurrentAffairs(page, label) {
  await page.goto(`${baseUrl}/exams/ssc-cgl/current-affairs`, { waitUntil: "networkidle" });
  await page.getByText("Daily recall protocol").waitFor({ timeout: 15000 });
  await page.getByText("Recall queue").waitFor({ timeout: 15000 });
  await page.locator(".ssc-current-run-state .ssc-panel-heading strong", { hasText: "Daily reliability" }).waitFor({ timeout: 15000 });
  await page.getByText("Fresh for today").waitFor({ timeout: 15000 });
  await page.getByText(/Expected \d{4}-\d{2}-\d{2}/).waitFor({ timeout: 15000 });

  const recallCards = await page.locator(".ssc-current-recall-card").count();
  if (recallCards < 1) fail(label, `expected at least one recall card, found ${recallCards}`);

  const itemCards = await page.locator(".ssc-current-card").count();
  if (itemCards < 1) fail(label, `expected at least one current-affairs item card, found ${itemCards}`);

  const mcqSeeds = await page.locator(".ssc-mcq-seed").count();
  if (mcqSeeds < 1) fail(label, `expected MCQ seed cards, found ${mcqSeeds}`);

  const staticAnchors = await page.locator(".ssc-static-anchors").count();
  if (staticAnchors < 1) fail(label, `expected static GK bridge anchors, found ${staticAnchors}`);

  await page.getByRole("button", { name: /Reveal answer/i }).first().click();
  await page.locator(".ssc-current-recall-answer").first().waitFor({ timeout: 10000 });
  await page.getByRole("button", { name: /Know it/i }).first().click();
  await page.waitForFunction(() => {
    const buttons = Array.from(document.querySelectorAll("button[aria-pressed='true']"));
    return buttons.some((button) => /Know it/i.test(button.textContent ?? ""));
  }, null, { timeout: 10000 });

  await page.getByText("Static GK bridge").first().waitFor({ timeout: 10000 });
  await checkNoHorizontalOverflow(page, label);
}

async function checkTimedMock(page, label) {
  await page.goto(`${baseUrl}/exams/ssc-cgl/tests/ssc-cgl-book-200-mode-mock-01`, { waitUntil: "networkidle" });
  await page.locator(".ssc-test-runner").waitFor({ timeout: 15000 });

  const sectionTabs = await page.locator(".ssc-section-tab").count();
  if (sectionTabs !== 4) fail(label, `expected 4 section tabs, found ${sectionTabs}`);

  const timerText = await page.locator(".ssc-test-timer strong").innerText();
  if (!/^\d{2}:\d{2}$/.test(timerText)) fail(label, `timer did not render as MM:SS: ${timerText}`);

  const optionCount = await page.locator(".ssc-test-option").count();
  if (optionCount < 4) fail(label, `expected at least 4 timed-test options, found ${optionCount}`);

  await page.locator(".ssc-test-option").first().click();
  const selectedCount = await page.locator(".ssc-test-option.selected").count();
  if (selectedCount !== 1) fail(label, `expected one selected timed-test option, found ${selectedCount}`);

  const progressText = await page.locator(".ssc-progress-box span").innerText();
  if (!/1\/100 attempted/i.test(progressText)) fail(label, `progress did not record the first answer: ${progressText}`);

  await page.getByRole("button", { name: /Lock section/i }).click();
  const activeSectionText = await page.locator(".ssc-section-tab.active strong").innerText();
  if (!/General Awareness/i.test(activeSectionText)) fail(label, `lock section did not advance to GA: ${activeSectionText}`);

  const submitButtons = await page.getByRole("button", { name: /Submit/i }).count();
  if (submitButtons !== 1) fail(label, `expected one Submit button, found ${submitButtons}`);

  await checkNoHorizontalOverflow(page, label);
}

async function checkNoteQuiz(page, label, pathname = "/notes/ssc-cgl-reasoning-analogy-classification") {
  await page.goto(`${baseUrl}${pathname}`, { waitUntil: "networkidle" });
  await page.getByText("Clock : Time :: Thermometer : ?").waitFor({ timeout: 15000 });

  const markedBefore = await page.locator(".note-quiz-block .q-correct, .note-quiz-block .q-wrong, .note-quiz-block [data-correct='true']").count();
  if (markedBefore !== 0) fail(label, `note quiz is pre-marked (${markedBefore} markers)`);

  const detailsOpenBefore = await page.locator(".note-quiz-block details[open]").count();
  if (detailsOpenBefore !== 0) fail(label, `note quiz explanation is open before interaction (${detailsOpenBefore})`);

  const block = page.locator(".note-quiz-block", { hasText: "Clock : Time :: Thermometer : ?" }).first();
  await block.locator(".quiz-option[data-opt='b']").click();

  const correctAfter = await block.locator(".q-correct").count();
  if (correctAfter !== 1) fail(label, `expected one correct marker after choosing Temperature, found ${correctAfter}`);

  const explanationText = await block.locator("details").innerText();
  for (const needle of ["Answer: B", "Method", "Why it fits", "Trap"]) {
    if (!explanationText.includes(needle)) fail(label, `note explanation missing ${needle}`);
  }
}

async function checkTopicPreviewQuiz(page, label) {
  await page.goto(`${baseUrl}/exams/ssc-cgl/topics/analogy-classification`, { waitUntil: "networkidle" });
  await page.getByText("Reviewed PYQ-style questions from this topic").waitFor({ timeout: 15000 });

  const previewCards = await page.locator(".ssc-topic-quiz-block.note-quiz-block").count();
  if (previewCards < 1) fail(label, `expected topic preview quiz cards, found ${previewCards}`);

  const markedBefore = await page.locator(".ssc-topic-quiz-block .q-correct, .ssc-topic-quiz-block .q-wrong, .ssc-topic-quiz-block [data-correct='true']").count();
  if (markedBefore !== 0) fail(label, `topic preview quiz is pre-marked (${markedBefore} markers)`);

  const openBefore = await page.locator(".ssc-topic-quiz-block details[open]").count();
  if (openBefore !== 0) fail(label, `topic preview explanation is open before interaction (${openBefore})`);

  const firstPreview = page.locator(".ssc-topic-quiz-block.note-quiz-block").first();
  const firstCorrectOption = await firstPreview.getAttribute("data-answer");
  if (!firstCorrectOption) {
    fail(label, "first topic preview card has no data-answer");
    return;
  }

  await firstPreview.locator(`.quiz-option[data-opt='${firstCorrectOption}']`).click();

  const correctAfter = await firstPreview.locator(".q-correct").count();
  if (correctAfter !== 1) fail(label, `expected one correct marker after choosing topic preview answer, found ${correctAfter}`);

  const explanationText = await firstPreview.locator("details").innerText();
  for (const needle of ["Correct answer", "Method", "Why it fits", "Trap to avoid"]) {
    if (!new RegExp(needle, "i").test(explanationText)) fail(label, `topic preview explanation missing ${needle}`);
  }

  await checkNoHorizontalOverflow(page, label);
}

const browser = await chromium.launch({ headless: true });

for (const viewport of viewports) {
  const context = await browser.newContext({ viewport, colorScheme: "dark" });
  const page = await context.newPage();

  await checkNoConsoleErrors(page, viewport.name, async () => {
    await checkDashboard(page, `${viewport.name} dashboard`);
    await checkPracticeHub(page, `${viewport.name} practice hub`);
    await checkResourceMap(page, `${viewport.name} resource map`);
    await checkReadinessProof(page, `${viewport.name} readiness proof`);
    await checkSectionCockpits(page, viewport.name);
    await checkTopicPractice(page, `${viewport.name} practice`);
    await checkTopicPracticeQueueComplete(page, `${viewport.name} practice queue complete`);
    await checkTimedMock(page, `${viewport.name} timed mock`);
    await checkCurrentAffairs(page, `${viewport.name} current affairs`);
    await checkNoteQuiz(page, `${viewport.name} note quiz`);
    await checkNoteQuiz(page, `${viewport.name} topic note quiz`, "/exams/ssc-cgl/topics/analogy-classification");
    await checkTopicPreviewQuiz(page, `${viewport.name} topic preview quiz`);
  });

  await context.close();
}

await browser.close();

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log(`SSC browser smoke passed for ${baseUrl}.`);
