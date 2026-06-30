import fs from "node:fs";
import path from "node:path";

const bookImportsRelativePath = path.join("data", "exams", "ssc-cgl", "book-imports");
const localArtifactsFolderName = "MITEEE_LOCAL_ARTIFACTS";
const sscCorpusFolderName = "ssc-cgl-corpus";

function cleanPath(value: string | undefined) {
  return value?.trim() || "";
}

function defaultLocalArtifactsRoot(root: string) {
  const parsed = path.parse(path.resolve(root));
  return path.join(parsed.root, localArtifactsFolderName);
}

export function getSscCglBookImportsRoot(root = process.cwd()) {
  const explicitQuestionsPath = cleanPath(process.env.SSC_CGL_BOOK_QUESTIONS_PATH);
  if (explicitQuestionsPath && fs.existsSync(explicitQuestionsPath)) {
    return path.dirname(explicitQuestionsPath);
  }

  const candidates = [
    cleanPath(process.env.SSC_CGL_BOOK_IMPORTS_ROOT),
    cleanPath(process.env.MITEEE_LOCAL_ARTIFACTS)
      ? path.join(cleanPath(process.env.MITEEE_LOCAL_ARTIFACTS), sscCorpusFolderName, "book-imports")
      : "",
    path.join(defaultLocalArtifactsRoot(root), sscCorpusFolderName, "book-imports"),
    path.join(root, bookImportsRelativePath)
  ].filter(Boolean);

  for (const candidate of candidates) {
    if (fs.existsSync(path.join(candidate, "questions.json"))) return candidate;
  }

  return path.join(root, bookImportsRelativePath);
}

export function getSscCglBookQuestionsPath(root = process.cwd()) {
  const explicitQuestionsPath = cleanPath(process.env.SSC_CGL_BOOK_QUESTIONS_PATH);
  if (explicitQuestionsPath) return explicitQuestionsPath;
  return path.join(getSscCglBookImportsRoot(root), "questions.json");
}

export function getSscCglBookImportFile(fileName: string, root = process.cwd()) {
  return path.join(getSscCglBookImportsRoot(root), fileName);
}
