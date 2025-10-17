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
      secure: process.env.NODE_ENV === "production", // Enable secure cookies in production
      sameSite: "lax",
      path: "/",
    },
  },
  secret: process.env.AUTH_SECRET || "your-secret-key-here",
  baseURL:
    process.env.NODE_ENV === "production"
      ? process.env.AUTH_BASE_URL || "http://localhost:3000/api" // Production: through nginx proxy
      : "http://localhost:3001", // Development: direct to API server
  trustedOrigins:
    process.env.NODE_ENV === "production"
      ? [
          process.env.AUTH_TRUSTED_ORIGIN || "http://localhost:3000", // Production: nginx proxy
          "http://localhost:3000", // Docker development
        ]
      : [
          "http://localhost:5173", // Vite dev server
          "http://localhost:3000", // Local nginx
        ],
});
