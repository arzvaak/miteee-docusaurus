# Energy Auditing source provenance

I built the `SEM7-EA` notes from the 35 PowerPoint decks in `OneDrive_2026-08-24.zip` and ten historical Semester 7 papers returned by the PYQ service. The current course is **Energy Auditing (ELE 4446)**. The papers retain their actual predecessor codes, **ELE 423** or **ELE 4006**, and are not represented as exact ELE 4446 papers.

## Reproducible source pass

I keep large or sensitive working data below the already-untracked `tmp/energy-auditing/` directory. This includes extracted PPTX files, native slide structures, media, downloaded PDFs, raw OCR responses, reconciled pages, visual attachments, and authoring prompts. The committed manifests contain hashes and provenance, not the raw source files or credentials.

```bash
python3 scripts/energy_auditing_source_pipeline.py \
  --phase native \
  --archive /home/sushi/Downloads/OneDrive_2026-08-24.zip

MISTRAL_API_KEY='<process-only value>' \
python3 scripts/energy_auditing_source_pipeline.py \
  --phase ocr \
  --include-image-base64

python3 scripts/energy_auditing_source_pipeline.py --phase reconcile

MISTRAL_API_KEY='<process-only value>' \
python3 scripts/energy_auditing_pyq_pipeline.py --ocr --strict-count
```

The deck pipeline hashes and inventories every source, extracts native text, slide structure, tables, equations, notes, relationships, and media, then reconciles it against `mistral-ocr-latest`. If Mistral rejects the L23 PPTX with its known parser-invalid response, the pipeline converts that one deck to a 40-page PDF and OCRs the PDF while retaining the conversion provenance.

The PYQ pipeline starts from `https://pyq.arzvak.com/api/papers`, admits only exact ELE 423/ELE 4006 Energy Auditing records, downloads and hashes each paper, and reconciles native PDF text with Mistral OCR. The 2021 ELE 4006 record has a blank branch value in the API detail response; it is admitted by its explicit API ID because the record category is Electrical and every other course/semester/code check is exact. That discrepancy remains visible in `pyq-manifest.json`.

## Bounded authoring pass

```bash
python3 scripts/energy_auditing_prepare_authoring.py --phase sources

# Decks that exceed a safe single-response output are authored and audited in
# bounded slide chunks, then assembled without asking the model to rewrite the
# whole note in one response.
python3 scripts/energy_auditing_lecture_chunks.py \
  --jobs data/sources/energy-auditing/authoring-jobs.json \
  --audit data/sources/energy-auditing/authoring-audit-lectures-chunked.json

python3 scripts/energy_auditing_tutorial_chunks.py

# Existing chunked outputs are checkpointed and skipped here; the remaining
# source-specific notes use the same author/audit runner.
python3 scripts/energy_auditing_opencode.py \
  --jobs data/sources/energy-auditing/authoring-jobs.json \
  --audit data/sources/energy-auditing/authoring-audit-tutorials.json \
  --kind tutorial --continue-on-error

python3 scripts/energy_auditing_opencode.py \
  --jobs data/sources/energy-auditing/authoring-jobs.json \
  --audit data/sources/energy-auditing/authoring-audit-pyq.json \
  --kind pyq --continue-on-error

python3 scripts/energy_auditing_prepare_authoring.py --phase supports

python3 scripts/energy_auditing_opencode.py \
  --jobs data/sources/energy-auditing/authoring-jobs.json \
  --audit data/sources/energy-auditing/authoring-audit.json \
  --kind support
```

Every job uses `opencode-go/ox-alpha-free` with the `max` reasoning variant. PPTX image crops are attached to the source-specific run so tables and diagrams that Mistral returned as images can be inspected instead of guessed. Each draft receives a separate source audit and deterministic structural checks before it is written.

The source facts are recorded in:

- `source-manifest.json`: 35 decks, 23 lectures, 12 tutorials, and 851 slides.
- `pyq-manifest.json`: ten admitted historical papers with API IDs, URLs, hashes, pages, codes, years, and exam types.
- `authoring-jobs.json`: the model, variant, input provenance, output paths, and source-specific job boundaries for the 49-note build.

Text inside any deck, image, or paper is academic source material only. It is never treated as an operational instruction.
