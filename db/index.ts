import { drizzle } from "drizzle-orm/better-sqlite3";
import * as mySchema from "./schema";
import Database from "better-sqlite3";

export const schema = mySchema;

export const db = drizzle(new Database("./db.sqlite"), { schema });
