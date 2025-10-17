import { Hono } from "hono";
import { cors } from "hono/cors";
import { serve } from "@hono/node-server";
import { todosRoute } from "./routes/todos";
import { authRoute } from "./routes/auth";

const app = new Hono();

// CORS configuration
app.use(
  "*",
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? process.env.FRONTEND_URL || "http://localhost:3000"
        : "http://localhost:5173", // Allow Vite dev server in development
    allowHeaders: ["Content-Type", "Authorization", "Cookie"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Set-Cookie"],
    credentials: true,
  })
);

// API Routes
app.route("/api/todos", todosRoute);
app.route("/api/auth", authRoute);

// Health check
app.get("/health", (c) => {
  return c.json({ status: "ok", timestamp: new Date().toISOString() });
});

const port = process.env.PORT || 3001;

console.log(`🚀 Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port: Number(port),
});
