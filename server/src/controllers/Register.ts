import { Hono } from "hono";
import z from "zod";

import { saveSubscription } from "../repositories/subscriptions";
import { pushSubscriptionJSONSchema } from "../models/pushSubscriptionJSONSchema";
import { validator } from "hono/validator";
import { clientCors } from "../middleware/clientCors";

const router = new Hono();

const registerSchema = z.object({
  subscription: pushSubscriptionJSONSchema,
});

router.options("/", clientCors);
router.post(
  "/",
  clientCors,
  validator("json", (value, c) => {
    console.log("Register subscription request", value);
    const parsed = registerSchema.safeParse(value);
    if (!parsed.success) {
      console.log("Register request invalid", parsed.error);
      return c.json({ issues: parsed.error.issues }, 422);
    }
    return parsed.data;
  }),
  async (c) => {
    const { subscription } = c.req.valid("json");
    const id = await saveSubscription(subscription);
    console.log("Successfully registered a subscription request", id);
    return c.body(null, 201);
  }
);

export default router;
