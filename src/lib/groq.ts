// Shared Groq client. Tries the configured model first, then falls back automatically
// if a model is rate-limited (free plan: per-model tokens/minute) or retired by Groq.

const GROQ_URL = process.env.GROQ_API_URL || "https://api.groq.com/openai/v1/chat/completions";
const FALLBACK_MODELS = ["openai/gpt-oss-120b", "qwen/qwen3.8-27b", "openai/gpt-oss-20b", "llama-3.3-70b-versatile"];

export type GroqMessage = {
  role: string;
  content: string | null;
  tool_calls?: { id: string; type?: string; function: { name: string; arguments: string } }[];
  tool_call_id?: string;
};

let workingModel: string | null = null; // remembered after the first success

export async function groqChat(body: Record<string, unknown>, preferred?: string): Promise<GroqMessage> {
  const key = process.env.GROQ_API_KEY;
  if (!key) throw new Error("GROQ_API_KEY is not set in .env");

  const models = [...new Set([workingModel, preferred, process.env.GROQ_MODEL, ...FALLBACK_MODELS].filter(Boolean) as string[])];
  let lastError = "";
  for (const model of models) {
    const res = await fetch(GROQ_URL, {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model,
        ...(model.startsWith("openai/gpt-oss") ? { reasoning_effort: "low" } : {}),
        ...body,
      }),
    });
    if (res.ok) {
      workingModel = model;
      const data = await res.json();
      const msg = data.choices?.[0]?.message as GroqMessage;
      if (msg?.content) msg.content = msg.content.replace(/<think>[\s\S]*?<\/think>/g, "").trim();
      return msg;
    }
    lastError = `Groq API error ${res.status}: ${(await res.text()).slice(0, 300)}`;
    // Try the next model when this one is rate-limited (each model has its own free quota) or retired
    if (!(res.status === 429 || res.status === 404 || res.status >= 500 || (res.status === 400 && /model/i.test(lastError)))) break;
    if (workingModel === model) workingModel = null;
  }
  throw new Error(lastError);
}
