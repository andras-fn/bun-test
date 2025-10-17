import { Next } from "hono";
import { auth } from "../lib/auth";
import type { AuthContext } from "../types/context";

export const authMiddleware = async (c: AuthContext, next: Next) => {
  try {
    const request = new Request(c.req.url, {
      method: c.req.method,
      headers: c.req.header(),
    });

    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    // Set user in context for use in routes
    c.set("userId", session.user.id);
    c.set("user", session.user);

    await next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    return c.json({ error: "Authentication failed" }, 401);
  }
};
