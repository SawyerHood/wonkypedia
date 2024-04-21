import { getDb } from "@/db/client";
import { CHEAP_MODEL, openai } from "./client";
import { desc, eq, isNotNull, sql } from "drizzle-orm";
import { articles } from "@/drizzle/schema";
import { fileURLToPath } from "url";
import { linkify } from "./linkify";
import { supabaseServiceClient } from "@/db/service";

const summaryPrompt = `You are a master wikipedia contributor. You will be given an article and write a small two paragraph summary of the article to put on the homepage. Return only the summary as markdown. Do not include a header`;

async function generateSummary(
  articleTitle: string
): Promise<{ text: string; image: string }> {
  const db = getDb();

  const [article] = await db
    .select({ content: articles.content, imageUrl: articles.imageUrl })
    .from(articles)
    .where(eq(articles.title, articleTitle));

  if (!article?.content) {
    throw new Error("Article not found");
  }

  const response = await openai.chat.completions.create({
    model: CHEAP_MODEL,
    messages: [
      { role: "system", content: summaryPrompt },
      { role: "user", content: article.content },
    ],
  });

  const text = await linkify(response.choices[0].message.content!);

  return {
    text,
    image: article.imageUrl!,
  };
}

const didYouKnowPrompt = `You are a master wikipedia contributor. You will be given 10 articles. Write a bulleted list of 5 "did you know" facts about the articles. Return only the facts as a markdown bulleted list. Return only the list.`;

async function generateDidYouKnow(): Promise<{ text: string; image: string }> {
  const db = getDb();

  const recentArticles = await db
    .select({
      title: articles.title,
      content: articles.content,
      imageUrl: articles.imageUrl,
    })
    .from(articles)
    .where(isNotNull(articles.content))
    .orderBy(desc(articles.createdAt))
    .limit(10);

  if (!recentArticles.length) {
    throw new Error("No recent articles found");
  }

  const response = await openai.chat.completions.create({
    model: CHEAP_MODEL,
    messages: [
      { role: "system", content: didYouKnowPrompt },
      {
        role: "user",
        content: recentArticles
          .map(
            (article) =>
              `<article>\n# ${article.title}\n${article.content}\n</article>`
          )
          .join("\n"),
      },
      {
        role: "assistant",
        content: "-",
      },
    ],
  });

  const rawText = "- " + response.choices[0].message.content!;
  const text = await linkify(rawText);

  return {
    text,
    image: recentArticles[0].imageUrl!,
  };
}

export async function generateHomepage(): Promise<{
  summary: string | null;
  summaryImage: string | null;
  didYouKnow: string | null;
  didYouKnowImage: string | null;
}> {
  const db = getDb();
  const [randomArticle] = await db
    .select({
      title: articles.title,
    })
    .from(articles)
    .where(isNotNull(articles.content))
    .orderBy(sql<number>`RANDOM()`)
    .limit(1);

  const [summary, didYouKnow] = await Promise.all([
    generateSummary(randomArticle.title),
    generateDidYouKnow(),
  ]);

  return {
    summary: summary.text,
    summaryImage: summary.image,
    didYouKnow: didYouKnow.text,
    didYouKnowImage: didYouKnow.image,
  };
}

async function uploadHomepage(homepage: {
  summary: string | null;
  summaryImage: string | null;
  didYouKnow: string | null;
  didYouKnowImage: string | null;
}) {
  const { data, error } = await supabaseServiceClient.storage
    .from("homepage")
    .update("homepage.json", JSON.stringify(homepage));

  if (error) {
    throw error;
  }

  return data;
}

export async function generateAndUploadHomepage() {
  const homepage = await generateHomepage();
  console.log(homepage);
  await uploadHomepage(homepage);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  generateAndUploadHomepage()
    .then((homepage) => {
      console.log(JSON.stringify(homepage, null, 2));
    })
    .catch((error) => {
      console.error("Error generating homepage:", error);
    })
    .finally(() => {
      process.exit(0);
    });
}
