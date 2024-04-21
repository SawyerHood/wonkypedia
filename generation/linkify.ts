import { CHEAP_MODEL, openai } from "./client";

export async function linkify(article: string): Promise<string> {
  const response = await openai.chat.completions.create({
    model: CHEAP_MODEL,
    max_tokens: 4000,
    messages: [
      {
        role: "system",
        content:
          "You will be given a markdown article for a wikipedia entry. Edit this to link to other articles by wrapping them in [[links]]. Use double square brackets to link. Skip the preamble and return only the article. Skip the preamble. Return only the article",
      },
      {
        role: "user",
        content: article,
      },
    ],
  });

  return response.choices[0].message.content || "";
}
