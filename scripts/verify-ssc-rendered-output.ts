import fs from "node:fs";
import path from "node:path";
import { prepareMarkdownContent } from "../lib/markdown-normalize";

const root = process.cwd();
const revealMarkerPattern = /data-correct="true"|q-correct|q-wrong|<details class="quiz-exp" open>/i;

function listFiles(directory: string, suffix: string) {
  const files: string[] = [];
  if (!fs.existsSync(directory)) return files;

  const visit = (current: string) => {
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const fullPath = path.join(current, entry.name);
      if (entry.isDirectory()) visit(fullPath);
      else if (entry.isFile() && entry.name.endsWith(suffix)) files.push(fullPath);
    }
  };

  visit(directory);
  return files;
}

function relative(filePath: string) {
  return path.relative(root, filePath).replace(/\\/g, "/");
}

function articleBlocks(html: string) {
  return Array.from(html.matchAll(/<article class="quiz-block note-quiz-block" data-answer="[a-d]">([\s\S]*?)<\/article>/g)).map((match) => match[0] || "");
}

function verifySscMarkdownNotes() {
  const docsRoot = path.join(root, "docs", "ssc-cgl");
  const offenders: string[] = [];

  for (const filePath of listFiles(docsRoot, ".md")) {
    const rendered = prepareMarkdownContent(fs.readFileSync(filePath, "utf8"));
    const name = relative(filePath);
    if (revealMarkerPattern.test(rendered)) offenders.push(`${name}: pre-revealed quiz marker`);

    for (const block of articleBlocks(rendered)) {
      if (!/200\/200 Drill/.test(block)) continue;
      if (!/<p><strong>Method:<\/strong>[\s\S]*?<\/p>/.test(block)) offenders.push(`${name}: 200/200 drill missing Method`);
      if (!/<p><strong>Why it fits:<\/strong>[\s\S]*?<\/p>/.test(block)) offenders.push(`${name}: 200/200 drill missing Why it fits`);
      if (!/<p><strong>Trap:<\/strong>[\s\S]*?<\/p>/.test(block)) offenders.push(`${name}: 200/200 drill missing Trap`);
    }
  }

  const analogyPath = path.join(docsRoot, "reasoning", "analogy-classification.md");
  const analogy = prepareMarkdownContent(fs.readFileSync(analogyPath, "utf8"));
  const questionIndex = analogy.indexOf("Thermometer : Temperature :: Clock : ?");
  const selfCheck = questionIndex >= 0 ? analogy.slice(questionIndex, questionIndex + 700) : "";
  if (!selfCheck) offenders.push(`${relative(analogyPath)}: thermometer self-check did not render`);
  if (selfCheck && !/Options: Time, Hour, Hand, Alarm/.test(selfCheck)) {
    offenders.push(`${relative(analogyPath)}: thermometer self-check options are missing`);
  }
  if (selfCheck && !/> \*\*Answer and explanation\*\*[\s\S]*?> \*\*Time\.\*\* A thermometer measures temperature; a clock measures time/.test(selfCheck)) {
    offenders.push(`${relative(analogyPath)}: thermometer self-check lacks its adjacent Time explanation`);
  }

  return offenders;
}

function verifyBuiltHtml() {
  const htmlRoot = path.join(root, ".next", "server", "app");
  const offenders: string[] = [];

  for (const filePath of listFiles(htmlRoot, ".html")) {
    const html = fs.readFileSync(filePath, "utf8");
    if (revealMarkerPattern.test(html)) offenders.push(`${relative(filePath)}: pre-revealed quiz marker`);
  }

  return offenders;
}

const offenders = [...verifySscMarkdownNotes(), ...verifyBuiltHtml()];

if (offenders.length > 0) {
  console.error("SSC rendered output verification failed:");
  for (const offender of offenders.slice(0, 50)) console.error(`- ${offender}`);
  if (offenders.length > 50) console.error(`- ...and ${offenders.length - 50} more`);
  process.exit(1);
}

console.log("SSC rendered output verified: no pre-revealed quiz answers and 200/200 drill explanations are present.");
