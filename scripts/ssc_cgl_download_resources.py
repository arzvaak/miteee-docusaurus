"""Download rights-cleared SSC CGL resource candidates into an audit ledger.

Only official/open PDF candidates are downloaded into the normal file ledger.
Copyright-risk references and login-gated answer keys remain metadata-only.
Unverified web PDFs can be collected only with an explicit quarantine flag; they
stay separate from ranked-practice imports until provenance, extraction, answer
alignment, duplicate, and model-agent review gates clear them.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import mimetypes
import re
import shutil
import sys
import urllib.parse
import urllib.request
from dataclasses import asdict, dataclass
from datetime import datetime, timezone
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
DEFAULT_MANIFEST = ROOT / "data" / "exams" / "ssc-cgl" / "resource-candidates.json"
DEFAULT_OUTPUT_ROOT = ROOT / "data" / "exams" / "ssc-cgl" / "downloads"
USER_AGENT = "MITEEE-SSC-CGL-resource-downloader/1.0"


@dataclass
class DownloadRecord:
    candidateId: str
    title: str
    url: str
    sourceType: str
    filePath: str
    sha256: str
    bytes: int
    downloadedAt: str


@dataclass
class QuarantinedDownloadRecord:
    candidateId: str
    title: str
    url: str
    sourceType: str
    filePath: str
    sha256: str
    bytes: int
    downloadedAt: str
    quarantineReason: str
    publishPolicy: str


@dataclass
class SkippedRecord:
    candidateId: str
    title: str
    url: str
    sourceType: str
    reason: str


def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def safe_slug(value: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", value.lower()).strip("-")[:80] or "resource"


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def load_candidates(manifest_path: Path) -> list[dict]:
    payload = json.loads(manifest_path.read_text(encoding="utf-8"))
    candidates = payload.get("candidates")
    if not isinstance(candidates, list):
        raise ValueError(f"manifest does not contain candidates list: {manifest_path}")
    return [candidate for candidate in candidates if isinstance(candidate, dict)]


def is_direct_pdf_candidate(candidate: dict) -> tuple[bool, str]:
    url = str(candidate.get("url") or "")
    parsed = urllib.parse.urlparse(url)
    if parsed.scheme not in {"http", "https", "file"}:
        return False, "unsupported URL scheme"
    if not parsed.path.lower().endswith(".pdf"):
        return False, "source is not a direct PDF candidate"
    return True, "direct PDF"


def is_download_allowed(candidate: dict) -> tuple[bool, str]:
    source_type = candidate.get("sourceType")
    if source_type == "copyright_risk_reference":
        return False, "copyright-risk reference: metadata only, do not download"
    if source_type == "official_login_personal":
        return False, "login-gated or personal answer-key source: metadata only"
    if source_type == "web_pdf_unverified":
        return False, "unverified web PDF: needs rights/provenance review before download"
    if source_type != "official_open":
        return False, f"unsupported source type for automatic download: {source_type}"
    direct_pdf, reason = is_direct_pdf_candidate(candidate)
    if not direct_pdf:
        if reason == "source is not a direct PDF candidate":
            return False, "official source is not a direct PDF candidate"
        return False, reason
    return True, "allowed"


def is_quarantine_allowed(candidate: dict, allow_web_pdf_quarantine: bool, source_id: str | None = None) -> tuple[bool, str]:
    source_type = candidate.get("sourceType")
    if source_id and str(candidate.get("sourceId") or "") != source_id:
        return False, f"source-id filter did not match: {source_id}"
    if source_type != "web_pdf_unverified":
        return False, "not an unverified web PDF"
    if not allow_web_pdf_quarantine:
        return False, "unverified web PDF: needs rights/provenance review before download"
    direct_pdf, reason = is_direct_pdf_candidate(candidate)
    if not direct_pdf:
        return False, "official source is not a direct PDF candidate"
    return True, "unverified web PDF quarantined for model-agent review; never ranked directly"


def extension_for_url(url: str) -> str:
    path = urllib.parse.urlparse(url).path
    suffix = Path(path).suffix.lower()
    if suffix:
        return suffix
    guessed = mimetypes.guess_extension(mimetypes.guess_type(path)[0] or "")
    return guessed or ".bin"


def download_to_file(url: str, destination: Path) -> int:
    parsed = urllib.parse.urlparse(url)
    destination.parent.mkdir(parents=True, exist_ok=True)
    if parsed.scheme == "file":
        file_path = urllib.request.url2pathname(parsed.path)
        if re.match(r"^[A-Za-z]:$", parsed.netloc):
            file_path = f"{parsed.netloc}{file_path}"
        if re.match(r"^/[A-Za-z]:/", file_path):
            file_path = file_path[1:]
        source = Path(file_path)
        shutil.copyfile(source, destination)
        return destination.stat().st_size

    request = urllib.request.Request(url, headers={
        "User-Agent": USER_AGENT,
        "Accept": "application/pdf,application/octet-stream;q=0.8,*/*;q=0.5",
    })
    with urllib.request.urlopen(request, timeout=90) as response:
        with destination.open("wb") as handle:
            shutil.copyfileobj(response, handle)
    return destination.stat().st_size


def build_ledger(
    candidates: list[dict],
    output_root: Path,
    limit: int,
    *,
    allow_web_pdf_quarantine: bool = False,
    source_id: str | None = None,
) -> dict:
    downloaded: list[DownloadRecord] = []
    quarantined: list[QuarantinedDownloadRecord] = []
    skipped: list[SkippedRecord] = []
    attempted = 0
    quarantine_attempted = 0

    for candidate in candidates:
        candidate_id = str(candidate.get("id") or "unknown")
        title = str(candidate.get("title") or candidate_id)
        url = str(candidate.get("url") or "")
        source_type = str(candidate.get("sourceType") or "")
        allowed, reason = is_download_allowed(candidate)
        if not allowed:
            quarantine_allowed, quarantine_reason = is_quarantine_allowed(candidate, allow_web_pdf_quarantine, source_id)
            if not quarantine_allowed:
                skipped.append(SkippedRecord(candidate_id, title, url, source_type, reason))
                continue
            if quarantine_attempted >= limit:
                skipped.append(SkippedRecord(candidate_id, title, url, source_type, "quarantine download limit reached"))
                continue

            quarantine_attempted += 1
            filename = f"{safe_slug(candidate_id)}{extension_for_url(url)}"
            destination = output_root / "quarantine" / "files" / filename
            try:
                byte_count = download_to_file(url, destination)
                quarantined.append(QuarantinedDownloadRecord(
                    candidateId=candidate_id,
                    title=title,
                    url=url,
                    sourceType=source_type,
                    filePath=str(destination.resolve()),
                    sha256=sha256_file(destination),
                    bytes=byte_count,
                    downloadedAt=now_iso(),
                    quarantineReason=quarantine_reason,
                    publishPolicy=str(candidate.get("publishPolicy") or "needs model-agent review; never rank directly from web source"),
                ))
            except Exception as exc:
                skipped.append(SkippedRecord(candidate_id, title, url, source_type, f"quarantine download failed: {exc}"))
            continue
        if attempted >= limit:
            skipped.append(SkippedRecord(candidate_id, title, url, source_type, "download limit reached"))
            continue

        attempted += 1
        filename = f"{safe_slug(candidate_id)}{extension_for_url(url)}"
        destination = output_root / "files" / filename
        try:
            byte_count = download_to_file(url, destination)
            downloaded.append(DownloadRecord(
                candidateId=candidate_id,
                title=title,
                url=url,
                sourceType=source_type,
                filePath=str(destination.resolve()),
                sha256=sha256_file(destination),
                bytes=byte_count,
                downloadedAt=now_iso(),
            ))
        except Exception as exc:
            skipped.append(SkippedRecord(candidate_id, title, url, source_type, f"download failed: {exc}"))

    return {
        "generatedAt": now_iso(),
        "policy": {
            "downloaded": "Only direct official_open PDF candidates are downloaded automatically.",
            "quarantined": "Direct web_pdf_unverified PDFs are saved only with --allow-web-pdf-quarantine and never enter ranked tests from this ledger.",
            "skipped": "Copyright-risk and login-gated candidates remain metadata-only. Unverified web PDFs are metadata-only unless explicitly quarantined.",
        },
        "downloaded": [asdict(record) for record in downloaded],
        "quarantined": [asdict(record) for record in quarantined],
        "skipped": [asdict(record) for record in skipped],
    }


def main() -> int:
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")
    parser = argparse.ArgumentParser(description="Download rights-cleared SSC CGL resource candidates.")
    parser.add_argument("--manifest", type=Path, default=DEFAULT_MANIFEST)
    parser.add_argument("--output-root", type=Path, default=DEFAULT_OUTPUT_ROOT)
    parser.add_argument("--limit", type=int, default=5)
    parser.add_argument("--allow-web-pdf-quarantine", action="store_true", help="Download direct web_pdf_unverified PDFs into downloads/quarantine/files for review only.")
    parser.add_argument("--source-id", help="Only quarantine web PDFs from this sourceId. Official downloads are unaffected.")
    args = parser.parse_args()

    candidates = load_candidates(args.manifest)
    ledger = build_ledger(
        candidates,
        args.output_root,
        args.limit,
        allow_web_pdf_quarantine=args.allow_web_pdf_quarantine,
        source_id=args.source_id,
    )
    args.output_root.mkdir(parents=True, exist_ok=True)
    ledger_path = args.output_root / "download-ledger.json"
    ledger_path.write_text(json.dumps(ledger, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"downloaded {len(ledger['downloaded'])}; quarantined {len(ledger['quarantined'])}; skipped {len(ledger['skipped'])}; ledger: {ledger_path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
