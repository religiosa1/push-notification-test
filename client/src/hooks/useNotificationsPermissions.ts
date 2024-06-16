import { Accessor, createSignal, onCleanup } from "solid-js";

export function useNotificationPermissions(): Accessor<boolean> {
	const [hasPermission, setHasPermission] = createSignal(
		window.Notification.permission === "granted"
	);

	const controller = new AbortController();
	onCleanup(() => {
		controller.abort();
	});

	navigator.permissions.query({ name: "notifications" }).then((perm) => {
		perm.addEventListener(
			"change",
			() => {
				setHasPermission(perm.state === "granted");
			},
			{ signal: controller.signal }
		);
	});

	return hasPermission;
}
