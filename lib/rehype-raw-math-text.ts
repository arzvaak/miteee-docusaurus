import { CURRENCY_DOLLAR_PLACEHOLDER } from "@/lib/markdown-normalize";

type HastNode = {
  type: string;
  value?: string;
  tagName?: string;
  properties?: Record<string, unknown>;
  children?: HastNode[];
};

const blockedTags = new Set(["code", "pre", "script", "style", "textarea"]);
const knownMathWords = new Set(["sin", "cos", "tan", "log", "ln", "lim", "mod", "max", "min"]);

function isEscaped(value: string, index: number) {
  let slashes = 0;
  for (let cursor = index - 1; cursor >= 0 && value[cursor] === "\\"; cursor -= 1) slashes += 1;
  return slashes % 2 === 1;
}

function findToken(value: string, token: "$" | "$$", fromIndex: number) {
  let index = value.indexOf(token, fromIndex);
  while (index >= 0) {
    const belongsToDisplay = token === "$" && (value[index - 1] === "$" || value[index + 1] === "$");
    if (!isEscaped(value, index) && !belongsToDisplay) return index;
    index = value.indexOf(token, index + 1);
  }
  return -1;
}

function balanced(value: string, opener: string, closer: string) {
  let depth = 0;
  for (let index = 0; index < value.length; index += 1) {
    if (isEscaped(value, index)) continue;
    if (value[index] === opener) depth += 1;
    if (value[index] === closer) depth -= 1;
    if (depth < 0) return false;
  }
  return depth === 0;
}

function looksLikeMath(body: string) {
  const value = body.trim();
  if (!value || !balanced(value, "{", "}") || !balanced(value, "(", ")") || !balanced(value, "[", "]")) return false;
  if (/^\d[\d,.]*\s*(?:[-–—]|to|through)\s*$/i.test(value)) return false;
  if (/^(?:[fpnumkMGTµμ]?(?:A|V|W|F|H|Hz|s|C|J|Ω)|rpm|rad|dB)$/u.test(value)) return true;
  if (/\\[A-Za-z]+|[_^={}<>]|[≤≥≈≠±×÷∑∫√∞→←↔]|[α-ωΑ-Ω]/u.test(value)) return true;

  const words = value.match(/[A-Za-z]+/g) ?? [];
  if (words.some((word) => word.length > 1 && !knownMathWords.has(word.toLowerCase()) && !/^[A-Z]{2,5}$/.test(word))) return false;
  return /^[A-Za-z0-9\s.,+\-*/%:;|&'!]+$/.test(value);
}

function pushText(nodes: HastNode[], value: string) {
  if (!value) return;
  const previous = nodes[nodes.length - 1];
  if (previous?.type === "text") previous.value = `${previous.value || ""}${value}`;
  else nodes.push({ type: "text", value });
}

function splitResidualMath(value: string) {
  const nodes: HastNode[] = [];
  let cursor = 0;

  while (cursor < value.length) {
    const inlineIndex = findToken(value, "$", cursor);
    const displayIndex = findToken(value, "$$", cursor);
    const openIndex = inlineIndex < 0
      ? displayIndex
      : displayIndex < 0
        ? inlineIndex
        : Math.min(inlineIndex, displayIndex);
    if (openIndex < 0) {
      pushText(nodes, value.slice(cursor));
      break;
    }

    pushText(nodes, value.slice(cursor, openIndex));
    const token: "$" | "$$" = value.startsWith("$$", openIndex) ? "$$" : "$";
    const closeIndex = findToken(value, token, openIndex + token.length);
    if (closeIndex < 0 || (token === "$" && /\r?\n/.test(value.slice(openIndex + 1, closeIndex)))) {
      pushText(nodes, value.slice(openIndex));
      break;
    }

    const body = value.slice(openIndex + token.length, closeIndex);
    if (looksLikeMath(body)) {
      nodes.push({
        type: "element",
        tagName: token === "$$" ? "div" : "code",
        properties: { className: [token === "$$" ? "math-display" : "math-inline"] },
        children: [{ type: "text", value: body }]
      });
      cursor = closeIndex + token.length;
      continue;
    }

    // A numeric money marker may precede a later real formula in the same text node.
    // Keep that one marker literal and let the scanner consider the later delimiter.
    if (token === "$" && /^\s*\d/.test(body)) {
      pushText(nodes, token);
      cursor = openIndex + token.length;
      continue;
    }

    pushText(nodes, value.slice(openIndex, closeIndex + token.length));
    cursor = closeIndex + token.length;
  }

  return nodes;
}

function classNames(node: HastNode) {
  const value = node.properties?.className;
  if (Array.isArray(value)) return value.map(String);
  if (typeof value === "string") return value.split(/\s+/);
  return [];
}

function restoreCurrencyDollars(node: HastNode) {
  if (node.type === "text" && node.value?.includes(CURRENCY_DOLLAR_PLACEHOLDER)) {
    node.value = node.value.replaceAll(CURRENCY_DOLLAR_PLACEHOLDER, "$");
  }
  node.children?.forEach(restoreCurrencyDollars);
}

function transformChildren(node: HastNode, blocked = false) {
  if (!node.children) return;
  const classes = classNames(node);
  const isBlocked = blocked
    || blockedTags.has(node.tagName || "")
    || classes.some((name) => name === "katex" || name === "math-inline" || name === "math-display");
  if (isBlocked) {
    restoreCurrencyDollars(node);
    return;
  }

  node.children = node.children.flatMap((child) => {
    if (child.type === "text") {
      const pieces = child.value?.includes("$") ? splitResidualMath(child.value) : [child];
      pieces.forEach(restoreCurrencyDollars);
      return pieces;
    }
    transformChildren(child, false);
    return [child];
  });
}

export function rehypeRawMathText() {
  return (tree: HastNode) => {
    transformChildren(tree);
  };
}
