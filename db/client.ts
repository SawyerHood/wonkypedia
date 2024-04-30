import { createDB as createVercelDB } from "./vercelClient";
import { createDB as createPgDB } from "./pgClient";
import { IS_LOCAL } from "@/shared/config";

let db: ReturnType<typeof createVercelDB> | null = null;

export const getDb = () => {
  if (!db) {
    db = IS_LOCAL ? (createPgDB() as any) : createVercelDB();
  }

  return db!;
};
