import { Match, Switch } from "solid-js";
import { useAsyncOperation } from "./hooks/useAsyncOperation";
import { subscribe, unsubscribe } from "./notifications";
import { PermissionStatusDisplay } from "./PermissionsStatusDisplay";

interface SubUnsubProps {
	registration: ServiceWorkerRegistration;
	subscription: PushSubscription | null;
	onSubscripionChange: (sub: PushSubscription | null) => void;
}
export function SubUnsub(props: SubUnsubProps) {
	const [op, setOp] = useAsyncOperation();

	return (
		<>
			<div class="loader">
				<PermissionStatusDisplay subscription={props.subscription} />
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
								const sub = await subscribe(props.registration);
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
