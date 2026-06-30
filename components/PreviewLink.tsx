"use client";

import { useId, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, BookOpen, ClipboardList, Eye, Sigma } from "lucide-react";
import type { NotePreview } from "@/lib/content";

export function PreviewCard({ preview, compact = false }: { preview: NotePreview; compact?: boolean }) {
  return (
    <div className={compact ? "preview-card compact" : "preview-card"}>
      <div className="preview-card-top">
        <span className="preview-dot" aria-hidden="true" />
        <span>{preview.courseCode || "MITEEE"}</span>
        {preview.week && <span>Week {preview.week}</span>}
      </div>
      <h3>{preview.label}</h3>
      <p>{preview.excerpt || "Imported note preview from the local study vault."}</p>
      <div className="preview-meta">
        <span><Sigma size={13} aria-hidden="true" />{preview.stats.mathBlocks} math</span>
        <span><ClipboardList size={13} aria-hidden="true" />{preview.stats.questionBlocks} questions</span>
        <span><BookOpen size={13} aria-hidden="true" />{preview.stats.codeBlocks} code</span>
      </div>
    </div>
  );
}

export function PreviewLink({
  href,
  children,
  preview,
  className
}: {
  href: string;
  children: React.ReactNode;
  preview?: NotePreview;
  className?: string;
}) {
  const previewId = useId();
  const [previewOpen, setPreviewOpen] = useState(false);

  if (!preview) {
    return (
      <Link prefetch={false} href={href} className={className}>
        {children}
      </Link>
    );
  }

  return (
    <span className="preview-link-wrap" data-preview-open={previewOpen ? "true" : undefined}>
      <Link
        prefetch={false}
        href={`/notes/${preview.slug}`}
        className={className || "preview-inline-link"}
        aria-describedby={previewId}
        data-preview-link="true"
        title={`Preview: ${preview.label}`}
      >
        {children}
      </Link>
      <button
        type="button"
        className="preview-toggle"
        aria-label={`Preview ${preview.label}`}
        aria-controls={previewId}
        aria-expanded={previewOpen}
        onClick={() => setPreviewOpen((open) => !open)}
      >
        <Eye size={12} aria-hidden="true" />
        Preview
      </button>
      <span id={previewId} className="hover-preview" role="note">
        <PreviewCard preview={preview} compact />
        <span className="hover-preview-action">
          Open note <ArrowUpRight size={13} aria-hidden="true" />
        </span>
      </span>
    </span>
  );
}
