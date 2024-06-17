import { Accessor, createSignal, onCleanup } from "solid-js";

export function useNotificationPermissions(): Accessor<boolean> {
	const [hasPermission, setHasPermission] = createSignal(
		window.Notification.permission === "granted"
	);

	const controller = window.AbortController && new window.AbortController();
	onCleanup(() => {
		controller?.abort();
	});

	// On older browsers permissions won't be reactive and will require a full page reload.
	navigator.permissions?.query?.({ name: "notifications" }).then((perm) => {
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
