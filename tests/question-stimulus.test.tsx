import assert from "node:assert/strict";
import test from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { SscQuestionStimulus } from "@/components/SscQuestionStimulus";

test("question stimulus renders a labelled data table", () => {
  const markup = renderToStaticMarkup(
    <SscQuestionStimulus stimulus={{
      type: "table",
      caption: "Regional sales",
      columns: ["Region", "Sales"],
      rows: [["North", "318"], ["South", "212"], ["East", "166"]]
    }} />
  );

  assert.match(markup, /<table>/);
  assert.match(markup, /Regional sales/);
  assert.match(markup, /North/);
  assert.match(markup, /318/);
  assert.match(markup, /scope="col"/);
});
