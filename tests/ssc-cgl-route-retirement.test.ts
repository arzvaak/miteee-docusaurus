import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const root = process.cwd();

test("SSC CGL topic URLs permanently redirect to topic practice", () => {
  const source = fs.readFileSync(
    path.join(root, "app", "exams", "ssc-cgl", "topics", "[slug]", "page.tsx"),
    "utf8"
  );

  assert.match(source, /import \{ permanentRedirect \} from "next\/navigation"/);
  assert.match(source, /permanentRedirect\(`\/exams\/ssc-cgl\/practice\/\$\{slug\}`\)/);
  assert.doesNotMatch(source, /SscTopicStudyPage|getSscTopic|getSscTopics/);
});

test("SSC CGL note URLs permanently redirect without requiring retired note data", () => {
  const source = fs.readFileSync(path.join(root, "app", "notes", "[slug]", "page.tsx"), "utf8");

  assert.match(source, /function legacySscPracticeHref\(slug: string\)/);
  assert.match(source, /permanentRedirect\(legacyPracticeHref\)/);
  assert.match(source, /return `\/exams\/ssc-cgl\/practice\/\$\{topicSlug\}`/);
  assert.doesNotMatch(source, /\bredirect\(/);
});

test("sitemap advertises SSC CGL practice routes, not retired topic readers", () => {
  const source = fs.readFileSync(path.join(root, "app", "sitemap.ts"), "utf8");

  assert.match(source, /`\$\{SITE_URL\}\/exams\/ssc-cgl\/practice\/\$\{topic\.slug\}`/);
  assert.doesNotMatch(source, /`\$\{SITE_URL\}\/exams\/ssc-cgl\/topics\/\$\{topic\.slug\}`/);
});

test("retired SSC CGL Markdown note sources are absent", () => {
  const docsRoot = path.join(root, "docs", "ssc-cgl");
  const markdownFiles: string[] = [];
  if (fs.existsSync(docsRoot)) {
    const walk = (directory: string) => {
      for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
        const fullPath = path.join(directory, entry.name);
        if (entry.isDirectory()) walk(fullPath);
        else if (/\.md$/i.test(entry.name)) markdownFiles.push(fullPath);
      }
    };
    walk(docsRoot);
  }
  assert.deepEqual(markdownFiles, []);
});
