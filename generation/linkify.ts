import { CHEAP_MODEL, openai } from "./client";

const prompt = `You will be given a markdown article for a wikipedia entry. Edit this to link to other articles by wrapping them in [[links]]. Use double square brackets to link. Skip the preamble and return only the article.

<example-input>
  - Iceland is a country in Europe
  - Fleetwood Mac is an American rock band
  - The Eiffel Tower is the most famous building in the world
  - World War II was a war that took place in 1939
</example-input>

<example-output>
  - [[Iceland]] is a country in [[Europe]]
  - [[Fleetwood Mac]] is an American [[rock band]]
  - The [[Eiffel Tower]] is the most famous building in the world
  - [[World War II]] was a war that took place in 1939
</example-output>
`;

export async function linkify(article: string): Promise<string> {
  const response = await openai.chat.completions.create({
    model: CHEAP_MODEL,
    max_tokens: 4000,
    messages: [
      {
        role: "system",
        content: prompt,
      },
      {
        role: "user",
        content: article,
      },
      {
        role: "assistant",
        content: "<output>",
      },
    ],
  });

  return (response.choices[0].message.content || "").replace("</output>", "");
}
