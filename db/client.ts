import { VercelPgDatabase, drizzle } from "drizzle-orm/vercel-postgres";
import * as schema from "@/drizzle/schema";
import { sql } from "@vercel/postgres";

let dbInstance: VercelPgDatabase<typeof schema> | null = null;

export const getDb = () => {
  if (!dbInstance) {
    // Disable prefetch as it is not supported for "Transaction" pool mode
    dbInstance = drizzle(sql, { schema });
  }
  return dbInstance;
};
