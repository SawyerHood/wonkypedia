import OpenAI from "openai";

// Braintrust
export const HAIKU_MODEL = "claude-3-haiku-20240307";

// Anthropic
// export const HAIKU_MODEL = "anthropic/claude-3-haiku";
export const SONNET_MODEL = "claude-3-sonnet-20240229";
// Create an Anthropic API client (that's edge friendly)
// export const anthropic = new Anthropic({
//   apiKey: process.env.ANTHROPIC_API_KEY || "",
// });

// Open Router
// export const openai = new OpenAI({
//   baseURL: "https://openrouter.ai/api/v1",
//   apiKey: process.env.OPEN_ROUTER_KEY,
// });

// Braintrust
export const openai = new OpenAI({
  baseURL: "https://braintrustproxy.com/v1",
  apiKey: process.env.ANTHROPIC_API_KEY,
});
