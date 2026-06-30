"""Promote high-consensus SSC CGL agent-reviewed candidates into app questions.

This is the final curation projection for imported practice. It reads aligned
candidate rows, answer-consensus evidence, and DeepSeek/Mistral/GPT-style
curation decisions, then writes a separate reviewed question file consumed by
the exam data builder.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import re
import sys
from dataclasses import asdict, dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[1]
DEFAULT_DATA_DIR = ROOT / "data" / "exams" / "ssc-cgl"
DEFAULT_OUTPUT_ROOT = DEFAULT_DATA_DIR / "curated-imports"

VALID_OPTIONS = {"a", "b", "c", "d"}
OCR_SOLUTION_MARKER_SOURCE_TYPES = {
    "mistral_ocr_solution_marker",
    "mistral_ocr_solution_marker_cross_range",
    "mistral_ocr_solution_marker_forward_range",
}
VALID_TOPICS = {
    "active-passive-direct-indirect",
    "algebra",
    "analogy-classification",
    "art-culture",
    "averages-mixtures-alligation",
    "blood-relation",
    "calendar-clock",
    "calculation-speed",
    "computer-awareness",
    "current-affairs-static-gk",
    "data-interpretation",
    "direction-distance",
    "economics-budget-banking",
    "environment-ecology",
    "fill-in-the-blanks",
    "general-awareness",
    "geometry-mensuration",
    "geography-india-world",
    "grammar-error-spotting",
    "history-freedom-movement",
    "idioms-phrases",
    "indian-polity-basics",
    "mathematical-operations",
    "non-verbal-reasoning",
    "number-system",
    "para-jumbles",
    "percentages",
    "probability",
    "profit-loss-discount",
    "ratio-proportion",
    "reading-comprehension",
    "science-everyday",
    "seating-arrangement",
    "sentence-improvement",
    "series-coding",
    "simple-compound-interest",
    "spelling-one-word",
    "sports-awards",
    "statement-conclusion",
    "syllogism-venn",
    "synonyms-antonyms",
    "time-speed-distance",
    "time-work-pipes",
    "trigonometry",
    "vocabulary-cloze",
}

BOOK_SOURCE_SECTIONS = {
    "pinnacle-ssc-english": "english-comprehension",
    "pinnacle-ssc-general-studies": "general-awareness",
    "pinnacle-ssc-reasoning": "reasoning",
    "ssc-maths-6800-mcq": "quantitative-aptitude",
    "pinnacle-maths-6800-di-qr-english": "quantitative-aptitude",
}

BOILERPLATE_PATTERNS = [
    "tg @",
    "@ssc",
    "search on tg",
    "download pinnacle",
    "answer key :-",
    "solutions :-",
    "exam preparation",
]
OCR_WATERMARK_LINE = re.compile(
    r"^\s*(?:"
    r"tg\s*@.*|"
    r"search\s+on\s+tg.*|"
    r"www\.[a-z0-9_.-]*(?:ssc|pinnacle)[a-z0-9_.-]*\.com|"
    r"download\s+pinnacle.*|"
    r"pinnacle|"
    r"static\s+gk"
    r")\s*$",
    re.IGNORECASE,
)


@dataclass
class PromotionReport:
    generatedAt: str
    scannedAlignedCandidates: int
    candidatesWithAnswerConsensus: int
    candidatesWithAgentReview: int
    candidatesWithTrustedBookGate: int
    promotedQuestions: int
    rejected: dict[str, int]
    outputPath: str
    rankedEligible: bool
    warnings: list[str]


def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def load_json(path: Path) -> Any:
    return json.loads(path.read_text(encoding="utf-8"))


def write_json(path: Path, value: Any) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(value, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")


def active_trusted_book_source_sections(data_dir: Path) -> dict[str, str]:
    manifest_path = data_dir / "book-sources" / "manifest.json"
    if not manifest_path.exists():
        return dict(BOOK_SOURCE_SECTIONS)
    manifest = load_json(manifest_path)
    sources = manifest.get("sources") if isinstance(manifest, dict) else []
    active: dict[str, str] = {}
    if isinstance(sources, list):
        for source in sources:
            if not isinstance(source, dict):
                continue
            if source.get("sourceType") == "book_user_provided" and source.get("role") in {"mcq_corpus", "mcq_corpus_supplement"}:
                source_id = str(source.get("id") or "")
                section = normalize_section(source.get("section")) or BOOK_SOURCE_SECTIONS.get(source_id)
                if source_id and section:
                    active[source_id] = section
    return active


def active_trusted_book_source_ids(data_dir: Path) -> set[str]:
    return set(active_trusted_book_source_sections(data_dir))


def normalize_text(value: object) -> str:
    text = str(value or "").lower()
    text = text.replace("&", " and ")
    text = re.sub(r"_{2,}", " blank ", text)
    text = re.sub(r"[^a-z0-9]+", " ", text)
    return re.sub(r"\s+", " ", text).strip()


def stable_suffix(value: str) -> str:
    return hashlib.sha1(value.encode("utf-8")).hexdigest()[:12]


def normalize_option(value: object) -> str | None:
    match = re.search(r"\b([a-d])\b", str(value or "").strip().lower())
    return match.group(1) if match else None


def clean_option_text(value: object) -> str:
    text = clean_question_text(value)
    text = re.split(
        r"\s*(?:#{1,6}\s*)?(?:Solutions?|Answer\s+Key)\s*[:-]?\s*|"
        r"\s*\*\*Sol(?:ution)?\.?\s*\d{0,4}|"
        r"\s*Sol(?:ution)?\.?\s*\d{0,4}|"
        r"\s+Q\.?\s*\d{1,4}\b|"
        r"\s+Question\s+\d{1,4}\b",
        text,
        maxsplit=1,
        flags=re.IGNORECASE,
    )[0]
    return text.strip()


def clean_question_text(value: object) -> str:
    lines = []
    for raw_line in str(value or "").splitlines():
        line = raw_line.strip()
        if not line or OCR_WATERMARK_LINE.match(line):
            continue
        lines.append(line)
    return re.sub(r"\s+", " ", "\n".join(lines)).strip()


def cleaned_options(options: object) -> list[dict] | None:
    if not isinstance(options, list) or len(options) != 4:
        return None
    cleaned: list[dict] = []
    for option in options:
        if not isinstance(option, dict):
            return None
        option_id = str(option.get("id") or "").lower()
        option_text = clean_option_text(option.get("text"))
        cleaned.append({"id": option_id, "text": option_text})
    return cleaned


def candidate_topic_hints(section: str, candidate: dict) -> str:
    if section != "english-comprehension":
        return ""
    hints: list[str] = []
    source_id = str(
        candidate.get("sourceId")
        or (candidate.get("provenance") if isinstance(candidate.get("provenance"), dict) else {}).get("sourceId")
        or ""
    )
    if source_id == "pinnacle-ssc-english":
        range_text = " ".join([
            str(candidate.get("chapterSlug") or ""),
            str(candidate.get("chapterTitle") or ""),
            str((candidate.get("provenance") if isinstance(candidate.get("provenance"), dict) else {}).get("chapterTitle") or ""),
        ]).lower()
        range_match = re.search(r"p0*(\d{1,4})\s*[-_ ]\s*p0*(\d{1,4})", range_text)
        start_page = int(range_match.group(1)) if range_match else 0
        if 1 <= start_page <= 75:
            hints.append("spot the error grammar")
        elif 76 <= start_page <= 125:
            hints.append("sentence improvement no improvement")
        elif 126 <= start_page <= 225:
            hints.append("direct indirect active passive")
        elif 226 <= start_page <= 250:
            hints.append("para jumble")
        elif 251 <= start_page <= 300:
            hints.append("fill blank")
        elif 351 <= start_page <= 425:
            hints.append("passage reading comprehension")
        elif 426 <= start_page <= 450:
            hints.append("one word substitution")
        elif 451 <= start_page <= 500:
            hints.append("idiom phrase")
        elif 501 <= start_page <= 550:
            hints.append("synonym antonym nearest meaning")
        elif 551 <= start_page <= 569:
            hints.append("spelling spelt")

    stem = normalize_text(candidate.get("stem"))
    options = candidate.get("options")
    if not stem or not isinstance(options, list):
        return " ".join(hints)

    copied_fragments = 0
    for option in options:
        if not isinstance(option, dict):
            continue
        option_text = normalize_text(option.get("text"))
        if len(option_text) >= 6 and option_text in stem:
            copied_fragments += 1
    if copied_fragments >= 3:
        hints.append("spot the error grammar")
    return " ".join(hints)


def source_slug_from_review_dir(path: Path) -> str:
    name = path.parent.name
    return re.sub(r"-deepseek-mistral-full$", "", name)


def source_slug_from_aligned_path(path: Path, root: Path) -> str:
    relative = path.relative_to(root)
    name = relative.parts[0]
    return re.sub(r"-agent-consensus$", "", name)


def read_aligned(data_dir: Path, include_mistral_book_rows: bool = False) -> list[dict]:
    items: list[dict] = []
    roots = [data_dir / "aligned-mistral"] if include_mistral_book_rows else [data_dir / "aligned"]
    for root in roots:
        if not root.exists():
            continue
        for path in sorted(root.glob("**/aligned-candidates.json")):
            payload = load_json(path)
            if not isinstance(payload, list):
                continue
            source_slug = source_slug_from_aligned_path(path, root)
            for item in payload:
                if isinstance(item, dict):
                    row = dict(item)
                    row["_sourceSlug"] = source_slug
                    items.append(row)
    return items


def read_review_decisions(data_dir: Path) -> dict[str, list[dict]]:
    decisions_by_id: dict[str, list[dict]] = {}
    for path in sorted((data_dir / "agent-review").glob("**/agent-review-decisions.json")):
        payload = load_json(path)
        if not isinstance(payload, list):
            continue
        source_slug = source_slug_from_review_dir(path)
        for decision in payload:
            if not isinstance(decision, dict):
                continue
            question_id = str(decision.get("questionId") or "")
            if not question_id:
                continue
            row = dict(decision)
            row["_sourceSlug"] = source_slug
            decisions_by_id.setdefault(question_id, []).append(row)
    return decisions_by_id


def candidate_source_type(candidate: dict) -> str:
    provenance = candidate.get("provenance") if isinstance(candidate.get("provenance"), dict) else {}
    return str(candidate.get("sourceType") or provenance.get("sourceType") or "")


def accepted_review_decision(decisions: list[dict], min_confidence: float) -> dict | None:
    accepted = [
        decision for decision in decisions
        if decision.get("duplicateDecision") == "unique"
        and decision.get("provenanceDecision") != "reject"
        and float(decision.get("confidence") or 0) >= min_confidence
        and normalize_section(decision.get("finalSection")) is not None
    ]
    if not accepted:
        return None
    accepted.sort(key=lambda item: float(item.get("confidence") or 0), reverse=True)
    return accepted[0]


def source_id_from_candidate(candidate: dict) -> str:
    provenance = candidate.get("provenance") if isinstance(candidate.get("provenance"), dict) else {}
    return str(candidate.get("sourceId") or provenance.get("sourceId") or candidate.get("_sourceSlug") or "")


def is_trusted_book_candidate(candidate: dict, active_source_ids: set[str] | None = None) -> bool:
    source_id = source_id_from_candidate(candidate)
    trusted_ids = active_source_ids if active_source_ids is not None else set(BOOK_SOURCE_SECTIONS)
    return candidate_source_type(candidate) == "book_user_provided" and source_id in trusted_ids


def trusted_book_decision(candidate: dict, active_source_sections: dict[str, str] | None = None) -> dict:
    source_id = source_id_from_candidate(candidate)
    section = (
        (active_source_sections or {}).get(source_id)
        or BOOK_SOURCE_SECTIONS.get(source_id)
        or normalize_section(candidate.get("suggestedSection"))
        or "general-awareness"
    )
    option_text = " ".join(
        clean_option_text(option.get("text"))
        for option in candidate.get("options", [])
        if isinstance(option, dict)
    )
    topic = topic_from_text(section, normalize_text(" ".join([
        str(candidate.get("suggestedTopic") or ""),
        str(candidate.get("suggestedSubtopic") or ""),
        str(candidate.get("chapterSlug") or ""),
        str(candidate.get("chapterTitle") or ""),
        str(candidate.get("stem") or ""),
        option_text,
        candidate_topic_hints(section, candidate),
    ])))
    return {
        "questionId": candidate.get("id"),
        "provider": "trusted_book_format_dedupe",
        "finalSection": section,
        "finalTopic": topic,
        "finalSubtopic": str(candidate.get("suggestedSubtopic") or candidate.get("chapterTitle") or topic),
        "duplicateDecision": "unique",
        "provenanceDecision": "accept",
        "confidence": 0.9,
        "reasons": [
            "Uploaded-book row promoted from Mistral OCR because it has a matched answer, four valid options, book provenance, and a unique normalized stem."
        ],
        "acceptedAt": now_iso(),
    }


def normalize_section(value: object) -> str | None:
    text = normalize_text(value)
    if not text:
        return None
    if "reason" in text or "intelligence" in text:
        return "reasoning"
    if "quant" in text or "math" in text:
        return "quantitative-aptitude"
    if "aware" in text or "general knowledge" in text or text in {"ga", "gk"}:
        return "general-awareness"
    if "english" in text or "comprehension" in text:
        return "english-comprehension"
    return None


def is_reasoning_analogy_prompt(text: str) -> bool:
    return any(token in text for token in [
        "same relationship",
        "same relation",
        "same way as",
        "related to the third",
        "related to the first",
        "word pair",
        "word-pair",
        "number pair",
        "number-pair",
        "letter-cluster",
    ])


def is_calendar_clock_prompt(text: str) -> bool:
    return (
        any(token in text for token in [
            "day of the week",
            "day of week",
            "odd days",
            "leap year",
            "ordinary year",
            "hour hand",
            "minute hand",
            "angle between the hands",
            "hands of the clock",
            "hands of a clock",
        ])
        or bool(re.search(r"\bwhat (?:was|will be|is) the day\b", text))
    )


def topic_from_text(section: str, text: str) -> str:
    if section == "reasoning":
        if is_calendar_clock_prompt(text):
            return "calendar-clock"
        if any(token in text for token in ["coding", "decoding", "code language", "coded as", "written as", "letter cluster", "letter-cluster", "series"]):
            return "series-coding"
        if is_reasoning_analogy_prompt(text):
            return "analogy-classification"
        if (
            any(token in text for token in ["blood", "family"])
            or re.search(r"\b(?:mother|father|brother|sister|son|daughter|husband|wife|uncle|aunt|nephew|niece)\b", text)
            or re.search(r"\brelated to (?:him|her|them|[a-z])\b", text)
        ):
            return "blood-relation"
        if (
            any(token in text for token in ["syllogism", "venn"])
            or (
                "statement" in text
                and "conclusion" in text
                and re.search(r"\b(?:all|some|no)\b", text)
            )
        ):
            return "syllogism-venn"
        if any(token in text for token in ["mirror", "water image", "figure", "paper folding", "embedded", "cube", "dice"]):
            return "non-verbal-reasoning"
        if any(token in text for token in ["o clock"]):
            return "calendar-clock"
        if any(token in text for token in ["statement", "conclusion", "assertion", "argument"]):
            return "statement-conclusion"
        if (
            any(token in text for token in ["seating", "sitting", "arrangement", "circular", "facing", "left of", "right of", "one above", "above the other", "kept one"])
            or re.search(r"\brow\b", text)
        ):
            return "seating-arrangement"
        if any(token in text for token in ["direction", "distance", "north", "south", "east", "west"]):
            return "direction-distance"
        if any(token in text for token in ["mathematical operation", "operator", "interchange"]):
            return "mathematical-operations"
        return "analogy-classification"
    if section == "quantitative-aptitude":
        if any(token in text for token in ["data interpretation", "data-interpretation", "table", "chart", "graph", "pictograph"]):
            return "data-interpretation"
        if (
            "probability" in text
            or "favourable" in text
            or "favorable" in text
            or re.search(r"\bp\s*\(", text)
            or ("events with p" in text and re.search(r"\bp\s+[a-z]\b", text))
            or any(token in text for token in ["random", "chance", "odds against", "odds in favour", "odds in favor"])
            or (
                any(token in text for token in ["die", "dice", "coin", "cards", "pack of cards", "balls", "urn"])
                and any(token in text for token in ["draw", "drawn", "toss", "thrown", "cast", "replacement", "without replacement"])
            )
        ):
            return "probability"
        if any(token in text for token in ["average", "mean", "mixture", "alligation", "replacement"]):
            return "averages-mixtures-alligation"
        if (
            any(token in text for token in ["simplify", "simplification", "approximate", "approximation", "bodmas", "calculation"])
            or re.search(r"\bvalue of(?:\s+\d+[a-z]*){3,}\b", text)
        ):
            return "calculation-speed"
        if "trigon" in text or re.search(r"\b(?:sin|cos|tan|cot|sec|cosec|theta)\b", text):
            return "trigonometry"
        if any(token in text for token in ["profit", "loss", "discount", "marked price"]):
            return "profit-loss-discount"
        if "percentage" in text or "percent" in text:
            return "percentages"
        if any(token in text for token in ["interest", "principal", "compound", "simple interest"]):
            return "simple-compound-interest"
        if (
            any(token in text for token in ["time and work", "work-and-time", "pipe", "cistern", "efficiency"])
            or (
                re.search(r"\b(?:complete|finish|do|done|working|worked)\b.*\b(?:work|task|job|project)\b", text)
                and re.search(r"\b(?:day|days|hour|hours|worker|workers|men|women|person|persons)\b", text)
            )
        ):
            return "time-work-pipes"
        if any(token in text for token in ["speed", "train", "boat", "race", "distance"]):
            return "time-speed-distance"
        if any(token in text for token in ["geometry", "triangle", "circle", "mensuration", "area", "volume"]):
            return "geometry-mensuration"
        if any(token in text for token in ["algebra", "equation", "polynomial"]):
            return "algebra"
        if any(token in text for token in ["ratio", "proportion", "partnership"]):
            return "ratio-proportion"
        return "number-system"
    if section == "general-awareness":
        if any(token in text for token in [
            "constitution", "article", "parliament", "lok sabha", "rajya sabha", "president",
            "prime minister", "fundamental right", "governor", "supreme court", "election",
            "chief election commissioner",
        ]):
            return "indian-polity-basics"
        if any(token in text for token in [
            "computer", "software", "hardware", "cpu", "computer memory", "cache memory", "main memory",
            "random access memory", "read only memory", "internet", "browser",
            "operating system", "keyboard", "microsoft", "ms word", "ms excel", "excel",
            "powerpoint", "spreadsheet", "file explorer", "firewall", "phishing", "encryption",
            "email", "mail merge", "database", "input device", "output device",
            "shortcut key", "web page", "networking", "wan protocol", "email protocol"
        ]):
            return "computer-awareness"
        if any(token in text for token in ["history", "movement", "congress", "act", "1885", "freedom"]):
            return "history-freedom-movement"
        if any(token in text for token in [
            "river", "geography", "crop", "soil", "climate", "mountain", "monsoon", "latitude",
            "longitude", "plateau", "delta", "forest", "strait", "isthmus",
        ]):
            return "geography-india-world"
        if any(token in text for token in ["rbi", "budget", "bank", "economy", "inflation", "gdp", "tax", "repo", "currency", "trade", "finance"]):
            return "economics-budget-banking"
        if any(token in text for token in [
            "science", "disease", "vitamin", "physics", "chemistry", "biology", "organ", "cell",
            "enzyme", "hormone", "acid", "metal", "force", "solidification", "condensation",
            "fusion", "sublimation", "fungi",
        ]):
            return "science-everyday"
        if any(token in text for token in ["environment", "ecology", "pollution", "wildlife", "protocol", "biosphere", "ozone", "greenhouse", "sanctuary", "national park"]):
            return "environment-ecology"
        if any(token in text for token in [
            "culture", "dance", "festival", "art", "bharatanatyam", "natyashastra", "kathakali",
            "kathak", "carnatic", "hindustani", "gharana", "tabla", "sarod", "ghatam", "ghazal",
            "raga", "tala", "abhinaya", "folk"
        ]):
            return "art-culture"
        if any(token in text for token in ["sports", "award", "book", "author", "prize", "nobel", "bharat ratna", "olympic", "world cup", "player", "games"]):
            return "sports-awards"
        return "current-affairs-static-gk"
    if section == "english-comprehension":
        if any(token in text for token in ["cloze passage", "cloze test", "in the cloze passage"]):
            return "vocabulary-cloze"
        if any(token in text for token in ["active", "passive", "direct", "indirect"]):
            return "active-passive-direct-indirect"
        if any(token in text for token in ["spelling", "spelt", "correctly spelt", "incorrectly spelt", "misspelt"]):
            return "spelling-one-word"
        if any(token in text for token in ["synonym", "antonym", "opposite", "similar meaning", "nearest meaning", "nearest in meaning", "closest meaning", "same meaning"]):
            return "synonyms-antonyms"
        if any(token in text for token in ["one word", "one-word", "substitution for", "substitute for"]):
            return "spelling-one-word"
        if any(token in text for token in ["idiom", "phrase"]):
            return "idioms-phrases"
        if any(token in text for token in ["no improvement", "no substitution", "substitution required", "improvement", "sentence improvement"]):
            return "sentence-improvement"
        if any(token in text for token in ["no error", "spot the error", "find the error", "error", "grammar"]):
            return "grammar-error-spotting"
        if "sentence" in text:
            return "sentence-improvement"
        if any(token in text for token in ["para", "jumble"]):
            return "para-jumbles"
        if any(token in text for token in ["fill", "blank"]):
            return "fill-in-the-blanks"
        if any(token in text for token in ["passage", "reading"]):
            return "reading-comprehension"
        return "vocabulary-cloze"
    return "analogy-classification"


def normalize_topic(section: str, candidate: dict, decision: dict) -> str:
    option_text = " ".join(
        clean_option_text(option.get("text"))
        for option in candidate.get("options", [])
        if isinstance(option, dict)
    )
    raw = " ".join([
        str(decision.get("finalTopic") or ""),
        str(decision.get("finalSubtopic") or ""),
        str(candidate.get("suggestedTopic") or ""),
        str(candidate.get("suggestedSubtopic") or ""),
        str(candidate.get("stem") or ""),
        option_text,
        candidate_topic_hints(section, candidate),
    ])
    slug = normalize_text(decision.get("finalTopic")).replace(" ", "-")
    if slug in VALID_TOPICS:
        return slug
    return topic_from_text(section, normalize_text(raw))


def parse_year(candidate: dict) -> int:
    haystack = " ".join([
        str(candidate.get("_sourceSlug") or ""),
        str(candidate.get("sourceUrl") or ""),
        str(candidate.get("provenance", {}).get("url") or ""),
        str(candidate.get("stem") or ""),
        str(candidate.get("chapterTitle") or candidate.get("provenance", {}).get("chapterTitle") or ""),
    ])
    years = [int(match) for match in re.findall(r"\b(20[0-2][0-9]|19[7-9][0-9])\b", haystack)]
    return years[0] if years else 2026


def parse_shift(candidate: dict) -> str:
    haystack = " ".join([
        str(candidate.get("_sourceSlug") or ""),
        str(candidate.get("sourceUrl") or ""),
        str(candidate.get("stem") or ""),
    ])
    match = re.search(r"shift[-\s]*(\d+)", haystack, re.IGNORECASE)
    date_match = re.search(r"(\d{1,2}(?:st|nd|rd|th)?[-/\s]+(?:[a-z]+|\d{1,2})[-/\s]+\d{4}|\d{4}[-\s]+question[-\s]+paper)", haystack, re.IGNORECASE)
    parts = ["Agent-curated imported practice"]
    if date_match:
        parts.append(date_match.group(1).replace("-", " "))
    if match:
        parts.append(f"Shift {match.group(1)}")
    return " - ".join(parts)


def explanation_from(candidate: dict) -> str:
    evidence = candidate.get("answerEvidence") if isinstance(candidate.get("answerEvidence"), dict) else {}
    evidence_text = str(evidence.get("evidenceText") or "").strip()
    if evidence.get("sourceType") in OCR_SOLUTION_MARKER_SOURCE_TYPES and evidence_text:
        return evidence_text
    explanations = evidence.get("explanations") if isinstance(evidence.get("explanations"), list) else []
    best = ""
    best_confidence = -1.0
    for item in explanations:
        if not isinstance(item, dict):
            continue
        confidence = float(item.get("confidence") or 0)
        explanation = str(item.get("explanation") or "").strip()
        if explanation and confidence > best_confidence:
            best = explanation
            best_confidence = confidence
    return best or "Answer selected by multi-agent consensus and final curation review."


def has_promotable_answer_evidence(candidate: dict) -> bool:
    evidence = candidate.get("answerEvidence") if isinstance(candidate.get("answerEvidence"), dict) else {}
    if candidate.get("alignmentStatus") == "agent_consensus_matched":
        return True
    return (
        candidate.get("alignmentStatus") in {"matched", "answer_key_mismatch"}
        and evidence.get("sourceType") in OCR_SOLUTION_MARKER_SOURCE_TYPES
        and candidate_correct_option(candidate) in VALID_OPTIONS
    )


def answer_evidence_confidence(candidate: dict) -> float:
    evidence = candidate.get("answerEvidence") if isinstance(candidate.get("answerEvidence"), dict) else {}
    if evidence.get("sourceType") in OCR_SOLUTION_MARKER_SOURCE_TYPES:
        return 0.96
    return float(evidence.get("averageConfidence") or 0)


def answer_evidence_agreement_count(candidate: dict) -> int:
    evidence = candidate.get("answerEvidence") if isinstance(candidate.get("answerEvidence"), dict) else {}
    if evidence.get("sourceType") in OCR_SOLUTION_MARKER_SOURCE_TYPES:
        return 1
    return int(evidence.get("agreementCount") or 0)


def answer_evidence_providers(candidate: dict) -> list[str]:
    evidence = candidate.get("answerEvidence") if isinstance(candidate.get("answerEvidence"), dict) else {}
    if evidence.get("sourceType") in OCR_SOLUTION_MARKER_SOURCE_TYPES:
        return [str(evidence.get("sourceType"))]
    providers = evidence.get("providers") if isinstance(evidence.get("providers"), list) else []
    return [str(provider) for provider in providers]


def difficulty_from(confidence: float) -> str:
    if confidence >= 0.95:
        return "easy"
    if confidence >= 0.88:
        return "medium"
    return "hard"


def valid_options(options: object) -> bool:
    options = cleaned_options(options)
    if not isinstance(options, list) or len(options) != 4:
        return False
    ids = {str(option.get("id") or "").lower() for option in options if isinstance(option, dict)}
    return ids == VALID_OPTIONS and all(str(option.get("text") or "").strip() for option in options if isinstance(option, dict))


def has_boilerplate_noise(value: object) -> bool:
    text = str(value or "").lower()
    return any(pattern in text for pattern in BOILERPLATE_PATTERNS)


def valid_question_shape(candidate: dict) -> bool:
    stem = clean_question_text(candidate.get("stem"))
    options = cleaned_options(candidate.get("options"))
    if not stem or has_boilerplate_noise(stem) or len(stem.split()) < 3:
        return False
    if not valid_options(options):
        return False
    if not isinstance(options, list):
        return False
    for option in options:
        if not isinstance(option, dict):
            return False
        option_text = str(option.get("text") or "").strip()
        if has_boilerplate_noise(option_text) or len(option_text) > 500:
            return False
    return True


def candidate_correct_option(candidate: dict) -> str | None:
    evidence = candidate.get("answerEvidence") if isinstance(candidate.get("answerEvidence"), dict) else {}
    return (
        normalize_option(candidate.get("correctOption"))
        or normalize_option(candidate.get("answerKeyExpected"))
        or normalize_option(evidence.get("correctOption"))
    )


def exact_question_signature(candidate: dict) -> str:
    options = cleaned_options(candidate.get("options")) or []
    payload = {
        "stem": normalize_text(clean_question_text(candidate.get("stem"))),
        "options": [
            {"id": option.get("id"), "text": normalize_text(option.get("text"))}
            for option in options
        ],
        "correctOption": candidate_correct_option(candidate),
    }
    if is_ocr_figure_placeholder(candidate, options):
        provenance = candidate.get("provenance") if isinstance(candidate.get("provenance"), dict) else {}
        payload["ocrFigureProvenance"] = {
            "sourceId": source_id_from_candidate(candidate),
            "pageNumber": int(candidate.get("pageNumber") or provenance.get("pageNumber") or 0),
            "questionNumber": str(candidate.get("questionNumber") or ""),
            "candidateId": str(candidate.get("id") or ""),
        }
    return hashlib.sha1(json.dumps(payload, sort_keys=True, ensure_ascii=False).encode("utf-8")).hexdigest()


def is_ocr_figure_placeholder(candidate: dict, options: list[dict]) -> bool:
    stem = clean_question_text(candidate.get("stem")).lower()
    option_text = " ".join(str(option.get("text") or "").lower() for option in options)
    return (
        "see figure" in option_text
        or "ocr label-only block" in stem
        or bool(re.search(r"!\[[^\]]*\]\([^)]+\)", stem))
    )


def promote_candidate(candidate: dict, decision: dict, min_answer_confidence: float, promotion_gate: str = "agent_review") -> dict | None:
    answer_evidence = candidate.get("answerEvidence") if isinstance(candidate.get("answerEvidence"), dict) else {}
    provenance_in = candidate.get("provenance") if isinstance(candidate.get("provenance"), dict) else {}
    correct_option = candidate_correct_option(candidate)
    if not correct_option:
        return None
    section = normalize_section(decision.get("finalSection")) or normalize_section(candidate.get("suggestedSection"))
    if not section:
        return None
    topic = normalize_topic(section, candidate, decision)
    if topic not in VALID_TOPICS:
        return None
    average_confidence = answer_evidence_confidence(candidate)
    review_confidence = float(decision.get("confidence") or 0)
    source_url = str(candidate.get("sourceUrl") or provenance_in.get("url") or "")
    raw_source_type = str(candidate.get("sourceType") or provenance_in.get("sourceType") or "user_provided")
    source_file = str(candidate.get("sourceFile") or provenance_in.get("file") or "")
    source_id = str(candidate.get("sourceId") or provenance_in.get("sourceId") or candidate.get("_sourceSlug") or "agent-curated-import")
    source_type = "book_user_provided" if raw_source_type == "book_user_provided" else "user_provided"
    has_source_provenance = bool(source_url or source_file or raw_source_type == "book_user_provided")
    options = cleaned_options(candidate.get("options"))
    if average_confidence < min_answer_confidence or not has_source_provenance or not valid_question_shape(candidate) or not options:
        return None
    year = parse_year(candidate)
    question_id = f"ssc-cgl-agent-curated-{year}-{stable_suffix(str(candidate.get('id')))}"
    providers = answer_evidence_providers(candidate)
    page_number = int(candidate.get("pageNumber") or provenance_in.get("pageNumber") or 1)
    chapter_slug = str(candidate.get("chapterSlug") or provenance_in.get("chapterSlug") or "").strip()
    chapter_title = str(candidate.get("chapterTitle") or provenance_in.get("chapterTitle") or "").strip()
    provenance = {
        "sourceId": source_id,
        "sourceType": source_type,
        "title": parse_shift(candidate),
        "pageNumber": page_number,
        "licenseNote": "User-requested personal-study import promoted after trusted uploaded-book format and duplicate gates." if promotion_gate == "trusted_book_format_dedupe" else "User-requested personal-study import promoted after answer consensus and model-agent curation review.",
    }
    if source_url:
        provenance["url"] = source_url
    if source_file:
        provenance["file"] = source_file
    if chapter_slug:
        provenance["chapterSlug"] = chapter_slug
    if chapter_title:
        provenance["chapterTitle"] = chapter_title

    return {
        "id": question_id,
        "exam": "SSC-CGL",
        "tier": "Tier-I",
        "year": year,
        "shift": parse_shift(candidate),
        "source": "PYQ",
        "section": section,
        "topic": topic,
        "subtopic": str(decision.get("finalSubtopic") or candidate.get("suggestedSubtopic") or topic).strip() or topic,
        "difficulty": difficulty_from(min(average_confidence, review_confidence)),
        "language": "en",
        "stem": clean_question_text(candidate.get("stem")),
        "options": options,
        "correctOption": correct_option,
        "explanation": explanation_from(candidate),
        "marksCorrect": 2,
        "marksWrong": -0.5,
        "marksUnattempted": 0,
        "timerSeconds": 900,
        "ocrConfidence": round(min(1.0, max(0.7, average_confidence)), 3),
        "reviewStatus": "reviewed",
        "conceptTags": [
            "agent-curated-import",
            topic,
            f"answer-consensus-{answer_evidence_agreement_count(candidate)}",
            f"review-{decision.get('provider') or 'agent'}",
            promotion_gate,
        ],
        "provenance": provenance,
        "curation": {
            "originalCandidateId": candidate.get("id"),
            "answerProviders": providers,
            "answerAgreementCount": answer_evidence_agreement_count(candidate),
            "answerAverageConfidence": average_confidence,
            "reviewProvider": decision.get("provider"),
            "reviewConfidence": review_confidence,
            "reviewAcceptedAt": decision.get("acceptedAt"),
            "reviewReasons": decision.get("reasons") or [],
            "sourceTypeBeforePromotion": raw_source_type,
            "promotionGate": promotion_gate,
        },
    }


def promote(data_dir: Path, output_root: Path, min_answer_confidence: float, min_review_confidence: float, max_items: int, source_type_filter: set[str], trust_book_format_dedupe: bool = False) -> PromotionReport:
    aligned = read_aligned(data_dir, include_mistral_book_rows=trust_book_format_dedupe)
    decisions_by_id = read_review_decisions(data_dir)
    active_book_source_sections = active_trusted_book_source_sections(data_dir)
    active_book_source_ids = set(active_book_source_sections)
    promoted: list[dict] = []
    rejected: dict[str, int] = {
        "inactive_book_source": 0,
        "missing_answer_consensus": 0,
        "missing_agent_review": 0,
        "weak_agent_review": 0,
        "invalid_projection": 0,
        "duplicate_stem": 0,
    }
    seen_stems: set[str] = set()
    scanned = 0
    with_answer = 0
    with_review = 0
    with_trusted_book_gate = 0

    for candidate in aligned:
        if source_type_filter and candidate_source_type(candidate) not in source_type_filter:
            continue
        if (
            trust_book_format_dedupe
            and candidate_source_type(candidate) == "book_user_provided"
            and source_id_from_candidate(candidate) in active_book_source_ids.union(BOOK_SOURCE_SECTIONS)
            and source_id_from_candidate(candidate) not in active_book_source_ids
        ):
            rejected["inactive_book_source"] += 1
            continue
        scanned += 1
        if not has_promotable_answer_evidence(candidate) or candidate.get("reviewStatus") != "needs_topic_duplicate_review":
            rejected["missing_answer_consensus"] += 1
            continue
        with_answer += 1
        question_id = str(candidate.get("id") or "")
        promotion_gate = "agent_review"
        if trust_book_format_dedupe and is_trusted_book_candidate(candidate, active_book_source_ids):
            decision = trusted_book_decision(candidate, active_book_source_sections)
            with_trusted_book_gate += 1
            promotion_gate = "trusted_book_format_dedupe"
        else:
            decisions = decisions_by_id.get(question_id, [])
            if not decisions:
                rejected["missing_agent_review"] += 1
                continue
            with_review += 1
            decision = accepted_review_decision(decisions, min_review_confidence)
            if not decision:
                rejected["weak_agent_review"] += 1
                continue
        exact_hash = exact_question_signature(candidate)
        if exact_hash in seen_stems:
            rejected["duplicate_stem"] += 1
            continue
        question = promote_candidate(candidate, decision, min_answer_confidence, promotion_gate=promotion_gate)
        if not question:
            rejected["invalid_projection"] += 1
            continue
        seen_stems.add(exact_hash)
        promoted.append(question)
        if max_items > 0 and len(promoted) >= max_items:
            break

    output_path = output_root / "questions.json"
    write_json(output_path, promoted)
    report = PromotionReport(
        generatedAt=now_iso(),
        scannedAlignedCandidates=scanned,
        candidatesWithAnswerConsensus=with_answer,
        candidatesWithAgentReview=with_review,
        candidatesWithTrustedBookGate=with_trusted_book_gate,
        promotedQuestions=len(promoted),
        rejected=rejected,
        outputPath=str(output_path.resolve()),
        rankedEligible=True,
        warnings=[
            "Promoted rows are a curated projection; raw alignment and review artifacts remain the audit trail.",
            "Promotion requires answer evidence, topic normalization, source provenance, valid four-option format, and duplicate filtering.",
            "Trusted uploaded-book rows can bypass model-agent review only with --trust-book-format-dedupe; untrusted web sources still require agent review.",
        ],
    )
    write_json(output_root / "promotion-report.json", asdict(report))
    return report


def main() -> int:
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")
    parser = argparse.ArgumentParser(description="Promote high-consensus SSC CGL agent-reviewed candidates into app questions.")
    parser.add_argument("--data-dir", type=Path, default=DEFAULT_DATA_DIR)
    parser.add_argument("--output-root", type=Path, default=DEFAULT_OUTPUT_ROOT)
    parser.add_argument("--min-answer-confidence", type=float, default=0.9)
    parser.add_argument("--min-review-confidence", type=float, default=0.8)
    parser.add_argument("--max-items", type=int, default=0)
    parser.add_argument("--source-type", action="append", default=[], help="Only promote candidates with this sourceType. Repeat for multiple types.")
    parser.add_argument("--trust-book-format-dedupe", action="store_true", help="Promote trusted uploaded-book Mistral rows after format, answer, provenance, and duplicate gates without requiring agent review.")
    args = parser.parse_args()

    if not args.data_dir.exists():
        parser.error(f"data directory not found: {args.data_dir}")

    report = promote(
        args.data_dir,
        args.output_root,
        args.min_answer_confidence,
        args.min_review_confidence,
        args.max_items,
        set(args.source_type),
        args.trust_book_format_dedupe,
    )
    gate_summary = (
        f"trusted-book format-gated {report.candidatesWithTrustedBookGate}"
        if args.trust_book_format_dedupe
        else f"agent-reviewed {report.candidatesWithAgentReview}"
    )
    print(
        f"promoted {report.promotedQuestions}/{report.scannedAlignedCandidates}; "
        f"answer consensus {report.candidatesWithAnswerConsensus}; "
        f"{gate_summary}"
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
