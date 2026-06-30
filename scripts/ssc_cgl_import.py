"""SSC CGL PDF/OCR import report generator.

This script prepares an auditable import record. It deliberately keeps imported
questions out of ranked practice until manual review confirms OCR text,
answer-key alignment, and provenance.
"""

from __future__ import annotations

import argparse
import hashlib
import json
from dataclasses import asdict, dataclass
from datetime import datetime, timezone
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
IMPORT_ROOT = ROOT / "data" / "exams" / "ssc-cgl" / "pyq-imports"


@dataclass
class ImportReport:
    source_id: str
    source_type: str
    source_file: str
    source_url: str | None
    imported_at: str
    sha256: str
    review_status: str
    ocr_status: str
    question_count: int
    warnings: list[str]


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def build_report(source_file: Path, source_type: str, source_url: str | None) -> ImportReport:
    warnings = [
        "OCR extraction is not trusted until manually reviewed.",
        "Answer-key alignment must be checked separately from OCR confidence.",
        "web_pdf_unverified items must not enter ranked tests."
    ]
    if source_type == "official_login_personal":
        warnings.append("Candidate response sheets are personal-use only and should not be published.")

    return ImportReport(
        source_id=f"ssc-cgl-import-{source_file.stem.lower().replace(' ', '-')}",
        source_type=source_type,
        source_file=str(source_file),
        source_url=source_url,
        imported_at=datetime.now(timezone.utc).isoformat(),
        sha256=sha256_file(source_file),
        review_status="needs_review",
        ocr_status="pending",
        question_count=0,
        warnings=warnings,
    )


def main() -> int:
    parser = argparse.ArgumentParser(description="Create an SSC CGL PDF import review record.")
    parser.add_argument("source_file", type=Path)
    parser.add_argument("--source-type", default="web_pdf_unverified", choices=[
        "official_open",
        "official_login_personal",
        "user_provided",
        "web_pdf_unverified",
    ])
    parser.add_argument("--source-url")
    args = parser.parse_args()

    if not args.source_file.exists():
        parser.error(f"source file not found: {args.source_file}")

    report = build_report(args.source_file.resolve(), args.source_type, args.source_url)
    IMPORT_ROOT.mkdir(parents=True, exist_ok=True)
    output = IMPORT_ROOT / f"{report.source_id}.json"
    output.write_text(json.dumps(asdict(report), indent=2) + "\n", encoding="utf-8")
    print(f"wrote import review record: {output}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
