import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";
import { GoogleGenAI } from "@google/genai";
import pLimit from "p-limit";
import pRetry from "p-retry";

export type AIModel = 
  | "gpt-5" 
  | "gpt-4o" 
  | "gemini-2.5-pro" 
  | "gemini-2.5-flash"
  | "claude-sonnet-4-5" 
  | "claude-opus-4-1";

export type AIProvider = "openai" | "gemini" | "anthropic";

export interface AIMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface AIResponse {
  content: string;
  model: AIModel;
  provider: AIProvider;
}

const openai = new OpenAI({
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
});

const anthropic = new Anthropic({
  apiKey: process.env.AI_INTEGRATIONS_ANTHROPIC_API_KEY || "dummy",
  baseURL: process.env.AI_INTEGRATIONS_ANTHROPIC_BASE_URL,
});

const gemini = new GoogleGenAI({
  apiKey: process.env.AI_INTEGRATIONS_GEMINI_API_KEY || "dummy",
  httpOptions: {
    apiVersion: "",
    baseUrl: process.env.AI_INTEGRATIONS_GEMINI_BASE_URL,
  },
});

function getProvider(model: AIModel): AIProvider {
  if (model.startsWith("gpt") || model.startsWith("o3") || model.startsWith("o4")) {
    return "openai";
  } else if (model.startsWith("gemini")) {
    return "gemini";
  } else if (model.startsWith("claude")) {
    return "anthropic";
  }
  return "openai";
}

function isRateLimitError(error: any): boolean {
  const errorMsg = error?.message || String(error);
  return (
    errorMsg.includes("429") ||
    errorMsg.includes("RATELIMIT_EXCEEDED") ||
    errorMsg.toLowerCase().includes("quota") ||
    errorMsg.toLowerCase().includes("rate limit")
  );
}

export async function generateWithOpenAI(
  messages: AIMessage[],
  model: string = "gpt-5",
  systemPrompt?: string
): Promise<string> {
  const openaiMessages: any[] = [];
  
  if (systemPrompt) {
    openaiMessages.push({ role: "system", content: systemPrompt });
  }
  
  messages.forEach(msg => {
    openaiMessages.push({ role: msg.role, content: msg.content });
  });

  const isGpt5 = model.startsWith("gpt-5") || model.startsWith("o3") || model.startsWith("o4");
  
  const response = await openai.chat.completions.create({
    model,
    messages: openaiMessages,
    ...(isGpt5 ? { max_completion_tokens: 4096 } : { max_tokens: 4096 }),
  });

  return response.choices[0]?.message?.content || "";
}

export async function generateWithGemini(
  messages: AIMessage[],
  model: string = "gemini-2.5-flash",
  systemPrompt?: string
): Promise<string> {
  let prompt = "";
  
  if (systemPrompt) {
    prompt += `System Instructions: ${systemPrompt}\n\n`;
  }
  
  messages.forEach(msg => {
    if (msg.role === "user") {
      prompt += `User: ${msg.content}\n`;
    } else if (msg.role === "assistant") {
      prompt += `Assistant: ${msg.content}\n`;
    }
  });

  const response = await gemini.models.generateContent({
    model,
    contents: prompt,
  });

  return response.text || "";
}

export async function generateWithAnthropic(
  messages: AIMessage[],
  model: string = "claude-sonnet-4-5",
  systemPrompt?: string
): Promise<string> {
  const anthropicMessages = messages
    .filter(msg => msg.role !== "system")
    .map(msg => ({
      role: msg.role as "user" | "assistant",
      content: msg.content,
    }));

  const response = await anthropic.messages.create({
    model,
    max_tokens: 4096,
    ...(systemPrompt ? { system: systemPrompt } : {}),
    messages: anthropicMessages,
  });

  const content = response.content[0];
  if (content.type === "text") {
    return content.text;
  }
  return "";
}

export async function generateResponse(
  messages: AIMessage[],
  model: AIModel = "gpt-5",
  systemPrompt?: string
): Promise<AIResponse> {
  const provider = getProvider(model);

  const generate = async (): Promise<string> => {
    switch (provider) {
      case "openai":
        return generateWithOpenAI(messages, model, systemPrompt);
      case "gemini":
        return generateWithGemini(messages, model, systemPrompt);
      case "anthropic":
        return generateWithAnthropic(messages, model, systemPrompt);
      default:
        return generateWithOpenAI(messages, model, systemPrompt);
    }
  };

  const content = await pRetry(
    async () => {
      try {
        return await generate();
      } catch (error: any) {
        if (isRateLimitError(error)) {
          throw error;
        }
        throw error;
      }
    },
    {
      retries: 3,
      minTimeout: 1000,
      maxTimeout: 10000,
      factor: 2,
    }
  );

  return {
    content,
    model,
    provider,
  };
}

export async function generateWithFallback(
  messages: AIMessage[],
  preferredModel: AIModel = "claude-sonnet-4-5",
  systemPrompt?: string
): Promise<AIResponse> {
  const fallbackOrder: AIModel[] = ([
    preferredModel,
    "claude-sonnet-4-5",
    "gemini-2.5-pro",
    "gpt-5",
    "gemini-2.5-flash",
  ] as AIModel[]).filter((m, i, arr) => arr.indexOf(m) === i);

  let lastError: Error | null = null;

  for (const model of fallbackOrder) {
    try {
      console.log(`[AI] Trying model: ${model}`);
      const response = await generateResponse(messages, model, systemPrompt);
      console.log(`[AI] Success with model: ${model}`);
      return response;
    } catch (error: any) {
      console.log(`[AI] Failed with model ${model}:`, error.message);
      lastError = error;
      continue;
    }
  }

  throw lastError || new Error("All AI models failed");
}

export const AVAILABLE_MODELS: { id: AIModel; name: string; provider: AIProvider; description: string; isPrimary?: boolean }[] = [
  { id: "claude-sonnet-4-5", name: "Claude 4.5 Sonnet", provider: "anthropic", description: "Primary AI - Best for nuanced advice", isPrimary: true },
  { id: "gemini-2.5-pro", name: "Gemini 3 Pro", provider: "gemini", description: "Advanced reasoning & Perth market insights" },
  { id: "gpt-5", name: "GPT-5.1", provider: "openai", description: "OpenAI flagship - Comprehensive analysis" },
  { id: "gemini-2.5-flash", name: "Gemini 3 Flash", provider: "gemini", description: "Fast responses for quick questions" },
  { id: "gpt-4o", name: "GPT-4o Ultra", provider: "openai", description: "Multimodal capabilities" },
  { id: "claude-opus-4-1", name: "Claude Opus 4.1", provider: "anthropic", description: "Most powerful Claude model" },
];

export function getModelInfo(model: AIModel) {
  return AVAILABLE_MODELS.find(m => m.id === model);
}
