import { deepTutorApiBaseUrl } from "@/lib/deeptutor";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const source = new URL(request.url);
  const target = new URL(`${deepTutorApiBaseUrl()}/api/v1/auth/openai-codex/callback`);
  for (const key of ["code", "state", "error"]) {
    const values = source.searchParams.getAll(key);
    if (values.length === 1 && values[0].length <= 4096) target.searchParams.set(key, values[0]);
  }
  try {
    const response = await fetch(target, { cache: "no-store", signal: AbortSignal.timeout(20_000) });
    return new Response(await response.text(), {
      status: response.status,
      headers: { "Cache-Control": "no-store", "Content-Type": "text/html; charset=utf-8", "X-Content-Type-Options": "nosniff" }
    });
  } catch {
    return new Response("<!doctype html><title>DeepTutor</title><p>ChatGPT sign-in could not reach DeepTutor. Return to the Tutor tab and try again.</p>", {
      status: 502,
      headers: { "Cache-Control": "no-store", "Content-Type": "text/html; charset=utf-8", "X-Content-Type-Options": "nosniff" }
    });
  }
}
