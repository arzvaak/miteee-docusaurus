import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const indexPath = path.join(process.cwd(), "data/exams/ssc-cgl/quant-book/index.json");
const book = JSON.parse(fs.readFileSync(indexPath, "utf8")) as {
  counts: { chapters: number; examples: number; exercises: number };
  chapters: Array<{
    chapterNumber: number;
    answerKeyPage: number;
    content: string;
    examples: Array<{ id: string; prompt?: string; solution?: string; text?: string; provenance: { pdfPages: number[] } }>;
    exercises: Array<{
      number: number;
      stem: string;
      options: Array<{ id: string; text: string }>;
      correctOption: string;
      rawText: string;
      provenance: { pdfPages: number[] };
    }>;
  }>;
};

test("SSC Quant book data has the complete 20-chapter inventory", () => {
  assert.deepEqual(book.counts, { chapters: 20, examples: 519, exercises: 665 });
  assert.equal(book.chapters.length, 20);
  assert.deepEqual(
    book.chapters.map((chapter) => chapter.exercises.length),
    [55, 30, 45, 40, 45, 25, 25, 20, 55, 30, 30, 25, 20, 45, 20, 25, 35, 25, 20, 50],
  );
  assert.equal(new Set(book.chapters.map((chapter) => chapter.answerKeyPage)).size, 20);
});

test("every example and exercise retains source-page provenance and a keyed answer", () => {
  const exampleIds = new Set<string>();
  for (const chapter of book.chapters) {
    for (const example of chapter.examples) {
      assert.ok(example.id && !exampleIds.has(example.id));
      assert.ok(example.provenance.pdfPages.length > 0);
      assert.ok((example.prompt ?? example.text ?? "").trim().length > 0);
      exampleIds.add(example.id);
    }
    for (const exercise of chapter.exercises) {
      assert.match(exercise.correctOption, /^[a-d]$/);
      assert.ok(exercise.stem.trim().length > 0);
      assert.deepEqual(exercise.options.map((option) => option.id), ["a", "b", "c", "d"]);
      assert.ok(exercise.options.every((option) => option.text.trim().length > 0));
      assert.ok(exercise.rawText.length > 0);
      assert.ok(exercise.provenance.pdfPages.length > 0);
    }
  }
  assert.equal(exampleIds.size, 519);
});

test("worked examples stay isolated from adjacent source blocks", () => {
  for (const chapter of book.chapters) {
    assert.doesNotMatch(chapter.content, /\bSolution\s*:/i, `chapter ${chapter.chapterNumber} prose contains a worked solution`);
    for (const example of chapter.examples) {
      const prompt = example.prompt ?? example.text ?? "";
      assert.doesNotMatch(prompt, /Worked calculation shown in the source/i, `${example.id} uses a placeholder prompt`);
      assert.doesNotMatch(example.solution ?? "", /\b(?:For Example|Example|Concept)\s*:/i, `${example.id} merges a following source block`);
    }
  }
});
