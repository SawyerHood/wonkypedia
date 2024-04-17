import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { getDb } from "./db/client";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: DrizzleAdapter(getDb()),
  providers: [Google],
});
