import { getVapidPublicKey, sendSubscriptionToServer } from "./api";
import "./style.css";

navigator.serviceWorker.register("./service-worker/service-worker.js");

navigator.serviceWorker.ready.then(async (registration) => {
  let subscription = await registration.pushManager.getSubscription();
  if (subscription == null) {
    const vapidPublicKey = await getVapidPublicKey();

    subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: vapidPublicKey,
    });
  }

  try {
    sendSubscriptionToServer(subscription);
  } catch (e) {
    await subscription.unsubscribe();
    throw e;
  }
});
