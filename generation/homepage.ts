import { getDb } from "@/db/client";
import { CHEAP_MODEL, openai } from "./client";
import { desc, eq, isNotNull, sql } from "drizzle-orm";
import { articles } from "@/drizzle/schema";
import { linkify } from "./linkify";

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

const didYouKnowPrompt = `You are a master wikipedia contributor in another dimension that is different than our own. You will be given 10 articles from the other dimension. Create a list of 5 did you know facts using only information from the articles. 

<format>
Write a bulleted list of 5 "did you know" facts about the articles. Return only the facts as a markdown bulleted list. Return only the list.
</format>
<example-output>
- Did you know that honey never spoils? Archaeologists have found pots of honey in ancient Egyptian tombs that are over 3,000 years old and still edible.
- Did you know that octopuses have three hearts? Two pump blood to the gills, while the third pumps it to the rest of the body.
- Did you know that the shortest war in history was between Britain and Zanzibar on August 27, 1896? Zanzibar surrendered after 38 minutes.
- Did you know that the Eiffel Tower can be 15 cm taller during the summer? When the temperature increases, the metal expands, which increases the height of the tower.
- Did you know that the total weight of ants on earth once equaled the total weight of people? Scientists estimate that for every person on Earth, there are about 1.6 million ants.
</example-output>
`;

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
