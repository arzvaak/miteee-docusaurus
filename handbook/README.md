# MITEEE contributor handbook

This is the operating manual for growing the study site without having to rediscover its conventions every semester.

## Use the shortest relevant path

- [Adding notes](adding-notes.md): folder naming, frontmatter, note structure, formulas, diagrams, code, links, assets, quizzes, new subjects, previewing, and troubleshooting.
- [Architecture](architecture.md): how source content becomes a rendered site, what each top-level folder owns, and which data is generated or persistent.
- [Adding features](adding-features.md): the expected shape of a new page, component, study tool, API, or persisted browser feature.
- [Validation and release](validation-and-release.md): focused checks, full checks, local production verification, and what happens after a push to `main`.

The repository-level [CONTRIBUTING.md](../CONTRIBUTING.md) is the quick entry point. A copy-ready academic note is available at [`templates/academic-note.md`](../templates/academic-note.md).

## Core mental model

```text
docs/**/*.md
    ↓ npm run build:content
data/generated/*.json + public/content-assets/**
    ↓ Next.js reads generated data
/courses/<COURSE-CODE> + /notes/<generated-slug>
```

Application features follow a separate path:

```text
app route → component → lib/domain logic → test
```

If a future change no longer fits either path, update this handbook as part of that change.
