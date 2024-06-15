import { Match, Switch } from "solid-js";
import { subscribe, unsubscribe } from "./notifications";
import { useNotificationPermissions } from "./hooks/useNotificationsPermissions";
import { useAsyncOperation } from "./hooks/useAsyncOperation";

export function App() {
	const hasNotificationPermission = useNotificationPermissions();
	const [op, setOp] = useAsyncOperation();

	return (
		<>
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
				<Match when={hasNotificationPermission()}>
					<p>You're subscribed to the notifications.</p>
					<button
						disabled={op().state === "pending"}
						type="button"
						onClick={() => setOp(unsubscribe())}
					>
						Click here to unsubscribe
					</button>
				</Match>
				<Match when={!hasNotificationPermission()}>
					<button
						disabled={op().state === "pending"}
						type="button"
						onClick={() => setOp(subscribe())}
					>
						Click here to subscribe to notifications
					</button>
				</Match>
			</Switch>
		</>
	);
}
