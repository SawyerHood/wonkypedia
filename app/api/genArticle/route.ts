import { supabaseServiceClient } from "@/db/service";
import { HAIKU_MODEL, anthropic } from "@/generation/client";
import {
  collectAllLinksFromMarkdown,
  createMarkdown,
  extractArticle,
  slugify,
} from "@/shared/articleUtils";
import { AnthropicStream, StreamingTextResponse, OpenAIStream } from "ai";
import { revalidatePath } from "next/cache";
import { generateInfobox } from "@/generation/infobox";
import { genAndUploadImage } from "@/generation/image";
import { encodeMessage } from "@/shared/encoding";

export const runtime = "edge";

export async function POST(req: Request) {
  // Extract the `prompt` from the body of the request
  const { title } = await req.json();

  const articleStream = await createArticleStream(title);

  const articleReader = articleStream
    ?.pipeThrough(new TextDecoderStream())
    .getReader();

  if (!articleReader) {
    return new Response("No article stream found", { status: 404 });
  }

  return new Response(
    new ReadableStream({
      async start(controller) {
        let articleResult = "";
        let infoBoxPromise: Promise<void> | null = null;

        async function startInfoBox() {
          const [thoughts] = articleResult.split("</thoughts>");
          const infoBox = await generateInfobox(`Title: ${title}\n` + thoughts);
          controller.enqueue(
            encodeMessage({
              type: "info-box",
              value: JSON.stringify(infoBox),
            })
          );

          if (infoBox.imageDescription) {
            const image = await genAndUploadImage(
              infoBox.imageDescription,
              slugify(title)
            );
            controller.enqueue(
              encodeMessage({
                type: "image",
                value: image,
              })
            );
          }
        }

        while (true) {
          const { value, done } = await articleReader.read();
          if (done) {
            break;
          }

          articleResult += value;

          if (!infoBoxPromise && articleResult.includes("</thoughts>")) {
            infoBoxPromise = startInfoBox();
          }

          controller.enqueue(encodeMessage({ type: "article-chunk", value }));
        }
        await infoBoxPromise;
        await new Promise((resolve) => setTimeout(resolve, 50));
        controller.close();
      },
    }).pipeThrough(new TextEncoderStream())
  );

  // Respond with the stream
  //   return new StreamingTextResponse(stream);
}

const baseSystemPrompt = `Here are your instructions:

You are a wikipedia author that writes encyclopedia entries in an alternate timeline of the universe.

- The user will give you a title and then you need to return a markdown document for the article. Return only the markdown. 
- You are free to use any formatting that markdown allows like bold, italics, headers, lists, etc.
- If you would like to link to another encyclopedia entry wrap the entry name in [[ ]]. Link liberally for anything that should be an encyclopedia entry. Example: [[Earth]]
- A topic qualifies for an encyclopedia entry if it has lasting informational significance, appeals broadly, and is supported by factual, credible sources. Suitable subjects include key historical events, notable individuals, fundamental scientific principles, major cultural practices, movies, books, and video games. Entries should educate, inform, and maintain relevance over time, avoiding promotion or temporary trends.
- Do not put any additional formatting inside of links.
- Return a detailed article given the topic. 
- Add multiple headers if appropriates. 
- The title of the article is already inserted.
- Write in an encyclopedic and dry style. Like a wikipedia article.
- Remember that this is a different timeline than our own so feel free to alter events so they are different than the reality as we know it.
- Note that you should write the article from the perspective of someone from that timeline and they have non knowledge of any reality other than their own.
- Make it subtly different than our reality, but not over the top.
- Put your thoughts inside of <thoughts> tags. Inside your thoughts include how this topic is different in this timeline as well as an outline for the article. Don't change the subject of the article
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
    .insert([{ title, content: extractArticle(content) }]);

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

async function createArticleStream(title: string) {
  const existingArticleCheck = await supabaseServiceClient
    .from("articles")
    .select("title, content")
    .eq("title", title)
    .single();

  if (existingArticleCheck.data) {
    return null;
  }

  const result = supabaseServiceClient
    .from("links")
    .select("to, from (title, content)")
    .limit(10)
    .eq("to", title);

  const { data: context, error } = await result;

  if (error) {
    throw error;
  }

  const contextArticles = context
    .filter((link) => link.from)
    .map((link) => createMarkdown(link.from as any));

  const systemPrompt = buildSystemPrompt(contextArticles);

  // Ask Claude for a streaming chat completion given the prompt
  const response = anthropic.messages.stream({
    messages: [
      {
        role: "user",
        content: title,
      },
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

  return stream;
}
