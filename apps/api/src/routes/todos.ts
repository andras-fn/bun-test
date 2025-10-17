import { Hono } from "hono";
import { db, todos, eq, desc } from "@repo/database";
import { authMiddleware } from "../middleware/auth";
import type { AuthContext, AuthVariables } from "../types/context";

const app = new Hono();

// Apply auth middleware to all routes
app.use("*", authMiddleware);

// Get all todos for the authenticated user
app.get("/", async (c: AuthContext) => {
  try {
    const userId = c.get("userId");
    const userTodos = await db
      .select()
      .from(todos)
      .where(eq(todos.userId, userId))
      .orderBy(desc(todos.createdAt));

    return c.json(userTodos);
  } catch (error) {
    console.error("Error fetching todos:", error);
    return c.json({ error: "Failed to fetch todos" }, 500);
  }
});

// Create a new todo
app.post("/", async (c: AuthContext) => {
  try {
    const userId = c.get("userId");
    const { title } = await c.req.json();

    if (!title || typeof title !== "string") {
      return c.json({ error: "Title is required" }, 400);
    }

    const [newTodo] = await db
      .insert(todos)
      .values({
        title: title.trim(),
        userId,
        completed: false,
      })
      .returning();

    return c.json(newTodo, 201);
  } catch (error) {
    console.error("Error creating todo:", error);
    return c.json({ error: "Failed to create todo" }, 500);
  }
});

// Update a todo
app.put("/:id", async (c: AuthContext) => {
  try {
    const userId = c.get("userId");
    const id = c.req.param("id");
    const updates = await c.req.json();

    // First check if the todo exists and belongs to the user
    const existingTodos = await db
      .select()
      .from(todos)
      .where(eq(todos.id, id))
      .limit(1);

    const existingTodo = existingTodos[0];
    if (!existingTodo || existingTodo.userId !== userId) {
      return c.json({ error: "Todo not found" }, 404);
    }

    const [updatedTodo] = await db
      .update(todos)
      .set({
        ...updates,
        updatedAt: new Date(),
      })
      .where(eq(todos.id, id))
      .returning();

    return c.json(updatedTodo);
  } catch (error) {
    console.error("Error updating todo:", error);
    return c.json({ error: "Failed to update todo" }, 500);
  }
});

// Delete a todo
app.delete("/:id", async (c: AuthContext) => {
  try {
    const userId = c.get("userId");
    const id = c.req.param("id");

    // First check if the todo exists and belongs to the user
    const existingTodos = await db
      .select()
      .from(todos)
      .where(eq(todos.id, id))
      .limit(1);

    const existingTodo = existingTodos[0];
    if (!existingTodo || existingTodo.userId !== userId) {
      return c.json({ error: "Todo not found" }, 404);
    }

    const [deletedTodo] = await db
      .delete(todos)
      .where(eq(todos.id, id))
      .returning();

    return c.json({ message: "Todo deleted successfully" });
  } catch (error) {
    console.error("Error deleting todo:", error);
    return c.json({ error: "Failed to delete todo" }, 500);
  }
});

export { app as todosRoute };
