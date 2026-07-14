import assert from "node:assert/strict";
import test from "node:test";
import { stripTrailingOrphanDisplayDelimiter } from "../lib/ssc-cgl-source";

test("stripTrailingOrphanDisplayDelimiter removes only unmatched terminal display markers", () => {
  assert.equal(stripTrailingOrphanDisplayDelimiter("Shift 1) $$"), "Shift 1)");
  assert.equal(stripTrailingOrphanDisplayDelimiter("65$$  \n"), "65  \n");
  assert.equal(stripTrailingOrphanDisplayDelimiter("Keep $$x^2$$"), "Keep $$x^2$$");
  assert.equal(stripTrailingOrphanDisplayDelimiter("Keep $$x^2$$ and remove $$"), "Keep $$x^2$$ and remove");
});
