import {
  getVapidPublicKey,
  sendSubscriptionToServer,
  sendUnsubRequestToServer,
} from "./api";
import { getPushManager } from "../utils/getPushManager";
import { withTimeout } from "../utils/withTimeout";

/** Subscribe to notification on service worker registration object. */
export const subscribe = (
  registration: ServiceWorkerRegistration
): Promise<PushSubscription> =>
  withTimeout(async () => {
    if (!registration) {
      throw new TypeError("Unexpected empty registration in subscribe call");
    }
    const vapidPublicKey = await getVapidPublicKey();
    const pushManager = getPushManager(registration);
    if (!pushManager) {
      throw new Error("Unable to obtain pushManager");
    }
    if (typeof pushManager.subscribe !== "function") {
      throw new Error(
        "subscribe is ont a function on the pushManager instance"
      );
    }
    const subscription = await pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: vapidPublicKey,
    });

    if (!subscription) {
      throw new Error("Empty subscription recieved from the pushManager");
    }

    try {
      await sendSubscriptionToServer(subscription);
      return subscription;
    } catch (e) {
      await subscription.unsubscribe();
      throw e;
    }
  });

export const unsubscribe = (
  subscription: PushSubscription | null | undefined
): Promise<void> =>
  withTimeout(async () => {
    if (!subscription) {
      return;
    }

    await subscription.unsubscribe?.();
    await sendUnsubRequestToServer(subscription);
  });
