import { drizzle } from "drizzle-orm/vercel-postgres";
import { sql } from "@vercel/postgres";
import * as schema from "@/drizzle/schema";

export function createDB() {
  return drizzle(sql, { schema });
}
