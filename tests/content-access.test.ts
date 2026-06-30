import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { getAllCourses, getCourse, getCourseNavigationGroups, getCourseNotes, getNote, getNoteNavigation, getNotesIndex, getPreviewCandidates, getSearchCandidates, toNotePreview } from "../lib/content";
import { buildContentData } from "../scripts/build-content-data";

test("content helpers read generated MITEEE catalog and notes", () => {
  buildContentData();

  const courses = getAllCourses();
  assert.ok(courses.length >= 3);
  assert.ok(getCourse("SEM6-MI"));

  const notes = getCourseNotes("SEM6-MI");
  assert.ok(notes.length >= 1);
  assert.equal(notes[0]?.courseCode, "SEM6-MI");

  const note = getNote(notes[0]!.slug);
  assert.ok(note);
  assert.equal(note?.slug, notes[0]?.slug);

  const preview = toNotePreview(notes[0]!);
  assert.equal(preview.slug, notes[0]?.slug);
  assert.ok(getPreviewCandidates(4).length <= 4);

  assert.ok(fs.existsSync(path.join(process.cwd(), "data", "generated", "catalog.json")));
});

test("search candidates cover the full note index with heading text", () => {
  buildContentData();

  const indexed = getNotesIndex();
  const searchable = getSearchCandidates();
  const withHeadings = searchable.find((note) => note.headings.length > 0);

  assert.equal(searchable.length, indexed.length);
  assert.ok(withHeadings);
  assert.ok(withHeadings.headings.every((heading) => typeof heading === "string"));
});

test("note navigation exposes previous, next, and grouped course map", () => {
  buildContentData();

  const notes = getCourseNotes("SEM5-EM2");
  assert.ok(notes.length >= 3);

  const middleNote = notes[1]!;
  const navigation = getNoteNavigation(middleNote);

  assert.equal(navigation.previous?.slug, notes[0]?.slug);
  assert.equal(navigation.next?.slug, notes[2]?.slug);
  assert.equal(navigation.position, 2);
  assert.equal(navigation.total, notes.length);
  assert.ok(navigation.groups.length >= 1);
  assert.equal(navigation.groups.some((group) => group.notes.some((note) => note.slug === middleNote.slug && note.current)), true);
});

test("note previous and next links follow the visible course map order", () => {
  buildContentData();

  for (const course of getAllCourses()) {
    for (const note of getCourseNotes(course.code)) {
      const navigation = getNoteNavigation(note);
      const mapOrder = navigation.groups.flatMap((group) => group.notes.map((item) => item.slug));
      const currentIndex = mapOrder.indexOf(note.slug);
      const expectedPrevious = currentIndex > 0 ? mapOrder[currentIndex - 1] : null;
      const expectedNext = currentIndex >= 0 && currentIndex < mapOrder.length - 1 ? mapOrder[currentIndex + 1] : null;

      assert.notEqual(currentIndex, -1, `${note.slug} should appear in its visible course map`);
      assert.equal(navigation.previous?.slug ?? null, expectedPrevious, `${note.slug} previous should match visible course map`);
      assert.equal(navigation.next?.slug ?? null, expectedNext, `${note.slug} next should match visible course map`);
    }
  }
});

test("course navigation group labels are unique enough to scan", () => {
  buildContentData();

  for (const course of getAllCourses()) {
    const labels = getCourseNavigationGroups(course.code).map((group) => group.label);
    assert.equal(new Set(labels).size, labels.length, `${course.code} should not repeat vague course-map section labels`);
  }
});

test("UPSC Political Science navigation follows book and chapter order", () => {
  buildContentData();

  const notes = getCourseNotes("UPSC-CSE-POLITICAL-SCIENCE");
  const slugs = notes.map((note) => note.slug);

  assert.equal(slugs[0], "upsc-cse-political-science-overview");
  assert.equal(slugs[1], "upsc-cse-political-science-class-9-democratic-politics-i-index");
  assert.equal(slugs[2], "upsc-cse-political-science-class-9-democratic-politics-i-01-what-is-democracy-why-democracy");

  const class9Index = getNote("upsc-cse-political-science-class-9-democratic-politics-i-index");
  assert.ok(class9Index);

  const class9IndexNavigation = getNoteNavigation(class9Index);
  assert.equal(class9IndexNavigation.previous?.slug, "upsc-cse-political-science-overview");
  assert.equal(class9IndexNavigation.next?.slug, "upsc-cse-political-science-class-9-democratic-politics-i-01-what-is-democracy-why-democracy");
  assert.ok(class9IndexNavigation.groups.some((group) => group.label === "Class 9 · Democratic Politics I" && group.notes.some((note) => note.slug === class9Index.slug)));
  assert.ok(class9IndexNavigation.groups.some((group) => group.label === "Class 10 · Democratic Politics II"));

  const class9LastChapter = getNote("upsc-cse-political-science-class-9-democratic-politics-i-05-democratic-rights");
  assert.ok(class9LastChapter);

  const class9LastNavigation = getNoteNavigation(class9LastChapter);
  assert.equal(class9LastNavigation.next?.slug, "upsc-cse-political-science-class-10-democratic-politics-ii-index");
});

test("course navigation groups expose quick table of contents sections", () => {
  buildContentData();

  const upscGroups = getCourseNavigationGroups("UPSC-CSE-POLITICAL-SCIENCE");
  const class9Group = upscGroups.find((group) => group.label === "Class 9 · Democratic Politics I");
  const class10Group = upscGroups.find((group) => group.label === "Class 10 · Democratic Politics II");

  assert.ok(class9Group);
  assert.ok(class10Group);
  assert.equal(class9Group.notes[0]?.slug, "upsc-cse-political-science-class-9-democratic-politics-i-index");
  assert.equal(class9Group.notes[1]?.slug, "upsc-cse-political-science-class-9-democratic-politics-i-01-what-is-democracy-why-democracy");

  const em2Groups = getCourseNavigationGroups("SEM5-EM2");
  assert.ok(em2Groups.some((group) => group.label === "Week 1" && group.notes.some((note) => note.slug === "sem5-em2-week-01-transformers-coupled-circuits-index")));
  assert.ok(em2Groups.some((group) => group.label.startsWith("Reference") && group.notes.some((note) => note.slug === "sem5-em2-overview")));
});

test("SSC CGL course navigation is organized as four Tier-I subject levels", () => {
  buildContentData();

  const ssc = getCourse("SSC-CGL");
  const notes = getCourseNotes("SSC-CGL");
  const groups = getCourseNavigationGroups("SSC-CGL");

  assert.ok(ssc);
  assert.equal(ssc.folder, "ssc-cgl");
  assert.equal(ssc.level, "SSC CGL Tier-I");
  assert.equal(ssc.category, "Competitive exams");
  assert.deepEqual(groups.map((group) => group.label), [
    "General Intelligence and Reasoning",
    "General Awareness",
    "Quantitative Aptitude",
    "English Comprehension"
  ]);
  assert.equal(notes.length, groups.reduce((total, group) => total + group.notes.length, 0));
  assert.ok(notes.length >= 46);
  assert.ok(groups.every((group) => group.notes.length > 0));
  assert.equal(groups.some((group) => /pipeline|source|corpus|audit/i.test(group.notes.map((note) => note.label).join(" "))), false);
});

test("SSC CGL learner notes do not expose internal current-affairs infrastructure", () => {
  buildContentData();

  const leakedNotes = getCourseNotes("SSC-CGL")
    .map((note) => {
      const detail = getNote(note.slug);
      return {
        slug: note.slug,
        content: [note.title, note.description, detail?.content ?? ""].join("\n")
      };
    })
    .filter((note) => /pipeline|\bNetcup\b|\bDocker\b|\bcron\b|state\.json|raw_body|raw JSON|daily_news_pipeline|scripts[\\/]|metadata\/excerpts/i.test(note.content));

  assert.deepEqual(leakedNotes.map((note) => note.slug), []);
});

test("course navigation keeps study lessons before support files", () => {
  buildContentData();

  const dspSlugs = getCourseNotes("SEM5-DSP").map((note) => note.slug);
  assert.deepEqual(dspSlugs.slice(0, 3), [
    "sem5-dsp-overview",
    "sem5-dsp-00-master-summary",
    "sem5-dsp-01-sampling"
  ]);
  assert.ok(dspSlugs.indexOf("sem5-dsp-04-dft") < dspSlugs.indexOf("sem5-dsp-06-fir"));

  const miSlugs = getCourseNotes("SEM6-MI").map((note) => note.slug);
  assert.equal(miSlugs.includes("sem6-mi-diagram-sources-kicad-readme"), false);
  assert.equal(miSlugs.includes("sem6-mi-diagram-sources-schemdraw-readme"), false);
  assert.deepEqual(miSlugs.slice(0, 3), [
    "sem6-mi-question-bank",
    "sem6-mi-tutorial-1",
    "sem6-mi-tutorial-2"
  ]);
  const miGroups = getCourseNavigationGroups("SEM6-MI");
  const miTutorialGroup = miGroups.find((group) => group.label === "Tutorials");
  assert.ok(miTutorialGroup?.notes.some((note) => note.slug === "sem6-mi-tutorial-1"));
  assert.equal(miGroups.some((group) => group.label === "Other"), false);

  const em2Slugs = getCourseNotes("SEM5-EM2").map((note) => note.slug);
  assert.deepEqual(em2Slugs.slice(0, 3), [
    "sem5-em2-overview",
    "sem5-em2-week-01-transformers-coupled-circuits-index",
    "sem5-em2-week-01-transformers-coupled-circuits-questions"
  ]);

  const spmSlugs = getCourseNotes("SEM6-SPM").map((note) => note.slug);
  assert.equal(spmSlugs[0], "sem6-spm-overview");
  assert.ok(spmSlugs.indexOf("sem6-spm-overview") < spmSlugs.indexOf("sem6-spm-minggu-01-akar-modernitas"));

  const dspGroups = getCourseNavigationGroups("SEM5-DSP");
  const dspReferenceGroup = dspGroups.find((group) => group.label === "Reference");
  const dspOtherGroup = dspGroups.find((group) => group.label === "Other");
  const dspWeek4Group = dspGroups.find((group) => group.label === "Week 4");
  const dspWeek6Group = dspGroups.find((group) => group.label === "Week 6");
  const dspWeek11Group = dspGroups.find((group) => group.label === "Week 11");

  assert.ok(dspReferenceGroup);
  assert.ok(dspReferenceGroup.notes.some((note) => note.slug === "sem5-dsp-00-master-summary"));
  assert.equal(dspOtherGroup, undefined);
  assert.equal(dspReferenceGroup.notes.some((note) => note.slug === "sem5-dsp-04-dft"), false);
  assert.ok(dspWeek4Group?.notes.some((note) => note.slug === "sem5-dsp-04-dft"));
  assert.ok(dspWeek6Group?.notes.some((note) => note.slug === "sem5-dsp-05-fft"));
  assert.ok(dspWeek11Group?.notes.some((note) => note.slug === "sem5-dsp-09-multirate"));

  for (const course of getAllCourses()) {
    assert.equal(getCourseNavigationGroups(course.code).some((group) => group.label === "Other"), false, `${course.code} should not expose vague Other navigation groups`);
  }
});
