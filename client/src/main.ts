import { getVapidPublicKey, sendSubscriptionToServer } from "./api";
import "./style.css";

navigator.serviceWorker.register("/service-worker.js");

navigator.serviceWorker.ready.then(async (registration) => {
  console.log("service worker registered");
  let subscription = await registration.pushManager.getSubscription();

  console.log("loaded subscription", subscription);
  if (subscription == null) {
    const vapidPublicKey = await getVapidPublicKey();
    console.log("download a vapid key", vapidPublicKey);

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
