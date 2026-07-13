import { getSscQuestions } from "@/lib/ssc-cgl";
import {
  buildSscEndlessBatch,
  buildSscSessionTest,
  parseSscSessionConfig
} from "@/lib/ssc-cgl-session";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const config = parseSscSessionConfig(Object.fromEntries(url.searchParams.entries()));
  const cursor = Number.parseInt(url.searchParams.get("cursor") ?? "0", 10);
  const limit = Number.parseInt(url.searchParams.get("limit") ?? "20", 10);
  const batch = buildSscEndlessBatch(
    getSscQuestions(),
    { ...config, mode: "endless", length: "endless" },
    Number.isFinite(cursor) ? cursor : 0,
    Number.isFinite(limit) ? limit : 20
  );

  return Response.json(batch, {
    headers: { "Cache-Control": "private, no-store" }
  });
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return Response.json({ error: "A session configuration is required." }, { status: 400 });
  }

  const row = body as Record<string, unknown>;
  const configRow = row.config && typeof row.config === "object" && !Array.isArray(row.config)
    ? row.config as Record<string, unknown>
    : {};
  const config = parseSscSessionConfig(Object.fromEntries(
    Object.entries(configRow).map(([key, value]) => [key, typeof value === "string" || typeof value === "number" ? String(value) : undefined])
  ));
  const questionIds = Array.isArray(row.questionIds)
    ? row.questionIds.filter((value): value is string => typeof value === "string").slice(0, 200)
    : [];
  const result = buildSscSessionTest(getSscQuestions(), { ...config, mode: "weak" }, questionIds);

  return Response.json(result, {
    headers: { "Cache-Control": "private, no-store" }
  });
}
