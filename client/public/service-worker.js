console.log("hello from service worker");

self.addEventListener("push", function (event) {
  const data = event.data?.json();
  console.log(data);
  const notificationPromise = self.registration.showNotification(
    "ServiceWorker Cookbook",
    {
      body: "Alea iacta est",
    }
  );
  // Keep the service worker alive until the notification is created.
  // https://developer.mozilla.org/en-US/docs/Web/API/ExtendableEvent/waitUntil
  event.waitUntil(notificationPromise);
});
