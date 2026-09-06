import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkMath from 'remark-math';
import katex from 'katex';
import { getSscQuantBookChapters } from '../lib/ssc-quant-book';

test('book reading covers every chapter page with valid local figures and renderable mathematics', () => {
  const chapters = getSscQuantBookChapters();
  assert.equal(chapters.length, 20);
  let equations = 0;
  for (const chapter of chapters) {
    assert.ok(chapter.readingSections?.length, chapter.slug);
    const pages = new Set<number>();
    for (const section of chapter.readingSections!) {
      for (let p = section.pdfPageStart!; p <= section.pdfPageEnd!; p++) pages.add(p);
      assert.doesNotMatch(section.content, /box_2d|\uFFFD/);
      const tree = unified().use(remarkParse).use(remarkMath).parse(section.content);
      function visit(node: { type: string; value?: string; url?: string; children?: typeof tree.children }) {
        if (node.type === 'math' || node.type === 'inlineMath') {
          equations++;
          assert.doesNotThrow(() => katex.renderToString(node.value!, { throwOnError: true, strict: 'ignore' }), `${chapter.slug}: ${section.title}`);
        }
        if (node.type === 'image') assert.ok(fs.existsSync(`public${node.url}`), node.url);
        node.children?.forEach(visit);
      }
      visit(tree);
    }
    for (let p = chapter.pdfPageStart; p <= chapter.pdfPageEnd; p++) assert.ok(pages.has(p), `${chapter.slug}: page ${p} missing`);
  }
  assert.ok(equations > 2500);
});

test('mixture examples retain cross-page solutions and reviewed corrections', () => {
  const sections = getSscQuantBookChapters().find(c => c.slug === 'mixture-and-alligation')!.readingSections!;
  const population = sections.find(s => s.title.includes('Population growth'))!;
  assert.match(population.content, /4000/);
  assert.equal(population.pdfPageStart, 75);
  assert.equal(population.pdfPageEnd, 76);
  const animals = sections.find(s => s.title === 'Head-and-leg problems')!;
  assert.ok(animals.content.includes('\\frac{L - (H \\times b)}{a - b}'));
  assert.match(animals.content, /Correction/);
  const replacement = sections.find(s => s.title.includes('Replacing juice four times'))!;
  assert.ok(!replacement.content.includes('\\frac{x}{1}'));
  assert.match(replacement.content, /65.61/);
});
