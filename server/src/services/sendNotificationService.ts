import { WebPushError } from "web-push";
import {
  PushSubscriptionDbModel,
  getSubscriptions,
  deleteSubscriptionById,
} from "../repositories/subscriptions";
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
  await Promise.all(
    subscriptions.map((sub) =>
      webPush
        .sendNotification(dbSubToWebPush(sub), payload, options)
        .catch(async (err) => {
          if (
            err instanceof WebPushError &&
            (err.statusCode === 410 || err.statusCode === 404)
          ) {
            console.log(
              `Subscription id = ${sub.id} is GONE (${err.statusCode}), removing from DB`
            );
            await deleteSubscriptionById(sub.id);
          } else {
            console.warn(
              `error while sending the subscription id = ${sub.id}`,
              err
            );
          }
        })
    )
  );
}

function dbSubToWebPush(
  sub: PushSubscriptionDbModel
): webPush.PushSubscription {
  return {
    endpoint: sub.endpoint,
    keys: {
      p256dh: sub.p256dh,
      auth: sub.auth,
    },
  };
}
