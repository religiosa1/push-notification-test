import "dotenv/config";
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import SendNotificationsController from "./controllers/SendNotifications";
import RegisterController from "./controllers/Register";
import UnregisterController from "./controllers/Unregister";
import SubscriptionsController from "./controllers/Subscriptions";
import VapidPublicKeyController from "./controllers/VapidPublicKey";
import { migrate } from "./db";

const app = new Hono();

app.route("/", SendNotificationsController);
app.route("/subscriptions", SubscriptionsController);
app.route("/register", RegisterController);
app.route("/register", UnregisterController);
app.route("/vapidPublicKey", VapidPublicKeyController);

console.log("Running migrations...");
migrate().then(() => {
  const port = parseInt(process.env.PORT ?? "", 10) || 3000;
  console.log(`Server is running on port ${port}`);

  serve({
    fetch: app.fetch,
    port,
  });
});
