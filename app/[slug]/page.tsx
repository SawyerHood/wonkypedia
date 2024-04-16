import Article from "./article";
import { uriToTitle } from "@/shared/articleUtils";
import { getDb } from "@/db/client";
import { articles } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

// or Dynamic metadata
export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const title = uriToTitle(params.slug);
  return {
    title: title,
  };
}

const loadArticle = async (title: string) => {
  const db = getDb();
  const article = await db
    .select()
    .from(articles)
    .where(eq(articles.title, title))
    .execute();
  return article;
};

export default async function Page({ params }: { params: { slug: string } }) {
  const title = uriToTitle(params.slug);
  const article = await loadArticle(title);

  return <Article title={title} article={article?.[0] ?? null} />;
}
