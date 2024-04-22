import { VercelPgDatabase, drizzle } from "drizzle-orm/vercel-postgres";
import * as schema from "@/drizzle/schema";
import { sql } from "@vercel/postgres";

const dbInstance: VercelPgDatabase<typeof schema> = drizzle(sql, {
  schema,
});

export const getDb = () => {
  return dbInstance;
};
