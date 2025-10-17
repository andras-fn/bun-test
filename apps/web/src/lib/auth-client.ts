import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: import.meta.env.VITE_API_URL || "", // Empty for dev proxy, set in production
});

export const { signIn, signUp, signOut, useSession } = authClient;
