import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@repo/database";
import { users, sessions, accounts, verifications } from "@repo/database";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg", // PostgreSQL
    schema: {
      user: users, // Map 'users' table to 'user'
      session: sessions, // Map 'sessions' table to 'session'
      account: accounts, // Map 'accounts' table to 'account'
      verification: verifications, // Map 'verifications' table to 'verification'
    },
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 60 * 60 * 24 * 7, // 7 days
    },
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // Update session every day
    cookieAttributes: {
      httpOnly: true,
      secure: false, // Set to true in production with HTTPS
      sameSite: "lax",
      path: "/",
    },
  },
  secret: process.env.AUTH_SECRET || "your-secret-key-here",
  baseURL: "http://localhost:3001",
  trustedOrigins: ["http://localhost:5173"],
});
