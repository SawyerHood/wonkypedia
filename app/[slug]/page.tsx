import { db, schema } from "@/db";
import { eq } from "drizzle-orm";
import Article from "./article";

export default async function Page({ params }: { params: { slug: string } }) {
  const title = toTitleCase(decodeURI(params.slug));

  const article = await db
    .select()
    .from(schema.articles)
    .where(eq(schema.articles.title, title));

  return <Article title={title} article={article?.[0]?.content ?? null} />;
}

function toTitleCase(str: string) {
  return str.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase();
  });
}
