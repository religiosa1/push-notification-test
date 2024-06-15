import { createResource } from "solid-js";
import { withTimeout } from "../utils/withTimeout";

export function usePushSubscription() {
	const [foo] = createResource(() =>
		withTimeout(async () => {
			const registration = await navigator.serviceWorker.ready;
			const subscription = await registration.pushManager.getSubscription();
			return { registration, subscription };
		}),
	);
	return foo;
}
