import Anthropic from "@anthropic-ai/sdk";

export const HAIKU_MODEL = "claude-3-haiku-20240307";
export const SONNET_MODEL = "claude-3-sonnet-20240229";
// Create an Anthropic API client (that's edge friendly)
export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || "",
});
