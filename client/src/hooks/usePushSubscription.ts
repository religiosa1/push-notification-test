import { Accessor, Resource, createResource, createSignal } from "solid-js";
import { sendSubscriptionToServer } from "../api";
import { withTimeout } from "../utils/withTimeout";
import { getPushManager } from "../utils/getPushManager";

type Stage = "initial" | "registration" | "subscription" | "register" | "done";

type UsePushSubscriptionReturn = [
	Resource<{
		registration: ServiceWorkerRegistration;
		subscription: PushSubscription | null;
	}>,
	Accessor<Stage>
];
export function usePushSubscription(): UsePushSubscriptionReturn {
	const [stage, setStage] = createSignal<Stage>("initial");
	const [resource] = createResource(() =>
		withTimeout(async () => {
			setStage("registration");
			const registration = await navigator.serviceWorker.ready;
			setStage("subscription");
			const pushManager = getPushManager(registration);
			const subscription = await pushManager?.getSubscription();
			setStage("register");
			// If we have an active subscription, we're sending it to backend immediately,
			// to update and sync data just in case.

			if (subscription != null) {
				await sendSubscriptionToServer(subscription);
			}
			setStage("done");
			return { registration, subscription };
		})
	);
	return [resource, stage];
}
