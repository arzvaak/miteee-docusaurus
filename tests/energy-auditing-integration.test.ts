import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { getCourse, getCourseNotes, getNote, getNotesIndex } from "../lib/content";
import { buildContentData } from "../scripts/build-content-data";
import sourceFixture from "./fixtures/energy-auditing-sources.json";

const root = process.cwd();
const eaDocsRoot = path.join(root, "docs", "sem7", "ea");
const generatedNotesRoot = path.join(root, "data", "generated", "notes");
const sourceManifestPath = path.join(root, "data", "sources", "energy-auditing", "source-manifest.json");
const pyqManifestPath = path.join(root, "data", "sources", "energy-auditing", "pyq-manifest.json");

type SourceDeck = (typeof sourceFixture.decks)[number];

function collectMarkdownFiles(directory: string) {
  if (!fs.existsSync(directory)) return [] as string[];
  const files: string[] = [];
  const visit = (current: string) => {
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const fullPath = path.join(current, entry.name);
      if (entry.isDirectory()) visit(fullPath);
      else if (/\.(?:md|mdx)$/i.test(entry.name)) files.push(fullPath);
    }
  };
  visit(directory);
  return files.sort((a, b) => a.localeCompare(b));
}

function sourceText(filePath: string) {
  return `${path.basename(filePath)}\n${fs.readFileSync(filePath, "utf8")}`;
}

function classifyNote(filePath: string) {
  const basename = path.basename(filePath, path.extname(filePath));
  const text = sourceText(filePath);

  if (/overview|formula|revision|question[-_ ]?bank|topic[-_ ]?frequency|index/i.test(basename)) return "support" as const;
  if (/pyq/i.test(basename)) return "pyq" as const;
  if (/^(?:l(?:ecture)?[-_ ]?\d{1,2})\b/i.test(basename) || /\bL(?:ecture)?\s*0?\d{1,2}\b/i.test(text)) return "lecture" as const;
  if (/^(?:t(?:utorial)?[-_ ]?t?\d{1,2})\b/i.test(basename) || /\bT(?:utorial)?\s*0?\d{1,2}\b/i.test(text)) return "tutorial" as const;
  return "unknown" as const;
}

function sourceDeckKey(deck: SourceDeck) {
  return `${deck.code}:${deck.variant || "default"}`;
}

test("Energy Auditing source fixture contains all 35 decks and 851 slides", () => {
  assert.equal(sourceFixture.courseCode, "SEM7-EA");
  assert.equal(sourceFixture.expectedDeckCount, 35);
  assert.equal(sourceFixture.expectedSlideCount, 851);
  assert.equal(sourceFixture.expectedLectureCount, 23);
  assert.equal(sourceFixture.expectedTutorialCount, 12);
  assert.equal(sourceFixture.decks.length, sourceFixture.expectedDeckCount);
  assert.equal(new Set(sourceFixture.decks.map(sourceDeckKey)).size, sourceFixture.decks.length);
  assert.equal(sourceFixture.decks.filter((deck) => deck.kind === "lecture").length, sourceFixture.expectedLectureCount);
  assert.equal(sourceFixture.decks.filter((deck) => deck.kind === "tutorial").length, sourceFixture.expectedTutorialCount);
  assert.equal(sourceFixture.decks.reduce((total, deck) => total + deck.slides, 0), sourceFixture.expectedSlideCount);
  assert.equal(sourceFixture.decks.filter((deck) => deck.code === "T09").length, 2);
  assert.deepEqual(
    sourceFixture.decks.filter((deck) => deck.code === "T09").map((deck) => deck.variant).sort(),
    ["electric-motors-fans-pumps", "hvac"]
  );
});

test("Energy Auditing source pipeline manifest agrees with the committed deck fixture", () => {
  assert.ok(fs.existsSync(sourceManifestPath), "source-manifest.json is required for source provenance");
  const manifest = JSON.parse(fs.readFileSync(sourceManifestPath, "utf8")) as {
    course?: { studyOsId?: string };
    expectedCounts?: { decks?: number; lectures?: number; tutorials?: number; slides?: number };
    actualCounts?: { decks?: number; lectures?: number; tutorials?: number; slides?: number };
    ocrSummary?: { provider?: string; model?: string; successCount?: number; failureCount?: number; matchedSlides?: number };
    files?: Array<{
      id?: string;
      filename?: string;
      kind?: string;
      slideCount?: number;
      ocr?: { status?: string; pageCount?: number; confidenceFieldCount?: number; transport?: string };
    }>;
  };
  assert.equal(manifest.course?.studyOsId, "SEM7-EA");
  assert.deepEqual(manifest.expectedCounts, { decks: 35, lectures: 23, tutorials: 12, slides: 851 });
  assert.deepEqual(manifest.actualCounts, manifest.expectedCounts);
  assert.equal(manifest.files?.length, sourceFixture.decks.length);
  assert.deepEqual(manifest.ocrSummary, {
    provider: "mistral",
    model: "mistral-ocr-latest",
    successCount: 35,
    failureCount: 0,
    matchedSlides: 851,
    nativeOnlySlides: 0,
    ocrOnlyPages: 0,
  });
  assert.ok((manifest.files || []).every((file) => file.ocr?.status === "ok"));
  assert.ok((manifest.files || []).every((file) => file.ocr?.pageCount === file.slideCount));
  assert.ok((manifest.files || []).reduce((total, file) => total + (file.ocr?.confidenceFieldCount || 0), 0) > 0);
  assert.equal(
    manifest.files?.find((file) => file.id === "l23-accelerating-global-adoption-of-energy-efficient-products")?.ocr?.transport,
    "pdf_conversion"
  );

  const actualByFilename = new Map((manifest.files || []).map((file) => [file.filename, file]));
  for (const expected of sourceFixture.decks) {
    const actual = actualByFilename.get(expected.file);
    assert.ok(actual, `${expected.file} is missing from source-manifest.json`);
    assert.equal(actual?.kind, expected.kind);
    assert.equal(actual?.slideCount, expected.slides);
  }
});

test("Energy Auditing PYQ manifest admits exactly ten OCR-complete predecessor-code papers", () => {
  const manifest = JSON.parse(fs.readFileSync(pyqManifestPath, "utf8")) as {
    expectedPaperCount?: number;
    admittedPaperCount?: number;
    papers?: Array<{
      id?: string;
      year?: string;
      examType?: string;
      predecessorCode?: string;
      apiUrl?: string;
      sourceUrlUsed?: string;
      sha256?: string;
      pageCount?: number;
      ocr?: { provider?: string; model?: string; status?: string; pageCount?: number; confidenceFieldCount?: number };
      metadataWarnings?: string[];
    }>;
  };
  assert.equal(manifest.expectedPaperCount, 10);
  assert.equal(manifest.admittedPaperCount, 10);
  assert.equal(manifest.papers?.length, 10);
  assert.ok((manifest.papers || []).every((paper) => /^(?:ELE 423|ELE 4006)$/.test(paper.predecessorCode || "")));
  assert.ok((manifest.papers || []).every((paper) => paper.apiUrl && paper.sourceUrlUsed && /^[a-f0-9]{64}$/.test(paper.sha256 || "")));
  assert.ok((manifest.papers || []).every((paper) => paper.ocr?.provider === "mistral" && paper.ocr?.model === "mistral-ocr-latest"));
  assert.ok((manifest.papers || []).every((paper) => paper.ocr?.status === "complete" && paper.ocr?.pageCount === paper.pageCount));
  assert.ok((manifest.papers || []).every((paper) => (paper.ocr?.confidenceFieldCount || 0) > 0));
  const paper2021 = manifest.papers?.find((paper) => paper.year === "2021");
  assert.equal(paper2021?.predecessorCode, "ELE 4006");
  assert.ok((paper2021?.metadataWarnings || []).some((warning) => /(?:blank|missing).*branch|branch.*(?:blank|missing)/i.test(warning)));
});

test("Energy Auditing has exactly 49 learner notes with separate lecture, tutorial, PYQ, and support sets", () => {
  const files = collectMarkdownFiles(eaDocsRoot);
  assert.equal(files.length, 49, "docs/sem7/ea must contain exactly 49 learner notes");

  const byKind = files.reduce<Record<ReturnType<typeof classifyNote>, string[]>>((groups, filePath) => {
    const kind = classifyNote(filePath);
    (groups[kind] ||= []).push(filePath);
    return groups;
  }, {} as Record<ReturnType<typeof classifyNote>, string[]>);
  assert.equal(byKind.lecture?.length, 23, "one lecture note is required for each L01-L23 deck");
  assert.equal(byKind.tutorial?.length, 12, "one tutorial note is required for each tutorial deck");
  assert.equal(byKind.pyq?.length, 10, "one paper-specific PYQ note is required for each admitted paper");
  assert.equal(byKind.support?.length, 4, "overview, formula/revision, question bank, and PYQ index are required");
  assert.equal(byKind.unknown?.length || 0, 0, "every Energy Auditing note must have a recognized role");
});

test("Energy Auditing keeps the two T09 tutorials distinct", () => {
  const tutorialFiles = collectMarkdownFiles(eaDocsRoot).filter((filePath) => classifyNote(filePath) === "tutorial");
  const t09Files = tutorialFiles.filter((filePath) => /(?:^|[-_])t(?:utorial)?[-_ ]?09(?:[-_ ]|$)/i.test(path.basename(filePath)));
  assert.equal(t09Files.length, 2, "both T09 source decks must have a learner note");

  const t09Text = t09Files.map(sourceText).join("\n");
  assert.match(t09Text, /electric\s*motors|fans|pumps/i);
  assert.match(t09Text, /HVAC|heating|ventilation|air\s*conditioning/i);
  assert.notEqual(
    path.basename(t09Files[0]!, path.extname(t09Files[0]!)).toLowerCase(),
    path.basename(t09Files[1]!, path.extname(t09Files[1]!)).toLowerCase()
  );
});

test("Energy Auditing lecture and tutorial notes expose source-coverage structure", () => {
  const files = collectMarkdownFiles(eaDocsRoot);
  const lectureFiles = files.filter((filePath) => classifyNote(filePath) === "lecture");
  const tutorialFiles = files.filter((filePath) => classifyNote(filePath) === "tutorial");

  for (const filePath of lectureFiles) {
    const content = fs.readFileSync(filePath, "utf8");
    assert.match(content, /source|slide/i, `${path.basename(filePath)} needs source or slide coverage evidence`);
    assert.match(content, /formula|revision|trap|assessment|question/i, `${path.basename(filePath)} needs exam-oriented study structure`);
  }
  for (const filePath of tutorialFiles) {
    const content = fs.readFileSync(filePath, "utf8");
    assert.match(content, /Question 1/i, `${path.basename(filePath)} needs numbered source questions`);
    assert.match(content, /Source wording/i, `${path.basename(filePath)} needs preserved source wording`);
    assert.match(content, /Given|target/i, `${path.basename(filePath)} needs given/target fields`);
    assert.match(content, /Governing relation|Step-by-step solution/i, `${path.basename(filePath)} needs worked-solution structure`);
    assert.match(content, /Final answer/i, `${path.basename(filePath)} needs a final answer field`);
    assert.match(content, /Unit|sanity check/i, `${path.basename(filePath)} needs a unit or sanity check`);
    assert.match(content, /Common trap/i, `${path.basename(filePath)} needs common-error guidance`);
  }
});

test("every Energy Auditing lecture slide is represented in its note coverage map", () => {
  const lectureFiles = collectMarkdownFiles(eaDocsRoot).filter((filePath) => classifyNote(filePath) === "lecture");
  const expectedLectures = sourceFixture.decks.filter((deck) => deck.kind === "lecture");
  assert.equal(lectureFiles.length, expectedLectures.length);

  for (const deck of expectedLectures) {
    const sequence = Number(deck.code.slice(1));
    const filePath = lectureFiles.find((candidate) => new RegExp(`lecture[-_ ]?0?${sequence}(?:[-_ ]|$)`, "i").test(path.basename(candidate)));
    assert.ok(filePath, `${deck.code} needs its own lecture note`);
    const content = fs.readFileSync(filePath!, "utf8");
    const covered = new Set<number>();
    for (const match of content.matchAll(/\bslides?\s+(\d{1,3})(?:\s*[-–—]\s*(\d{1,3}))?/gi)) {
      const start = Number(match[1]);
      const end = Number(match[2] || match[1]);
      if (start < 1 || end < start || end > deck.slides) continue;
      for (let slide = start; slide <= end; slide += 1) covered.add(slide);
    }
    const missing = Array.from({ length: deck.slides }, (_, index) => index + 1).filter((slide) => !covered.has(slide));
    assert.deepEqual(missing, [], `${deck.code} is missing slide coverage for: ${missing.join(", ")}`);
  }
});

test("Energy Auditing is mapped to the generated catalog and every note has a runtime route asset", () => {
  buildContentData();

  const course = getCourse("SEM7-EA");
  assert.ok(course);
  assert.equal(course?.name, "Energy Auditing (ELE 4446)");
  assert.equal(course?.folder, "sem7/ea");
  assert.equal(course?.noteCount, 49);

  const notes = getCourseNotes("SEM7-EA");
  assert.equal(notes.length, 49);
  assert.equal(getNotesIndex().filter((note) => note.courseCode === "SEM7-EA").length, 49);
  for (const note of notes) {
    assert.equal(note.courseCode, "SEM7-EA");
    assert.ok(fs.existsSync(path.join(generatedNotesRoot, `${note.slug}.json`)), `${note.slug} needs a generated runtime payload`);
    assert.ok(getNote(note.slug), `${note.slug} needs to be readable through lib/content`);
  }
});

test("Energy Auditing combined question bank separates source questions from tutorial, PYQ, and generated variants", () => {
  buildContentData();

  const questionBank = getCourseNotes("SEM7-EA").find((note) => /question[-_ ]?bank/i.test(`${note.slug} ${note.title}`));
  assert.ok(questionBank, "the comprehensive Energy Auditing question bank is required");
  const detail = questionBank && getNote(questionBank.slug);
  const content = detail?.content || "";
  assert.match(content, /lecture|slide|source question/i);
  assert.match(content, /tutorial/i);
  assert.match(content, /historical|PYQ/i);
  assert.match(content, /PYQ[- ]based/i);
});

test("Energy Auditing PYQ notes retain predecessor-code and answer provenance labels", () => {
  buildContentData();

  const pyqNotes = getCourseNotes("SEM7-EA").filter((note) => /pyq/i.test(`${note.slug} ${note.title}`));
  assert.equal(pyqNotes.length, 10);
  for (const preview of pyqNotes) {
    const note = getNote(preview.slug);
    assert.ok(note);
    assert.match(note?.content || "", /ELE\s*(?:423|4006)/i, `${preview.slug} must identify its predecessor course code`);
    assert.match(note?.content || "", /official answer|worked solution/i, `${preview.slug} must label answer provenance`);
  }
});
