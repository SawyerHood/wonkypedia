import { db, schema } from "@/db";
import { asc, desc } from "drizzle-orm";

export default async function Home() {
  const articles = await db
    .select()
    .from(schema.articles)
    .orderBy(desc(schema.articles.createdAt));

  return (
    <div className="max-w-screen-md mx-auto p-5">
      <h1>Wonkypedia</h1>
      {articles.map((article) => (
        <div key={article.title}>
          <h2>{article.title}</h2>
        </div>
      ))}
    </div>
  );
}
