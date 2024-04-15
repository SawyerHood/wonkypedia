import OpenAI from "openai";

const USE_BRAINTRUST = true;

// Braintrust
export const CHEAP_MODEL = USE_BRAINTRUST
  ? "claude-3-haiku-20240307"
  : // Open Router
    "fireworks/mixtral-8x22b-instruct-preview";

export const SONNET_MODEL = "claude-3-sonnet-20240229";

// Braintrust
export const openai = USE_BRAINTRUST
  ? new OpenAI({
      baseURL: "https://braintrustproxy.com/v1",
      apiKey: process.env.ANTHROPIC_API_KEY,
    })
  : new OpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: process.env.OPEN_ROUTER_KEY,
    });
