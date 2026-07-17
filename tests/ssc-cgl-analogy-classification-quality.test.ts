import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const notePath = path.join(process.cwd(), "docs", "ssc-cgl", "reasoning", "analogy-classification.md");
const imagePath = path.join(process.cwd(), "public", "img", "ssc-cgl", "analogy-classification-map.svg");
const note = fs.readFileSync(notePath, "utf8");
const image = fs.readFileSync(imagePath, "utf8");

const frontmatterMatch = note.match(/^---\r?\n([\s\S]*?)\r?\n---/);
assert.ok(frontmatterMatch, "analogy chapter should have frontmatter");
const frontmatter = frontmatterMatch[1];
const body = note.slice(frontmatterMatch[0].length).trim();

function sectionBody(title: string) {
  const headings = [...body.matchAll(/^##\s+(.+)$/gm)];
  const index = headings.findIndex((heading) => heading[1].trim() === title);
  assert.notEqual(index, -1, `missing section: ${title}`);
  const start = (headings[index].index ?? 0) + headings[index][0].length;
  const end = index + 1 < headings.length ? headings[index + 1].index ?? body.length : body.length;
  return body.slice(start, end);
}

function tableCells(line: string) {
  return line
    .trim()
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split(/(?<!\\)\|/)
    .map((cell) => cell.trim());
}

function markdownTables(markdown: string) {
  const lines = markdown.split(/\r?\n/);
  const tables: string[][] = [];

  for (let index = 0; index < lines.length - 1; index += 1) {
    if (!lines[index].trim().startsWith("|")) continue;
    if (!/^\|(?:\s*:?-{3,}:?\s*\|)+\s*$/.test(lines[index + 1].trim())) continue;

    const rows: string[] = [];
    while (index < lines.length && lines[index].trim().startsWith("|")) {
      rows.push(lines[index]);
      index += 1;
    }
    tables.push(rows);
  }

  return tables;
}

test("analogy chapter is reviewed learner-facing content", () => {
  assert.match(frontmatter, /^review_status:\s*agent-reviewed\s*$/m);
  assert.match(frontmatter, /^content_quality:\s*manually-curated\s*$/m);
  assert.doesNotMatch(frontmatter, /deepseek|ai-authored-needs-agent-review/i);

  const headings = [...body.matchAll(/^##\s+(.+)$/gm)].map((match) => match[1]);
  assert.equal(headings.length, 7, "chapter should keep a purposeful seven-section progression");
  assert.deepEqual(headings, [
    "1. The Exact-Relation Method",
    "2. Word Relations",
    "3. Number Relations",
    "4. Letter Relations",
    "5. Classification: Find the Rule of Three",
    "6. Speed and Trap Control",
    "7. Mixed Exam Practice and Mastery"
  ]);

  assert.doesNotMatch(
    body,
    /Corpus Pressure|promoted questions?|Scribd|book-PYQ|source pipeline|1285|200\/200|Final Practice Queue|PYQ Mapping|deepseek|```mermaid/i
  );
  assert.doesNotMatch(body, /\bFoal\b|\bColt\b/i, "ambiguous horse-young-one options must not return");
  assert.doesNotMatch(body, /##\s+Solved Examples|\*\*Example\s+\d+/i, "chapter should not regress to an example dump");

  assert.match(body, /GIK[\s\S]{0,500}HJL/);
  assert.match(body, /`HJK` is wrong because the final `K` does not move forward to `L`/);
  assert.doesNotMatch(body, /HJK\s*\(\s*\+1/i);

  const routeLines = body.split(/\r?\n/).filter((line) => line.includes("/exams/ssc-cgl"));
  assert.equal(routeLines.length, 1, "chapter should have one deliberate next-step route");
  assert.match(routeLines[0], /\[[^\]]+\]\(\/exams\/ssc-cgl\/[^)]+\)/, "internal route should be a real link");
});

test("analogy chapter keeps tables compact and readable", () => {
  const tables = markdownTables(body);
  assert.equal(tables.length, 5, "chapter should use no more than five purposeful tables");

  for (const [index, rows] of tables.entries()) {
    const headerWidth = tableCells(rows[0]).length;
    assert.ok(headerWidth <= 4, `table ${index + 1} has ${headerWidth} columns; maximum is four`);
    assert.ok(rows.length - 2 <= 10, `table ${index + 1} is longer than ten data rows`);
    for (const row of rows.slice(2)) {
      assert.equal(tableCells(row).length, headerWidth, `table ${index + 1} has a malformed row`);
    }
  }
});

test("concept map is captioned once and contains timeless teaching labels", () => {
  const lines = body.split(/\r?\n/);
  const imageLines = lines
    .map((line, index) => ({ line, index }))
    .filter(({ line }) => line.includes("/img/ssc-cgl/analogy-classification-map.svg"));
  assert.equal(imageLines.length, 1, "concept map should appear exactly once");
  assert.match(lines[imageLines[0].index + 1], /^\*Concept map: .+\*$/, "image needs a visible italic caption immediately after it");

  assert.match(image, /<svg[^>]+viewBox="0 0 960 520"[^>]+role="img"/);
  assert.match(image, /<title id="title">[^<]+<\/title>/);
  assert.match(image, /<desc id="desc">[^<]+<\/desc>/);
  assert.match(image, />Word relations<|>Number relations<|>Letter relations<|>Classification</);
  assert.match(image, />36-second decision loop</);
  assert.doesNotMatch(image, /1285|Scribd|PYQ|corpus|promoted|source provenance/i);
});

test("formulae use KaTeX-friendly notation and verified letter logic", () => {
  assert.match(body, /\$b=a\^2\+1\$/);
  assert.match(body, /\$A=1, B=2, \\ldots, Z=26\$/);
  assert.match(body, /\$p_i'=p_i\+k\$/);
  assert.match(body, /\$\$[\s\S]*?7\^2\+1=49\+1=50[\s\S]*?\$\$/);
  assert.match(body, /\(7,9,11\)[\s\S]{0,120}\(8,10,12\)[\s\S]{0,80}HJL/);
});

test("worked examples, self-checks, and explanations stay near each concept", () => {
  for (const title of [
    "2. Word Relations",
    "3. Number Relations",
    "4. Letter Relations",
    "5. Classification: Find the Rule of Three"
  ]) {
    const section = sectionBody(title);
    const worked = section.indexOf("**Worked example**");
    const selfCheck = section.indexOf("**Self-check**");
    const answer = section.indexOf("<details>", selfCheck);
    assert.ok(worked >= 0, `${title} needs an immediate worked example`);
    assert.ok(selfCheck > worked, `${title} needs a self-check after instruction`);
    assert.ok(answer > selfCheck, `${title} needs a revealable answer after its self-check`);
  }

  const mixed = sectionBody("7. Mixed Exam Practice and Mastery");
  const questions = [...mixed.matchAll(/^###\s+Question\s+\d+/gm)];
  assert.equal(questions.length, 6, "mixed practice should remain a short six-question set");

  for (const [index, question] of questions.entries()) {
    const start = question.index ?? 0;
    const end = index + 1 < questions.length ? questions[index + 1].index ?? mixed.length : mixed.indexOf("### Mastery check");
    const questionBlock = mixed.slice(start, end);
    assert.match(questionBlock, /<details>[\s\S]*?<summary>Answer and explanation<\/summary>[\s\S]*?<\/details>/);
  }

  const reveals = [...body.matchAll(/<summary>Answer and explanation<\/summary>/g)];
  assert.ok(reveals.length >= 10, "chapter needs answer reveals beside practice, not a detached answer dump");
});
