/// <reference lib="webworker" />

// export empty type because of tsc --isolatedModules flag
export type {};
declare let self: ServiceWorkerGlobalScope;

//==============================================================================
// PUSH Notifications

interface IPushEventPayload {
  title: string;
  body: string;
  urlTag: string;
}

self.addEventListener("push", function (event) {
  const data = event.data?.json() as IPushEventPayload;

  if (!data || typeof data !== "object") {
    console.log("no data");
  }

  const title =
    typeof data.title === "string" && data.title
      ? data.title
      : "No valid title";
  const body =
    typeof data.body === "string" && data.body ? data.body : "Empty body";

  const notificationPromise = self.registration.showNotification(title, {
    body,
    tag: data.urlTag,
  });

  // Keep the service worker alive until the notification is created.
  event.waitUntil(notificationPromise);
});

self.addEventListener("notificationclick", function (event) {
  event.notification.close();

  // There's a e.notification.data.url, but it's not supported on safari/IOS
  // https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerRegistration/showNotification#browser_compatibility
  // We can try to hijack Notification's tag property, if we need to dynamically
  // determine what kind of URL do we want to show.
  // https://developer.mozilla.org/en-US/docs/Web/API/Notification/tag
  // As a side-effect, we will only have one notification for a url, because of
  // the grouping/replacing functionality.
  const url = event.notification.tag || "https://example.com";
  event.waitUntil(openAndFocusUrl(url));
});

// https://developer.mozilla.org/en-US/docs/Web/API/Clients/openWindow#examples
async function openAndFocusUrl(url: string) {
  const windowClients = await self.clients.matchAll({ type: "window" });
  const windowTabToFocus = windowClients.find((client) => client.url === url);
  if (windowTabToFocus) {
    await windowTabToFocus.focus();
  } else {
    const client = await self.clients.openWindow(url);
    if (client) {
      client.focus().catch((err) => {
        console.log("Unable to focus the window:", err);
      });
    }
  }
}
