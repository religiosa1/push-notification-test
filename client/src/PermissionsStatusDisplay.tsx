import { Match, Show, Switch } from "solid-js";
import { useNotificationPermissions } from "./hooks/useNotificationsPermissions";

interface PermissionStatusDisplayProps {
	subscription: PushSubscription | null;
}
export function PermissionStatusDisplay(props: PermissionStatusDisplayProps) {
	const hasNotificationPermission = useNotificationPermissions();

	return (
		<Switch>
			<Match when={hasNotificationPermission()}>
				You gave this app permissions for notifications
			</Match>
			<Match when={hasNotificationPermission() === undefined}>
				Can't reliably determine permission status in your browser.
			</Match>
			<Match when={hasNotificationPermission() === false}>
				This app doesn't have your permission for notification.
				<Show when={props.subscription != null}>
					<p>
						Though you have an active notification subscription, you don't have
						(most likely you revoked) the notification permissions, so you won'
						recieve anything.
					</p>
					<button
						onClick={() => Notification?.requestPermission?.()}
						type="button"
					>
						Click here to provide the permissions
					</button>
				</Show>
			</Match>
		</Switch>
	);
}
