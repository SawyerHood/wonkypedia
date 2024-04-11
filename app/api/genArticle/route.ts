import { supabaseServiceClient } from "@/db/service";
import { anthropic } from "@/generation/client";
import {
  collectAllLinksFromString,
  createMarkdown,
  extractArticle,
  slugify,
} from "@/shared/articleUtils";
import { AnthropicStream } from "ai";
import { revalidatePath } from "next/cache";
import { generateInfobox } from "@/generation/infobox";
import { genAndUploadImage } from "@/generation/image";
import { encodeMessage } from "@/shared/encoding";
import { getMessageCreateParams } from "@/generation/articlePrompt";
import { Json } from "@/db/schema";

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

        async function startInfoBox(summary: string) {
          const infoBox = await generateInfobox(summary);

          await saveInfoboxToDatabase(title, infoBox);

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
            await saveImageToDatabase(title, image);
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

          if (!infoBoxPromise) {
            const summaryContentMatch = articleResult.match(
              /<summary>(.*?)<\/summary>/s
            );
            if (summaryContentMatch && summaryContentMatch[1]) {
              const summaryContent = summaryContentMatch[1];
              infoBoxPromise = startInfoBox(summaryContentMatch[1]);
            }
          }

          controller.enqueue(encodeMessage({ type: "article-chunk", value }));
        }
        await infoBoxPromise;
        await new Promise((resolve) => setTimeout(resolve, 50));
        controller.close();
      },
    }).pipeThrough(new TextEncoderStream())
  );
}

async function saveToDatabase(title: string, content: string) {
  const { error: articleError } = await supabaseServiceClient
    .from("articles")
    .upsert([{ title, content: extractArticle(content) }], {
      onConflict: "title",
    });

  if (articleError) throw articleError;

  const markdown = createMarkdown({ title, content });
  const links = collectAllLinksFromString(markdown);

  await saveLinksToDatabase(title, links);

  revalidatePath("/" + encodeURIComponent(title));
}

function getAllLinksFromInfobox(infobox: Json, links: string[] = []) {
  if (typeof infobox === "string") {
    links.push(...collectAllLinksFromString(infobox));
  } else if (Array.isArray(infobox)) {
    infobox.forEach((link) => {
      getAllLinksFromInfobox(link, links);
    });
  } else if (infobox && typeof infobox === "object") {
    for (const val of Object.values(infobox)) {
      getAllLinksFromInfobox(val ?? null, links);
    }
  }
  return links;
}

async function saveInfoboxToDatabase(title: string, infoBox: Json) {
  const { error: infoBoxError } = await supabaseServiceClient
    .from("articles")
    .upsert([{ title, infobox: infoBox }], {
      onConflict: "title",
    });

  if (infoBoxError) throw infoBoxError;

  const links = getAllLinksFromInfobox(infoBox);
  await saveLinksToDatabase(title, links);
}

async function saveImageToDatabase(title: string, image: string) {
  const { error: imageError } = await supabaseServiceClient
    .from("articles")
    .upsert([{ title, image_url: image }], {
      onConflict: "title",
    });

  if (imageError) throw imageError;
}

async function saveLinksToDatabase(title: string, links: string[]) {
  const { error: linkError } = await supabaseServiceClient.from("links").upsert(
    links.map((link) => ({ from: title, to: link })),
    {
      onConflict: "from, to",
    }
  );

  if (linkError) throw linkError;
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

  const params = getMessageCreateParams(title, contextArticles);

  console.log(params);

  // Ask Claude for a streaming chat completion given the prompt
  const response = anthropic.messages.stream(params);

  // Convert the response into a friendly text-stream
  const stream = AnthropicStream(response, {
    onCompletion: async (completion) => {
      await saveToDatabase(title, completion);
    },
  });

  return stream;
}
