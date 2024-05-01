import * as schema from "@/drizzle/schema";

export const createDB =
  process.env.NODE_ENV === "development"
    ? () => {
        const postgres = require("postgres");
        const { drizzle } = require("drizzle-orm/postgres-js");
        const queryClient = postgres(process.env.POSTGRES_URL!);
        const db = drizzle(queryClient, { schema });
        return db;
      }
    : () => null;
