import { getSubscriptions } from "../repositories/subscriptions";
import webPush from "./webPush";

export async function sendNotifications(
  payload?: string | Buffer | null | undefined,
  options?: webPush.RequestOptions | undefined
) {
  if (process.env.NODE_ENV !== "production") {
    console.log("Not sending notification in dev mode", payload, options);
    return;
  }
  console.log("Sending notification", payload, options);

  const subscriptions = await getSubscriptions();
  for (const sub of subscriptions) {
    webPush.sendNotification(
      sub.subscription as webPush.PushSubscription,
      payload,
      options
    );
  }
}
