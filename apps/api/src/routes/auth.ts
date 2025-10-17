import { Hono } from "hono";
import { auth } from "../lib/auth";

const app = new Hono();

// Handle all Better Auth routes
app.all("/*", async (c) => {
  const request = new Request(c.req.url, {
    method: c.req.method,
    headers: c.req.header(),
    body:
      c.req.method !== "GET" && c.req.method !== "HEAD"
        ? await c.req.text()
        : undefined,
  });

  const response = await auth.handler(request);

  // Convert Response to Hono response
  const body = await response.text();
  return new Response(body, {
    status: response.status,
    headers: response.headers,
  });
});

export { app as authRoute };
