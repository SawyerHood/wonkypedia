import { openai } from "@/generation/client";
import {
  collectAllLinksFromString,
  createMarkdown,
  extractArticle,
} from "@/shared/articleUtils";
import { revalidateTag } from "next/cache";
import { generateInfobox } from "@/generation/infobox";
import { encodeMessage } from "@/shared/encoding";
import { getMessageCreateParams } from "@/generation/articlePrompt";
import { ChatCompletionCreateParamsStreaming } from "openai/resources/index.mjs";
import { IS_LOCAL, WRITE_TO_DB } from "@/shared/config";
import { getDb } from "@/db/client";
import { articles, links } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/auth";
import { genAndUploadImage } from "@/generation/image";

export const runtime =
  process.env.NEXT_PUBLIC_LOCAL_MODE === "true" ? "nodejs" : "edge";

export async function POST(req: Request) {
  // Extract the `prompt` from the body of the request
  const { title } = await req.json();

  if (!IS_LOCAL) {
    const session = await auth();

    if (!session) {
      return new Response("Please login to generate an article", {
        status: 401,
      });
    }
  }

  const articleStream = await createArticleStream(title);

  if (!articleStream) {
    return new Response("No article stream found", { status: 500 });
  }

  return new Response(
    new ReadableStream({
      async start(controller) {
        let articleResult = "";
        let infoBoxPromise: Promise<void> | null = null;

        async function startInfoBox(summary: string) {
          const infoBox = await generateInfobox(summary);
          if (!infoBox) {
            return;
          }

          await saveInfoboxToDatabase(title, infoBox);

          controller.enqueue(
            encodeMessage({
              type: "info-box",
              value: JSON.stringify(infoBox),
            })
          );

          if (infoBox.imageDescription) {
            const image = await genAndUploadImage(infoBox.imageDescription);

            if (image) {
              await saveImageToDatabase(title, image);
              controller.enqueue(
                encodeMessage({
                  type: "image",
                  value: image,
                })
              );
            }
          }
        }

        for await (const chunk of articleStream) {
          const value = chunk.choices[0]?.delta?.content || "";

          articleResult += value;

          if (!infoBoxPromise) {
            const summaryContentMatch = articleResult.match(
              /<summary>(.*?)<\/summary>/s
            );
            if (summaryContentMatch && summaryContentMatch[1]) {
              infoBoxPromise = startInfoBox(summaryContentMatch[1]);
            }
          }

          controller.enqueue(encodeMessage({ type: "article-chunk", value }));
        }
        const article = extractArticle(articleResult ?? "");
        await saveToDatabase(title, article ?? "");
        await infoBoxPromise;
        await new Promise((resolve) => setTimeout(resolve, 50));
        controller.close();
      },
    }).pipeThrough(new TextEncoderStream()),
    { status: 200 }
  );
}

async function saveToDatabase(title: string, content: string) {
  if (!WRITE_TO_DB) {
    return;
  }
  const db = getDb();
  await db.insert(articles).values({ title, content }).onConflictDoUpdate({
    target: articles.title,
    set: {
      content,
    },
  });

  const markdown = createMarkdown({ title, content });
  const links = collectAllLinksFromString(markdown);

  await saveLinksToDatabase(title, links);
  revalidateTag(title);
}

function getAllLinksFromInfobox(infobox: Object, links: string[] = []) {
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

async function saveInfoboxToDatabase(title: string, infoBox: Object) {
  if (!WRITE_TO_DB) {
    return;
  }
  const db = getDb();
  await db
    .insert(articles)
    .values({ title, infobox: infoBox })
    .onConflictDoUpdate({
      target: articles.title,
      set: {
        infobox: infoBox,
      },
    });

  const links = getAllLinksFromInfobox(infoBox);
  await saveLinksToDatabase(title, links);
}

async function saveImageToDatabase(title: string, image: string) {
  if (!WRITE_TO_DB) {
    return;
  }
  const db = getDb();
  await db
    .insert(articles)
    .values({ title, imageUrl: image })
    .onConflictDoUpdate({
      target: articles.title,
      set: {
        imageUrl: image,
      },
    });

  revalidateTag(title);
}

async function saveLinksToDatabase(title: string, newLinks: string[]) {
  if (!WRITE_TO_DB) {
    return;
  }

  newLinks = Array.from(new Set(newLinks));
  if (!newLinks.length) {
    return;
  }
  const db = getDb();
  await db
    .insert(links)
    .values(newLinks.map((link) => ({ from: title, to: link })))
    .onConflictDoNothing({
      target: [links.from, links.to],
    });
}

async function createArticleStream(title: string) {
  const db = getDb();
  const existingArticleCheck = await db
    .select({ title: articles.title })
    .from(articles)
    .where(eq(articles.title, title));

  if (existingArticleCheck.length) {
    return null;
  }

  const result = await db.query.links.findMany({
    with: {
      from: true,
    },
    where: (links, { eq }) => eq(links.to, title),
  });

  const context = await result;

  const contextArticles = context
    .filter((link) => link.from)
    .map((link) => createMarkdown(link.from));

  console.log("Context:");
  console.log(contextArticles);

  const params = getMessageCreateParams(title, contextArticles);
  console.log(params);

  console.log("Before stream");
  // Ask Claude for a streaming chat completion given the prompt
  const stream = await openai.chat.completions.create(
    params as ChatCompletionCreateParamsStreaming
  );

  console.log("After stream");

  return stream;
}
