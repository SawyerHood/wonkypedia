import { getDb } from "@/db/client";
import { articles, users } from "@/drizzle/schema";
import { and, count, eq, gte, lte } from "drizzle-orm";

const db = getDb();

async function select() {
  const [pixar] = await db
    .select({ createdAt: articles.createdAt })
    .from(articles)
    .where(eq(articles.title, "Pixar"));
  const [dune] = await db
    .select({ createdAt: articles.createdAt })
    .from(articles)
    .where(eq(articles.title, "Dune (Remake, Ca. 2231)"));
  console.log(dune);
  console.log(pixar);
  await db
    .update(articles)
    .set({ imageUrl: null })
    .where(
      and(
        gte(articles.createdAt, pixar.createdAt),
        lte(articles.createdAt, dune.createdAt)
      )
    );
  process.exit(0);
}
select();
