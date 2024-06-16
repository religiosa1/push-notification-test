import {
	getVapidPublicKey,
	sendSubscriptionToServer,
	sendUnsubRequestToServer,
} from "./api";
import { withTimeout } from "./utils/withTimeout";

export const subscribe = (
	registration: ServiceWorkerRegistration,
	subscription: PushSubscription | null
) =>
	withTimeout(async () => {
		if (subscription == null) {
			const vapidPublicKey = await getVapidPublicKey();
			subscription = await registration.pushManager.subscribe({
				userVisibleOnly: true,
				applicationServerKey: vapidPublicKey,
			});
		}

		try {
			await sendSubscriptionToServer(subscription);
			return subscription;
		} catch (e) {
			await subscription.unsubscribe();
			throw e;
		}
	});

export const unsubscribe = (subscription: PushSubscription | null) =>
	withTimeout(async () => {
		if (!subscription) {
			return;
		}

		await subscription.unsubscribe?.();
		await sendUnsubRequestToServer(subscription);
	});
