console.log("hello from service worker");

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
