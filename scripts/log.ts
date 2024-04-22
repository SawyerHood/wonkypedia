import { getDb } from "@/db/client";
import { articles, users } from "@/drizzle/schema";
import { count } from "drizzle-orm";

const db = getDb();

async function select() {
  const rows = await db.select({ count: count() }).from(articles);
  console.log(`Articles: ${rows[0].count}`);
  const userCount = await db.select({ count: count() }).from(users);
  console.log(`Users: ${userCount[0].count}`);
  process.exit(0);
}
select();
