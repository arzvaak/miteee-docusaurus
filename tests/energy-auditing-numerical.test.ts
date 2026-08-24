import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const root = process.cwd();
const notesRoot = path.join(root, "docs", "sem7", "ea");

function note(name: string) {
  return fs.readFileSync(path.join(notesRoot, name), "utf8");
}

function close(actual: number, expected: number, tolerance = 1e-6) {
  assert.ok(Math.abs(actual - expected) <= tolerance, `${actual} is not within ${tolerance} of ${expected}`);
}

test("Energy Auditing tutorial substitutions reproduce their source-stated answers", () => {
  const t01 = note("tutorial-t01-energy-calculations.md");
  const coalLossKcal = 120 * 4_800 * (1 - 0.82);
  const conveyorTonnesPerHour = 1 * 0.25 * 0.5 * 3_600 * 1.1;
  const waterHeatingKwh = (100 * 4.186 * (70 - 30)) / 3_600;
  close(coalLossKcal, 103_680);
  close(conveyorTonnesPerHour, 495);
  close(waterHeatingKwh, 4.651111111111111, 1e-9);
  assert.match(t01, /120[^\n]{0,40}(?:\\times|[x×*])[^\n]{0,30}4(?:800|\{,\}800)/i);
  assert.match(t01, /103(?:,|\{,\})?680[^\n]{0,20}kcal/i);
  assert.match(t01, /495[^\n]{0,24}(?:ton|t)\/?(?:h|hr)/i);
  assert.match(t01, /4\.65\s*kWh/i);

  const t03 = note("tutorial-t03-cumsum-analysis.md");
  const cusumSavingKwh = 28 * 6_000;
  close(cusumSavingKwh, 168_000);
  assert.match(t03, /28[^\n]{0,30}(?:\\times|[x×*])[^\n]{0,30}6(?:,|\{,\})?000/i);
  assert.match(t03, /1(?:,|\{,\})?68(?:,|\{,\})?000[^\n]{0,20}kWh|168(?:,|\{,\})?000[^\n]{0,20}kWh/i);

  const t10 = note("tutorial-t10-fuels-boilers.md");
  const boilerEfficiencyPercent = (4 * (650 - 65) * 100) / 4_000;
  close(boilerEfficiencyPercent, 58.5);
  assert.match(t10, /4\s*(?:\\times|[x×*])\s*\(?650\s*[-−]\s*65\)?/i);
  assert.match(t10, /58\.5\s*%/i);

  const t11 = note("tutorial-t11-steam-furnace-heat-exchangers.md");
  const flashFraction = (185 - 133) / 650;
  const flashFlowKgPerHour = 1_000 * flashFraction;
  close(flashFraction, 0.08);
  close(flashFlowKgPerHour, 80);
  assert.match(t11, /\(?185\s*[-−]\s*133\)?\s*\/?\s*650/i);
  assert.match(t11, /80\s*(?:kg|kgs)\/?\s*(?:h|hr)/i);
});

test("Energy Auditing PYQ worked solutions retain units and deterministic substitutions", () => {
  const regression = note("pyq-01-2014-regular-ele-423-bef8bf76.md");
  const production = [380, 440, 460, 520, 320, 520, 240, 620];
  const energy = [340, 340, 380, 380, 300, 500, 280, 424];
  const meanProduction = production.reduce((sum, value) => sum + value, 0) / production.length;
  const meanEnergy = energy.reduce((sum, value) => sum + value, 0) / energy.length;
  const sxx = production.reduce((sum, value) => sum + (value - meanProduction) ** 2, 0);
  const syy = energy.reduce((sum, value) => sum + (value - meanEnergy) ** 2, 0);
  const sxy = production.reduce((sum, value, index) => sum + (value - meanProduction) * (energy[index]! - meanEnergy), 0);
  const slope = sxy / sxx;
  const intercept = meanEnergy - slope * meanProduction;
  const correlation = sxy / Math.sqrt(sxx * syy);
  close(slope, 0.47590535972959924, 1e-12);
  close(intercept, 159.79140511830033, 1e-9);
  close(correlation, 0.821118593283045, 1e-12);
  assert.match(regression, /0\.4759\d*/);
  assert.match(regression, /159\.79\d*/);
  assert.match(regression, /0\.821\d*/);
  assert.match(regression, /185\.0?8\$?\s*toe/i);

  const pump = note("pyq-03-2015-regular-ele-423-068a88bf.md");
  const reducedFlowM3PerHour = 30 * 0.75;
  const reducedHeadMetres = 37 * 0.75 ** 2;
  close(reducedFlowM3PerHour, 22.5);
  close(reducedHeadMetres, 20.8125);
  assert.match(pump, /22\.5\s*m(?:\^?3|³)\/?\s*(?:h|hr)/i);
  assert.match(pump, /20\.8(?:1|125)?\s*m/i);
  assert.match(pump, /worked solution\s*[-–—:]?\s*not an official answer/i);

  const furnace = note("pyq-10-2021-regular-ele-4006-0734f852.md");
  const usefulHeatKcalPerTonne = 1_000 * 0.12 * (1_150 - 50);
  const fuelLitresPerTonne = usefulHeatKcalPerTonne / 0.32 / 10_000 / 0.95;
  const fuelLitresPerHour = fuelLitresPerTonne * 15;
  close(usefulHeatKcalPerTonne, 132_000);
  close(fuelLitresPerTonne, 43.421052631578945, 1e-9);
  close(fuelLitresPerHour, 651.3157894736842, 1e-9);
  assert.match(furnace, /132[,]?000\s*kcal\/?(?:t|tonne)/i);
  assert.match(furnace, /43\.4\d*\s*(?:L|litres?)\/?(?:t|tonne)/i);
  assert.match(furnace, /651(?:\.3\d*)?\s*(?:L|litres?)\/?\s*(?:h|hr)/i);
  assert.match(furnace, /worked solution\s*[-–—:]?\s*not an official answer/i);
});
