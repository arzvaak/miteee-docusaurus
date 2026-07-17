import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { buildSscCglTopics } from "@/lib/ssc-cgl-source";

const root = process.cwd();
const folderBySection = {
  reasoning: "reasoning",
  "general-awareness": "ga",
  "quantitative-aptitude": "quant",
  "english-comprehension": "english",
} as const;
const topics = buildSscCglTopics([]);
const topicsBySlug = new Map(topics.map((topic) => [topic.slug, topic]));

function noteMarkdown(slug: string, folder: string) {
  const raw = fs.readFileSync(path.join(root, "docs", "ssc-cgl", folder, `${slug}.md`), "utf8");
  return raw.replace(/^---\s*[\s\S]*?\s*---\s*/, "").trim();
}

function occurrences(value: string, needle: string) {
  return value.split(needle).length - 1;
}

test("SSC topic source retains pre-H2 concept maps and orientation exactly once", () => {
  const samples = [
    { slug: "indian-polity-basics", folder: "ga" },
    { slug: "percentages", folder: "quant" },
    { slug: "grammar-error-spotting", folder: "english" },
  ];

  for (const { slug, folder } of samples) {
    const markdown = noteMarkdown(slug, folder);
    const firstHeadingIndex = markdown.search(/^##\s+/m);
    assert.ok(firstHeadingIndex > 0, `${slug} should exercise the pre-H2 parser path`);

    const preamble = markdown.slice(0, firstHeadingIndex).trim();
    const mapPath = `/img/ssc-cgl/${slug}-map.svg`;
    assert.match(preamble, new RegExp(mapPath.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));

    const topic = topicsBySlug.get(slug);
    assert.ok(topic, `${slug} should remain a canonical topic`);
    assert.ok(topic.study.sections[0]?.body.startsWith(`${preamble}\n\n`));

    const renderedBodies = topic.study.sections.map((section) => section.body).join("\n\n");
    assert.equal(occurrences(renderedBodies, preamble), 1, `${slug} preamble should render once`);
    assert.equal(occurrences(renderedBodies, mapPath), 1, `${slug} concept map should render once`);
  }
});

test("SSC topic source keeps one outline section per canonical H2 within the 6-8 section contract", () => {
  assert.equal(topics.length, 46);

  for (const topic of topics) {
    const markdown = noteMarkdown(topic.slug, folderBySection[topic.section]);
    const headingCount = (markdown.match(/^##\s+/gm) ?? []).length;
    assert.equal(topic.study.sections.length, headingCount, `${topic.slug} should not gain a preamble outline item`);
    assert.ok(
      topic.study.sections.length >= 6 && topic.study.sections.length <= 8,
      `${topic.slug} should keep 6-8 canonical sections`,
    );
  }

  const seriesCoding = topicsBySlug.get("series-coding");
  assert.ok(seriesCoding);
  const renderedBodies = seriesCoding.study.sections.map((section) => section.body).join("\n\n");
  assert.equal(occurrences(renderedBodies, "/img/ssc-cgl/series-coding-map.svg"), 1);
});
