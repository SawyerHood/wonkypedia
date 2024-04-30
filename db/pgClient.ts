import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "@/drizzle/schema";

export function createDB() {
  const queryClient = postgres(process.env.POSTGRES_URL!);
  const db = drizzle(queryClient, { schema });
  return db;
}
