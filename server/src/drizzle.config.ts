import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export const DEFAULT_DB_NAME = "./data.db";

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "sqlite",
  dbCredentials: {
    url: process.env.DB_FILE ?? DEFAULT_DB_NAME,
  },
});
