import fs from "node:fs";
import path from "node:path";

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

function verifyQuantBook() {
  const docsRoot = path.join(root, "docs", "ssc-cgl");
  const dataPath = path.join(root, "data", "exams", "ssc-cgl", "quant-book", "index.json");
  const offenders: string[] = [];
  const retiredNotes = listFiles(docsRoot, ".md");
  if (retiredNotes.length) offenders.push(`docs/ssc-cgl: ${retiredNotes.length} retired Markdown notes remain`);
  if (!fs.existsSync(dataPath)) return [...offenders, `${relative(dataPath)}: missing Quant book artifact`];

  const book = JSON.parse(fs.readFileSync(dataPath, "utf8")) as { chapters?: Array<{ examples?: unknown[]; exercises?: Array<{ options?: Array<{ id?: string; text?: string }>; correctOption?: string }>; answerKeyPage?: number; sections?: Array<{ stimulus?: { type?: string; src?: string } }> }> };
  const chapters = book.chapters || [];
  const examples = chapters.flatMap((chapter) => chapter.examples || []);
  const exercises = chapters.flatMap((chapter) => chapter.exercises || []);
  if (chapters.length !== 20) offenders.push(`${relative(dataPath)}: expected 20 chapters, found ${chapters.length}`);
  if (examples.length !== 519) offenders.push(`${relative(dataPath)}: expected 519 examples, found ${examples.length}`);
  if (exercises.length !== 665) offenders.push(`${relative(dataPath)}: expected 665 exercises, found ${exercises.length}`);
  if (chapters.some((chapter) => !chapter.answerKeyPage)) offenders.push(`${relative(dataPath)}: every chapter must retain its answer-key page`);
  if (exercises.some((exercise) => exercise.options?.length !== 4 || exercise.options.some((option) => !option.id || !option.text) || !exercise.correctOption)) offenders.push(`${relative(dataPath)}: malformed or unkeyed exercise`);
  for (const chapter of chapters) {
    for (const section of chapter.sections || []) {
      const stimulus = section.stimulus;
      if (stimulus?.type === "image" && stimulus.src && !fs.existsSync(path.join(root, "public", stimulus.src.replace(/^\//, "")))) offenders.push(`${stimulus.src}: missing visual asset`);
    }
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

const offenders = [...verifyQuantBook(), ...verifyBuiltHtml()];

if (offenders.length > 0) {
  console.error("SSC rendered output verification failed:");
  for (const offender of offenders.slice(0, 50)) console.error(`- ${offender}`);
  if (offenders.length > 50) console.error(`- ...and ${offenders.length - 50} more`);
  process.exit(1);
}

console.log("SSC rendered output verified: retired notes are absent, Quant completeness gates pass, visual assets resolve, and no quiz answer is pre-revealed.");
