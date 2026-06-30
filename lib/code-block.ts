export function codeBlockCopyText(value: string) {
  return value.endsWith("\n") ? value.slice(0, -1) : value;
}

export function normalizeCodeLanguage(className?: string) {
  return /language-([\w-]+)/.exec(className || "")?.[1] || "code";
}
