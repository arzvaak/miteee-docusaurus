"""Build the SSC CGL book-PYQ corpus blueprint.

The uploaded books are treated as the active PYQ corpus for this study system.
This script summarizes the promoted question rows so DeepSeek note prompts and
human planning can follow the actual chapter/topic distribution instead of a
generic syllabus list.
"""

from __future__ import annotations

import argparse
import json
import os
from collections import Counter, defaultdict
from datetime import datetime, timezone
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[1]
DEFAULT_MANIFEST_PATH = ROOT / "data" / "exams" / "ssc-cgl" / "book-sources" / "manifest.json"
DEFAULT_MATHS_CHAPTERS_PATH = ROOT / "data" / "exams" / "ssc-cgl" / "book-sources" / "ssc-maths-6800-chapters.json"
DEFAULT_OUTPUT_JSON = ROOT / "data" / "exams" / "ssc-cgl" / "book-imports" / "corpus-blueprint.json"
DEFAULT_OUTPUT_MD = ROOT / "data" / "exams" / "ssc-cgl" / "internal-docs" / "book-corpus-blueprint.md"


def default_questions_path() -> Path:
    explicit_path = os.environ.get("SSC_CGL_BOOK_QUESTIONS_PATH", "").strip()
    if explicit_path:
        return Path(explicit_path)
    explicit_root = os.environ.get("SSC_CGL_BOOK_IMPORTS_ROOT", "").strip()
    if explicit_root:
        return Path(explicit_root) / "questions.json"
    artifacts_root = os.environ.get("MITEEE_LOCAL_ARTIFACTS", "").strip()
    candidates: list[Path] = []
    if artifacts_root:
        candidates.append(Path(artifacts_root) / "ssc-cgl-corpus" / "book-imports" / "questions.json")
    candidates.extend([
        Path(ROOT.anchor) / "MITEEE_LOCAL_ARTIFACTS" / "ssc-cgl-corpus" / "book-imports" / "questions.json",
        ROOT / "data" / "exams" / "ssc-cgl" / "book-imports" / "questions.json",
    ])
    for candidate in candidates:
        if candidate.exists():
            return candidate
    return candidates[-1]


DEFAULT_QUESTIONS_PATH = default_questions_path()

SECTION_TITLES = {
    "reasoning": "General Intelligence and Reasoning",
    "general-awareness": "General Awareness",
    "quantitative-aptitude": "Quantitative Aptitude",
    "english-comprehension": "English Comprehension",
}

EXPECTED_SOURCE_COUNTS = {
    "pinnacle-ssc-english": 6125,
    "pinnacle-ssc-general-studies": 6658,
}


def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def load_questions(path: Path) -> list[dict[str, Any]]:
    payload = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(payload, list):
        raise ValueError(f"expected a list of questions in {path}")
    return [item for item in payload if isinstance(item, dict)]


def load_json_object(path: Path) -> dict[str, Any]:
    try:
        payload = json.loads(path.read_text(encoding="utf-8"))
    except FileNotFoundError:
        return {}
    return payload if isinstance(payload, dict) else {}


def text_value(value: object) -> str:
    return str(value or "").strip()


def note_priority(count: int, section: str) -> str:
    if count >= 500:
        return "200-200-dominant-repeat-area"
    if count >= 200:
        return "200-200-high-yield"
    if section == "quantitative-aptitude" and count < 75:
        return "200-200-coverage-gap"
    if count < 60:
        return "200-200-coverage-gap"
    return "200-200-standard"


def expected_counts_from_sources(manifest_path: Path, maths_chapters_path: Path) -> dict[str, int]:
    counts = dict(EXPECTED_SOURCE_COUNTS)
    maths_chapters = load_json_object(maths_chapters_path)
    maths_source_id = text_value(maths_chapters.get("sourceId") or "ssc-maths-6800-mcq")
    supplement_counts: dict[str, int] = {}
    supplements = maths_chapters.get("supplementalQuestionSources")
    if isinstance(supplements, list):
        for supplement in supplements:
            if not isinstance(supplement, dict):
                continue
            source_id = text_value(supplement.get("sourceId"))
            question_count = supplement.get("questionCount")
            if source_id and isinstance(question_count, int):
                supplement_counts[source_id] = question_count

    maths_total = maths_chapters.get("totalQuestionsListed")
    if isinstance(maths_total, int):
        counts[maths_source_id] = max(0, maths_total - sum(supplement_counts.values()))
    counts.update(supplement_counts)

    manifest = load_json_object(manifest_path)
    sources = manifest.get("sources")
    if isinstance(sources, list):
        for source in sources:
            if not isinstance(source, dict) or source.get("role") not in {"mcq_corpus", "mcq_corpus_supplement"}:
                continue
            source_id = text_value(source.get("id"))
            if source_id and source_id not in counts:
                question_count = source.get("questionCount")
                if isinstance(question_count, int):
                    counts[source_id] = question_count
                    continue
                if source.get("role") == "mcq_corpus_supplement":
                    continue
                title = text_value(source.get("title"))
                for token in title.split():
                    if token.isdigit() and int(token) >= 1000:
                        counts[source_id] = int(token)
                        break
    return counts


def build_blueprint(
    questions: list[dict[str, Any]],
    manifest_path: Path = DEFAULT_MANIFEST_PATH,
    maths_chapters_path: Path = DEFAULT_MATHS_CHAPTERS_PATH,
) -> dict[str, Any]:
    reviewed = [question for question in questions if question.get("reviewStatus") == "reviewed"]
    expected_counts = expected_counts_from_sources(manifest_path, maths_chapters_path)
    source_counts: Counter[str] = Counter()
    section_counts: Counter[str] = Counter()
    topic_counts: Counter[tuple[str, str]] = Counter()
    source_section_counts: dict[str, Counter[str]] = defaultdict(Counter)
    topic_subtopics: dict[tuple[str, str], Counter[str]] = defaultdict(Counter)

    for question in reviewed:
        provenance = question.get("provenance") if isinstance(question.get("provenance"), dict) else {}
        source_id = text_value(provenance.get("sourceId") or question.get("sourceId") or "unknown-book-source")
        section = text_value(question.get("section"))
        topic = text_value(question.get("topic"))
        subtopic = text_value(question.get("subtopic"))
        source_counts[source_id] += 1
        source_section_counts[source_id][section] += 1
        section_counts[section] += 1
        topic_counts[(section, topic)] += 1
        if subtopic:
            topic_subtopics[(section, topic)][subtopic] += 1

    sources = [
        {
            "sourceId": source_id,
            "questionCount": count,
            "expectedQuestionCount": expected_counts.get(source_id, count),
            "promotedDeficit": max(0, expected_counts.get(source_id, count) - count),
            "sections": [
                {"section": section, "questionCount": section_count}
                for section, section_count in sorted(source_section_counts[source_id].items())
            ],
        }
        for source_id, count in sorted(source_counts.items(), key=lambda item: (-item[1], item[0]))
    ]

    sections = [
        {
            "section": section,
            "title": SECTION_TITLES.get(section, section),
            "questionCount": count,
            "topicCount": len([topic for topic_section, topic in topic_counts if topic_section == section]),
            "fullSectionSets": count // 25,
        }
        for section, count in sorted(section_counts.items())
    ]

    topics = [
        {
            "slug": topic,
            "section": section,
            "questionCount": count,
            "notePriority": note_priority(count, section),
            "topSubtopics": [
                {"name": name, "questionCount": subtopic_count}
                for name, subtopic_count in topic_subtopics[(section, topic)].most_common(8)
            ],
        }
        for (section, topic), count in sorted(topic_counts.items(), key=lambda item: (-item[1], item[0][0], item[0][1]))
    ]

    return {
        "generatedAt": now_iso(),
        "sourceType": "book_pyq_corpus",
        "policy": {
            "practiceLabel": "Treat uploaded book questions as PYQ for this personal SSC CGL system.",
            "noteAuthoring": "Use the book-PYQ corpus distribution to decide concept depth, examples, traps, and repair drills.",
            "officialSourceSearch": "Official-source hunting is not an active milestone for this build.",
            "completenessRule": "The indexed book MCQ count is the target. Missing promoted rows are corpus-recovery failures/backlog, not acceptable shrinkage. Remove only exact 1:1 duplicate copies.",
        },
        "totalQuestions": len(reviewed),
        "expectedQuestionCount": sum(expected_counts.get(source["sourceId"], source["questionCount"]) for source in sources),
        "promotedDeficit": sum(max(0, expected_counts.get(source["sourceId"], source["questionCount"]) - source["questionCount"]) for source in sources),
        "sources": sources,
        "sections": sections,
        "topics": topics,
    }


def markdown_table(headers: list[str], rows: list[list[object]]) -> str:
    lines = [
        "| " + " | ".join(headers) + " |",
        "| " + " | ".join(["---"] * len(headers)) + " |",
    ]
    for row in rows:
        lines.append("| " + " | ".join(str(cell) for cell in row) + " |")
    return "\n".join(lines)


def render_markdown(blueprint: dict[str, Any]) -> str:
    sources = blueprint["sources"]
    sections = blueprint["sections"]
    topics = blueprint["topics"]
    quant_topics = [topic for topic in topics if topic["section"] == "quantitative-aptitude"]
    coverage_gaps = [topic for topic in topics if topic["notePriority"].endswith("coverage-gap")]

    parts = [
        "---",
        "title: SSC CGL Book PYQ Corpus Blueprint",
        "description: Distribution map for uploaded SSC CGL book-PYQ questions and DeepSeek note planning.",
        "tags: [ssc-cgl, pyq, corpus, deepseek]",
        "---",
        "",
        "# SSC CGL Book PYQ Corpus Blueprint",
        "",
        f"Generated from {blueprint['totalQuestions']} reviewed uploaded-book questions. In this build, these book questions are treated as the active PYQ corpus for practice tests, topic drills, and DeepSeek note planning.",
        "",
        "## Source Mix",
        "",
        markdown_table(
            ["Source", "Promoted PYQs", "Expected indexed MCQs", "Recovery deficit"],
            [[source["sourceId"], source["questionCount"], source["expectedQuestionCount"], source["promotedDeficit"]] for source in sources],
        ),
        "",
        f"Expected indexed MCQs: {blueprint['expectedQuestionCount']}. Promoted now: {blueprint['totalQuestions']}. Recovery deficit: {blueprint['promotedDeficit']}.",
        "",
        "## Section Capacity",
        "",
        markdown_table(
            ["Section", "Questions", "Topics", "25-question sets"],
            [[section["title"], section["questionCount"], section["topicCount"], section["fullSectionSets"]] for section in sections],
        ),
        "",
        "## 36-second Quant Planning",
        "",
        "Quant notes must be written for 36-second Quant execution: direct formula when the cue is obvious, option testing when answer gaps are wide, approximation when the value is rough, and skip-return when setup exceeds the time budget.",
        "",
        markdown_table(
            ["Quant topic", "Questions", "Note priority"],
            [[topic["slug"], topic["questionCount"], topic["notePriority"]] for topic in quant_topics],
        ),
        "",
        "## DeepSeek Note Priorities",
        "",
        "Note priority means 200/200 authoring priority, not permission to make any topic shallow. Dominant-repeat areas need exhaustive type systems and trap tables. Coverage gaps need extra original examples, formula ladders, and repair drills so the notes do not mirror corpus weakness.",
        "",
        markdown_table(
            ["Topic", "Section", "Questions", "Priority"],
            [[topic["slug"], topic["section"], topic["questionCount"], topic["notePriority"]] for topic in topics[:40]],
        ),
    ]
    if coverage_gaps:
        parts.extend([
            "",
            "## Coverage Gaps",
            "",
            markdown_table(
                ["Topic", "Section", "Questions"],
                [[topic["slug"], topic["section"], topic["questionCount"]] for topic in coverage_gaps],
            ),
        ])
    return "\n".join(parts).strip() + "\n"


def write_json(path: Path, value: Any) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(value, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")


def write_text(path: Path, content: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content, encoding="utf-8")


def main() -> int:
    parser = argparse.ArgumentParser(description="Build the SSC CGL book-PYQ corpus blueprint.")
    parser.add_argument("--questions-path", type=Path, default=DEFAULT_QUESTIONS_PATH)
    parser.add_argument("--manifest-path", type=Path, default=DEFAULT_MANIFEST_PATH)
    parser.add_argument("--maths-chapters-path", type=Path, default=DEFAULT_MATHS_CHAPTERS_PATH)
    parser.add_argument("--output-json", type=Path, default=DEFAULT_OUTPUT_JSON)
    parser.add_argument("--output-md", type=Path, default=DEFAULT_OUTPUT_MD)
    args = parser.parse_args()

    blueprint = build_blueprint(load_questions(args.questions_path), args.manifest_path, args.maths_chapters_path)
    write_json(args.output_json, blueprint)
    write_text(args.output_md, render_markdown(blueprint))
    print(f"wrote book-PYQ corpus blueprint: {args.output_json}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
