import assert from "node:assert/strict";
import test from "node:test";
import { inferSscCglDiStimulus } from "@/lib/ssc-cgl-di-stimulus";

test("DI stimulus reconstruction turns retained inline table OCR into a real table", () => {
  const stimulus = inferSscCglDiStimulus(
    "Study the given table. Centre Total voters Percentage voted W 10,260 67 X 15,320 70 Y 11,450 56 Z 13,394 75 What percentage voted at centre X?"
  );

  assert.ok(stimulus);
  assert.deepEqual(stimulus.columns, ["Centre", "Value 1", "Value 2"]);
  assert.deepEqual(stimulus.rows, [
    ["W", "10,260", "67"],
    ["X", "15,320", "70"],
    ["Y", "11,450", "56"],
    ["Z", "13,394", "75"]
  ]);
  assert.match(stimulus.reconstructionNote ?? "", /retained OCR/i);
});

test("DI stimulus reconstruction preserves year-row tables and paired headers", () => {
  const stimulus = inferSscCglDiStimulus(
    "The given table shows units manufactured. Year X Y Z M S M S M S 2017 16.5 11.2 19.6 11.3 13.9 12.0 2018 15.6 12.9 13.2 10.1 15.5 13.6 2019 12.8 10.5 12.1 11.2 17.4 12.2 What is the average?"
  );

  assert.ok(stimulus);
  assert.deepEqual(stimulus.columns, ["Year", "X M", "X S", "Y M", "Y S", "Z M", "Z S"]);
  assert.deepEqual(stimulus.rows[0], ["2017", "16.5", "11.2", "19.6", "11.3", "13.9", "12.0"]);
});

test("DI stimulus reconstruction does not invent a chart from labels alone", () => {
  assert.equal(
    inferSscCglDiStimulus("The following bar graph shows production by companies X, Y, Z and W from 2018 to 2020. Which company has the maximum average?"),
    undefined
  );
});
