import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const subscriptions = sqliteTable("subscriptions", {
  id: integer("id").primaryKey(),
  subscription: text("subscription", {
    mode: "json",
  })
    .notNull()
    .$type<PushSubscriptionJSON>(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
});
