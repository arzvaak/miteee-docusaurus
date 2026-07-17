import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const sourcePath = path.join(process.cwd(), "lib", "ssc-cgl-source.ts");
const docsRoot = path.join(process.cwd(), "docs", "ssc-cgl", "english");
const source = fs.readFileSync(sourcePath, "utf8");

const canonicalEnglishSlugs = [
  ...new Set(
    [...source.matchAll(/\{\s*slug:\s*"([^"]+)"[\s\S]*?section:\s*"([^"]+)"/g)]
      .filter((match) => match[2] === "english-comprehension")
      .map((match) => match[1])
  )
];

type Lesson = {
  slug: string;
  frontmatter: string;
  body: string;
};

const lessons: Lesson[] = canonicalEnglishSlugs.map((slug) => {
  const notePath = path.join(docsRoot, `${slug}.md`);
  assert.ok(fs.existsSync(notePath), `missing canonical English lesson: ${slug}`);
  const note = fs.readFileSync(notePath, "utf8");
  const match = note.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  assert.ok(match, `${slug} should have frontmatter`);
  return {
    slug,
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

test("English lesson inventory is derived from canonical topic seeds", () => {
  assert.deepEqual(canonicalEnglishSlugs, [
    "grammar-error-spotting",
    "vocabulary-cloze",
    "reading-comprehension",
    "synonyms-antonyms",
    "idioms-phrases",
    "sentence-improvement",
    "active-passive-direct-indirect",
    "spelling-one-word",
    "para-jumbles",
    "fill-in-the-blanks"
  ]);
});

test("all canonical English lessons follow the reviewed chapter contract", () => {
  for (const { slug, frontmatter, body } of lessons) {
    assert.match(frontmatter, /^review_status:\s*agent-reviewed\s*$/m, `${slug} is not agent reviewed`);
    assert.match(frontmatter, /^content_quality:\s*manually-curated\s*$/m, `${slug} is not manually curated`);
    assert.doesNotMatch(frontmatter, /deepseek|ai-authored-needs-agent-review/i, `${slug} retains generated metadata`);

    assert.ok(body.length >= 6_000, `${slug} is too thin to teach the topic`);
    assert.ok(body.length <= 10_000, `${slug} has regressed to generated bulk`);

    const headings = [...body.matchAll(/^##\s+(.+)$/gm)].map((match) => match[1]);
    assert.ok(headings.length >= 6 && headings.length <= 8, `${slug} should have 6–8 purposeful H2 sections`);
    assert.equal(new Set(headings).size, headings.length, `${slug} repeats an H2 heading`);

    const placedPrompts = [...body.matchAll(/^\*\*(?:Worked example|Self-check)\*\*|^###\s+Question\s+\d+/gim)].length;
    const workedExamples = [...body.matchAll(/^\*\*Worked example\*\*$/gim)].length;
    const answerReveals = [...body.matchAll(/<summary>Answer and explanation<\/summary>/g)].length;
    assert.ok(placedPrompts >= 10, `${slug} needs at least ten placed examples, checks, or questions`);
    assert.ok(workedExamples >= 3, `${slug} needs at least three placed worked examples`);
    assert.ok(answerReveals >= 5, `${slug} needs at least five adjacent answer reveals`);

    const mixedIndex = body.search(/^##\s+.*(?:Mixed|Practice)/im);
    assert.ok(mixedIndex > body.length * 0.5, `${slug} mixed practice should sit near the end`);
    assert.ok(body.slice(-2_000).includes(`](/exams/ssc-cgl/practice/${slug})`), `${slug} needs its canonical focused-practice closer`);
    assert.match(body.slice(0, 1_200), /Direct[\s\S]*mark[- ]and[- ]return|mark[- ]and[- ]return[\s\S]*Direct/i, `${slug} must distinguish direct work from mark-and-return work`);

    for (const details of body.matchAll(/<details>/g)) {
      const index = details.index ?? 0;
      const prefix = body.slice(0, index);
      const nearestPrompt = Math.max(prefix.lastIndexOf("**Self-check"), prefix.lastIndexOf("### Question"));
      assert.ok(nearestPrompt >= 0 && index - nearestPrompt < 1_500, `${slug} has a detached answer reveal`);
    }

    assert.doesNotMatch(
      body,
      /Corpus Pressure|promoted questions?|Scribd|book-PYQ|source pipeline|\b200\/200\b|Final Practice Queue|PYQ Mapping|Full Type Tree|First 5-Second|High-Frequency Vocabulary Bank|25-question|##\s+Trap Table|##\s+Flowchart|##\s+Solved Examples|```mermaid/i,
      `${slug} retains generator, vocabulary-dump, or internal-pipeline content`
    );
    assert.doesNotMatch(body, /\*\*Example\s+\d+/i, `${slug} has a detached numbered-example dump`);
    assert.doesNotMatch(body, /Examination wise|\|\s*(?:CPO|CHSL)\b|_{5,}|[\uE000-\uF8FF]/i, `${slug} contains OCR-like debris`);
    assert.doesNotMatch(body, /(?:solve|finish|answer|attempt|scan).{0,35}\b(?:5|10|20|25|30|36|45)-second\b/i, `${slug} imposes a fake exact item timer`);

    const routeLines = body.split(/\r?\n/).filter((line) => line.includes("/exams/ssc-cgl"));
    for (const line of routeLines) {
      assert.match(line, /\[[^\]]+\]\(\/exams\/ssc-cgl\/[^)]+\)/, `${slug} contains a naked internal route`);
    }
  }
});

test("English lesson tables stay compact and structurally valid", () => {
  for (const { slug, body } of lessons) {
    const tables = markdownTables(body);
    assert.ok(tables.length <= 5, `${slug} has more than five tables`);

    for (const [index, rows] of tables.entries()) {
      const width = tableCells(rows[0]).length;
      assert.ok(width <= 4, `${slug} table ${index + 1} exceeds four columns`);
      assert.ok(rows.length - 2 <= 10, `${slug} table ${index + 1} exceeds ten data rows`);
      for (const row of rows.slice(2)) {
        assert.equal(tableCells(row).length, width, `${slug} table ${index + 1} has a malformed row`);
      }
    }
  }
});

test("every English concept map is present, captioned, accessible, and timeless", () => {
  for (const { slug, body } of lessons) {
    const lines = body.split(/\r?\n/);
    const images = lines
      .map((line, index) => ({ line, index, match: line.match(/^!\[([^\]]+)\]\((\/img\/ssc-cgl\/[^)]+\.svg)\)$/) }))
      .filter((item) => item.match);
    assert.equal(images.length, 1, `${slug} should use one concept map`);

    const [{ index, match }] = images;
    assert.ok(match?.[1].trim(), `${slug} concept map needs alt text`);
    assert.match(lines[index + 1] ?? "", /^\*.+\*$/, `${slug} concept map needs an immediate visible caption`);

    const imagePath = path.join(process.cwd(), "public", match![2].replace(/^\//, ""));
    assert.ok(fs.existsSync(imagePath), `${slug} concept map is missing`);
    const svg = fs.readFileSync(imagePath, "utf8");
    assert.match(svg, /<svg[^>]+viewBox="[^"]+"[^>]+role="img"/s, `${slug} SVG needs viewBox and role`);
    assert.match(svg, /<title id="title">[^<]+<\/title>/, `${slug} SVG needs a title`);
    assert.match(svg, /<desc id="desc">[^<]+<\/desc>/, `${slug} SVG needs a description`);
    assert.doesNotMatch(svg, /\b\d{2,4}-Q\b|\b200\/200\b|Scribd|book-PYQ|Corpus Pressure|question corpus|promoted|Netcup|Docker|36-second|5-second|under timer/i, `${slug} SVG retains stale corpus, infrastructure, score, or timer language`);
  }
});

test("English usage safeguards remain explicit and context-sensitive", () => {
  const bySlug = new Map(lessons.map((lesson) => [lesson.slug, lesson.body]));

  assert.match(bySlug.get("grammar-error-spotting")!, /Singular \*they\* is standard/i);
  assert.match(bySlug.get("grammar-error-spotting")!, /style preference is not a grammatical error/i);
  assert.match(bySlug.get("vocabulary-cloze")!, /grammar[\s\S]{0,120}collocation[\s\S]{0,160}(?:logic|tone|reference)/i);
  assert.match(bySlug.get("reading-comprehension")!, /outside knowledge/i);
  assert.match(bySlug.get("reading-comprehension")!, /Extreme words[\s\S]{0,120}strong evidence/i);
  assert.match(bySlug.get("synonyms-antonyms")!, /rarely interchangeable in every sentence/i);
  assert.match(bySlug.get("synonyms-antonyms")!, /part of speech[\s\S]{0,160}connotation/i);
  assert.match(bySlug.get("idioms-phrases")!, /literal[\s\S]{0,120}figurative|figurative[\s\S]{0,120}literal/i);
  assert.match(bySlug.get("idioms-phrases")!, /accepted variants/i);
  assert.match(bySlug.get("sentence-improvement")!, /No improvement/i);
  assert.match(bySlug.get("sentence-improvement")!, /style preference is not|do not label the original ungrammatical/i);
  assert.match(bySlug.get("active-passive-direct-indirect")!, /intransitive[\s\S]{0,160}no object/i);
  assert.match(bySlug.get("active-passive-direct-indirect")!, /general truth[\s\S]{0,160}Do not backshift|Do not backshift[\s\S]{0,160}general truth/i);
  assert.match(bySlug.get("spelling-one-word")!, /British spelling/i);
  assert.match(bySlug.get("spelling-one-word")!, /i before e[\s\S]{0,120}exceptions/i);
  assert.match(bySlug.get("para-jumbles")!, /reference[\s\S]{0,160}connector|connector[\s\S]{0,160}reference/i);
  assert.match(bySlug.get("para-jumbles")!, /keyword chaining/i);
  assert.match(bySlug.get("fill-in-the-blanks")!, /part of speech/i);
  assert.match(bySlug.get("fill-in-the-blanks")!, /collocation/i);
  assert.match(bySlug.get("fill-in-the-blanks")!, /double-blank[\s\S]{0,160}both/i);
});

test("representative English answers and transformations remain correct", () => {
  const bySlug = new Map(lessons.map((lesson) => [lesson.slug, lesson.body]));

  assert.match(bySlug.get("grammar-error-spotting")!, /Each of the machines \*\*has\*\* been inspected/);
  assert.match(bySlug.get("grammar-error-spotting")!, /has been working[\s\S]{0,60}since 2021/i);

  assert.match(bySlug.get("vocabulary-cloze")!, /\*\*Reduce\*\*/i);
  assert.match(bySlug.get("vocabulary-cloze")!, /\*\*Absorb\*\*/i);
  assert.match(bySlug.get("vocabulary-cloze")!, /\*\*However\*\*/i);
  assert.match(bySlug.get("vocabulary-cloze")!, /\*\*Fail to deliver\*\*/i);

  assert.match(bySlug.get("reading-comprehension")!, /Historic public clocks have shifted[\s\S]{0,180}civic landmarks/i);
  assert.match(bySlug.get("reading-comprehension")!, /\*\*balanced and explanatory\*\*/i);

  assert.match(bySlug.get("synonyms-antonyms")!, /\*\*Permanent\*\*[\s\S]{0,80}Transient/i);
  assert.match(bySlug.get("synonyms-antonyms")!, /\*\*Persuasive\*\*[\s\S]{0,100}compelling/i);

  assert.match(bySlug.get("idioms-phrases")!, /break the ice[\s\S]{0,160}relaxed and willing to talk/i);
  assert.match(bySlug.get("idioms-phrases")!, /elephant in the room[\s\S]{0,180}obvious and important problem/i);

  assert.match(bySlug.get("sentence-improvement")!, /number of complaints \*\*have fallen\*\*[\s\S]{0,200}Use \*\*has fallen\*\*/i);
  assert.match(bySlug.get("sentence-improvement")!, /No improvement[\s\S]{0,160}hardly … when|hardly … when[\s\S]{0,160}No improvement/i);

  assert.match(bySlug.get("active-passive-direct-indirect")!, /results \*\*will be announced\*\*/i);
  assert.match(bySlug.get("active-passive-direct-indirect")!, /asked me \*\*why I had left early\*\*/i);

  assert.match(bySlug.get("spelling-one-word")!, /\*\*Accommodation\*\*[\s\S]{0,100}double \*c\*[\s\S]{0,40}double \*m\*/i);
  assert.match(bySlug.get("spelling-one-word")!, /\*\*Ornithologist\*\*/i);

  assert.match(bySlug.get("para-jumbles")!, /\*\*C–B–A–D\.?\*\*/);
  assert.match(bySlug.get("para-jumbles")!, /\*\*B–A–C\.?\*\*/);

  assert.match(bySlug.get("fill-in-the-blanks")!, /\*\*Benefit\*\*/i);
  assert.match(bySlug.get("fill-in-the-blanks")!, /\*\*A\*\*/i);
  assert.match(bySlug.get("fill-in-the-blanks")!, /\*\*Consequently\*\*/i);
  assert.match(bySlug.get("fill-in-the-blanks")!, /\*\*On\*\*[\s\S]{0,120}insist on/i);
});
