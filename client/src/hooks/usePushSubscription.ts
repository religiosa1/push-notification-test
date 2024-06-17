import { createResource } from "solid-js";
import { withTimeout } from "../utils/withTimeout";
import { sendSubscriptionToServer } from "../api";

export function usePushSubscription() {
	const [foo] = createResource(() =>
		withTimeout(async () => {
			const registration = await navigator.serviceWorker.ready;
			const pushManager: PushManager =
				//@ts-expect-error safari-specific implementation
				window.safari.pushNotification ?? registration.pushManager;
			const subscription = await pushManager?.getSubscription();
			// If we have an active subscription, we're sending it to backend immediately,
			// to update and sync data just in case.

			if (subscription != null) {
				await sendSubscriptionToServer(subscription);
			}
			return { registration, subscription };
		})
	);
	return foo;
}
