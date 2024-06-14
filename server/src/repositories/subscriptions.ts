import { eq } from "drizzle-orm";
import { db, schema } from "../db";
import { pushSubscriptionJSONSchema } from "../models/pushSubscriptionJSONSchema";

const SUBSCRIPTIONS_MAX = 10000;

export interface SubscriptionDbModel {
  id: number;
  subscription: PushSubscriptionJSON;
  createdAt: Date;
}

export async function getSubscriptions(): Promise<SubscriptionDbModel[]> {
  const items = await db
    .select({
      id: schema.subscriptions.id,
      subscription: schema.subscriptions.subscription,
      createdAt: schema.subscriptions.createdAt,
    })
    .from(schema.subscriptions)
    .limit(Math.max(SUBSCRIPTIONS_MAX));
  return items;
}

export async function saveSubscription(
  subscription: PushSubscriptionJSON
): Promise<number> {
  pushSubscriptionJSONSchema.parse(subscription);

  const result = await db.insert(schema.subscriptions).values({
    subscription,
    createdAt: new Date(),
  });
  return Number(result.lastInsertRowid);
}

export async function deleteSubscription(id: number): Promise<void> {
  await db.delete(schema.subscriptions).where(eq(schema.subscriptions.id, id));
}
