import assert from "node:assert/strict";
import test from "node:test";
import { buildUpscActiveRecallDrills, buildUpscDrillStudyTask } from "../lib/upsc-active-recall";
import type { NoteIndexItem } from "../scripts/build-content-data";

type IndexedNote = Omit<NoteIndexItem, "content">;

function note(overrides: Partial<IndexedNote>): IndexedNote {
  return {
    slug: "upsc-power-sharing",
    title: "Power Sharing",
    sidebarLabel: "Power Sharing",
    sidebarPosition: 1,
    description: "",
    tags: [],
    runnable: false,
    courseCode: "UPSC-CSE-POLITICAL-SCIENCE",
    courseFolder: "upsc-cse/political-science",
    courseName: "UPSC Political Science NCERT",
    level: "UPSC CSE",
    week: null,
    relativePath: "upsc-cse/political-science/power-sharing.md",
    sourcePath: "docs/upsc-cse/political-science/power-sharing.md",
    excerpt: "Belgium accommodated ethnic differences while Sri Lanka followed majoritarian policies.",
    headings: [
      { level: 2, text: "Master Summary" },
      { level: 2, text: "Key Concepts" },
      { level: 2, text: "UPSC Relevance" },
      { level: 3, text: "Belgium and Sri Lanka: Divergent Paths" },
      { level: 3, text: "Forms of Power Sharing" }
    ],
    stats: {
      codeBlocks: 0,
      mermaidBlocks: 0,
      mathBlocks: 0,
      details: 0,
      questionBlocks: 0
    },
    ...overrides
  };
}

test("buildUpscActiveRecallDrills creates prelims and mains prompts from indexed UPSC notes", () => {
  const drills = buildUpscActiveRecallDrills([
    note({}),
    note({
      slug: "upsc-federalism",
      title: "Federalism",
      sidebarLabel: "Federalism",
      sidebarPosition: 2,
      excerpt: "Federalism divides power between central and state governments.",
      headings: [
        { level: 2, text: "Master Summary" },
        { level: 2, text: "Key Concepts" },
        { level: 2, text: "UPSC Relevance" },
        { level: 3, text: "What Makes India a Federal Country?" },
        { level: 3, text: "Decentralisation in India" }
      ]
    }),
    note({
      slug: "sem5-em2",
      title: "Electrical Machines II",
      courseCode: "SEM5-EM2",
      courseName: "Electrical Machines II"
    })
  ], 2);

  assert.equal(drills.length, 2);
  assert.equal(drills[0]?.title, "Power Sharing");
  assert.match(drills[0]?.prelimsPrompt ?? "", /Prelims/i);
  assert.match(drills[0]?.prelimsPrompt ?? "", /Power Sharing/i);
  assert.match(drills[0]?.mainsPrompt ?? "", /Mains/i);
  assert.match(drills[0]?.mainsPrompt ?? "", /Belgium and Sri Lanka/i);
  assert.match(drills[0]?.sourceFocus ?? "", /UPSC Relevance/);
  assert.equal(drills.some((drill) => drill.slug === "sem5-em2"), false);
});

test("buildUpscActiveRecallDrills prefers notes with richer exam-facing headings", () => {
  const drills = buildUpscActiveRecallDrills([
    note({
      slug: "plain-overview",
      title: "Overview",
      sidebarPosition: 0,
      headings: [{ level: 2, text: "Introduction" }]
    }),
    note({
      slug: "federalism",
      title: "Federalism",
      sidebarPosition: 2,
      headings: [
        { level: 2, text: "UPSC Relevance" },
        { level: 2, text: "Prelims Drill" },
        { level: 2, text: "Mains Answer Practice" },
        { level: 3, text: "Centre-State Relations" }
      ]
    })
  ], 1);

  assert.equal(drills[0]?.slug, "federalism");
  assert.deepEqual(drills[0]?.checklist, [
    "Write the answer before opening the note.",
    "Mark one missing term, article, institution, or comparison.",
    "Convert the miss into a catch question for tomorrow."
  ]);
});

test("buildUpscDrillStudyTask converts a drill into durable learner-memory activity input", () => {
  const drill = buildUpscActiveRecallDrills([note({})], 1)[0];
  assert.ok(drill);

  const task = buildUpscDrillStudyTask(drill);

  assert.equal(task.id, "upsc-drill:upsc-power-sharing");
  assert.equal(task.title, "UPSC drill: Power Sharing");
  assert.equal(task.method, "retrieval");
  assert.equal(task.minutes, 25);
  assert.deepEqual(task.note, {
    slug: "upsc-power-sharing",
    title: "Power Sharing",
    courseCode: "UPSC-CSE-POLITICAL-SCIENCE",
    courseName: "UPSC Political Science NCERT"
  });
});
