import { PrismaAdapter } from "@auth/prisma-adapter";
import { type DefaultSession, type NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";

import { db } from "~/server/db";
import {User} from "~/types/User";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session {
    user: User & DefaultSession["user"];
  }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authConfig = {
  providers: [Google],
  adapter: PrismaAdapter(db),
  callbacks: {
    signIn: async ({ account, profile }) => {
      if (account && account.provider === "google") {
        return profile?.email_verified &&
          profile?.email?.endsWith("@columbia.edu")
          ? true
          : false;
      }
      return true;
    },
    session: async ({ session, user }) => {
      if (session.user) {
        session.user.id = user.id;
        session.user.expected_graduation_year = user.expected_graduation_year;
        session.user.expected_graduation_month = user.expected_graduation_month;
        session.user.is_admin = user.is_admin;
        session.user.created_at = user.created_at;
        session.user.updated_at = user.updated_at;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
