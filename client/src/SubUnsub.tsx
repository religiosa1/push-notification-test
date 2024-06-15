import { Match, Show, Switch } from "solid-js";
import { useAsyncOperation } from "./hooks/useAsyncOperation";
import { useNotificationPermissions } from "./hooks/useNotificationsPermissions";
import { subscribe, unsubscribe } from "./notifications";

interface SubUnsubProps {
	registration: ServiceWorkerRegistration;
	subscription: PushSubscription | null;
	onSubscripionChange: (sub: PushSubscription | null) => void;
}
export function SubUnsub(props: SubUnsubProps) {
	const [op, setOp] = useAsyncOperation();
	const hasNotificationPermission = useNotificationPermissions();

	return (
		<>
			<div class="loader">
				<Show
					when={!hasNotificationPermission()}
					fallback={"You gave this app permissions for notifications"}
				>
					This app doesn't have your permission for notification.
					<Show when={props.subscription != null}>
						<p>
							Though you have an active notification subscription, you don't
							have (most likely you revoked) the notification permissions, so
							you won' recieve anything.
						</p>
						<button
							onClick={() => Notification.requestPermission()}
							type="button"
						>
							Click here to provide the permissions
						</button>
					</Show>
				</Show>
			</div>
			<div class="loader">
				<Switch>
					<Match when={op().state === "pending"}>Processing...</Match>
					<Match when={op().state === "rejected"}>
						Error during handling of the operation:
						<code>
							<pre>{String(op().error)}</pre>
						</code>
					</Match>
				</Switch>
			</div>
			<Switch>
				<Match when={props.subscription != null}>
					<p>You're subscribed to the notifications.</p>
					<button
						disabled={op().state === "pending"}
						type="button"
						onClick={() =>
							setOp(async () => {
								await unsubscribe(props.subscription);
								props.onSubscripionChange(null);
							})
						}
					>
						Click here to unsubscribe
					</button>
				</Match>
				<Match when={props.subscription == null}>
					<button
						disabled={op().state === "pending"}
						type="button"
						onClick={() =>
							setOp(async () => {
								const sub = await subscribe(
									props.registration,
									props.subscription,
								);
								props.onSubscripionChange(sub);
							})
						}
					>
						Click here to subscribe to notifications
					</button>
				</Match>
			</Switch>
		</>
	);
}
