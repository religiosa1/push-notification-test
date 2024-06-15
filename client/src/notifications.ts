import {
	getVapidPublicKey,
	sendSubscriptionToServer,
	sendUnsubRequestToServer,
} from "./api";
import { withTimeout } from "./utils/withTimeout";

export const subscribe = () =>
	withTimeout(async () => {
		const serviceWorker = await navigator.serviceWorker.ready;
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
	});

export const unsubscribe = () =>
	withTimeout(async () => {
		await pause(5000);
		const serviceWorker = await navigator.serviceWorker.ready;
		const subscription = await serviceWorker.pushManager.getSubscription();

		if (!subscription) {
			return;
		}

		await subscription.unsubscribe?.();
		await sendUnsubRequestToServer(subscription);
	});

function pause(timeout: number, signal?: AbortSignal): Promise<void> {
	return new Promise<void>((res, rej) => {
		const to = setTimeout(() => {
			signal?.removeEventListener("abort", handleRejection);
			res();
		}, timeout);
		function handleRejection(reason: unknown) {
			rej(reason);
			clearTimeout(to);
		}
		signal?.addEventListener("abort", handleRejection, { once: true });
	});
}
