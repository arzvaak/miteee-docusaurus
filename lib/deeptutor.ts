export const deepTutorOwnerEmail = "arzvak@gmail.com";
export const deepTutorKnowledgeBase = process.env.DEEPTUTOR_KB_NAME?.trim() || "miteee-notes";

export const deepTutorCapabilities = ["chat", "deep_solve", "deep_question"] as const;
export type DeepTutorCapability = (typeof deepTutorCapabilities)[number];

export type DeepTutorNoteContext = {
  slug: string;
  title: string;
  courseCode: string | null;
  courseName: string | null;
  pathname: string;
};

export type DeepTutorModelSelection = {
  profileId: string;
  modelId: string;
};

export type DeepTutorModelOption = DeepTutorModelSelection & {
  label: string;
  provider: string;
  isDefault: boolean;
};

export type DeepTutorTurnRequest = {
  message: string;
  sessionId: string | null;
  capability: DeepTutorCapability;
  note: DeepTutorNoteContext | null;
  model: DeepTutorModelSelection | null;
};

const maximumMessageLength = 8_000;
const maximumContextLength = 240;
const sessionIdPattern = /^[a-zA-Z0-9_-]{1,160}$/;
const modelIdPattern = /^[a-zA-Z0-9_.:/-]{1,240}$/;

function cleanText(value: unknown, maximumLength: number) {
  if (typeof value !== "string") return "";
  return value.replace(/\u0000/g, "").trim().slice(0, maximumLength);
}

function parseNoteContext(value: unknown): DeepTutorNoteContext | null {
  if (!value || typeof value !== "object") return null;
  const input = value as Partial<DeepTutorNoteContext>;
  const slug = cleanText(input.slug, maximumContextLength);
  const title = cleanText(input.title, maximumContextLength);
  const pathname = cleanText(input.pathname, maximumContextLength);
  if (!slug || !title || !pathname.startsWith("/notes/")) return null;

  return {
    slug,
    title,
    pathname,
    courseCode: cleanText(input.courseCode, maximumContextLength) || null,
    courseName: cleanText(input.courseName, maximumContextLength) || null
  };
}

function parseModelSelection(value: unknown): DeepTutorModelSelection | null {
  if (!value || typeof value !== "object") return null;
  const input = value as Partial<DeepTutorModelSelection>;
  const profileId = cleanText(input.profileId, 240);
  const modelId = cleanText(input.modelId, 240);
  if (!modelIdPattern.test(profileId) || !modelIdPattern.test(modelId)) return null;
  return { profileId, modelId };
}

function configuredDeepTutorEmails() {
  return (process.env.DEEPTUTOR_ALLOWED_EMAILS || "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

export function hasDeepTutorAccess(email: string | null | undefined) {
  const normalizedEmail = email?.trim().toLowerCase();
  if (!normalizedEmail) return false;
  return normalizedEmail === deepTutorOwnerEmail || configuredDeepTutorEmails().includes(normalizedEmail);
}

export function parseDeepTutorTurnRequest(value: unknown): DeepTutorTurnRequest | null {
  if (!value || typeof value !== "object") return null;
  const input = value as Partial<DeepTutorTurnRequest>;
  const message = cleanText(input.message, maximumMessageLength);
  const sessionId = input.sessionId == null ? null : cleanText(input.sessionId, 160);
  const capability = deepTutorCapabilities.includes(input.capability as DeepTutorCapability)
    ? input.capability as DeepTutorCapability
    : "chat";

  if (!message || (sessionId !== null && !sessionIdPattern.test(sessionId))) return null;
  return {
    message,
    sessionId,
    capability,
    note: parseNoteContext(input.note),
    model: parseModelSelection(input.model)
  };
}

export function buildDeepTutorMessage(request: DeepTutorTurnRequest) {
  if (!request.note) return request.message;
  const course = [request.note.courseCode, request.note.courseName].filter(Boolean).join(" - ") || "MITEEE";
  return [
    "Use the attached MITEEE notes knowledge base as the primary source. Be a rigorous personal tutor: explain the method, preserve mathematical notation, and say clearly when the notes do not support a claim.",
    "",
    "Current study context:",
    `- Course: ${course}`,
    `- Note: ${request.note.title}`,
    `- Note slug: ${request.note.slug}`,
    `- Public path: ${request.note.pathname}`,
    "",
    `My question: ${request.message}`
  ].join("\n");
}

export function deepTutorApiBaseUrl() {
  return (process.env.DEEPTUTOR_API_BASE_URL?.trim() || "http://deeptutor:8001").replace(/\/$/, "");
}

export function deepTutorWebSocketUrl() {
  const configured = process.env.DEEPTUTOR_WS_URL?.trim();
  if (configured) return configured;
  return `${deepTutorApiBaseUrl().replace(/^http:/, "ws:").replace(/^https:/, "wss:")}/api/v1/ws`;
}
