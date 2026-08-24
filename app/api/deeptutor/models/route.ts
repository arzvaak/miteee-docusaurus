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

type ModelsDevModel = {
  id?: unknown;
  name?: unknown;
  status?: unknown;
  limit?: { context?: unknown };
  provider?: { npm?: unknown };
};

type ModelsDevProvider = {
  npm?: unknown;
  api?: unknown;
  models?: Record<string, ModelsDevModel>;
};

const modelsDevUrl = "https://models.dev/api.json";

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

async function authUpstream(path: string, init?: RequestInit) {
  const baseUrl = (process.env.DEEPTUTOR_AUTH_BASE_URL?.trim() || "http://deeptutor-auth:8002").replace(/\/$/, "");
  return fetch(`${baseUrl}${path}`, {
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
    errorCode: typeof input.error_code === "string" ? input.error_code : null,
    userCode: typeof input.user_code === "string" ? input.user_code : null,
    verificationUrl: typeof input.verification_url === "string" ? input.verification_url : null
  };
}

async function openCodeProfiles(plan: "go" | "zen", apiKey: string) {
  const providerId = plan === "go" ? "opencode-go" : "opencode";
  const expectedApi = plan === "go" ? "https://opencode.ai/zen/go/v1" : "https://opencode.ai/zen/v1";
  const response = await fetch(modelsDevUrl, { cache: "no-store", signal: AbortSignal.timeout(20_000) });
  if (!response.ok) throw new Error("OpenCode model catalog unavailable");
  const providers = await response.json() as Record<string, ModelsDevProvider>;
  const provider = providers[providerId];
  if (!provider || provider.api !== expectedApi || !provider.models) throw new Error("OpenCode provider catalog invalid");

  const compatible: Array<Record<string, unknown>> = [];
  const anthropic: Array<Record<string, unknown>> = [];
  for (const [slug, item] of Object.entries(provider.models)) {
    if (item.status === "deprecated") continue;
    const model = typeof item.id === "string" && item.id ? item.id : slug;
    const name = typeof item.name === "string" && item.name ? item.name : model;
    const context = typeof item.limit?.context === "number" && item.limit.context > 0 ? item.limit.context : 128_000;
    const npm = typeof item.provider?.npm === "string" ? item.provider.npm : provider.npm;
    const target = npm === "@ai-sdk/anthropic" ? anthropic : npm === "@ai-sdk/openai-compatible" ? compatible : null;
    if (!target) continue;
    target.push({
      id: `miteee-opencode-${plan}-${model.replace(/[^a-zA-Z0-9_-]/g, "-")}`,
      name,
      model,
      context_window: context
    });
  }

  const profiles: Array<Record<string, unknown>> = [];
  if (compatible.length) profiles.push({
    id: `miteee-opencode-${plan}-chat`,
    name: plan === "go" ? "OpenCode Go" : "OpenCode Zen",
    binding: "custom",
    base_url: expectedApi,
    api_key: apiKey,
    api_version: "",
    extra_headers: {},
    models: compatible
  });
  if (anthropic.length) profiles.push({
    id: `miteee-opencode-${plan}-anthropic`,
    name: plan === "go" ? "OpenCode Go (Anthropic)" : "OpenCode Zen (Anthropic)",
    binding: "custom_anthropic",
    base_url: `${expectedApi}/messages`,
    api_key: apiKey,
    api_version: "",
    extra_headers: {},
    models: anthropic
  });
  if (!profiles.length) throw new Error("No DeepTutor-compatible OpenCode models found");
  return profiles;
}

async function modelPayload() {
  const [modelsResponse, oauthResponse, deviceResponse] = await Promise.all([
    upstream("/api/v1/settings/llm-options"),
    upstream("/api/v1/settings/providers/openai-codex/oauth/status"),
    authUpstream("/status").catch(() => null)
  ]);
  if (!modelsResponse.ok) throw new Error(`Model list returned ${modelsResponse.status}`);
  const models = cleanOptions(await modelsResponse.json());
  const upstreamOauth = oauthResponse.ok ? cleanOauth(await oauthResponse.json()) : null;
  const deviceOauth = deviceResponse?.ok ? cleanOauth(await deviceResponse.json()) : null;
  const oauth = deviceOauth?.connection === "authorizing" || deviceOauth?.operationState === "failed"
    ? deviceOauth
    : upstreamOauth;
  return { ...models, oauth };
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
    if (["oauth_start", "oauth_cancel"].includes(action)) {
      const response = await authUpstream(action === "oauth_start" ? "/start" : "/cancel", { method: "POST" });
      const payload = await response.json().catch(() => null);
      if (!response.ok) {
        return NextResponse.json({ error: "ChatGPT connection could not be updated.", detail: payload }, { status: 502, headers: privateHeaders });
      }
      const cleaned = cleanOauth(payload);
      return NextResponse.json({ oauth: cleaned }, { headers: privateHeaders });
    }

    if (["oauth_logout", "oauth_refresh"].includes(action)) {
      if (action === "oauth_logout") await authUpstream("/cancel", { method: "POST" }).catch(() => null);
      const path = action === "oauth_logout"
        ? "/api/v1/settings/providers/openai-codex/oauth/logout"
        : "/api/v1/settings/providers/openai-codex/models/refresh";
      const response = await upstream(path, { method: "POST" });
      if (!response.ok) return NextResponse.json({ error: "ChatGPT connection could not be updated." }, { status: 502, headers: privateHeaders });
      return NextResponse.json(await modelPayload(), { headers: privateHeaders });
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

    if (action === "configure_opencode") {
      const apiKey = typeof body?.apiKey === "string" ? body.apiKey.trim() : "";
      const plan = body?.plan === "go" || body?.plan === "zen" ? body.plan : null;
      if (!plan || !apiKey || apiKey.length > 512) {
        return NextResponse.json({ error: "Enter a valid OpenCode Go or Zen API key." }, { status: 400, headers: privateHeaders });
      }
      const catalogResponse = await upstream("/api/v1/settings/catalog");
      if (!catalogResponse.ok) throw new Error("Catalog unavailable");
      const wrapper = await catalogResponse.json() as { catalog?: Catalog };
      const catalog = wrapper.catalog || {};
      const services = catalog.services ||= {};
      const llm = services.llm ||= { active_profile_id: null, active_model_id: null, profiles: [] };
      const profiles = Array.isArray(llm.profiles) ? llm.profiles : [];
      const prefix = `miteee-opencode-${plan}-`;
      const additions = await openCodeProfiles(plan, apiKey);
      llm.profiles = [...profiles.filter((item) => typeof item.id !== "string" || !item.id.startsWith(prefix)), ...additions];
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
