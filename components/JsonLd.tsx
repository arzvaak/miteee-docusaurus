import Script from "next/script";

function hashJsonLd(value: string) {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = ((hash << 5) - hash + value.charCodeAt(index)) | 0;
  }
  return Math.abs(hash).toString(36);
}

export function JsonLd({ data }: { data: Record<string, unknown> | Array<Record<string, unknown>> }) {
  const json = JSON.stringify(data).replace(/</g, "\\u003c");
  return <Script id={`json-ld-${hashJsonLd(json)}`} type="application/ld+json" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: json }} />;
}
