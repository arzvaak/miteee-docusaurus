import { NextResponse } from "next/server";
import { auth, ensureAuthMigrations } from "@/lib/auth";
import { deepTutorApiBaseUrl, hasDeepTutorAccess, type DeepTutorModelOption } from "@/lib/deeptutor";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const privateHeaders = {
  "Cache-Control": "private, no-store",
  "X-Content-Type-Options": "nosniff"
};

type UpstreamModelOption = {
  profile_id?: unknown;
  model_id?: unknown;
  profile_name?: unknown;
  model_name?: unknown;
  model?: unknown;
  provider?: unknown;
  provider_label?: unknown;
  is_active_default?: unknown;
};

type Catalog = {
  version?: number;
  services?: Record<string, {
    active_profile_id?: string | null;
    active_model_id?: string | null;
    profiles?: Array<Record<string, unknown>>;
  }>;
};

async function authorized(request: Request) {
  await ensureAuthMigrations();
  const session = await auth.api.getSession({ headers: request.headers });
  return Boolean(session && hasDeepTutorAccess(session.user.email));
}

async function upstream(path: string, init?: RequestInit) {
  return fetch(`${deepTutorApiBaseUrl()}${path}`, {
    ...init,
    cache: "no-store",
    signal: AbortSignal.timeout(30_000),
    headers: {
      ...(init?.body ? { "Content-Type": "application/json" } : {}),
      ...init?.headers
    }
  });
}

function cleanOptions(payload: unknown): { active: { profileId: string; modelId: string } | null; options: DeepTutorModelOption[] } {
  const input = payload && typeof payload === "object" ? payload as { active?: unknown; options?: unknown } : {};
  const options: DeepTutorModelOption[] = [];
  for (const item of Array.isArray(input.options) ? input.options as UpstreamModelOption[] : []) {
    const profileId = typeof item.profile_id === "string" ? item.profile_id : "";
    const modelId = typeof item.model_id === "string" ? item.model_id : "";
    if (!profileId || !modelId) continue;
    const provider = typeof item.provider_label === "string"
      ? item.provider_label
      : typeof item.provider === "string" ? item.provider : "Model";
    const modelName = typeof item.model_name === "string"
      ? item.model_name
      : typeof item.model === "string" ? item.model : modelId;
    const profileName = typeof item.profile_name === "string" ? item.profile_name : provider;
    options.push({
      profileId,
      modelId,
      provider,
      label: `${modelName} · ${profileName}`,
      isDefault: item.is_active_default === true
    });
  }
  const activeInput = input.active && typeof input.active === "object"
    ? input.active as { profile_id?: unknown; model_id?: unknown }
    : null;
  const active = typeof activeInput?.profile_id === "string" && typeof activeInput.model_id === "string"
    ? { profileId: activeInput.profile_id, modelId: activeInput.model_id }
    : null;
  return { active, options };
}

function cleanOauth(payload: unknown) {
  if (!payload || typeof payload !== "object") return null;
  const input = payload as Record<string, unknown>;
  const connection = String(input.connection);
  return {
    connection: (["disconnected", "authorizing", "connected", "error"].includes(connection)
      ? connection : "disconnected") as "disconnected" | "authorizing" | "connected" | "error",
    operationState: typeof input.operation_state === "string" ? input.operation_state : null,
    authorizeUrl: typeof input.authorize_url === "string" ? input.authorize_url : null,
    expiresIn: typeof input.expires_in === "number" ? input.expires_in : null,
    callbackPort: typeof input.callback_port === "number" ? input.callback_port : null,
    modelCount: typeof input.model_count === "number" ? input.model_count : 0,
    activeModel: typeof input.active_model === "string" ? input.active_model : null,
    errorCode: typeof input.error_code === "string" ? input.error_code : null
  };
}

function sshBridgeCommand(callbackPort: number | null | undefined) {
  return callbackPort
    ? `ssh -N -L ${callbackPort}:127.0.0.1:${process.env.NEXT_APP_PORT?.trim() || "3025"} ${process.env.DEEPTUTOR_SSH_TARGET?.trim() || "root@note.arzvak.com"}`
    : null;
}

async function modelPayload() {
  const [modelsResponse, oauthResponse] = await Promise.all([
    upstream("/api/v1/settings/llm-options"),
    upstream("/api/v1/settings/providers/openai-codex/oauth/status")
  ]);
  if (!modelsResponse.ok) throw new Error(`Model list returned ${modelsResponse.status}`);
  const models = cleanOptions(await modelsResponse.json());
  const oauth = oauthResponse.ok ? cleanOauth(await oauthResponse.json()) : null;
  return { ...models, oauth, sshCommand: sshBridgeCommand(oauth?.callbackPort) };
}

export async function GET(request: Request) {
  if (!await authorized(request)) {
    return NextResponse.json({ error: "Not found." }, { status: 404, headers: privateHeaders });
  }
  try {
    return NextResponse.json(await modelPayload(), { headers: privateHeaders });
  } catch {
    return NextResponse.json({ error: "Tutor models could not be loaded." }, { status: 502, headers: privateHeaders });
  }
}

export async function POST(request: Request) {
  if (!await authorized(request)) {
    return NextResponse.json({ error: "Not found." }, { status: 404, headers: privateHeaders });
  }
  const body = await request.json().catch(() => null) as Record<string, unknown> | null;
  const action = typeof body?.action === "string" ? body.action : "";

  try {
    if (["oauth_start", "oauth_cancel", "oauth_logout", "oauth_refresh"].includes(action)) {
      const paths: Record<string, string> = {
        oauth_start: "/api/v1/settings/providers/openai-codex/oauth/start",
        oauth_cancel: "/api/v1/settings/providers/openai-codex/oauth/cancel",
        oauth_logout: "/api/v1/settings/providers/openai-codex/oauth/logout",
        oauth_refresh: "/api/v1/settings/providers/openai-codex/models/refresh"
      };
      const response = await upstream(paths[action], { method: "POST" });
      const payload = await response.json().catch(() => null);
      if (!response.ok) {
        return NextResponse.json({ error: "ChatGPT connection could not be updated.", detail: payload }, { status: 502, headers: privateHeaders });
      }
      const cleaned = cleanOauth(payload);
      return NextResponse.json({
        oauth: cleaned,
        authorizeUrl: cleaned?.authorizeUrl,
        callbackPort: cleaned?.callbackPort,
        sshCommand: sshBridgeCommand(cleaned?.callbackPort)
      }, { headers: privateHeaders });
    }

    if (action === "configure_deepseek") {
      const apiKeyInput = body?.apiKey;
      const modelInput = body?.model;
      const apiKey = typeof apiKeyInput === "string" ? apiKeyInput.trim() : "";
      const model = typeof modelInput === "string" ? modelInput.trim() : "";
      if (!apiKey || apiKey.length > 512 || !/^[a-zA-Z0-9_.:/-]{2,160}$/.test(model)) {
        return NextResponse.json({ error: "Enter a valid DeepSeek key and model." }, { status: 400, headers: privateHeaders });
      }
      const catalogResponse = await upstream("/api/v1/settings/catalog");
      if (!catalogResponse.ok) throw new Error("Catalog unavailable");
      const wrapper = await catalogResponse.json() as { catalog?: Catalog };
      const catalog = wrapper.catalog || {};
      const services = catalog.services ||= {};
      const llm = services.llm ||= { active_profile_id: null, active_model_id: null, profiles: [] };
      const profiles = Array.isArray(llm.profiles) ? llm.profiles : [];
      const profile = {
        id: "miteee-deepseek-user",
        name: "My DeepSeek",
        binding: "deepseek",
        base_url: "https://api.deepseek.com",
        api_key: apiKey,
        api_version: "",
        extra_headers: {},
        models: [{ id: `miteee-deepseek-${model.replace(/[^a-zA-Z0-9_-]/g, "-")}`, name: model, model, context_window: 128000 }]
      };
      llm.profiles = [...profiles.filter((item) => item.id !== profile.id), profile];
      const saveResponse = await upstream("/api/v1/settings/catalog", {
        method: "PUT",
        body: JSON.stringify({ catalog })
      });
      if (!saveResponse.ok) throw new Error("Catalog save failed");
      const applyResponse = await upstream("/api/v1/settings/apply", { method: "POST" });
      if (!applyResponse.ok) throw new Error("Catalog apply failed");
      return NextResponse.json(await modelPayload(), { headers: privateHeaders });
    }

    return NextResponse.json({ error: "Unknown model action." }, { status: 400, headers: privateHeaders });
  } catch {
    return NextResponse.json({ error: "Tutor model settings could not be updated." }, { status: 502, headers: privateHeaders });
  }
}
