import { isValidElement } from "react";
import ReactMarkdown from "react-markdown";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import { CodeBlock } from "@/components/CodeBlock";
import { MermaidDiagram } from "@/components/MermaidDiagram";
import { PreviewLink } from "@/components/PreviewLink";
import type { NotePreview } from "@/lib/content";
import { uniqueHeadingAnchorId } from "@/lib/heading-anchors";
import { prepareMarkdownContent } from "@/lib/markdown-normalize";
import { normalizeCodeLanguage } from "@/lib/code-block";

function flattenText(children: unknown): string {
  if (typeof children === "string") return children;
  if (Array.isArray(children)) return children.map(flattenText).join("");
  if (children && typeof children === "object" && "props" in children) {
    return flattenText((children as { props?: { children?: unknown } }).props?.children);
  }
  return "";
}

function normalizeLookupKey(value: string) {
  return value.toLowerCase().replace(/\.md$/i, "").replace(/[^a-z0-9]+/g, " ").trim();
}

function basenameWithoutExtension(value: string) {
  const normalized = value.split("#")[0]?.split("?")[0] || value;
  const parts = normalized.replaceAll("\\", "/").split("/");
  return parts[parts.length - 1]?.replace(/\.md$/i, "") || normalized;
}

function previewLookup(previews: NotePreview[]) {
  const lookup = new Map<string, NotePreview>();
  for (const preview of previews) {
    for (const key of [preview.slug, preview.title, preview.label, ...(preview.aliases || [])]) {
      const normalized = normalizeLookupKey(key);
      if (normalized && !lookup.has(normalized)) lookup.set(normalized, preview);
    }
  }
  return lookup;
}

export function MarkdownNote({ content, previews = [], sectionName }: { content: string; previews?: NotePreview[]; sectionName?: string }) {
  const lookup = previewLookup(previews);
  const preparedContent = prepareMarkdownContent(content, sectionName);
  const headingIds = new Map<string, number>();

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm, remarkMath]}
      rehypePlugins={[rehypeRaw, [rehypeKatex, { strict: false, throwOnError: false }]]}
      components={{
        a({ href = "", children }) {
          const text = flattenText(children);
          const key = href.startsWith("/notes/") ? href.replace("/notes/", "") : basenameWithoutExtension(href || text);
          const preview = lookup.get(normalizeLookupKey(key)) || lookup.get(normalizeLookupKey(text));
          return <PreviewLink href={href || "#"} preview={preview}>{children}</PreviewLink>;
        },
        h2({ children }) {
          return <h2 id={uniqueHeadingAnchorId(flattenText(children), headingIds)}>{children}</h2>;
        },
        h3({ children }) {
          return <h3 id={uniqueHeadingAnchorId(flattenText(children), headingIds)}>{children}</h3>;
        },
        h4({ children }) {
          return <h4 id={uniqueHeadingAnchorId(flattenText(children), headingIds)}>{children}</h4>;
        },
        pre({ children }) {
          const child = Array.isArray(children) ? children[0] : children;
          const className =
            isValidElement(child) && typeof child.props === "object" && child.props && "className" in child.props
              ? String((child.props as { className?: unknown }).className || "")
              : "";
          const language = normalizeCodeLanguage(className);
          const text = flattenText(children);
          if (language === "mermaid") return <MermaidDiagram source={text} />;
          return <CodeBlock className={className} text={text} />;
        },
        code({ className, children, ...props }) {
          const language = /language-(\w+)/.exec(className || "")?.[1];
          return <code className={className} data-language={language} {...props}>{children}</code>;
        }
      }}
    >
      {preparedContent}
    </ReactMarkdown>
  );
}
