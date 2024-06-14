import { migrate as drizzleMigrate } from "drizzle-orm/better-sqlite3/migrator";
import { db } from "./db";

export async function migrate() {
  // This will run migrations on the database, skipping the ones already applied
  return drizzleMigrate(db, { migrationsFolder: "./drizzle" });
}
