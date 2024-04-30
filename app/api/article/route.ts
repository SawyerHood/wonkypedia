import { getDb } from "@/db/client";
import { articles } from "@/drizzle/schema";
import { uriToTitle } from "@/shared/articleUtils";
import { eq } from "drizzle-orm";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const title = req.nextUrl.searchParams.get("title");
  if (!title) {
    return new Response("No title provided", { status: 400 });
  }
  const article = await loadArticle(uriToTitle(title));
  return new Response(JSON.stringify(article ?? null), {
    headers: {
      "Content-Type": "application/json",
    },
    status: 200,
  });
}

const loadArticle = async (title: string) => {
  const db = getDb();
  const [article] = await db
    .select()
    .from(articles)
    .where(eq(articles.title, title))
    .execute();
  return article;
};
