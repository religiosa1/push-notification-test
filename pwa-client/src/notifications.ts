import {
  getVapidPublicKey,
  sendSubscriptionToServer,
  sendUnsubRequestToServer,
} from "./api";
import { withTimeout } from "./utils/withTimeout";

export const subscribe = (
  registration: ServiceWorkerRegistration
): Promise<PushSubscription> =>
  withTimeout(async () => {
    const vapidPublicKey = await getVapidPublicKey();
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: vapidPublicKey,
    });

    try {
      await sendSubscriptionToServer(subscription);
      return subscription;
    } catch (e) {
      await subscription.unsubscribe();
      throw e;
    }
  });

export const unsubscribe = (
  subscription: PushSubscription | null
): Promise<void> =>
  withTimeout(async () => {
    if (!subscription) {
      return;
    }

    await subscription.unsubscribe?.();
    await sendUnsubRequestToServer(subscription);
  });
