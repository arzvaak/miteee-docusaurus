import assert from "node:assert/strict";
import test from "node:test";
import { POST } from "../app/api/study-coach/route";
import { buildMistralStudyCoachPayload, parseStudyCoachModelResponse } from "../lib/study-coach";

const diagnosisRequest = {
  requestType: "diagnose",
  prompt: "What must happen to percent slip before torque substitution?",
  userAnswer: "I directly substituted 5 percent as the slip value.",
  sourceContext: "Convert percent slip to per-unit slip before substituting into the torque expression.",
  noteLabel: "PYQ Answer Bank",
  courseName: "Electrical Machines II"
} as const;

function jsonRequest(body: unknown) {
  return new Request("http://localhost/api/study-coach", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
}

function withEnv<T>(env: Record<string, string | undefined>, run: () => Promise<T> | T): Promise<T> | T {
  const previous = {
    MISTRAL_API_KEY: process.env.MISTRAL_API_KEY,
    MISTRAK_API_KEY: process.env.MISTRAK_API_KEY,
    MISTRAL_MODEL: process.env.MISTRAL_MODEL
  };

  for (const [key, value] of Object.entries(env)) {
    if (value === undefined) {
      delete process.env[key];
    } else {
      process.env[key] = value;
    }
  }

  const restore = () => {
    for (const [key, value] of Object.entries(previous)) {
      if (value === undefined) {
        delete process.env[key];
      } else {
        process.env[key] = value;
      }
    }
  };

  try {
    const result = run();
    if (result && typeof (result as Promise<T>).then === "function") {
      return (result as Promise<T>).finally(restore);
    }
    restore();
    return result;
  } catch (error) {
    restore();
    throw error;
  }
}

test("study coach route diagnoses locally with no Mistral key and does not call fetch", async () => {
  await withEnv({ MISTRAL_API_KEY: undefined, MISTRAK_API_KEY: undefined, MISTRAL_MODEL: undefined }, async () => {
    const originalFetch = globalThis.fetch;
    let fetchCalls = 0;
    globalThis.fetch = (() => {
      fetchCalls += 1;
      throw new Error("fetch should not be called without a Mistral key");
    }) as typeof fetch;

    try {
      const response = await POST(jsonRequest(diagnosisRequest));
      const body = await response.json();

      assert.equal(fetchCalls, 0);
      assert.equal(body.responseType, "diagnosis");
      assert.equal(body.aiAvailable, false);
      assert.equal(body.provider, "local");
      assert.match(body.diagnosis.weaknesses.join(" "), /per-unit/);
    } finally {
      globalThis.fetch = originalFetch;
    }
  });
});

test("study coach route accepts diagnosis requestType alias for client compatibility", async () => {
  await withEnv({ MISTRAL_API_KEY: undefined, MISTRAK_API_KEY: undefined, MISTRAL_MODEL: undefined }, async () => {
    const response = await POST(jsonRequest({ ...diagnosisRequest, requestType: "diagnosis" }));
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.equal(body.responseType, "diagnosis");
    assert.equal(body.provider, "local");
  });
});

test("study coach route sends grounded diagnosis payload to Mistral when a key is configured", async () => {
  await withEnv({ MISTRAL_API_KEY: "test-key", MISTRAK_API_KEY: undefined, MISTRAL_MODEL: "mistral-test-model" }, async () => {
    const originalFetch = globalThis.fetch;
    const calls: Array<{ url: string; init: RequestInit }> = [];
    globalThis.fetch = (async (url, init) => {
      calls.push({ url: String(url), init: init ?? {} });
      return new Response(JSON.stringify({
        choices: [
          {
            message: {
              content: JSON.stringify({
                diagnosis: {
                  message: "Your answer names percent slip but misses the per-unit conversion.",
                  strengths: ["You identified percent slip as the quantity in the question."],
                  weaknesses: ["You directly substituted percent slip instead of converting percent slip to per-unit slip."],
                  nextDrill: "Answer again: what must happen to percent slip before torque substitution?"
                }
              })
            }
          }
        ]
      }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    }) as typeof fetch;

    try {
      const response = await POST(jsonRequest(diagnosisRequest));
      const body = await response.json();

      assert.equal(calls.length, 1);
      assert.equal(calls[0]?.url, "https://api.mistral.ai/v1/chat/completions");
      assert.equal((calls[0]?.init.headers as Record<string, string>).Authorization, "Bearer test-key");

      const payload = JSON.parse(String(calls[0]?.init.body));
      assert.equal(payload.model, "mistral-test-model");
      assert.deepEqual(payload.response_format, { type: "json_object" });
      assert.match(payload.messages[0].content, /Answer-diagnosis case:/);
      assert.match(payload.messages[0].content, /Convert percent slip to per-unit slip/);

      assert.equal(body.aiAvailable, true);
      assert.equal(body.provider, "mistral");
      assert.equal(body.model, "mistral-test-model");
      assert.equal(body.responseType, "diagnosis");
      assert.match(body.diagnosis.weaknesses[0], /per-unit slip/);
    } finally {
      globalThis.fetch = originalFetch;
    }
  });
});

test("study coach parses nested Mistral diagnosis JSON responses", () => {
  const parsed = parseStudyCoachModelResponse(JSON.stringify({
    diagnosis: {
      message: "Your answer names percent slip but misses the per-unit conversion.",
      strengths: ["You identified percent slip as the relevant quantity."],
      weaknesses: ["You directly substituted percent slip instead of converting it to per-unit slip."],
      nextDrill: "Answer again: what must happen to percent slip before torque substitution?"
    }
  }), "mistral-small-latest", diagnosisRequest);

  assert.equal(parsed.accepted, true);
  assert.equal(parsed.response.aiAvailable, true);
  assert.equal(parsed.response.provider, "mistral");
  assert.equal(parsed.response.responseType, "diagnosis");
});

test("study coach diagnosis prompt tells Mistral to stay inside supplied context", () => {
  const payload = buildMistralStudyCoachPayload("mistral-small-latest", {
    requestType: "diagnose",
    prompt: "State the role of feedback control.",
    userAnswer: "It checks results after work is complete."
  });

  assert.match(payload.messages[0]?.content ?? "", /No source context supplied/);
  assert.match(payload.messages[0]?.content ?? "", /say that the source context is missing/i);
});
