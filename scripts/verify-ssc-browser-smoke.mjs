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

async function runCheck(label, check) {
  try {
    await check();
  } catch (error) {
    fail(label, error instanceof Error ? error.message : String(error));
  }
}

async function requireText(page, text, label) {
  const locator = page.getByText(text, { exact: true }).first();
  await locator.waitFor({ state: "visible", timeout: 20_000 });
  if (!(await locator.isVisible())) fail(label, `missing visible text: ${text}`);
}

async function checkNoHorizontalOverflow(page, label) {
  const dimensions = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth
  }));
  if (dimensions.scrollWidth > dimensions.clientWidth + 2) {
    fail(label, `horizontal overflow (${dimensions.scrollWidth}px content in ${dimensions.clientWidth}px viewport)`);
  }
}

async function checkSubjectHome(page, label) {
  await page.goto(`${baseUrl}/exams/ssc-cgl`, { waitUntil: "networkidle" });
  await page.getByRole("heading", { name: "Build each subject. Then test it.", level: 1 }).waitFor({ timeout: 20_000 });
  const reasoningCard = page.locator("article").filter({
    has: page.getByRole("heading", { name: "Reasoning", exact: true })
  });
  await reasoningCard.waitFor({ state: "visible", timeout: 20_000 });

  const subjectLink = reasoningCard.getByRole("link", { name: /Open Reasoning subject/i }).first();
  if ((await subjectLink.getAttribute("href")) !== "/exams/ssc-cgl/subjects/reasoning") {
    fail(label, "Reasoning card does not point to its stable subject homepage");
  }
  await subjectLink.click();
  await page.waitForURL(`${baseUrl}/exams/ssc-cgl/subjects/reasoning`, { timeout: 20_000 });
  await page.getByRole("heading", { name: "General Intelligence and Reasoning", level: 1 }).waitFor({ timeout: 20_000 });
  await requireText(page, "Complete table of contents", label);
  await requireText(page, "Choose exactly what to study next.", label);

  const toc = page.locator("section[aria-labelledby='ssc-subject-toc-title']");
  const studyLinks = toc.getByRole("link", { name: "Study topic" });
  if ((await studyLinks.count()) !== 12) {
    fail(label, `expected 12 Reasoning study notes, found ${await studyLinks.count()}`);
  }
  await page.getByRole("searchbox", { name: /Search Reasoning topics/i }).fill("blood relation");
  if ((await toc.getByRole("link", { name: "Study topic" }).count()) !== 1) {
    fail(label, "Reasoning TOC search did not narrow the study-note list");
  }

  await checkNoHorizontalOverflow(page, label);
}

async function checkSetup(page, label) {
  await page.goto(`${baseUrl}/practice`, { waitUntil: "networkidle" });
  await page.getByRole("heading", { name: "What do you want to practice?", level: 1 }).waitFor({ timeout: 20_000 });

  const modes = [
    "Quick 10",
    "Section Test",
    "Full Mock",
    "Endless Practice",
    "Book / PYQ Practice",
    "Weakness Repair"
  ];
  const modeRegion = page.locator('section[aria-label="Choose a practice mode"]');
  for (const mode of modes) {
    const button = modeRegion.getByRole("button").filter({ hasText: mode });
    if ((await button.count()) !== 1) fail(label, `expected one ${mode} mode card`);
  }

  const fullMock = modeRegion.getByRole("button").filter({ hasText: "Full Mock" });
  if ((await fullMock.getAttribute("aria-pressed")) !== "true") {
    fail(label, "Full Mock is not the selected default");
  }

  for (const text of ["Configure your session", "Due for review"]) {
    await requireText(page, text, label);
  }

  const selects = page.locator("#ssc-session-config select");
  if ((await selects.count()) !== 5) fail(label, `expected 5 configuration controls, found ${await selects.count()}`);
  const expectedSelections = [
    ["Section / subject", "all", "All four sections"],
    ["Question length", "100", "100 Q"],
    ["Timer", "exam", "Exam clock"],
    ["Question source", "book", "Book / PYQ"],
    ["Difficulty", "all", "Mixed"]
  ];
  const controlLabels = await page.locator("#ssc-session-config label > span").allTextContents();
  for (const [index, [controlName, expectedValue, expectedLabel]] of expectedSelections.entries()) {
    if (controlLabels[index]?.trim() !== controlName) {
      fail(label, `configuration control ${index + 1} is not labelled ${controlName}`);
    }
    const control = selects.nth(index);
    if ((await control.inputValue()) !== expectedValue) {
      fail(label, `${controlName} did not default to ${expectedValue}`);
    }
    const selectedLabel = await control.locator("option:checked").textContent();
    if (selectedLabel?.trim() !== expectedLabel) {
      fail(label, `${controlName} did not show ${expectedLabel}`);
    }
  }

  const quickMode = modeRegion.getByRole("button").filter({ hasText: "Quick 10" });
  await quickMode.click();
  await page.getByRole("heading", { name: "Quick 10", level: 2 }).waitFor({ timeout: 10_000 });
  await page.getByRole("button", { name: "Start Quick 10" }).waitFor({ timeout: 10_000 });

  const reasoningSetup = page.getByRole("button", { name: /^Configure a Reasoning section test\./ });
  if ((await reasoningSetup.count()) !== 1) fail(label, "missing Reasoning readiness shortcut");

  await checkNoHorizontalOverflow(page, label);
}

async function checkTimedSession(page, label) {
  const sessionUrl = `${baseUrl}/exams/ssc-cgl/session?mode=quick&section=reasoning&length=10&timer=off&source=book&difficulty=all&seed=browser-smoke`;
  await page.goto(sessionUrl, { waitUntil: "networkidle" });
  await page.getByRole("navigation", { name: "Test sections" }).waitFor({ timeout: 20_000 });
  await page.getByRole("heading", { name: "Question palette", level: 2 }).waitFor({ timeout: 20_000 });
  await requireText(page, "Question 1 of 10", label);

  const answerGroup = page.getByRole("group", { name: "Choose one answer" });
  await answerGroup.waitFor({ timeout: 20_000 });
  const options = answerGroup.getByRole("radio");
  if ((await options.count()) !== 4) fail(label, `expected 4 answer options, found ${await options.count()}`);

  await options.first().click();
  if (!(await options.first().isChecked())) fail(label, "answer choice did not become selected");

  const clearButton = page.getByRole("button", { name: "Clear response" });
  if (!(await clearButton.isEnabled())) fail(label, "Clear response did not enable after answering");

  await page.getByRole("button", { name: "Mark for review & next" }).click();
  await requireText(page, "Question 2 of 10", label);

  const firstPaletteCell = page.getByRole("button", { name: /^Question 1:/ });
  const firstPaletteLabel = await firstPaletteCell.getAttribute("aria-label");
  if (!firstPaletteLabel || !/marked/i.test(firstPaletteLabel)) {
    fail(label, `Question 1 was not marked for review (${firstPaletteLabel ?? "no label"})`);
  }

  await requireText(page, "Answers and explanations stay hidden until you submit the test.", label);
  await checkNoHorizontalOverflow(page, label);
}

async function checkEndlessSession(page, label) {
  const sessionUrl = `${baseUrl}/exams/ssc-cgl/session?mode=endless&section=all&length=endless&timer=off&source=book&difficulty=all&seed=browser-smoke`;
  await page.goto(sessionUrl, { waitUntil: "networkidle" });
  await page.getByRole("heading", { name: "No finish line. Just focused repetitions.", level: 2 }).waitFor({ timeout: 20_000 });
  await requireText(page, "SSC CGL · Endless practice", label);

  const options = page.getByRole("radio");
  await options.first().waitFor({ timeout: 20_000 });
  if ((await options.count()) !== 4) fail(label, `expected 4 endless-practice options, found ${await options.count()}`);

  await options.first().click();
  await page.getByRole("button", { name: "Check answer" }).click();

  const feedback = page.locator("aside[aria-live='polite']");
  await feedback.waitFor({ state: "visible", timeout: 10_000 });
  const feedbackText = await feedback.innerText();
  if (!/Correct — keep the rhythm\.|Not quite — repair the method now\./.test(feedbackText)) {
    fail(label, "answer feedback did not appear");
  }

  await page.getByRole("button", { name: "Next question" }).waitFor({ timeout: 10_000 });
  await checkNoHorizontalOverflow(page, label);
}

const hostResolverRules = process.env.SSC_BROWSER_HOST_RESOLVER_RULES?.trim();
const browser = await chromium.launch({
  headless: true,
  ...(hostResolverRules
    ? { args: [`--host-resolver-rules=${hostResolverRules}`] }
    : {}),
});

for (const viewport of viewports) {
  const context = await browser.newContext({ viewport });
  const page = await context.newPage();
  const consoleErrors = [];
  page.on("console", (message) => {
    if (message.type() !== "error") return;
    const text = message.text();
    if (!text.includes("net::ERR_NETWORK_ACCESS_DENIED")) consoleErrors.push(text);
  });
  page.on("pageerror", (error) => consoleErrors.push(error.message));

  await runCheck(`${viewport.name} setup`, () => checkSetup(page, `${viewport.name} setup`));
  await runCheck(`${viewport.name} subject home`, () => checkSubjectHome(page, `${viewport.name} subject home`));
  await runCheck(`${viewport.name} timed session`, () => checkTimedSession(page, `${viewport.name} timed session`));
  await runCheck(`${viewport.name} endless session`, () => checkEndlessSession(page, `${viewport.name} endless session`));

  if (consoleErrors.length) {
    fail(viewport.name, `console/page errors: ${[...new Set(consoleErrors)].join(" | ")}`);
  }
  await context.close();
}

await browser.close();

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log(`SSC browser smoke passed for ${baseUrl}.`);
