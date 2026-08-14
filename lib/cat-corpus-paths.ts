import fs from "node:fs";
import path from "node:path";

const relativeImportsRoot = path.join("data", "exams", "cat", "quant", "book-imports");

function clean(value: string | undefined) {
  return value?.trim() || "";
}

function localArtifactsRoot(root: string) {
  return path.join(path.parse(path.resolve(root)).root, "MITEEE_LOCAL_ARTIFACTS", "cat-quant-corpus", "book-imports");
}

export function getCatQuantBookImportsRoot(root = process.cwd()) {
  const explicitQuestions = clean(process.env.CAT_QUANT_BOOK_QUESTIONS_PATH);
  if (explicitQuestions && fs.existsSync(explicitQuestions)) return path.dirname(explicitQuestions);

  const candidates = [
    clean(process.env.CAT_QUANT_BOOK_IMPORTS_ROOT),
    clean(process.env.MITEEE_LOCAL_ARTIFACTS)
      ? path.join(clean(process.env.MITEEE_LOCAL_ARTIFACTS), "cat-quant-corpus", "book-imports")
      : "",
    localArtifactsRoot(root),
    path.join(root, relativeImportsRoot)
  ].filter(Boolean);

  return candidates.find((candidate) => fs.existsSync(path.join(candidate, "questions.json")))
    ?? path.join(root, relativeImportsRoot);
}

export function getCatQuantQuestionsPath(root = process.cwd()) {
  return clean(process.env.CAT_QUANT_BOOK_QUESTIONS_PATH)
    || path.join(getCatQuantBookImportsRoot(root), "questions.json");
}
