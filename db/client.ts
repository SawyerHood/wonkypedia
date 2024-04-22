import * as schema from "@/drizzle/schema";
import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";

neonConfig.pipelineConnect = false;
const pool = new Pool({ connectionString: process.env.POSTGRES_URL! });
export const db = drizzle(pool, { schema });

export const getDb = () => {
  return db;
};
