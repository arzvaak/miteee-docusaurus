import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const root = process.cwd();
const routeSource = fs.readFileSync(
  path.join(root, "app", "exams", "ssc-cgl", "topics", "[slug]", "page.tsx"),
  "utf8"
);
const componentSource = fs.readFileSync(
  path.join(root, "components", "SscTopicStudyPage.tsx"),
  "utf8"
);
const css = fs.readFileSync(
  path.join(root, "components", "SscTopicStudyPage.module.css"),
  "utf8"
);
const markdownSource = fs.readFileSync(path.join(root, "components", "MarkdownNote.tsx"), "utf8");

test("SSC CGL topic reader follows the exam, subject, topic learning hierarchy", () => {
  assert.match(routeSource, /<SscTopicStudyPage/);
  assert.match(componentSource, /<Link href="\/exams">Exams<\/Link>/);
  assert.match(componentSource, /<Link href="\/exams\/ssc-cgl">SSC CGL<\/Link>/);
  assert.match(componentSource, /sscCglSubjectHref\(topic\.section\)/);
  assert.match(componentSource, /\{topic\.subject\}<\/Link>/);
  assert.match(componentSource, /aria-current="page">\{topic\.title\}/);

  assert.match(componentSource, /estimatedReadMinutes\(topic\)/);
  assert.match(componentSource, /About \{readMinutes\} min read/);
  assert.match(componentSource, /\{sections\.length\} sections/);
  assert.match(componentSource, /Practice this topic/);
  assert.doesNotMatch(componentSource, /Corpus pressure|gap-repair|200\/200 route/);
});

test("SSC CGL topic reader renders every source section once without legacy appendices", () => {
  assert.equal(
    (componentSource.match(/<MarkdownNote content=\{section\.body\}/g) ?? []).length,
    1,
    "the source body should have one render path"
  );
  assert.equal(
    (componentSource.match(/section\.body/g) ?? []).length,
    2,
    "section bodies should only be read for time estimation and their single render path"
  );
  assert.match(componentSource, /<NoteQuizClient \/>/);
  assert.match(componentSource, /<details className=\{styles\.questionBankDetails\}>/);
  assert.match(componentSource, /Question-bank details/);
  assert.match(componentSource, /Practice topic/);
  assert.match(componentSource, /Start timed drill/);

  for (const legacyPath of [
    "getSscTopicPracticePreview",
    "previewQuestions",
    "formulaTable",
    "study.flowchart",
    "drillPrompt",
    "SscExplanationPanel",
    "MathText",
    "Reviewed PYQ-style questions from this topic"
  ]) {
    assert.doesNotMatch(routeSource + componentSource, new RegExp(legacyPath.replace(".", "\\.")));
  }
});

test("SSC CGL topic reader keeps previous and next navigation inside the current subject", () => {
  assert.match(routeSource, /candidate\.section === topic\.section/);
  assert.match(routeSource, /const previousTopic =/);
  assert.match(routeSource, /const nextTopic =/);
  assert.match(componentSource, /Previous topic/);
  assert.match(componentSource, /Next topic/);
  assert.match(componentSource, /\/exams\/ssc-cgl\/topics\//);
});

test("SSC CGL topic reader CSS guarantees a contained readable layout", () => {
  assert.match(css, /\.page\s*\{[\s\S]*?overflow-x:\s*clip/);
  assert.match(
    css,
    /\.readerLayout\s*\{[\s\S]*?grid-template-columns:\s*minmax\(210px,\s*248px\)\s+minmax\(0,\s*900px\)/
  );
  assert.match(css, /\.reader\s*\{[\s\S]*?max-width:\s*900px/);
  assert.match(css, /\.outline\s*\{[\s\S]*?position:\s*sticky[\s\S]*?align-self:\s*start/);

  assert.match(
    css,
    /\.sectionBody :global\(\.markdown-body table\)\s*\{[\s\S]*?display:\s*block[\s\S]*?overflow-x:\s*auto/
  );
  assert.match(css, /tbody tr:nth-child\(even\) td/);
  assert.match(css, /\.markdown-body th\)[\s\S]*?background:/);
  assert.match(
    css,
    /\.sectionBody :global\(\.markdown-body img\)\s*\{[\s\S]*?max-width:\s*100%[\s\S]*?height:\s*auto/
  );
  assert.match(css, /p:has\(> img\) \+ p:has\(> em:only-child\)/);
  assert.match(css, /\.sectionBody :global\(\.mermaid-shell\)[\s\S]*?overflow:\s*hidden/);
  assert.match(css, /\.sectionBody :global\(\.quiz-block\)[\s\S]*?max-width:\s*100%/);
  assert.match(css, /\.sectionBody :global\(\.study-answer\)/);
  assert.match(markdownSource, /<details className="study-answer">/);

  assert.match(
    css,
    /@media \(max-width:\s*900px\)[\s\S]*?\.readerLayout\s*\{[\s\S]*?grid-template-columns:\s*minmax\(0,\s*900px\)[\s\S]*?\.outline\s*\{[\s\S]*?position:\s*static/
  );
});
