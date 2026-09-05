#!/usr/bin/env python3
"""Extract the supplied PW SSC Quant book into deterministic study data.

The PDF is an InDesign export with two-column exercises.  ``pdftotext``'s
plain layout output is useful for reading but interleaves columns, so the
exercise parser uses its bbox XML to keep the left and right text streams
separate and then stitches column/page continuations by question number.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import re
import subprocess
import tempfile
import xml.etree.ElementTree as ET
from pathlib import Path
from typing import Any


PDF_DEFAULT = Path(
    "/home/sushi/Documents/Codex/2026-09-05/can-you-help-me-download-this/outputs/pw-notes.pdf"
)
OUT_DEFAULT = Path("data/exams/ssc-cgl/quant-book/index.json")
VISUAL_ROOT = Path("data/exams/ssc-cgl/quant-book/assets")

CHAPTERS = [
    (1, "number-system", "Number System", 6),
    (2, "simplification", "Simplification", 18),
    (3, "hcf-and-lcm", "HCF and LCM", 33),
    (4, "average", "Average", 44),
    (5, "ratio-proportion", "Ratio & Proportion", 54),
    (6, "problems-on-ages", "Problems on Ages", 65),
    (7, "partnership", "Partnership", 70),
    (8, "mixture-and-alligation", "Mixture & Alligation", 75),
    (9, "percentage", "Percentage", 81),
    (10, "profit-and-loss", "Profit & Loss", 93),
    (11, "discount", "Discount", 106),
    (12, "simple-interest", "Simple Interest", 113),
    (13, "compound-interest", "Compound Interest", 121),
    (14, "time-and-work", "Time and Work", 129),
    (15, "work-and-wages", "Work and Wages", 140),
    (16, "pipe-and-cistern", "Pipe and Cistern", 145),
    (17, "speed-time-and-distance", "Speed, Time & Distance", 151),
    (18, "trains", "Trains", 160),
    (19, "boat-and-stream", "Boat and Stream", 169),
    (20, "data-interpretation", "Data Interpretation", 175),
]

# Exercise keys are a useful integrity assertion and also make extraction
# independent of page footer text or the printed book page number.
EXPECTED_EXERCISES = [55, 30, 45, 40, 45, 25, 25, 20, 55, 30, 30, 25, 20, 45, 20, 25, 35, 25, 20, 50]

# A handful of formula glyphs are not present in the PDF's text layer even
# though they are visible in the supplied page. These are transcribed from
# the corresponding source-page visual, not inferred from the answer key.
OPTION_FIXES: dict[tuple[int, int], list[str]] = {
    (1, 40): ["235/7, 241/7", "220/7, 120/7", "250/7, 100/7", "250/7, 150/7"],
    (2, 4): ["2√7", "3√7", "√14", "√56"],
    (2, 16): ["15/16", "3/16", "5/48", "5/16"],
    (2, 17): ["1001/999", "999/1001", "1001/3", "1001/998"],
    (2, 27): ["111/100", "100/111", "11/111", "11/100"],
    (2, 30): ["√2", "2√2", "√27", "3√2"],
    (3, 18): ["y", "x", "HCF(x, y)", "1/HCF(x, y)"],
    # The fraction glyphs in the source text layer are dropped on PDF p.41;
    # retain the printed choices rather than allowing option (a) to vanish.
    (3, 10): ["1/27", "10/27", "3/20", "20/3"],
    (3, 11): ["12/20", "1/20", "20", "20/12"],
    (3, 28): ["171", "176", "149", "186"],
    (9, 1): ["14/5", "24/5", "34/5", "None of these"],
    (9, 2): ["37/6", "35/6", "31/6", "None of these"],
    (9, 23): ["21/20", "21/400", "21/41", "420/23"],
    (9, 24): ["4/5", "3/5", "5/8", "19/75"],
    (11, 23): ["8%", "9%", "8.88%", "9.99%"],
    (14, 7): ["3 days", "3 1/3 days", "3 2/3 days", "7 1/3 days"],
    (14, 35): ["30 days", "20 days", "24 days", "16 days"],
    (14, 45): ["32 days", "27 days", "22 days", "25 1/2 days"],
    (14, 37): ["M³/N²", "N²/M³", "N³/M²", "N²/M²"],
    (17, 23): ["15 km/hr", "9 km/hr", "12 km/hr", "18 km/hr"],
    (18, 8): ["12 km/h", "22 km/h", "18 km/h", "20 km/h"],
    (20, 6): ["2019", "2020", "2021", "2022"],
    (20, 21): ["125 crores", "240 crores", "150 crores", "300 crores"],
    (20, 45): ["57 1/7%", "57 2/7%", "57 3/7%", "57 4/7%"],
}

STEM_FIXES: dict[tuple[int, int], str] = {
    (2, 8): "9² × ⁴√1296 − 254 = (? × 9 + 151)",
    (2, 14): "[3 1/4 ÷ {1 1/4 − 0.5(2 1/2 − 1/4 − 1/6)}] ÷ (4 × 1/12) = ?",
}

# A few page turns in the source place the prompt at the foot of the left
# frame and its continuation/solution at the top of the right frame on the
# *same* PDF page.  Keep these explicit: applying this to every left-frame
# packet would incorrectly absorb the independent right-column packet.
LEFT_TO_RIGHT_CONTINUATIONS = {(5, 39), (13, 17), (14, 18)}


def clean(text: str) -> str:
    """Normalize extraction whitespace without changing native math glyphs."""
    text = text.replace("\u00a0", " ").replace("\t", " ")
    return re.sub(r"\s+", " ", text).strip()


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as fh:
        for chunk in iter(lambda: fh.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def ensure_focused_visuals(pdf: Path) -> None:
    """Recreate the two DI crops whose source stimuli are easy to mislabel.

    The source renders are deliberately made at the same 120-DPI geometry as
    the checked-in focused assets.  Keeping the crop coordinates here makes
    regeneration deterministic instead of depending on a temporary preview
    directory.
    """
    VISUAL_ROOT.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory(prefix="ssc-quant-visuals-") as directory:
        prefix = str(Path(directory) / "page")
        subprocess.run(
            ["pdftoppm", "-f", "175", "-l", "176", "-r", "120", "-png", str(pdf), prefix],
            check=True,
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
        )
        page175 = Path(f"{prefix}-175.png")
        page176 = Path(f"{prefix}-176.png")
        expense = VISUAL_ROOT / "ch20-expense-table.png"
        left = Path(directory) / "pie-left.png"
        right = Path(directory) / "pie-right.png"
        pie = VISUAL_ROOT / "ch20-pie-charts.png"
        subprocess.run(["convert", str(page175), "-crop", "420x140+515+438", "+repage", str(expense)], check=True)
        subprocess.run(["convert", str(page176), "-crop", "300x250+145+595", "+repage", str(left)], check=True)
        subprocess.run(["convert", str(page176), "-crop", "300x260+580+965", "+repage", str(right)], check=True)
        subprocess.run(["convert", str(left), str(right), "-append", str(pie)], check=True)


def native_pages(pdf: Path) -> list[str]:
    raw = subprocess.check_output(["pdftotext", "-layout", str(pdf), "-"])
    # pdftotext emits one final form-feed after the final page.
    pages = raw.decode("utf-8", errors="replace").split("\f")
    return pages[:186]


def bbox_pages(pdf: Path) -> list[list[tuple[float, float, str]]]:
    """Return bbox lines split at the gutter at word level.

    The PDF occasionally places the first word of the next column in the
    same bbox line as the last option in the current column. Keeping that
    line as one record cross-contaminates both notes and exercises.
    """
    with tempfile.NamedTemporaryFile(suffix=".xml") as tmp:
        subprocess.run(
            ["pdftotext", "-bbox-layout", str(pdf), tmp.name],
            check=True,
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
        )
        root = ET.parse(tmp.name).getroot()
    local = lambda tag: tag.rsplit("}", 1)[-1]
    result: list[list[tuple[float, float, str]]] = []
    for page_number, page in enumerate((node for node in root.iter() if local(node.tag) == "page"), 1):
        lines: list[tuple[float, float, str]] = []
        for flow in page:
            if local(flow.tag) != "flow":
                continue
            for block in flow:
                if local(block.tag) != "block":
                    continue
                for line in block:
                    if local(line.tag) != "line":
                        continue
                    words = [
                        (float(word.attrib["yMin"]), float(word.attrib["xMin"]), word.text or "")
                        for word in line
                        if local(word.tag) == "word" and (word.text or "").strip()
                    ]
                    # Option rows in the source sometimes put the ``(c)``
                    # marker just left of the gutter and its value just
                    # right of it. Keep that value with the option, except
                    # when a genuine next-column question marker follows on
                    # the same bbox line.
                    option_row = bool(words and re.fullmatch(r"\([a-d]\)", words[0][2], re.I))
                    left_words: list[tuple[float, float, str]] = []
                    right_words: list[tuple[float, float, str]] = []
                    right_started = False
                    for word in words:
                        if option_row and word[1] >= 310 and re.fullmatch(r"\d+\.", word[2]):
                            right_started = True
                        if right_started or word[1] >= 310 and not option_row:
                            right_words.append(word)
                        else:
                            left_words.append(word)
                    for column_words in (left_words, right_words):
                        if column_words:
                            lines.append(
                                (
                                    min(word[0] for word in column_words),
                                    min(word[1] for word in column_words),
                                    " ".join(word[2] for word in column_words),
                                )
                            )
        # A formula/illustration is sometimes emitted as multiple XML lines
        # sharing the same baseline (for example ``For Example:`` followed by
        # radical glyphs in a separate text object). Merge same-column rows
        # at that baseline before parsing markers or packets.
        merged: list[tuple[float, float, str]] = []
        clusters: list[list[tuple[float, float, str]]] = []
        for row in sorted(lines, key=lambda item: (item[0], item[1])):
            if clusters and abs(min(item[0] for item in clusters[-1]) - row[0]) < 1.0 and (
                (min(item[1] for item in clusters[-1]) < 310) == (row[1] < 310)
            ):
                clusters[-1].append(row)
            else:
                clusters.append([row])
        for cluster in clusters:
            ordered = sorted(cluster, key=lambda item: item[1])
            merged.append((min(item[0] for item in ordered), min(item[1] for item in ordered), clean(" ".join(item[2] for item in ordered))))
        # Some DI/notes pages are a single full-width frame. Their text
        # objects still carry x positions on both sides of the nominal
        # gutter, which would fabricate a second stream and splice the next
        # visual block into the current example. A page with no right-margin
        # question/example marker is one frame; route its merged rows to the
        # left stream while preserving x order within each baseline.
        # The DI transition (PDF pages 179-186) is printed as one full-width
        # frame; other chapters retain their two-column geometry even when a
        # right-side text object happens to have no question marker.
        if 179 <= page_number <= 186:
            merged = [(y, 54.0, text) for y, _x, text in merged]
        result.append(merged)
    return result


def page_numbered_sections(pages: list[str], start: int, end: int) -> tuple[int, int]:
    exercise = next((page for page in range(start, end + 1) if re.search(r"^\s*EXERCISE\s*$", pages[page - 1], re.M)), None)
    answer = next((page for page in range(start, end + 1) if re.search(r"ANSWER KEY", pages[page - 1], re.I)), None)
    if exercise is None or answer is None:
        raise ValueError(f"chapter pages {start}-{end} do not contain exercise and answer key")
    return exercise, answer


def answer_key(text: str) -> dict[int, str]:
    return {
        int(number): letter.lower()
        for number, letter in re.findall(r"(?<!\d)(\d+)\s*\.\s*\(([a-d])\)", text, re.I)
    }


def split_options(lines: list[str]) -> tuple[str, list[dict[str, str]]]:
    joined = clean(" ".join(lines))
    matches = list(re.finditer(r"\(([a-d])\)", joined, re.I))
    if not matches:
        return joined, []
    stem = clean(joined[: matches[0].start()])
    options: list[dict[str, str]] = []
    for index, match in enumerate(matches):
        end = matches[index + 1].start() if index + 1 < len(matches) else len(joined)
        option_text = clean(joined[match.end() : end])
        # On pages where the right-hand option row shares a baseline with a
        # following DI set or footer, the bbox stream appends that material to
        # option (d). Keep the printed choice and drop only the unmistakable
        # next-set/footer boundary; the full native row remains in rawText.
        option_text = re.split(
            r"\b(?:Quantitative Aptitude|CPO-SI,\s*Railways and Other Competitive Exams|ANSWER|KEY)\b",
            option_text,
            maxsplit=1,
            flags=re.I,
        )[0]
        option_text = re.split(r"\b\d+\s*-\s*\d+\.\s*", option_text, maxsplit=1)[0]
        option_text = re.split(
            r"\b(?:OF BOYS|OF STUDENTS|OF EMPLOYEES|The chart shows|The following bar graph|Study the given table|Please examine|Please carefully examine|The pie chart|The table shows|The given line graph|the previous year|next year|in the year \d{4}|the 5-year period|what was the percentage|what could be the total|its sales|the total number|and the sales)\b",
            option_text,
            maxsplit=1,
            flags=re.I,
        )[0]
        option_text = re.sub(r"(?<=\d{4})\s+\d{2,3}$", "", option_text)
        options.append({"id": match.group(1).lower(), "text": clean(option_text)})
    # The source has a small number of duplicated option labels (for example
    # ``(c)`` printed twice). The option *position* is authoritative for the
    # learner-facing choice, so normalize the first four markers to a-d while
    # retaining their extracted text.
    if len(options) >= 4:
        options = [{"id": chr(97 + index), "text": option["text"]} for index, option in enumerate(options[:4])]
    return stem, options


def exercise_items(
    page_lines: list[list[tuple[float, float, str]]],
    pages: list[str],
    exercise_page: int,
    answer_page: int,
    expected_count: int,
    chapter_number: int,
    source_id: str,
) -> list[dict[str, Any]]:
    """Parse two-column exercise pages and stitch continuations."""
    records: dict[int, dict[str, Any]] = {}
    latest: int | None = None
    number_re = re.compile(r"^(\d+)\.\s*(.*)$")
    range_re = re.compile(r"^\d+\s*-\s*\d+\.\s*(.*)$")

    for page in range(exercise_page, answer_page + 1):
        all_lines = page_lines[page - 1]
        # A few chapters put the last exercise questions and the answer key
        # on the same PDF page.  Keep only the frame content above the answer
        # key heading on that page.
        if page == answer_page:
            answer_y = next((y for y, _x, text in all_lines if re.search(r"ANSWER KEY", text, re.I)), None)
            if answer_y is not None:
                all_lines = [row for row in all_lines if row[0] < answer_y]
        # x=310 is just inside the gutter for this letter-size book.  A few
        # left-column option markers start at x=306, while right question
        # numbers start at x=315.  Reading each frame
        # vertically prevents right-column items from entering left stems.
        # Some data-interpretation pages are single-column exercises, but
        # long option rows still spill past the nominal gutter. If there are
        # no right-margin question numbers on a page, keep those option rows
        # with the left-column item.
        has_right_question = any(
            310 <= row[1] < 340 and re.match(r"^\d+\.", clean(row[2]))
            for row in all_lines
        )
        columns = [
            [
                row
                for row in all_lines
                if row[1] < 310
                or (not has_right_question and re.match(r"^\([a-d]\)", clean(row[2]), re.I))
            ],
            [
                row
                for row in all_lines
                if row[1] >= 310
                and (has_right_question or not re.match(r"^\([a-d]\)", clean(row[2]), re.I))
            ],
        ]
        for column in columns:
            current: dict[str, Any] | None = None
            leading: list[str] = []
            first_number: int | None = None
            for y, _x, raw in sorted(column, key=lambda row: row[0]):
                text = clean(raw)
                if not text or text.lower().startswith("ssc cgl, chsl") or text == "Quantitative Aptitude":
                    continue
                if re.fullmatch(r"EXERCISE", text, re.I):
                    continue
                # pdftotext occasionally merges the tail of one column block
                # and the start of the next block into one bbox line.  Split
                # an embedded question marker (for example ``... (d) 0
                # 26. The value ...``) before normal parsing.
                margin_number = _x < 72 or 310 <= _x < 340
                embedded = re.search(r"\s(\d+)\.(?:\s+|$)", text)
                if embedded and not number_re.match(text):
                    candidate = int(embedded.group(1))
                    # Only split when the preceding fragment is an option
                    # marker.  A decimal sentence such as ``ratio ... 1 :
                    # 2. When ...`` is common in the source and is not a new
                    # question.
                    prefix = clean(text[: embedded.start()])
                    if 1 <= candidate <= expected_count and re.search(r"\([a-d]\)", prefix, re.I):
                        if prefix:
                            if current is None:
                                leading.append(prefix)
                            else:
                                current["lines"].append(prefix)
                        text = text[embedded.start() + 1 :]
                        margin_number = True
                match = number_re.match(text)
                range_match = range_re.match(text)
                # Printed question numbers sit at the frame margin (x≈54 or
                # x≈315). A continuation can itself start with ``9.`` or
                # ``268.`` at the indented text position, so only margin
                # markers are eligible to start a new exercise.
                if match and not range_match and margin_number:
                    number = int(match.group(1))
                    if not 1 <= number <= expected_count:
                        if current is not None:
                            current["lines"].append(text)
                        continue
                    # A wrapped sentence can begin with a number followed by
                    # a period (for example ``... remainder is 11. What is
                    # the value ...``). Once a column is inside an item,
                    # never move backwards to an already-seen question.
                    if current is not None and number <= current["number"]:
                        current["lines"].append(text)
                        continue
                    if current is not None:
                        records[current["number"]] = current
                    current = {"number": number, "lines": [], "pages": [page]}
                    if first_number is None:
                        first_number = number
                    if match.group(2):
                        current["lines"].append(match.group(2))
                    latest = number
                    continue
                if current is None:
                    leading.append(text)
                else:
                    current["lines"].append(text)
                    if page not in current["pages"]:
                        current["pages"].append(page)
            if current is not None:
                records[current["number"]] = current
                latest = current["number"]
            # Text at the top of a new frame/page belongs to the prior item
            # (e.g. a stem ending at the bottom of the left frame).
            target = (first_number - 1) if first_number is not None and first_number > 1 else latest
            if leading and first_number is not None:
                # A frame can begin with the options for the final item in
                # the preceding frame (common when a question's options are
                # laid out across the gutter). Attach to the nearest prior
                # record that still has fewer than four option markers.
                incomplete = [
                    number
                    for number, prior in records.items()
                    if number < first_number and len(split_options(prior["lines"])[1]) < 4
                ]
                if incomplete:
                    target = max(incomplete)
            if leading and target is not None and target in records:
                records[target]["lines"].extend(leading)
                if page not in records[target]["pages"]:
                    records[target]["pages"].append(page)

    if sorted(records) != list(range(1, expected_count + 1)):
        missing = sorted(set(range(1, expected_count + 1)) - set(records))
        extra = sorted(set(records) - set(range(1, expected_count + 1)))
        raise ValueError(f"exercise numbering mismatch: missing={missing}, extra={extra}")

    key = answer_key("\n".join(pages[answer_page - 1 : answer_page]))
    if sorted(key) != list(range(1, expected_count + 1)):
        raise ValueError(f"answer key mismatch on PDF page {answer_page}: got {len(key)} answers")

    output: list[dict[str, Any]] = []
    for number in range(1, expected_count + 1):
        record = records[number]
        raw_lines = record["lines"]
        # One malformed bbox block in the native export can lose all words
        # for a numbered item.  Recover its visible line from the page text so
        # the row remains useful and auditable rather than becoming empty.
        if not clean(" ".join(raw_lines)):
            recovery = re.compile(rf"(?<!\d){number}\.\s+(.+)")
            for page in sorted(set(record["pages"])):
                found = next((clean(match.group(1)) for line in pages[page - 1].splitlines() if (match := recovery.search(line))), "")
                if found:
                    raw_lines = [found]
                    break
        stem, options = split_options(raw_lines)
        if (chapter_number, number) in STEM_FIXES:
            stem = STEM_FIXES[(chapter_number, number)]
        if (chapter_number, number) in OPTION_FIXES:
            options = [
                {"id": chr(97 + index), "text": text}
                for index, text in enumerate(OPTION_FIXES[(chapter_number, number)])
            ]
        pdf_pages = sorted(set(record["pages"]))
        output.append(
            {
                "id": f"ssc-cgl-quant-ch{chapter_number:02d}-exercise-{number:03d}",
                "number": number,
                "stem": stem,
                "options": options,
                "correctOption": key[number],
                "rawText": clean(" ".join(raw_lines)),
                "pdfPageStart": pdf_pages[0],
                "pdfPageEnd": pdf_pages[-1],
                "provenance": {"sourceId": source_id, "pdfPages": pdf_pages},
            }
        )
    return output


def ordered_page_lines(
    page_lines: list[list[tuple[float, float, str]]], page: int
) -> list[str]:
    """Read one PDF page as left column top-to-bottom, then right column."""
    rows = [row for row in page_lines[page - 1] if row[0] < 730]
    columns = (
        [row for row in rows if row[1] < 310],
        [row for row in rows if row[1] >= 310],
    )
    return [
        clean(row[2])
        for column in columns
        for row in sorted(column, key=lambda row: (row[0], row[1]))
        if clean(row[2])
    ]


def example_streams(
    page_lines: list[list[tuple[float, float, str]]], start: int, exercise_page: int
) -> tuple[dict[int, list[tuple[int, str]]], list[tuple[int, int, int, re.Match[str]]]]:
    """Build independent left/right reading streams and example markers."""
    streams: dict[int, list[tuple[int, str]]] = {0: [], 1: []}
    # Markers are frame headings and therefore begin a bbox line.  Matching
    # the word ``example`` anywhere in a sentence turns phrases such as
    # ``as an example:`` into phantom cards and leaves the real heading with
    # an empty/prompt-duplicating packet.  Keep the one lowercase ``For
    # example:`` frame in the source; it is a genuine worked illustration.
    marker_re = re.compile(r"^(?:For Example|For example|Example|example)(?:\s+\d+)?\s*:", re.I)
    events: list[tuple[int, int, int, re.Match[str]]] = []
    for page in range(start, exercise_page):
        rows = [row for row in page_lines[page - 1] if row[0] < 730]
        for column, selected in enumerate((
            [row for row in rows if row[1] < 310],
            [row for row in rows if row[1] >= 310],
        )):
            stream = streams[column]
            for row in sorted(selected, key=lambda row: (row[0], row[1])):
                line = clean(row[2])
                if not line:
                    continue
                position = len(stream)
                stream.append((page, line))
                for match in marker_re.finditer(line):
                    events.append((page, column, position, match))
    return streams, events


def packet_heading_index(lines: list[str], start: int = 1) -> int | None:
    """Find a concept/section heading that closes an example packet."""
    known_prefixes = (
        "concept:",
        "miscellaneous examples:",
        "student's exercise",
        "student's notes",
        "student's",
        "notes",
        "some important points",
        "operations on numbers:",
        "word problems based",
        "important points:",
        "fundamental division theorem",
        "conversion from ",
        "formula for ",
        "properties of ",
        "installment on ",
        "caselet di",
        "double di",
        "double",
        "line graph",
        "bar graph",
        "double di",
    )
    for index in range(start, len(lines)):
        line = clean(lines[index])
        lower = line.lower()
        if not line:
            continue
        if lower == "chart" or lower.startswith(known_prefixes):
            return index
        # The remainder rules in chapters 1-3 use lettered concept bullets
        # immediately after the worked answer, without a ``Concept:`` line.
        if re.match(r"^\([a-z]\)\s+If any number is divisible\b", line, re.I):
            return index
        # Numbered section headings are split into ``4.`` and ``Division:``
        # by the bbox text layer.  Only treat the bare number as a heading
        # when the following line is title-like, so equation lines remain.
        if re.fullmatch(r"\d+\.\s*", line) and index + 1 < len(lines):
            following = clean(lines[index + 1])
            if re.match(r"^[A-Z][A-Za-z &'()/,-]{2,}(?::|$)", following):
                return index
        if re.match(r"^[A-Z][A-Za-z &'()/,-]{3,}:$", line):
            return index
        if re.match(r"^(?:Fundamental|Operations|Word Problems|Important|Miscellaneous)\b", line):
            return index
    return None


def packet_cutoff_index(lines: list[str]) -> int | None:
    """Return a post-answer heading, or a pre-answer heading for illustrations."""
    solution_index = next(
        (index for index, line in enumerate(lines) if re.search(r"\bSolution\s*:", line, re.I)),
        None,
    )
    first_heading = packet_heading_index(lines, 1)
    if first_heading is not None and (solution_index is None or first_heading < solution_index):
        return first_heading
    if solution_index is None:
        method_heading = next(
            (index for index, line in enumerate(lines[1:], 1) if re.match(r"^Method\s+\d+\s*:", clean(line), re.I)),
            None,
        )
        if method_heading is not None:
            return method_heading
    return packet_heading_index(lines, solution_index + 1 if solution_index is not None else 1)


def example_line_spans(
    page_lines: list[list[tuple[float, float, str]]], start: int, exercise_page: int
) -> dict[int, set[int]]:
    """Return stream line positions occupied by worked examples."""
    streams, events = example_streams(page_lines, start, exercise_page)
    spans: dict[int, set[int]] = {0: set(), 1: set()}
    visual_events = sorted(events, key=lambda event: (event[0], event[1], event[2]))
    # A page's two columns are independent reading frames.  The next visual
    # marker in page/column order is not necessarily the next marker in this
    # stream (all left-column markers sort before right-column markers), so
    # use the next marker in the same column as the packet boundary.
    events_by_column = {
        column: sorted(
            (event for event in visual_events if event[1] == column),
            key=lambda event: (event[0], event[2]),
        )
        for column in (0, 1)
    }
    next_in_stream: dict[tuple[int, int], int | None] = {}
    for column, column_events in events_by_column.items():
        for index, event in enumerate(column_events):
            next_in_stream[(event[0], event[2])] = (
                column_events[index + 1][2] if index + 1 < len(column_events) else None
            )
    for page, column, line_index, match in visual_events:
            next_line = next_in_stream[(page, line_index)]
            if next_line is None:
                next_line = len(streams[column])
            end = next_line
            body_lines = [streams[column][line_index][1][match.end() :]] + [streams[column][i][1] for i in range(line_index + 1, next_line)]
            body = clean(" ".join(body_lines))
            heading_offset = packet_cutoff_index(body_lines)
            if heading_offset is not None:
                end = line_index + heading_offset
            spans[column].update(range(line_index, end))
    # Mirror the right-to-left page continuation rule used by
    # ``extract_examples`` so note content does not retain a solution packet
    # that begins at the next page's left frame.
    for page, column, line_index, match in visual_events:
        if column != 1 or page + 1 >= exercise_page:
            continue
        right_end = next_in_stream[(page, line_index)]
        right_end = right_end if right_end is not None else len(streams[1])
        right_lines = [streams[1][line_index][1][match.end():]] + [streams[1][i][1] for i in range(line_index + 1, right_end)]
        if re.search(r"\bSolution\s*:", clean(" ".join(right_lines)), re.I):
            continue
        left_next = [
            (index, line)
            for index, (stream_page, line) in enumerate(streams[0])
            if stream_page == page + 1
        ]
        next_page_is_single_frame = not any(stream_page == page + 1 for stream_page, _line in streams[1])
        if not left_next or (
            not clean(left_next[0][1]).lower().startswith("solution:")
            and not next_page_is_single_frame
        ):
            continue
        left_start = left_next[0][0]
        left_marker = next((event[2] for event in visual_events if event[0] == page + 1 and event[1] == 0 and event[2] > left_start), len(streams[0]))
        spans[0].update(range(left_start, left_marker))
    # Mirror the two source-specific left-to-right same-page continuations
    # used by extract_examples, so chapter notes cannot retain their
    # Solution: lines after the worked card.
    for ordinal, (page, column, line_index, match) in enumerate(visual_events, 1):
        if column != 0:
            continue
        # The chapter number is not available here; identify the two frames
        # by their stable source PDF pages.
        if page not in (61, 126, 135):
            continue
        right_rows = [
            (position, line)
            for position, (stream_page, line) in enumerate(streams[1])
            if stream_page == page
        ]
        if not right_rows:
            continue
        right_start = right_rows[0][0]
        right_end = next(
            (event[2] for event in visual_events if event[0] == page and event[1] == 1 and event[2] > right_start),
            len(streams[1]),
        )
        spans[1].update(range(right_start, right_end))
    # Some chapter notes contain a worked calculation introduced by a
    # concept heading rather than an ``Example:`` marker.  Its printed
    # Solution: must still remain in the interactive example layer only.
    for column in (0, 1):
        for position, (_page, line) in enumerate(streams[column]):
            if not re.fullmatch(r"Solution\s*:", clean(line), re.I):
                continue
            end = len(streams[column])
            for candidate in range(position + 1, len(streams[column])):
                lower = clean(streams[column][candidate][1]).lower()
                if (
                    lower.startswith(("concept:", "miscellaneous examples:", "student's", "notes", "some important points"))
                    or lower in {"chart", "double di", "caselet di"}
                ):
                    end = candidate
                    break
            spans[column].update(range(position, end))
    return spans


def ordered_notes_page_lines(
    page_lines: list[list[tuple[float, float, str]]], page: int, excluded: dict[int, set[int]], positions: dict[int, int]
) -> list[str]:
    """Read a page by columns while omitting worked-example packets."""
    rows = [row for row in page_lines[page - 1] if row[0] < 730]
    output: list[str] = []
    for column, selected in enumerate((
        [row for row in rows if row[1] < 310],
        [row for row in rows if row[1] >= 310],
    )):
        for row in sorted(selected, key=lambda row: (row[0], row[1])):
            line = clean(row[2])
            if not line:
                continue
            position = positions[column]
            positions[column] += 1
            if position not in excluded[column]:
                output.append(line)
    return output


def extract_examples(
    page_lines: list[list[tuple[float, float, str]]],
    start: int,
    exercise_page: int,
    chapter_number: int,
    source_id: str,
) -> list[dict[str, Any]]:
    """Extract every worked/example marker, excluding explanatory lowercase one.

    The source contains one lowercase ``For example:`` sentence in the Profit
    & Loss chapter that is a continuation of a rule, not a separate example.
    The lowercase ``example:`` marker in Percentage is a genuine example and
    is retained.  This yields the source's 519-example inventory.
    """
    streams, events = example_streams(page_lines, start, exercise_page)
    result: list[dict[str, Any]] = []
    # Number examples in visual page/column order, but bound each one to the
    # next marker in the same column so adjacent columns cannot leak into it.
    visual_events = sorted(events, key=lambda item: (item[0], item[1], item[2]))
    for index, (page, column, line_index, match) in enumerate(visual_events, 1):
        # Bound the packet by the next marker in the same column.  Using the
        # globally next visual event leaks an entire adjacent-column stream
        # into the current solution on two-column pages.
        same_column_events = sorted(
            (event for event in visual_events if event[1] == column),
            key=lambda event: (event[0], event[2]),
        )
        current_position = next(
            position
            for position, event in enumerate(same_column_events)
            if event[0] == page and event[2] == line_index
        )
        next_event = (
            same_column_events[current_position + 1]
            if current_position + 1 < len(same_column_events)
            else None
        )
        next_line_index = next_event[2] if next_event else len(streams[column])
        next_page = next_event[0] if next_event else exercise_page
        stream = streams[column]
        cross_column_lines: list[str] = []
        # A right-column example can continue at the top of the following
        # page's left column (the book's normal reading order).  Keep that
        # continuation only when the next frame explicitly starts with its
        # printed ``Solution:`` marker; otherwise the same-column stream is
        # already the correct bounded packet.
        if column == 1 and page + 1 < exercise_page:
            # A right-frame packet normally ends at this page boundary.  If
            # the next page explicitly begins with Solution: (or is a
            # single-frame continuation), the branch below adds that
            # continuation back; otherwise this prevents a final right-frame
            # illustration from absorbing all later chapter prose/examples.
            page_end = next(
                (item for item in range(line_index + 1, len(stream)) if stream[item][0] > page),
                next_line_index,
            )
            next_line_index = min(next_line_index, page_end)
            left_next = [
                (index, line)
                for index, (stream_page, line) in enumerate(streams[0])
                if stream_page == page + 1
            ]
            next_page_is_single_frame = not any(stream_page == page + 1 for stream_page, _line in streams[1])
            if left_next and (
                clean(left_next[0][1]).lower().startswith("solution:")
                or next_page_is_single_frame
            ):
                page_end = next((index for index in range(line_index + 1, len(stream)) if stream[index][0] > page), next_line_index)
                next_line_index = min(next_line_index, page_end)
                left_start = left_next[0][0]
                left_marker = next((event[2] for event in events if event[0] == page + 1 and event[1] == 0 and event[2] > left_start), len(streams[0]))
                cross_column_lines = [streams[0][index][1] for index in range(left_start, left_marker)]
        body_lines = [stream[line_index][1][match.end() :]]
        body_lines.extend(stream[item][1] for item in range(line_index + 1, next_line_index))
        body_lines.extend(cross_column_lines)
        # On PDF p.126 (Ch.13 ex.17) and p.135 (Ch.14 ex.18), the left
        # packet continues into the right frame on the same page.  The
        # source has no marker in that right frame, so use the explicit
        # source-page exception rather than a broad column splice.
        if (chapter_number, index) in LEFT_TO_RIGHT_CONTINUATIONS and column == 0:
            right_rows = [
                position for position, (stream_page, _line) in enumerate(streams[1])
                if stream_page == page
            ]
            if right_rows:
                right_start = right_rows[0]
                right_end = next(
                    (event[2] for event in visual_events if event[0] == page and event[1] == 1 and event[2] > right_start),
                    len(streams[1]),
                )
                # Drop the footer/next-section marker that follows the
                # left-frame prompt before joining the right continuation.
                left_cutoff = packet_cutoff_index(body_lines)
                if left_cutoff is not None:
                    body_lines = body_lines[:left_cutoff]
                body_lines.extend(streams[1][item][1] for item in range(right_start, right_end))
        # A concept/section heading closes the packet even when it follows a
        # printed solution.  Without this second boundary, the next concept
        # and its examples become part of the preceding solution string.
        heading_offset = packet_cutoff_index(body_lines)
        if heading_offset is not None:
            body_lines = body_lines[:heading_offset]
        body = clean(" ".join(body_lines))
        if not body:
            # A small number of source frames put the marker at the bottom of
            # a page and repeat it at the top of the continuation page. Use
            # the continuation packet rather than emitting an empty card.
            if next_event is not None and current_position + 2 < len(same_column_events):
                continuation_end = same_column_events[current_position + 2][2]
                continuation_match = re.search(r"^(?:For Example|For example|Example|example)(?:\s+\d+)?\s*:", stream[next_line_index][1], re.I)
                if continuation_match:
                    body_lines = [stream[next_line_index][1][continuation_match.end() :]]
                    body_lines.extend(stream[item][1] for item in range(next_line_index + 1, continuation_end))
                    body = clean(" ".join(body_lines))
            if not body:
                body = clean(stream[line_index][1][match.start() :]) or "Example:"
        label = clean(match.group(0)[:-1])
        body_end_line = line_index + max(len(body_lines) - 1, 0)
        body_end_page = stream[body_end_line][0] if body_end_line < len(stream) else page
        pages_for_item = list(range(page, body_end_page + 1)) if body_end_page > page else [page]
        solution_match = re.search(r"\bSolution\s*:", body, re.I)
        prompt = clean(body[: solution_match.start()]) if solution_match else body
        solution = clean(body[solution_match.end() :]) if solution_match else ""
        if not prompt:
            # Some percentage-chart frames begin with a Solution: label
            # because the preceding prompt ended at the frame boundary.
            # Keep the card usable without pretending to recover missing
            # source words from the PDF text layer.
            prompt = "Worked example from the source (prompt text unavailable in the PDF text layer)."
        result.append(
            {
                "id": f"ssc-cgl-quant-ch{chapter_number:02d}-example-{index:03d}",
                "label": label,
                "text": body,
                "prompt": prompt,
                "solution": solution,
                "pdfPageStart": page,
                "pdfPageEnd": pages_for_item[-1],
                "provenance": {"sourceId": source_id, "pdfPages": pages_for_item},
            }
        )
    return result


def build(pdf: Path) -> dict[str, Any]:
    pages = native_pages(pdf)
    if len(pages) != 186:
        raise ValueError(f"expected 186 PDF pages, got {len(pages)}")
    bboxes = bbox_pages(pdf)
    if len(bboxes) != 186:
        raise ValueError(f"expected 186 bbox pages, got {len(bboxes)}")
    source_id = "pw-ssc-quantitative-aptitude-first-edition"
    chapters: list[dict[str, Any]] = []
    totals = {"examples": 0, "exercises": 0}
    for index, (number, slug, title, start) in enumerate(CHAPTERS):
        end = CHAPTERS[index + 1][3] - 1 if index + 1 < len(CHAPTERS) else 186
        exercise_page, answer_page = page_numbered_sections(pages, start, end)
        exercises = exercise_items(bboxes, pages, exercise_page, answer_page, EXPECTED_EXERCISES[index], number, source_id)
        examples = extract_examples(bboxes, start, exercise_page, number, source_id)
        if len(examples) == 0:
            raise ValueError(f"chapter {number} has no examples")
        notes_pages = list(range(start, exercise_page))
        exercise_pages = list(range(exercise_page, answer_page))
        excluded = example_line_spans(bboxes, start, exercise_page)
        positions = {0: 0, 1: 0}
        sections: list[dict[str, Any]] = [
            {"type": "notes", "pdfPageStart": start, "pdfPageEnd": exercise_page - 1, "pdfPages": notes_pages},
            {"type": "exercise", "pdfPageStart": exercise_page, "pdfPageEnd": answer_page - 1, "pdfPages": exercise_pages},
            {"type": "answer-key", "pdfPageStart": answer_page, "pdfPageEnd": answer_page, "pdfPages": [answer_page]},
        ]
        visual_assets: dict[int, list[dict[str, Any]]] = {
            1: [
                {"title": "Place-value table", "pdfPage": 6, "src": "/content-assets/ssc-cgl/quant-book/ch01-table.png", "alt": "Source page 6 place-value table"},
                {"title": "Number line", "pdfPage": 6, "src": "/content-assets/ssc-cgl/quant-book/ch01-number-line.png", "alt": "Source page 6 number line"},
            ],
            5: [
                {"title": "Ratio identities table", "pdfPage": 57, "src": "/content-assets/ssc-cgl/quant-book/ch05-ratio-table.png", "alt": "Source page 57 ratio identities table"},
            ],
            8: [
                {"title": "Alligation diagrams", "pdfPage": 75, "src": "/content-assets/ssc-cgl/quant-book/ch08-alligation.png", "alt": "Source page 75 alligation diagrams"},
            ],
            9: [
                {"title": "Fraction and percentage chart", "pdfPage": 82, "src": "/content-assets/ssc-cgl/quant-book/ch09-percentage-chart.png", "alt": "Source page 82 fraction and percentage chart"},
            ],
            10: [
                {"title": "Profit and loss formula panel", "pdfPage": 93, "src": "/content-assets/ssc-cgl/quant-book/ch10-profit-loss-formulas.png", "alt": "Source page 93 profit and loss formulas"},
            ],
            13: [
                {"title": "Compound-interest chart", "pdfPage": 121, "src": "/content-assets/ssc-cgl/quant-book/ch13-compound-interest-chart.png", "alt": "Source page 121 compound-interest chart"},
            ],
            20: [
                {"title": "Expense table", "pdfPage": 175, "src": "/content-assets/ssc-cgl/quant-book/ch20-expense-table.png", "alt": "Source page 175 expense table"},
                {"title": "Journey and election pie charts", "pdfPage": 176, "src": "/content-assets/ssc-cgl/quant-book/ch20-pie-charts.png", "alt": "Source page 176 pie charts"},
            ] + [
                {"title": f"Data-interpretation source visual (page {page})", "pdfPage": page, "src": f"/content-assets/ssc-cgl/quant-book/ch20-page-{page}.png", "alt": f"Source page {page} chart or table"}
                for page in range(180, 187)
            ],
        }
        for visual in visual_assets.get(number, []):
            sections.append({
                "type": "visual",
                "title": visual["title"],
                "content": f"Focused source visual from PDF page {visual['pdfPage']}.",
                "pdfPageStart": visual["pdfPage"],
                "pdfPageEnd": visual["pdfPage"],
                "pdfPages": [visual["pdfPage"]],
                "stimulus": {"type": "image", "src": visual["src"], "alt": visual["alt"], "caption": f"Source PDF page {visual['pdfPage']}"},
            })
        chapter = {
            "chapterNumber": number,
            "slug": slug,
            "title": title,
            "pdfPageStart": start,
            "pdfPageEnd": end,
            "exercisePage": exercise_page,
            "answerKeyPage": answer_page,
            "content": "\n\n".join("\n".join(ordered_notes_page_lines(bboxes, page, excluded, positions)) for page in notes_pages),
            "sections": sections,
            "examples": examples,
            "exercises": exercises,
            "counts": {"examples": len(examples), "exercises": len(exercises)},
        }
        chapters.append(chapter)
        totals["examples"] += len(examples)
        totals["exercises"] += len(exercises)
    if totals != {"examples": 519, "exercises": 665}:
        raise ValueError(f"unexpected totals: {totals}")
    return {
        "schemaVersion": 1,
        "generatedBy": "scripts/ssc_cgl_quant_book_extract.py",
        "source": {
            "id": source_id,
            "title": "Quantitative Aptitude: SSC CGL, CHSL, CPO-SI, Railways and Other Competitive Exams",
            "publisher": "Physics Wallah",
            "file": str(pdf),
            "sha256": sha256(pdf),
            "pdfPageCount": 186,
            "pageNumbering": "one-based PDF pages",
            "sourceType": "book_user_provided",
            "extraction": "pdftotext native text and bbox-layout column reconstruction",
        },
        "counts": {"chapters": 20, **totals},
        "chapters": chapters,
    }


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--pdf", type=Path, default=PDF_DEFAULT)
    parser.add_argument("--output", type=Path, default=OUT_DEFAULT)
    args = parser.parse_args()
    ensure_focused_visuals(args.pdf)
    result = build(args.pdf)
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(result, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(result["counts"], sort_keys=True))


if __name__ == "__main__":
    main()
