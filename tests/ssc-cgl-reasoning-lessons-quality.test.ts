import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const sourcePath = path.join(process.cwd(), "lib", "ssc-cgl-source.ts");
const reasoningDocsRoot = path.join(process.cwd(), "docs", "ssc-cgl", "reasoning");
const source = fs.readFileSync(sourcePath, "utf8");

const canonicalReasoningSlugs = [
  ...new Set(
    [...source.matchAll(/\{\s*slug:\s*"([^"]+)"[\s\S]*?section:\s*"([^"]+)"/g)]
      .filter((match) => match[2] === "reasoning")
      .map((match) => match[1])
  )
];

type Lesson = {
  slug: string;
  notePath: string;
  note: string;
  frontmatter: string;
  body: string;
};

const lessons: Lesson[] = canonicalReasoningSlugs.map((slug) => {
  const notePath = path.join(reasoningDocsRoot, `${slug}.md`);
  assert.ok(fs.existsSync(notePath), `missing canonical Reasoning lesson: ${slug}`);
  const note = fs.readFileSync(notePath, "utf8");
  const match = note.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  assert.ok(match, `${slug} should have frontmatter`);
  return {
    slug,
    notePath,
    note,
    frontmatter: match[1],
    body: note.slice(match[0].length).trim()
  };
});

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

test("Reasoning lesson inventory is derived from canonical topic seeds", () => {
  assert.deepEqual(canonicalReasoningSlugs, [
    "analogy-classification",
    "series-coding",
    "blood-relation",
    "direction-distance",
    "syllogism-venn",
    "non-verbal-reasoning",
    "calendar-clock",
    "statement-conclusion",
    "seating-arrangement",
    "mathematical-operations"
  ]);

  const allReasoningDocs = fs.readdirSync(reasoningDocsRoot)
    .filter((name) => name.endsWith(".md"))
    .map((name) => name.replace(/\.md$/, ""));
  const supportPages = allReasoningDocs.filter((slug) => !canonicalReasoningSlugs.includes(slug)).sort();
  assert.deepEqual(supportPages, ["arrangements-and-logic", "high-yield-rules"]);
});

test("all canonical Reasoning lessons follow the reviewed progressive chapter contract", () => {
  for (const lesson of lessons) {
    const { slug, frontmatter, body } = lesson;
    assert.match(frontmatter, /^review_status:\s*agent-reviewed\s*$/m, `${slug} is not agent reviewed`);
    assert.match(frontmatter, /^content_quality:\s*manually-curated\s*$/m, `${slug} is not manually curated`);
    assert.doesNotMatch(frontmatter, /deepseek|ai-authored-needs-agent-review/i, `${slug} retains generated-review metadata`);

    assert.ok(body.length >= 4_000, `${slug} is too thin to teach the topic`);
    assert.ok(body.length <= 18_000, `${slug} has regressed to generated bulk`);

    const h2Headings = [...body.matchAll(/^##\s+(.+)$/gm)].map((match) => match[1]);
    assert.ok(h2Headings.length >= 6 && h2Headings.length <= 8, `${slug} should have 6–8 purposeful H2 sections`);
    assert.equal(new Set(h2Headings).size, h2Headings.length, `${slug} repeats an H2 heading`);

    assert.doesNotMatch(
      body,
      /Corpus Pressure|promoted questions?|Scribd|book-PYQ|source pipeline|200\/200|Final Practice Queue|PYQ Mapping|##\s+Trap Table|##\s+Flowchart|##\s+Solved Examples|##\s+200\/200 Drill|SSC-FINAL-PRACTICE-QUEUE|```mermaid/i,
      `${slug} retains generator or internal-pipeline content`
    );
    assert.doesNotMatch(body, /Examination wise|\|\s*(?:CPO|CHSL)\b|\/{1,}:|_{5,}|[\uE000-\uF8FF]/i, `${slug} contains OCR-like debris`);
    assert.doesNotMatch(body, /\*\*Example\s+\d+/i, `${slug} has regressed to a detached numbered-example dump`);

    const timingMentions = [...body.matchAll(/36-second/gi)].length;
    assert.ok(timingMentions <= 2, `${slug} overuses the 36-second slogan`);

    const workedExamples = [...body.matchAll(/\*\*Worked example/gi)].length;
    const answerReveals = [...body.matchAll(/<summary>Answer and explanation<\/summary>/g)].length;
    assert.ok(workedExamples >= 3, `${slug} needs placed worked examples`);
    assert.ok(answerReveals >= 7, `${slug} needs adjacent self-check answers`);

    const mixedIndex = body.search(/^##\s+.*Mixed/im);
    const masteryIndex = body.indexOf("Mastery", mixedIndex);
    assert.ok(mixedIndex > body.length * 0.5, `${slug} mixed practice should sit near the end`);
    assert.ok(masteryIndex > mixedIndex, `${slug} needs a mastery step after mixed practice begins`);

    for (const details of body.matchAll(/<details>/g)) {
      const index = details.index ?? 0;
      const prefix = body.slice(0, index);
      const nearestPrompt = Math.max(prefix.lastIndexOf("**Self-check"), prefix.lastIndexOf("### Question"));
      assert.ok(nearestPrompt >= 0 && index - nearestPrompt < 1_200, `${slug} has a detached answer reveal`);
    }

    const routeLines = body.split(/\r?\n/).filter((line) => line.includes("/exams/ssc-cgl"));
    for (const line of routeLines) {
      assert.match(line, /\[[^\]]+\]\(\/exams\/ssc-cgl\/[^)]+\)/, `${slug} contains a naked internal route`);
    }
  }
});

test("Reasoning lesson tables stay compact and structurally valid", () => {
  for (const lesson of lessons) {
    const tables = markdownTables(lesson.body);
    assert.ok(tables.length <= 5, `${lesson.slug} has more than five tables`);

    for (const [index, rows] of tables.entries()) {
      const headerWidth = tableCells(rows[0]).length;
      assert.ok(headerWidth <= 4, `${lesson.slug} table ${index + 1} exceeds four columns`);
      assert.ok(rows.length - 2 <= 10, `${lesson.slug} table ${index + 1} exceeds ten data rows`);
      for (const row of rows.slice(2)) {
        assert.equal(tableCells(row).length, headerWidth, `${lesson.slug} table ${index + 1} has a malformed row`);
      }
    }
  }
});

test("every Reasoning concept map is present, captioned, accessible, and timeless", () => {
  for (const lesson of lessons) {
    const lines = lesson.body.split(/\r?\n/);
    const images = lines
      .map((line, index) => ({ line, index, match: line.match(/^!\[([^\]]+)\]\((\/img\/ssc-cgl\/[^)]+\.svg)\)$/) }))
      .filter((item) => item.match);
    assert.equal(images.length, 1, `${lesson.slug} should use one concept map`);

    const [{ index, match }] = images;
    assert.ok(match?.[1].trim(), `${lesson.slug} concept map needs alt text`);
    assert.match(lines[index + 1] ?? "", /^\*.+\*$/, `${lesson.slug} concept map needs an immediate visible caption`);

    const imagePath = path.join(process.cwd(), "public", match![2].replace(/^\//, ""));
    assert.ok(fs.existsSync(imagePath), `${lesson.slug} concept map is missing`);
    const svg = fs.readFileSync(imagePath, "utf8");
    assert.match(svg, /<svg[^>]+viewBox="[^"]+"[^>]+role="img"/s, `${lesson.slug} SVG needs viewBox and role`);
    assert.match(svg, /<title id="title">[^<]+<\/title>/, `${lesson.slug} SVG needs a title`);
    assert.match(svg, /<desc id="desc">[^<]+<\/desc>/, `${lesson.slug} SVG needs a description`);
    assert.doesNotMatch(svg, /\b\d{2,4}-Q\b|\b\d{2,4}-question\b|200\/200|Scribd|book-PYQ|corpus|promoted/i, `${lesson.slug} SVG retains stale corpus or score language`);
  }
});

test("high-risk Reasoning rules remain explicitly correct", () => {
  const bySlug = new Map(lessons.map((lesson) => [lesson.slug, lesson.body]));

  assert.match(bySlug.get("analogy-classification")!, /GIK[\s\S]{0,500}HJL/);
  assert.match(bySlug.get("analogy-classification")!, /`HJK` is wrong because the final `K` does not move forward to `L`/);

  assert.match(bySlug.get("series-coding")!, /test a rule on \*\*every available term\*\*/i);
  assert.match(bySlug.get("series-coding")!, /Odd-position terms are \$3,5,7,9\$/);

  assert.match(bySlug.get("blood-relation")!, /“Parent” fixes generation but not gender/i);
  assert.match(bySlug.get("blood-relation")!, /Only son.*daughters may still exist/is);

  assert.match(bySlug.get("direction-distance")!, /x=E-W,\\qquad y=N-S/);
  assert.match(bySlug.get("direction-distance")!, /final direction comes from net displacement/i);

  assert.match(bySlug.get("syllogism-venn")!, /universal statement.*does not by itself prove that any A exists/is);
  assert.match(bySlug.get("syllogism-venn")!, /“Only doctors are surgeons” means \*\*all surgeons are doctors\*\*/);

  assert.match(bySlug.get("non-verbal-reasoning")!, /vertical mirror swaps left and right/i);
  assert.match(bySlug.get("non-verbal-reasoning")!, /horizontal water line swaps top and bottom/i);

  assert.match(bySlug.get("calendar-clock")!, /\\theta=\\left\|30H-5\.5M\\right\|/);
  assert.match(bySlug.get("calendar-clock")!, /century year is a leap year only when divisible by 400/i);

  assert.match(bySlug.get("statement-conclusion")!, /Could the statement be true while the conclusion is false/i);
  assert.match(bySlug.get("statement-conclusion")!, /“after” does not prove sole causation/i);

  assert.match(bySlug.get("seating-arrangement")!, /Centre \| Clockwise \| Anticlockwise/);
  assert.match(bySlug.get("seating-arrangement")!, /Total people.*left rank.*right rank.*-1/s);

  assert.match(bySlug.get("mathematical-operations")!, /Rewrite every coded symbol before arithmetic/i);
  assert.match(bySlug.get("mathematical-operations")!, /Division and multiplication share a level, so work left to right/i);
});
