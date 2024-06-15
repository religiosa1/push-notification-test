import {
	getVapidPublicKey,
	sendSubscriptionToServer,
	sendUnsubRequestToServer,
} from "./api";
import { withTimeout } from "./utils/withTimeout";

export async function subscribe() {
	const serviceWorker = await withTimeout(() => navigator.serviceWorker.ready);
	let subscription = await serviceWorker.pushManager.getSubscription();

	if (subscription == null) {
		const vapidPublicKey = await getVapidPublicKey();
		subscription = await serviceWorker.pushManager.subscribe({
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
}

export async function unsubscribe() {
	const serviceWorker = await withTimeout(() => navigator.serviceWorker.ready);
	const subscription = await serviceWorker.pushManager.getSubscription();

	if (!subscription) {
		return;
	}

	await subscription.unsubscribe?.();
	await sendUnsubRequestToServer(subscription);
}
