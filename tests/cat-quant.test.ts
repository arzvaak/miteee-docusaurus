import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { buildCatQuantQuestions, buildCatQuantTopics } from "@/lib/cat-quant-source";
import { catPracticeStorageKey, parseStoredCatPractice } from "@/lib/cat-practice-memory";
import { validateCatQuantData } from "@/lib/cat";

test("CAT Quant source normalizes book MCQs and chapter notes", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "cat-quant-source-"));
  const questionsPath = path.join(root, "data", "exams", "cat", "quant", "book-imports", "questions.json");
  const notesRoot = path.join(root, "docs", "cat", "quant");
  fs.mkdirSync(path.dirname(questionsPath), { recursive: true });
  fs.mkdirSync(notesRoot, { recursive: true });
  const imagePath = path.join(root, "public", "content-assets", "cat", "quant", "percentages", "page-301-figure-01.png");
  fs.mkdirSync(path.dirname(imagePath), { recursive: true });
  fs.writeFileSync(imagePath, "image fixture");
  fs.writeFileSync(questionsPath, JSON.stringify([{
    id: "quantum-cat-percentages-1",
    topic: "percentages",
    chapterNumber: 5,
    stem: "A value rises from 80 to 100. What is the percentage increase?",
    options: [{ id: "a", text: "20%" }, { id: "b", text: "25%" }, { id: "c", text: "40%" }, { id: "d", text: "80%" }],
    correctOption: "b",
    explanation: "Increase is 20 on a base of 80, so 20/80 x 100 = 25%.",
    provenance: { pageNumber: 300, chapterTitle: "Percentages" }
  }, {
    id: "quantum-cat-percentages-image-2",
    topic: "percentages",
    chapterNumber: 5,
    stem: "Use the source diagram to identify the requested percentage.",
    stimulus: {
      type: "image",
      src: "/content-assets/cat/quant/percentages/page-301-figure-01.png",
      alt: "A percentage comparison diagram with labelled base and changed values",
      caption: "Diagram reconstructed from the reviewed source page."
    },
    options: [{ id: "a", text: "10%" }, { id: "b", text: "20%" }, { id: "c", text: "25%" }, { id: "d", text: "50%" }],
    correctOption: "c",
    explanation: "Compare the labelled change with the original labelled base.",
    provenance: { pageNumber: 301, chapterTitle: "Percentages" }
  }, {
    id: "quantum-cat-unsafe-image",
    topic: "percentages",
    chapterNumber: 5,
    stem: "This row must not survive an unsafe image path.",
    stimulus: { type: "image", src: "file:///C:/book/page.png", alt: "Unsafe local path" },
    options: [{ id: "a", text: "1" }, { id: "b", text: "2" }, { id: "c", text: "3" }, { id: "d", text: "4" }],
    correctOption: "a",
    explanation: "This fixture should be rejected before runtime generation.",
    provenance: { pageNumber: 302, chapterTitle: "Percentages" }
  }], null, 2));
  fs.writeFileSync(path.join(notesRoot, "05-percentages.md"), "---\ntitle: Percentages\ndescription: CAT percentage methods and traps.\n---\n\n# Percentages\n\n## Core method\n\nUse the original base.\n\n![Percentage comparison](assets/percentages/page-301-figure-01.png)\n");
  const previous = process.env.CAT_QUANT_BOOK_QUESTIONS_PATH;
  process.env.CAT_QUANT_BOOK_QUESTIONS_PATH = questionsPath;
  try {
    const questions = buildCatQuantQuestions(root);
    const topics = buildCatQuantTopics(questions, root);
    assert.equal(questions.length, 2);
    assert.equal(questions[0]?.exam, "CAT");
    assert.equal(questions[0]?.correctOption, "b");
    assert.equal(questions[0]?.provenance.pageNumber, 300);
    assert.deepEqual(questions[1]?.stimulus, {
      type: "image",
      src: "/content-assets/cat/quant/percentages/page-301-figure-01.png",
      alt: "A percentage comparison diagram with labelled base and changed values",
      caption: "Diagram reconstructed from the reviewed source page."
    });
    assert.equal(topics.length, 1);
    assert.equal(topics[0]?.slug, "percentages");
    assert.match(topics[0]?.noteBody ?? "", /Core method/);
    assert.match(topics[0]?.noteBody ?? "", /!\[Percentage comparison\]\(\/content-assets\/cat\/quant\/assets\/percentages\/page-301-figure-01\.png\)/);
    assert.equal(topics[0]?.questionCount, 2);
    const data = { generatedAt: "fixture", exam: { code: "CAT" as const, activeSection: "quantitative-aptitude" as const, sourceTitle: "Fixture" }, questions, topics };
    assert.deepEqual(validateCatQuantData(data, root).errors, []);
  } finally {
    if (previous === undefined) delete process.env.CAT_QUANT_BOOK_QUESTIONS_PATH;
    else process.env.CAT_QUANT_BOOK_QUESTIONS_PATH = previous;
  }
});

test("CAT topic practice memory rejects malformed rows and keeps answers", () => {
  assert.equal(catPracticeStorageKey("percentages"), "cat-quant-topic-practice:percentages");
  assert.equal(parseStoredCatPractice("not-json"), null);
  assert.deepEqual(parseStoredCatPractice(JSON.stringify({ index: 2, answers: { q1: "b", q2: "12.5" }, savedAt: "2026-08-14T00:00:00.000Z" })), {
    index: 2,
    answers: { q1: "b", q2: "12.5" },
    savedAt: "2026-08-14T00:00:00.000Z"
  });
});

test("CAT web hierarchy exposes exam, Quant study, and topic practice routes", () => {
  const root = process.cwd();
  const exams = fs.readFileSync(path.join(root, "app", "exams", "page.tsx"), "utf8");
  const topic = fs.readFileSync(path.join(root, "app", "exams", "cat", "quant", "topics", "[slug]", "page.tsx"), "utf8");
  const practice = fs.readFileSync(path.join(root, "app", "exams", "cat", "quant", "practice", "[slug]", "page.tsx"), "utf8");
  const client = fs.readFileSync(path.join(root, "components", "CatTopicPracticeClient.tsx"), "utf8");
  const stimulus = fs.readFileSync(path.join(root, "components", "CatQuestionStimulus.tsx"), "utf8");
  assert.match(exams, /href="\/exams\/cat"/);
  assert.match(topic, /generateStaticParams/);
  assert.match(topic, /CatTopicStudyPage/);
  assert.match(practice, /CatTopicPracticeClient/);
  assert.match(client, /catPracticeStorageKey/);
  assert.match(client, /CatQuestionStimulus/);
  assert.match(client, /MathText/);
  assert.match(stimulus, /next\/image/);
  assert.match(stimulus, /alt=\{stimulus\.alt\}/);
  assert.match(stimulus, /stimulus\.caption/);
  assert.doesNotMatch(stimulus, /dangerouslySetInnerHTML|<img\b/);
});
