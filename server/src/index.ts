import "dotenv/config";
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import SendNotificationsController from "./controllers/SendNotifications";
import RegisterController from "./controllers/Register";
import SubscriptionsController from "./controllers/Subscriptions";
import { migrate } from "./db";

const app = new Hono();

app.route("/", SendNotificationsController);
app.route("/subscriptions", SubscriptionsController);

app.route("/register", RegisterController);

app.get("/vapidPublicKey", (c) => {
  const key = process.env.VAPID_PUBLIC_KEY;
  if (!key) {
    throw new HTTPException(500, {
      message: "Server lauched without a valid VAPID keys",
    });
  }
  return c.text(key);
});

console.log("Running migrations...");
migrate().then(() => {
  const port = parseInt(process.env.PORT ?? "", 10) || 3000;
  console.log(`Server is running on port ${port}`);

  serve({
    fetch: app.fetch,
    port,
  });
});
