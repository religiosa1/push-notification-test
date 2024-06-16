self.addEventListener("push", function (event) {
	const data = event.data?.json();
	if (!data || typeof data !== "object") {
		console.log("no data");
	}
	console.log(data);

	const title =
		typeof data.title === "string" && data.title
			? data.title
			: "No valid title";
	const body =
		typeof data.body === "string" && data.body ? data.body : "Empty body";
	const notificationPromise = self.registration.showNotification(title, {
		body: body,
	});
	// Keep the service worker alive until the notification is created.
	// https://developer.mozilla.org/en-US/docs/Web/API/ExtendableEvent/waitUntil
	event.waitUntil(notificationPromise);
});

// https://developer.mozilla.org/en-US/docs/Web/API/Clients/openWindow#examples
// Notification click event listener
self.addEventListener("notificationclick", (e) => {
	const TARGET_URL = "https://push-client.religiosa.ru/";
	e.notification.close();
	e.waitUntil(
		// Get all the Window clients
		clients.matchAll({ type: "window" }).then((clientsArr) => {
			// If a Window tab matching the targeted URL already exists, focus that;
			const hadWindowToFocus = clientsArr.some((windowClient) =>
				windowClient.url === TARGET_URL // e.notification.data.url
					? (windowClient.focus(), true)
					: false
			);
			// Otherwise, open a new tab to the applicable URL and focus it.
			if (!hadWindowToFocus) {
				clients
					.openWindow(TARGET_URL)
					.then((windowClient) => (windowClient ? windowClient.focus() : null));
			}
		})
	);
});
