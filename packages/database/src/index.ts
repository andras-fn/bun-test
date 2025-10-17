import { drizzle } from "drizzle-orm/bun-sql";
import * as schema from "./schema";

// Import SQL from Bun (works in both runtime and compiled executables)
import { SQL } from "bun";

const connectionString =
  process.env.DATABASE_URL ||
  "postgresql://todouser:todopass@localhost:5432/todoapp";

// Use Bun's built-in PostgreSQL client
const sql = new SQL(connectionString);
export const db = drizzle({ client: sql, schema });

// Export all schema
export * from "./schema";

// Re-export core drizzle-orm functionality so API doesn't need to import drizzle-orm directly
export * from "drizzle-orm";

// Export specific drizzle functions commonly used
export {
  eq,
  and,
  or,
  not,
  isNull,
  isNotNull,
  inArray,
  notInArray,
  exists,
  notExists,
} from "drizzle-orm";
export { asc, desc } from "drizzle-orm";
export { sql } from "drizzle-orm";
export { migrate } from "drizzle-orm/bun-sql/migrator";

// Export PostgreSQL-specific types and functions
export type { PgTable, PgColumn } from "drizzle-orm/pg-core";
