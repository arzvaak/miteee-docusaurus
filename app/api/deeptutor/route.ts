import { NextResponse } from "next/server";
import { auth, ensureAuthMigrations } from "@/lib/auth";
import {
  buildDeepTutorMessage,
  deepTutorApiBaseUrl,
  deepTutorKnowledgeBase,
  deepTutorWebSocketUrl,
  hasDeepTutorAccess,
  parseDeepTutorTurnRequest
} from "@/lib/deeptutor";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const encoder = new TextEncoder();
const connectionTimeoutMs = 15_000;
const turnTimeoutMs = 5 * 60_000;

async function ownerSession(request: Request) {
  await ensureAuthMigrations();
  const session = await auth.api.getSession({ headers: request.headers });
  return session && hasDeepTutorAccess(session.user.email) ? session : null;
}

function privateHeaders() {
  return {
    "Cache-Control": "private, no-store",
    "X-Content-Type-Options": "nosniff"
  };
}

export async function GET(request: Request) {
  if (!await ownerSession(request)) {
    return NextResponse.json({ enabled: false }, { status: 404, headers: privateHeaders() });
  }

  try {
    const response = await fetch(`${deepTutorApiBaseUrl()}/api/v1/system/status`, {
      cache: "no-store",
      signal: AbortSignal.timeout(4_000)
    });
    return NextResponse.json({ enabled: true, available: response.ok }, { headers: privateHeaders() });
  } catch {
    return NextResponse.json({ enabled: true, available: false }, { headers: privateHeaders() });
  }
}

export async function DELETE(request: Request) {
  if (!await ownerSession(request)) {
    return NextResponse.json({ error: "Not found." }, { status: 404, headers: privateHeaders() });
  }

  const body = await request.json().catch(() => null) as { sessionId?: unknown } | null;
  const sessionId = typeof body?.sessionId === "string" ? body.sessionId.trim() : "";
  if (!/^[a-zA-Z0-9_-]{1,160}$/.test(sessionId)) {
    return NextResponse.json({ error: "Invalid session." }, { status: 400, headers: privateHeaders() });
  }

  try {
    const response = await fetch(`${deepTutorApiBaseUrl()}/api/v1/sessions/${encodeURIComponent(sessionId)}`, {
      method: "DELETE",
      cache: "no-store",
      signal: AbortSignal.timeout(8_000)
    });
    if (!response.ok && response.status !== 404) throw new Error(`DeepTutor returned ${response.status}`);
    return NextResponse.json({ deleted: true }, { headers: privateHeaders() });
  } catch {
    return NextResponse.json({ error: "The tutor session could not be cleared." }, { status: 502, headers: privateHeaders() });
  }
}

export async function POST(request: Request) {
  if (!await ownerSession(request)) {
    return NextResponse.json({ error: "Not found." }, { status: 404, headers: privateHeaders() });
  }

  const parsed = parseDeepTutorTurnRequest(await request.json().catch(() => null));
  if (!parsed) {
    return NextResponse.json({ error: "Invalid tutor request." }, { status: 400, headers: privateHeaders() });
  }

  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      let closed = false;
      let socket: WebSocket | null = null;
      let connectionTimer: ReturnType<typeof setTimeout> | null = null;
      let turnTimer: ReturnType<typeof setTimeout> | null = null;

      const emit = (value: unknown) => {
        if (!closed) controller.enqueue(encoder.encode(`${JSON.stringify(value)}\n`));
      };
      const finish = () => {
        if (closed) return;
        closed = true;
        if (connectionTimer) clearTimeout(connectionTimer);
        if (turnTimer) clearTimeout(turnTimer);
        if (socket && socket.readyState < WebSocket.CLOSING) socket.close(1000, "turn complete");
        controller.close();
      };
      const fail = (message: string) => {
        emit({ type: "error", content: message, metadata: { turn_terminal: true, status: "failed" } });
        finish();
      };

      try {
        socket = new WebSocket(deepTutorWebSocketUrl());
      } catch {
        fail("DeepTutor is not configured yet.");
        return;
      }

      connectionTimer = setTimeout(() => fail("DeepTutor did not accept the connection in time."), connectionTimeoutMs);
      turnTimer = setTimeout(() => fail("The tutor turn timed out."), turnTimeoutMs);

      socket.addEventListener("open", () => {
        if (connectionTimer) clearTimeout(connectionTimer);
        socket?.send(JSON.stringify({
          type: "start_turn",
          content: buildDeepTutorMessage(parsed),
          capability: parsed.capability,
          tools: ["rag"],
          knowledge_bases: [deepTutorKnowledgeBase],
          session_id: parsed.sessionId,
          language: "en",
          config: { max_steps: parsed.capability === "chat" ? 6 : 10 },
          llm_selection: parsed.model ? {
            profile_id: parsed.model.profileId,
            model_id: parsed.model.modelId
          } : null
        }));
      });

      socket.addEventListener("message", (event) => {
        try {
          const payload = JSON.parse(String(event.data)) as { type?: string };
          emit(payload);
          if (payload.type === "done") finish();
        } catch {
          fail("DeepTutor returned an unreadable stream event.");
        }
      });
      socket.addEventListener("error", () => fail("DeepTutor could not be reached."));
      socket.addEventListener("close", () => {
        if (!closed) fail("The tutor connection closed before the turn completed.");
      });

      request.signal.addEventListener("abort", finish, { once: true });
    }
  });

  return new Response(stream, {
    headers: {
      ...privateHeaders(),
      "Content-Type": "application/x-ndjson; charset=utf-8",
      "X-Accel-Buffering": "no"
    }
  });
}
