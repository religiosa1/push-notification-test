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
	e.notification.close();
	e.waitUntil(openAndFocusUrl("https://push-client.religiosa.ru/"));
});

async function openAndFocusUrl(url) {
	const windowClients = await clients.matchAll({ type: "window" });
	const windowTabToFocus = windowClients.find((client) => client.url === url);
	if (windowTabToFocus) {
		// If a Window tab matching the targeted URL already exists, focus that;
		windowTabToFocus.focus();
	} else {
		// Otherwise, open a new tab to the applicable URL and focus it.
		const client = await windowClients.openWindow(url);
		if (client) {
			client.focus();
		}
	}
}
