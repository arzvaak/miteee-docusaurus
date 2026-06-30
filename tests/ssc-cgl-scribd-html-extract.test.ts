import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";

const root = process.cwd();
const scriptPath = path.join(root, "scripts", "ssc_cgl_scribd_html_extract.py");

test("SSC CGL Scribd extractor decodes page JSONP as English-only text with diagram references", () => {
  const snippet = [
    'window.page10_callback(["',
    '<div class=\\"newpage\\" id=\\"page10\\">',
    '<div class=\\"text_layer\\">',
    '<span>Q. 61. Select the mirror image of the given figure.</span>',
    '<span>दिए गए चित्र का दर्पण प्रतिबिंब चुनिए।</span>',
    '<span>(a) Figure A</span><span>(b) Figure B</span><span>(c) Figure C</span><span>(d) Figure D</span>',
    '<span>Sol. 61. (c)</span>',
    '</div>',
    '<img class=\\"absimg\\" orig=\\"https://html.scribdassets.com/book/images/page_10_image_1.webp\\" />',
    '</div>',
    '"]);'
  ].join("");

  const payload = execFileSync("python", [
    "-c",
    [
      "import importlib.util, json, pathlib, sys",
      `spec = importlib.util.spec_from_file_location("scribd_extract", ${JSON.stringify(scriptPath)})`,
      "module = importlib.util.module_from_spec(spec)",
      "sys.modules[spec.name] = module",
      "spec.loader.exec_module(module)",
      `html = module.extract_page_html_from_jsonp(${JSON.stringify(snippet)})`,
      "result = module.scribd_page_html_to_text(html, 10, image_root=None, source_url='https://example.test/pages/10-demo.jsonp')",
      "print(json.dumps({'text': result.text, 'images': result.images, 'signals': result.question_signals}, ensure_ascii=False))"
    ].join("; ")
  ], { cwd: root, encoding: "utf8" });

  const result = JSON.parse(payload) as { text: string; images: Array<{ url: string }>; signals: number };
  assert.match(result.text, /Q\. 61\. Select the mirror image/i);
  assert.match(result.text, /\(d\) Figure D/);
  assert.match(result.text, /Sol\. 61\. \(c\)/);
  assert.match(result.text, /!\[page-010-image-1\]\(https:\/\/html\.scribdassets\.com\/book\/images\/page_10_image_1\.webp\)/);
  assert.doesNotMatch(result.text, /दिए गए/);
  assert.equal(result.images.length, 1);
  assert.equal(result.signals >= 2, true);
});

test("SSC CGL Scribd extractor writes chunked OCR-style reports for local cached pages", () => {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "ssc-cgl-scribd-html-"));
  const sourcePath = path.join(tempRoot, "PINNACLE SSC REASONING.htm");
  const cacheRoot = path.join(tempRoot, "cache");
  const outputRoot = path.join(tempRoot, "book-html");
  fs.mkdirSync(cacheRoot, { recursive: true });

  const pageUrl1 = "https://html.scribdassets.com/demo/pages/1-a.jsonp";
  const pageUrl2 = "https://html.scribdassets.com/demo/pages/2-b.jsonp";
  fs.writeFileSync(sourcePath, [
    "<html><body>",
    `<div id="outer_page_1"></div><script src="${pageUrl1}"></script>`,
    `<div id="outer_page_2"></div><script src="${pageUrl2}"></script>`,
    "</body></html>"
  ].join("\n"), "utf8");

  const cachedName1 = Buffer.from(pageUrl1).toString("base64url") + ".jsonp";
  const cachedName2 = Buffer.from(pageUrl2).toString("base64url") + ".jsonp";
  fs.writeFileSync(path.join(cacheRoot, cachedName1), 'window.page1_callback(["<span>Q. 1. Find the odd one out.</span><span>(a) Apple</span><span>(b) Mango</span><span>(c) Carrot</span><span>(d) Banana</span>"]);', "utf8");
  fs.writeFileSync(path.join(cacheRoot, cachedName2), 'window.page2_callback(["<span>Q. 2. Select the figure.</span><span>चित्र चुनिए।</span><img orig=\\"https://html.scribdassets.com/demo/image.webp\\" /><span>(a) A</span><span>(b) B</span><span>(c) C</span><span>(d) D</span>"]);', "utf8");

  execFileSync("python", [
    scriptPath,
    "--source-file", sourcePath,
    "--source-id", "pinnacle-ssc-reasoning",
    "--start-page", "1",
    "--end-page", "2",
    "--cache-root", cacheRoot,
    "--output-root", outputRoot
  ], { cwd: root, stdio: "pipe" });

  const reportPath = path.join(outputRoot, "pinnacle-ssc-reasoning", "scribd-html-p001-p002", "extraction-report.json");
  const report = JSON.parse(fs.readFileSync(reportPath, "utf8")) as {
    sourceId: string;
    sourceType: string;
    chapterSlug: string;
    extractionStatus: string;
    reviewStatus: string;
    languagePolicy: string;
    pageCount: number;
    pages: Array<{ pageNumber: number; textPath: string; extractionMethod: string; questionSignals: number }>;
  };

  assert.equal(report.sourceId, "pinnacle-ssc-reasoning");
  assert.equal(report.sourceType, "book_user_provided");
  assert.equal(report.chapterSlug, "scribd-html");
  assert.equal(report.extractionStatus, "text_extracted");
  assert.equal(report.reviewStatus, "needs_segmentation_review");
  assert.equal(report.languagePolicy, "english_only");
  assert.equal(report.pageCount, 2);
  assert.deepEqual(report.pages.map((page) => page.pageNumber), [1, 2]);
  assert.ok(report.pages.every((page) => page.extractionMethod === "scribd_html_jsonp"));
  assert.ok(report.pages.every((page) => page.questionSignals >= 1));

  const secondPageText = fs.readFileSync(report.pages[1]!.textPath, "utf8");
  assert.match(secondPageText, /Select the figure/);
  assert.match(secondPageText, /!\[page-002-image-1\]/);
  assert.doesNotMatch(secondPageText, /चित्र/);
});
