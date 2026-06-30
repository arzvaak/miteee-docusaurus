const codeFencePattern = /```[\s\S]*?```/g;
const inlineCodePattern = /`[^`\n]+`/g;

function protectCodeFences(content: string) {
  const blocks: string[] = [];
  const protectedContent = content.replace(codeFencePattern, (block) => {
    const token = `@@MITEEE_CODE_BLOCK_${blocks.length}@@`;
    blocks.push(block);
    return token;
  });
  return { protectedContent, blocks };
}

function restoreCodeFences(content: string, blocks: string[]) {
  return blocks.reduce((result, block, index) => result.replace(`@@MITEEE_CODE_BLOCK_${index}@@`, block), content);
}

function protectInlineCode(content: string) {
  const blocks: string[] = [];
  const protectedContent = content.replace(inlineCodePattern, (block) => {
    const token = `@@MITEEE_INLINE_CODE_${blocks.length}@@`;
    blocks.push(block);
    return token;
  });
  return { protectedContent, blocks };
}

function restoreInlineCode(content: string, blocks: string[]) {
  return blocks.reduce((result, block, index) => result.replace(`@@MITEEE_INLINE_CODE_${index}@@`, block), content);
}

type QuizOption = {
  key: string;
  text: string;
};

type QuizAnswer = {
  key: string;
  explanation?: string;
};

type OptionParseResult = {
  options: QuizOption[];
  startIndex: number;
  endIndex: number;
};

const quizSectionPattern = /^(?:Solved Examples?|Practice Quiz|Prelims Quiz|Quick Quiz|MCQ Drill|Quiz|200\/200 Drill)$/i;
const exampleHeadingPattern = /^\*\*Example\s+(\d+)(?::\s*([^*]+))?\*\*\s*$/i;
const numberedQuestionPattern = /^(\d+)\.\s+(.+)$/;

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function stripLightMarkdown(value: string) {
  return value
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
}

function optionMarkerRegex() {
  return /(?:^|[\s,])(?:\(([a-dA-D])\)|([a-dA-D])\))\s*/g;
}

function parseInlineOptions(rawOptions: string) {
  const matches = Array.from(rawOptions.matchAll(optionMarkerRegex()));
  if (matches.length < 2) return [];

  return matches.map((match, index) => {
    const key = (match[1] || match[2] || "").toLowerCase();
    const start = (match.index || 0) + match[0].length;
    const end = index + 1 < matches.length ? matches[index + 1]!.index || rawOptions.length : rawOptions.length;
    return {
      key,
      text: stripLightMarkdown(rawOptions.slice(start, end).replace(/^[,;:\s]+|[,;:\s]+$/g, ""))
    };
  }).filter((option) => option.key && option.text);
}

function parseOptionLine(rawLine: string): QuizOption | null {
  const match = rawLine.match(/^\s*(?:\(([a-dA-D])\)|([a-dA-D])\))\s+(.+?)\s*$/);
  if (!match) return null;
  return {
    key: (match[1] || match[2] || "").toLowerCase(),
    text: stripLightMarkdown(match[3] || "")
  };
}

function findOptions(lines: string[]): OptionParseResult | null {
  for (let index = 0; index < lines.length; index += 1) {
    const optionsLine = lines[index]?.match(/^\s*Options\s*:\s*(.*)$/i);
    if (!optionsLine) continue;

    const inlineOptions = parseInlineOptions(optionsLine[1] || "");
    if (inlineOptions.length >= 2) {
      return { options: inlineOptions, startIndex: index, endIndex: index + 1 };
    }

    const multilineOptions: QuizOption[] = [];
    let optionIndex = index + 1;
    while (optionIndex < lines.length) {
      const option = parseOptionLine(lines[optionIndex] || "");
      if (!option) break;
      multilineOptions.push(option);
      optionIndex += 1;
    }
    if (multilineOptions.length >= 2) {
      return { options: multilineOptions, startIndex: index, endIndex: optionIndex };
    }
  }

  return null;
}

function parseAnswer(raw: string) {
  const match = raw.match(/\*{0,2}Answer\*{0,2}\s*:\s*\(?([a-dA-D])\)?/i);
  return match?.[1]?.toLowerCase() || null;
}

function parseAnswerKeyLine(raw: string) {
  const match = raw.match(/^\s*\*{0,2}Answers?\*{0,2}\s*:\s*(.+)$/i);
  if (!match) return null;

  const answers = new Map<string, QuizAnswer>();
  const answerPattern = /(\d+)\s*[-:.]\s*\(?([a-dA-D])\)?(?:\s*\((.*?)\))?(?=\s*,\s*\d+\s*[-:.]\s*\(?[a-dA-D]\)?|$)/g;
  for (const answer of (match[1] || "").matchAll(answerPattern)) {
    const questionNumber = answer[1] || "";
    const key = (answer[2] || "").toLowerCase();
    const explanation = stripLightMarkdown(answer[3] || "");
    answers.set(questionNumber, explanation ? { key, explanation } : { key });
  }
  return answers.size ? answers : null;
}

function parseInlineQuestion(rawQuestion: string) {
  const marker = /[\s,](?:\([a-dA-D]\)|[a-dA-D]\))\s/.exec(rawQuestion);
  if (!marker || marker.index <= 0) return null;

  const question = stripLightMarkdown(rawQuestion.slice(0, marker.index));
  const options = parseInlineOptions(rawQuestion.slice(marker.index));
  if (!question || options.length < 2) return null;
  return { question, options };
}

function optionText(options: QuizOption[], key: string) {
  return options.find((option) => option.key === key)?.text || "the keyed option";
}

function isThinQuizExplanation(value: string | undefined) {
  const text = stripLightMarkdown(value || "");
  return text.length < 80 || /^answer\s*[:\-]?\s*[a-d]\.?$/i.test(text);
}

function inferQuizMethod(question: string) {
  if (/\b\d+\b/.test(question)) {
    return "Identify the number operation first, test the same operation on the missing term, and only then compare with the options.";
  }
  if (/::|:\s*[^?]+\s*:\s*\?/.test(question)) {
    return "State the exact relation in the first pair, then force the second pair to follow the same relationship before looking at the options.";
  }
  if (/\b(odd|classification|different|does not belong)\b/i.test(question)) {
    return "Find the single property shared by three options, then reject the option that breaks that narrow property.";
  }
  return "Name the rule being tested, apply it directly to the stem, and compare each option against that same rule.";
}

function inferQuizTrap(question: string) {
  if (/\b\d+\b/.test(question)) {
    return "Do not stop at the first visible pattern; verify that the operation works on the complete given pair or series.";
  }
  if (/::|:\s*[^?]+\s*:\s*\?/.test(question)) {
    return "Do not choose a word that is merely associated with the stem; choose the option that preserves the same relationship and direction.";
  }
  if (/\b(odd|classification|different|does not belong)\b/i.test(question)) {
    return "Avoid broad categories when a narrower property separates exactly one option.";
  }
  return "Avoid marking by familiarity; the option must satisfy the exact condition asked in the question.";
}

function renderAnswerExplanation(sectionName: string, question: string, options: QuizOption[], answer: QuizAnswer | null) {
  if (!answer) return "";
  const correctText = optionText(options, answer.key);
  const explanation = stripLightMarkdown(answer.explanation || "");
  const shouldExpand = /^200\/200 Drill$/i.test(sectionName) && isThinQuizExplanation(explanation);
  if (!shouldExpand && explanation) return `<p><strong>Why:</strong> ${escapeHtml(explanation)}</p>`;
  if (!shouldExpand) return "";

  const sourceCue = explanation ? ` Source cue: ${explanation}.` : "";
  return [
    `<p><strong>Method:</strong> ${escapeHtml(inferQuizMethod(question))}</p>`,
    `<p><strong>Why it fits:</strong> ${escapeHtml(`Option ${answer.key.toUpperCase()} (${correctText}) is the keyed answer because it satisfies the exact rule in the stem.${sourceCue}`)}</p>`,
    `<p><strong>Trap:</strong> ${escapeHtml(inferQuizTrap(question))}</p>`
  ].join("\n");
}

function renderQuizBlock(sectionName: string, label: string, question: string, options: QuizOption[], answer: QuizAnswer | null, explanationLines: string[]) {
  const answerAttr = answer ? ` data-answer="${escapeHtml(answer.key)}"` : "";
  const optionRows = options.map((option) => {
    return `<div class="quiz-option" data-opt="${escapeHtml(option.key)}" role="listitem"><span class="opt-key">${escapeHtml(option.key.toUpperCase())}</span> <span class="opt-text">${escapeHtml(option.text)}</span></div>`;
  }).join("\n");
  const explanation = explanationLines
    .map(stripLightMarkdown)
    .filter(Boolean)
    .map((line) => `<p>${escapeHtml(line)}</p>`)
    .join("\n");
  const answerSummary = answer ? `<p><strong>Answer:</strong> ${escapeHtml(answer.key.toUpperCase())}</p>` : "";
  const answerExplanation = renderAnswerExplanation(sectionName, question, options, answer);
  const hasExplanation = Boolean(answerExplanation || explanation);
  const details = answer || explanation
    ? [
        '<details class="quiz-exp">',
        `<summary>${hasExplanation ? "Show answer and explanation" : "Show answer"}</summary>`,
        '<div class="quiz-exp-body">',
        answerSummary,
        answerExplanation,
        explanation,
        "</div>",
        "</details>"
      ].filter(Boolean).join("\n")
    : "";

  return [
    `<article class="quiz-block note-quiz-block"${answerAttr}>`,
    `<div class="quiz-meta">${escapeHtml(sectionName)} · ${escapeHtml(label)}</div>`,
    `<p class="quiz-q">${escapeHtml(question)}</p>`,
    '<div class="quiz-options" role="list">',
    optionRows,
    "</div>",
    details,
    "</article>"
  ].filter(Boolean).join("\n");
}

function renderExampleBlock(sectionName: string, rawLabel: string, blockLines: string[]) {
  const optionsResult = findOptions(blockLines);
  if (!optionsResult) return null;

  const question = blockLines
    .slice(0, optionsResult.startIndex)
    .map(stripLightMarkdown)
    .filter(Boolean)
    .join(" ");
  if (!question) return null;

  const explanationLines = blockLines.slice(optionsResult.endIndex).filter((line) => line.trim());
  const answer = explanationLines.map(parseAnswer).find(Boolean);
  return renderQuizBlock(sectionName, rawLabel, question, optionsResult.options, answer ? { key: answer } : null, explanationLines);
}

function collectDrillAnswerKeys(lines: string[]) {
  const answersByLineIndex = new Map<number, QuizAnswer>();
  const answerLineIndexes = new Set<number>();

  lines.forEach((line, index) => {
    const parsed = parseAnswerKeyLine(line);
    if (!parsed) return;
    answerLineIndexes.add(index);

    let startIndex = index - 1;
    while (startIndex >= 0) {
      const previous = lines[startIndex] || "";
      if (parseAnswerKeyLine(previous) || /^\s*\*\*Timed\s+Micro-Drill\b/i.test(previous) || /^#{1,6}\s+/.test(previous)) break;
      startIndex -= 1;
    }

    for (let questionIndex = startIndex + 1; questionIndex < index; questionIndex += 1) {
      const numbered = (lines[questionIndex] || "").match(numberedQuestionPattern);
      if (!numbered) continue;
      const questionNumber = numbered[1] || "";
      const answer = parsed.get(questionNumber);
      if (answer) answersByLineIndex.set(questionIndex, answer);
    }
  });

  return { answersByLineIndex, answerLineIndexes };
}

function processQuizSection(sectionName: string, bodyLines: string[]) {
  const output: string[] = [];
  const { answersByLineIndex, answerLineIndexes } = collectDrillAnswerKeys(bodyLines);
  let index = 0;

  while (index < bodyLines.length) {
    if (answerLineIndexes.has(index)) {
      index += 1;
      continue;
    }

    const line = bodyLines[index] || "";
    const example = line.match(exampleHeadingPattern);
    if (example) {
      const exampleNumber = example[1] || "";
      const rawTitle = stripLightMarkdown(example[2] || "");
      const exampleLines: string[] = [];
      index += 1;
      while (index < bodyLines.length && !exampleHeadingPattern.test(bodyLines[index] || "") && !/^#{1,6}\s+/.test(bodyLines[index] || "")) {
        exampleLines.push(bodyLines[index] || "");
        index += 1;
      }

      const label = rawTitle ? `Example ${exampleNumber}: ${rawTitle}` : `Example ${exampleNumber}`;
      const quizBlock = renderExampleBlock(sectionName, label, exampleLines);
      if (quizBlock) {
        output.push("");
        output.push(quizBlock);
        output.push("");
      } else {
        output.push(line, ...exampleLines);
      }
      continue;
    }

    const numbered = line.match(numberedQuestionPattern);
    if (numbered) {
      const questionNumber = numbered[1] || "";
      const parsed = parseInlineQuestion(numbered[2] || "");
      if (parsed) {
        output.push("");
        output.push(renderQuizBlock(sectionName, `Q${questionNumber}`, parsed.question, parsed.options, answersByLineIndex.get(index) || null, []));
        output.push("");
        index += 1;
        continue;
      }
    }

    output.push(line);
    index += 1;
  }

  return output.join("\n");
}

export function normalizeMarkdownQuizBlocks(content: string) {
  const { protectedContent, blocks } = protectCodeFences(content);
  const lines = protectedContent.split(/\r?\n/);
  const output: string[] = [];
  let index = 0;

  while (index < lines.length) {
    const heading = lines[index]?.match(/^(#{2,4})\s+(.+?)\s*$/);
    if (!heading || !quizSectionPattern.test(stripLightMarkdown(heading[2] || ""))) {
      output.push(lines[index] || "");
      index += 1;
      continue;
    }

    const headingLevel = heading[1]?.length || 2;
    const sectionName = stripLightMarkdown(heading[2] || "");
    const bodyLines: string[] = [];
    output.push(lines[index] || "");
    index += 1;

    while (index < lines.length) {
      const nextHeading = lines[index]?.match(/^(#{1,6})\s+/);
      if (nextHeading && (nextHeading[1]?.length || 6) <= headingLevel) break;
      bodyLines.push(lines[index] || "");
      index += 1;
    }

    output.push(processQuizSection(sectionName, bodyLines));
  }

  return restoreCodeFences(output.join("\n"), blocks);
}

export function normalizeMarkdownQuizSectionBody(content: string, sectionName?: string) {
  const normalizedSectionName = stripLightMarkdown(sectionName || "");
  if (!quizSectionPattern.test(normalizedSectionName)) return content;

  const { protectedContent, blocks } = protectCodeFences(content);
  const normalized = processQuizSection(normalizedSectionName, protectedContent.split(/\r?\n/));
  return restoreCodeFences(normalized, blocks);
}

function normalizeMathBody(body: string) {
  return body
    .replace(/₹/g, "\\text{Rs.}")
    .replace(/μ/g, "\\mu")
    .replace(/≤/g, "\\le")
    .replace(/≥/g, "\\ge")
    .replace(/×/g, "\\times")
    .replace(/±/g, "\\pm")
    .replace(/°/g, "^{\\circ}")
    .replace(/[–—]/g, "-")
    .replace(/•/g, "\\bullet")
    .replace(/(?<!\\)%/g, "\\%");
}

export function normalizeMathForKatex(content: string) {
  const { protectedContent, blocks } = protectCodeFences(content);
  const normalized = protectedContent
    .replace(/\$\$([\s\S]*?)\$\$/g, (_, body: string) => `$$${normalizeMathBody(body)}$$`)
    .replace(/(?<!\\)\$([^$\n]+?)(?<!\\)\$/g, (_, body: string) => `$${normalizeMathBody(body)}$`);
  return restoreCodeFences(normalized, blocks);
}

export function normalizeCurrencyDollars(content: string) {
  const { protectedContent, blocks } = protectCodeFences(content);
  const normalized = protectedContent
    .replace(/(?<!\\)\$(\d[\d,]*(?:\.\d+)?)(?![\d.])(?=(?:,(?=\s)|[.;:]|\s+(?:with|and|for|at|as|in|per|to|worth|each|if|or|which|under|after|from)\b))/gi, "&#36;$1");
  return restoreCodeFences(normalized, blocks);
}

function admonitionTitle(kind: string, rawTitle: string) {
  const label = kind.charAt(0).toUpperCase() + kind.slice(1).toLowerCase();
  const title = rawTitle.replace(/^\[(.*)\]$/, "$1").trim();
  return title ? `${label}: ${title}` : label;
}

export function normalizeDocusaurusAdmonitions(content: string) {
  const lines = content.split(/\r?\n/);
  const output: string[] = [];
  let index = 0;

  while (index < lines.length) {
    const start = lines[index]?.match(/^:::(note|tip|info|warning|danger|question|exam|summary)\s*(.*)$/i);
    if (!start) {
      output.push(lines[index] || "");
      index += 1;
      continue;
    }

    const kind = start[1] || "note";
    const rawTitle = start[2] || "";
    const body: string[] = [];
    index += 1;
    while (index < lines.length && !/^:::\s*$/.test(lines[index] || "")) {
      body.push(lines[index] || "");
      index += 1;
    }
    if (index < lines.length) index += 1;

    output.push("");
    output.push(`> **${admonitionTitle(kind, rawTitle)}**`);
    output.push(">");
    for (const line of body) output.push(line.trim() ? `> ${line}` : ">");
    output.push("");
  }

  return output.join("\n");
}

export function normalizeDetails(content: string) {
  return content.replace(/<details>\s*<summary>([\s\S]*?)<\/summary>([\s\S]*?)<\/details>/gi, (_, summary: string, body: string) => {
    const safeSummary = summary.replace(/<[^>]+>/g, "").trim();
    const quotedBody = body.trim().split(/\r?\n/).map((line) => (line.trim() ? `> ${line}` : ">")).join("\n");
    return `\n\n> **${safeSummary}**\n>\n${quotedBody}\n\n`;
  });
}

export function normalizeWikiLinks(content: string) {
  const fenced = protectCodeFences(content);
  const inline = protectInlineCode(fenced.protectedContent);
  const normalized = inline.protectedContent.replace(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g, (_match, rawTarget: string, rawLabel?: string) => {
    const target = rawTarget.trim();
    const label = (rawLabel || rawTarget).trim();
    if (!target || !label) return _match;
    return `[${label}](${target})`;
  });
  return restoreCodeFences(restoreInlineCode(normalized, inline.blocks), fenced.blocks);
}

export function normalizeQuizOptionRows(content: string) {
  const { protectedContent, blocks } = protectCodeFences(content);
  const normalized = protectedContent.replace(/<div class="quiz-options">([\s\S]*?)<\/div>/g, (_match, optionsBody: string) => {
    const normalizedOptions = optionsBody
      .replace(/<label data-opt="([a-d])">/gi, (_label, optionKey: string) => `<div class="quiz-option" data-opt="${optionKey.toLowerCase()}" role="listitem">`)
      .replace(/(<\/span>)(<span class="opt-text">)/g, "$1 $2")
      .replace(/<\/label>/g, "</div>");
    return `<div class="quiz-options" role="list">${normalizedOptions}</div>`;
  });
  return restoreCodeFences(normalized, blocks);
}

export function prepareMarkdownContent(content: string, sectionName?: string) {
  const sectionBody = normalizeMarkdownQuizSectionBody(content, sectionName);
  return normalizeMathForKatex(normalizeCurrencyDollars(normalizeQuizOptionRows(normalizeMarkdownQuizBlocks(normalizeWikiLinks(normalizeDetails(normalizeDocusaurusAdmonitions(sectionBody)))))));
}
