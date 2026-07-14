import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import {
  createCurrentAffairsActionsState,
  isCurrentAffairsStoryHidden,
  isCurrentAffairsStorySaved,
  parseCurrentAffairsActionsState,
  reduceCurrentAffairsActions,
  serializeCurrentAffairsActionsState,
  type CurrentAffairsStoryIdentity
} from "@/lib/current-affairs-actions";

const story: CurrentAffairsStoryIdentity = {
  id: "2026-07-13:rbi-repo-rate",
  title: "RBI keeps the repo rate unchanged",
  source: "RBI",
  url: "https://example.com/rbi"
};

test("current affairs actions keep lens, revision, and hidden state separate", () => {
  const initial = createCurrentAffairsActionsState();
  const upsc = reduceCurrentAffairsActions(initial, { type: "set-lens", lens: "upsc" }, "2026-07-13T10:00:00.000Z");
  const saved = reduceCurrentAffairsActions(upsc, { type: "set-saved", story, saved: true }, "2026-07-13T10:01:00.000Z");
  const hidden = reduceCurrentAffairsActions(saved, { type: "set-hidden", story, hidden: true }, "2026-07-13T10:02:00.000Z");

  assert.equal(hidden.lens, "upsc");
  assert.equal(isCurrentAffairsStorySaved(hidden, story), true);
  assert.equal(isCurrentAffairsStoryHidden(hidden, story), true);
  assert.equal(hidden.saved[story.id]?.story.title, story.title);

  const restored = reduceCurrentAffairsActions(hidden, { type: "restore-hidden", storyIds: [story.id] }, "2026-07-13T10:03:00.000Z");
  assert.equal(isCurrentAffairsStoryHidden(restored, story), false);
  assert.equal(isCurrentAffairsStorySaved(restored, story), true);
});

test("current affairs action persistence tolerates malformed device data", () => {
  const state = reduceCurrentAffairsActions(
    createCurrentAffairsActionsState("upsc"),
    { type: "set-saved", story, saved: true },
    "2026-07-13T10:00:00.000Z"
  );
  assert.deepEqual(parseCurrentAffairsActionsState(serializeCurrentAffairsActionsState(state)), state);
  assert.deepEqual(parseCurrentAffairsActionsState("not-json"), createCurrentAffairsActionsState());

  const parsed = parseCurrentAffairsActionsState(JSON.stringify({
    version: 999,
    lens: "invalid",
    saved: {
      valid: state.saved[story.id],
      invalid: { story: { id: "", title: "Missing identity" }, updatedAt: "now" }
    },
    hidden: []
  }));
  assert.equal(parsed.lens, "ssc");
  assert.equal(Object.keys(parsed.saved).length, 1);
  assert.equal(isCurrentAffairsStorySaved(parsed, story), true);
});

test("current affairs client controls expose accessible actions and an account-adapter seam", () => {
  const component = fs.readFileSync(path.join(process.cwd(), "components", "CurrentAffairsActions.tsx"), "utf8");
  const stateModule = fs.readFileSync(path.join(process.cwd(), "lib", "current-affairs-actions.ts"), "utf8");

  assert.match(component, /^"use client";/);
  assert.match(component, /SSC lens/);
  assert.match(component, /UPSC lens/);
  assert.match(component, /Save for revision/);
  assert.match(component, /Restore all hidden stories/);
  assert.match(component, /aria-pressed/);
  assert.match(component, /aria-live="polite"/);
  assert.match(component, /role="group"/);
  assert.match(component, /canAdmin\?: boolean/);
  assert.match(component, /window\.localStorage/);
  assert.match(stateModule, /CurrentAffairsActionsAdapter/);
  assert.match(stateModule, /server adapter must authenticate and authorize every/);
});
