import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const sourcePath = path.join(process.cwd(), "lib", "ssc-cgl-source.ts");
const docsRoot = path.join(process.cwd(), "docs", "ssc-cgl", "quant");
const source = fs.readFileSync(sourcePath, "utf8");

const canonicalQuantitativeAptitudeSlugs = [
  ...new Set(
    [...source.matchAll(/\{\s*slug:\s*"([^"]+)"[\s\S]*?section:\s*"([^"]+)"/g)]
      .filter((match) => match[2] === "quantitative-aptitude")
      .map((match) => match[1])
  )
];

type Lesson = {
  slug: string;
  frontmatter: string;
  body: string;
};

const lessons: Lesson[] = canonicalQuantitativeAptitudeSlugs.map((slug) => {
  const notePath = path.join(docsRoot, `${slug}.md`);
  assert.ok(fs.existsSync(notePath), `missing canonical Quantitative Aptitude lesson: ${slug}`);
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

function closeTo(actual: number, expected: number, message: string) {
  assert.ok(Math.abs(actual - expected) < 1e-10, `${message}: expected ${expected}, received ${actual}`);
}

function gcd(left: number, right: number) {
  let a = Math.abs(left);
  let b = Math.abs(right);
  while (b !== 0) [a, b] = [b, a % b];
  return a;
}

test("Quantitative Aptitude lesson inventory is derived from canonical topic seeds", () => {
  assert.deepEqual(canonicalQuantitativeAptitudeSlugs, [
    "percentages",
    "ratio-proportion",
    "number-system",
    "hcf-and-lcm",
    "simplification",
    "profit-loss-discount",
    "simple-compound-interest",
    "time-work-pipes",
    "time-speed-distance",
    "geometry-mensuration",
    "data-interpretation",
    "probability",
    "calculation-speed",
    "averages-mixtures-alligation",
    "algebra",
    "trigonometry"
  ]);
});

test("all canonical Quantitative Aptitude lessons follow the reviewed chapter contract", () => {
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

    const mixedIndex = body.search(/^##\s+.*Mixed/im);
    assert.ok(mixedIndex > body.length * 0.5, `${slug} mixed practice should sit near the end`);
    assert.ok(body.slice(-2_000).includes(`](/exams/ssc-cgl/practice/${slug})`), `${slug} needs its canonical focused-practice closer`);
    assert.match(body.slice(0, 1_200), /Direct[\s\S]*mark[- ]and[- ]return|mark[- ]and[- ]return[\s\S]*Direct/i, `${slug} must distinguish direct work from mark-and-return work`);

    for (const details of body.matchAll(/<details>/g)) {
      const index = details.index ?? 0;
      const prefix = body.slice(0, index);
      const nearestPrompt = Math.max(prefix.lastIndexOf("**Self-check"), prefix.lastIndexOf("### Question"));
      assert.ok(nearestPrompt >= 0 && index - nearestPrompt < 1_200, `${slug} has a detached answer reveal`);
    }

    assert.doesNotMatch(
      body,
      /Corpus Pressure|promoted questions?|Scribd|book-PYQ|source pipeline|\b200\/200\b|Final Practice Queue|PYQ Mapping|Full Type Tree|First 5-Second|##\s+Trap Table|##\s+Flowchart|##\s+Solved Examples|```mermaid/i,
      `${slug} retains generator or internal-pipeline content`
    );
    assert.doesNotMatch(body, /\*\*Example\s+\d+/i, `${slug} has a detached numbered-example dump`);
    assert.doesNotMatch(body, /Examination wise|\|\s*(?:CPO|CHSL)\b|_{5,}|[\uE000-\uF8FF]/i, `${slug} contains OCR-like debris`);
    assert.doesNotMatch(body, /(?:solve|finish|answer|attempt).{0,35}\b(?:5|10|20|25|30|36|45)-second\b/i, `${slug} imposes a fake exact item timer`);

    const routeLines = body.split(/\r?\n/).filter((line) => line.includes("/exams/ssc-cgl"));
    for (const line of routeLines) {
      assert.match(line, /\[[^\]]+\]\(\/exams\/ssc-cgl\/[^)]+\)/, `${slug} contains a naked internal route`);
    }
  }
});

test("Quantitative Aptitude tables stay compact and structurally valid", () => {
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

test("every Quantitative Aptitude concept map is present, captioned, accessible, and timeless", () => {
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
    assert.doesNotMatch(svg, /\b\d{2,4}-Q\b|\b200\/200\b|\b50\/50\b|Scribd|book-PYQ|Corpus Pressure|question corpus|promoted|Netcup|Docker/i, `${slug} SVG retains stale corpus, infrastructure, or score language`);
  }
});

test("high-risk Quantitative Aptitude formulas retain their conditions and units", () => {
  const bySlug = new Map(lessons.map((lesson) => [lesson.slug, lesson.body]));

  assert.match(bySlug.get("percentages")!, /original base|reference base/i);
  assert.match(bySlug.get("percentages")!, /percentage points/i);
  assert.match(bySlug.get("ratio-proportion")!, /same unit|convert.*units/i);
  assert.match(bySlug.get("hcf-and-lcm")!, /two positive integers/i);
  assert.match(bySlug.get("simplification")!, /multiplication and division[\s\S]{0,80}left to right/i);
  assert.match(bySlug.get("profit-loss-discount")!, /profit percentage[\s\S]{0,120}cost price/i);
  assert.match(bySlug.get("simple-compound-interest")!, /compounded.*(?:half-yearly|quarterly)|nominal annual rate/i);
  assert.match(bySlug.get("time-work-pipes")!, /leak[\s\S]{0,160}negative|negative[\s\S]{0,160}leak/i);
  assert.match(bySlug.get("time-speed-distance")!, /average speed[\s\S]{0,160}total distance[\s\S]{0,100}total time/i);
  assert.match(bySlug.get("geometry-mensuration")!, /square units|cubic units/i);
  assert.match(bySlug.get("data-interpretation")!, /unit|scale|legend/i);
  assert.match(bySlug.get("probability")!, /equally likely/i);
  assert.match(bySlug.get("calculation-speed")!, /Never cancel across a sum/i);
  assert.match(bySlug.get("averages-mixtures-alligation")!, /target.*between.*component/i);
  assert.match(bySlug.get("algebra")!, /multiplying or dividing an inequality by a negative number reverses/i);
  assert.match(bySlug.get("trigonometry")!, /tan90\^\\circ\$ is undefined|tan90\^\\circ.*undefined/i);
});

test("representative worked answers recompute correctly", () => {
  const bySlug = new Map(lessons.map((lesson) => [lesson.slug, lesson.body]));

  closeTo(54 / 6, 9, "percentage fraction conversion");
  assert.match(bySlug.get("percentages")!, /54\/6=9/);

  closeTo(840 * 3 / 7, 360, "ratio first share");
  closeTo(840 * 4 / 7, 480, "ratio second share");
  assert.match(bySlug.get("ratio-proportion")!, /₹360 and ₹480/);

  closeTo(27 / 99, 3 / 11, "repeating-decimal conversion");
  assert.match(bySlug.get("number-system")!, /27\/99=3\/11/);

  assert.equal(gcd(168, 252), 84, "HCF tile side");
  assert.match(bySlug.get("hcf-and-lcm")!, /gcd\(168,252\)=84/);

  assert.equal(48 / 6 * 2, 16, "equal-precedence simplification");
  assert.match(bySlug.get("simplification")!, /48\\div6\\times2=8\\times2=16/);

  closeTo((920 - 800) / 800 * 100, 15, "profit percentage");
  assert.match(bySlug.get("profit-loss-discount")!, /profit percentage is .*15\\%/i);

  closeTo(8_000 * 0.075 * 2, 1_200, "simple interest");
  assert.match(bySlug.get("simple-compound-interest")!, /₹1,200/);

  closeTo(1 / (1 / 12 + 1 / 18), 7.2, "combined work time");
  assert.match(bySlug.get("time-work-pipes")!, /36\/5=7\.2/);

  closeTo(72 * 5 / 18 * 15, 300, "speed conversion and distance");
  assert.match(bySlug.get("time-speed-distance")!, /20\\times15=300/);

  assert.equal(360 / 24, 15, "regular polygon side count");
  assert.match(bySlug.get("geometry-mensuration")!, /360\/24=15/);

  closeTo(150 / 500 * 100, 30, "DI share");
  assert.match(bySlug.get("data-interpretation")!, /150\/500\\times100=30\\%/);

  closeTo(3 / 6, 0.5, "fair-die prime probability");
  assert.match(bySlug.get("probability")!, /3\/6=1\/2/);

  assert.equal(368 / 8, 46, "fraction-recall calculation");
  assert.match(bySlug.get("calculation-speed")!, /368\/8=46/);

  assert.equal(8 * 27, 216, "average-to-total conversion");
  assert.match(bySlug.get("averages-mixtures-alligation")!, /8\\times27=216/);

  assert.equal(103 ** 2 - 97 ** 2, 1_200, "difference of squares");
  assert.match(bySlug.get("algebra")!, /6\\times200=1200/);

  closeTo(3 / 5, 0.6, "sine in a 3-4-5 triangle");
  closeTo(4 / 5, 0.8, "cosine in a 3-4-5 triangle");
  assert.match(bySlug.get("trigonometry")!, /sin\\theta=3\/5[\s\S]{0,80}cos\\theta=4\/5/);
});
