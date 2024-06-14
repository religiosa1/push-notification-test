import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import * as schema from "./schema";
import { DEFAULT_DB_NAME } from "../drizzle.config";

const sqlite = new Database(process.env.DB_FILE ?? DEFAULT_DB_NAME);
export const db = drizzle(sqlite, { schema });
