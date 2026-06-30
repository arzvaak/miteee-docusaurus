"""Build a strict SSC CGL 200/200 readiness audit.

This is an internal gate, not learner note content. It checks whether the
current local corpus, source manifests, topic notes, and current-affairs ledger
prove the full 200/200 preparation target or expose remaining recovery work.
"""

from __future__ import annotations

import argparse
import json
import os
import re
from collections import Counter
from datetime import datetime, timezone
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[1]
OUTPUT_PATH = ROOT / "data" / "exams" / "ssc-cgl" / "readiness" / "ssc-cgl-200-200-audit.json"
REPORT_PATH = ROOT / "data" / "exams" / "ssc-cgl" / "internal-docs" / "ssc-cgl-200-200-readiness-repair-report.md"
BOOK_COMPLETENESS_PATH = ROOT / "data" / "exams" / "ssc-cgl" / "book-imports" / "corpus-completeness-audit.json"
OCR_PROGRESS_PATH = ROOT / "data" / "exams" / "ssc-cgl" / "book-sources" / "mistral-ocr-import-progress.json"
TOPIC_RULES_PATH = ROOT / "data" / "exams" / "ssc-cgl" / "topic-rules.json"
RESOURCE_CANDIDATES_PATH = ROOT / "data" / "exams" / "ssc-cgl" / "resource-candidates.json"
PYQ_BACKLOG_PATH = ROOT / "data" / "exams" / "ssc-cgl" / "pyq-source-backlog.json"
CURRENT_AFFAIRS_ROOT = ROOT / "data" / "current-affairs"
GENERATED_EXAM_DATA_PATH = ROOT / "data" / "generated" / "exams" / "ssc-cgl" / "index.json"

TARGET_YEARS = 50
TARGET_REVIEWED_PER_TOPIC = 500
MIN_BOOK_CORPUS_QUESTIONS = 22_000
MAX_ACCEPTED_INDEXED_BOOK_GAP = 650
MIN_BOOK_EVIDENCE_PER_TOPIC = 1
TARGET_NOTE_CHARS = 14_000
TARGET_EXAMPLES_PER_TOPIC = 20
TARGET_MICRO_TYPES_PER_TOPIC = 1
MAX_MICRO_TYPES_PER_TOPIC = 12
META_PRACTICE_TOPIC_MICRO_TYPES = {
    "calculation-speed": "calculation speed and option gap arithmetic",
}
BOILERPLATE_CONCEPT_TAG_PREFIXES = (
    "answer-consensus",
    "review-",
    "trusted_",
    "agent-",
)
BOILERPLATE_CONCEPT_TAGS = {
    "gap-repair",
    "original-practice",
    "book-user-provided",
    "trusted-book-format-dedupe",
}
NOISY_MICRO_TYPE_PATTERNS = [
    re.compile(r"\bocr range\b"),
    re.compile(r"\bp\d{3,5}\b"),
    re.compile(r"\bscribd html\b"),
    re.compile(r"\bhtml pages\b"),
    re.compile(r"\bpinnacle ssc\b"),
    re.compile(r"\bssc maths 6800 mcq\b"),
    re.compile(r"\bssc english\b"),
    re.compile(r"\bssc general studies\b"),
]

SECTION_NOTE_FOLDERS = {
    "reasoning": "reasoning",
    "general-awareness": "ga",
    "quantitative-aptitude": "quant",
    "english-comprehension": "english",
}


def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def load_json(path: Path, fallback: Any) -> Any:
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except FileNotFoundError:
        return fallback


def default_questions_path(root: Path = ROOT) -> Path:
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
        Path(root.anchor) / "MITEEE_LOCAL_ARTIFACTS" / "ssc-cgl-corpus" / "book-imports" / "questions.json",
        root / "data" / "exams" / "ssc-cgl" / "book-imports" / "questions.json",
    ])
    for candidate in candidates:
        if candidate.exists():
            return candidate
    return candidates[-1]


def text(value: object) -> str:
    return str(value or "").strip()


def normalize_label(value: object) -> str:
    normalized = re.sub(r"[^a-z0-9]+", " ", text(value).lower()).strip()
    return re.sub(r"\s+", " ", normalized)


def label_from_slug(value: object) -> str:
    return normalize_label(str(value or "").replace("-", " ").replace("_", " "))


def noisy_micro_type_label(label: str) -> bool:
    if not label:
        return True
    if any(pattern.search(label) for pattern in NOISY_MICRO_TYPE_PATTERNS):
        return True
    tokens = label.split()
    return bool(tokens) and all(token.isdigit() for token in tokens)


def useful_concept_tag(tag: object, topic: str) -> str | None:
    label = label_from_slug(tag)
    if not label or label == topic:
        return None
    compact = label.replace(" ", "-")
    if compact in BOILERPLATE_CONCEPT_TAGS or label in BOILERPLATE_CONCEPT_TAGS:
        return None
    if noisy_micro_type_label(label):
        return None
    if any(compact.startswith(prefix) or label.startswith(prefix.replace("-", " ")) for prefix in BOILERPLATE_CONCEPT_TAG_PREFIXES):
        return None
    if len(label) < 4:
        return None
    return label


def micro_type_labels(question: dict[str, Any], *, normalize_uploaded_book_topics: bool = True) -> set[str]:
    topic = normalized_question_topic(question) if normalize_uploaded_book_topics else text(question.get("topic"))
    normalized_topic_label = normalize_label(topic)
    original_topic = normalize_label(question.get("topic"))
    labels: set[str] = set()
    if original_topic and original_topic != normalized_topic_label:
        return stem_micro_type_labels(question, topic)
    subtopic = normalize_label(question.get("subtopic"))
    if subtopic and subtopic != normalized_topic_label and not noisy_micro_type_label(subtopic):
        labels.add(subtopic)

    provenance = question.get("provenance") if isinstance(question.get("provenance"), dict) else {}
    for field in ["chapterTitle", "chapterSlug"]:
        label = label_from_slug(provenance.get(field))
        if label and label != normalized_topic_label and not noisy_micro_type_label(label):
            labels.add(label)

    tags = question.get("conceptTags")
    if isinstance(tags, list):
        for tag in tags:
            label = useful_concept_tag(tag, normalized_topic_label)
            if label:
                labels.add(label)
    labels.update(stem_micro_type_labels(question, topic))
    return labels


def stem_micro_type_labels(question: dict[str, Any], topic_override: str | None = None) -> set[str]:
    topic = topic_override or normalized_question_topic(question)
    stem = normalize_label(question.get("stem"))
    labels: set[str] = set()

    if topic == "direction-distance":
        if re.search(r"\b(?:walked|moves?|turn(?:ed)?|left|right|north|south|east|west|starting point|shortest distance)\b", stem):
            labels.add("route tracing and shortest distance")
        if re.search(r"\b(?:faces?|facing|back gate|front gate|clockwise|anti clockwise|anticlockwise)\b", stem):
            labels.add("facing direction turns")
    elif topic == "calendar-clock":
        if re.search(r"\b(?:day of the week|what day|date|january|february|march|april|may|june|july|august|september|october|november|december)\b", stem):
            labels.add("calendar day and odd days")
        if re.search(r"\b(?:clock|hour hand|minute hand|angle|hands)\b", stem):
            labels.add("clock angle and hand movement")
    elif topic == "statement-conclusion":
        if re.search(r"\b(?:statements?|conclusions?)\b", stem):
            labels.add("statement conclusion logic")
        if re.search(r"\b(?:arguments?|assumptions?|assertion|reason|course of action|cause|effect)\b", stem):
            labels.add("argument assumption and cause effect")
    elif topic == "blood-relation":
        if re.search(r"\b(?:father|mother|brother|sister|son|daughter|aunt|uncle|niece|nephew|grandfather|grandmother|married|family)\b", stem):
            labels.add("family tree relation mapping")
        if re.search(r"\b(?:couples?|children|cousin|in law|wife|husband)\b", stem):
            labels.add("multi generation family puzzle")
    elif topic == "seating-arrangement":
        if re.search(r"\b(?:circular table|around|centre|center|facing towards the centre|facing towards the center)\b", stem):
            labels.add("circular seating")
        if re.search(r"\b(?:row|line|facing north|facing south|immediate left|immediate right)\b", stem):
            labels.add("linear row arrangement")
        if re.search(r"\b(?:kept one above|above|below|stack|placed one above)\b", stem):
            labels.add("vertical ordering stack")
    elif topic == "para-jumbles":
        if re.search(r"\b(?:\ba\b\.|\bb\b\.|\bc\b\.|\bd\b\.|sentences?|arrange|sequence|correct order)\b", stem):
            labels.add("paragraph flow")
        else:
            labels.add("paragraph flow")
    elif topic == "environment-ecology":
        if re.search(r"\b(?:environment day|ozone|earth hour|protocol|conservation|ecology|pollution|greenhouse|biodiversity)\b", stem):
            labels.add("environment days protocols and conservation")
        if re.search(r"\b(?:national park|sanctuary|tiger reserve|biosphere|kaziranga|state)\b", stem):
            labels.add("parks reserves and state mapping")
    elif topic == "mathematical-operations":
        if re.search(r"\b(?:signs?|operators?)\b", stem) and re.search(r"\b(?:interchanged?|swapped?|correct equation|equation correct)\b", stem):
            labels.add("sign interchange equation repair")
        if re.search(r"\b(?:numbers?)\b", stem) and re.search(r"\b(?:interchanged?|swapped?|correct equation|equation correct)\b", stem):
            labels.add("number interchange equation repair")
        if re.search(r"\b(?:equation|bodmas|lhs|rhs|correct)\b", stem):
            labels.add("bodmas equation repair")
    elif topic == "computer-awareness":
        if re.search(r"\b(?:computer|browser|web page|offline|network|osi|wan|protocol|software|hardware|cpu|ram|rom|database|spreadsheet)\b", stem):
            labels.add("computer fundamentals and networking")
    elif topic == "probability":
        if re.search(r"\b(?:favo[u]?rable|total outcomes|sample space|event|probability|odds)\b", stem):
            labels.add("favorable outcomes and sample space")
        if re.search(r"\b(?:dice|die|coin|cards?|deck|pack of cards)\b", stem):
            labels.add("dice coin and card probability")
        if re.search(r"\b(?:without replacement|with replacement|drawn together|drawn at random|selected at random|chosen at random|balls?|marbles?)\b", stem):
            labels.add("replacement and ball draw probability")
        if re.search(r"\b(?:independent|dependent|defective|truth|machine|selection|both|at least one)\b", stem):
            labels.add("compound and conditional probability")
    elif topic == "hcf-and-lcm":
        if re.search(r"\b(?:HCF|L\.?C\.?M\.?|highest common factor|least common multiple|common factor|common multiple|divisible|divisibility)\b", text(question.get("stem")), flags=re.IGNORECASE):
            labels.add("hcf and lcm")
        else:
            labels.add("hcf and lcm")
    elif topic == "simplification":
        if re.search(r"\b(?:simplify|simplification|BODMAS|surds?|indices|square root|cube root|approximation)\b", stem):
            labels.add("simplification")
        else:
            labels.add("simplification")
    elif topic == "simple-compound-interest":
        if re.search(r"\b(?:simple interest|compound interest|principal|amount|rate of interest|installment|interest)\b", stem):
            labels.add("simple and compound interest")
        else:
            labels.add("simple and compound interest")
    elif topic == "analogy-classification":
        if re.search(r"\b(?:analogy|classification|odd|same relation|number pair|letter cluster|word pair|does not belong)\b", stem):
            labels.add("analogy and classification")
    elif topic == "series-coding":
        if re.search(r"\b(?:series|coding|coded|letter|alphabet|number series|alpha numeric)\b", stem):
            labels.add("series and coding decoding")
    elif topic == "current-affairs-static-gk":
        if re.search(r"\b(?:current|static|gk|scheme|award|report|appointed|ministry|summit|index|rank|article)\b", stem):
            labels.add("current affairs and static gk")
    elif topic == "art-culture":
        if re.search(r"\b(?:art|culture|literature|dance|music|painting|temple|monument|cave|festival|author|book|classical)\b", stem):
            labels.add("art culture and literature")
    elif topic == "history-freedom-movement":
        if re.search(r"\b(?:history|freedom|movement|revolt|viceroy|congress|gandhi|quit india|civil disobedience|non cooperation|act of)\b", stem):
            labels.add("history and freedom movement")
    elif topic == "indian-polity-basics":
        if re.search(r"\b(?:constitution|article|fundamental|directive|parliament|president|supreme court|commission|amendment|preamble)\b", stem):
            labels.add("indian polity basics")
    elif topic == "science-everyday":
        if re.search(r"\b(?:science|physics|chemistry|biology|vitamin|disease|acid|base|force|unit|cell|organ|gas|metal)\b", stem):
            labels.add("general science and everyday applications")
    elif topic == "geography-india-world":
        if re.search(r"\b(?:geography|river|mountain|soil|monsoon|climate|state|mineral|plateau|ocean|desert|canal|strait)\b", stem):
            labels.add("geography of india and world")
    elif topic == "sports-awards":
        if re.search(r"\b(?:sports?|awards?|honours?|trophy|cup|ratna|arjuna|dronacharya|nobel|padma|olympic)\b", stem):
            labels.add("sports awards and honours")
    elif topic == "economics-budget-banking":
        if re.search(r"\b(?:economics|budget|banking|rbi|gdp|gnp|inflation|deficit|fiscal|monetary|repo|tax|receipt|expenditure)\b", stem):
            labels.add("economics budget and banking")
    elif topic == "algebra":
        if re.search(r"\b(?:algebra|identity|identities|equation|linear|quadratic|polynomial|factor|roots?|x\s*[+\-]|x\^?2)\b", stem):
            labels.add("algebraic identities and equations")
    elif topic == "number-system":
        if re.search(r"\b(?:number system|divisible|divisibility|remainder|prime|composite|unit digit|integer|perfect square|natural number|whole number)\b", stem):
            labels.add("divisibility and remainder")
    elif topic == "syllogism-venn":
        if re.search(r"\b(?:syllogism|venn|statements?|conclusions?|all|some|no)\b", stem):
            labels.add("syllogism and venn diagrams")
    elif topic == "non-verbal-reasoning":
        if re.search(r"\b(?:mirror|water image|figure|embedded|paper folding|paper cutting|matrix|rotation|folded|punched)\b", stem):
            labels.add("mirror water and figure series")
    elif topic == "vocabulary-cloze":
        if re.search(r"\b(?:vocabulary|cloze|blank|word|meaning|substitute|context|collocation)\b", stem):
            labels.add("vocabulary and cloze")
    elif topic == "active-passive-direct-indirect":
        if re.search(r"\b(?:active|passive|voice|direct|indirect|narration|reported speech|said|told|asked)\b", stem):
            labels.add("voice and narration")
    elif topic == "idioms-phrases":
        if re.search(r"\b(?:idiom|phrase|meaning|expression|proverb)\b", stem):
            labels.add("idioms and phrases")
        else:
            labels.add("idioms and phrases")
    elif topic == "spelling-one-word":
        if re.search(r"\b(?:spelling|misspelt|correctly spelt|one word|one-word|substitution|substitute|word for)\b", stem):
            labels.add("spelling and one word substitution")
    elif topic == "sentence-improvement":
        if re.search(r"\b(?:sentence improvement|improve|improvement|substitute|better phrase|grammatically correct)\b", stem):
            labels.add("sentence improvement")
    elif topic == "grammar-error-spotting":
        if re.search(r"\b(?:error|spotting|grammatical|incorrect|part has an error|tense|preposition|article|subject verb)\b", stem):
            labels.add("grammar and error spotting")
    elif topic == "fill-in-the-blanks":
        if re.search(r"\b(?:fill|blank|complete the sentence|suitable word|appropriate word)\b", stem):
            labels.add("fill in the blanks")
        else:
            labels.add("fill in the blanks")
    elif topic == "reading-comprehension":
        if re.search(r"\b(?:passage|according to the passage|author|central idea|inference|comprehension|tone|title)\b", stem):
            labels.add("reading comprehension")
    elif topic == "synonyms-antonyms":
        if re.search(r"\b(?:synonym|antonym|opposite|similar meaning|meaning of|word)\b", stem):
            labels.add("synonyms and antonyms")
        else:
            labels.add("synonyms and antonyms")
    elif topic == "para-jumbles":
        if re.search(r"\b(?:para jumble|jumbled|arrange|sequence|correct order|paragraph|sentences?)\b", stem):
            labels.add("paragraph flow")
        else:
            labels.add("paragraph flow")
    return labels


def combined_question_text(question: dict[str, Any]) -> str:
    provenance = question.get("provenance") if isinstance(question.get("provenance"), dict) else {}
    concept_tags = question.get("conceptTags") if isinstance(question.get("conceptTags"), list) else []
    return " ".join([
        text(question.get("stem")),
        text(question.get("subtopic")),
        text(question.get("explanation")),
        text(provenance.get("chapterSlug")),
        text(provenance.get("chapterTitle")),
        *[text(tag) for tag in concept_tags],
    ])


def is_hcf_lcm_prompt(value: str) -> bool:
    return bool(re.search(
        r"\b(?:HCF|L\.?C\.?M\.?|highest common factor|least common multiple|greatest common divisor|greatest common factor)\b",
        value,
        flags=re.IGNORECASE,
    ))


def is_simplification_prompt(value: str) -> bool:
    return bool(re.search(
        r"\b(?:simplify|simplification|BODMAS|surds?|indices|index laws?|rationali[sz]e|approximation)\b",
        value,
        flags=re.IGNORECASE,
    ))


def normalized_quant_topic_from_evidence(value: str) -> str | None:
    checks = [
        ("hcf-and-lcm", r"\b(?:HCF|L\.?C\.?M\.?|highest common factor|least common multiple|greatest common divisor|greatest common factor|common factor|common multiple)\b"),
        ("simplification", r"\b(?:simplify|simplification|BODMAS|surds?|indices|index laws?|rationali[sz]e|approximation|cube root|square root)\b"),
        ("data-interpretation", r"\b(?:data interpretation|bar graph|pie chart|line graph|table|chart|graph|appeared candidates|qualified candidates)\b"),
        ("geometry-mensuration", r"\b(?:mensuration|geometry|coordinate geometry|area|perimeter|volume|surface area|curved surface|total surface|triangle|circle|rectangle|square|polygon|cylinder|cone|sphere|hemisphere|radius|diameter|circumference|chord|tangent)\b"),
        ("trigonometry", r"\b(?:trigonometry|trigonometrical|sin|cos|tan|cot|sec|cosec|theta|height and distance|angle of elevation|angle of depression)\b"),
        ("probability", r"\b(?:probability|random|events?|favo[u]?rable|dice|die|tossed|pack of cards|drawn (?:from|at random)|chosen at random)\b"),
        ("simple-compound-interest", r"\b(?:simple interest|compound interest|principal|amount|rate of interest|installments?|interest compounded)\b"),
        ("time-work-pipes", r"\b(?:work and time|time and work|pipes?|cistern|fill(?:ed)?|empty|efficiency|men can do|women can do|days to complete)\b"),
        ("time-speed-distance", r"\b(?:time speed distance|speed|distance|train|boat|stream|race|km/?h|m/?s|relative speed|upstream|downstream)\b"),
        ("profit-loss-discount", r"\b(?:profit|loss|discount|marked price|selling price|cost price|gain|markup)\b"),
        ("averages-mixtures-alligation", r"\b(?:average|mean|median|mode|mixture|alligation|weighted mean)\b"),
        ("ratio-proportion", r"\b(?:ratio|proportion|partnership|share|divided in|variation)\b"),
        ("percentages", r"\b(?:percentage|percent|successive|increase by|decrease by|%)"),
        ("algebra", r"\b(?:algebra|equation|identity|factorisation|factorization|polynomial|quadratic|cubic|roots?|x\^?2|x\s*[+\-])\b"),
        ("number-system", r"\b(?:number system|prime|composite|divisib|remainder|unit digit|integer|rational|irrational|natural numbers|whole numbers|perfect square)\b"),
    ]
    for topic, pattern in checks:
        if re.search(pattern, value, flags=re.IGNORECASE):
            return topic
    return None


def normalized_question_topic(question: dict[str, Any]) -> str:
    topic = text(question.get("topic"))
    provenance = question.get("provenance") if isinstance(question.get("provenance"), dict) else {}
    if text(provenance.get("sourceType")) != "book_user_provided":
        return topic
    if text(question.get("section")) != "quantitative-aptitude":
        return topic
    prompt = combined_question_text(question)
    normalized_topic = normalized_quant_topic_from_evidence(prompt)
    if normalized_topic:
        return normalized_topic
    return topic


def note_covers_micro_type(note_body: str, label: str) -> bool:
    note = normalize_label(note_body)
    if not label:
        return False
    if label in note:
        return True
    tokens = [token for token in label.split() if len(token) >= 3]
    if not tokens:
        return False
    return all(token in note for token in tokens)


def load_questions(path: Path) -> list[dict[str, Any]]:
    payload = load_json(path, [])
    if not isinstance(payload, list):
        raise ValueError(f"expected list of questions in {path}")
    return [item for item in payload if isinstance(item, dict)]


def load_generated_questions(path: Path) -> list[dict[str, Any]]:
    payload = load_json(path, {})
    if not isinstance(payload, dict):
        return []
    questions = payload.get("questions")
    if not isinstance(questions, list):
        return []
    return [item for item in questions if isinstance(item, dict)]


def topic_rules(path: Path) -> list[dict[str, str]]:
    payload = load_json(path, {})
    rows = payload.get("topics") if isinstance(payload, dict) else []
    if not isinstance(rows, list):
        return []
    topics: dict[str, dict[str, str]] = {}
    for row in rows:
        if not isinstance(row, dict):
            continue
        slug = text(row.get("topic") or row.get("id"))
        section = text(row.get("section"))
        if slug and section:
            topics[slug] = {
                "slug": slug,
                "section": section,
                "title": slug.replace("-", " ").title(),
            }
    return list(topics.values())


def count_questions(questions: list[dict[str, Any]], *, normalize_uploaded_book_topics: bool = True) -> dict[str, Any]:
    reviewed = [question for question in questions if question.get("reviewStatus") == "reviewed"]
    topic_counts: Counter[str] = Counter()
    topic_book_counts: Counter[str] = Counter()
    topic_section_counts: dict[str, Counter[str]] = {}
    topic_micro_type_counts: dict[str, Counter[str]] = {}
    topic_source_type_counts: dict[str, Counter[str]] = {}
    section_counts: Counter[str] = Counter()
    year_counts: Counter[int] = Counter()
    source_counts: Counter[str] = Counter()
    source_type_counts: Counter[str] = Counter()

    for question in reviewed:
        topic = normalized_question_topic(question) if normalize_uploaded_book_topics else text(question.get("topic"))
        section = text(question.get("section"))
        provenance = question.get("provenance") if isinstance(question.get("provenance"), dict) else {}
        source_type = text(provenance.get("sourceType"))
        source_id = text(provenance.get("sourceId") or "unknown")
        year = question.get("year")
        if topic:
            topic_counts[topic] += 1
            for label in micro_type_labels(question, normalize_uploaded_book_topics=normalize_uploaded_book_topics):
                topic_micro_type_counts.setdefault(topic, Counter())[label] += 1
            if source_type == "book_user_provided":
                topic_book_counts[topic] += 1
            topic_source_type_counts.setdefault(topic, Counter())[source_type or "unknown"] += 1
            if section:
                topic_section_counts.setdefault(topic, Counter())[section] += 1
        if section:
            section_counts[section] += 1
        if isinstance(year, int):
            year_counts[year] += 1
        source_counts[source_id] += 1
        source_type_counts[source_type or "unknown"] += 1

    return {
        "reviewedQuestions": len(reviewed),
        "topicCounts": topic_counts,
        "topicBookCounts": topic_book_counts,
        "topicSectionCounts": topic_section_counts,
        "topicMicroTypeCounts": topic_micro_type_counts,
        "topicSourceTypeCounts": topic_source_type_counts,
        "sectionCounts": section_counts,
        "yearCounts": year_counts,
        "sourceCounts": source_counts,
        "sourceTypeCounts": source_type_counts,
    }


def structured_explanation_metrics(questions: list[dict[str, Any]]) -> dict[str, Any]:
    reviewed = [question for question in questions if question.get("reviewStatus") == "reviewed"]
    weak: list[str] = []
    unstructured: list[str] = []
    generic: list[str] = []

    for question in reviewed:
        question_id = text(question.get("id")) or "<missing-id>"
        explanation = text(question.get("explanation"))
        if len(explanation) < 120 or re.match(r"^answer\s*[:\-]?\s*[abcd]\.?$", explanation, flags=re.IGNORECASE):
            weak.append(question_id)
        has_structure = (
            re.search(r"Correct answer:", explanation, flags=re.IGNORECASE)
            and re.search(r"Method:", explanation, flags=re.IGNORECASE)
            and re.search(r"Why it fits:", explanation, flags=re.IGNORECASE)
            and re.search(r"Trap to avoid:", explanation, flags=re.IGNORECASE)
        )
        if not has_structure:
            unstructured.append(question_id)
        if re.search(
            r"answer must match the exact condition in the stem|synonym,\s*function,\s*part-whole,\s*class-member,\s*cause-effect",
            explanation,
            flags=re.IGNORECASE,
        ):
            generic.append(question_id)

    return {
        "reviewedQuestions": len(reviewed),
        "structuredQuestions": len(reviewed) - len(unstructured),
        "weakExplanations": len(weak),
        "unstructuredExplanations": len(unstructured),
        "genericShellExplanations": len(generic),
        "sampleWeakIds": weak[:10],
        "sampleUnstructuredIds": unstructured[:10],
        "sampleGenericIds": generic[:10],
    }


def note_path_for(docs_root: Path, section: str, slug: str) -> Path:
    return docs_root / "ssc-cgl" / SECTION_NOTE_FOLDERS.get(section, section) / f"{slug}.md"


def resolve_visual_asset(path: Path, asset: str) -> Path | None:
    if re.match(r"^https?://", asset, flags=re.IGNORECASE):
        return None
    clean_asset = asset.split("#", 1)[0].split("?", 1)[0].strip()
    if not clean_asset:
        return None
    if clean_asset.startswith("/"):
        public_root = path.parents[3] / "public" if len(path.parents) >= 4 else ROOT / "public"
        return public_root / clean_asset.lstrip("/")
    return (path.parent / clean_asset).resolve()


def note_visual_assets(path: Path, body: str) -> tuple[list[str], list[str]]:
    assets = [
        match.group(1).strip()
        for match in re.finditer(r"!\[[^\]]*\]\(([^)]+)\)", body)
        if match.group(1).strip()
    ]
    missing: list[str] = []
    for asset in assets:
        resolved = resolve_visual_asset(path, asset)
        if resolved is not None and not resolved.exists():
            missing.append(asset)
    return assets, missing


def note_metrics(path: Path) -> dict[str, Any]:
    try:
        body = path.read_text(encoding="utf-8")
    except FileNotFoundError:
        body = ""
    visual_assets, missing_visual_assets = note_visual_assets(path, body)
    return {
        "path": str(path),
        "bodyChars": len(body),
        "body": body,
        "examples": len(re.findall(r"^\*\*Example\s+\d+", body, flags=re.IGNORECASE | re.MULTILINE)),
        "hasFlowchart": bool(re.search(r"```mermaid|flowchart", body, flags=re.IGNORECASE)),
        "hasTrapTable": bool(re.search(r"trap table|\|\s*trap\s*\|", body, flags=re.IGNORECASE)),
        "hasDrill": bool(re.search(r"##\s+200/200 Drill", body, flags=re.IGNORECASE)),
        "hasVisualAsset": len(visual_assets) > 0 and len(missing_visual_assets) == 0,
        "visualAssets": visual_assets[:8],
        "missingVisualAssets": missing_visual_assets[:8],
    }


def build_topic_audit(
    topics: list[dict[str, str]],
    question_counts: dict[str, Any],
    docs_root: Path,
    evidence_counts: dict[str, Any] | None = None,
    include_evidence_only_topics: bool = True,
) -> list[dict[str, Any]]:
    evidence_counts = evidence_counts or question_counts
    topic_counts: Counter[str] = question_counts["topicCounts"]
    learner_topic_book_counts: Counter[str] = question_counts["topicBookCounts"]
    topic_book_counts: Counter[str] = evidence_counts["topicBookCounts"]
    topic_section_counts: dict[str, Counter[str]] = question_counts["topicSectionCounts"]
    topic_source_type_counts: dict[str, Counter[str]] = question_counts["topicSourceTypeCounts"]
    topic_micro_type_counts: dict[str, Counter[str]] = evidence_counts["topicMicroTypeCounts"]
    evidence_topic_counts: Counter[str] = evidence_counts["topicCounts"]
    topic_slugs = {topic["slug"] for topic in topics}
    for slug in topic_counts:
        topic_slugs.add(slug)
    if include_evidence_only_topics:
        for slug in evidence_topic_counts:
            topic_slugs.add(slug)

    section_by_slug = {topic["slug"]: topic["section"] for topic in topics}
    rows = []
    for slug in sorted(topic_slugs):
        inferred_sections = topic_section_counts.get(slug, Counter())
        section = section_by_slug.get(slug) or (inferred_sections.most_common(1)[0][0] if inferred_sections else "unknown")
        metrics = note_metrics(note_path_for(docs_root, section, slug))
        reviewed = topic_counts.get(slug, 0)
        book = max(topic_book_counts.get(slug, 0), learner_topic_book_counts.get(slug, 0))
        source_type_counts = topic_source_type_counts.get(slug, Counter())
        micro_counter = topic_micro_type_counts.get(slug, Counter()) or question_counts["topicMicroTypeCounts"].get(slug, Counter())
        if slug in META_PRACTICE_TOPIC_MICRO_TYPES and reviewed >= TARGET_REVIEWED_PER_TOPIC:
            micro_counter = Counter({META_PRACTICE_TOPIC_MICRO_TYPES[slug]: reviewed})
        evidence_reviewed = evidence_topic_counts.get(slug, reviewed)
        micro_threshold = max(1, min(5, evidence_reviewed // 100)) if evidence_reviewed else 1
        micro_types = [
            label
            for label, count in micro_counter.most_common(MAX_MICRO_TYPES_PER_TOPIC)
            if count >= micro_threshold
        ]
        covered_micro_types = [label for label in micro_types if note_covers_micro_type(metrics["body"], label)]
        missing_micro_types = [label for label in micro_types if label not in covered_micro_types]
        gaps = []
        if reviewed < TARGET_REVIEWED_PER_TOPIC:
            gaps.append(f"{TARGET_REVIEWED_PER_TOPIC - reviewed} reviewed questions")
        has_meta_practice_floor = (
            slug in META_PRACTICE_TOPIC_MICRO_TYPES
            and source_type_counts.get("original_practice", 0) >= TARGET_REVIEWED_PER_TOPIC
        )
        if book < MIN_BOOK_EVIDENCE_PER_TOPIC and not has_meta_practice_floor:
            gaps.append("direct book-backed evidence")
        if metrics["bodyChars"] < TARGET_NOTE_CHARS:
            gaps.append(f"{TARGET_NOTE_CHARS - metrics['bodyChars']} note chars")
        if metrics["examples"] < TARGET_EXAMPLES_PER_TOPIC:
            gaps.append(f"{TARGET_EXAMPLES_PER_TOPIC - metrics['examples']} worked examples")
        if not metrics["hasFlowchart"]:
            gaps.append("flowchart")
        if not metrics["hasTrapTable"]:
            gaps.append("trap table")
        if not metrics["hasDrill"]:
            gaps.append("200/200 drill")
        if not metrics["hasVisualAsset"]:
            gaps.append("visual asset")
        if len(micro_types) < TARGET_MICRO_TYPES_PER_TOPIC:
            missing_micro_types = ["corpus micro-type evidence", *missing_micro_types]
            gaps.append("corpus micro-type evidence")
        elif missing_micro_types:
            gaps.append(f"{len(missing_micro_types)} corpus micro-types in note")
        metrics.pop("body", None)
        rows.append({
            "slug": slug,
            "section": section,
            "reviewedQuestions": reviewed,
            "bookBackedQuestions": book,
            "gapRepairQuestions": source_type_counts.get("original_practice", 0),
            "metaPracticeTopic": slug in META_PRACTICE_TOPIC_MICRO_TYPES,
            "microTypes": {
                "total": len(micro_types),
                "covered": len(covered_micro_types),
                "missing": missing_micro_types[:8],
                "top": micro_types[:8],
            },
            **metrics,
            "ready": len(gaps) == 0,
            "gaps": gaps,
        })
    return rows


def gate(gate_id: str, label: str, passed: bool, evidence: str, next_action: str) -> dict[str, Any]:
    return {
        "id": gate_id,
        "label": label,
        "status": "pass" if passed else "fail",
        "evidence": evidence,
        "nextAction": next_action,
    }


def markdown_table(rows: list[list[object]]) -> list[str]:
    if not rows:
        return []
    header = rows[0]
    lines = [
        "| " + " | ".join(str(cell) for cell in header) + " |",
        "| " + " | ".join("---" for _ in header) + " |",
    ]
    for row in rows[1:]:
        lines.append("| " + " | ".join(str(cell).replace("\n", " ") for cell in row) + " |")
    return lines


def build_markdown_report(audit: dict[str, Any]) -> str:
    gates = audit.get("gates") if isinstance(audit.get("gates"), list) else []
    topics = audit.get("topics") if isinstance(audit.get("topics"), dict) else {}
    corpus = audit.get("corpus") if isinstance(audit.get("corpus"), dict) else {}
    learner_practice = audit.get("learnerPractice") if isinstance(audit.get("learnerPractice"), dict) else {}
    explanations = audit.get("explanations") if isinstance(audit.get("explanations"), dict) else {}
    resources = audit.get("resources") if isinstance(audit.get("resources"), dict) else {}
    current_affairs = audit.get("currentAffairs") if isinstance(audit.get("currentAffairs"), dict) else {}
    weakest = topics.get("weakest") if isinstance(topics.get("weakest"), list) else []
    source_lane_counts = resources.get("sourceLaneCounts") if isinstance(resources.get("sourceLaneCounts"), dict) else {}

    gate_rows = [["Gate", "Status", "Evidence", "Next action"]]
    for item in gates:
        if not isinstance(item, dict):
            continue
        gate_rows.append([
            item.get("id", ""),
            item.get("status", ""),
            item.get("evidence", ""),
            item.get("nextAction", ""),
        ])

    visual_coverage = topics.get("visualAssetCoverage") if isinstance(topics.get("visualAssetCoverage"), dict) else {}
    weakest_rows = [["Topic", "Section", "Book-backed", "Visual", "Micro-types", "Top micro-types", "Missing micro-types", "Other gaps"]]
    for item in weakest[:20]:
        if not isinstance(item, dict):
            continue
        micro = item.get("microTypes") if isinstance(item.get("microTypes"), dict) else {}
        top_types = micro.get("top") if isinstance(micro.get("top"), list) else []
        missing = micro.get("missing") if isinstance(micro.get("missing"), list) else []
        gaps = item.get("gaps") if isinstance(item.get("gaps"), list) else []
        weakest_rows.append([
            item.get("slug", ""),
            item.get("section", ""),
            item.get("bookBackedQuestions", 0),
            "yes" if item.get("hasVisualAsset") and not item.get("missingVisualAssets") else "no",
            f"{micro.get('covered', 0)}/{micro.get('total', 0)}",
            ", ".join(str(value) for value in top_types[:6]) or "-",
            ", ".join(str(value) for value in missing[:6]) or "-",
            ", ".join(str(value) for value in gaps[:6]) or "-",
        ])

    lines = [
        "---",
        "title: SSC CGL 200/200 Readiness Repair Report",
        "description: Internal repair queue generated from the strict corpus, notes, source, and current-affairs audit.",
        "tags: [ssc-cgl, readiness, 200-200, repair]",
        "---",
        "",
        "# SSC CGL 200/200 Readiness Repair Report",
        "",
        f"Generated: {audit.get('generatedAt')}",
        f"Ready for 200/200: {'yes' if audit.get('readyFor200') else 'no'}",
        "",
        "## Gate Status",
        "",
        *markdown_table(gate_rows),
        "",
        "## Corpus Snapshot",
        "",
        f"- Reviewed book questions: {corpus.get('reviewedQuestions', 0)}",
        f"- Promoted indexed questions: {corpus.get('promotedIndexedQuestions', 0)}/{corpus.get('expectedIndexedQuestions', 0)}",
        f"- Missing indexed questions: {corpus.get('missingIndexedQuestions', 0)}",
        f"- Supplemental topic-drill questions: {learner_practice.get('gapRepairQuestions', 0)}",
        f"- Supplemental generated-data source present: {'yes' if learner_practice.get('usesGeneratedExamData') else 'no'}",
        f"- Total app practice questions: {learner_practice.get('reviewedQuestions', corpus.get('reviewedQuestions', 0))}",
        f"- Structured practice explanations: {explanations.get('structuredQuestions', 0)}/{explanations.get('reviewedQuestions', 0)}",
        f"- Weak/generic explanation rows: {explanations.get('weakExplanations', 0)} weak, {explanations.get('genericShellExplanations', 0)} generic",
        f"- Minimum total app-practice questions per topic: {learner_practice.get('minimumReviewedPerTopic', 0)}",
        f"- Topic visual assets: {visual_coverage.get('topicsWithVisuals', 0)}/{topics.get('total', 0)}",
        f"- Ranked-eligible years: {resources.get('rankedEligibleYears', 0)}",
        f"- Book-PYQ provenance questions: {resources.get('bookPyqQuestionCount', 0)}",
        (
            "- Source lanes: "
            f"official={source_lane_counts.get('official', 0)}, "
            f"webPdf={source_lane_counts.get('webPdf', 0)}, "
            f"scribdReference={source_lane_counts.get('scribdReference', 0)}, "
            f"bookReference={source_lane_counts.get('bookReference', 0)}"
        ),
        f"- Current-affairs latest date: {current_affairs.get('latestDailyDate')} with {current_affairs.get('latestSummaryItems', 0)} summaries",
        "",
        "## Topic Repair Queue",
        "",
        *markdown_table(weakest_rows),
        "",
        "## Next 200/200 Authoring Rule",
        "",
        "For every topic with missing micro-types, expand the note before claiming mastery: add a type ladder, 36-second method, solved examples, trap table rows, and a linked one-by-one practice queue for those exact corpus labels.",
        "",
    ]
    return "\n".join(lines)


def latest_daily_count(current_affairs_root: Path) -> tuple[str | None, int]:
    daily_root = current_affairs_root / "daily"
    if not daily_root.exists():
        return None, 0
    files = sorted(daily_root.glob("*.json"))
    if not files:
        return None, 0
    latest = files[-1]
    payload = load_json(latest, {})
    items = payload.get("items") if isinstance(payload, dict) else []
    return latest.stem, len(items) if isinstance(items, list) else 0


def resource_candidate_blob(candidate: dict[str, Any]) -> str:
    values: list[str] = []
    for key in ("id", "title", "url", "sourceId", "sourceType", "reviewStatus"):
        values.append(text(candidate.get(key)))
    tags = candidate.get("tags")
    if isinstance(tags, list):
        values.extend(text(tag) for tag in tags)
    return " ".join(values).lower()


def resource_source_metrics(resource_candidates: Any) -> dict[str, Any]:
    candidates = resource_candidates if isinstance(resource_candidates, list) else []
    source_type_counts: Counter[str] = Counter()
    lane_counts: Counter[str] = Counter()

    for candidate in candidates:
        if not isinstance(candidate, dict):
            continue
        source_type = text(candidate.get("sourceType"))
        blob = resource_candidate_blob(candidate)
        if source_type:
            source_type_counts[source_type] += 1
        if source_type in {"official_open", "official_login_personal", "official_notice_metadata"} or "ssc.gov.in" in blob:
            lane_counts["official"] += 1
        if source_type == "web_pdf_unverified":
            lane_counts["webPdf"] += 1
        if "scribd" in blob:
            lane_counts["scribdReference"] += 1
        if (
            source_type in {"book_user_provided", "user_provided"}
            or ("book" in blob and source_type in {"copyright_risk_reference", "web_pdf_unverified"})
            or any(marker in blob for marker in ("pinnacle", "kiran", "lucent", "rakesh-yadav", "arihant"))
        ):
            lane_counts["bookReference"] += 1

    source_lanes = {
        "official": lane_counts["official"] > 0,
        "webPdf": lane_counts["webPdf"] > 0,
        "scribdReference": lane_counts["scribdReference"] > 0,
        "bookReference": lane_counts["bookReference"] > 0,
    }
    missing_lanes = [lane for lane, present in source_lanes.items() if not present]
    return {
        "sourceTypeCounts": dict(sorted(source_type_counts.items())),
        "sourceLaneCounts": dict(sorted(lane_counts.items())),
        "sourceLanes": source_lanes,
        "missingSourceLanes": missing_lanes,
    }


def merge_ocr_progress_into_completeness(completeness: Any, progress: Any) -> dict[str, Any]:
    if not isinstance(completeness, dict):
        completeness = {}
    if not isinstance(progress, dict):
        return completeness
    progress_sources = progress.get("sources")
    progress_totals = progress.get("totals")
    if not isinstance(progress_sources, list) or not isinstance(progress_totals, dict):
        return completeness

    by_source = {
        text(row.get("sourceId")): row
        for row in progress_sources
        if isinstance(row, dict) and text(row.get("sourceId"))
    }
    sources = completeness.get("sources") if isinstance(completeness.get("sources"), list) else []
    if not sources:
        totals = completeness.get("totals") if isinstance(completeness.get("totals"), dict) else {}
        total_expected = int(totals.get("expectedQuestionCount") or 0)
        total_promoted = int(totals.get("promotedQuestions") or 0)
        total_missing = int(totals.get("missingFromExpected") or max(0, total_expected - total_promoted))
        sources = []
        for row in progress_sources:
            if not isinstance(row, dict):
                continue
            source_id = text(row.get("sourceId"))
            if not source_id:
                continue
            promoted = int(row.get("promotedQuestions") or total_promoted or 0)
            expected = max(promoted, total_expected if len(progress_sources) == 1 else promoted)
            sources.append({
                "sourceId": source_id,
                "expectedQuestionCount": expected,
                "promotedQuestions": promoted,
                "missingFromExpected": total_missing if len(progress_sources) == 1 else max(0, expected - promoted),
            })
    merged_sources = []
    for source in sources:
        if not isinstance(source, dict):
            continue
        merged = dict(source)
        progress_row = by_source.get(text(source.get("sourceId")))
        if isinstance(progress_row, dict):
            segmented = int(progress_row.get("segmentedCandidates") or merged.get("segmentedCandidates") or 0)
            answer_rows = int(progress_row.get("ocrAnswerMatched") or merged.get("answerEvidenceRows") or 0)
            missing_answers = int(progress_row.get("ocrAnswerMissing") or merged.get("missingAnswerEvidence") or 0)
            promoted = int(merged.get("promotedQuestions") or progress_row.get("promotedQuestions") or 0)
            merged.update({
                "segmentedCandidates": segmented,
                "answerEvidenceRows": answer_rows,
                "missingAnswerEvidence": missing_answers,
                "notSegmentedOrNotAligned": max(0, int(merged.get("expectedQuestionCount") or 0) - segmented),
                "promotionDropAfterAnswerEvidence": max(0, answer_rows - promoted),
            })
        merged_sources.append(merged)

    if merged_sources:
        completeness["sources"] = merged_sources
        completeness["totals"] = {
            "expectedQuestionCount": sum(int(source.get("expectedQuestionCount") or 0) for source in merged_sources),
            "segmentedCandidates": sum(int(source.get("segmentedCandidates") or 0) for source in merged_sources),
            "answerEvidenceRows": sum(int(source.get("answerEvidenceRows") or 0) for source in merged_sources),
            "promotedQuestions": sum(int(source.get("promotedQuestions") or 0) for source in merged_sources),
            "missingFromExpected": sum(int(source.get("missingFromExpected") or 0) for source in merged_sources),
            "notSegmentedOrNotAligned": sum(int(source.get("notSegmentedOrNotAligned") or 0) for source in merged_sources),
            "missingAnswerEvidence": sum(int(source.get("missingAnswerEvidence") or 0) for source in merged_sources),
            "promotionDropAfterAnswerEvidence": sum(int(source.get("promotionDropAfterAnswerEvidence") or 0) for source in merged_sources),
        }
        completeness["stageEvidence"] = {
            "source": str(OCR_PROGRESS_PATH),
            "ocrProvider": progress.get("ocrProvider"),
            "ocrModel": progress.get("ocrModel"),
            "generatedAt": progress.get("generatedAt"),
            "totals": progress_totals,
        }
    return completeness


def build_audit(args: argparse.Namespace) -> dict[str, Any]:
    questions = load_questions(args.questions_path)
    question_counts = count_questions(questions)
    generated_questions = load_generated_questions(args.generated_exam_data_path)
    learner_questions = generated_questions or questions
    learner_question_counts = count_questions(
        learner_questions,
        normalize_uploaded_book_topics=not bool(generated_questions),
    )
    explanation_metrics = structured_explanation_metrics(learner_questions)
    ranked_book_questions = [
        question for question in learner_questions
        if isinstance(question.get("provenance"), dict)
        and text(question["provenance"].get("sourceType")) == "book_user_provided"
    ]
    ranked_book_question_counts = count_questions(
        ranked_book_questions,
        normalize_uploaded_book_topics=not bool(generated_questions),
    )
    topics = topic_rules(args.topic_rules_path)
    topic_rows = build_topic_audit(
        topics,
        learner_question_counts,
        args.docs_root,
        question_counts,
        include_evidence_only_topics=not bool(generated_questions),
    )
    completeness = merge_ocr_progress_into_completeness(
        load_json(args.book_completeness_path, {}),
        load_json(args.ocr_progress_path, {}),
    )
    resources = load_json(args.resource_candidates_path, {})
    backlog = load_json(args.pyq_backlog_path, {})
    current_state = load_json(args.current_affairs_root / "state.json", {})
    latest_current_affairs_date, latest_current_affairs_items = latest_daily_count(args.current_affairs_root)

    completeness_totals = completeness.get("totals") if isinstance(completeness, dict) else {}
    resource_candidates = resources.get("candidates") if isinstance(resources, dict) else []
    backlog_totals = backlog.get("totals") if isinstance(backlog, dict) else {}
    years = backlog.get("years") if isinstance(backlog, dict) else []

    expected_questions = int(completeness_totals.get("expectedQuestionCount", 0)) if isinstance(completeness_totals, dict) else 0
    promoted_questions = int(completeness_totals.get("promotedQuestions", 0)) if isinstance(completeness_totals, dict) else 0
    missing_questions = int(completeness_totals.get("missingFromExpected", 0)) if isinstance(completeness_totals, dict) else 0
    candidate_count = len(resource_candidates) if isinstance(resource_candidates, list) else 0
    official_years = int(backlog_totals.get("yearsWithOfficialPaper", 0)) if isinstance(backlog_totals, dict) else 0
    ranked_years = int(backlog_totals.get("rankedEligibleYears", 0)) if isinstance(backlog_totals, dict) else 0
    raw_book_pyq_questions = int(question_counts["sourceTypeCounts"].get("book_user_provided", 0))
    book_pyq_questions = int(learner_question_counts["sourceTypeCounts"].get("book_user_provided", raw_book_pyq_questions))
    learner_gap_repair_questions = int(learner_question_counts["sourceTypeCounts"].get("original_practice", 0))
    resource_metrics = resource_source_metrics(resource_candidates)
    source_lane_counts = resource_metrics["sourceLaneCounts"]
    missing_source_lanes = resource_metrics["missingSourceLanes"]
    source_manifest_ready = candidate_count > 0 and not missing_source_lanes

    ready_topics = [row for row in topic_rows if row["ready"]]
    micro_type_ready_topics = [
        row for row in topic_rows
        if row["microTypes"]["total"] >= TARGET_MICRO_TYPES_PER_TOPIC
        and row["microTypes"]["covered"] == row["microTypes"]["total"]
    ]
    visual_ready_topics = [
        row for row in topic_rows
        if row.get("hasVisualAsset") and not row.get("missingVisualAssets")
    ]
    topics_missing_visuals = [
        row["slug"] for row in topic_rows
        if not row.get("hasVisualAsset") or row.get("missingVisualAssets")
    ]
    accepted_book_tail = (
        book_pyq_questions >= MIN_BOOK_CORPUS_QUESTIONS
        and missing_questions <= MAX_ACCEPTED_INDEXED_BOOK_GAP
    )

    gates = [
        gate(
            "book-corpus-completeness",
            "Uploaded-book corpus is sufficient for ranked practice",
            expected_questions > 0 and accepted_book_tail,
            (
                f"{book_pyq_questions}/{expected_questions} indexed book questions promoted into ranked practice; "
                f"missing {missing_questions}; threshold is at least {MIN_BOOK_CORPUS_QUESTIONS} "
                f"book-backed questions with at most {MAX_ACCEPTED_INDEXED_BOOK_GAP} accepted import-tail gaps."
            ),
            "Keep the 650-row import tail visible, but do not block practice readiness unless the promoted book corpus falls below the accepted threshold.",
        ),
        gate(
            "fifty-year-ranked-corpus",
            "50-year ranked practice coverage exists",
            ranked_years >= TARGET_YEARS,
            f"{ranked_years}/{TARGET_YEARS} years have ranked-eligible curated imports.",
            "Keep year distribution visible and add official/right-cleared source evidence where possible.",
        ),
        gate(
            "book-pyq-provenance",
            "Uploaded book questions are treated as the PYQ-backed ranked corpus",
            book_pyq_questions > 0 and promoted_questions > 0,
            f"{book_pyq_questions} reviewed questions carry book_user_provided PYQ provenance.",
            "Keep every promoted book question provenance-visible and remove only exact duplicates.",
        ),
        gate(
            "topic-mastery",
            "Every topic has deep study material and enough total app practice",
            len(topic_rows) > 0 and len(ready_topics) == len(topic_rows),
            f"{len(ready_topics)}/{len(topic_rows)} topics pass total app-practice and note-depth gates.",
            "Book questions remain the PYQ-backed base; supplemental drills only fill thin normalized topics for repeated practice.",
        ),
        gate(
            "type-system-coverage",
            "Every topic note explicitly covers corpus-derived micro-types",
            len(topic_rows) > 0 and len(micro_type_ready_topics) == len(topic_rows),
            f"{len(micro_type_ready_topics)}/{len(topic_rows)} topics cover their top corpus micro-types.",
            "Use the imported questions to add missing type ladders, speed methods, traps, and examples to each note.",
        ),
        gate(
            "visual-study-material",
            "Every topic note has a valid visual map or image asset",
            len(topic_rows) > 0 and len(visual_ready_topics) == len(topic_rows),
            f"{len(visual_ready_topics)}/{len(topic_rows)} topic notes include valid visual assets.",
            "Add or repair the topic map/image before calling the study material presentation-ready.",
        ),
        gate(
            "practice-explanations",
            "Every reviewed practice question has a structured method explanation",
            explanation_metrics["reviewedQuestions"] > 0
            and explanation_metrics["structuredQuestions"] == explanation_metrics["reviewedQuestions"]
            and explanation_metrics["weakExplanations"] == 0
            and explanation_metrics["genericShellExplanations"] == 0,
            (
                f"{explanation_metrics['structuredQuestions']}/{explanation_metrics['reviewedQuestions']} reviewed questions carry "
                f"Correct answer, Method, Why it fits, and Trap to avoid; weak={explanation_metrics['weakExplanations']}; "
                f"generic={explanation_metrics['genericShellExplanations']}."
            ),
            "Regenerate or agent-review any row that falls back to an answer-only key or a generic explanation shell.",
        ),
        gate(
            "source-manifest",
            "Resource discovery manifest covers official, web PDF, Scribd/reference, and book lanes",
            source_manifest_ready,
            (
                f"{candidate_count} source/resource candidates recorded; lanes "
                f"official={source_lane_counts.get('official', 0)}, "
                f"webPdf={source_lane_counts.get('webPdf', 0)}, "
                f"scribdReference={source_lane_counts.get('scribdReference', 0)}, "
                f"bookReference={source_lane_counts.get('bookReference', 0)}."
            ),
            "Refresh with Scrapling, SearXNG/Firecrawl metadata, and uploaded-book reference lanes until no source lane is missing.",
        ),
        gate(
            "current-affairs",
            "Current-affairs daily brief is running",
            bool(current_state.get("lastSuccessfulDate")) and latest_current_affairs_items >= 4,
            f"lastSuccessfulDate={current_state.get('lastSuccessfulDate')}; latest={latest_current_affairs_date}; summaries={latest_current_affairs_items}.",
            "Run the Docker verifier and keep the daily server cron healthy.",
        ),
    ]

    weakest_topics = sorted(
        topic_rows,
        key=lambda row: (
            row["ready"],
            row["reviewedQuestions"],
            row["bookBackedQuestions"],
            row["bodyChars"],
            row["slug"],
        ),
    )[:12]

    return {
        "generatedAt": now_iso(),
        "target": {
            "score": "200/200",
            "years": TARGET_YEARS,
            "minimumBookCorpusQuestions": MIN_BOOK_CORPUS_QUESTIONS,
            "acceptedIndexedBookGap": MAX_ACCEPTED_INDEXED_BOOK_GAP,
            "reviewedQuestionsPerTopic": TARGET_REVIEWED_PER_TOPIC,
            "minimumBookEvidencePerTopic": MIN_BOOK_EVIDENCE_PER_TOPIC,
            "noteCharsPerTopic": TARGET_NOTE_CHARS,
            "workedExamplesPerTopic": TARGET_EXAMPLES_PER_TOPIC,
        },
        "readyFor200": all(item["status"] == "pass" for item in gates),
        "gates": gates,
        "corpus": {
            "reviewedQuestions": book_pyq_questions,
            "expectedIndexedQuestions": expected_questions,
            "promotedIndexedQuestions": book_pyq_questions,
            "rawPromotedIndexedQuestions": promoted_questions,
            "missingIndexedQuestions": missing_questions,
            "segmentedCandidates": int(completeness_totals.get("segmentedCandidates", 0)) if isinstance(completeness_totals, dict) else 0,
            "answerEvidenceRows": int(completeness_totals.get("answerEvidenceRows", 0)) if isinstance(completeness_totals, dict) else 0,
            "missingAnswerEvidence": int(completeness_totals.get("missingAnswerEvidence", 0)) if isinstance(completeness_totals, dict) else 0,
            "stageEvidence": completeness.get("stageEvidence") if isinstance(completeness, dict) else None,
            "sections": dict(sorted(ranked_book_question_counts["sectionCounts"].items())),
            "sources": dict(ranked_book_question_counts["sourceCounts"].most_common()),
            "sourceTypes": dict(ranked_book_question_counts["sourceTypeCounts"].most_common()),
            "yearSpan": {
                "first": min(ranked_book_question_counts["yearCounts"]) if ranked_book_question_counts["yearCounts"] else None,
                "last": max(ranked_book_question_counts["yearCounts"]) if ranked_book_question_counts["yearCounts"] else None,
                "years": len(ranked_book_question_counts["yearCounts"]),
            },
        },
        "learnerPractice": {
            "source": str(args.generated_exam_data_path if generated_questions else args.questions_path),
            "usesGeneratedExamData": bool(generated_questions),
            "reviewedQuestions": learner_question_counts["reviewedQuestions"],
            "gapRepairQuestions": learner_gap_repair_questions,
            "sections": dict(sorted(learner_question_counts["sectionCounts"].items())),
            "sourceTypes": dict(learner_question_counts["sourceTypeCounts"].most_common()),
            "minimumReviewedPerTopic": min(learner_question_counts["topicCounts"].values()) if learner_question_counts["topicCounts"] else 0,
        },
        "explanations": explanation_metrics,
        "topics": {
            "total": len(topic_rows),
            "ready": len(ready_topics),
            "notReady": len(topic_rows) - len(ready_topics),
            "microTypeCoverage": {
                "targetMicroTypesPerTopic": TARGET_MICRO_TYPES_PER_TOPIC,
                "maxAuditedMicroTypesPerTopic": MAX_MICRO_TYPES_PER_TOPIC,
                "topicsReady": len(micro_type_ready_topics),
                "topicsWithGaps": len(topic_rows) - len(micro_type_ready_topics),
            },
            "visualAssetCoverage": {
                "topicsWithVisuals": len(visual_ready_topics),
                "topicsMissingVisuals": len(topic_rows) - len(visual_ready_topics),
                "missing": topics_missing_visuals[:20],
            },
            "weakest": weakest_topics,
        },
        "resources": {
            "candidates": candidate_count,
            "backlogYears": len(years) if isinstance(years, list) else 0,
            "rankedEligibleYears": ranked_years,
            "officialPaperYears": official_years,
            "bookPyqQuestionCount": book_pyq_questions,
            "sourceTypeCounts": resource_metrics["sourceTypeCounts"],
            "sourceLaneCounts": source_lane_counts,
            "sourceLanes": resource_metrics["sourceLanes"],
            "missingSourceLanes": missing_source_lanes,
        },
        "currentAffairs": {
            "lastSuccessfulDate": current_state.get("lastSuccessfulDate"),
            "latestDailyDate": latest_current_affairs_date,
            "latestSummaryItems": latest_current_affairs_items,
            "totalRuns": current_state.get("totalRuns"),
            "successfulRuns": current_state.get("successfulRuns"),
        },
    }


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Build strict SSC CGL 200/200 readiness audit JSON.")
    parser.add_argument("--questions-path", type=Path, default=default_questions_path())
    parser.add_argument("--docs-root", type=Path, default=ROOT / "docs")
    parser.add_argument("--topic-rules-path", type=Path, default=TOPIC_RULES_PATH)
    parser.add_argument("--book-completeness-path", type=Path, default=BOOK_COMPLETENESS_PATH)
    parser.add_argument("--ocr-progress-path", type=Path, default=OCR_PROGRESS_PATH)
    parser.add_argument("--resource-candidates-path", type=Path, default=RESOURCE_CANDIDATES_PATH)
    parser.add_argument("--pyq-backlog-path", type=Path, default=PYQ_BACKLOG_PATH)
    parser.add_argument("--current-affairs-root", type=Path, default=CURRENT_AFFAIRS_ROOT)
    parser.add_argument("--generated-exam-data-path", type=Path, default=GENERATED_EXAM_DATA_PATH)
    parser.add_argument("--output-path", type=Path, default=OUTPUT_PATH)
    parser.add_argument("--report-path", type=Path, default=REPORT_PATH)
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    audit = build_audit(args)
    args.output_path.parent.mkdir(parents=True, exist_ok=True)
    args.output_path.write_text(json.dumps(audit, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    args.report_path.parent.mkdir(parents=True, exist_ok=True)
    args.report_path.write_text(build_markdown_report(audit), encoding="utf-8")
    print(
        f"wrote SSC CGL 200/200 readiness audit: {args.output_path} "
        f"readyFor200={audit['readyFor200']}"
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
