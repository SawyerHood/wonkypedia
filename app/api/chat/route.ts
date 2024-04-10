import { supabaseServiceClient } from "@/db/service";
import {
  collectAllLinksFromMarkdown,
  createMarkdown,
  removeArticleTag,
} from "@/shared/articleUtils";
import Anthropic from "@anthropic-ai/sdk";
import { QueryData } from "@supabase/supabase-js";
import { AnthropicStream, StreamingTextResponse, OpenAIStream } from "ai";
import OpenAI from "openai";

// Create an Anthropic API client (that's edge friendly)
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || "",
});

const HAIKU_MODEL = "claude-3-haiku-20240307";
const SONNET_MODEL = "claude-3-sonnet-20240229";

export async function POST(req: Request) {
  // Extract the `prompt` from the body of the request
  const { messages } = await req.json();

  const result = supabaseServiceClient
    .from("links")
    .select("to, from (title, content)")
    .limit(10)
    .eq("to", messages[0].content);

  const { data: context, error } = await result;

  if (error) {
    throw error;
  }

  const contextArticles = context
    .filter((link) => link.from)
    .map((link) => createMarkdown(link.from as any));

  const systemPrompt = buildSystemPrompt(contextArticles);

  console.log(systemPrompt);

  const title = messages[0].content;

  // Ask Claude for a streaming chat completion given the prompt
  const response = await anthropic.messages.stream({
    messages: [
      ...messages,
      {
        role: "assistant",
        content: `# ${title}
<article>`,
      },
    ],
    system: systemPrompt,
    model: SONNET_MODEL,
    temperature: 1,
    max_tokens: 4000,
  });

  // Convert the response into a friendly text-stream
  const stream = AnthropicStream(response, {
    onCompletion: async (completion) => {
      await saveToDatabase(title, completion);
    },
  });

  // Respond with the stream
  return new StreamingTextResponse(stream);
}

const baseSystemPrompt = `You are a web server that generates wikipedia articles for an alternative universe. Note that this is a different dimension than our own so feel free to alter events so they are different than the reality as we know it. Note that you should write the article from the perspective of someone from that dimension and they have non knowledge of any reality other than their own. 

- The user will give you a title and then you need to return a markdown document for the article. Return only the markdown. 
- You are free to use any formatting that markdown allows like bold, italics, headers, lists, etc.
- If you would like to link to another article wrap the article name in [[ ]]. Link liberally for any proper nouns, places, or nouns. Example: [[Earth]]
- Return a lengthy detailed article given the topic. 
- Add multiple headers if appropriate. 
- The title of the article is already inserted.`;

function buildSystemPrompt(contextArticles: string[]) {
  if (contextArticles.length === 0) {
    return baseSystemPrompt;
  }

  return `${baseSystemPrompt}

Here are some past articles in the universe that might be useful for context:

${contextArticles
  .map((article) => "<context>\n" + article + "\n</context>")
  .join("\n")}
  Remember the title has already been set so you don't need to write a new one. Add links with brackets liberally. Remember that this world is not like our own.`;
}

async function saveToDatabase(title: string, content: string) {
  const { error: articleError } = await supabaseServiceClient
    .from("articles")
    .insert([{ title, content: removeArticleTag(content) }]);

  if (articleError) throw articleError;

  const markdown = createMarkdown({ title, content });
  const links = collectAllLinksFromMarkdown(markdown);

  const { error: linkError } = await supabaseServiceClient
    .from("links")
    .insert(links.map((link) => ({ from: title, to: link })));

  if (linkError) {
    throw linkError;
  }
}

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY!,
// });

// export async function POST(req: Request) {
//   // Extract the `messages` from the body of the request
//   const { messages } = await req.json();

//   // Request the OpenAI API for the response based on the prompt
//   const response = await openai.chat.completions.create({
//     model: "gpt-3.5-turbo",
//     stream: true,
//     messages: [{ role: "system", content: system }, ...messages],
//   });

//   // Convert the response into a friendly text-stream
//   const stream = OpenAIStream(response);

//   // Respond with the stream
//   return new StreamingTextResponse(stream);
// }
