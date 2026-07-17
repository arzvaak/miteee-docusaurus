import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const sourcePath = path.join(process.cwd(), "lib", "ssc-cgl-source.ts");
const docsRoot = path.join(process.cwd(), "docs", "ssc-cgl", "ga");
const source = fs.readFileSync(sourcePath, "utf8");

const canonicalGeneralAwarenessSlugs = [
  ...new Set(
    [...source.matchAll(/\{\s*slug:\s*"([^"]+)"[\s\S]*?section:\s*"([^"]+)"/g)]
      .filter((match) => match[2] === "general-awareness")
      .map((match) => match[1])
  )
];

type Lesson = {
  slug: string;
  frontmatter: string;
  body: string;
};

const lessons: Lesson[] = canonicalGeneralAwarenessSlugs.map((slug) => {
  const notePath = path.join(docsRoot, `${slug}.md`);
  assert.ok(fs.existsSync(notePath), `missing canonical General Awareness lesson: ${slug}`);
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

test("General Awareness lesson inventory is derived from canonical topic seeds", () => {
  assert.deepEqual(canonicalGeneralAwarenessSlugs, [
    "current-affairs-static-gk",
    "indian-polity-basics",
    "history-freedom-movement",
    "geography-india-world",
    "economics-budget-banking",
    "science-everyday",
    "environment-ecology",
    "computer-awareness",
    "art-culture",
    "sports-awards"
  ]);
});

test("all canonical General Awareness lessons follow the reviewed chapter contract", () => {
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
    const tail = body.slice(-2_000);
    assert.ok(tail.includes(`](/exams/ssc-cgl/practice/${slug})`), `${slug} needs its canonical focused-practice closer`);

    for (const details of body.matchAll(/<details>/g)) {
      const index = details.index ?? 0;
      const prefix = body.slice(0, index);
      const nearestPrompt = Math.max(prefix.lastIndexOf("**Self-check"), prefix.lastIndexOf("### Question"));
      assert.ok(nearestPrompt >= 0 && index - nearestPrompt < 1_200, `${slug} has a detached answer reveal`);
    }

    assert.doesNotMatch(
      body,
      /Corpus Pressure|promoted questions?|Scribd|book-PYQ|source pipeline|200\/200|Final Practice Queue|PYQ Mapping|Full Type Tree|##\s+Trap Table|##\s+Flowchart|##\s+Solved Examples|##\s+200\/200 Drill|```mermaid/i,
      `${slug} retains generator or internal-pipeline content`
    );
    assert.doesNotMatch(body, /\*\*Example\s+\d+/i, `${slug} has a detached numbered-example dump`);
    assert.doesNotMatch(body, /Examination wise|\|\s*(?:CPO|CHSL)\b|_{5,}|[\uE000-\uF8FF]/i, `${slug} contains OCR-like debris`);

    const routeLines = body.split(/\r?\n/).filter((line) => line.includes("/exams/ssc-cgl"));
    for (const line of routeLines) {
      assert.match(line, /\[[^\]]+\]\(\/exams\/ssc-cgl\/[^)]+\)/, `${slug} contains a naked internal route`);
    }
  }
});

test("General Awareness tables stay compact and structurally valid", () => {
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

test("every General Awareness concept map is present, captioned, accessible, and timeless", () => {
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
    assert.doesNotMatch(svg, /\b\d{2,4}-Q\b|200\/200|Scribd|book-PYQ|Corpus Pressure|question corpus|promoted|Netcup|Docker/i, `${slug} SVG retains stale corpus, infrastructure, or score language`);
  }
});

test("volatile General Awareness facts are routed to dated verification", () => {
  const bySlug = new Map(lessons.map((lesson) => [lesson.slug, lesson.body]));
  const volatileSlugs = [
    "current-affairs-static-gk",
    "indian-polity-basics",
    "geography-india-world",
    "economics-budget-banking",
    "environment-ecology",
    "computer-awareness",
    "art-culture",
    "sports-awards"
  ];

  for (const slug of volatileSlugs) {
    assert.match(bySlug.get(slug)!, /\[.+\]\(\/exams\/ssc-cgl\/current-affairs\)/, `${slug} needs the live current-affairs route`);
  }

  assert.match(bySlug.get("current-affairs-static-gk")!, /as-of date|reference date/i);
  assert.match(bySlug.get("current-affairs-static-gk")!, /source owner|institutional ownership|official source/i);
  assert.match(bySlug.get("economics-budget-banking")!, /current rates|Budget figures|dated RBI release/i);
  assert.match(bySlug.get("environment-ecology")!, /current site counts|conference outcomes|current commitments/i);
  assert.match(bySlug.get("art-culture")!, /GI registrations|UNESCO additions|festival editions/i);
  assert.match(bySlug.get("sports-awards")!, /Latest winners|hosts|rankings|records/i);

  for (const { slug, body } of lessons) {
    assert.doesNotMatch(body, /current (?:President|Prime Minister|Chief Justice|RBI Governor|repo rate) is\b/i, `${slug} freezes a volatile officeholder or rate`);
    assert.doesNotMatch(body, /latest (?:winner|rank|host|awardee) is\b/i, `${slug} freezes a latest-result claim`);
  }
});

test("high-risk General Awareness facts remain explicitly correct", () => {
  const bySlug = new Map(lessons.map((lesson) => [lesson.slug, lesson.body]));

  assert.match(bySlug.get("indian-polity-basics")!, /adopted (?:the Constitution )?on \*\*26 November 1949\*\*[\s\S]{0,120}force on \*\*26 January 1950\*\*/);
  assert.match(bySlug.get("indian-polity-basics")!, /Article \*\*79\*\*[\s\S]{0,120}President and two Houses/);
  assert.match(bySlug.get("indian-polity-basics")!, /removed the right to property from Fundamental Rights[\s\S]{0,160}Article \*\*300A\*\*/i);

  assert.match(bySlug.get("history-freedom-movement")!, /1757, Battle of Plassey[\s\S]{0,160}1764, Battle of Buxar[\s\S]{0,160}1765, Diwani rights/);
  assert.match(bySlug.get("history-freedom-movement")!, /Government of India Act 1919[\s\S]{0,120}dyarchy in provinces/i);
  assert.match(bySlug.get("history-freedom-movement")!, /Lahore, 1929[\s\S]{0,160}Purna Swaraj/);

  assert.match(bySlug.get("geography-india-world")!, /8°4′ N to 37°6′ N[\s\S]{0,100}68°7′ E to 97°25′ E/);
  assert.match(bySlug.get("geography-india-world")!, /Narmada and Tapi[\s\S]{0,160}west-flowing/i);
  assert.match(bySlug.get("geography-india-world")!, /Antarctica is the largest desert overall/i);

  assert.match(bySlug.get("economics-budget-banking")!, /GNP\/GNI[\s\S]{0,120}GDP \+ net factor income from abroad/);
  assert.match(bySlug.get("economics-budget-banking")!, /Primary deficit[\s\S]{0,100}Fiscal deficit[\s\S]{0,100}Interest payments/i);
  assert.match(bySlug.get("economics-budget-banking")!, /disinflation means inflation.*slows/i);

  assert.match(bySlug.get("science-everyday")!, /pressure cooker raises pressure[\s\S]{0,100}raises water’s boiling temperature/i);
  assert.match(bySlug.get("science-everyday")!, /Sound is a mechanical wave and cannot travel through a vacuum/i);
  assert.match(bySlug.get("science-everyday")!, /Vitamin D[\s\S]{0,80}rickets/);

  assert.match(bySlug.get("environment-ecology")!, /“10% law” is an approximate teaching rule/i);
  assert.match(bySlug.get("environment-ecology")!, /Montreal Protocol[\s\S]{0,100}ozone-depleting substances/i);

  assert.match(bySlug.get("computer-awareness")!, /A byte contains \*\*8 bits\*\*/);
  assert.match(bySlug.get("computer-awareness")!, /browser retrieves and displays web content; a search engine indexes/i);
  assert.match(bySlug.get("computer-awareness")!, /SMTP[\s\S]{0,80}sends\/relays email/);

  assert.match(bySlug.get("art-culture")!, /Sattriya[\s\S]{0,100}Assam/);
  assert.match(bySlug.get("art-culture")!, /Qutb al-Din Aibak began it[\s\S]{0,100}Iltutmish/i);

  assert.match(bySlug.get("sports-awards")!, /does not assign each ring colour to one specific continent/i);
  assert.match(bySlug.get("sports-awards")!, /Wings of Fire[\s\S]{0,100}A\. P\. J\. Abdul Kalam with Arun Tiwari/);
  assert.match(bySlug.get("sports-awards")!, /Param Vir Chakra[\s\S]{0,100}highest wartime gallantry/i);
});
