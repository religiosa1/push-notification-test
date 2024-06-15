import { eq } from "drizzle-orm";
import { db, schema } from "../db";
import { pushSubscriptionJSONSchema } from "../models/pushSubscriptionJSONSchema";

const SUBSCRIPTIONS_MAX = 10000;

export type PushSubscriptionDbModel = typeof schema.subscriptions.$inferSelect;

export async function getSubscriptions(): Promise<PushSubscriptionDbModel[]> {
  const items = await db
    .select()
    .from(schema.subscriptions)
    .limit(Math.max(SUBSCRIPTIONS_MAX));
  return items;
}

export async function saveSubscription(
  subscription: PushSubscriptionJSON
): Promise<number> {
  const sub = pushSubscriptionJSONSchema.parse(subscription);

  const expirationTime = sub.expirationTime
    ? new Date(sub.expirationTime)
    : null;

  const result = await db
    .insert(schema.subscriptions)
    .values({
      endpoint: sub.endpoint,
      expirationTime,
      p256dh: sub.keys.p256dh,
      auth: sub.keys.auth,
      createdAt: new Date(),
      modifiedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: schema.subscriptions.endpoint,
      set: {
        expirationTime,
        p256dh: sub.keys.p256dh,
        auth: sub.keys.auth,
        modifiedAt: new Date(),
      },
    });

  return Number(result.lastInsertRowid);
}

export async function deleteSubscriptionById(id: number): Promise<number> {
  const result = await db
    .delete(schema.subscriptions)
    .where(eq(schema.subscriptions.id, id));
  return Number(result.lastInsertRowid);
}

export async function deleteSubscription(sub: {
  endpoint: string;
}): Promise<number> {
  const result = await db
    .delete(schema.subscriptions)
    .where(eq(schema.subscriptions.endpoint, sub.endpoint));
  return Number(result.lastInsertRowid);
}
