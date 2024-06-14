# Push-notification test

A simple client and application server for push notification.

An attempt to make an example from the
[Serviceworker Cookbook](https://github.com/mdn/serviceworker-cookbook/tree/master/push-simple)
with an actual backend, with data storage and CORS.

Consists of two separate packages for the client and appserver, each of them is
supposed to be deployed on a separate domain, and supplied with a reverse
proxy with SSL (nginx + certbot, caddy, etc.)

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

Push Server is supplied by your browser/OS.

## Client

Client is a laconic web app, which registers a service worker and gets a
push permission and push subscription and registers this subscription on the
backend.

ServiceWorker is waiting for the push event from the server (via Push Server
supplied by the browser in the subscription), and just displays the payload text.

## Application Server

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
