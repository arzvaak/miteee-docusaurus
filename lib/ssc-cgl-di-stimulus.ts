import type { SscCglQuestionStimulus } from "@/lib/exam-types";

type TokenKind = "year" | "code" | "word";

type Candidate = {
  start: number;
  end: number;
  label: string;
  kind: TokenKind;
};

type CandidateRow = Candidate & {
  cells: string[];
  cellsStart: number;
  cellsEnd: number;
};

type NumericRun = {
  start: number;
  end: number;
  labelStart: number;
  label: string;
  kind: TokenKind;
  cells: string[];
};

const missingCellPattern = /^(?:[-_=]{2,}|n\/?a)$/i;
const yearPattern = /^(?:19|20)\d{2}$/;
const codePattern = /^[A-Z]\d{1,2}$/;
const oneLetterPattern = /^[A-Z]$/;
const stopLabelPattern = /^(?:a|an|and|answer|are|as|at|by|for|from|given|how|if|in|is|of|on|or|the|to|was|were|what|which|with)$/i;
const headerLabelPattern = /^(?:answer|applicants?|appeared|bar|books?|chart|companies?|computer|data|expenditure|female|graph|income|marks?|number|percentage|people|production|qualified|registered|research|scholars?|school|schools|sales|students?|subject|table|total|type|units?|voted|voters|year)$/i;
const knownComplexLabelPattern = /^(?:time in seconds|distance in m|fuel and transport|interest on loans|physical education|social science|computer science|pure sciences|dry fruits|corporate social responsibility|total present)$/i;

const columnPhrasePattern = /^(?:dry fruits|fuel and transport|interest on loans|physical education|social science|computer science|pure sciences|corporate social responsibility|total present|total number|number of [a-z ]+|[a-z]+)$/i;

function normalizeOcrText(value: string) {
  return value
    .replace(/[\u00A0\u202F]/g, " ")
    .replace(/[ﬁﬂ]/g, (value) => value === "ﬁ" ? "fi" : "fl")
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/(\d),\s+(\d{3})(?=\D|$)/g, "$1,$2")
    .replace(/\s+/g, " ")
    .trim();
}

function tokenize(value: string) {
  return normalizeOcrText(value).split(" ").filter(Boolean);
}

function bareToken(value: string) {
  return value
    .replace(/^[([{"'`]+/g, "")
    .replace(/[)\]},;:.!?]+$/g, "")
    .trim();
}

function isYearToken(value: string) {
  return yearPattern.test(bareToken(value));
}

function isNumberToken(value: string) {
  const token = bareToken(value).replace(/[₹$€£]/g, "");
  return /^[-+]?\d[\d,]*(?:\.\d+)?(?:%|°)?$/.test(token);
}

function isMissingCellToken(value: string) {
  return missingCellPattern.test(bareToken(value));
}

function isDataToken(value: string) {
  return isNumberToken(value) || isMissingCellToken(value);
}

function cleanDataCell(value: string) {
  const token = bareToken(value);
  return isMissingCellToken(token) ? "—" : token;
}

function cleanLabel(tokens: string[]) {
  return tokens
    .map((token) => bareToken(token))
    .filter(Boolean)
    .join(" ")
    .replace(/\s*\/\s*/g, "/")
    .trim();
}

function labelKind(value: string): TokenKind {
  if (isYearToken(value)) return "year";
  if (codePattern.test(value) || oneLetterPattern.test(value)) return "code";
  return "word";
}

function isLabelStart(value: string) {
  const token = bareToken(value);
  if (!token || stopLabelPattern.test(token)) return false;
  return /^[A-Za-z][A-Za-z0-9/&-]*$/.test(token) || isYearToken(token);
}

function findCandidateAt(tokens: string[], start: number): Candidate | undefined {
  const first = bareToken(tokens[start] ?? "");
  if (!isLabelStart(first)) return undefined;

  const kind = labelKind(first);
  const separatedCodeDigit = bareToken(tokens[start + 1] ?? "");
  if (oneLetterPattern.test(first) && /^\d$/.test(separatedCodeDigit) && isNumberToken(tokens[start + 2] ?? "")) {
    return { start, end: start + 2, label: `${first}${separatedCodeDigit}`, kind: "code" };
  }
  const maxLabelTokens = kind === "year" ? 1 : 3;
  for (let end = start + 1; end <= Math.min(tokens.length, start + maxLabelTokens + 1); end += 1) {
    if (!isDataToken(tokens[end] ?? "")) continue;
    const labelTokens = tokens.slice(start, end);
    if (labelTokens.some((token) => isNumberToken(token) || isMissingCellToken(token))) continue;
    if (labelTokens.length > 1 && kind === "code") continue;
    if (labelTokens.length > 3) continue;
    if (labelTokens.length > 1 && headerLabelPattern.test(first) && !/^(?:time|distance)$/i.test(first)) continue;
    const label = cleanLabel(labelTokens);
    if (
      labelTokens.length > 1
      && labelTokens.every((token) => /^[A-Z][A-Za-z-]*[,.!?)]?$/.test(bareToken(token)))
      && !knownComplexLabelPattern.test(label)
    ) continue;
    return { start, end, label, kind };
  }

  return undefined;
}

function buildCandidates(tokens: string[]) {
  const candidates: Candidate[] = [];
  for (let index = 0; index < tokens.length; index += 1) {
    const candidate = findCandidateAt(tokens, index);
    if (candidate) {
      candidates.push(candidate);
      index = candidate.end - 1;
    }
  }
  return candidates;
}

function buildCandidateRows(tokens: string[], candidates: Candidate[]) {
  return candidates.map((candidate, index): CandidateRow => {
    const nextCandidate = candidates[index + 1];
    const end = nextCandidate?.start ?? tokens.length;
    const cells = tokens
      .slice(candidate.end, end)
      .filter(isDataToken)
      .map(cleanDataCell);
    return { ...candidate, cells, cellsStart: candidate.end, cellsEnd: end };
  });
}

function findNumericBlock(tokens: string[]) {
  const numericPositions = tokens
    .map((token, index) => isDataToken(token) ? index : -1)
    .filter((index) => index >= 0);
  const blocks: Array<{ start: number; end: number; count: number }> = [];
  let current: { start: number; end: number; count: number } | undefined;

  for (const position of numericPositions) {
    if (!current || position - current.end > 4) {
      if (current) blocks.push(current);
      current = { start: position, end: position, count: 1 };
    } else {
      current.end = position;
      current.count += 1;
    }
  }
  if (current) blocks.push(current);

  return blocks
    .filter((block) => block.count >= 4)
    .sort((left, right) => right.count - left.count || right.end - right.start - (left.end - left.start))[0];
}

function findLabelForRun(tokens: string[], runStart: number) {
  const lowerBound = Math.max(0, runStart - 4);
  const matchingCandidates: Candidate[] = [];
  for (let index = runStart - 1; index >= lowerBound; index -= 1) {
    const candidate = findCandidateAt(tokens, index);
    if (candidate?.end === runStart) matchingCandidates.push(candidate);
  }
  if (matchingCandidates.length) return matchingCandidates.sort((left, right) => left.start - right.start)[0]!;

  const fallback = bareToken(tokens[runStart - 1] ?? "") || "Value";
  return {
    start: Math.max(0, runStart - 1),
    end: runStart,
    label: fallback,
    kind: labelKind(fallback)
  } satisfies Candidate;
}

function buildNumericRuns(tokens: string[], block: { start: number; end: number }) {
  const runs: NumericRun[] = [];
  let index = block.start;
  while (index <= block.end) {
    if (!isDataToken(tokens[index] ?? "")) {
      index += 1;
      continue;
    }
    const start = index;
    const cells: string[] = [];
    while (index <= block.end && isDataToken(tokens[index] ?? "")) {
      cells.push(cleanDataCell(tokens[index]!));
      index += 1;
    }
    const label = findLabelForRun(tokens, start);
    runs.push({
      start,
      end: index,
      labelStart: label.start,
      label: label.label,
      kind: label.kind,
      cells
    });
  }
  return runs;
}

function isPlausibleDataLabel(label: string) {
  const first = label.split(/[ /]/)[0] ?? "";
  if (!label || (headerLabelPattern.test(first) && !knownComplexLabelPattern.test(label))) return false;
  if (/\b(?:below|following|given|table)\b/i.test(label) || /\/\s*year\b/i.test(label)) return false;
  if (knownComplexLabelPattern.test(label)) return true;
  return !/\b(?:by|during|for|from|in|of|over|than|the|to|with)\b/i.test(label);
}

function chooseNumericRunRows(tokens: string[], block: { start: number; end: number }) {
  const runs = buildNumericRuns(tokens, block);
  const groups = new Map<number, NumericRun[]>();
  for (const run of runs) {
    if (!isPlausibleDataLabel(run.label)) continue;
    const group = groups.get(run.cells.length) ?? [];
    group.push(run);
    groups.set(run.cells.length, group);
  }
  const best = [...groups.values()]
    .filter((group) => group.length >= 2)
    .sort((left, right) => right.length - left.length || right.reduce((sum, row) => sum + row.cells.length, 0) - left.reduce((sum, row) => sum + row.cells.length, 0))[0];
  if (!best) return undefined;
  return best.map((run): CandidateRow => ({
    start: run.labelStart,
    end: run.start,
    label: run.label,
    kind: run.kind,
    cells: run.cells,
    cellsStart: run.start,
    cellsEnd: run.end
  }));
}

function inferYearRows(tokens: string[], block: { start: number; end: number }) {
  const starts = tokens
    .map((token, index) => ({ token, index }))
    .filter(({ token, index }) => index >= block.start && index <= block.end && isYearToken(token) && isDataToken(tokens[index + 1] ?? ""));
  if (starts.length < 2) return undefined;

  const rows: CandidateRow[] = [];
  for (let index = 0; index < starts.length; index += 1) {
    const current = starts[index]!;
    const next = starts[index + 1]?.index ?? block.end + 1;
    const cells = tokens
      .slice(current.index + 1, next)
      .filter(isDataToken)
      .map(cleanDataCell);
    if (!cells.length) return undefined;
    rows.push({
      start: current.index,
      end: current.index + 1,
      label: bareToken(current.token),
      kind: "year",
      cells,
      cellsStart: current.index + 1,
      cellsEnd: next
    });
  }
  const width = commonCellWidth(rows);
  if (width < 1 || rows.some((row) => row.cells.length < width)) return undefined;
  return rows.map((row) => ({ ...row, cells: row.cells.slice(0, width) }));
}

function groupRows(rows: CandidateRow[]) {
  const groups: CandidateRow[][] = [];
  for (const row of rows.filter((candidate) => candidate.cells.length > 0)) {
    const previousGroup = groups.at(-1);
    const previousRow = previousGroup?.at(-1);
    if (
      previousGroup
      && previousRow
      && previousRow.kind === row.kind
      && row.start - previousRow.start <= 60
    ) {
      previousGroup.push(row);
    } else {
      groups.push([row]);
    }
  }
  return groups;
}

function commonCellWidth(rows: CandidateRow[]) {
  const counts = rows.map((row) => row.cells.length).filter((count) => count > 0);
  if (!counts.length) return 0;
  const frequencies = new Map<number, number>();
  for (const count of counts) frequencies.set(count, (frequencies.get(count) ?? 0) + 1);
  return [...frequencies.entries()]
    .sort(([leftWidth, leftFrequency], [rightWidth, rightFrequency]) => rightFrequency - leftFrequency || rightWidth - leftWidth)[0]?.[0] ?? 0;
}

function compactHeader(value: string) {
  return value.replace(/[|→↓]/g, " ").replace(/\s+/g, " ").trim();
}

function headerTokensBeforeFirstRow(tokens: string[], firstRowStart: number) {
  return tokens.slice(0, firstRowStart).map(bareToken).filter(Boolean);
}

function detectLabelColumn(header: string, firstRow: CandidateRow) {
  if (firstRow.kind === "year") return "Year";
  const matches = header.match(/(?:branch|type(?: of [a-z]+)?|time|distance|month|day|days|student|students|subject|department|centre|center|state|source|item|manufacturer|brand|showroom|farm|company|companies|printer|printers|worker|workers|name|category|course|programme|program)/gi);
  const label = matches?.at(-1) ?? "Label";
  return label.charAt(0).toUpperCase() + label.slice(1);
}

function headerColumnLabels(header: string, width: number) {
  const normalizedHeader = compactHeader(header);
  const years = normalizedHeader.match(/\b(?:19|20)\d{2}\b/g) ?? [];
  if (years.length === width) return years;

  const upperCaseLabels = normalizedHeader
    .split(" ")
    .map(bareToken)
    .filter((token) => oneLetterPattern.test(token) || codePattern.test(token));
  const repeatedMeasurementLabels = upperCaseLabels.filter((token) => token === "M" || token === "S");
  const entityLabels = [...new Set(upperCaseLabels.filter((token) => token !== "M" && token !== "S"))];
  if (repeatedMeasurementLabels.length >= 2 && entityLabels.length * 2 === width) {
    return entityLabels.flatMap((entity) => [`${entity} M`, `${entity} S`]);
  }
  if (upperCaseLabels.length === width) return upperCaseLabels;

  const anchors = [
    "subjects", "subject", "commodities", "commodity", "items", "item", "heads", "categories",
    "companies", "company", "branches", "branch", "centres", "centers", "centre", "center",
    "farm", "farms", "showrooms", "showroom", "printers", "printer", "workers", "worker", "student", "students"
  ];
  let suffix = normalizedHeader;
  for (const anchor of anchors) {
    const anchorIndex = suffix.toLowerCase().lastIndexOf(anchor);
    if (anchorIndex >= 0) suffix = suffix.slice(anchorIndex + anchor.length).trim();
  }
  const suffixTokens = suffix.split(" ").filter(Boolean);
  const phrases: string[] = [];
  for (let index = 0; index < suffixTokens.length;) {
    const pair = suffixTokens.slice(index, index + 2).join(" ");
    if (columnPhrasePattern.test(pair)) {
      phrases.push(pair);
      index += 2;
      continue;
    }
    if (columnPhrasePattern.test(suffixTokens[index] ?? "")) phrases.push(suffixTokens[index]!);
    index += 1;
  }
  if (phrases.length === width) return phrases;

  return Array.from({ length: width }, (_, index) => `Value ${index + 1}`);
}

function chooseRows(tokens: string[]) {
  const numericBlock = findNumericBlock(tokens);
  if (!numericBlock) return undefined;
  const yearRows = inferYearRows(tokens, numericBlock);
  if (yearRows) return yearRows;
  const numericRunRows = chooseNumericRunRows(tokens, numericBlock);
  if (numericRunRows) return numericRunRows;
  const rows = buildCandidateRows(tokens, buildCandidates(tokens)).filter((row) => (
    row.start <= numericBlock.end
    && row.cellsEnd >= numericBlock.start
  ));
  const groups = groupRows(rows)
    .filter((group) => group.length >= 2)
    .filter((group) => group.every((row) => isPlausibleDataLabel(row.label)))
    .filter((group) => {
      const width = commonCellWidth(group);
      if (width > 1) return true;
      if (group[0]?.kind === "year") return true;
      return group.every((row) => !row.label.includes(" ") && !/^(?:companies?|college|graph|chart|lakhs?|period|tones?|years?|production|sales?)$/i.test(row.label));
    });
  return groups.sort((left, right) => {
    const leftCells = left.reduce((sum, row) => sum + row.cells.length, 0);
    const rightCells = right.reduce((sum, row) => sum + row.cells.length, 0);
    return right.length - left.length || rightCells - leftCells;
  })[0];
}

function inferYearHeaderMatrix(tokens: string[]): SscCglQuestionStimulus | undefined {
  for (let start = 0; start < tokens.length; start += 1) {
    if (!isYearToken(tokens[start] ?? "")) continue;
    const years: string[] = [];
    let end = start;
    while (isYearToken(tokens[end] ?? "")) {
      years.push(bareToken(tokens[end]!));
      end += 1;
    }
    if (years.length < 2) continue;

    let dataStart = end;
    while (dataStart < tokens.length && !isNumberToken(tokens[dataStart] ?? "") && bareToken(tokens[dataStart] ?? "").toUpperCase() !== "X") {
      dataStart += 1;
    }
    if (dataStart >= tokens.length) continue;
    const values: string[] = [];
    for (let index = dataStart; index < tokens.length; index += 1) {
      const token = bareToken(tokens[index] ?? "");
      if (isNumberToken(token)) values.push(token);
      else if (token.toUpperCase() === "X") values.push("—");
      else break;
    }
    if (values.length !== years.length) continue;

    const label = cleanLabel(tokens.slice(end, dataStart)) || "Value";
    if (headerLabelPattern.test(label.split(" ")[0] ?? "") && !/^(?:production|population|sales|income|expenditure)$/i.test(label)) continue;
    return {
      type: "table",
      caption: "Recovered source table",
      columns: ["Metric", ...years],
      rows: [[label, ...values]],
      reconstructionNote: "Reconstructed from the retained OCR text after the source PDF was removed."
    };
  }
  return undefined;
}

function hasVisualCue(value: string) {
  return /\b(?:table|bar\s*[- ]?chart|bar\s*graph|pie\s*[- ]?chart|pie\s*graph|line\s*[- ]?chart|line\s*graph|chart|graph|following\s+table|given\s+table)\b/i.test(value);
}

export function inferSscCglDiStimulus(stem: string): SscCglQuestionStimulus | undefined {
  const normalizedStem = normalizeOcrText(stem);
  if (!normalizedStem || !hasVisualCue(normalizedStem)) return undefined;

  const tokens = tokenize(normalizedStem);
  const selectedRows = chooseRows(tokens);
  if (!selectedRows || selectedRows.length < 2) return inferYearHeaderMatrix(tokens);

  const width = commonCellWidth(selectedRows);
  if (width < 1) return undefined;

  const rows = selectedRows.map((row) => [row.label, ...row.cells.slice(0, width)]);
  const header = tokens.slice(0, selectedRows[0]!.start).join(" ");
  const labelColumn = detectLabelColumn(header, selectedRows[0]!);
  const columns = [labelColumn, ...headerColumnLabels(header, width)];
  const chart = /\b(?:bar|pie|line)\s*[- ]?(?:chart|graph|diagram)\b|\bchart\b|\bgraph\b/i.test(normalizedStem);

  return {
    type: "table",
    caption: chart ? "Recovered chart data (table view)" : "Recovered source table",
    columns,
    rows,
    reconstructionNote: chart
      ? "The original chart image was removed; this table uses the chart values retained in the OCR text."
      : "Reconstructed from the retained OCR text after the source PDF was removed."
  };
}
