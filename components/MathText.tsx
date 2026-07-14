import ReactMarkdown from "react-markdown";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";
import {
  normalizeCurrencyDollars,
  normalizeLegacyMathDelimiters,
  normalizeMathForKatex,
  normalizeStandaloneMathText
} from "@/lib/markdown-normalize";
import { rehypeRawMathText } from "@/lib/rehype-raw-math-text";

const mathDelimiterPattern = /\$\$[\s\S]*?\$\$|(?<!\\)\$[^$\n]+(?<!\\)\$/;

export function MathText({ text }: { text: string }) {
  const standaloneReady = normalizeStandaloneMathText(text);
  const prepared = normalizeMathForKatex(
    normalizeCurrencyDollars(
      normalizeLegacyMathDelimiters(standaloneReady)
    )
  );

  if (!mathDelimiterPattern.test(prepared)) return <>{text}</>;

  return (
    <ReactMarkdown
      remarkPlugins={[remarkMath]}
      rehypePlugins={[rehypeRawMathText, [rehypeKatex, { strict: false, throwOnError: false, trust: false }]]}
      components={{
        p({ children }) {
          return <>{children}</>;
        }
      }}
    >
      {prepared}
    </ReactMarkdown>
  );
}
