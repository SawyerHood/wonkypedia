import {
  pgTable,
  pgEnum,
  text,
  timestamp,
  jsonb,
  bigint,
  foreignKey,
  primaryKey,
} from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";

export const keyStatus = pgEnum("key_status", [
  "default",
  "valid",
  "invalid",
  "expired",
]);
export const keyType = pgEnum("key_type", [
  "aead-ietf",
  "aead-det",
  "hmacsha512",
  "hmacsha256",
  "auth",
  "shorthash",
  "generichash",
  "kdf",
  "secretbox",
  "secretstream",
  "stream_xchacha20",
]);
export const factorType = pgEnum("factor_type", ["totp", "webauthn"]);
export const factorStatus = pgEnum("factor_status", ["unverified", "verified"]);
export const aalLevel = pgEnum("aal_level", ["aal1", "aal2", "aal3"]);
export const codeChallengeMethod = pgEnum("code_challenge_method", [
  "s256",
  "plain",
]);
export const equalityOp = pgEnum("equality_op", [
  "eq",
  "neq",
  "lt",
  "lte",
  "gt",
  "gte",
  "in",
]);
export const action = pgEnum("action", [
  "INSERT",
  "UPDATE",
  "DELETE",
  "TRUNCATE",
  "ERROR",
]);

export const articles = pgTable("articles", {
  title: text("title").primaryKey().notNull(),
  content: text("content"),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
    .defaultNow()
    .notNull(),
  imageUrl: text("image_url"),
  infobox: jsonb("infobox"),
});

export const linkedToCount = pgTable("linked_to_count", {
  to: text("to"),
  // You can use { mode: "bigint" } if numbers are exceeding js number limitations
  count: bigint("count", { mode: "number" }),
});

export const undiscoveredLinks = pgTable("undiscovered_links", {
  to: text("to"),
  // You can use { mode: "bigint" } if numbers are exceeding js number limitations
  count: bigint("count", { mode: "number" }),
});

export const links = pgTable(
  "links",
  {
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
      .defaultNow()
      .notNull(),
    from: text("from")
      .notNull()
      .references(() => articles.title, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    to: text("to").default("~UNKNOWN~").notNull(),
  },
  (table) => {
    return {
      pkLinks: primaryKey({
        columns: [table.from, table.to],
        name: "pk_links",
      }),
    };
  }
);

export const linksRelations = relations(links, ({ one }) => ({
  to: one(articles, {
    fields: [links.to],
    references: [articles.title],
  }),
  from: one(articles, {
    fields: [links.from],
    references: [articles.title],
  }),
}));
