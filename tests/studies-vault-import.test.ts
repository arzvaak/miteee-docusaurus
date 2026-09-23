import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { buildContentData } from "@/scripts/build-content-data";

const subjectCounts = new Map([
  ["cra-4411-data-science-part-ii", 22],
  ["cra-4412-advanced-data-science-part-iii", 22],
  ["energy-auditing", 13],
  ["introduction-to-data-science", 15],
  ["introduction-to-quantum-computing", 19],
  ["power-system-analysis", 15],
  ["power-system-protection-and-switchgear", 73],
  ["renewable-energy", 24]
]);

test("all eight Studies subjects publish their notes, links, assets, and Typst equations", () => {
  const { notes } = buildContentData();
  const studiesNotes = notes.filter((note) => note.relativePath.startsWith("studies/"));
  const slugs = new Set(notes.map((note) => note.slug));
  assert.equal(studiesNotes.length, 203);
  assert.equal(new Set(studiesNotes.map((note) => note.slug)).size, 203);

  for (const [subject, expected] of subjectCounts) {
    assert.equal(studiesNotes.filter((note) => note.relativePath.startsWith(`studies/${subject}/`)).length, expected, subject);
  }

  let mathImages = 0;
  for (const note of studiesNotes) {
    for (const match of note.content.matchAll(/(?:src="|\]\()(\/notes\/[^)"\s]+|\/content-assets\/[^)"\s]+)/g)) {
      const target = decodeURIComponent(match[1].split(/[?#]/)[0]);
      if (target.startsWith("/notes/")) {
        assert.ok(slugs.has(target.slice("/notes/".length)), `${note.slug} has broken note link ${target}`);
      } else {
        assert.ok(fs.existsSync(path.join(process.cwd(), "public", target.slice(1))), `${note.slug} has missing asset ${target}`);
      }
      if (target.startsWith("/content-assets/typst-math/")) mathImages += 1;
    }
  }
  assert.ok(mathImages > 1_000, "Typst equations should be rendered into SVG assets");

  const latexNote = notes.find((note) => note.relativePath === "sem7/qc/overview.md");
  assert.ok(latexNote?.content.includes("$$"), "existing LaTeX notes should retain KaTeX math");
});
