import json
import sys
import tempfile
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from upsc_political_science import (
    NCERT_SOURCES,
    build_quiz_block,
    ensure_generation_metadata,
    is_fallback_content,
    repair_generated_content,
    render_book_index,
    render_chapter_page,
    slugify,
    validate_generated_section,
)


class UpscPoliticalScienceTests(unittest.TestCase):
    def test_catalog_covers_classes_9_to_12_with_hybrid_sources(self):
        classes = {source.class_level for source in NCERT_SOURCES}
        self.assertEqual(classes, {9, 10, 11, 12})

        source_names = {source.source_name for source in NCERT_SOURCES}
        self.assertIn("NCERT", source_names)
        self.assertIn("Drishti IAS", source_names)

        chapter_keys = {(source.class_level, source.book_slug, source.chapter_number) for source in NCERT_SOURCES}
        self.assertIn((9, "democratic-politics-i", 1), chapter_keys)
        self.assertIn((10, "democratic-politics-ii", 8), chapter_keys)
        self.assertIn((11, "indian-constitution-at-work", 10), chapter_keys)
        self.assertIn((12, "politics-in-india-since-independence", 8), chapter_keys)

    def test_slugify_is_stable_for_ncert_titles(self):
        self.assertEqual(slugify("Class 10: Democratic Politics-II"), "class-10-democratic-politics-ii")
        self.assertEqual(slugify("Constitution: Why and How?"), "constitution-why-and-how")

    def test_build_quiz_block_renders_existing_docusaurus_markup(self):
        block = build_quiz_block(
            number=1,
            tag="UPSC Prelims 2023",
            question="Which feature is basic to federalism?",
            options=[
                {"label": "a", "text": "Single government"},
                {"label": "b", "text": "Two or more levels of government"},
                {"label": "c", "text": "No written constitution"},
                {"label": "d", "text": "No courts"},
            ],
            answer="b",
            explanation="Federalism divides power between levels of government.",
        )
        self.assertIn('<div class="quiz-block mcq', block)
        self.assertIn('data-answer="b"', block)
        self.assertIn('<span class="opt-key">B</span>', block)
        self.assertIn("AI-generated study aid", block)

    def test_render_book_index_links_to_numbered_chapter_files(self):
        sources = [source for source in NCERT_SOURCES if source.class_level == 9 and source.book_slug == "democratic-politics-i"]
        page = render_book_index(9, "democratic-politics-i", sources)

        self.assertIn("[1. What is Democracy? Why Democracy?](./01-what-is-democracy-why-democracy)", page)
        self.assertIn("[5. Democratic Rights](./05-democratic-rights)", page)

    def test_render_chapter_page_adds_deep_revision_sections_from_metadata(self):
        source = next(source for source in NCERT_SOURCES if source.title == "Federalism" and source.class_level == 10)
        page = render_chapter_page(
            source,
            {
                "summary": "Federalism divides authority across levels of government.",
                "key_concepts": ["federalism", "centre state", "local government"],
                "upsc_relevance": "Useful for Centre-State questions.",
                "topic_notes": [{"heading": "Core NCERT Argument", "body": "Power is shared vertically."}],
                "prelims": [],
                "mains": [],
            },
        )

        self.assertIn("## Exam Orientation", page)
        self.assertIn("General Studies II", page)
        self.assertIn("## High-Yield Facts", page)
        self.assertIn("federalism", page)
        self.assertIn("## Prelims Traps", page)
        self.assertIn("Do not treat NCERT examples as exhaustive lists.", page)
        self.assertIn("## Mains Framing", page)
        self.assertIn("## Answer Framework Bank", page)
        self.assertIn("Use when the question asks you to define", page)
        self.assertIn("Dimensions to cover:", page)
        self.assertIn("## Current-Affairs Bridge", page)
        self.assertIn("without inventing a current fact", page)
        self.assertIn("## Revision Ladder", page)
        self.assertIn("- [ ] Explain the chapter title", page)
        self.assertIn("## UPSC Expansion Drills", page)
        self.assertIn("### Mains Answer Scaffold", page)
        self.assertIn("### Prelims Trap Check", page)
        self.assertIn("### Key Term Anchors", page)
        self.assertIn("### Comparison Prompt", page)
        self.assertIn("### Weakness Repair Drill", page)
        self.assertIn("Federalism", page)

    def test_generation_metadata_marks_deepseek_and_fallback_outputs(self):
        deepseek = ensure_generation_metadata({}, "deepseek", "deepseek-v4-pro")
        self.assertEqual(deepseek["generation"]["provider"], "deepseek")
        self.assertFalse(is_fallback_content(deepseek))

        fallback = {
            "topic_notes": [
                {"heading": "Core NCERT Argument", "body": "Summary"},
                {"heading": "Revision Hooks", "body": "Hooks"},
            ]
        }
        self.assertTrue(is_fallback_content(fallback))

    def test_repair_generated_content_backfills_missing_prelims_from_pyqs(self):
        source = NCERT_SOURCES[0]
        content = {"prelims": [], "mains": []}
        pyqs = {
            "prelims": [
                {
                    "year": 2024,
                    "paper_title": "Prelims GS I",
                    "number": "1",
                    "text": "Which statement best describes democracy?",
                    "options": [
                        {"label": "a", "text": "Rule by elected representatives"},
                        {"label": "b", "text": "Rule by one person"},
                    ],
                }
            ],
            "mains": [
                {
                    "year": 2023,
                    "paper_title": "GS II",
                    "number": "2",
                    "text": "Discuss democratic accountability.",
                }
            ],
        }
        repaired = repair_generated_content(content, source, pyqs)
        self.assertEqual(repaired["prelims"][0]["answer"], "a")
        self.assertIn("AI-generated study aid", repaired["prelims"][0]["explanation"])
        self.assertEqual(repaired["mains"][0]["tag"], "UPSC Mains 2023")

    def test_validate_generated_section_checks_manifest_pages_and_quizzes(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            docs = root / "docs" / "upsc-cse" / "political-science"
            raw = root / "output" / "upsc_ncert" / "political_science" / "raw"
            ocr = root / "output" / "upsc_ncert" / "political_science" / "ocr"
            generated = root / "output" / "upsc_ncert" / "political_science" / "generated"
            raw.mkdir(parents=True)
            ocr.mkdir(parents=True)
            generated.mkdir(parents=True)
            docs.mkdir(parents=True)

            pdf_path = raw / "chapter.pdf"
            pdf_path.write_bytes(b"%PDF-1.4\n%fixture\n")
            ocr_path = ocr / "chapter.json"
            ocr_path.write_text(json.dumps({"pages": [{"markdown": "Power sharing chapter"}]}), encoding="utf-8")
            generated_path = generated / "chapter.json"
            generated_path.write_text(
                json.dumps(
                    {
                        "summary": "Power sharing reduces social conflict.",
                        "key_concepts": ["federalism", "power sharing"],
                        "upsc_relevance": "Useful for GS II.",
                        "topic_notes": [
                            {
                                "heading": "Core NCERT Argument",
                                "body": (
                                    "Power sharing reduces the risk that one social group or institution can dominate the whole political system. "
                                    "For UPSC notes, the chapter should be revised as a constitutional design problem: identify where authority is located, "
                                    "which institution checks it, how citizens experience the arrangement, and what limitation remains in practice. "
                                    "A strong answer should connect vertical sharing between Union, State, and local bodies with horizontal sharing among "
                                    "legislature, executive, and judiciary. It should also keep NCERT examples separate from exhaustive constitutional lists, "
                                    "because Prelims can test whether a familiar example has been overstated. In Mains, the same material becomes a framework "
                                    "for discussing federalism, decentralisation, democratic accountability, and cooperative governance."
                                ),
                            }
                        ],
                        "answer_frameworks": [
                            "Use when the question asks you to define power sharing: definition, source anchor, example, limitation, and balanced way forward.",
                            "Dimensions to cover: institutional design, citizen impact, democratic accountability.",
                            "Contrast frame: distinguish power sharing from adjacent ideas and show the consequence of confusing them.",
                            "Practice conversion: turn one Prelims trap into a 150-word Mains paragraph.",
                        ],
                        "expansion_drills": [
                            {
                                "heading": "Mains Answer Scaffold",
                                "body": "Build the answer as definition, NCERT anchor, institutional dimension, citizen impact, limitation, and way forward.",
                            },
                            {
                                "heading": "Prelims Trap Check",
                                "body": "Convert familiar examples into true-or-false statements and test qualifiers before accepting them.",
                            },
                            {
                                "heading": "Key Term Anchors",
                                "body": "Keep one precise definition, one NCERT usage, and one polity linkage for each repeated term.",
                            },
                            {
                                "heading": "Comparison Prompt",
                                "body": "Compare power sharing with adjacent concepts by basis, institution, effect, and limitation.",
                            },
                            {
                                "heading": "Weakness Repair Drill",
                                "body": "After a wrong answer, classify the error as definition, scope, example, institution, or conclusion.",
                            },
                        ],
                        "prelims": [
                            {
                                "question": "Which feature supports federalism?",
                                "answer": "a",
                                "options": [{"label": "a", "text": "Division of powers"}, {"label": "b", "text": "Unitary rule"}],
                                "explanation": "AI-generated study aid.",
                            }
                        ],
                        "mains": [{"prompt": "Discuss power sharing.", "outline": "Define and balance."}],
                        "generation": {"provider": "deepseek", "model": "deepseek-v4-pro"},
                        "metadata": {"id": "fixture"},
                    }
                ),
                encoding="utf-8",
            )
            page_path = docs / "chapter.md"
            page_path.write_text(
                "---\ntitle: Chapter\n---\n"
                "# Chapter\n"
                "## Exam Orientation\n"
                "- General Studies II anchor.\n"
                "## High-Yield Facts\n"
                "- Source anchor.\n"
                "## Prelims Traps\n"
                "- Do not overread examples.\n"
                "## Mains Framing\n"
                "- Define and balance.\n"
                "## Answer Framework Bank\n"
                "- Use when the question asks you to define power sharing: definition, source anchor, example, limitation, and balanced way forward.\n"
                "- Dimensions to cover: institutional design, citizen impact, democratic accountability.\n"
                "- Contrast frame: distinguish power sharing from adjacent ideas and show the consequence of confusing them.\n"
                "- Practice conversion: turn one Prelims trap into a 150-word Mains paragraph.\n"
                "## UPSC Expansion Drills\n"
                "### Mains Answer Scaffold\n"
                "Build the answer as definition, NCERT anchor, institutional dimension, citizen impact, limitation, and way forward.\n"
                "### Prelims Trap Check\n"
                "Convert familiar examples into true-or-false statements and test qualifiers before accepting them.\n"
                "### Key Term Anchors\n"
                "Keep one precise definition, one NCERT usage, and one polity linkage for each repeated term.\n"
                "### Comparison Prompt\n"
                "Compare power sharing with adjacent concepts by basis, institution, effect, and limitation.\n"
                "### Weakness Repair Drill\n"
                "After a wrong answer, classify the error as definition, scope, example, institution, or conclusion.\n"
                "## Current-Affairs Bridge\n"
                "- Map news to static concepts without inventing facts.\n"
                "## Revision Ladder\n"
                "- [ ] Explain the chapter.\n"
                "## Extended Revision Notes\n"
                "Power sharing reduces the risk that one social group or institution can dominate the whole political system. "
                "For UPSC notes, the chapter should be revised as a constitutional design problem: identify where authority is located, "
                "which institution checks it, how citizens experience the arrangement, and what limitation remains in practice. "
                "A strong answer should connect vertical sharing between Union, State, and local bodies with horizontal sharing among "
                "legislature, executive, and judiciary. It should also keep NCERT examples separate from exhaustive constitutional lists, "
                "because Prelims can test whether a familiar example has been overstated. In Mains, the same material becomes a framework "
                "for discussing federalism, decentralisation, democratic accountability, and cooperative governance. "
                "The student should prepare one definition, one constitutional linkage, one governance example, one limitation, and one reform point. "
                "This prevents the notes from becoming only a list of facts and turns the chapter into reusable answer material for GS II. "
                "A revision pass should also test whether the learner can explain the difference between formal constitutional provisions and political practice. "
                "That distinction is central to UPSC questions because the exam often asks whether institutions work as designed, where friction appears, "
                "and how cooperative mechanisms can restore trust without weakening accountability.\n"
                "## Prelims Drill\n"
                "<div class=\"quiz-block mcq\" data-answer=\"a\">"
                "<div class=\"quiz-options\"><label data-opt=\"a\"><span class=\"opt-key\">A</span> A</label></div>"
                "<details class=\"quiz-exp\"><summary>Show Answer</summary><div class=\"quiz-exp-body\">AI-generated study aid.</div></details>"
                "</div>\n"
                "## Mains Answer Practice\n"
                "### Mains Prompt 1\n"
                "> Explain power sharing.\n",
                encoding="utf-8",
            )
            manifest = {
                "sources": [
                    {
                        "id": "fixture",
                        "raw_pdf_path": str(pdf_path),
                        "ocr_json_path": str(ocr_path),
                        "generated_json_path": str(generated_path),
                        "doc_path": str(page_path),
                    }
                ]
            }
            manifest_path = root / "manifest.json"
            manifest_path.write_text(json.dumps(manifest), encoding="utf-8")

            report = validate_generated_section(manifest_path)
            self.assertEqual(report["issue_count"], 0, report["issues"])
            self.assertEqual(report["source_count"], 1)

    def test_validate_generated_section_reports_generated_json_drift(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            generated_path = root / "generated.json"
            generated_path.write_text(
                json.dumps(
                    {
                        "summary": "Incomplete chapter.",
                        "key_concepts": [],
                        "topic_notes": [],
                        "prelims": [{"question": "Broken", "answer": "", "options": []}],
                        "mains": [],
                        "metadata": {"id": "wrong-id"},
                    }
                ),
                encoding="utf-8",
            )
            manifest_path = root / "manifest.json"
            manifest_path.write_text(json.dumps({"sources": [{"id": "fixture", "generated_json_path": str(generated_path)}]}), encoding="utf-8")

            report = validate_generated_section(manifest_path)
            issues = {issue["issue"] for issue in report["issues"]}

            self.assertIn("missing generation metadata", issues)
            self.assertIn("metadata id does not match manifest id", issues)
            self.assertIn("generated JSON has no key concepts", issues)
            self.assertIn("generated JSON has no topic notes", issues)
            self.assertIn("generated JSON has no valid prelims", issues)
            self.assertIn("generated JSON has no mains prompts", issues)

    def test_validate_generated_section_rejects_tiny_notes_without_framework_bank(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            generated_path = root / "generated.json"
            page_path = root / "chapter.md"
            generated_path.write_text(
                json.dumps(
                    {
                        "summary": "Tiny.",
                        "key_concepts": ["federalism"],
                        "upsc_relevance": "Tiny.",
                        "topic_notes": [{"heading": "Only", "body": "Too short."}],
                        "prelims": [{"question": "Question?", "answer": "a", "options": [{"label": "a", "text": "A"}, {"label": "b", "text": "B"}]}],
                        "mains": [{"prompt": "Discuss.", "outline": "Tiny."}],
                        "generation": {"provider": "deepseek", "model": "deepseek-v4-pro"},
                        "metadata": {"id": "fixture"},
                    }
                ),
                encoding="utf-8",
            )
            page_path.write_text(
                "---\ntitle: Chapter\n---\n"
                "# Chapter\n"
                "## Exam Orientation\n- General Studies II.\n"
                "## High-Yield Facts\n- Fact.\n"
                "## Prelims Traps\n- Trap.\n"
                "## Mains Framing\n- Frame.\n"
                "## Current-Affairs Bridge\n- Bridge without inventing a current fact.\n"
                "## Revision Ladder\n- [ ] Revise.\n"
                "## Prelims Drill\n<div class=\"quiz-block mcq\" data-answer=\"a\">AI-generated study aid</div>\n"
                "## Mains Answer Practice\n### Mains Prompt 1\n> Discuss.\n",
                encoding="utf-8",
            )
            manifest_path = root / "manifest.json"
            manifest_path.write_text(
                json.dumps(
                    {
                        "sources": [
                            {
                                "id": "fixture",
                                "generated_json_path": str(generated_path),
                                "doc_path": str(page_path),
                            }
                        ]
                    }
                ),
                encoding="utf-8",
            )

            report = validate_generated_section(manifest_path)
            issues = {issue["issue"] for issue in report["issues"]}

            self.assertIn("generated JSON topic notes are too thin", issues)
            self.assertIn("generated doc is too short for UPSC mastery notes", issues)
            self.assertIn("missing ## Answer Framework Bank section", issues)
            self.assertIn("generated JSON has no expansion drills", issues)
            self.assertIn("missing ## UPSC Expansion Drills section", issues)


if __name__ == "__main__":
    unittest.main()
