export type HeadingAnchorInput = {
  level: number;
  text: string;
};

export type HeadingAnchor = HeadingAnchorInput & {
  id: string;
};

export function headingAnchorId(value: string) {
  const normalized = value
    .toLowerCase()
    .replace(/[`*_~[\](){}|>"']/g, " ")
    .replace(/&/g, " and ")
    .replace(/[\^=+*/\\]/g, "")
    .replace(/[^a-z0-9\s-]/g, " ")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
  return normalized || "section";
}

export function uniqueHeadingAnchorId(value: string, seen: Map<string, number>) {
  const base = headingAnchorId(value);
  const count = (seen.get(base) ?? 0) + 1;
  seen.set(base, count);
  return count === 1 ? base : `${base}-${count}`;
}

export function buildHeadingAnchors(headings: HeadingAnchorInput[], limit = 18): HeadingAnchor[] {
  const seen = new Map<string, number>();
  const anchors: HeadingAnchor[] = [];
  for (const heading of headings) {
    if (heading.level < 2 || heading.level > 4) continue;
    const text = heading.text.trim();
    if (!text) continue;
    const id = uniqueHeadingAnchorId(text, seen);
    if (heading.level === 4) continue;
    anchors.push({ ...heading, text, id });
    if (anchors.length >= limit) break;
  }
  return anchors;
}

export function isQuestionHeading(value: string) {
  const normalized = value
    .replace(/^[^a-z0-9]+/i, "")
    .replace(/[`*_~]/g, "")
    .trim();
  return /^(?:question|ques(?:tion)?|q)\s*(?:(?:no|number)\.?\s*)?(?:[#.:/-]\s*)?\d+\b/i.test(normalized);
}

export function buildQuestionAnchors(headings: HeadingAnchorInput[], limit = 400): HeadingAnchor[] {
  const seen = new Map<string, number>();
  const anchors: HeadingAnchor[] = [];
  for (const heading of headings) {
    if (heading.level < 2 || heading.level > 4) continue;
    const text = heading.text.trim();
    if (!text) continue;
    const id = uniqueHeadingAnchorId(text, seen);
    if ((heading.level === 2 || heading.level === 3) && isQuestionHeading(text)) {
      anchors.push({ ...heading, text, id });
      if (anchors.length >= limit) break;
    }
  }
  return anchors;
}
