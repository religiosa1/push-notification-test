# Push-notification test

A simple test client and application server for push notification.

An attempt to make an example from the
[Serviceworker Cookbook](https://github.com/mdn/serviceworker-cookbook/tree/master/push-simple)
with an actual backend, with data storage and CORS. Witten as a part of on-going
investigation of how to send push notification on the client's phone as a part
of another project.

Consists of two separate packages for the client and appserver, each of them is
supposed to be deployed on a separate domain, and supplied with a reverse
proxy with SSL (nginx + certbot, caddy, etc.)

## General mechanics

In a nutshell, there are two separate standards:

- [Notifications API]
  Just showing the toaster.
- [Push API]() https://caniuse.com/notifications
  Which enables this communication between your app server and the client

```
                   ┌──────────────┐
 getSubscription() │              │  sendNotification()
       ┌──────────►│  PushServer  │◄──────────┐
       │           │              │           │
       │           └──────┬───────┘           │
       │                  │                   │
┌──────┴──────┐    push   │            ┌──────┴──────┐
│             │◄──────────┘            │             │
│   Client    │         fetch          │  AppServer  │
│             ├───────────────────────►│             │
└─────────────┘                        └─────────────┘
```

Push Server is supplied by your browser/OS, implementation of Client code and
App Server is an attempt

Unfortunately, though at the moment of implementation (mid 2024) support for
the Notification API is [pretty good](https://caniuse.com/notifications)
support for Push API on IPhones is [not good at all](https://caniuse.com/push-api)

Basically you require some custom wrappers for Safari bellow version 16.1 and
even then I think it fails, and for versions >=16.1 you need a whole Progressive
Web Application (PWA) installed on the users phone.
And earlier this year there was this whole debacle of Apple disabling PWAs
in Europe for IOs 17.4 in February 2024 but reversing this decision in March.

### Client

Client is a minimalistic web app, which registers a service worker and gets a
push permission and push subscription and registers this subscription on the
backend.

ServiceWorker is waiting for the push event from the server (via Push Server
supplied by the browser in the subscription), and just shows the notification
with the payload text.

This is minimalistic implementation, unfortunately it will have problems working
on IPhones.

### PWA Client

A more complicated version of the client, written as a react PWA. Having PWA
installed is currently the only way to make push-notifications working on an
IPhone device. It still won't work on a regular website, so we're showing a
text, that it's not supported and for safari users some instructions on how
can you install a PWA in your system.

### Application Server

1. Exposes 2 endpoints for the client:

- GET /vapidPublicKey
  returns server's public key, which can be used for getting a push subscription from
  the push server
- POST /register PushSubscriptionJSON
  saves the latest subscription to the db, for future notifications

2. Provides a small admin panel, which allows to send notifications, list and
   delete subscriptions.

The notification mechanism assumes you have a small number (bellow 100) of subscribers,
it's not suitable for sending a lot of notifications.

Subscriptions are stored in sqlite database, which is automatically created and migrated
if necessary.

## Findings and conclusions

1. State of controls subscribed/not subscribed should be determind on the client,
   and not on the server, as a user can revoke permissions of any given time.
2. This state is combination of two entities:

- push subscription
- notification permission
  User obtains both when he uses permission dialog, but he can revoke them separately,
  so we need to check for both for showing the correct controls.

3. You can check subscription directly on page load, but to get a notification
   subscription you need to have a user interaction, otherwise your request mayb be
   blocked on some devices.
4. As a safety measure, even if we have an active subsciption, we're still sending
   it to the appserver, to update it (in case there are some changes in some of the values).
   But this isn't necessary, strictly speaking.
5. On the appserver, we're storing subscriptions with a unque constraint on their
   endpoint (which is returned by the browser) and when we're recieving subscriptions
   from the client we're doing `on conflict update` to update it. In the real production
   application, we should probably also authenticate the user.
6. On the appserver, if we have 410 or 404 response from the push-server
   endpoint on attempt to send a notification, we're removing this subscription, as
   it means that the user removed his subscription in the interface.
7. Currently, it's hard to pass custom data to the notification besides text, for example
   which URL to open on notification click. There's NotificationEvent.data property,
   but it's [not supported](https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerRegistration/showNotification#browser_compatibility) on safari and firefox at the moment.
   We can repurpose notification tag, but notifications are groupped by the tag,
   so we can show only one notification for a specific url simultaneously (unless
   we add some custonm query string to the url).
