import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { getCourse, getCourseNotes } from "../lib/content";

const root = process.cwd();

test("quantum-computing source manifest records full PDF coverage", () => {
  const manifest = JSON.parse(fs.readFileSync(path.join(root, "data/sources/quantum-computing/manifest.json"), "utf8"));
  assert.equal(manifest.pageCount, 135);
  assert.equal(manifest.sha256, "8c97a5b7e689779795b05ba05b0e388ae9f4a64bdced46fffcb1364a81277c11");
  assert.equal(manifest.studyOsId, "SEM7-QC");
  assert.equal(manifest.coverage.length, 7);
  assert.equal(manifest.coverage[0].pages, "1-20");
  assert.equal(manifest.coverage.at(-1).pages, "126-135");
});

test("quantum-computing course and every authored note are generated", () => {
  const course = getCourse("SEM7-QC");
  assert.ok(course);
  assert.equal(course.name, "Introduction to Quantum Computing");

  const notes = getCourseNotes("SEM7-QC");
  assert.equal(notes.length, 8);
  assert.equal(notes.every((note) => note.courseCode === "SEM7-QC"), true);
  assert.equal(notes.some((note) => /Question Bank/.test(note.title)), true);
  assert.equal(notes.some((note) => /Quantum Measurement/.test(note.title)), true);
  assert.equal(notes.reduce((sum, note) => sum + note.stats.mathBlocks, 0) > 50, true);
});

test("quantum-computing notes preserve the source corrections", () => {
  const notesRoot = path.join(root, "docs/sem7/qc");
  const body = fs.readdirSync(notesRoot)
    .filter((name) => name.endsWith(".md"))
    .map((name) => fs.readFileSync(path.join(notesRoot, name), "utf8"))
    .join("\n");
  assert.match(body, /n\$-qubit register has \*\*\$n\$ qubits/i);
  assert.match(body, /do not solve classically uncomputable problems/i);
  assert.match(body, /not automatically or universally \"unbreakable\"/i);
  assert.match(body, /POVM is a general measurement model/i);
});
