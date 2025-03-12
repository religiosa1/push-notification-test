# Push-notification test

A simple test client and application server for push notification.

An attempt to make an example from the
[Serviceworker Cookbook](https://github.com/mdn/serviceworker-cookbook/tree/master/push-simple)
with an actual backend, with data storage and CORS. Written as a part of
on-going investigation of how to send push notification on the client's phone
as a part of another project.

Consists of two separate packages for the client and appserver, each of them is
supposed to be deployed on a separate domain, and supplied with a reverse
proxy with SSL (nginx + certbot, caddy, etc.)

## General mechanics

In a nutshell, there are three separate parts:

- [Notifications API](https://developer.mozilla.org/en-US/docs/Web/API/Notifications_API)
  Just showing the toaster.
- [Push API](https://developer.mozilla.org/en-US/docs/Web/API/Push_API)
  Which enables this communication between your app server and the client.
- [Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
  Which allows you to run process in the background, i.e. to receive push events
  when your website is closed.

### General architecture overview

```
                    ┌──────────────┐
  getSubscription() │              │  sendNotification()
       ┌───────────►│  PushServer  │◄───────────┐
       │            │              │            │
       │            └──────┬───────┘            │
       │                   │                    │
┌──────┴──────┐     push   │             ┌──────┴──────┐
│             │◄───────────┘             │             │
│   Client    │  sub()/unsub()/getKey()  │   Backend   │
│             ├─────────────────────────►│             │
└─────────────┘                          └─────────────┘
```

Push Server is supplied by your browser/OS, implementation of Client code and
App Server is on you.

Unfortunately, though at the moment of implementation (mid 2024, upd early 2025)
support for the Notification API is [pretty good](https://caniuse.com/notifications)
support for Push API on IPhones is [not good at all](https://caniuse.com/push-api)

While all of the other platforms allow you just to have a service worker, iOS
requires you to have an installed PWA.
Additionally, you need some custom wrappers for older Safari version (16.1-16.3)

There was this whole debacle of Apple disabling PWAs in Europe for iOS 17.4
in February 2024 but reversing this decision in March. This has to be considered
as the future of PWA on iOS may be quite shaky.

## Packages in this repo

### Client

Client is a minimalistic web app, which registers a service worker and gets a
push permission and push subscription and registers this subscription on the
backend.

ServiceWorker is waiting for the push event from the server (via Push Server
supplied by the browser in the subscription), and just shows the notification
with the payload text.

This is minimalistic implementation, unfortunately it won't work on IPhones,
because it's not a PWA.

### PWA Client

A more complicated version of the client, written as a react PWA. Currently, the
only way to enable push notifications on an iPhone is by installing a PWA.
It still won't work on a regular website, so we're showing a text, that it's not
supported and for safari users some instructions on how can you install a PWA
in your system.

To turn a website with a service worker into a PWA the only thing that you need
is a manifest -- if you're ok with it not working in offline mode.

Otherwise, you get into caching territory, which you can handle either manually,
or using extensions like [workbox](https://developer.chrome.com/docs/workbox/).

### Application Server

1. Exposes 3 endpoints for the client:

- GET /vapidPublicKey
  returns server's public key, which can be used for getting a push subscription
  from the push server
- POST /register PushSubscriptionJSON
  saves the latest subscription to the db, for future notifications
- Ideally you also need an unsubscribe endpoint when user decides to do so,
  but it's not implemented in this repo at the moment.

2. Provides a small admin panel, which allows to send notifications, list and
   delete subscriptions.

The notification mechanism assumes you have a small number (below 100) of
subscribers, it's not suitable for sending a lot of notifications.

Subscriptions are stored in sqlite database, which is automatically created and
migrated if necessary.

## Findings and conclusions

1. State of controls subscribed/not subscribed should be determind on the client,
   and not on the server, as a user can revoke permissions of any given time.
2. This state is combination of two entities:

- push subscription
- notification permission
  User obtains both when he uses permission dialog, but he can revoke them
  separately, so we need to check for both for showing the correct controls.

3. You can check subscription directly on page load, but to get a notification
   subscription you need to have a user interaction, otherwise your request may
   be blocked on some devices.
4. As a safety measure, even if we have an active subscription, we're still sending
   it to the appserver, to update it (in case there are some changes in
   some of the values). But this isn't necessary, strictly speaking.
5. On the appserver, we're storing subscriptions with a unique constraint on
   their endpoint (which is returned by the browser) and when we're recieving
   subscriptions from the client we're doing `on conflict update` to update it.
6. In the real production application, you also should authenticate the user.
7. Don't forget that PushSubscription is for the device, not user.
   Taking into account that a single device can be used by multiple users (at
   least on the QA environments) and single user can have multiple devices you
   most likely need many-to-many relationship between push subscriptions and
   users.
8. On the appserver, if we have 410 or 404 response from the push-server
   endpoint on attempt to send a notification, we're removing this subscription,
   as it means that the user removed his subscription in the interface.
9. Currently, it's hard to pass custom data to the notification besides text,
   for example which URL to open on notification click. There's
   `NotificationEvent.data` property,
   but it's [not supported](https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerRegistration/showNotification#browser_compatibility)
   on safari and firefox at the moment.
   We can repurpose notification tag, but notifications are grouped by the tag,
   so we can show only one notification for a specific url simultaneously (unless
   we add some custom query string to the url).
10. Different devices treat clicks on the notification differently, so we need
    some additional JS code in the service worker to handle those click events and
    open a website page (also a place to handle url tag mentioned in the previous
    step)
