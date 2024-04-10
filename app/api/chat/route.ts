import { supabaseServiceClient } from "@/db/service";
import {
  afterArticleTag,
  collectAllLinksFromMarkdown,
  createMarkdown,
  removeArticleTag,
  removeThoughtsTag,
} from "@/shared/articleUtils";
import Anthropic from "@anthropic-ai/sdk";
import { QueryData } from "@supabase/supabase-js";
import { AnthropicStream, StreamingTextResponse, OpenAIStream } from "ai";
import { revalidatePath } from "next/cache";
import OpenAI from "openai";

// Create an Anthropic API client (that's edge friendly)
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || "",
});

const HAIKU_MODEL = "claude-3-haiku-20240307";
const SONNET_MODEL = "claude-3-sonnet-20240229";

export const runtime = "edge";

export async function POST(req: Request) {
  // Extract the `prompt` from the body of the request
  const { messages } = await req.json();
  const title = messages[0].content;

  const existingArticleCheck = await supabaseServiceClient
    .from("articles")
    .select("title, content")
    .eq("title", title)
    .single();

  if (existingArticleCheck.data) {
    return new Response(existingArticleCheck.data.content);
  }

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

  // Ask Claude for a streaming chat completion given the prompt
  const response = await anthropic.messages.stream({
    messages: [
      ...messages,
      {
        role: "assistant",
        content: `<thoughts>`,
      },
    ],
    system: systemPrompt,
    model: HAIKU_MODEL,
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

const baseSystemPrompt = `Here are your instructions:

You are a wikipedia author that writes encyclopedia entries in an alternate timeline of the universe.

- The user will give you a title and then you need to return a markdown document for the article. Return only the markdown. 
- You are free to use any formatting that markdown allows like bold, italics, headers, lists, etc.
- If you would like to link to another encyclopedia entry wrap the entry name in [[ ]]. Link liberally for anything that should be an encyclopedia entry. Example: [[Earth]]
- A topic qualifies for an encyclopedia entry if it has lasting informational significance, appeals broadly, and is supported by factual, credible sources. Suitable subjects include key historical events, notable individuals, fundamental scientific principles, and major cultural practices. Entries should educate, inform, and maintain relevance over time, avoiding promotion or temporary trends.
- Do not put any additional formatting inside of links.
- Return a detailed article given the topic. 
- Add multiple headers if appropriates. 
- The title of the article is already inserted.
- Write in an encyclopedic and dry style. Like a wikipedia article.
- Remember that this is a different timeline than our own so feel free to alter events so they are different than the reality as we know it.
- Note that you should write the article from the perspective of someone from that timeline and they have non knowledge of any reality other than their own.
- Make it subtly different than our reality, but not over the top.
- Put your thoughts inside of <thoughts> tags. Inside your thoughts include how this topic is different in this timeline as well as an outline for the article.
- Inside of thoughts also include a list of entries that should be linked to from this entry. Make sure to link them in the actual article.
- When you are ready put the article inside of <article> tags.`;

function buildSystemPrompt(contextArticles: string[]) {
  if (contextArticles.length === 0) {
    return baseSystemPrompt;
  }

  return `Here are some past documents in the universe that might be useful for performing your task:
${contextArticles
  .map((article) => "<context>\n" + article + "\n</context>")
  .join("\n")}

${baseSystemPrompt}`;
}

async function saveToDatabase(title: string, content: string) {
  const { error: articleError } = await supabaseServiceClient
    .from("articles")
    .insert([{ title, content: removeThoughtsTag(content) }]);

  if (articleError) throw articleError;

  const markdown = createMarkdown({ title, content });
  const links = collectAllLinksFromMarkdown(markdown);

  const { error: linkError } = await supabaseServiceClient
    .from("links")
    .insert(links.map((link) => ({ from: title, to: link })));

  if (linkError) {
    throw linkError;
  }

  revalidatePath("/" + encodeURIComponent(title));
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
