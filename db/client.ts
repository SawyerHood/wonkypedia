import { drizzle } from "drizzle-orm/vercel-postgres";
import { sql } from "@vercel/postgres";
import * as schema from "@/drizzle/schema";

export const db = drizzle(sql, { schema });

export const getDb = () => {
  return db;
};
