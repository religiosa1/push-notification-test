import { Hono } from "hono";
import z from "zod";
import { zValidator } from "@hono/zod-validator";

import { saveSubscription } from "../repositories/subscriptions";
import { pushSubscriptionJSONSchema } from "../models/pushSubscriptionJSONSchema";

const router = new Hono();

const registerSchema = z.object({
  subscription: pushSubscriptionJSONSchema,
});

router.post("/", zValidator("json", registerSchema), async (c) => {
  const { subscription } = c.req.valid("json");
  await saveSubscription(subscription);
  return c.text("register");
});

export default router;
