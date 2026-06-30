import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";
import test from "node:test";

const scriptPath = path.join(process.cwd(), "scripts", "ssc_cgl_resource_discovery.py");
const candidatesPath = path.join(process.cwd(), "data", "exams", "ssc-cgl", "resource-candidates.json");
const backlogPath = path.join(process.cwd(), "data", "exams", "ssc-cgl", "pyq-source-backlog.json");

function tempDiscoveryPaths() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "ssc-cgl-discovery-"));
  return {
    dir,
    candidatesPath: path.join(dir, "resource-candidates.json"),
    backlogPath: path.join(dir, "pyq-source-backlog.json"),
    sourcePlanPath: path.join(dir, "pyq-source-expansion-plan.json"),
  };
}

function runOfflineSeedToTemp() {
  const paths = tempDiscoveryPaths();
  execFileSync("python", [
    scriptPath,
    "--offline-seed",
    "--output-path",
    paths.candidatesPath,
    "--backlog-path",
    paths.backlogPath,
    "--source-expansion-plan-path",
    paths.sourcePlanPath,
  ], { cwd: process.cwd(), stdio: "pipe" });
  return paths;
}

test("SSC CGL resource discovery script is Scrapling-first and rights-aware", () => {
  const script = fs.readFileSync(scriptPath, "utf8");

  assert.match(script, /scrapling/i);
  assert.match(script, /SearXNG/i);
  assert.match(script, /Firecrawl/i);
  assert.match(script, /--use-searxng/);
  assert.match(script, /--use-firecrawl/);
  assert.match(script, /copyright_risk_reference/);
  assert.match(script, /official_open/);
  assert.match(script, /web_pdf_unverified/);
  assert.match(script, /do not download/i);
});

test("SSC CGL offline resource discovery writes official, Scribd, and web-PDF candidates", () => {
  const paths = runOfflineSeedToTemp();

  const payload = JSON.parse(fs.readFileSync(paths.candidatesPath, "utf8")) as {
    generatedAt: string;
    candidates: Array<{
      id: string;
      title: string;
      url: string;
      sourceType: string;
      acquisitionPolicy: string;
      publishPolicy: string;
      reviewStatus: string;
    }>;
  };

  assert.ok(payload.generatedAt);
  assert.ok(payload.candidates.length >= 6);
  assert.ok(payload.candidates.some((candidate) => candidate.sourceType === "official_open"));
  assert.ok(payload.candidates.some((candidate) => candidate.id === "official-ssc-2026-cgl-notice" && /\.pdf$/i.test(candidate.url)));
  assert.ok(payload.candidates.some((candidate) => candidate.id === "official-ssc-2026-cgl-notice" && candidate.sourceType === "official_notice_metadata"));
  assert.ok(payload.candidates.some((candidate) => /scribd/i.test(candidate.id) && candidate.sourceType === "copyright_risk_reference"));
  assert.ok(payload.candidates.some((candidate) => candidate.sourceType === "web_pdf_unverified"));
  for (const candidate of payload.candidates) {
    assert.ok(candidate.title);
    assert.match(candidate.url, /^https?:\/\//);
    assert.match(candidate.reviewStatus, /needs_review|metadata_only/);
    if (candidate.sourceType === "copyright_risk_reference") {
      assert.match(candidate.acquisitionPolicy, /metadata/i);
      assert.match(candidate.publishPolicy, /do not copy/i);
    }
  }
});

test("SSC CGL offline discovery can write to isolated paths without touching live generated data", () => {
  const beforeCandidates = fs.existsSync(candidatesPath) ? fs.readFileSync(candidatesPath, "utf8") : "";
  const beforeBacklog = fs.existsSync(backlogPath) ? fs.readFileSync(backlogPath, "utf8") : "";
  const paths = runOfflineSeedToTemp();

  assert.ok(fs.existsSync(paths.candidatesPath));
  assert.ok(fs.existsSync(paths.backlogPath));
  assert.equal(fs.existsSync(candidatesPath) ? fs.readFileSync(candidatesPath, "utf8") : "", beforeCandidates);
  assert.equal(fs.existsSync(backlogPath) ? fs.readFileSync(backlogPath, "utf8") : "", beforeBacklog);
});

test("SSC CGL official model-question API parser accepts only CGL paper attachments", () => {
  const probe = String.raw`
import importlib.util, json
import sys
from dataclasses import asdict
from pathlib import Path
spec = importlib.util.spec_from_file_location("ssc_cgl_resource_discovery", Path("scripts/ssc_cgl_resource_discovery.py"))
module = importlib.util.module_from_spec(spec)
sys.modules[spec.name] = module
spec.loader.exec_module(module)
records = {
    "data": [
        {
            "id": "cgl-record",
            "headline": "Previous Year Question Paper",
            "examId": "cgl-exam",
            "examYear": "2024",
            "contentType": "model-questions",
            "attachments": [
                {
                    "fileName": "cgl-tier-i-2024-question-paper.pdf",
                    "type": "application/pdf",
                    "size": 12345,
                    "path": "uploads\\masterData\\QuestionPapers\\cgl-tier-i-2024-question-paper.pdf"
                }
            ]
        },
        {
            "id": "chsl-record",
            "headline": "Previous Year Question Paper",
            "examId": "chsl-exam",
            "examYear": "2023",
            "contentType": "model-questions",
            "attachments": [
                {
                    "fileName": "model-question-paper-english.pdf",
                    "type": "application/pdf",
                    "size": 5127916,
                    "path": "uploads\\masterData\\QuestionPapers\\model-question-paper-english.pdf"
                }
            ]
        }
    ],
    "paginate": {"totalRecords": 2}
}
exams = {
    "data": [
        {"id": "cgl-exam", "examCode": "CGL", "examName": "Combined Graduate Level Examination"},
        {"id": "chsl-exam", "examCode": "CHSL", "examName": "Combined Higher Secondary Level (10+2) Examination."}
    ]
}
candidates = module.candidates_from_model_question_api(records, exams, discovered_at="2026-06-25T00:00:00+00:00")
print(json.dumps([asdict(candidate) for candidate in candidates], sort_keys=True))
`;
  const output = execFileSync("python", ["-c", probe], { cwd: process.cwd(), encoding: "utf8" });
  const candidates = JSON.parse(output) as Array<{
    id: string;
    title: string;
    url: string;
    sourceType: string;
    reviewStatus: string;
    tags: string[];
    snippet: string;
  }>;

  const cglPaper = candidates.find((candidate) => candidate.url.endsWith("/QuestionPapers/cgl-tier-i-2024-question-paper.pdf"));
  assert.ok(cglPaper, "CGL attachment should become a source candidate");
  assert.equal(cglPaper?.sourceType, "official_open");
  assert.equal(cglPaper?.reviewStatus, "needs_review");
  assert.match(cglPaper?.title ?? "", /CGL/i);
  assert.match(cglPaper?.snippet ?? "", /Combined Graduate Level/i);
  assert.ok(cglPaper?.tags.includes("cgl"));
  assert.ok(cglPaper?.tags.includes("official-api"));

  assert.equal(
    candidates.some((candidate) => candidate.url.endsWith("/QuestionPapers/model-question-paper-english.pdf")),
    false,
    "CHSL attachment must not become a CGL paper candidate"
  );

  const apiCheck = candidates.find((candidate) => candidate.id === "official-ssc-model-questions-api");
  assert.ok(apiCheck, "API check marker should be recorded even when non-CGL records exist");
  assert.equal(apiCheck?.reviewStatus, "metadata_only");
  assert.match(apiCheck?.snippet ?? "", /2 official model-question records checked; 1 CGL/);
});

test("SSC CGL official model-question API parser keeps CGL records without PDFs as marker-only evidence", () => {
  const probe = String.raw`
import importlib.util, json
import sys
from dataclasses import asdict
from pathlib import Path
spec = importlib.util.spec_from_file_location("ssc_cgl_resource_discovery", Path("scripts/ssc_cgl_resource_discovery.py"))
module = importlib.util.module_from_spec(spec)
sys.modules[spec.name] = module
spec.loader.exec_module(module)
records = {
    "data": [
        {
            "id": "cgl-record-without-pdf",
            "headline": "Previous Year Question Paper",
            "examId": "cgl-exam",
            "examYear": "2024",
            "contentType": "model-questions",
            "attachments": [
                {
                    "fileName": "cgl-tier-i-2024-question-paper.txt",
                    "type": "text/plain",
                    "path": "uploads\\masterData\\QuestionPapers\\cgl-tier-i-2024-question-paper.txt"
                }
            ]
        }
    ]
}
exams = {
    "data": [
        {"id": "cgl-exam", "examCode": "CGL", "examName": "Combined Graduate Level Examination"}
    ]
}
candidates = module.candidates_from_model_question_api(records, exams, discovered_at="2026-06-25T00:00:00+00:00")
backlog = module.build_pyq_backlog(candidates)
print(json.dumps({
    "candidates": [asdict(candidate) for candidate in candidates],
    "totals": backlog["totals"],
    "year2024": [entry for entry in backlog["years"] if entry["year"] == 2024][0],
}, sort_keys=True))
`;
  const output = execFileSync("python", ["-c", probe], { cwd: process.cwd(), encoding: "utf8" });
  const result = JSON.parse(output) as {
    candidates: Array<{ id: string; sourceType: string; reviewStatus: string; snippet: string; url: string }>;
    totals: { yearsWithOfficialPaper: number; yearsWithAnyCandidate: number; yearsWithUnverifiedWebLead: number };
    year2024: { officialCandidateIds: string[]; officialPaperCandidateIds: string[]; status: string };
  };

  assert.equal(result.candidates.length, 1);
  assert.equal(result.candidates[0]?.id, "official-ssc-model-questions-api");
  assert.equal(result.candidates[0]?.reviewStatus, "metadata_only");
  assert.match(result.candidates[0]?.snippet ?? "", /1 CGL records matched/i);
  assert.match(result.candidates[0]?.snippet ?? "", /0 importable CGL PDF attachments/i);
  assert.equal(result.totals.yearsWithOfficialPaper, 0);
  assert.equal(result.totals.yearsWithAnyCandidate, 0);
  assert.equal(result.totals.yearsWithUnverifiedWebLead, 0);
  assert.deepEqual(result.year2024.officialCandidateIds, []);
  assert.deepEqual(result.year2024.officialPaperCandidateIds, []);
  assert.equal(result.year2024.status, "missing_source");
});

test("SSC CGL official answer-key and notice APIs create non-paper official provenance candidates", () => {
  const probe = String.raw`
import importlib.util, json
import sys
from dataclasses import asdict
from pathlib import Path
spec = importlib.util.spec_from_file_location("ssc_cgl_resource_discovery", Path("scripts/ssc_cgl_resource_discovery.py"))
module = importlib.util.module_from_spec(spec)
sys.modules[spec.name] = module
spec.loader.exec_module(module)
records = {
    "data": [
        {
            "id": "cgl-answer-key-record",
            "headline": "Combined Graduate Level Examination, 2025 Tier-II final answer key write-up",
            "examId": "cgl-2025",
            "examYear": "2025",
            "contentType": "answer-key",
            "attachments": [
                {
                    "id": "ak-file",
                    "fileName": "Final_writeup_17062026.pdf",
                    "type": "application/pdf",
                    "path": "uploads\\masterData\\AnswerKeys\\Final_writeup_17062026.pdf"
                }
            ]
        },
        {
            "id": "cgl-notice-record",
            "headline": "Combined Graduate Level Examination, 2024 Tier-I final answer key notice",
            "examId": "cgl-2024",
            "examYear": "2024",
            "contentType": "notice-boards",
            "attachments": [
                {
                    "id": "notice-file",
                    "fileName": "Writeup_Final_Anwerkey_CGLE_2024_T1_191224.pdf",
                    "type": "application/pdf",
                    "path": "uploads\\masterData\\NoticeBoards\\Writeup_Final_Anwerkey_CGLE_2024_T1_191224.pdf"
                }
            ]
        },
        {
            "id": "chsl-answer-key-record",
            "headline": "CHSL answer key notice",
            "examId": "chsl",
            "examYear": "2025",
            "contentType": "answer-key",
            "attachments": [
                {
                    "id": "chsl-file",
                    "fileName": "chsl.pdf",
                    "type": "application/pdf",
                    "path": "uploads\\masterData\\AnswerKeys\\chsl.pdf"
                }
            ]
        },
        {
            "id": "cgl-application-window-record",
            "headline": "Important Notice regarding re-opening of window for submission of online application form for Combined Graduate Level Examination, 2026",
            "examId": "cgl-2026",
            "examYear": "2026",
            "contentType": "notice-boards",
            "attachments": [
                {
                    "id": "generic-cgl-notice",
                    "fileName": "CGLE_Reopen_23062026.pdf",
                    "type": "application/pdf",
                    "path": "uploads\\masterData\\NoticeBoards\\CGLE_Reopen_23062026.pdf"
                }
            ]
        }
    ]
}
exams = {
    "data": [
        {"id": "cgl-2025", "examCode": "CGL", "examName": "Combined Graduate Level Examination, 2025"},
        {"id": "cgl-2024", "examCode": "CGL", "examName": "Combined Graduate Level Examination, 2024"},
        {"id": "cgl-2026", "examCode": "CGL", "examName": "Combined Graduate Level Examination, 2026"},
        {"id": "chsl", "examCode": "CHSL", "examName": "Combined Higher Secondary Level Examination"}
    ]
}
candidates = module.candidates_from_official_attachment_records(
    records,
    exams,
    source_id="ssc-official-answer-key-notices",
    candidate_class="official_answer_key_notice",
    discovered_at="2026-06-25T00:00:00+00:00",
)
backlog = module.build_pyq_backlog(candidates)
years = {entry["year"]: entry for entry in backlog["years"]}
print(json.dumps({
    "candidates": [asdict(candidate) for candidate in candidates],
    "totals": backlog["totals"],
    "y2024": years[2024],
    "y2025": years[2025],
}, sort_keys=True))
`;
  const output = execFileSync("python", ["-c", probe], { cwd: process.cwd(), encoding: "utf8" });
  const result = JSON.parse(output) as {
    candidates: Array<{ id: string; title: string; url: string; sourceType: string; reviewStatus: string; tags: string[]; acquisitionPolicy: string; publishPolicy: string }>;
    totals: { yearsWithOfficialPaper: number; yearsWithAnyCandidate: number; yearsWithUnverifiedWebLead: number };
    y2024: { officialCandidateIds: string[]; officialPaperCandidateIds: string[]; officialAnswerKeyNoticeIds: string[]; status: string };
    y2025: { officialCandidateIds: string[]; officialPaperCandidateIds: string[]; officialAnswerKeyNoticeIds: string[]; status: string };
  };

  assert.equal(result.candidates.length, 2);
  assert.ok(result.candidates.every((candidate) => candidate.sourceType === "official_notice_metadata"));
  assert.ok(result.candidates.every((candidate) => candidate.reviewStatus === "metadata_only"));
  assert.ok(result.candidates.every((candidate) => candidate.tags.includes("official-answer-key-notice")));
  assert.ok(result.candidates.every((candidate) => candidate.tags.includes("not-question-paper")));
  assert.ok(result.candidates.some((candidate) => candidate.url === "https://ssc.gov.in/api/attachment/uploads/masterData/AnswerKeys/Final_writeup_17062026.pdf"));
  assert.ok(result.candidates.some((candidate) => candidate.url === "https://ssc.gov.in/api/attachment/uploads/masterData/NoticeBoards/Writeup_Final_Anwerkey_CGLE_2024_T1_191224.pdf"));
  assert.equal(result.candidates.some((candidate) => candidate.url.endsWith("/CGLE_Reopen_23062026.pdf")), false);
  assert.ok(result.candidates.every((candidate) => /response sheets stay login-gated/i.test(candidate.acquisitionPolicy)));
  assert.ok(result.candidates.every((candidate) => /not treated as question papers/i.test(candidate.publishPolicy)));
  assert.equal(result.totals.yearsWithOfficialPaper, 0);
  assert.equal(result.totals.yearsWithAnyCandidate, 0);
  assert.equal(result.totals.yearsWithUnverifiedWebLead, 0);
  assert.deepEqual(result.y2024.officialPaperCandidateIds, []);
  assert.deepEqual(result.y2025.officialPaperCandidateIds, []);
  assert.deepEqual(result.y2024.officialAnswerKeyNoticeIds, [result.candidates.find((candidate) => candidate.url.includes("Writeup_Final_Anwerkey_CGLE_2024_T1_191224"))?.id]);
  assert.deepEqual(result.y2025.officialAnswerKeyNoticeIds, [result.candidates.find((candidate) => candidate.url.includes("Final_writeup_17062026"))?.id]);
  assert.equal(result.y2024.status, "official_cycle_metadata_only");
  assert.equal(result.y2025.status, "official_cycle_metadata_only");
});

test("SSC CGL official answer-key discovery follows paginated official records", () => {
  const probe = String.raw`
import importlib.util, json
import sys
import urllib.parse
from dataclasses import asdict
from pathlib import Path
spec = importlib.util.spec_from_file_location("ssc_cgl_resource_discovery", Path("scripts/ssc_cgl_resource_discovery.py"))
module = importlib.util.module_from_spec(spec)
sys.modules[spec.name] = module
spec.loader.exec_module(module)
exams = {
    "data": [
        {"id": "cgl-2025", "examCode": "CGL", "examName": "Combined Graduate Level Examination, 2025"},
        {"id": "cgl-2024", "examCode": "CGL", "examName": "Combined Graduate Level Examination, 2024"},
        {"id": "cgl-2023", "examCode": "CGL", "examName": "Combined Graduate Level Examination, 2023"},
        {"id": "chsl", "examCode": "CHSL", "examName": "Combined Higher Secondary Level Examination"}
    ]
}
def record(record_id, exam_id, year, headline, file_name):
    return {
        "id": record_id,
        "headline": headline,
        "examId": exam_id,
        "examYear": year,
        "attachments": [
            {
                "id": f"{record_id}-file",
                "fileName": file_name,
                "type": "application/pdf",
                "path": f"uploads\\masterData\\AnswerKeys\\{file_name}"
            }
        ]
    }
payloads = {
    ("answer-key", "1"): {
        "data": [
            record("cgl-ak-page-1", "cgl-2025", "2025", "CGL 2025 Final Answer Key and Response Sheet", "Final_writeup_2025.pdf"),
            record("chsl-ak-page-1", "chsl", "2025", "CHSL Answer Key", "CHSL_writeup_2025.pdf")
        ],
        "paginate": {"totalRecords": 51}
    },
    ("answer-key", "2"): {
        "data": [
            record("cgl-ak-page-2", "cgl-2024", "2024", "CGL 2024 Final Answer Key and Marks of Candidates", "Final_writeup_2024.pdf")
        ],
        "paginate": {"totalRecords": 51}
    },
    ("notice-boards", "1"): {
        "data": [
            record("cgl-generic-page-1", "cgl-2023", "2023", "Important Notice for CGL application window", "CGL_window.pdf")
        ],
        "paginate": {"totalRecords": 101}
    },
    ("notice-boards", "2"): {
        "data": [
            record("cgl-notice-page-2", "cgl-2023", "2023", "CGL 2023 Tentative Answer Key and Response Sheet", "Tentative_2023.pdf")
        ],
        "paginate": {"totalRecords": 101}
    }
}
calls = []
def fake_fetch(url):
    calls.append(url)
    if url == module.SSC_EXAMS_API:
        return exams
    parsed = urllib.parse.urlparse(url)
    query = urllib.parse.parse_qs(parsed.query)
    key = (query.get("contentType", [""])[0], query.get("page", ["1"])[0])
    return payloads.get(key, {"data": [], "paginate": {"totalRecords": 0}})
module.fetch_json_with_scrapling = fake_fetch
candidates = module.discover_official_answer_key_notices()
print(json.dumps({
    "candidates": [asdict(candidate) for candidate in candidates],
    "calls": calls,
}, sort_keys=True))
`;
  const output = execFileSync("python", ["-c", probe], { cwd: process.cwd(), encoding: "utf8" });
  const result = JSON.parse(output) as {
    candidates: Array<{ id: string; title: string; sourceType: string; reviewStatus: string; tags: string[]; url: string }>;
    calls: string[];
  };

  assert.equal(result.candidates.length, 3);
  assert.ok(result.calls.some((url) => /contentType=answer-key/.test(url) && /page=2/.test(url)));
  assert.ok(result.calls.some((url) => /contentType=notice-boards/.test(url) && /page=2/.test(url)));
  assert.ok(result.candidates.every((candidate) => candidate.sourceType === "official_notice_metadata"));
  assert.ok(result.candidates.every((candidate) => candidate.reviewStatus === "metadata_only"));
  assert.ok(result.candidates.every((candidate) => candidate.tags.includes("official-answer-key-notice")));
  assert.equal(result.candidates.some((candidate) => candidate.url.endsWith("/CGL_window.pdf")), false);
  assert.ok(result.candidates.some((candidate) => candidate.url.endsWith("/Final_writeup_2024.pdf")));
  assert.ok(result.candidates.some((candidate) => candidate.url.endsWith("/Tentative_2023.pdf")));
});

test("SSC CGL Internet Archive API parser keeps public archive hits as unverified metadata", () => {
  const probe = String.raw`
import importlib.util, json
import sys
from dataclasses import asdict
from pathlib import Path
spec = importlib.util.spec_from_file_location("ssc_cgl_resource_discovery", Path("scripts/ssc_cgl_resource_discovery.py"))
module = importlib.util.module_from_spec(spec)
sys.modules[spec.name] = module
spec.loader.exec_module(module)
payload = {
    "response": {
        "numFound": 2,
        "docs": [
            {
                "identifier": "ssc-cgl-tier-i-2023-question-paper",
                "title": "SSC CGL Tier I 2023 Question Paper PDF",
                "description": "Public archive metadata for SSC CGL Tier-I previous year questions.",
                "year": "2023"
            },
            {
                "identifier": "bank-po-reasoning-book",
                "title": "Bank PO Reasoning Practice",
                "description": "Not an SSC CGL paper.",
                "year": "2022"
            }
        ]
    }
}
candidates = module.candidates_from_archive_api(payload, discovered_at="2026-06-25T00:00:00+00:00")
print(json.dumps([asdict(candidate) for candidate in candidates], sort_keys=True))
`;
  const output = execFileSync("python", ["-c", probe], { cwd: process.cwd(), encoding: "utf8" });
  const candidates = JSON.parse(output) as Array<{
    id: string;
    title: string;
    url: string;
    sourceType: string;
    reviewStatus: string;
    acquisitionPolicy: string;
    publishPolicy: string;
    tags: string[];
    snippet: string;
  }>;

  assert.equal(candidates.length, 1);
  const archiveHit = candidates[0]!;
  assert.match(archiveHit.id, /^archive-ssc-cgl-/);
  assert.equal(archiveHit.url, "https://archive.org/details/ssc-cgl-tier-i-2023-question-paper");
  assert.equal(archiveHit.sourceType, "web_pdf_unverified");
  assert.equal(archiveHit.reviewStatus, "needs_review");
  assert.match(archiveHit.acquisitionPolicy, /metadata first/i);
  assert.match(archiveHit.publishPolicy, /do not copy/i);
  assert.ok(archiveHit.tags.includes("archive-api"));
  assert.ok(archiveHit.tags.includes("2023"));
  assert.match(archiveHit.snippet, /previous year questions/i);
});

test("SSC CGL user-supplied web sources are registered as rights-aware discovery seeds", () => {
  const script = fs.readFileSync(scriptPath, "utf8");

  assert.match(script, /https:\/\/sscportal\.in\/cgl\/tier-1\/model-questions/);
  assert.match(script, /https:\/\/www\.sscdrishti\.com\/pyq-pdf\/cgl/);
  assert.match(script, /https:\/\/aptidude\.in\/practice/);
  assert.match(script, /https:\/\/www\.oliveboard\.in\/blog\/ssc-cgl-tier-1-pyps\//);
  assert.match(script, /https:\/\/cracku\.in\/ssc-cgl-previous-papers/);
  assert.match(script, /https:\/\/www\.adda247\.com\/jobs\/ssc-cgl-previous-year-question-paper\//);
  assert.match(script, /https:\/\/www\.careerpower\.in\/ssc-cgl-previous-year-question-paper\.html/);
  assert.match(script, /https:\/\/testbook\.com\/ssc-cgl-exam\/previous-year-papers/);
  assert.match(script, /https:\/\/store\.pw\.live\/blogs\/ssc-exams\/ssc-cgl-previous-year-question-papers-pdfs/);

  const probe = String.raw`
import importlib.util, json
import sys
from dataclasses import asdict
from pathlib import Path
spec = importlib.util.spec_from_file_location("ssc_cgl_resource_discovery", Path("scripts/ssc_cgl_resource_discovery.py"))
module = importlib.util.module_from_spec(spec)
sys.modules[spec.name] = module
spec.loader.exec_module(module)
source_by_id = {source.id: source for source in module.SOURCES}
samples = [
    module.candidate_from_link(
        source_by_id["sscportal-cgl-model-questions"],
        "/cgl/tier-1/model-questions/reasoning-set-1",
        "Model Questions for SSC CGL TIER-1 (Reasoning) Set - 1",
    ),
    module.candidate_from_link(
        source_by_id["drishti-ssc-cgl-pyq-pdf"],
        "https://vault.sscdrishti.com/cgl/SSC-CGL-Tier-1-Question-Paper-Bilingual-26-September-2025-Shift-3.pdf",
        "SSC-CGL-Tier-1-Question-Paper-Bilingual-26-September-2025-Shift-3 Download PDF",
    ),
    module.candidate_from_link(
        source_by_id["aptidude-practice"],
        "/practice/percentages",
        "Percentages aptitude questions",
    ),
    module.candidate_from_link(
        source_by_id["oliveboard-ssc-cgl-tier-1-pyps"],
        "https://example.com/SSC-CGL-Tier-1-Question-Paper-2024-Shift-1.pdf",
        "SSC CGL Tier 1 Previous Year Question Paper 2024 Shift 1 PDF",
    ),
    module.candidate_from_link(
        source_by_id["cracku-ssc-cgl-previous-papers"],
        "/ssc-cgl-2023-tier-1-previous-paper",
        "SSC CGL 2023 Tier 1 Previous Paper",
    ),
]
candidates = [candidate for candidate in samples if candidate]
backlog = module.build_pyq_backlog(candidates)
print(json.dumps({
    "candidates": [asdict(candidate) for candidate in candidates],
    "totals": backlog["totals"],
    "y2025": [entry for entry in backlog["years"] if entry["year"] == 2025][0],
}, sort_keys=True))
`;
  const output = execFileSync("python", ["-c", probe], { cwd: process.cwd(), encoding: "utf8" });
  const result = JSON.parse(output) as {
    candidates: Array<{ id: string; sourceId: string; sourceType: string; reviewStatus: string; tags: string[]; acquisitionPolicy: string; publishPolicy: string }>;
    totals: { yearsWithAnyCandidate: number; yearsWithUnverifiedWebLead: number };
    y2025: { webCandidateIds: string[] };
  };

  assert.equal(result.candidates.length, 5);
  const sscPortal = result.candidates.find((candidate) => candidate.sourceId === "sscportal-cgl-model-questions");
  const drishti = result.candidates.find((candidate) => candidate.sourceId === "drishti-ssc-cgl-pyq-pdf");
  const aptidude = result.candidates.find((candidate) => candidate.sourceId === "aptidude-practice");
  const oliveboard = result.candidates.find((candidate) => candidate.sourceId === "oliveboard-ssc-cgl-tier-1-pyps");
  const cracku = result.candidates.find((candidate) => candidate.sourceId === "cracku-ssc-cgl-previous-papers");
  assert.equal(sscPortal?.sourceType, "original_practice");
  assert.equal(aptidude?.sourceType, "original_practice");
  assert.equal(drishti?.sourceType, "web_pdf_unverified");
  assert.equal(oliveboard?.sourceType, "web_pdf_unverified");
  assert.equal(cracku?.sourceType, "web_pdf_unverified");
  assert.ok(drishti?.tags.includes("drishti"));
  assert.ok(oliveboard?.tags.includes("oliveboard"));
  assert.ok(cracku?.tags.includes("cracku"));
  assert.match(drishti?.publishPolicy ?? "", /unreviewed/i);
  assert.equal(result.totals.yearsWithAnyCandidate, 0);
  assert.equal(result.totals.yearsWithUnverifiedWebLead, 3);
  assert.deepEqual(result.y2025.webCandidateIds, [drishti?.id]);
});

test("SSC CGL third-party PYQ scrapers keep paper links but reject unrelated coaching pages", () => {
  const probe = String.raw`
import importlib.util, json
import sys
from dataclasses import asdict
from pathlib import Path
spec = importlib.util.spec_from_file_location("ssc_cgl_resource_discovery", Path("scripts/ssc_cgl_resource_discovery.py"))
module = importlib.util.module_from_spec(spec)
sys.modules[spec.name] = module
spec.loader.exec_module(module)
sources = {source.id: source for source in module.SOURCES}
samples = [
    module.candidate_from_link(
        sources["adda247-ssc-cgl-previous-year-paper"],
        "/jobs/ssc-cgl-syllabus/",
        "SSC CGL Syllabus",
    ),
    module.candidate_from_link(
        sources["careerpower-ssc-cgl-previous-year-paper"],
        "https://cdn.example.com/ssc-cgl-tier-1-2022-question-paper.pdf",
        "Download SSC CGL Tier 1 2022 Question Paper PDF",
    ),
    module.candidate_from_link(
        sources["testbook-ssc-cgl-previous-year-papers"],
        "/ssc-cgl-exam/admit-card",
        "SSC CGL Admit Card",
    ),
    module.candidate_from_link(
        sources["pw-ssc-cgl-previous-year-papers"],
        "/blogs/ssc-exams/ssc-cgl-previous-year-question-papers-pdfs#2021",
        "SSC CGL Previous Year Question Papers PDFs 2021",
    ),
]
print(json.dumps([asdict(candidate) if candidate else None for candidate in samples], sort_keys=True))
`;
  const output = execFileSync("python", ["-c", probe], { cwd: process.cwd(), encoding: "utf8" });
  const candidates = JSON.parse(output) as Array<null | { title: string; sourceId: string; sourceType: string; reviewStatus: string; publishPolicy: string; tags: string[] }>;

  assert.equal(candidates[0], null);
  assert.equal(candidates[2], null);
  assert.equal(candidates[1]?.sourceId, "careerpower-ssc-cgl-previous-year-paper");
  assert.equal(candidates[1]?.sourceType, "web_pdf_unverified");
  assert.equal(candidates[1]?.reviewStatus, "needs_review");
  assert.match(candidates[1]?.publishPolicy ?? "", /do not copy/i);
  assert.ok(candidates[1]?.tags.includes("careerpower"));
  assert.equal(candidates[3]?.sourceId, "pw-ssc-cgl-previous-year-papers");
  assert.equal(candidates[3]?.sourceType, "web_pdf_unverified");
});

test("SSC CGL user-supplied scrapers reject generic navigation noise", () => {
  const probe = String.raw`
import importlib.util, json
import sys
from dataclasses import asdict
from pathlib import Path
spec = importlib.util.spec_from_file_location("ssc_cgl_resource_discovery", Path("scripts/ssc_cgl_resource_discovery.py"))
module = importlib.util.module_from_spec(spec)
sys.modules[spec.name] = module
spec.loader.exec_module(module)
source = {source.id: source for source in module.SOURCES}["sscportal-cgl-model-questions"]
samples = [
    module.candidate_from_link(source, "/", "https://sscportal.in/"),
    module.candidate_from_link(source, "/calendar", "Exam Calendar"),
    module.candidate_from_link(source, "/study-kit", "PDF NOTES"),
    module.candidate_from_link(source, "/cgl/tier-1/model-questions#main-content", "Skip to main content"),
    module.candidate_from_link(source, "/cgl/tier-1/model-questions/reasoning-set-1", "Model Questions for SSC CGL TIER-1 (Reasoning) Set - 1"),
]
print(json.dumps([asdict(candidate) if candidate else None for candidate in samples], sort_keys=True))
`;
  const output = execFileSync("python", ["-c", probe], { cwd: process.cwd(), encoding: "utf8" });
  const candidates = JSON.parse(output) as Array<null | { title: string; url: string; sourceId: string }>;

  assert.deepEqual(candidates.slice(0, 4), [null, null, null, null]);
  assert.equal(candidates[4]?.sourceId, "sscportal-cgl-model-questions");
  assert.match(candidates[4]?.title ?? "", /Model Questions for SSC CGL TIER-1/i);
});

test("SSC CGL SSCPortal model-question parser turns all listed sets into practice leads", () => {
  const probe = String.raw`
import importlib.util, json
import sys
from dataclasses import asdict
from pathlib import Path
spec = importlib.util.spec_from_file_location("ssc_cgl_resource_discovery", Path("scripts/ssc_cgl_resource_discovery.py"))
module = importlib.util.module_from_spec(spec)
sys.modules[spec.name] = module
spec.loader.exec_module(module)
source = {source.id: source for source in module.SOURCES}["sscportal-cgl-model-questions"]
html = """
<main>
  <a href="/cgl/tier-1/model-questions/reasoning-set-1">Model Questions for SSC CGL TIER-1 (Reasoning) Set - 1</a>
  <a href="/calendar">Exam Calendar</a>
  <a href="/cgl/tier-1/model-questions/maths-set-2">Model Questions for SSC CGL TIER-1 (Mathematics) Set - 2</a>
  <p>Model Questions for SSC CGL TIER-1 (English) Set - 23</p>
  <p>Model Questions for SSC CGL TIER-1 (General Awareness) Set - 24</p>
</main>
"""
candidates = module.sscportal_model_question_candidates_from_html(html, source, limit=10)
merged = module.merge_candidates(candidates)
print(json.dumps([asdict(candidate) for candidate in merged], sort_keys=True))
`;
  const output = execFileSync("python", ["-c", probe], { cwd: process.cwd(), encoding: "utf8" });
  const candidates = JSON.parse(output) as Array<{ title: string; url: string; sourceId: string; sourceType: string; reviewStatus: string; tags: string[]; snippet: string }>;

  assert.equal(candidates.length, 4);
  assert.ok(candidates.every((candidate) => candidate.sourceId === "sscportal-cgl-model-questions"));
  assert.ok(candidates.every((candidate) => candidate.sourceType === "original_practice"));
  assert.ok(candidates.every((candidate) => candidate.reviewStatus === "needs_review"));
  assert.ok(candidates.every((candidate) => candidate.tags.includes("model-practice-lead")));
  assert.ok(candidates.some((candidate) => candidate.url.endsWith("/reasoning-set-1")));
  assert.ok(candidates.some((candidate) => candidate.url.includes("#listed-set-23")));
  assert.match(
    candidates.find((candidate) => candidate.url.includes("#listed-set-24"))?.snippet ?? "",
    /listed without a direct link/i,
  );
});

test("SSC CGL Drishti PDF leads use filename metadata when link text is generic", () => {
  const probe = String.raw`
import importlib.util, json
import sys
from dataclasses import asdict
from pathlib import Path
spec = importlib.util.spec_from_file_location("ssc_cgl_resource_discovery", Path("scripts/ssc_cgl_resource_discovery.py"))
module = importlib.util.module_from_spec(spec)
sys.modules[spec.name] = module
spec.loader.exec_module(module)
source = {source.id: source for source in module.SOURCES}["drishti-ssc-cgl-pyq-pdf"]
candidate = module.candidate_from_link(
    source,
    "https://vault.sscdrishti.com/english_file_uploads/1770126210_SSC-CGL-Tier-1-Question-Paper-Bilingual-26-September-2025-Shift-3.pdf",
    "Download PDF",
)
print(json.dumps(asdict(candidate) if candidate else None, sort_keys=True))
`;
  const output = execFileSync("python", ["-c", probe], { cwd: process.cwd(), encoding: "utf8" });
  const candidate = JSON.parse(output) as {
    title: string;
    sourceType: string;
    reviewStatus: string;
    tags: string[];
    snippet: string;
  } | null;

  assert.ok(candidate, "Drishti CGL PDF link should become a candidate");
  assert.equal(candidate?.sourceType, "web_pdf_unverified");
  assert.equal(candidate?.reviewStatus, "needs_review");
  assert.match(candidate?.title ?? "", /SSC CGL Tier 1 Question Paper Bilingual 26 September 2025 Shift 3/);
  assert.ok(candidate?.tags.includes("2025"));
  assert.ok(candidate?.tags.includes("shift-3"));
  assert.ok(candidate?.tags.includes("26-september-2025"));
  assert.match(candidate?.snippet ?? "", /filename-derived/i);
});

test("SSC CGL Internet Archive API parser ignores video-only solved-paper hits as PDF candidates", () => {
  const probe = String.raw`
import importlib.util, json
import sys
from dataclasses import asdict
from pathlib import Path
spec = importlib.util.spec_from_file_location("ssc_cgl_resource_discovery", Path("scripts/ssc_cgl_resource_discovery.py"))
module = importlib.util.module_from_spec(spec)
sys.modules[spec.name] = module
spec.loader.exec_module(module)
payload = {
    "response": {
        "docs": [
            {
                "identifier": "youtube-9_P7JdjXzQ8",
                "title": "SSC CGL 2015 SOLVED PAPER",
                "description": "This is the question paper of ssc cgl conducted in 2015 with all the answers!",
                "year": "2015",
                "mediatype": "movies"
            }
        ]
    }
}
candidates = module.candidates_from_archive_api(payload, discovered_at="2026-06-25T00:00:00+00:00")
backlog = module.build_pyq_backlog(candidates)
print(json.dumps({
    "candidates": [asdict(candidate) for candidate in candidates],
    "totals": backlog["totals"],
    "y2015": [entry for entry in backlog["years"] if entry["year"] == 2015][0],
}, sort_keys=True))
`;
  const output = execFileSync("python", ["-c", probe], { cwd: process.cwd(), encoding: "utf8" });
  const result = JSON.parse(output) as {
    candidates: unknown[];
    totals: { yearsWithAnyCandidate: number; yearsWithUnverifiedWebLead: number };
    y2015: { webCandidateIds: string[]; status: string };
  };

  assert.deepEqual(result.candidates, []);
  assert.deepEqual(result.y2015.webCandidateIds, []);
  assert.equal(result.y2015.status, "missing_source");
  assert.equal(result.totals.yearsWithAnyCandidate, 0);
  assert.equal(result.totals.yearsWithUnverifiedWebLead, 0);
});

test("SSC CGL PYQ backlog does not count generic archive books or coaching pages as year paper candidates", () => {
  const probe = String.raw`
import importlib.util, json
import sys
from pathlib import Path
spec = importlib.util.spec_from_file_location("ssc_cgl_resource_discovery", Path("scripts/ssc_cgl_resource_discovery.py"))
module = importlib.util.module_from_spec(spec)
sys.modules[spec.name] = module
spec.loader.exec_module(module)
candidates = [
    module.ResourceCandidate(
        id="archive-ssc-cgl-general-knowledge-ebook-2015",
        title="General Knowledge Ebook For SSC CGL 2015",
        url="https://archive.org/details/general-knowledge-ebook-for-ssc-cgl",
        sourceId="internet-archive-ssc-cgl-reference",
        sourceType="web_pdf_unverified",
        acquisitionPolicy="metadata first",
        publishPolicy="do not copy",
        reviewStatus="needs_review",
        tags=["archive", "archive-api", "web-pdf", "review", "2015"],
        discoveredAt="2026-06-25T00:00:00+00:00",
        snippet="Archive metadata for a preparation ebook."
    ),
    module.ResourceCandidate(
        id="archive-ssc-cgl-tier-i-2019-question-paper",
        title="SSC CGL Tier I 2019 Previous Year Question Paper",
        url="https://archive.org/details/ssc-cgl-tier-i-2019-question-paper",
        sourceId="internet-archive-ssc-cgl-reference",
        sourceType="web_pdf_unverified",
        acquisitionPolicy="metadata first",
        publishPolicy="do not copy",
        reviewStatus="needs_review",
        tags=["archive", "archive-api", "web-pdf", "review", "2019"],
        discoveredAt="2026-06-25T00:00:00+00:00",
        snippet="Archive metadata for a possible PYQ paper."
    )
]
backlog = module.build_pyq_backlog(candidates)
years = {entry["year"]: entry for entry in backlog["years"]}
print(json.dumps({
    "totals": backlog["totals"],
    "y2015": years[2015],
    "y2019": years[2019],
}, sort_keys=True))
`;
  const output = execFileSync("python", ["-c", probe], { cwd: process.cwd(), encoding: "utf8" });
  const result = JSON.parse(output) as {
    totals: { yearsWithAnyCandidate: number; yearsWithUnverifiedWebLead: number };
    y2015: { status: string; webCandidateIds: string[] };
    y2019: { status: string; webCandidateIds: string[] };
  };

  assert.equal(result.y2015.status, "missing_source");
  assert.deepEqual(result.y2015.webCandidateIds, []);
  assert.equal(result.y2019.status, "web_pdf_candidates_need_rights_review");
  assert.deepEqual(result.y2019.webCandidateIds, ["archive-ssc-cgl-tier-i-2019-question-paper"]);
  assert.equal(result.totals.yearsWithAnyCandidate, 0);
  assert.equal(result.totals.yearsWithUnverifiedWebLead, 1);
});

test("SSC CGL PYQ backlog shows official metadata and web leads together", () => {
  const probe = String.raw`
import importlib.util, json
import sys
from pathlib import Path
spec = importlib.util.spec_from_file_location("ssc_cgl_resource_discovery", Path("scripts/ssc_cgl_resource_discovery.py"))
module = importlib.util.module_from_spec(spec)
sys.modules[spec.name] = module
spec.loader.exec_module(module)
candidates = [
    module.ResourceCandidate(
        id="official-cgl-2025-answer-key-notice",
        title="CGL 2025 Final Answer Key Notice",
        url="https://ssc.gov.in/api/attachment/uploads/masterData/AnswerKeys/cgl-2025.pdf",
        sourceId="ssc-official-answer-key-notices",
        sourceType="official_notice_metadata",
        acquisitionPolicy="metadata only",
        publishPolicy="not a question paper",
        reviewStatus="metadata_only",
        tags=["official", "official-answer-key-notice", "2025"],
        discoveredAt="2026-06-25T00:00:00+00:00",
        snippet="official answer key metadata"
    ),
    module.ResourceCandidate(
        id="web-cgl-2025-question-paper",
        title="SSC CGL Tier I 2025 Previous Year Question Paper",
        url="https://example.com/ssc-cgl-tier-i-2025-question-paper.pdf",
        sourceId="example-pyq",
        sourceType="web_pdf_unverified",
        acquisitionPolicy="metadata first",
        publishPolicy="do not copy",
        reviewStatus="needs_review",
        tags=["pyq", "question-paper", "2025"],
        discoveredAt="2026-06-25T00:00:00+00:00",
        snippet="web paper lead"
    )
]
backlog = module.build_pyq_backlog(candidates)
y2025 = [entry for entry in backlog["years"] if entry["year"] == 2025][0]
print(json.dumps({"totals": backlog["totals"], "y2025": y2025}, sort_keys=True))
`;
  const output = execFileSync("python", ["-c", probe], { cwd: process.cwd(), encoding: "utf8" });
  const result = JSON.parse(output) as {
    totals: { yearsWithOfficialPaper: number; yearsWithUnverifiedWebLead: number };
    y2025: { status: string; officialAnswerKeyNoticeIds: string[]; webCandidateIds: string[]; nextAction: string };
  };

  assert.equal(result.totals.yearsWithOfficialPaper, 0);
  assert.equal(result.totals.yearsWithUnverifiedWebLead, 1);
  assert.equal(result.y2025.status, "official_metadata_with_web_pdf_leads");
  assert.deepEqual(result.y2025.officialAnswerKeyNoticeIds, ["official-cgl-2025-answer-key-notice"]);
  assert.deepEqual(result.y2025.webCandidateIds, ["web-cgl-2025-question-paper"]);
  assert.match(result.y2025.nextAction, /rights-review/i);
});

test("SSC CGL PYQ backlog counts promoted agent-reviewed imports as ranked-ready years", () => {
  const probe = String.raw`
import importlib.util, json
import sys
from pathlib import Path
spec = importlib.util.spec_from_file_location("ssc_cgl_resource_discovery", Path("scripts/ssc_cgl_resource_discovery.py"))
module = importlib.util.module_from_spec(spec)
sys.modules[spec.name] = module
spec.loader.exec_module(module)
promoted_questions = [
    {"id": "q-2023-a", "year": 2023, "reviewStatus": "reviewed", "provenance": {"sourceId": "cracku-2023-shift-1"}},
    {"id": "q-2023-b", "year": 2023, "reviewStatus": "reviewed", "provenance": {"sourceId": "cracku-2023-shift-1"}},
    {"id": "q-2025-a", "year": 2025, "reviewStatus": "reviewed", "provenance": {"sourceId": "drishti-2025-shift-3"}},
    {"id": "q-2024-draft", "year": 2024, "reviewStatus": "needs_review", "provenance": {"sourceId": "draft-2024"}},
    {"id": "q-out-of-range", "year": 1976, "reviewStatus": "reviewed", "provenance": {"sourceId": "old"}},
]
backlog = module.build_pyq_backlog([], promoted_questions=promoted_questions)
years = {entry["year"]: entry for entry in backlog["years"]}
print(json.dumps({
    "totals": backlog["totals"],
    "y2023": years[2023],
    "y2024": years[2024],
    "y2025": years[2025],
}, sort_keys=True))
`;
  const output = execFileSync("python", ["-c", probe], { cwd: process.cwd(), encoding: "utf8" });
  const result = JSON.parse(output) as {
    totals: {
      yearsWithAnyCandidate: number;
      rankedEligibleYears: number;
      rankedEligibleQuestions: number;
      missingOfficialPaperYears: number;
    };
    y2023: { status: string; rankedEligible: boolean; rankedEligibleQuestionCount: number; rankedEligibleSourceIds: string[]; nextAction: string };
    y2024: { status: string; rankedEligible: boolean; rankedEligibleQuestionCount: number };
    y2025: { status: string; rankedEligible: boolean; rankedEligibleQuestionCount: number; rankedEligibleSourceIds: string[] };
  };

  assert.equal(result.totals.rankedEligibleYears, 2);
  assert.equal(result.totals.rankedEligibleQuestions, 3);
  assert.equal(result.totals.yearsWithAnyCandidate, 2);
  assert.equal(result.totals.missingOfficialPaperYears, 50);
  assert.equal(result.y2023.status, "ranked_ready_curated_imports");
  assert.equal(result.y2023.rankedEligible, true);
  assert.equal(result.y2023.rankedEligibleQuestionCount, 2);
  assert.deepEqual(result.y2023.rankedEligibleSourceIds, ["cracku-2023-shift-1"]);
  assert.match(result.y2023.nextAction, /remaining shifts/i);
  assert.equal(result.y2024.rankedEligible, false);
  assert.equal(result.y2024.rankedEligibleQuestionCount, 0);
  assert.equal(result.y2025.status, "ranked_ready_curated_imports");
  assert.equal(result.y2025.rankedEligible, true);
  assert.equal(result.y2025.rankedEligibleQuestionCount, 1);
  assert.deepEqual(result.y2025.rankedEligibleSourceIds, ["drishti-2025-shift-3"]);
});

test("SSC CGL PYQ backlog loader combines curated and uploaded-book promoted imports", () => {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "ssc-cgl-promoted-loader-"));
  const curatedPath = path.join(tempRoot, "curated-imports", "questions.json");
  const bookPath = path.join(tempRoot, "book-imports", "questions.json");
  fs.mkdirSync(path.dirname(curatedPath), { recursive: true });
  fs.mkdirSync(path.dirname(bookPath), { recursive: true });
  fs.writeFileSync(curatedPath, JSON.stringify([
    { id: "curated-2023", year: 2023, reviewStatus: "reviewed", provenance: { sourceId: "curated-source" } }
  ]), "utf8");
  fs.writeFileSync(bookPath, JSON.stringify([
    { id: "book-2025", year: 2025, reviewStatus: "reviewed", provenance: { sourceId: "book-source" } },
    { id: "book-draft", year: 2026, reviewStatus: "needs_review", provenance: { sourceId: "draft-source" } }
  ]), "utf8");

  const probe = String.raw`
import importlib.util, json
import sys
from pathlib import Path
spec = importlib.util.spec_from_file_location("ssc_cgl_resource_discovery", Path("scripts/ssc_cgl_resource_discovery.py"))
module = importlib.util.module_from_spec(spec)
sys.modules[spec.name] = module
spec.loader.exec_module(module)
questions = module.load_promoted_questions([Path(r"${curatedPath}"), Path(r"${bookPath}")])
backlog = module.build_pyq_backlog([], promoted_questions=questions)
years = {entry["year"]: entry for entry in backlog["years"]}
print(json.dumps({
  "loaded": len(questions),
  "rankedQuestions": backlog["totals"]["rankedEligibleQuestions"],
  "rankedYears": backlog["totals"]["rankedEligibleYears"],
  "y2023": years[2023]["rankedEligibleQuestionCount"],
  "y2025": years[2025]["rankedEligibleQuestionCount"],
  "y2026": years[2026]["rankedEligibleQuestionCount"],
}, sort_keys=True))
`;
  const output = execFileSync("python", ["-c", probe], { cwd: process.cwd(), encoding: "utf8" });
  const result = JSON.parse(output) as {
    loaded: number;
    rankedQuestions: number;
    rankedYears: number;
    y2023: number;
    y2025: number;
    y2026: number;
  };

  assert.equal(result.loaded, 3);
  assert.equal(result.rankedQuestions, 2);
  assert.equal(result.rankedYears, 2);
  assert.equal(result.y2023, 1);
  assert.equal(result.y2025, 1);
  assert.equal(result.y2026, 0);
});

test("SSC CGL resource discovery writes a truthful 50-year PYQ acquisition backlog", () => {
  const paths = runOfflineSeedToTemp();

  const backlog = JSON.parse(fs.readFileSync(paths.backlogPath, "utf8")) as {
    target: {
      startYear: number;
      endYear: number;
      targetYears: number;
      scope: string;
    };
    totals: {
      yearsTargeted: number;
      yearsWithOfficialPaper: number;
      yearsWithAnyCandidate: number;
      yearsWithUnverifiedWebLead: number;
      missingOfficialPaperYears: number;
      rankedEligibleYears: number;
    };
    years: Array<{
      year: number;
      status: string;
      rankedEligible: boolean;
      officialCandidateIds: string[];
      officialPaperCandidateIds: string[];
      officialAnswerKeyNoticeIds: string[];
      officialNoticeIds: string[];
      metadataReferenceIds: string[];
      nextAction: string;
    }>;
  };

  assert.equal(backlog.target.startYear, 1977);
  assert.equal(backlog.target.endYear, 2026);
  assert.equal(backlog.target.targetYears, 50);
  assert.match(backlog.target.scope, /Tier-I/i);
  assert.equal(backlog.totals.yearsTargeted, 50);
  assert.equal(backlog.years.length, 50);
  assert.equal(backlog.totals.yearsWithOfficialPaper, 0);
  assert.equal(backlog.totals.yearsWithAnyCandidate, 0);
  assert.equal(backlog.totals.yearsWithUnverifiedWebLead, 0);
  assert.equal(backlog.totals.rankedEligibleYears, 0);
  assert.equal(backlog.totals.missingOfficialPaperYears, 50);

  const currentCycle = backlog.years.find((entry) => entry.year === 2026);
  assert.ok(currentCycle, "2026 cycle should be tracked");
  assert.equal(currentCycle?.rankedEligible, false);
  assert.deepEqual(currentCycle?.officialCandidateIds, []);
  assert.ok(currentCycle?.officialNoticeIds.includes("official-ssc-2026-cgl-notice"));
  assert.deepEqual(currentCycle?.officialPaperCandidateIds, []);
  assert.ok(currentCycle?.metadataReferenceIds.includes("scribd-ssc-cgl-reference-search"));
  assert.match(currentCycle?.nextAction ?? "", /official previous-year paper/i);
});

test("SSC CGL source expansion plan is machine-readable and year-prioritized", () => {
  const paths = runOfflineSeedToTemp();

  const backlog = JSON.parse(fs.readFileSync(paths.backlogPath, "utf8")) as {
    years: Array<{ year: number; status: string; rankedEligible: boolean; officialCandidateIds: string[]; officialPaperCandidateIds: string[] }>;
  };
  const plan = JSON.parse(fs.readFileSync(paths.sourcePlanPath, "utf8")) as {
    generatedAt: string;
    sourceBacklog: {
      yearsTotal: number;
      yearsWithoutOfficialPaper: number;
      nextFocusYears: number[];
    };
    prioritizedTargets: Array<{
      year: number;
      priority: number;
      hasOfficialPaper: boolean;
      hasWebLead: boolean;
      recommendedSourceLanes: string[];
      recommendedQueries: string[];
    }>;
  };

  assert.ok(plan.generatedAt);
  assert.equal(plan.sourceBacklog.yearsTotal, 50);
  assert.equal(plan.prioritizedTargets.length, 50);
  assert.ok(plan.sourceBacklog.nextFocusYears.length > 0);

  const top = plan.prioritizedTargets[0];
  assert.ok(top.year >= 1977 && top.year <= 2026);
  assert.match(top.recommendedSourceLanes.join("|"), /searxng-ssc-cgl-pyq-search/);
  assert.ok(top.recommendedQueries.length >= 3);
  assert.equal(top.hasOfficialPaper, false);
  assert.equal(top.hasWebLead, false);

  const current = plan.prioritizedTargets.find((entry) => entry.year === 2026);
  assert.ok(current);
  assert.ok(current?.recommendedSourceLanes.includes("official-ssc-previous-year-question-paper-page"));

  const rankedYears = backlog.years.filter((entry) => entry.rankedEligible).map((entry) => entry.year);
  assert.ok(Array.isArray(rankedYears));
  assert.equal(rankedYears.length, 0);
});

test("SSC CGL SearXNG discovery keeps paper/PDF leads and drops forum chatter", () => {
  const output = execFileSync("python", ["-c", `
import importlib.util
import json
import sys
from dataclasses import asdict
from pathlib import Path

script_path = Path("scripts/ssc_cgl_resource_discovery.py").resolve()
spec = importlib.util.spec_from_file_location("resource_discovery", script_path)
module = importlib.util.module_from_spec(spec)
sys.modules[spec.name] = module
spec.loader.exec_module(module)

source = module.source_from_search_result()
samples = [
    module.candidate_from_external_result(
        source,
        "https://cdn.example.com/SSC-CGL-2024-Tier-1-Question-Paper.pdf",
        "SSC CGL 2024 Tier 1 Question Paper PDF",
        "Official-looking question paper PDF lead",
        ["engine-google"],
    ),
    module.candidate_from_external_result(
        source,
        "https://www.reddit.com/r/UPSC/comments/example/first_time_appearing_for_ssc_cgl/",
        "First time appearing for SSC CGL exam. How and what to study?",
        "Forum discussion, not a paper or PDF lead",
        ["engine-brave"],
    ),
]
print(json.dumps([asdict(candidate) if candidate else None for candidate in samples], sort_keys=True))
`], { cwd: process.cwd(), encoding: "utf8" });
  const candidates = JSON.parse(output) as Array<null | { title: string; sourceId: string; sourceType: string; url: string }>;

  assert.equal(candidates[0]?.sourceId, "searxng-ssc-cgl-pyq-search");
  assert.equal(candidates[0]?.sourceType, "web_pdf_unverified");
  assert.match(candidates[0]?.url ?? "", /\.pdf$/);
  assert.equal(candidates[1], null);
});

test("SSC CGL Python resource tools declare Scrapling dependencies", () => {
  const requirements = fs.readFileSync(path.join(process.cwd(), "requirements-ssc.txt"), "utf8");

  assert.match(requirements, /scrapling/i);
  assert.match(requirements, /curl_cffi/i);
  assert.match(requirements, /browserforge/i);
});
