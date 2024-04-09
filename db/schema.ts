import { sql } from "drizzle-orm";
import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const articles = sqliteTable("articles", {
  title: text("title").primaryKey(),
  content: text("content"),
  createdAt: int("created_at", { mode: "timestamp" }).default(
    sql`(unixepoch())`
  ),
});
