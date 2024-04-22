import { getDb } from "@/db/client";
import { articles } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

const db = getDb();

async function deleteArticle() {
  await db.delete(articles).where(eq(articles.title, "Swift-boyce"));
}
deleteArticle();
