import { toNextJsHandler } from "better-auth/next-js";
import { auth, ensureAuthMigrations } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const handlers = toNextJsHandler(auth);

async function privateAuthResponse(responsePromise: Promise<Response>) {
  const response = await responsePromise;
  response.headers.set("Cache-Control", "private, no-store");
  return response;
}

export async function GET(request: Request) {
  await ensureAuthMigrations();
  return privateAuthResponse(handlers.GET(request));
}

export async function POST(request: Request) {
  await ensureAuthMigrations();
  return privateAuthResponse(handlers.POST(request));
}
